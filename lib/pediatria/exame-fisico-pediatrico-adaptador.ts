// Adaptador de achados para Exame Físico Pediátrico
// Extrai achados contextuais do Caso em ordem de prioridade
// Nunca retorna null/undefined - sempre retorna um achado válido

import { Caso } from "@/lib/types";
import { AchadoExamePediatrico, FaixaEtariaPediatrica, inferirFaixaEtaria } from "./exame-fisico-pediatrico-banco";
import { obterNormalidadeClinica, obterNormalidadeRegiao } from "./exame-fisico-pediatrico-normalidades";
import { ACHADOS_FALLBACK_POR_SINDROME } from "./achados-exame-fisico";

// ============================================================================
// VALIDAÇÃO DE COMPATIBILIDADE DE ACHADO COM REGIÃO
// ============================================================================

function validarCompatibilidadeRegiaoAchado(
  regiaoId: string,
  achadoTitulo: string,
  achadoDescricao: string
): boolean {
  const textoCompleto = `${achadoTitulo} ${achadoDescricao}`.toLowerCase();

  // Bloqueios: se região é X, não pode ter achado de sistema Y
  const bloqueios: Record<string, string[]> = {
    abdome: [
      'sopro', 'bulhas', 'precórdio', 'ictus', 'crepitação', 'murmúrio vesicular',
      'sibilos', 'taquipneia', 'ausculta pulmonar', 'ausculta cardiaca'
    ],
    torax_respiratorio: [
      'sopro cardiaco', 'bulhas', 'ictus', 'hepatomegalia', 'ruído hidroaéreo',
      'ausculta abdominal', 'precórdio'
    ],
    precordio_cardiovascular: [
      'ruído hidroaéreo', 'hepatomegalia', 'ausculta abdominal', 'dor abdominal',
      'sibilos', 'crepitações'
    ],
    pele_mucosas: [
      'sopro cardiaco', 'crepitações', 'ruído hidroaéreo', 'ausculta pulmonar'
    ],
    pescoco_linfonodos: [
      'ausculta pulmonar', 'sopro cardiaco', 'ruído hidroaéreo'
    ],
  };

  const bloqueiosRegiao = bloqueios[regiaoId] || [];

  for (const termo of bloqueiosRegiao) {
    if (textoCompleto.includes(termo.toLowerCase())) {
      return false; // Achado não é compatível com a região
    }
  }

  return true; // Achado é compatível com a região
}

// ============================================================================
// PALAVRAS-CHAVE POR REGIÃO
// ============================================================================

