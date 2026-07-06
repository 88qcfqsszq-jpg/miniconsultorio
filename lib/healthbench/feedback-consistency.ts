/**
 * Camada de CONSISTÊNCIA dos cards de feedback (pós-grader).
 *
 * Corrige incoerências entre o que foi registrado no atendimento e o que o
 * grader produziu, SEM alterar o grader/HealthBench em si:
 *  - sinais vitais/SpO₂ coletados não devem aparecer como pendência;
 *  - radiografia de tórax solicitada OU visualizada conta para PAC;
 *  - card com acertos não pode ficar com pontuação zero sem penalidade;
 *  - recalibração textual determinística da Conduta em PAC;
 *  - dedup e remoção de contradições (mesmo item em Acertos e Melhorar).
 *
 * Tudo aqui opera sobre o ViewModel já montado (CompetenciaAvaliacao[]).
 */

import type { CompetenciaAvaliacao } from "@/lib/types";

export interface ContextoConsistencia {
  sinaisVitais?: { solicitado?: boolean; dados?: Record<string, any> | null };
  condutaTexto?: string;
  examesTexto?: string;
  // Transcrição completa (aluno + paciente) — usada na Anamnese PAC
  anamneseTexto?: string;
  // O que o aluno VERBALIZOU/escreveu (falas + diagnóstico + diferenciais + SOAP) — correlações
  correlacaoTexto?: string;
  // Achados objetivos disponíveis (exame físico realizado + exames solicitados)
  achadosTexto?: string;
  // Diagnósticos diferenciais informados (lista) — contagem na Raciocínio PAC
  diferenciaisInformados?: string[];
  diagnosticoEsperado?: string;
  tituloCaso?: string;
}

