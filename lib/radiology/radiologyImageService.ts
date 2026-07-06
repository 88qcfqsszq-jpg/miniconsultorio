/**
 * Serviço de Radiologia - Orquestrador Principal
 *
 * Este é o serviço central do módulo "Análise de Imagem".
 * Ele orquestra todo o fluxo:
 *
 * 1. Detectar necessidade de imagem no caso clínico
 * 2. Normalizar diagnóstico clínico → rótulo NIH
 * 3. Buscar imagem (provider NIH ou fixture local)
 * 4. Tratar erro controlado se não encontrado
 * 5. Preparar para validação de coerência
 * 6. Preparar para geração de gabarito
 * 7. Preparar para correção da resposta do aluno
 *
 * REGRA IMPORTANTE:
 * - Nunca usar fixture silenciosamente em produção
 * - Modo desenvolvimento explícito com variável de ambiente
 * - Fixture retorna erro quando NIH é necessário em produção
 */

import type {
  ResultadoDeteccaoImagem,
  ResultadoBuscaImagem,
  ResultadoValidacaoImagem,
  GabaritoRadiologico,
  RespostaAlunoImagem,
  FeedbackImagemRadiologica,
  ParametrosBuscaImagem,
  ImagemRadiologica,
  ErroProviderNIH,
} from "./types";

import { normalizarDiagnosticoParaNIH } from "./labelMapping";
import { nihProvider } from "./providers/nihProvider";
import { openiProvider } from "./providers/openiCloudProvider";
import {
  obterFixtureAleatoria,
  AVISO_FIXTURE,
} from "./fixtures/sampleImages";

// ============================================================================
// TIPO: CASO CLÍNICO (Para tipagem interna)
// ============================================================================

/**
 * Estrutura simplificada do Caso para este serviço
 * Reflete apenas os campos necessários para radiologia
 */
export interface CasoClinicoParcial {
  id: string;
  paciente: {
    idade: number;
    sexo: string;
  };
  dados_visiveis_ao_estudante: {
    queixa_principal: string;
    historia_breve: string;
  };
  dados_ocultos_do_sistema: {
    diagnostico_principal: string;
    diagnosticos_diferenciais?: string[];
  };
}

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

/**
 * Configuração do serviço radiológico
 */
interface ConfigRadiologyService {
  usarFixtureEmDesenvolvimento: boolean;
  permitirFixtureEmProducao: boolean;
  tentativasMaximasBusca: number;
  logEnabled: boolean;
}

const CONFIG: ConfigRadiologyService = {
  usarFixtureEmDesenvolvimento:
    process.env.NIH_USE_FIXTURES_LOCALLY === "true" &&
    process.env.NODE_ENV === "development",
  permitirFixtureEmProducao: false, // NUNCA usar fixture em produção
  tentativasMaximasBusca: 3,
  logEnabled: process.env.DEBUG_RADIOLOGY === "true",
};

/**
 * Log interno (apenas se DEBUG_RADIOLOGY=true)
 */
function logRadiology(mensagem: string, dados?: any) {
  if (CONFIG.logEnabled) {
    console.log(`[Radiology Service] ${mensagem}`, dados || "");
  }
}

// ============================================================================
// FASE 1: DETECTAR NECESSIDADE DE IMAGEM
// ============================================================================

/**
 * Detecta se um caso clínico precisa de imagem radiológica
 *
 * Critérios:
 * - Diagnóstico clínico que sugira RX de tórax
 * - Sistema respiratório ou cardiovascular
 * - Palavras-chave que indicam necessidade de imagem
 *
 * @param casoClinico Caso clínico do estudante
 * @returns Resultado da detecção
 */
