// ============================================================================
// Rubrica modular — SCA (Síndrome Coronariana Aguda / Dor Torácica)
// ----------------------------------------------------------------------------
// Pesos: Anamnese 4 · Exame físico 3 · Exames 2 · Raciocínio 5 · Conduta 4.
// Comunicação mantém a lógica global (não coberta aqui).
// ============================================================================

import type {
  RubricaDiagnostico,
  ResultadoCardRubrica,
  ContextoAvaliacaoOSCE,
} from "./tipos";
import {
  normalizarTexto,
  contemAlgum,
  contarTermos,
  detectarSinaisVitaisCompletos,
  detectarECG,
  detectarTroponina,
  detectarAAS,
  detectarNitrato,
  detectarAnticoagulacaoSCA,
  detectarEmergenciaEncaminhamento,
  detectarOxigenioSeHipoxemia,
  detectarRXTorax,
} from "./utils-deteccao";
import {
  detectarApresentacaoOuAcolhimento,
  detectarOrientacaoTratamentoOuReavaliacao,
  detectarSinaisAlarmeOuRetorno,
} from "./competencias-globais";

type R = { pontos: number; acertos: string[]; melhorar: string[] };

const DIFERENCIAIS_DOR_TORACICA = [
  "tep", "embolia pulmonar", "disseccao de aorta", "dissecao de aorta",
  "pericardite", "pneumotorax", "refluxo", "doenca esofagica", "dor muscular",
  "musculoesqueletic", "ansiedade", "pneumonia",
];

const FATORES_RISCO_CV = [
  "hipertensao", "has", "diabetes", "\bdm\b", "tabagismo", "fuma", "colesterol",
  "dislipidemia", "obesidade", "sedentarismo", "historia familiar", "infarto previo",
  "dac", "avc", "doenca renal", "idade", "menopausa",
];

// --------------------------------------------------------------------------
// Comunicação SCA — total 2.0 (usa a camada global por competência)
function avaliarComunicacaoSCA(ctx: ContextoAvaliacaoOSCE): R {
  const t = normalizarTexto(`${ctx.anamneseTexto ?? ""} ${ctx.correlacaoTexto ?? ""} ${ctx.condutaTexto ?? ""}`);
  const acertos: string[] = [];
  const melhorar: string[] = [];
  let p = 0;

  if (detectarApresentacaoOuAcolhimento(ctx)) {
    p += 0.5; acertos.push("Apresentou-se ou manteve postura acolhedora com o paciente.");
  } else melhorar.push("Apresentar-se e manter postura acolhedora ao iniciar o atendimento.");

  // Explicou suspeita cardíaca / risco de infarto em linguagem acessível
  if (contemAlgum(t, ["infarto", "problema no coracao", "problema cardiaco", "do coracao", "cardiaco", "isquemia", "angina", "sca", "entupimento", "circulacao do coracao", "vaso do coracao"])) {
    p += 0.5; acertos.push("Explicou a suspeita cardíaca/risco de infarto em linguagem acessível.");
  } else melhorar.push("Explicar a suspeita cardíaca/risco de infarto em linguagem acessível.");

  // Orientou necessidade de avaliação urgente / monitorização
  if (detectarOrientacaoTratamentoOuReavaliacao(ctx) || contemAlgum(t, ["urgente", "emergencia", "monitoriza", "hospital", "agora"])) {
    p += 0.5; acertos.push("Orientou necessidade de avaliação urgente/monitorização.");
  } else melhorar.push("Orientar a necessidade de avaliação urgente e monitorização.");

  if (detectarSinaisAlarmeOuRetorno(ctx) || contemAlgum(t, ["piora da dor", "falta de ar", "desmaio", "suor frio", "sinais de gravidade"])) {
    p += 0.5; acertos.push("Orientou sinais de gravidade/risco e procura imediata se piora.");
  } else melhorar.push("Orientar sinais de gravidade e necessidade de atendimento imediato.");

  return { pontos: Math.min(2, Math.round(p * 10) / 10), acertos, melhorar };
}