export function normalizar(s: unknown): string {
  return (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Sinais vitais completos: PA, FC, FR, Temperatura e SpO₂ (glicemia é bônus). */
export function temSinaisVitaisCompletos(
  sv?: { solicitado?: boolean; dados?: Record<string, any> | null } | null
): boolean {
  if (!sv?.solicitado || !sv.dados) return false;
  const d = sv.dados;
  const tem = (v: any) => v !== undefined && v !== null && v !== "";
  return (
    tem(d.pressaoArterial ?? d.pa) &&
    tem(d.frequenciaCardiaca ?? d.fc) &&
    tem(d.frequenciaRespiratoria ?? d.fr) &&
    tem(d.temperatura ?? d.temp) &&
    tem(d.saturacaoOxigenio ?? d.spo2)
  );
}

export function ehPneumonia(ctx: ContextoConsistencia): boolean {
  const t = normalizar(`${ctx.tituloCaso ?? ""} ${ctx.diagnosticoEsperado ?? ""}`);
  return /pneumonia|\bpac\b/.test(t);
}

/** Radiografia de tórax solicitada (formulário/exames) OU visualizada (imagem). */
export function radiografiaSolicitadaOuVista(ctx: ContextoConsistencia): boolean {
  const t = normalizar(ctx.examesTexto);
  if (!t) return false;
  return /\braio ?-?x\b|\brx\b|radiografia|chest x-?ray|x-?ray chest|imagem de torax|torax/.test(
    t
  );
}

// ---------------------------------------------------------------------------
// Helpers de lista
// ---------------------------------------------------------------------------
function dedup(itens: string[]): string[] {
  const vistos = new Set<string>();
  const out: string[] = [];
  for (const it of itens) {
    const k = normalizar(it);
    if (!k || vistos.has(k)) continue;
    vistos.add(k);
    out.push(it);
  }
  return out;
}

function removerSe(itens: string[], predicado: (norm: string) => boolean): string[] {
  return itens.filter((it) => !predicado(normalizar(it)));
}

// ---------------------------------------------------------------------------
// 1. Consistência de sinais vitais (card Exame físico)
// ---------------------------------------------------------------------------
const RX_SINAIS_VITAIS = /sinais? vitais|satura|spo2|\bpa\b.*\bfc\b/;

export function aplicarConsistenciaSinaisVitais(
  card: CompetenciaAvaliacao,
  ctx: ContextoConsistencia
): CompetenciaAvaliacao {
  if (!temSinaisVitaisCompletos(ctx.sinaisVitais)) return card;

  // Consolida: remove variações de sinais vitais de ambas as listas e deixa 1 acerto canônico
  const melhorias = removerSe(card.melhorias, (n) => RX_SINAIS_VITAIS.test(n));
  const acertosSemSV = removerSe(card.acertos, (n) => RX_SINAIS_VITAIS.test(n));
  const acertos = [...acertosSemSV, "Mediu sinais vitais completos (PA, FC, FR, temperatura e SpO₂)."];
  return { ...card, acertos: dedup(acertos), melhorias: dedup(melhorias) };
}

// ---------------------------------------------------------------------------
// 2. Radiografia de tórax para PAC (card Exames complementares)
// ---------------------------------------------------------------------------
const RX_RADIOGRAFIA = /radiografia|raio ?-?x|\brx\b|chest x-?ray/;

export function aplicarRadiografiaPAC(
  card: CompetenciaAvaliacao,
  ctx: ContextoConsistencia
): CompetenciaAvaliacao {
  if (!ehPneumonia(ctx)) return card;
  if (!radiografiaSolicitadaOuVista(ctx)) return card;

  // Consolida: remove variações de radiografia de ambas as listas e deixa 1 acerto canônico
  const melhorias = removerSe(card.melhorias, (n) => RX_RADIOGRAFIA.test(n));
  const acertosSemRx = removerSe(card.acertos, (n) => RX_RADIOGRAFIA.test(n));
  const acertos = [...acertosSemRx, "Solicitou ou avaliou radiografia de tórax."];
  return { ...card, acertos: dedup(acertos), melhorias: dedup(melhorias) };
}

// ---------------------------------------------------------------------------
// 3. Recalibração textual determinística da Conduta PAC
// ---------------------------------------------------------------------------
export interface ResultadoCondutaPAC {
  pontos: number;
  acertos: string[];
  melhorias: string[];
}

export function avaliarCondutaPAC(condutaTexto?: string): ResultadoCondutaPAC {
  const t = normalizar(condutaTexto);
  const acertos: string[] = [];
  const melhorias: string[] = [];
  let pontos = 0;

  // 3.1 Antibiótico adequado (+3.0) — tolerante a grafias
  const antibiotico =
    /amoxicilina|amoxiclav|amoxiclina|amoxilina|clavulanat|clavulanic|clavulan|azitromicina|claritromicina|macrolid|cefalosporina|ceftriaxona|levofloxacin|antibiotic/.test(
      t
    );
  if (antibiotico) {
    pontos += 3.0;
    acertos.push("Prescreveu antibiótico adequado para PAC.");
  } else {
    melhorias.push("Prescrever antibiótico adequado para PAC.");
  }

  // 3.2 Duração (+0.2)
  const duracao =
    /\b\d+\s*(a\s*\d+\s*)?dias?\b|sete dias|cinco dias|dez dias|por \d+ dias|por .* dias/.test(
      t
    );
  if (duracao) {
    pontos += 0.2;
    acertos.push("Informou duração do tratamento.");
  } else {
    melhorias.push("Informar a duração do tratamento.");
  }

  // 3.3 Suporte (+0.2)
  const suporte =
    /antitermic|dipirona|paracetamol|analges|hidrata|repouso|suporte|controle de febre/.test(
      t
    );
  if (suporte) {
    pontos += 0.2;
    acertos.push(
      "Indicou medidas de suporte, como antitérmico, analgesia ou hidratação."
    );
  } else {
    melhorias.push("Orientar hidratação, antitérmico ou analgesia quando necessário.");
  }

  // 3.4 Sinais de alarme / retorno (+0.2)
  const alarme =
    /voltar se piorar|retorno|reavalia|falta de ar|piora|febre persistente|sangue no escarro|hemoptise|satura(c|ç)ao baixa|procurar atendimento|sinais de gravidade|sinais de alarme/.test(
      t
    );
  if (alarme) {
    pontos += 0.2;
    acertos.push("Orientou sinais de alarme e necessidade de retorno/reavaliação.");
  } else {
    melhorias.push("Orientar sinais de alarme e quando retornar/reavaliar.");
  }

  // 3.5 Critérios de internação / gravidade (+0.2)
  const gravidade =
    /interna(c|ç)ao|hospital|emergencia|hipoxemia|sepse|confus|instabilidade|satura(c|ç)ao baixa|spo2 baixa|press(a|ã)o baixa|piora respiratoria|risco de gravidade/.test(
      t
    );
  if (gravidade) {
    pontos += 0.2;
    acertos.push(
      "Considerou critérios de gravidade ou necessidade de atendimento hospitalar."
    );
  } else {
    melhorias.push("Explicar critérios de gravidade e quando procurar emergência.");
  }

  // 3.6 Dose / posologia (+0.2)
  const dose =
    /\d+\s*\/\s*\d+|\d+\s*mg|\d+\s*g\b|\d+\s*\/\s*\d+\s*h|\d+\s*em\s*\d+|de \d+ em \d+|duas vezes ao dia|tres vezes ao dia|uma vez ao dia|\d+x ao dia|\d+\/\d+h/.test(
      t
    );
  if (dose) {
    pontos += 0.2;
    acertos.push("Informou dose ou posologia do antibiótico.");
  } else {
    melhorias.push("Informar dose e posologia do antibiótico.");
  }

  pontos = Math.min(4, Math.round(pontos * 10) / 10);
  return { pontos, acertos, melhorias };
}

export function recalibrarCondutaPAC(
  card: CompetenciaAvaliacao,
  ctx: ContextoConsistencia
): CompetenciaAvaliacao {
  if (!ehPneumonia(ctx)) return card;
  const r = avaliarCondutaPAC(ctx.condutaTexto);
  return {
    ...card,
    pontosObtidos: Math.min(card.pontosMaximos, r.pontos),
    acertos: dedup(r.acertos),
    melhorias: dedup(r.melhorias),
  };
}

// ---------------------------------------------------------------------------
// 3b. Anamnese dirigida PAC (total 4.0)
// ---------------------------------------------------------------------------
export function avaliarAnamnesePAC(ctx: ContextoConsistencia): ResultadoCondutaPAC {
  const t = normalizar(ctx.anamneseTexto);
  const acertos: string[] = [];
  const melhorias: string[] = [];
  let pontos = 0;
  const tem = (re: RegExp) => re.test(t);

  if (tem(/h[áa] quanto tempo|quando come[çc]ou|desde quando|evolu|piorou|melhorou|tempo de sintomas|\d+\s*dias|h[áa]\s*(alguns\s*)?dias/)) {
    pontos += 0.6;
    acertos.push("Caracterizou a queixa principal e a evolução temporal.");
  } else {
    melhorias.push("Caracterizar início, duração e evolução dos sintomas.");
  }

  if (tem(/febre|temperatura|quantos graus|\b3[89][.,]?\d*\b|febril/)) {
    pontos += 0.5;
    acertos.push("Investigou febre (presença, duração ou intensidade).");
  } else {
    melhorias.push("Investigar febre: presença, duração e intensidade.");
  }

  if (tem(/tosse|catarro|escarro|expectora|secre[çc]|muco/)) {
    pontos += 0.7;
    acertos.push("Caracterizou tosse e expectoração/escarro.");
  } else {
    melhorias.push("Investigar tosse e expectoração/escarro.");
  }

  if (tem(/falta de ar|dispneia|cansa[çc]o respirat|dor tor[áa]cica|dor no peito|dor ao respirar|dor pleur[íi]tic|chiado|sibil|calafri/)) {
    pontos += 0.6;
    acertos.push("Investigou dispneia, dor torácica pleurítica ou sintomas respiratórios associados.");
  } else {
    melhorias.push("Investigar dispneia, dor torácica pleurítica ou outros sintomas respiratórios associados.");
  }

  if (tem(/prostra|piora|confus|satura[çc][ãa]o baixa|hipoxemia|febre persistente|estado geral|sinais de gravidade/)) {
    pontos += 0.4;
    acertos.push("Investigou sintomas sistêmicos e sinais de gravidade.");
  } else {
    melhorias.push("Investigar sintomas sistêmicos/gravidade (prostração, confusão, hipoxemia).");
  }

  if (tem(/idade|tabagismo|fuma|dpoc|asma|bronquite|imunossupress|\bhiv\b|diabetes|cardiopat|doen[çc]a renal|gesta|alcool|comorbidad|doen[çc]as previas|uso cont[íi]nuo/)) {
    pontos += 0.5;
    acertos.push("Investigou fatores de risco e comorbidades.");
  } else {
    melhorias.push("Investigar comorbidades, tabagismo, imunossupressão e fatores de risco.");
  }

  if (tem(/tuberculose|contato com tb|contato com doente|covid|influenza|gripe|virose|surto|viagem|exposi[çc]/)) {
    pontos += 0.4;
    acertos.push("Investigou epidemiologia e diferenciais infecciosos.");
  } else {
    melhorias.push("Investigar epidemiologia infecciosa (contato com TB, vírus respiratórios, exposição).");
  }

  if (tem(/alergia|tomou antibi[óo]tic|usou rem[ée]dio|medica|tratamento previo/)) {
    pontos += 0.3;
    acertos.push("Investigou alergias, medicações ou antibióticos prévios.");
  } else {
    melhorias.push("Investigar alergias, medicações em uso e antibióticos prévios.");
  }

  pontos = Math.min(4, Math.round(pontos * 10) / 10);
  return { pontos, acertos, melhorias };
}

// ---------------------------------------------------------------------------
// 3c. Exames complementares PAC (total 2.0)
// ---------------------------------------------------------------------------
export function avaliarExamesPAC(ctx: ContextoConsistencia): ResultadoCondutaPAC {
  const exames = normalizar(ctx.examesTexto);
  const interpretacao = normalizar(ctx.correlacaoTexto);
  const acertos: string[] = [];
  const melhorias: string[] = [];
  let pontos = 0;

  // RX (+1.0) — solicitado OU visualizado pela aba Exames de Imagem
  if (radiografiaSolicitadaOuVista(ctx)) {
    pontos += 1.0;
    acertos.push("Solicitou ou avaliou radiografia de tórax.");
  } else {
    melhorias.push("Solicitar radiografia de tórax para confirmação e avaliação de extensão.");
  }

  // Hemograma/leucograma/marcadores (+0.4)
  if (/hemograma|leucograma|leucocit|\bpcr\b|prote[íi]na c reativa|marcador|hemocultura/.test(exames)) {
    pontos += 0.4;
    acertos.push("Solicitou hemograma/leucograma ou marcadores infecciosos.");
  } else {
    melhorias.push("Solicitar hemograma/leucograma ou marcadores infecciosos básicos.");
  }

  // Oximetria/SpO₂/sinais vitais (+0.3)
  if (temSinaisVitaisCompletos(ctx.sinaisVitais) || /spo2|satura|oximetria|gasometria/.test(exames)) {
    pontos += 0.3;
    acertos.push("Avaliou sinais vitais e oximetria.");
  } else {
    melhorias.push("Avaliar oximetria/SpO₂ e sinais vitais.");
  }

  // Estratificação de gravidade (+0.2)
  if (/fun[çc][ãa]o renal|eletr[óo]lito|lactato|ureia|creatinina|hemocultura/.test(exames)) {
    pontos += 0.2;
    acertos.push("Solicitou exames para estratificação de gravidade quando indicados.");
  } else {
    melhorias.push(
      "Considerar exames adicionais de gravidade quando indicados, como função renal, eletrólitos, gasometria, lactato ou hemoculturas em casos graves."
    );
  }

  // Interpretação coerente (+0.1)
  if (/leucocitose|leucograma alto|neutrofilia|desvio a esquerda|opacidade|consolida|infiltrado|compat[íi]vel/.test(interpretacao)) {
    pontos += 0.1;
    acertos.push("Interpretou exames de forma coerente com PAC.");
  } else {
    melhorias.push("Relacionar os exames solicitados à hipótese diagnóstica.");
  }

  pontos = Math.min(2, Math.round(pontos * 10) / 10);
  return { pontos, acertos, melhorias };
}

// ---------------------------------------------------------------------------
// 3d. Raciocínio diagnóstico PAC (total 5.0)
// ---------------------------------------------------------------------------
const DIFERENCIAIS_PAC = [
  "tuberculose", "covid", "influenza", "virose", "dengue", "asma", "dpoc",
  "tep", "insuficiencia cardiaca", "bronquite", "derrame pleural", "pneumotorax",
];

export function avaliarRaciocinioPAC(ctx: ContextoConsistencia): ResultadoCondutaPAC {
  const verbal = normalizar(ctx.correlacaoTexto); // o que o aluno disse/escreveu
  const achados = normalizar(ctx.achadosTexto); // exame físico realizado + exames
  const exames = normalizar(ctx.examesTexto);
  const acertos: string[] = [];
  const melhorias: string[] = [];
  let pontos = 0;

  // Hipótese principal (+1.2)
  if (/\bpac\b|pneumonia|infec.*pulm|infec.*no pulm/.test(verbal)) {
    pontos += 1.2;
    acertos.push("Reconheceu pneumonia/PAC como hipótese principal.");
  } else {
    melhorias.push("Declarar pneumonia/PAC como hipótese principal.");
  }

  // Sintomas integrados (+0.8 / +0.4)
  const sintomas = ["febre", "tosse", "escarro", "catarro", "expectora", "dor tor", "dor pleur", "dispneia", "falta de ar", "calafri"];
  const nSint = sintomas.filter((s) => verbal.includes(s)).length;
  if (nSint >= 2) {
    pontos += 0.8;
    acertos.push("Relacionou sintomas respiratórios e febre à hipótese de PAC.");
  } else if (nSint === 1) {
    pontos += 0.4;
    acertos.push("Mencionou sintoma compatível com PAC.");
    melhorias.push("Integrar mais sintomas (febre + tosse/escarro) à hipótese.");
  } else {
    melhorias.push("Relacionar sintomas (febre, tosse, escarro) à hipótese de PAC.");
  }

  // Exame físico integrado (+0.9 correlacionou / +0.4 só realizou)
  const reExF = /crepita|estertor|murmurio|sopro tubario|macicez|fremito|taquipneia|spo2 baixa|hipoxemia|ausculta|base direita|lobo direito|hemitorax direito/;
  if (reExF.test(verbal)) {
    pontos += 0.9;
    acertos.push("Relacionou achados do exame físico respiratório à hipótese de PAC.");
  } else if (reExF.test(achados)) {
    pontos += 0.4;
    acertos.push("Realizou exame físico respiratório compatível.");
    melhorias.push("Correlacionar explicitamente os achados do exame físico à hipótese.");
  } else {
    melhorias.push("Relacionar achados do exame físico respiratório à hipótese de PAC.");
  }

  // Exames/imagem integrados (+0.8 correlacionou / +0.4 só solicitou)
  const reExm = /leucocitose|leucograma alto|neutrofilia|desvio a esquerda|hemograma infeccioso|radiografia|raio ?-?x|\brx\b|opacidade|consolida|infiltrado|imagem compat/;
  if (reExm.test(verbal)) {
    pontos += 0.8;
    acertos.push("Relacionou exames laboratoriais ou imagem à hipótese de PAC.");
  } else if (reExm.test(exames) || radiografiaSolicitadaOuVista(ctx)) {
    pontos += 0.4;
    acertos.push("Solicitou exames ou visualizou imagem compatível com PAC.");
    melhorias.push("Correlacionar exames/imagem (leucocitose, opacidade) à hipótese.");
  } else {
    melhorias.push("Relacionar exames laboratoriais ou imagem à hipótese de PAC.");
  }

  // Diferenciais (+0.7 com justificativa / +0.5 dois+ / +0.3 um)
  const difsTexto = normalizar(
    [ctx.correlacaoTexto, (ctx.diferenciaisInformados ?? []).join(" ")].join(" ")
  );
  // Diferenciais: 2+ pertinentes (ex.: TB + virose) → 0.7 cheio; 1 → 0.3
  const nDif = DIFERENCIAIS_PAC.filter((d) => difsTexto.includes(d)).length;
  if (nDif >= 2) {
    pontos += 0.7;
    acertos.push("Considerou diagnósticos diferenciais pertinentes (ex.: tuberculose e viroses respiratórias).");
  } else if (nDif === 1) {
    pontos += 0.3;
    acertos.push("Mencionou um diagnóstico diferencial pertinente.");
    melhorias.push(
      "Ampliar ou justificar diferenciais conforme a apresentação clínica (viroses respiratórias, TEP, DPOC/asma ou insuficiência cardíaca)."
    );
  } else {
    melhorias.push("Considerar diagnósticos diferenciais pertinentes para o quadro respiratório.");
  }

  // Gravidade/risco/local de tratamento: 2+ sinais → 0.6 cheio; 1 → 0.3
  const sinaisGravidade = [
    "hipoxemia", "oxigenacao baixa", "satura", "spo2", "taquipneia",
    "falta de ar", "dispneia", "sinais de piora", "febre persistente",
    "procurar hospital", "procurar emergencia", "emergencia", "internar",
    "reavaliar sinais vitais", "reavalia", "retorno", "tratamento domiciliar",
    "sinais de gravidade", "instabilidade",
  ];
  const nGrav = sinaisGravidade.filter((s) => verbal.includes(normalizar(s))).length;
  if (nGrav >= 2) {
    pontos += 0.6;
    acertos.push("Avaliou gravidade/risco e segurança da conduta, com orientação de retorno/cuidado hospitalar.");
  } else if (nGrav === 1) {
    pontos += 0.3;
    acertos.push("Reconheceu sinais de gravidade/risco.");
    melhorias.push("Explicitar gravidade, risco e justificativa para tratamento domiciliar, observação ou internação.");
  } else {
    melhorias.push("Avaliar gravidade/risco e necessidade de internação ou segurança do tratamento domiciliar.");
  }

  pontos = Math.min(5, Math.round(pontos * 10) / 10);
  return { pontos, acertos, melhorias };
}

function recalibrarComAvaliador(
  card: CompetenciaAvaliacao,
  ctx: ContextoConsistencia,
  avaliador: (c: ContextoConsistencia) => ResultadoCondutaPAC
): CompetenciaAvaliacao {
  if (!ehPneumonia(ctx)) return card;
  const r = avaliador(ctx);
  return {
    ...card,
    pontosObtidos: Math.min(card.pontosMaximos, r.pontos),
    acertos: dedup(r.acertos),
    melhorias: dedup(r.melhorias),
  };
}

// ---------------------------------------------------------------------------
// 4. Normalização final de um card (dedup, contradições, clamp, piso)
// ---------------------------------------------------------------------------
/** Núcleo comparável de um item (ignora prefixos como "informar/informou"). */
function nucleo(s: string): string {
  return normalizar(s)
    .replace(
      /^(informar|informou|prescrever|prescreveu|orientar|orientou|indicar|indicou|avaliar|avaliou|medir|mediu|considerar|considerou|solicitar|solicitou|realizar|realizou|explicar|explicou)\s+/,
      ""
    )
    .replace(/[.:;]+$/, "");
}

export function normalizarCard(card: CompetenciaAvaliacao): CompetenciaAvaliacao {
  let acertos = dedup(card.acertos || []);
  let melhorias = dedup(card.melhorias || []);

  // Remover de Melhorar o que já consta (pelo núcleo) em Acertos
  const nucleosAcertos = new Set(acertos.map(nucleo));
  melhorias = melhorias.filter((m) => !nucleosAcertos.has(nucleo(m)));

  // Clamp de pontuação
  let pontos = Number(card.pontosObtidos) || 0;
  pontos = Math.max(0, Math.min(card.pontosMaximos, pontos));

  // Card com acertos não pode ficar 0 sem penalidade crítica visível
  const temPenalidadeCritica = melhorias.some((m) =>
    /penalidade cr[ií]tica|zerad/.test(normalizar(m))
  );
  if (pontos === 0 && acertos.length > 0 && !temPenalidadeCritica) {
    pontos = Math.max(0.1, Math.round(card.pontosMaximos * 0.05 * 10) / 10);
  }

  return {
    ...card,
    pontosObtidos: Math.round(pontos * 10) / 10,
    acertos,
    melhorias,
  };
}

// ---------------------------------------------------------------------------
// Orquestrador: aplica todas as regras de consistência aos 6 cards
// ---------------------------------------------------------------------------
export function aplicarConsistenciaCards(
  cards: CompetenciaAvaliacao[],
  ctx: ContextoConsistencia
): CompetenciaAvaliacao[] {
  const pac = ehPneumonia(ctx);
  return cards.map((card) => {
    let c = card;
    const nome = normalizar(card.nome);

    if (nome.includes("exame fisico")) {
      // Exame físico: apenas consistência de sinais vitais (não recalibrado nesta fase)
      c = aplicarConsistenciaSinaisVitais(c, ctx);
    } else if (nome.includes("anamnese")) {
      if (pac) c = recalibrarComAvaliador(c, ctx, avaliarAnamnesePAC);
    } else if (nome.includes("exames complementares")) {
      if (pac) c = recalibrarComAvaliador(c, ctx, avaliarExamesPAC);
      else c = aplicarRadiografiaPAC(c, ctx);
    } else if (nome.includes("raciocinio")) {
      if (pac) c = recalibrarComAvaliador(c, ctx, avaliarRaciocinioPAC);
    } else if (nome.includes("conduta")) {
      c = recalibrarCondutaPAC(c, ctx);
    }

    return normalizarCard(c);
  });
}
