// ============================================================================
// Rubrica modular — PAC (Pneumonia Adquirida na Comunidade)
// ----------------------------------------------------------------------------
// Reaproveita as funções PAC já APROVADAS em feedback-consistency.ts (mesmos
// pesos/termos), apenas empacotando-as no formato modular. Zero regressão.
// Pesos: Anamnese 4 · Exames 2 · Raciocínio 5 · Conduta 4.
// Comunicação e Exame físico não são cobertos (mantêm o fluxo atual).
// ============================================================================

import type { RubricaDiagnostico, ResultadoCardRubrica, ContextoAvaliacaoOSCE } from "./tipos";
import {
  avaliarAnamnesePAC,
  avaliarExamesPAC,
  avaliarRaciocinioPAC,
  avaliarCondutaPAC,
} from "../feedback-consistency";
import {
  normalizarTexto,
  contemAlgum,
  contarTermos,
  detectarSinaisVitaisCompletos,
  detectarOrientacaoSinaisAlarmeRespiratorio,
} from "./utils-deteccao";

type R = { pontos: number; acertos: string[]; melhorias: string[] };

// Comunicação PAC — total 2.0 (0.5 por item)
function avaliarComunicacaoPAC(ctx: ContextoAvaliacaoOSCE): R {
  const t = normalizarTexto(`${ctx.anamneseTexto ?? ""} ${ctx.correlacaoTexto ?? ""} ${ctx.condutaTexto ?? ""}`);
  const acertos: string[] = [];
  const melhorias: string[] = [];
  let p = 0;

  if (contemAlgum(t, ["bom dia", "boa tarde", "boa noite", "sou o", "sou a", "dr ", "dra ", "meu nome", "vou te atender", "vou atender", "como voce esta", "como se sente", "prazer"])) {
    p += 0.5;
    acertos.push("Apresentou-se ou manteve postura acolhedora com o paciente.");
  } else {
    melhorias.push("Apresentar-se e manter postura acolhedora ao iniciar o atendimento.");
  }

  // Explicou a hipótese (infecção pulmonar / pneumonia) em linguagem acessível.
  // Aceita variações diretas OU combinações próximas (bacteriana+pulmão, infeccioso+pulmão,
  // pneumonia+febre/tosse/raio-x/leucograma).
  const explicouHipotese =
    contemAlgum(t, [
      "pneumonia", "pneumonia bacteriana",
      "infeccao pulmonar", "infeccao no pulmao",
      "infeccao bacteriana pulmonar", "infeccao bacteriana no pulmao",
      "processo infeccioso pulmonar", "processo infeccioso no pulmao",
      "bacteria no pulmao", "inflamacao no pulmao", "inflamacao pulmonar",
    ]) ||
    (/bacterian/.test(t) && /pulmao|pulmonar/.test(t)) ||
    (/infec(c|ç)|infeccios/.test(t) && /pulmao|pulmonar/.test(t)) ||
    (/pneumonia/.test(t) && /febre|tosse|raio.?x|leucograma|opacidade/.test(t));
  if (explicouHipotese) {
    p += 0.5;
    acertos.push("Explicou a suspeita de infecção pulmonar/pneumonia em linguagem acessível.");
  } else {
    melhorias.push("Explicar a hipótese de infecção pulmonar em linguagem acessível.");
  }

  if (contemAlgum(t, ["antibiotic", "amoxicilina", "tratamento", "vamos tratar", "retorno", "reavalia", "voltar", "acompanhamento"])) {
    p += 0.5;
    acertos.push("Orientou tratamento e reavaliação.");
  } else {
    melhorias.push("Orientar o tratamento proposto e a necessidade de reavaliação.");
  }

  if (detectarOrientacaoSinaisAlarmeRespiratorio(ctx)) {
    p += 0.5;
    acertos.push("Orientou sinais de gravidade respiratória e necessidade de procurar atendimento se piora.");
  } else {
    melhorias.push("Orientar sinais de alarme respiratório (piora da falta de ar, febre persistente, escarro com sangue) e procurar atendimento se agravar.");
  }

  return { pontos: Math.min(2, Math.round(p * 10) / 10), acertos, melhorias };
}