export async function detectarNecessidadeImagem(
  casoClinico: CasoClinicoParcial
): Promise<ResultadoDeteccaoImagem> {
  logRadiology("Detectando necessidade de imagem para caso:", casoClinico.id);

  const diagnostico = casoClinico.dados_ocultos_do_sistema.diagnostico_principal
    .toLowerCase()
    .trim();

  // Palavras-chave que indicam necessidade de RX de tórax
  const palavrasChaveRXTorax = [
    "pneumonia",
    "pneumotórax",
    "derrame",
    "efusão",
    "cardiomegalia",
    "insuficiência cardíaca",
    "edema pulmonar",
    "bronquite",
    "tuberculose",
    "asma",
    "doença pulmonar",
    "infecção respiratória",
    "tosse",
    "dispneia",
    "falta de ar",
    "infarto",
    "angina",
    "arritmia",
    "miocardite",
    "pericardite",
    "fibrose",
    "enfisema",
    "nódulo",
    "massa pulmonar",
    "atelectasia",
    "consolidação",
  ];

  const precisaImagem = palavrasChaveRXTorax.some((palavra) =>
    diagnostico.includes(palavra)
  );

  if (!precisaImagem) {
    logRadiology("Caso não requer imagem radiológica");
    return {
      precisaImagem: false,
      confianca: "alta",
      justificativa: "Diagnóstico não indica necessidade de RX de tórax",
    };
  }

  logRadiology("Caso requer imagem radiológica");

  // Normalizar diagnóstico para rótulo NIH
  const mapeamento = normalizarDiagnosticoParaNIH(diagnostico);

  return {
    precisaImagem: true,
    confianca: mapeamento.confiancaMapeamento,
    justificativa: `Diagnóstico sugere RX de tórax. Mapeado para: ${mapeamento.labelNIH}`,
    modalidade: "RX",
    regiao: "torax",
    diagnosticoEsperado: diagnostico,
    achadoEsperado: mapeamento.labelNIH,
    labelNIHSugerido: mapeamento.labelNIH,
  };
}

// ============================================================================
// FASE 2: BUSCAR IMAGEM
// ============================================================================

/**
 * Busca imagem radiológica para o caso clínico
 *
 * Fluxo:
 * 1. Se modo fixture explícito em dev: usar fixture
 * 2. Chamar provider NIH
 * 3. Se NIH falhar e dev mode: tentar fixture como fallback
 * 4. Se em produção e NIH falhar: retornar erro
 *
 * @param casoClinico Caso clínico
 * @param labelNIH Rótulo NIH normalizado
 * @returns Resultado com imagem ou erro
 */
export async function buscarImagemRadiologica(
  casoClinico: CasoClinicoParcial,
  labelNIH: string
): Promise<ResultadoBuscaImagem> {
  logRadiology("Buscando imagem para:", { casoId: casoClinico.id, labelNIH });

  const parametros: ParametrosBuscaImagem = {
    labelNIH: labelNIH as any, // Tipos já foram validados em detectar
    modalidade: "RX",
    regiao: "torax",
    faixaEtaria: obterFaixaEtariaAproximada(casoClinico.paciente.idade),
  };

  // ⚠️ BLOQUEIO CRÍTICO: NUNCA usar fixture em produção
  if (process.env.NODE_ENV === "production") {
    logRadiology("⛔ PRODUÇÃO: Fixtures completamente bloqueadas");
    // Pular toda lógica de fixture e ir direto para providers reais
  } else {
    // 1. Se modo fixture explícito em dev: usar fixture primeiro
    if (CONFIG.usarFixtureEmDesenvolvimento) {
      logRadiology("Modo desenvolvimento: tentando fixture local");

      const fixture = obterFixtureAleatoria(labelNIH);

      if (fixture) {
        logRadiology("✅ Fixture encontrada para:", labelNIH);

        // Avisar que é fixture
        if (typeof window === "undefined") {
          // Backend
          console.warn("[Radiology] Usando fixture local em desenvolvimento");
        }

        return {
          sucesso: true,
          imagem: fixture,
        };
      }

      logRadiology("⚠️ Fixture não encontrada para:", labelNIH);
    }
  }

  // 2. Tentar Open-i PRIMEIRO (API pública, sem autenticação)
  logRadiology("Tentando Open-i / Indiana University (API pública)");
  const resultadoOpenI = await openiProvider.buscarImagemOpenI(parametros);

  if (resultadoOpenI.sucesso && resultadoOpenI.imagem) {
    logRadiology("✅ Imagem encontrada no Open-i");
    return resultadoOpenI;
  }

  logRadiology("Open-i não encontrou imagem, tentando NIH");

  // 3. Chamar provider NIH (requer autenticação/configuração)
  logRadiology("Chamando provider NIH");
  const resultadoNIH = await nihProvider.buscarImagemNIH(parametros);

  // Verificar se é erro do provider
  if ("requerConfiguracao" in resultadoNIH && resultadoNIH.requerConfiguracao) {
    // NIH não está configurado

    // ⚠️ BLOQUEIO CRÍTICO: NUNCA usar fixture em produção, mesmo como fallback
    if (process.env.NODE_ENV === "production") {
      logRadiology("⛔ PRODUÇÃO: Fallback para fixture BLOQUEADO");
      return {
        sucesso: false,
        motivo: "Imagem radiológica indisponível para este caso.",
      };
    }

    // 3. Se dev: tentar fixture como fallback
    if (process.env.NODE_ENV === "development") {
      logRadiology("NIH não configurado, tentando fixture como fallback");

      const fixture = obterFixtureAleatoria(labelNIH);
      if (fixture) {
        console.warn(AVISO_FIXTURE);
        return {
          sucesso: true,
          imagem: fixture,
        };
      }
    }

    // 4. Se produção ou sem fixture: retornar erro
    logRadiology("❌ Nenhuma imagem disponível");

    return {
      sucesso: false,
      motivo: "Imagem radiológica indisponível para este caso.",
    };
  }

  // Se sucesso do NIH
  if (resultadoNIH.sucesso && resultadoNIH.imagem) {
    logRadiology("✅ Imagem encontrada no NIH");
    return resultadoNIH;
  }

  // Erro do NIH em buscar
  logRadiology("❌ Erro ao buscar no NIH:", resultadoNIH.motivo);

  return {
    sucesso: false,
    motivo: resultadoNIH.motivo || "Erro ao buscar imagem radiológica",
  };
}

