// ============================================================================
// TEMPLATE — Rubrica específica por diagnóstico
// ----------------------------------------------------------------------------
// COMO USAR:
//   1. Copie este arquivo para <diagnostico>.ts (ex.: asma.ts).
//   2. Preencha as listas de termos clínicos e os critérios/pesos.
//   3. Use os helpers globais de ./competencias-globais sempre que possível
//      (regra: copiar a LÓGICA, não a clínica de outra doença).
//   4. Só registre no index.ts (array RUBRICAS) APÓS validar manualmente
//      (testes "bom" e "incompleto" + checklist do relatório de arquitetura).
//
// NÃO está registrado no index.ts. Não afeta o feedback enquanto não for ativado.
//
// Contrato (igual a pac.ts / sca.ts):
//   - cada card retorna { pontos, pontosMax, acertos, melhorar }
//   - a soma dos pesos dos cards = 20 (2/4/3/2/5/4)
//   - a camada global de consistência (aplicarConsistenciaGlobalCards) cuida de
//     evidências, dedup, "o que faltou" e "como recuperar" — NÃO repetir aqui.
// ============================================================================

import type {
  RubricaDiagnostico,
  ResultadoCardRubrica,
  ContextoAvaliacaoOSCE,
} from "./tipos";
import {
  detectarApresentacaoOuAcolhimento,
  detectarExplicacaoHipoteseAcessivel,
  detectarOrientacaoTratamentoOuReavaliacao,
  detectarSinaisAlarmeOuRetorno,
  detectarSinaisVitaisCompletos,
  detectarExameSistemaPrincipal,
  detectarGravidadeOuInstabilidade,
  detectarExameSolicitadoVisualizadoOuInterpretado,
  detectarInterpretacaoExame,
  detectarHipotesePrincipal,
  detectarDiferenciaisVerbalizados,
  detectarRaciocinioVerbalizado,
  detectarAvaliacaoGravidadeLocalCuidado,
  detectarCondutaEspecifica,
  detectarMedidasSuporte,
  detectarDoseDuracaoPosologia,
} from "./competencias-globais";

const PESOS = {
  comunicacao: 2,
  anamnese: 4,
  exameFisico: 3,
  examesComplementares: 2,
  raciocinioDiagnostico: 5,
  condutaSeguranca: 4,
} as const;

// ─── Termos clínicos da doença (PREENCHER) ──────────────────────────────────
const TERMOS = {
  diagnostico: [] as string[],          // ex.: ["asma", "crise asmatica"]
  hipoteseAcessivel: [] as string[],    // ex.: ["chiado no peito", "bronquios fechados"]
  sintomasPrincipais: [] as string[],   // ex.: ["chiado", "falta de ar", "tosse"]
  sintomasAssociados: [] as string[],
  fatoresRisco: [] as string[],
  exameFisico: [] as string[],          // achados-alvo (ex.: ["sibilos", "expiracao prolongada"])
  examesEssenciais: [] as string[],     // ex.: ["spo2", "pico de fluxo"]
  interpretacaoExame: [] as string[],
  diferenciais: [] as string[],
  gravidade: [] as string[],
  conduta: [] as string[],              // ex.: ["broncodilatador", "salbutamol", "corticoide"]
  medidasSuporte: [] as string[],
};

type R = { pontos: number; acertos: string[]; melhorias: string[] };

function add(cond: boolean, pts: number, acerto: string, melhoria: string, acc: R) {
  if (cond) {
    acc.pontos += pts;
    acc.acertos.push(acerto);
  } else {
    acc.melhorias.push(melhoria);
  }
}

// ─── Avaliadores por card (PREENCHER critérios/pesos somando o peso do card) ──
function avaliarComunicacao(ctx: ContextoAvaliacaoOSCE): R {
  const r: R = { pontos: 0, acertos: [], melhorias: [] };
  add(detectarApresentacaoOuAcolhimento(ctx), 0.5,
    "Apresentou-se ou manteve postura acolhedora.",
    "Apresentar-se e manter postura acolhedora.", r);
  add(detectarExplicacaoHipoteseAcessivel(ctx, TERMOS.hipoteseAcessivel), 0.5,
    "Explicou a hipótese em linguagem acessível.",
    "Explicar a hipótese em linguagem acessível.", r);
  add(detectarOrientacaoTratamentoOuReavaliacao(ctx), 0.5,
    "Orientou tratamento e reavaliação.",
    "Orientar tratamento e reavaliação.", r);
  add(detectarSinaisAlarmeOuRetorno(ctx), 0.5,
    "Orientou sinais de alarme e retorno.",
    "Orientar sinais de alarme e necessidade de retorno.", r);
  return { ...r, pontos: Math.min(PESOS.comunicacao, Math.round(r.pontos * 10) / 10) };
}

function avaliarAnamnese(_ctx: ContextoAvaliacaoOSCE): R {
  // PREENCHER: usar detectarRaciocinioVerbalizado/contarTermos com TERMOS.sintomas*,
  // fatoresRisco, diferenciais — pesos somando PESOS.anamnese (4.0).
  return { pontos: 0, acertos: [], melhorias: ["Implementar critérios de anamnese desta doença."] };
}

function avaliarExameFisico(ctx: ContextoAvaliacaoOSCE): R {
  const r: R = { pontos: 0, acertos: [], melhorias: [] };
  add(detectarSinaisVitaisCompletos(ctx), 0.6,
    "Mediu sinais vitais completos, incluindo SpO₂.",
    "Avaliar sinais vitais completos, incluindo SpO₂.", r);
  add(detectarExameSistemaPrincipal(ctx, TERMOS.exameFisico), 0.9,
    "Realizou o exame físico dirigido do sistema principal.",
    "Realizar o exame físico dirigido do sistema principal.", r);
  // PREENCHER critérios restantes até somar PESOS.exameFisico (3.0).
  return { ...r, pontos: Math.min(PESOS.exameFisico, Math.round(r.pontos * 10) / 10) };
}