// Exame físico PAC — total 3.0
function avaliarExameFisicoPAC(ctx: ContextoAvaliacaoOSCE): R {
  const t = normalizarTexto(`${ctx.achadosTexto ?? ""} ${ctx.correlacaoTexto ?? ""}`);
  const acertos: string[] = [];
  const melhorias: string[] = [];

  // 1. Sinais vitais completos com SpO₂ (0.6)
  const c1 = detectarSinaisVitaisCompletos(ctx);
  // 2. Avaliação geral/gravidade respiratória (0.5) — pelo menos 2 itens
  const c2 = contarTermos(t, ["estado geral", "nivel de consciencia", "consciencia", "orientad", "padrao respiratorio", "taquipneia", "esforco respiratorio", "musculatura acessoria", "tiragens", "cianose", "perfusao", "hidratacao", "coloracao"]) >= 2;
  // 3. Ausculta pulmonar anterior e/ou posterior (0.7 cheio se ambos)
  const auscAnt = contemAlgum(t, ["ausculta anterior", "auscultar torax anterior", "torax anterior", "campos anteriores", "ausculta cardiaca"]) || contemAlgum(t, ["auscultar campos pulmonares"]);
  const auscPost = contemAlgum(t, ["ausculta posterior", "auscultar torax posterior", "torax posterior", "campos posteriores", "bases posteriores"]);
  const auscQualquer = auscAnt || auscPost || contemAlgum(t, ["ausculta pulmonar", "murmurio", "auscultar"]);
  // 4. Achados de consolidação (0.6)
  const c4 = contemAlgum(t, ["crepita", "estertor", "murmurio reduzido", "reducao de murmurio", "murmurio vesicular reduzido", "sopro tubario", "base direita", "base esquerda", "lobo", "hemitorax"]);
  // 5. Manobras complementares (0.4)
  const c5 = contemAlgum(t, ["expansibilidade", "fremito", "percussao", "macicez"]);
  // 6. Perfusão/hidratação/estado global (0.2)
  const c6 = contemAlgum(t, ["perfusao", "hidratacao", "enchimento capilar", "extremidades", "estado geral"]);

  let p = 0;
  if (c1) { p += 0.6; acertos.push("Mediu sinais vitais completos, incluindo SpO₂."); }
  else melhorias.push("Avaliar sinais vitais completos, incluindo SpO₂.");

  if (c2) { p += 0.5; acertos.push("Avaliou padrão respiratório, esforço ventilatório e estado geral."); }
  else melhorias.push("Completar avaliação respiratória com esforço ventilatório, tiragens, cianose ou fala entrecortada.");

  if (auscAnt && auscPost) { p += 0.7; acertos.push("Realizou ausculta pulmonar anterior e posterior."); }
  else if (auscQualquer) { p += 0.5; acertos.push("Realizou ausculta pulmonar."); melhorias.push("Auscultar tórax anterior e posterior."); }
  else melhorias.push("Auscultar tórax anterior e posterior.");

  if (c4) { p += 0.6; acertos.push("Pesquisou sinais de consolidação (crepitações, redução de murmúrio ou achado localizado)."); }
  else melhorias.push("Pesquisar sinais de consolidação: crepitações, murmúrio reduzido ou sopro tubário.");

  if (c5) { p += 0.4; acertos.push("Realizou manobras complementares (expansibilidade, frêmito ou percussão)."); }
  else melhorias.push("Realizar manobras complementares como expansibilidade, frêmito toracovocal ou percussão.");

  if (c6) { p += 0.2; acertos.push("Avaliou perfusão, hidratação ou estado clínico global."); }

  // Fechamento: critérios 1-5 cumpridos garantem exame físico direcionado completo (3/3)
  if (c1 && c2 && (auscAnt && auscPost) && c4 && c5) {
    p = 3.0;
  }

  return { pontos: Math.min(3, Math.round(p * 10) / 10), acertos, melhorias };
}

function avaliarPAC(ctx: ContextoAvaliacaoOSCE): ResultadoCardRubrica[] {
  const comunicacao = avaliarComunicacaoPAC(ctx);
  const exameFisico = avaliarExameFisicoPAC(ctx);
  const anamnese = avaliarAnamnesePAC(ctx);
  const exames = avaliarExamesPAC(ctx);
  const raciocinio = avaliarRaciocinioPAC(ctx);
  const conduta = avaliarCondutaPAC(ctx.condutaTexto);

  return [
    {
      card: "comunicacao",
      titulo: "Comunicação e postura médica",
      pontos: comunicacao.pontos,
      pontosMax: 2,
      acertos: comunicacao.acertos,
      melhorar: comunicacao.melhorias,
    },
    {
      card: "exameFisico",
      titulo: "Exame físico",
      pontos: exameFisico.pontos,
      pontosMax: 3,
      acertos: exameFisico.acertos,
      melhorar: exameFisico.melhorias,
    },
    {
      card: "anamnese",
      titulo: "Anamnese dirigida",
      pontos: anamnese.pontos,
      pontosMax: 4,
      acertos: anamnese.acertos,
      melhorar: anamnese.melhorias,
    },
    {
      card: "examesComplementares",
      titulo: "Exames complementares",
      pontos: exames.pontos,
      pontosMax: 2,
      acertos: exames.acertos,
      melhorar: exames.melhorias,
    },
    {
      card: "raciocinioDiagnostico",
      titulo: "Raciocínio diagnóstico",
      pontos: raciocinio.pontos,
      pontosMax: 5,
      acertos: raciocinio.acertos,
      melhorar: raciocinio.melhorias,
    },
    {
      card: "condutaSeguranca",
      titulo: "Conduta e Segurança",
      pontos: conduta.pontos,
      pontosMax: 4,
      acertos: conduta.acertos,
      melhorar: conduta.melhorias,
    },
  ];
}

export const RUBRICA_PAC: RubricaDiagnostico = {
  diagnosticoId: "pac",
  nomesAceitos: [
    "pac",
    "pneumonia",
    "pneumonia adquirida na comunidade",
    "infeccao pulmonar",
    "infeccao no pulmao",
  ],
  casoIds: [2],
  avaliar: avaliarPAC,
};