// --------------------------------------------------------------------------
function avaliarAnamneseSCA(ctx: ContextoAvaliacaoOSCE): R {
  const t = normalizarTexto(ctx.anamneseTexto);
  const acertos: string[] = [];
  const melhorar: string[] = [];
  let p = 0;

  // 5.1 Caracterização da dor (0.8/0.4)
  const dorBasica = contemAlgum(t, ["dor no peito", "dor toracica", "dor torácica", "precordial", "dor no precordio"]);
  const dorQualidade = contemAlgum(t, ["aperto", "pressao", "peso", "queimacao", "intensidade", "quando comecou", "inicio", "duracao", "quanto tempo", "ha quanto tempo"]);
  if (dorBasica && dorQualidade) {
    p += 0.8;
    acertos.push("Caracterizou a dor torácica quanto a localização, qualidade, intensidade ou duração.");
  } else if (dorBasica) {
    p += 0.4;
    acertos.push("Investigou a presença de dor torácica.");
    melhorar.push("Caracterizar melhor a dor torácica: localização, qualidade, intensidade, início e duração.");
  } else {
    melhorar.push("Caracterizar a dor torácica: localização, qualidade, intensidade, início e duração.");
  }

  // 5.2 Irradiação e fatores de melhora/piora (0.5)
  if (contemAlgum(t, ["irradia", "braco esquerdo", "mandibula", "pescoco", "dorso", "costas", "epigastrio", "esforco", "repouso", "melhora com repouso", "piora ao esforco", "respiracao", "posicao"])) {
    p += 0.5;
    acertos.push("Investigou irradiação e fatores de melhora ou piora da dor.");
  } else {
    melhorar.push("Investigar irradiação da dor e relação com esforço, repouso, respiração ou posição.");
  }

  // 5.3 Sintomas associados (0.6)
  if (contemAlgum(t, ["sudorese", "suor frio", "nausea", "vomito", "dispneia", "falta de ar", "sincope", "tontura", "palpitacao", "mal-estar", "mal estar"])) {
    p += 0.6;
    acertos.push("Investigou sintomas associados sugestivos de SCA, como sudorese, náusea, dispneia ou síncope.");
  } else {
    melhorar.push("Investigar sintomas associados: sudorese, náuseas, vômitos, dispneia, síncope ou palpitações.");
  }

  // 5.4 Fatores de risco CV (0.8/0.4)
  const nFR = contarTermos(t, FATORES_RISCO_CV);
  if (nFR >= 2) {
    p += 0.8;
    acertos.push("Investigou fatores de risco cardiovascular.");
  } else if (nFR === 1) {
    p += 0.4;
    acertos.push("Investigou ao menos um fator de risco cardiovascular.");
    melhorar.push("Investigar mais fatores de risco cardiovascular: HAS, diabetes, tabagismo, dislipidemia, DAC prévia e história familiar.");
  } else {
    melhorar.push("Investigar fatores de risco cardiovascular: HAS, diabetes, tabagismo, dislipidemia, DAC prévia e história familiar.");
  }

  // 5.5 História CV prévia e medicamentos (0.5)
  if (contemAlgum(t, ["infarto anterior", "infarto previo", "angina", "cateterismo", "stent", "ponte de safena", "cirurgia cardiaca", "aas", "anticoagulante", "remedio do coracao", "anti-hipertensivo", "estatina", "sildenafil", "tadalafila", "vasodilatador", "alergia a aas"])) {
    p += 0.5;
    acertos.push("Investigou história cardiovascular prévia, medicamentos ou contraindicações relevantes.");
  } else {
    melhorar.push("Investigar DAC prévia, cateterismo/stent, uso de AAS/anticoagulantes e contraindicações a nitrato.");
  }

  // 5.6 Diferenciais graves (0.5/0.3)
  const nDif = contarTermos(t, DIFERENCIAIS_DOR_TORACICA);
  if (nDif >= 2) {
    p += 0.5;
    acertos.push("Considerou diagnósticos diferenciais relevantes para dor torácica.");
  } else if (nDif === 1) {
    p += 0.3;
    acertos.push("Mencionou um diagnóstico diferencial relevante para dor torácica.");
    melhorar.push("Considerar diferenciais graves de dor torácica: TEP, dissecção de aorta, pericardite e pneumotórax.");
  } else {
    melhorar.push("Considerar diferenciais graves de dor torácica: TEP, dissecção de aorta, pericardite e pneumotórax.");
  }

  // 5.7 Gravidade/instabilidade (0.3)
  if (contemAlgum(t, ["desmaio", "sincope", "hipotensao", "pressao baixa", "falta de ar intensa", "dor persistente", "confusao", "saturacao baixa", "palidez", "sudorese", "instabilidade", "choque"])) {
    p += 0.3;
    acertos.push("Investigou sinais de gravidade ou instabilidade clínica.");
  } else {
    melhorar.push("Investigar sinais de instabilidade: síncope, hipotensão, dispneia intensa, dor persistente ou alteração do nível de consciência.");
  }

  return { pontos: Math.min(4, Math.round(p * 10) / 10), acertos, melhorar };
}

