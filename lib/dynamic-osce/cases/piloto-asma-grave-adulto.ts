// ============================================================================
// Casos OSCE Dinâmicos — Beta · CASO PILOTO (contrato Fase 2)
// "Crise Asmática Grave — Adulto"
// ----------------------------------------------------------------------------
// Caso dinâmico de REFERÊNCIA de arquitetura. Isolado do OSCE principal.
// Essência clínica preservada: crise grave (SpO₂ 88%, FR 34, fala entrecortada,
// sibilos difusos, broncoespasmo grave).
// ============================================================================

import type { DynamicCase, PatientState } from "../types";
import { recomputarClinica } from "../dynamic-state-engine";

const estadoInicialBase: PatientState = {
  vitals: { fc: 118, fr: 34, paSys: 135, paDia: 85, spo2: 88, temp: 37.2 },
  clinical: {
    estadoGeral: "ansioso e dispneico",
    trabalhoRespiratorio: "aumentado",
    ausculta: "sibilos difusos, murmúrio vesicular reduzido",
    fala: "frases entrecortadas",
    perfusao: "preservada",
  },
  broncoespasmo: 80,
  oxigenioSuplementar: false,
  corticoideAdministrado: false,
  tempoDecorridoMin: 0,
};

const estadoInicial: PatientState = {
  ...estadoInicialBase,
  clinical: recomputarClinica(estadoInicialBase),
};