// ============================================================================
// FASE 3: VALIDAR COERÊNCIA (Preparação para OpenAI)
// ============================================================================

/**
 * Prepara parâmetros para validação de coerência com OpenAI
 *
 * OpenAI validará:
 * - Caso e imagem são compatíveis?
 * - Imagem representa o achado esperado?
 * - Pode ser exibida ao aluno?
 *
 * Esta função retorna apenas os dados estruturados.
 * A chamada real a OpenAI será feita no endpoint /api/radiology/validar-coerencia
 *
 * @param casoClinico Caso clínico
 * @param imagem Imagem selecionada
 * @returns Dados para validação OpenAI
 */
export function prepararValidacaoCoerencia(
  casoClinico: CasoClinicoParcial,
  imagem: ImagemRadiologica
): {
  diagnosticoClinico: string;
  imagemAchadoPrincipal: string;
  imagemLabels: string[];
  idade: number;
  sistemaPrincipal: string;
  prompt: string;
} {
  const diagnosticoClinico =
    casoClinico.dados_ocultos_do_sistema.diagnostico_principal;
  const sistemaPrincipal = identificarSistemaPrincipal(diagnosticoClinico);

  const prompt = `
Valide se a imagem radiológica é coerente com o caso clínico.

CASO CLÍNICO:
- Diagnóstico: ${diagnosticoClinico}
- Idade do paciente: ${casoClinico.paciente.idade} anos
- Sistema envolvido: ${sistemaPrincipal}

IMAGEM:
- Achado principal: ${imagem.achadoPrincipal}
- Labels: ${imagem.labels.join(", ")}
- Integração real: ${imagem.integracaoReal ? "Sim (NIH)" : "Não (fixture local)"}

PERGUNTAS:
1. A imagem é coerente com o diagnóstico?
2. O achado na imagem corresponde ao esperado?
3. É apropriado exibir esta imagem ao aluno?

Responda SEMPRE em JSON com este formato exato:
{
  "coerente": boolean,
  "confianca": "baixa" | "media" | "alta",
  "motivo": "explicação breve",
  "achadoEsperado": "o que espera encontrar",
  "achadoEncontrado": "o que foi encontrado",
  "compatibilidadeClinica": "por quê correlaciona com o caso",
  "compatibilidadeRadiologica": "por quê a imagem representa bem",
  "podeExibirAoAluno": boolean
}
`;

  return {
    diagnosticoClinico,
    imagemAchadoPrincipal: imagem.achadoPrincipal,
    imagemLabels: imagem.labels,
    idade: casoClinico.paciente.idade,
    sistemaPrincipal,
    prompt,
  };
}