// --------------------------------------------------------------------------
function avaliarExameFisicoSCA(ctx: ContextoAvaliacaoOSCE): R {
  const t = normalizarTexto(`${ctx.achadosTexto ?? ""} ${ctx.correlacaoTexto ?? ""}`);
  const acertos: string[] = [];
  const melhorar: string[] = [];
  let p = 0;

  if (contemAlgum(t, ["estado geral", "palidez", "sudorese", "perfusao", "enchimento capilar", "extremidades frias", "nivel de consciencia", "consciente"])) {
    p += 0.6;
    acertos.push("Avaliou estado geral, perfusão e sinais de instabilidade.");
  } else {
    melhorar.push("Avaliar estado geral, perfusão periférica e sinais de instabilidade.");
  }

  if (detectarSinaisVitaisCompletos(ctx)) {
    p += 0.6;
    acertos.push("Mediu sinais vitais completos.");
  } else {
    melhorar.push("Medir sinais vitais completos, incluindo PA, FC, FR e SpO₂.");
  }

  if (contemAlgum(t, ["ausculta cardiaca", "auscultar foco", "focos cardiacos", "bulhas", "sopro", "ritmo", "b3", "b4"])) {
    p += 0.6;
    acertos.push("Realizou ausculta cardíaca dirigida.");
  } else {
    melhorar.push("Realizar ausculta cardíaca buscando ritmo, bulhas, sopros e sinais de disfunção ventricular.");
  }

  if (contemAlgum(t, ["ausculta pulmonar", "crepita", "murmurio", "dispneia", "congestao", "edema pulmonar", "auscultar torax", "auscultar campos"])) {
    p += 0.5;
    acertos.push("Avaliou pulmões em busca de congestão ou diagnósticos diferenciais.");
  } else {
    melhorar.push("Auscultar pulmões para pesquisar congestão, crepitações ou diagnósticos diferenciais.");
  }

  if (contemAlgum(t, ["pulsos perifericos", "pulsos radiais", "pulso", "edema", "membros inferiores", "assimetria de pulsos"])) {
    p += 0.4;
    acertos.push("Avaliou pulsos, edema ou sinais periféricos relevantes.");
  } else {
    melhorar.push("Avaliar pulsos periféricos, edema e assimetria de pulsos quando indicado.");
  }

  if (contemAlgum(t, ["turgencia jugular", "jugular", "estase jugular"])) {
    p += 0.3;
    acertos.push("Avaliou turgência jugular.");
  } else {
    melhorar.push("Avaliar turgência jugular como sinal de congestão ou disfunção cardíaca.");
  }

  return { pontos: Math.min(3, Math.round(p * 10) / 10), acertos, melhorar };
}