const PALAVRAS_CHAVE_REGIAO: Record<string, string[]> = {
  estado_geral: [
    "apática",
    "prostrada",
    "febril",
    "irritada",
    "sonolenta",
    "ativa",
    "reativa",
    "letargia",
    "hiperativo",
  ],
  face_olhos: [
    "palidez",
    "conjuntival",
    "cianose",
    "conjuntivite",
    "olhos fundos",
    "mucosas",
    "desidratação",
    "icterícia",
  ],
  orl_orofaringe: [
    "garganta",
    "orofaringe",
    "amígdalas",
    "amigdala",
    "secreção nasal",
    "congestão",
    "coriza",
    "tosse",
    "koplik",
    "tímpano",
  ],
  pescoco_linfonodos: ["linfonodos", "cervical", "supraclavicular", "rigidez", "linfonodomegalia"],
  torax_respiratorio: [
    "taquipneia",
    "frequência respiratória",
    "tiragem",
    "murmúrio vesicular",
    "mv",
    "sibilos",
    "roncos",
    "crepitações",
    "submacicez",
    "tosse",
    "dispneia",
    "batimento asa nasal",
  ],
  precordio_cardiovascular: [
    "taquicardia",
    "sopro",
    "bulhas",
    "ritmo",
    "precórdio",
    "atrito pericárdico",
    "ictus",
    "cianose",
  ],
  pressao_arterial: ["pressão arterial", "pa ", "manguito", "percentil", "hipertensão"],
  abdome: ["abdome", "dor abdominal", "defesa", "massas", "ruídos", "hidroaéreos"],
  figado: ["fígado", "hepatomegalia", "rebordo costal", "borda hepática"],
  baco: ["baço", "esplenomegalia", "esplênica"],
  pele_mucosas: [
    "exantema",
    "petéquias",
    "equimoses",
    "hematomas",
    "icterícia",
    "palidez",
    "lesões",
    "manchas",
    "turgor",
    "ressecada",
  ],
  membros_perfusao: ["perfusão", "enchimento capilar", "pulsos", "edema", "baqueteamento", "fratura", "laco"],
  desenvolvimento: [
    "desenvolvimento",
    "senta",
    "engatinha",
    "balbucia",
    "pinça",
    "marcha",
    "linguagem",
    "interação",
    "marcos",
  ],
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function detectarNormalidade(texto: string): boolean {
  const textoLower = texto.toLowerCase();

  const indicadoresNormais = [
    "normal",
    "sem alterações",
    "sem sinais",
    "presente bilateralmente sem",
    "sem roncos",
    "sem sibilos",
    "sem aumento",
    "sem aumento significativo",
    "adequado",
    "preservado",
    "simétrico",
    "simétricos",
  ];

  const indicadoresPatologicos = [
    "palidez",
    "cianose",
    "taquipneia",
    "tiragem",
    "sibilo",
    "ronco",
    "crepitação",
    "sopro",
    "hepatomegalia",
    "esplenomegalia",
    "exantema",
    "petéquias",
    "equimoses",
    "febril",
    "febre",
    "prostrada",
    "apática",
    "apatia",
    "letargia",
    "dor",
    "reduzido",
    "aumentado",
    "submacicez",
    "alteração",
    "anormal",
    "comprometido",
  ];

  // Verificar normalidade explícita
  for (const palavra of indicadoresNormais) {
    if (textoLower.includes(palavra.toLowerCase())) {
      return true;
    }
  }

  // Verificar patologia
  for (const palavra of indicadoresPatologicos) {
    if (textoLower.includes(palavra.toLowerCase())) {
      return false;
    }
  }

  // Default: considerar normal
  return true;
}

function extrairValoresDoTexto(texto: any): string {
  if (!texto) return "";
  if (typeof texto === "string") return texto;
  return JSON.stringify(texto).substring(0, 200);
}

// ============================================================================
// EXTRAÇÃO DE ACHADOS
// ============================================================================

function extrairDoInterativo(
  caso: Caso,
  regiaoId: string,
  acaoId: string
): { titulo: string; descricao: string; normal: boolean; origem: string; campo_original: string } | null {
  const interativo = (caso as any).exame_fisico_interativo;
  if (!interativo || typeof interativo !== "object") return null;

  // Procurar por correspondências
  for (const [secao, campos] of Object.entries(interativo)) {
    if (typeof campos !== "object" || campos === null) continue;

    for (const [campo, valor] of Object.entries(campos as any)) {
      const descricaoRaw = extrairValoresDoTexto(valor);
      if (!descricaoRaw) continue;

      // Verificar se o campo corresponde à ação
      if (campo.includes(acaoId) || acaoId.includes(campo)) {
        const titulo = campo.replace(/_/g, " ").toUpperCase();
        return {
          titulo,
          descricao: descricaoRaw,
          normal: detectarNormalidade(descricaoRaw),
          origem: "exame_fisico_interativo",
          campo_original: `exame_fisico_interativo.${secao}.${campo}`,
        };
      }
    }
  }

  return null;
}

function extrairDoCorreto(
  caso: Caso,
  regiaoId: string,
  acaoId: string
): { titulo: string; descricao: string; normal: boolean; origem: string; campo_original: string } | null {
  const exameCorreto = (caso as any).exame_fisico?.correto || (caso as any).exameFisicoCorreto;
  if (!exameCorreto || typeof exameCorreto !== "object") return null;

  // Procurar em campos principais
  for (const [campo, valor] of Object.entries(exameCorreto)) {
    if (Array.isArray(valor) || !valor) continue;

    const texto = extrairValoresDoTexto(valor);
    if (!texto) continue;

    const textoLower = texto.toLowerCase();

    // Verificar se o texto contém palavras-chave da ação ou região
    const palavrasChaveRegiao = PALAVRAS_CHAVE_REGIAO[regiaoId] || [];
    const temPalavraChave = palavrasChaveRegiao.some((palavra) => textoLower.includes(palavra.toLowerCase()));

    if (temPalavraChave || campo.includes(acaoId) || acaoId.includes(campo)) {
      const titulo = campo.replace(/_/g, " ").toUpperCase();

      // VALIDAÇÃO: Garantir que o achado é compatível com a região
      if (!validarCompatibilidadeRegiaoAchado(regiaoId, titulo, texto)) {
        continue; // Skip este achado, procurar próximo
      }

      return {
        titulo,
        descricao: texto,
        normal: detectarNormalidade(texto),
        origem: "exame_fisico_correto",
        campo_original: `exame_fisico.correto.${campo}`,
      };
    }
  }

  return null;
}

function extrairDosAchadosPositivosNegativos(
  caso: Caso,
  regiaoId: string,
  acaoId: string
): { titulo: string; descricao: string; normal: boolean; origem: string; campo_original: string } | null {
  const exameCorreto = (caso as any).exame_fisico?.correto;
  if (!exameCorreto || typeof exameCorreto !== "object") return null;

  // Achados positivos
  if (Array.isArray(exameCorreto.achados_positivos)) {
    for (const achado of exameCorreto.achados_positivos) {
      const achadoStr = String(achado).toLowerCase();
      const acaoIdLower = acaoId.toLowerCase();

      if (achadoStr.includes(acaoIdLower) || acaoIdLower.includes(achadoStr)) {
        const titulo = String(achado);

        // VALIDAÇÃO: Garantir que o achado é compatível com a região
        if (!validarCompatibilidadeRegiaoAchado(regiaoId, titulo, titulo)) {
          continue; // Skip este achado
        }

        return {
          titulo,
          descricao: String(achado),
          normal: false,
          origem: "achados_positivos",
          campo_original: "exame_fisico.correto.achados_positivos",
        };
      }
    }
  }

  // Achados negativos
  if (Array.isArray(exameCorreto.achados_negativos)) {
    for (const achado of exameCorreto.achados_negativos) {
      const achadoStr = String(achado).toLowerCase();
      const acaoIdLower = acaoId.toLowerCase();

      if (achadoStr.includes(acaoIdLower) || acaoIdLower.includes(achadoStr)) {
        const titulo = `Ausência de ${String(achado).toLowerCase()}`;
        const descricao = `Sem ${String(achado).toLowerCase()}`;

        // VALIDAÇÃO: Garantir que o achado é compatível com a região
        if (!validarCompatibilidadeRegiaoAchado(regiaoId, titulo, descricao)) {
          continue; // Skip este achado
        }

        return {
          titulo,
          descricao,
          normal: true,
          origem: "achados_negativos",
          campo_original: "exame_fisico.correto.achados_negativos",
        };
      }
    }
  }

  return null;
}

function extrairDoSinaisVitais(
  caso: Caso,
  regiaoId: string,
  acaoId: string
): { titulo: string; descricao: string; normal: boolean; origem: string; campo_original: string } | null {
  if (regiaoId !== "pressao_arterial") return null;

  const sinaisCorretos = (caso as any).sinais_vitais?.correto || (caso as any).sinaisVitaisCorretos;
  if (!sinaisCorretos || typeof sinaisCorretos !== "object") return null;

  // Buscar PA
  const pa = sinaisCorretos.pressao_arterial || sinaisCorretos.pa || sinaisCorretos.PA;
  if (pa) {
    const descricao = extrairValoresDoTexto(pa);
    return {
      titulo: "Pressão Arterial",
      descricao,
      normal: detectarNormalidade(descricao),
      origem: "sinais_vitais",
      campo_original: "sinais_vitais.correto.pressao_arterial",
    };
  }

  return null;
}

// ============================================================================
// FALLBACKS PADRÃO
// ============================================================================

function extrairNormalidadeClinica(
  regiaoId: string,
  acaoId: string
): { titulo: string; descricao: string; normal: boolean; origem: string; campo_original: string } | null {
  // Camada 6: Buscar normalidade clínica específica por regiaoId + acaoId
  const normalidade = obterNormalidadeClinica(regiaoId, acaoId);

  if (normalidade) {
    return {
      titulo: normalidade.titulo,
      descricao: normalidade.descricao,
      normal: true,
      origem: "normalidade_clinica_especifica",
      campo_original: `NORMALIDADES_EXAME_PEDIATRICO[${regiaoId}][${acaoId}]`,
    };
  }

  // Camada 7: Buscar normalidade geral da região (fallback dentro do banco clínico)
  const normalidadeRegiao = obterNormalidadeRegiao(regiaoId);
  if (normalidadeRegiao) {
    return {
      titulo: normalidadeRegiao.titulo,
      descricao: normalidadeRegiao.descricao,
      normal: true,
      origem: "normalidade_clinica_regiao",
      campo_original: `NORMALIDADES_EXAME_PEDIATRICO[${regiaoId}]`,
    };
  }

  return null;
}

function gerarFallbackNormal(): { titulo: string; descricao: string; normal: boolean; origem: string } {
  return {
    titulo: "Exame sem alteração clínica evidente",
    descricao:
      "Exame realizado sem alteração clínica evidente para a ação selecionada. Recomenda-se interpretar este achado em conjunto com o contexto clínico do caso.",
    normal: true,
    origem: "fallback_generico",
  };
}

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove acentos
    .replace(/\s+/g, ''); // Remove espaços
}