// ============================================================================
// FASE 4: GERAR GABARITO (Preparação para OpenAI)
// ============================================================================

/**
 * Prepara dados para geração de gabarito com OpenAI
 *
 * OpenAI gerará:
 * - Descrição esperada da interpretação
 * - Diagnóstico radiológico
 * - Correlação clínica
 * - Pegadinhas comuns
 * - Rubrica de avaliação
 *
 * @param casoClinico Caso clínico
 * @param imagem Imagem selecionada
 * @returns Dados para geração de gabarito
 */
export function prepararGeracaoGabarito(
  casoClinico: CasoClinicoParcial,
  imagem: ImagemRadiologica
): {
  diagnosticoClinico: string;
  imagemAchadoPrincipal: string;
  queixaPrincipal: string;
  idade: number;
  prompt: string;
} {
  const diagnosticoClinico =
    casoClinico.dados_ocultos_do_sistema.diagnostico_principal;
  const queixaPrincipal = casoClinico.dados_visiveis_ao_estudante.queixa_principal;
  const idade = casoClinico.paciente.idade;

  const prompt = `
Gere um gabarito educacional para interpretação radiológica.

CONTEXTO CLÍNICO:
- Diagnóstico esperado: ${diagnosticoClinico}
- Queixa principal: ${queixaPrincipal}
- Idade: ${idade} anos

IMAGEM RADIOLÓGICA:
- Achado principal: ${imagem.achadoPrincipal}
- Labels identificados: ${imagem.labels.join(", ")}

GABARITO ESPERADO:
Gere interpretação esperada da imagem que:
1. Descreva o achado principal visível
2. Identifique o diagnóstico radiológico correspondente
3. Estabeleça correlação clínica com o caso
4. Indique achados secundários ou normais
5. Liste pegadinhas comuns que o aluno poderia cometer
6. Sugira nível de dificuldade da questão

Responda SEMPRE em JSON com este formato exato:
{
  "descricaoEsperada": "descrição detalhada do que o aluno deveria descrever",
  "diagnosticoRadiologico": "diagnóstico esperado da imagem",
  "correlacaoClinica": "como a imagem correlaciona com o caso clínico",
  "principaisAchados": ["achado1", "achado2", "achado3"],
  "achadosSecundarios": ["secundario1", "secundario2"],
  "pegadinhas": ["pegadinha1", "pegadinha2"],
  "nivelDificuldade": "facil" | "medio" | "dificil"
}
`;

  return {
    diagnosticoClinico,
    imagemAchadoPrincipal: imagem.achadoPrincipal,
    queixaPrincipal,
    idade,
    prompt,
  };
}

// ============================================================================
// FASE 5: CORRIGIR RESPOSTA DO ALUNO (Preparação para OpenAI)
// ============================================================================

/**
 * Prepara dados para correção de resposta do aluno com OpenAI
 *
 * OpenAI avaliará:
 * - Se o aluno descreveu corretamente o exame
 * - Se identificou o achado principal
 * - Se sugeriu o diagnóstico correto
 * - Feedback e sugestões de melhoria
 *
 * @param respostaAluno Resposta do aluno
 * @param casoClinico Caso clínico
 * @param imagem Imagem analisada
 * @param gabarito Gabarito correto
 * @returns Dados para correção OpenAI
 */