// --------------------------------------------------------------------------
function avaliarExamesSCA(ctx: ContextoAvaliacaoOSCE): R {
  const exames = normalizarTexto(`${ctx.examesTexto ?? ""} ${ctx.condutaTexto ?? ""} ${ctx.correlacaoTexto ?? ""}`);
  const interpretacao = normalizarTexto(ctx.correlacaoTexto);
  const acertos: string[] = [];
  const melhorar: string[] = [];
  let p = 0;

  if (detectarECG(ctx)) {
    p += 0.8;
    acertos.push("Solicitou ECG de 12 derivações de forma apropriada.");
  } else {
    melhorar.push("Solicitar ECG de 12 derivações imediatamente em dor torácica suspeita de SCA.");
  }

  if (detectarTroponina(ctx)) {
    p += 0.5;
    acertos.push("Solicitou troponina ou marcadores de necrose miocárdica.");
  } else {
    melhorar.push("Solicitar troponina seriada ou marcadores de necrose miocárdica.");
  }

  if (detectarSinaisVitaisCompletos(ctx) || contemAlgum(exames, ["monitoriza", "spo2", "oximetria", "sinais vitais", "satura"])) {
    p += 0.3;
    acertos.push("Avaliou monitorização clínica, sinais vitais ou oximetria.");
  } else {
    melhorar.push("Monitorizar paciente e avaliar sinais vitais/oximetria.");
  }

  if (contemAlgum(exames, ["hemograma", "eletrolito", "funcao renal", "glicemia", "coagulograma", "ureia", "creatinina", "sodio", "potassio"])) {
    p += 0.2;
    acertos.push("Solicitou exames laboratoriais gerais úteis para estratificação e conduta.");
  } else {
    melhorar.push("Solicitar exames laboratoriais gerais, como hemograma, eletrólitos, função renal e coagulograma conforme contexto.");
  }

  if (detectarRXTorax(ctx)) {
    p += 0.1;
    acertos.push("Considerou radiografia de tórax quando indicada por diferencial ou gravidade.");
  } else {
    melhorar.push("Considerar radiografia de tórax se houver dispneia, suspeita pulmonar ou necessidade de avaliar diferenciais.");
  }

  if (contemAlgum(interpretacao, ["supra", "infra", "alteracao st", "alteracao de st", "troponina elevada", "ecg alterado", "isquemia", "necrose", "iam"])) {
    p += 0.1;
    acertos.push("Interpretou exames complementares de forma coerente com SCA.");
  } else {
    melhorar.push("Relacionar ECG/troponina à hipótese de SCA.");
  }

  return { pontos: Math.min(2, Math.round(p * 10) / 10), acertos, melhorar };
}