function avaliarExamesComplementares(ctx: ContextoAvaliacaoOSCE): R {
  const r: R = { pontos: 0, acertos: [], melhorias: [] };
  add(detectarExameSolicitadoVisualizadoOuInterpretado(ctx, TERMOS.examesEssenciais), 1.0,
    "Solicitou, visualizou ou interpretou os exames essenciais.",
    "Solicitar/avaliar os exames essenciais desta hipótese.", r);
  add(detectarInterpretacaoExame(ctx, TERMOS.interpretacaoExame), 0.5,
    "Interpretou os exames de forma coerente.",
    "Relacionar os exames à hipótese diagnóstica.", r);
  // PREENCHER critérios restantes até somar PESOS.examesComplementares (2.0).
  return { ...r, pontos: Math.min(PESOS.examesComplementares, Math.round(r.pontos * 10) / 10) };
}

function avaliarRaciocinioDiagnostico(ctx: ContextoAvaliacaoOSCE): R {
  const r: R = { pontos: 0, acertos: [], melhorias: [] };
  add(detectarHipotesePrincipal(ctx, TERMOS.diagnostico), 1.2,
    "Reconheceu a hipótese principal.",
    "Reconhecer a hipótese principal diante do quadro.", r);
  add(detectarRaciocinioVerbalizado(ctx, TERMOS.sintomasPrincipais), 0.8,
    "Relacionou os sintomas à hipótese.",
    "Relacionar os sintomas à hipótese.", r);
  const nDif = detectarDiferenciaisVerbalizados(ctx, TERMOS.diferenciais);
  add(nDif >= 1, 0.7,
    "Considerou diagnósticos diferenciais pertinentes.",
    "Considerar diagnósticos diferenciais pertinentes.", r);
  const nGrav = detectarAvaliacaoGravidadeLocalCuidado(ctx, TERMOS.gravidade);
  add(nGrav >= 1, 0.6,
    "Avaliou gravidade/risco e local de cuidado.",
    "Avaliar gravidade/risco e local de tratamento.", r);
  // PREENCHER critérios restantes até somar PESOS.raciocinioDiagnostico (5.0).
  return { ...r, pontos: Math.min(PESOS.raciocinioDiagnostico, Math.round(r.pontos * 10) / 10) };
}

function avaliarCondutaSeguranca(ctx: ContextoAvaliacaoOSCE): R {
  const r: R = { pontos: 0, acertos: [], melhorias: [] };
  add(detectarCondutaEspecifica(ctx, TERMOS.conduta), 2.0,
    "Indicou a conduta específica adequada.",
    "Indicar a conduta específica adequada para o quadro.", r);
  add(detectarMedidasSuporte(ctx, TERMOS.medidasSuporte), 0.5,
    "Indicou medidas de suporte.",
    "Indicar medidas de suporte conforme contexto.", r);
  add(detectarSinaisAlarmeOuRetorno(ctx), 0.5,
    "Orientou sinais de alarme e retorno.",
    "Orientar sinais de alarme e retorno.", r);
  const { dose, duracao } = detectarDoseDuracaoPosologia(ctx);
  add(duracao, 0.5, "Informou a duração do tratamento.", "Informar a duração do tratamento.", r);
  add(dose, 0.5, "Informou dose/posologia.", "Informar dose e posologia.", r);
  return { ...r, pontos: Math.min(PESOS.condutaSeguranca, Math.round(r.pontos * 10) / 10) };
}

function avaliarTemplate(ctx: ContextoAvaliacaoOSCE): ResultadoCardRubrica[] {
  const c = avaliarComunicacao(ctx);
  const a = avaliarAnamnese(ctx);
  const ef = avaliarExameFisico(ctx);
  const ex = avaliarExamesComplementares(ctx);
  const ra = avaliarRaciocinioDiagnostico(ctx);
  const co = avaliarCondutaSeguranca(ctx);
  return [
    { card: "comunicacao", titulo: "Comunicação e postura médica", pontos: c.pontos, pontosMax: PESOS.comunicacao, acertos: c.acertos, melhorar: c.melhorias },
    { card: "anamnese", titulo: "Anamnese dirigida", pontos: a.pontos, pontosMax: PESOS.anamnese, acertos: a.acertos, melhorar: a.melhorias },
    { card: "exameFisico", titulo: "Exame físico", pontos: ef.pontos, pontosMax: PESOS.exameFisico, acertos: ef.acertos, melhorar: ef.melhorias },
    { card: "examesComplementares", titulo: "Exames complementares", pontos: ex.pontos, pontosMax: PESOS.examesComplementares, acertos: ex.acertos, melhorar: ex.melhorias },
    { card: "raciocinioDiagnostico", titulo: "Raciocínio diagnóstico", pontos: ra.pontos, pontosMax: PESOS.raciocinioDiagnostico, acertos: ra.acertos, melhorar: ra.melhorias },
    { card: "condutaSeguranca", titulo: "Conduta e Segurança", pontos: co.pontos, pontosMax: PESOS.condutaSeguranca, acertos: co.acertos, melhorar: co.melhorias },
  ];
}

// NÃO registrar no index.ts até validar.
export const RUBRICA_TEMPLATE: RubricaDiagnostico = {
  diagnosticoId: "_template",
  nomesAceitos: [], // preencher com TERMOS.diagnostico ao ativar
  casoIds: [],
  avaliar: avaliarTemplate,
};