export const pilotoAsmaGraveAdulto: DynamicCase = {
  // 1. Identificação
  identificacao: {
    caseId: "dynamic-asthma-severe-adult-001",
    titulo: "Crise Asmática Grave — Adulto",
    subtitulo: "Emergência respiratória com evolução fisiológica",
    tipo: "adulto",
    especialidade: "Respiratório / Emergência",
    sistema: "Respiratório",
    nivel: "avancado",
    tags: ["asma", "crise grave", "emergência", "broncoespasmo", "hipoxemia"],
    status: "beta",
    objetivoClinico:
      "Reconhecer e tratar a crise asmática grave, com evolução fisiológica em resposta às intervenções e reavaliação segura.",
  },

  // 2. Paciente
  paciente: {
    nome: "Marcos Andrade",
    idade: 34,
    sexo: "masculino",
    pesoKg: 78,
    faixaEtaria: "adulto",
    contexto: "Chega à emergência com falta de ar progressiva há 6 horas, sem melhora com bombinha em casa.",
    fatoresRisco: ["Asma desde a infância", "Baixa adesão à medicação de controle", "Tabagismo passivo"],
    antecedentesRelevantes: ["Duas internações prévias por asma", "Uma internação em UTI há 3 anos"],
    medicamentosUso: ["Salbutamol de resgate (uso irregular)"],
    alergias: ["Ácaros", "Poeira doméstica"],
  },

  // 3. Diagnóstico
  diagnostico: {
    diagnosticoPrincipal: "Crise asmática grave",
    diagnosticosAceitos: ["Exacerbação grave de asma", "Asma aguda grave", "Broncoespasmo grave"],
    diagnosticosDiferenciaisEsperados: ["DPOC exacerbado", "Insuficiência cardíaca", "Anafilaxia", "Pneumonia"],
    diagnosticosPerigososQueDevemSerExcluidos: ["Anafilaxia", "Pneumotórax", "Tromboembolismo pulmonar"],
  },

  // 4. Estado fisiológico
  fisiologia: {
    estadoInicial,
    estadoEsperadoSemIntervencao:
      "Mantém ou piora: hipoxemia persistente, taquipneia e aumento do trabalho respiratório, risco de exaustão.",
    criteriosMelhora: ["SpO₂ ≥ 92%", "FR < 28 irpm", "Redução do broncoespasmo", "Fala em frases completas"],
    criteriosPiora: ["Queda da SpO₂", "Aumento da FR", "Exaustão respiratória", "Rebaixamento do nível de consciência"],
    criteriosInstabilidade: ["SpO₂ < 90%", "Fala entrecortada", "Uso de musculatura acessória", "FR > 30 irpm"],
    criteriosAltaSegura: ["SpO₂ ≥ 94% em ar ambiente", "FR ≤ 24 irpm", "Ausência de esforço respiratório significativo", "Boa resposta sustentada ao tratamento"],
    criteriosInternacao: ["Resposta parcial ao tratamento", "Necessidade de oxigênio contínuo", "Antecedente de UTI por asma"],
    criteriosUTI: ["Exaustão respiratória", "Hipoxemia refratária", "Rebaixamento do nível de consciência", "Necessidade de via aérea avançada"],
  },

  // Comunicação
  comunicacao: {
    itensEsperados: [
      "Apresentou-se ao paciente e tranquilizou diante da dispneia",
      "Explicou a conduta e a gravidade em linguagem acessível",
    ],
  },

  // 5. Anamnese
  anamnese: {
    perguntasObrigatorias: [
      "Início da falta de ar",
      "Chiado",
      "Uso prévio de broncodilatador",
      "Internações prévias",
      "Intubação prévia",
    ],
    perguntasImportantes: ["Gatilhos", "Febre / infecção", "Dor torácica", "Alergias", "Medicações em uso"],
    respostasEsperadas: {
      "Início da falta de ar": "Há cerca de 6 horas, progressiva.",
      "Uso prévio de broncodilatador": "Usou salbutamol em casa, sem melhora.",
      "Internações prévias": "Duas internações; uma em UTI.",
    },
    redFlagsAnamnese: ["Intubação prévia por asma", "Internação em UTI", "Piora apesar do broncodilatador"],
  },

  // 6. Exame físico
  exameFisico: {
    manobrasObrigatorias: [
      "Sinais vitais",
      "Estado geral",
      "Padrão respiratório",
      "Ausculta pulmonar",
      "Uso de musculatura acessória",
      "Fala / frases",
      "Saturação",
    ],
    achadosEsperados: [
      "Sibilos difusos bilaterais",
      "Murmúrio vesicular reduzido",
      "Taquipneia",
      "Uso de musculatura acessória",
    ],
    sinaisGravidade: ["Fala entrecortada", "Uso de musculatura acessória", "SpO₂ 88%", "FR 34 irpm"],
    sinaisAusentesImportantes: ["Estridor (afasta obstrução alta)", "Crepitações (afasta consolidação/edema)"],
  },

  // 7. Exames complementares
  exames: {
    examesEssenciais: ["Oximetria", "Gasometria"],
    examesComplementaresAceitos: ["Radiografia de tórax (se dúvida/gravidade)", "Eletrólitos (se beta-agonista repetido)"],
    examesNaoPrioritarios: ["Hemograma (sem suspeita infecciosa)", "ECG (sem dor/risco cardíaco)"],
    interpretacoesEsperadas: {
      Oximetria: "SpO₂ 88% em ar ambiente — hipoxemia significativa.",
      Gasometria: "Pode revelar hipoxemia; PaCO₂ normal/alta indica gravidade/exaustão.",
    },
    examesQueMudamConduta: ["Oximetria", "Gasometria"],
  },

  // 8. Intervenções
  intervencoes: {
    intervencoesEssenciais: ["oxigenio", "salbutamol", "corticoide"],
    intervencoesAceitas: ["ipratropio", "reavaliar", "internacao"],
    intervencoesContraindicadas: ["alta"],
    intervencoesDeResgate: ["ipratropio", "sulfato-magnesio", "intubacao-uti"],
    respostaEsperadaPorIntervencao: [
      { intervencao: "oxigenio", efeitoEsperado: "Elevação progressiva da SpO₂." },
      { intervencao: "salbutamol", efeitoEsperado: "Redução do broncoespasmo; FR↓, FC↑ discreto." },
      { intervencao: "ipratropio", efeitoEsperado: "Melhora adicional do broncoespasmo na crise grave." },
      { intervencao: "corticoide", efeitoEsperado: "Controle da exacerbação; sem melhora imediata." },
      { intervencao: "sulfato-magnesio", efeitoEsperado: "Broncodilatação adicional na crise refratária." },
      { intervencao: "reavaliar", efeitoEsperado: "Documenta resposta; sem conduta adequada, piora." },
    ],
  },

  // 9. Reavaliação
  reavaliacao: {
    tempoReavaliacaoMinutos: 20,
    parametrosReavaliar: ["SpO₂", "FR", "Ausculta/broncoespasmo", "Fala", "Uso de musculatura acessória"],
    respostaAdequada: "SpO₂ ≥ 92%, FR em queda, redução dos sibilos e do esforço.",
    respostaInadequada: "SpO₂ mantida baixa, esforço persistente ou piora.",
    proximaCondutaSeMelhora: "Manter tratamento, observar e planejar alta segura com orientações.",
    proximaCondutaSePiora: "Escalonar (ipratrópio/magnésio), considerar internação/UTI e via aérea.",
  },

  // 10. Erros críticos
  errosCriticos: {
    errosCriticosDiagnostico: ["Não reconhecer a gravidade da crise", "Confundir com quadro leve"],
    errosCriticosConduta: ["Não administrar oxigênio", "Não administrar broncodilatador", "Não prescrever corticoide"],
    errosCriticosSeguranca: ["Não valorizar SpO₂ baixa", "Não reavaliar a resposta"],
    errosCriticosAlta: ["Dar alta com hipoxemia mantida", "Dar alta com esforço respiratório persistente"],
  },

  // 11. Simulação
  simulacao: {
    // Provider em execução permanece o motor de regras (Pulse não é executado nesta fase).
    simulationProvider: "medix-rule-based",
    pulseReady: true,
    pulseScenarioId: "data/human/adult/scenarios/patient/AsthmaAttackSevereAcute.json",
    pulseScenarioIsPlaceholder: false,
    pulseAdapterNotes: "Mapear broncoespasmo/SpO₂/FR para parâmetros do Pulse ao habilitar o adapter.",
    physiologicModelTags: ["respiratory", "bronchospasm", "hypoxemia", "gas-exchange"],
    pulseCompatibility: {
      conditionId: "asthma-severe-adult",
      compatibility: "strong",
      suggestedSimulationProvider: "hybrid",
      pulseScenarioCandidates: [
        "data/human/adult/scenarios/patient/AsthmaAttackSevereAcute.json",
        "data/human/adult/scenarios/patient/AsthmaAttackLifeThreateningAcute.json",
      ],
      requiresMedixOverlay: true,
      pediatricSafetyAdapterRequired: false,
      notes: [
        "AsthmaAttack + Albuterol/InhalerConfiguration cobrem a fisiologia.",
        "Rubrica e avaliação permanecem MEDIX (Pulse é só motor fisiológico).",
      ],
    },
  },

  // 12. Rubrica
  rubricaId: "rubrica-asma-grave-piloto",
};