// --------------------------------------------------------------------------
function avaliarRaciocinioSCA(ctx: ContextoAvaliacaoOSCE): R {
  const verbal = normalizarTexto(ctx.correlacaoTexto);
  const exames = normalizarTexto(`${ctx.examesTexto ?? ""} ${ctx.condutaTexto ?? ""}`);
  const difs = normalizarTexto(`${ctx.correlacaoTexto ?? ""} ${(ctx.diferenciaisInformados ?? []).join(" ")}`);
  const acertos: string[] = [];
  const melhorar: string[] = [];
  let p = 0;

  // 8.1 Hipótese principal (1.2)
  if (contemAlgum(verbal, ["sca", "sindrome coronariana", "infarto", "iam", "angina instavel", "isquemia miocardica", "dor toracica cardiaca", "coronariana"])) {
    p += 1.2;
    acertos.push("Reconheceu SCA/IAM/angina instável como hipótese principal.");
  } else {
    melhorar.push("Reconhecer SCA/IAM/angina instável como hipótese principal diante de dor torácica compatível.");
  }

  // 8.2 Dor típica + sintomas (0.8)
  if (contemAlgum(verbal, ["aperto", "pressao", "retroesternal", "precordial", "irradia", "sudorese", "nausea", "dispneia", "piora ao esforco", "esforco"])) {
    p += 0.8;
    acertos.push("Relacionou dor torácica típica e sintomas associados à hipótese de SCA.");
  } else {
    melhorar.push("Relacionar características da dor torácica e sintomas associados à suspeita de SCA.");
  }

  // 8.3 Fatores de risco (0.6)
  if (contarTermos(verbal, FATORES_RISCO_CV) >= 1) {
    p += 0.6;
    acertos.push("Relacionou fatores de risco cardiovascular ao diagnóstico.");
  } else {
    melhorar.push("Integrar fatores de risco cardiovascular ao raciocínio diagnóstico.");
  }

  // 8.4 ECG/troponina (1.0 correlacionou / 0.5 solicitou)
  const interpretou = contemAlgum(verbal, ["supra", "infra", "alteracao st", "alteracao de st", "ecg alterado", "troponina elevada", "isquemia", "necrose", "ecg", "troponina"]);
  const solicitou = contemAlgum(exames, ["ecg", "eletrocardiograma", "troponina", "enzimas cardiacas", "ck-mb"]);
  if (interpretou) {
    p += 1.0;
    acertos.push("Relacionou ECG e/ou troponina à hipótese de SCA.");
  } else if (solicitou) {
    p += 0.5;
    acertos.push("Solicitou ECG/troponina para investigar SCA.");
    melhorar.push("Relacionar ECG e troponina ao diagnóstico e à estratificação da SCA.");
  } else {
    melhorar.push("Relacionar ECG e troponina ao diagnóstico e à estratificação da SCA.");
  }

  // 8.5 Diferenciais (0.7/0.5/0.3)
  const nDif = contarTermos(difs, DIFERENCIAIS_DOR_TORACICA);
  if (nDif >= 2) {
    p += 0.5;
    acertos.push("Considerou diferenciais relevantes de dor torácica.");
    melhorar.push("Justificar brevemente cada diferencial considerado.");
  } else if (nDif === 1) {
    p += 0.3;
    acertos.push("Mencionou um diferencial relevante de dor torácica.");
    melhorar.push("Ampliar diferenciais de dor torácica, incluindo TEP, dissecção de aorta, pericardite e pneumotórax.");
  } else {
    melhorar.push("Ampliar diferenciais de dor torácica, incluindo TEP, dissecção de aorta, pericardite e pneumotórax.");
  }

  // 8.6 Gravidade/emergência (0.7)
  if (contemAlgum(verbal, ["emergencia", "monitoriza", "nao liberar", "risco de morte", "instabilidade", "supra de st", "dor persistente", "hipotensao", "arritmia", "unidade coronariana", "encaminh"])) {
    p += 0.7;
    acertos.push("Avaliou gravidade e necessidade de atendimento emergencial/monitorização.");
  } else {
    melhorar.push("Avaliar gravidade, risco e necessidade de atendimento emergencial em suspeita de SCA.");
  }

  return { pontos: Math.min(5, Math.round(p * 10) / 10), acertos, melhorar };
}