export function prepararCorrecaoResposta(
  respostaAluno: RespostaAlunoImagem,
  casoClinico: CasoClinicoParcial,
  imagem: ImagemRadiologica,
  gabarito: GabaritoRadiologico
): {
  respostaAluno: string;
  gabaritoEsperado: string;
  diagnosticoClinico: string;
  prompt: string;
} {
  const diagnosticoClinico =
    casoClinico.dados_ocultos_do_sistema.diagnostico_principal;

  const respostaAlunoTexto = `
Descrição do exame: ${respostaAluno.descricaoExame}
Achado principal identificado: ${respostaAluno.achadoPrincipal}
Hipótese diagnóstica: ${respostaAluno.hipoteseDiagnostica}
`;

  const gabaritoEsperadoTexto = `
Descrição esperada: ${gabarito.descricaoEsperada}
Diagnóstico radiológico: ${gabarito.diagnosticoRadiologico}
Correlação clínica: ${gabarito.correlacaoClinica}
Achados principais: ${gabarito.principaisAchados.join(", ")}
`;

  const prompt = `
Avalie a interpretação radiológica do aluno.

RESPOSTA DO ALUNO:
${respostaAlunoTexto}

RESPOSTA ESPERADA (GABARITO):
${gabaritoEsperadoTexto}

CONTEXTO:
- Diagnóstico clínico esperado: ${diagnosticoClinico}
- Idade do paciente: ${casoClinico.paciente.idade} anos
- Nível de dificuldade: ${gabarito.nivelDificuldade}

AVALIAÇÃO:
Avalie a resposta do aluno usando esta rubrica:
1. Reconheceu corretamente que é RX de tórax? (0-1 ponto)
2. Descreveu qualidade/projeção quando relevante? (0-1 ponto)
3. Reconheceu normalidade ou alteração? (0-2 pontos)
4. Localizou corretamente o achado? (0-2 pontos)
5. Descreveu com linguagem médica apropriada? (0-2 pontos)
6. Correlacionou com o caso clínico? (0-1 ponto)
7. Sugeriu diagnóstico compatível? (0-1 ponto)
8. Não inventou achados? (0-0.5 ponto)
Total: 10 pontos

Responda SEMPRE em JSON com este formato exato:
{
  "nota": 0-10,
  "confiancaAvaliacao": "baixa" | "media" | "alta",
  "pontosFortes": ["ponto1", "ponto2"],
  "erros": ["erro1", "erro2"],
  "feedback": "feedback educacional detalhado",
  "respostaModelo": "resposta ideal esperada do aluno",
  "rubricaDetalhada": [
    {"criterio": "reconhecimento", "peso": 1, "pontosObtidos": 1, "maximos": 1, "observacao": "..."},
    ...
  ],
  "sugestoesEstudo": ["sugestao1", "sugestao2"]
}
`;

  return {
    respostaAluno: respostaAlunoTexto,
    gabaritoEsperado: gabaritoEsperadoTexto,
    diagnosticoClinico,
    prompt,
  };
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Identifica aproximadamente a faixa etária do paciente
 */
function obterFaixaEtariaAproximada(idade: number): string {
  if (idade < 2) return "lactente";
  if (idade < 6) return "pre_escolar";
  if (idade < 12) return "escolar";
  return "adolescente";
}

/**
 * Identifica o sistema fisiológico principal envolvido no diagnóstico
 */
function identificarSistemaPrincipal(diagnostico: string): string {
  const diagnosticoLower = diagnostico.toLowerCase();

  if (
    diagnosticoLower.includes("pneumonia") ||
    diagnosticoLower.includes("bronquite") ||
    diagnosticoLower.includes("tuberculose") ||
    diagnosticoLower.includes("asma") ||
    diagnosticoLower.includes("enfisema")
  ) {
    return "Respiratório";
  }

  if (
    diagnosticoLower.includes("coração") ||
    diagnosticoLower.includes("cardíaco") ||
    diagnosticoLower.includes("infarto") ||
    diagnosticoLower.includes("arritmia") ||
    diagnosticoLower.includes("insuficiência cardíaca")
  ) {
    return "Cardiovascular";
  }

  if (
    diagnosticoLower.includes("derrame") ||
    diagnosticoLower.includes("efusão") ||
    diagnosticoLower.includes("pneumotórax")
  ) {
    return "Pleural/Pneumotórax";
  }

  return "Torácico geral";
}

// ============================================================================
// INTERFACE PÚBLICA DO SERVIÇO
// ============================================================================

export const radiologyImageService = {
  detectarNecessidadeImagem,
  buscarImagemRadiologica,
  prepararValidacaoCoerencia,
  prepararGeracaoGabarito,
  prepararCorrecaoResposta,
};

export type RadiologyImageService = typeof radiologyImageService;