function temNegacao(texto: string): boolean {
  const textoNormalizado = normalizarTexto(texto);
  const negacoes = ['sem', 'ausencia', 'nao', 'não', 'negativo', 'preservado', 'reduzido'];
  return negacoes.some((neg) => textoNormalizado.includes(neg));
}

function obterImagemAchadoId(titulo: string, descricao?: string): string | undefined {
  const textoCompleto = descricao ? `${titulo} ${descricao}` : titulo;
  const textoNormalizado = normalizarTexto(textoCompleto);

  // PRIORIDADE 1: Detectar e BLOQUEAR mapeamentos abdominal/digestivo
  const termosAbdominal = [
    'abdome', 'abdominal', 'abdomen', 'ruidoshidroaereos', 'hidroaereos',
    'peristalse', 'peristaltismo', 'digestivo', 'intestinal', 'rha',
    'auscultar ruidos', 'ausculta abdominal'
  ];

  const ehAbdominal = termosAbdominal.some((termo) =>
    textoNormalizado.includes(normalizarTexto(termo))
  );

  if (ehAbdominal) {
    // Ausculta abdominal não tem imagem mapeada
    return undefined;
  }

  // PRIORIDADE 2: Detectar ausculta respiratória/torácica
  const termosRespiratorio = [
    'torax respiratorio', 'toracico', 'pulmonar', 'pulmoes', 'respiratorio',
    'respiratoria', 'murmuriovesicular', 'sibilos', 'crepitacoes', 'estertores',
    'roncos', 'auscultaanterior', 'auscultaposterior', 'campospulmonares',
    'ausculta pulmonar', 'auscultar campos pulmonares'
  ];

  const ehRespiratorio = termosRespiratorio.some((termo) =>
    textoNormalizado.includes(normalizarTexto(termo))
  );

  if (ehRespiratorio) {
    return 'ausculta-pulmonar';
  }

  // PRIORIDADE 3: Detectar ausculta cardíaca/precordial (com termos específicos)
  const termosCardiaco = [
    'precordio', 'precordial', 'cardiaco', 'cardiaca', 'coracao', 'bulhas',
    'sopro', 'focoaortico', 'focopulmonar', 'focotricuspide', 'focomitral',
    'ictus', 'auscultar precordio', 'ausculta cardiaca', 'foco aortico',
    'foco mitral', 'bulhas cardiaca', 'ritmo cardiaco', 'ritmo regular'
  ];

  const ehCardiaco = termosCardiaco.some((termo) =>
    textoNormalizado.includes(normalizarTexto(termo))
  );

  if (ehCardiaco) {
    return 'ausculta-cardiaca-focos';
  }

  // PRIORIDADE 4: Detectar negações para imagens patológicas
  const temNegacaoExplicita = temNegacao(textoCompleto);

  const imagensClinicamente = {
    cianose: ['cianose', 'cianose-central', 'cianotica'],
    palidez: ['palidez', 'pali', 'hipocorado'],
    exantema: ['exantema', 'rash', 'lesao'],
    petequias: ['petequias', 'petequia', 'sangramento'],
  };

  if (temNegacaoExplicita) {
    for (const [imagem, termos] of Object.entries(imagensClinicamente)) {
      if (termos.some((termo) => textoNormalizado.includes(normalizarTexto(termo)))) {
        return undefined;
      }
    }
  }

  // PRIORIDADE 5: Procurar por achado em síndrome com imagemAchadoId
  for (const sindrome of Object.values(ACHADOS_FALLBACK_POR_SINDROME)) {
    for (const achado of Object.values(sindrome) as any[]) {
      if (
        achado.titulo &&
        achado.imagemAchadoId &&
        normalizarTexto(achado.titulo).includes(textoNormalizado)
      ) {
        return achado.imagemAchadoId;
      }
    }
  }

  return undefined;
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

export function gerarAchadoExamePediatrico(params: {
  caso: Caso;
  regiaoId: string;
  acaoId: string;
}): AchadoExamePediatrico {
  const { caso, regiaoId, acaoId } = params;

  if (!caso || !caso.id) {
    const fallback = gerarFallbackNormal();
    return {
      id: `unknown-${regiaoId}-${acaoId}`,
      casoId: "unknown",
      regiaoId,
      acaoId,
      titulo: fallback.titulo,
      descricao: fallback.descricao,
      normal: fallback.normal,
      origem: fallback.origem as any,
    };
  }

  // Tentar extrair em ordem de prioridade
  let resultado = extrairDoInterativo(caso, regiaoId, acaoId);
  if (resultado) {
    return {
      id: `${caso.id}-${regiaoId}-${acaoId}-int`,
      casoId: caso.id,
      regiaoId,
      acaoId,
      ...resultado,
      origem: resultado.origem as any,
      imagemAchadoId: obterImagemAchadoId(resultado.titulo, resultado.descricao),
    };
  }

  resultado = extrairDoCorreto(caso, regiaoId, acaoId);
  if (resultado) {
    return {
      id: `${caso.id}-${regiaoId}-${acaoId}-cor`,
      casoId: caso.id,
      regiaoId,
      acaoId,
      ...resultado,
      origem: resultado.origem as any,
      imagemAchadoId: obterImagemAchadoId(resultado.titulo, resultado.descricao),
    };
  }

  resultado = extrairDosAchadosPositivosNegativos(caso, regiaoId, acaoId);
  if (resultado) {
    return {
      id: `${caso.id}-${regiaoId}-${acaoId}-ach`,
      casoId: caso.id,
      regiaoId,
      acaoId,
      ...resultado,
      origem: resultado.origem as any,
      imagemAchadoId: obterImagemAchadoId(resultado.titulo, resultado.descricao),
    };
  }

  resultado = extrairDoSinaisVitais(caso, regiaoId, acaoId);
  if (resultado) {
    return {
      id: `${caso.id}-${regiaoId}-${acaoId}-sv`,
      casoId: caso.id,
      regiaoId,
      acaoId,
      ...resultado,
      origem: resultado.origem as any,
      imagemAchadoId: obterImagemAchadoId(resultado.titulo, resultado.descricao),
    };
  }

  // Camada 6-7: Buscar normalidade clínica específica
  resultado = extrairNormalidadeClinica(regiaoId, acaoId);
  if (resultado) {
    return {
      id: `${caso.id}-${regiaoId}-${acaoId}-norm`,
      casoId: caso.id,
      regiaoId,
      acaoId,
      titulo: resultado.titulo,
      descricao: resultado.descricao,
      normal: resultado.normal,
      origem: resultado.origem as any,
      campo_original: resultado.campo_original,
      imagemAchadoId: obterImagemAchadoId(resultado.titulo, resultado.descricao),
    };
  }

  // Fallback final: nunca retornar null/undefined
  const fallback = gerarFallbackNormal();
  return {
    id: `${caso.id}-${regiaoId}-${acaoId}-fb`,
    casoId: caso.id,
    regiaoId,
    acaoId,
    titulo: fallback.titulo,
    descricao: fallback.descricao,
    normal: fallback.normal,
    origem: fallback.origem as any,
    imagemAchadoId: undefined,
  };
}

export function obterFaixaEtariaDoCaso(caso: Caso): FaixaEtariaPediatrica {
  const faixaExplícita = (caso as any).paciente?.dadosPediatricos?.faixaEtaria;
  if (faixaExplícita && ["lactente", "pre_escolar", "escolar"].includes(faixaExplícita)) {
    return faixaExplícita;
  }

  const idade = (caso as any).paciente?.idade;
  if (typeof idade === "number") {
    return inferirFaixaEtaria(idade);
  }

  // Default
  return "pre_escolar";
}