// --------------------------------------------------------------------------
function avaliarCondutaSCA(ctx: ContextoAvaliacaoOSCE): R {
  const t = normalizarTexto(`${ctx.condutaTexto ?? ""} ${ctx.correlacaoTexto ?? ""}`);
  const acertos: string[] = [];
  const melhorar: string[] = [];
  let p = 0;

  if (detectarEmergenciaEncaminhamento(ctx)) {
    p += 0.8;
    acertos.push("Indicou atendimento emergencial, monitorização ou não liberação do paciente.");
  } else {
    melhorar.push("Encaminhar/monitorizar paciente com suspeita de SCA e evitar liberação sem estratificação.");
  }

  if (detectarAAS(ctx)) {
    p += 0.8;
    acertos.push("Indicou AAS/antiagregação quando apropriado.");
  } else {
    melhorar.push("Considerar AAS/antiagregação se não houver contraindicação.");
  }

  if (contemAlgum(t, ["ecg seriado", "repetir ecg", "troponina seriada", "repetir troponina", "curva enzimatica", "reavaliar", "seriado", "seriada"])) {
    p += 0.5;
    acertos.push("Indicou ECG/troponina seriados ou reavaliação objetiva.");
  } else {
    melhorar.push("Planejar ECG e troponina seriados com reavaliação clínica.");
  }

  if (detectarNitrato(ctx) || contemAlgum(t, ["morfina", "analgesia", "controle da dor", "controle de dor"])) {
    p += 0.5;
    acertos.push("Indicou controle de dor/isquemia com nitrato ou analgesia conforme contexto.");
  } else {
    melhorar.push("Considerar controle da dor/isquemia com nitrato ou analgesia, respeitando contraindicações.");
  }

  if (detectarOxigenioSeHipoxemia(ctx)) {
    p += 0.3;
    acertos.push("Indicou oxigênio se hipoxemia ou desconforto respiratório.");
  } else {
    melhorar.push("Indicar oxigênio apenas se hipoxemia, desconforto respiratório ou instabilidade.");
  }

  if (detectarAnticoagulacaoSCA(ctx)) {
    p += 0.5;
    acertos.push("Considerou anticoagulação ou terapia antitrombótica conforme protocolo.");
  } else {
    melhorar.push("Considerar anticoagulação/terapia antitrombótica conforme protocolo e estratificação.");
  }

  if (contemAlgum(t, ["sinais de alarme", "piora da dor", "falta de ar", "desmaio", "nao ir para casa", "procurar hospital", "retorno imediato", "sinais de gravidade", "risco"])) {
    p += 0.6;
    acertos.push("Orientou sinais de gravidade e necessidade de atendimento imediato.");
  } else {
    melhorar.push("Explicar sinais de gravidade e necessidade de atendimento imediato.");
  }

  return { pontos: Math.min(4, Math.round(p * 10) / 10), acertos, melhorar };
}

// --------------------------------------------------------------------------
function avaliarSCA(ctx: ContextoAvaliacaoOSCE): ResultadoCardRubrica[] {
  const com = avaliarComunicacaoSCA(ctx);
  const an = avaliarAnamneseSCA(ctx);
  const ef = avaliarExameFisicoSCA(ctx);
  const ex = avaliarExamesSCA(ctx);
  const ra = avaliarRaciocinioSCA(ctx);
  const co = avaliarCondutaSCA(ctx);
  return [
    { card: "comunicacao", titulo: "Comunicação e postura médica", pontos: com.pontos, pontosMax: 2, acertos: com.acertos, melhorar: com.melhorar },
    { card: "anamnese", titulo: "Anamnese dirigida", pontos: an.pontos, pontosMax: 4, acertos: an.acertos, melhorar: an.melhorar },
    { card: "exameFisico", titulo: "Exame físico", pontos: ef.pontos, pontosMax: 3, acertos: ef.acertos, melhorar: ef.melhorar },
    { card: "examesComplementares", titulo: "Exames complementares", pontos: ex.pontos, pontosMax: 2, acertos: ex.acertos, melhorar: ex.melhorar },
    { card: "raciocinioDiagnostico", titulo: "Raciocínio diagnóstico", pontos: ra.pontos, pontosMax: 5, acertos: ra.acertos, melhorar: ra.melhorar },
    { card: "condutaSeguranca", titulo: "Conduta e Segurança", pontos: co.pontos, pontosMax: 4, acertos: co.acertos, melhorar: co.melhorar },
  ];
}

export const RUBRICA_SCA: RubricaDiagnostico = {
  diagnosticoId: "sca",
  nomesAceitos: [
    "sca", "sindrome coronariana aguda", "dor toracica", "iam", "infarto",
    "infarto agudo do miocardio", "angina instavel", "nstemi", "stemi",
    "supra de st", "sem supra", "sindrome coronariana",
  ],
  casoIds: [1],
  avaliar: avaliarSCA,
};
