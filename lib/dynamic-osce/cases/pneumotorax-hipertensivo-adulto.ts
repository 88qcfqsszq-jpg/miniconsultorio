// ============================================================================
// Casos OSCE Dinâmicos — Beta · CASO (contrato Fase 2 + mapa Pulse Fase 2.5)
// "Pneumotórax Hipertensivo — Adulto"
// ----------------------------------------------------------------------------
// 1 caso = 1 arquivo TS: o caso E a rubrica vivem aqui. Isolado do OSCE
// principal. Compatível com o motor medix-rule-based e mapeado para Pulse
// (não executado nesta fase). Emergência: descompressão é intervenção salvadora.
// ============================================================================

import type { DynamicCase, DynamicRubric, PatientState } from "../types";
import { recomputarClinica } from "../dynamic-state-engine";

const estadoInicialBase: PatientState = {
  vitals: { fc: 132, fr: 36, paSys: 90, paDia: 60, spo2: 84, temp: 36.8 },
  clinical: {
    estadoGeral: "grave, ansioso, dispneico",
    trabalhoRespiratorio: "muito aumentado",
    ausculta: "murmúrio vesicular muito reduzido/abolido unilateralmente",
    fala: "frases entrecortadas",
    perfusao: "lentificada",
  },
  broncoespasmo: 0,
  oxigenioSuplementar: false,
  corticoideAdministrado: false,
  tempoDecorridoMin: 0,
  // Marcadores de pneumotórax hipertensivo:
  tensaoPneumotorax: 85,
  descomprimido: false,
  drenado: false,
  acessoVenoso: false,
  dorControlada: false,
};

const estadoInicial: PatientState = {
  ...estadoInicialBase,
  clinical: recomputarClinica(estadoInicialBase),
};

export const pneumotoraxHipertensivoAdulto: DynamicCase = {
  identificacao: {
    caseId: "dynamic-tension-pneumothorax-adult-001",
    titulo: "Pneumotórax Hipertensivo — Adulto",
    subtitulo: "Emergência torácica com intervenção salvadora tempo-dependente",
    tipo: "adulto",
    especialidade: "Emergência / Respiratório",
    sistema: "Respiratório",
    nivel: "avancado",
    tags: ["pneumotórax", "tensão", "emergência", "descompressão", "trauma"],
    status: "beta",
    objetivoClinico:
      "Reconhecer o pneumotórax hipertensivo e realizar a descompressão imediata SEM atrasar por exames; drenagem definitiva e reavaliação.",
  },

  paciente: {
    nome: "Rafael Nunes",
    idade: 41,
    sexo: "masculino",
    pesoKg: 82,
    faixaEtaria: "adulto",
    contexto:
      "Dor torácica súbita e dispneia intensa com piora progressiva após trauma torácico fechado recente.",
    fatoresRisco: ["Trauma torácico fechado recente", "Procedimento torácico prévio"],
    antecedentesRelevantes: ["Sem pneumopatia crônica conhecida"],
    medicamentosUso: ["Nenhum de uso contínuo"],
    alergias: ["Nega alergias conhecidas"],
  },

  diagnostico: {
    diagnosticoPrincipal: "Pneumotórax hipertensivo",
    diagnosticosAceitos: [
      "Pneumotórax hipertensivo",
      "Pneumotórax sob tensão",
      "Pneumotórax traumático hipertensivo",
    ],
    diagnosticosDiferenciaisEsperados: [
      "Tamponamento cardíaco",
      "TEP maciço",
      "SCA/IAM",
      "Dissecção de aorta",
      "Crise asmática grave",
      "Choque hemorrágico",
      "Hemotórax maciço",
    ],
    diagnosticosPerigososQueDevemSerExcluidos: [
      "Tamponamento cardíaco",
      "TEP maciço",
      "SCA/IAM",
      "Dissecção de aorta",
      "Hemotórax maciço",
    ],
  },

  fisiologia: {
    estadoInicial,
    estadoEsperadoSemIntervencao:
      "Deterioração progressiva: SpO₂ cai, PA cai, FC e FR sobem, perfusão piora — risco de PCR.",
    criteriosMelhora: [
      "SpO₂ ≥ 92%",
      "PA sistólica ≥ 100 mmHg",
      "FR reduzindo",
      "Trabalho respiratório menor",
      "Perfusão melhorando",
      "Descompressão realizada",
      "Drenagem torácica após estabilização",
    ],
    criteriosPiora: [
      "SpO₂ < 85%",
      "PA sistólica < 90 mmHg",
      "FR ≥ 36 persistente ou piorando",
      "Perfusão ruim",
      "Agitação/rebaixamento progressivo",
      "Ausência de descompressão em paciente instável",
    ],
    criteriosInstabilidade: [
      "SpO₂ 84% em ar ambiente",
      "PA sistólica 90 mmHg com tendência de queda",
      "FR 36 irpm",
      "Turgência jugular / desvio de traqueia possível",
      "Perfusão lentificada",
    ],
    criteriosAltaSegura: [
      "Alta segura NÃO é objetivo deste caso: exige descompressão, drenagem definitiva e estabilização sustentada antes de qualquer consideração de alta.",
    ],
    criteriosInternacao: [
      "Pneumotórax hipertensivo",
      "Instabilidade inicial",
      "Necessidade de drenagem torácica",
      "Necessidade de monitorização",
    ],
    criteriosUTI: [
      "Instabilidade persistente",
      "Necessidade de ventilação",
      "Choque",
      "Hipoxemia persistente",
      "Politrauma grave",
    ],
  },

  comunicacao: {
    itensEsperados: [
      "Apresentou-se e tranquilizou o paciente em sofrimento respiratório",
      "Explicou a necessidade de intervenção imediata em linguagem acessível",
    ],
  },

  anamnese: {
    perguntasObrigatorias: [
      "Início súbito da dor torácica",
      "Dispneia intensa",
      "Lateralidade da dor",
      "Piora progressiva",
      "Trauma torácico recente",
      "Procedimento torácico recente",
    ],
    perguntasImportantes: [
      "Ventilação mecânica / barotrauma",
      "Antecedentes pulmonares",
      "Uso de anticoagulantes",
      "Alergias",
      "Medicações em uso",
    ],
    respostasEsperadas: {
      "Início súbito da dor torácica": "Súbito, há cerca de 30 minutos, após trauma.",
      "Lateralidade da dor": "Unilateral, no hemitórax afetado.",
      "Trauma torácico recente": "Sim, trauma fechado recente.",
    },
    redFlagsAnamnese: [
      "Trauma torácico recente",
      "Piora rápida da dispneia",
      "Hipotensão associada",
    ],
  },

  exameFisico: {
    manobrasObrigatorias: [
      "Sinais vitais",
      "Saturação",
      "Inspeção respiratória",
      "Trabalho respiratório",
      "Ausculta pulmonar comparativa",
      "Percussão torácica",
      "Avaliação de perfusão",
      "Pressão arterial",
      "Avaliação de jugulares",
      "Avaliação de traqueia",
      "Exame cardiovascular básico",
    ],
    achadosEsperados: [
      "Murmúrio vesicular abolido/reduzido unilateral",
      "Hipertimpanismo à percussão unilateral",
      "Turgência jugular",
      "Taquicardia e hipotensão",
    ],
    sinaisGravidade: [
      "SpO₂ 84%",
      "PA sistólica 90 mmHg em queda",
      "Turgência jugular",
      "Desvio de traqueia (tardio)",
      "Perfusão lentificada",
    ],
    sinaisAusentesImportantes: [
      "Estertores (afastam edema/consolidação)",
      "Sibilos difusos (afastam broncoespasmo isolado)",
    ],
  },

  exames: {
    examesEssenciais: ["Oximetria contínua", "Monitorização cardíaca", "Pressão arterial seriada"],
    examesComplementaresAceitos: [
      "Gasometria",
      "Radiografia de tórax após estabilização",
      "Ultrassom torácico à beira-leito",
      "ECG para diferencial de dor torácica",
    ],
    examesNaoPrioritarios: [
      "Tomografia antes da estabilização",
      "Aguardar radiografia antes da descompressão em paciente instável",
    ],
    interpretacoesEsperadas: {
      "Oximetria contínua": "SpO₂ 84% — hipoxemia grave.",
      "Ultrassom torácico à beira-leito": "Ausência de deslizamento pleural sugere pneumotórax.",
    },
    examesQueMudamConduta: ["Oximetria contínua", "Ultrassom torácico à beira-leito"],
  },

  intervencoes: {
    intervencoesEssenciais: ["oxigenio_alto_fluxo", "descompressao_toracica", "drenagem_toracica"],
    intervencoesAceitas: [
      "monitorizacao",
      "acesso_venoso",
      "fluidos_suporte",
      "analgesia",
      "solicitar_usg_torax",
      "reavaliar",
      "internacao",
    ],
    intervencoesContraindicadas: ["alta_precoce", "aguardar_exames"],
    intervencoesDeResgate: ["descompressao_toracica", "drenagem_toracica", "intubacao-uti"],
    respostaEsperadaPorIntervencao: [
      { intervencao: "oxigenio_alto_fluxo", efeitoEsperado: "SpO₂ melhora pouco; paciente segue grave (não resolve a causa)." },
      { intervencao: "descompressao_toracica", efeitoEsperado: "SpO₂ e PA sobem, FR cai — melhora crítica." },
      { intervencao: "drenagem_toracica", efeitoEsperado: "Estabilização sustentada, menor recorrência." },
      { intervencao: "fluidos_suporte", efeitoEsperado: "Suporte parcial da PA; não resolve a tensão." },
      { intervencao: "aguardar_exames", efeitoEsperado: "Piora (SpO₂/PA caem, FR sobe) — atraso terapêutico." },
      { intervencao: "solicitar_rx_torax", efeitoEsperado: "Se instável e sem descompressão, atrasa e piora." },
      { intervencao: "reavaliar", efeitoEsperado: "Relê a resposta; sem descompressão, o quadro piora." },
    ],
  },

  reavaliacao: {
    tempoReavaliacaoMinutos: 5,
    parametrosReavaliar: ["SpO₂", "PA sistólica", "FR", "Perfusão", "Ausculta comparativa"],
    respostaAdequada: "SpO₂ ≥ 92%, PA subindo, FR em queda após descompressão.",
    respostaInadequada: "SpO₂/PA mantidas baixas — considerar novo pneumotórax/drenagem.",
    proximaCondutaSeMelhora: "Drenagem torácica definitiva, monitorização e internação.",
    proximaCondutaSePiora: "Repetir descompressão, drenagem imediata, via aérea/UTI.",
  },

  errosCriticos: {
    errosCriticosDiagnostico: ["Tratar como ansiedade ou asma isolada", "Não reconhecer a tensão"],
    errosCriticosConduta: ["Não descomprimir o tórax", "Só oxigênio sem descompressão"],
    errosCriticosSeguranca: ["Aguardar exames antes de descomprimir em paciente instável"],
    errosCriticosAlta: ["Dar alta sem tratamento definitivo/estabilização"],
  },

  simulacao: {
    simulationProvider: "medix-rule-based",
    pulseReady: true,
    pulseScenarioId: "data/human/adult/scenarios/patient/TensionPneumothoraxClosedVaried.json",
    pulseScenarioIsPlaceholder: false,
    pulseAdapterNotes: "Mapear tensão intratorácica/SpO₂/PA para o cenário TensionPneumothorax do Pulse.",
    physiologicModelTags: ["respiratory", "pleural-pressure", "hypoxemia", "obstructive-shock"],
    pulseCompatibility: {
      conditionId: "tension-pneumothorax-adult",
      compatibility: "strong",
      suggestedSimulationProvider: "hybrid",
      pulseScenarioCandidates: [
        "data/human/adult/scenarios/patient/TensionPneumothoraxClosedVaried.json",
        "data/human/adult/scenarios/patient/TensionPneumothoraxOpenVaried.json",
        "data/human/adult/scenarios/patient/TensionPneumothoraxBilateral.json",
      ],
      requiresMedixOverlay: true,
      pediatricSafetyAdapterRequired: false,
      notes: [
        "TensionPneumothorax + NeedleDecompression cobrem a fisiologia salvadora.",
        "Rubrica MEDIX cobra 'não atrasou a descompressão' (Pulse é só motor fisiológico).",
      ],
    },
  },

  rubricaId: "rubrica-dynamic-tension-pneumothorax-adult-001",
};

// ============================================================================
// RUBRICA (mesmo arquivo do caso) — total 20, 6 domínios obrigatórios.
// ============================================================================
export const rubricaDynamicTensionPneumothoraxAdult001: DynamicRubric = {
  rubricaId: "rubrica-dynamic-tension-pneumothorax-adult-001",
  caseId: "dynamic-tension-pneumothorax-adult-001",
  totalPontos: 20,
  dominios: [
    {
      nome: "Comunicação",
      pontos: 2,
      criterios: [
        { id: "pn-com-apresentacao", descricao: "Apresentou-se e tranquilizou o paciente em sofrimento respiratório.", pontos: 1, obrigatorio: false, tipoEvidencia: "comunicacao", referenciasCaso: ["comunicacao.itensEsperados"], aliasesAceitos: ["apresent", "tranquiliz", "acolh"] },
        { id: "pn-com-explicou", descricao: "Explicou a necessidade de intervenção imediata em linguagem acessível.", pontos: 1, obrigatorio: false, tipoEvidencia: "comunicacao", referenciasCaso: ["comunicacao.itensEsperados"], aliasesAceitos: ["explic", "orient"] },
      ],
    },
    {
      nome: "Anamnese",
      pontos: 4,
      criterios: [
        { id: "pn-anm-dor-subita", descricao: "Investigou dor torácica súbita.", pontos: 1, obrigatorio: true, tipoEvidencia: "anamnese", referenciasCaso: ["anamnese.perguntasObrigatorias"], aliasesAceitos: ["dor", "súbita", "subita", "torácica"] },
        { id: "pn-anm-dispneia", descricao: "Investigou dispneia intensa.", pontos: 1, obrigatorio: true, tipoEvidencia: "anamnese", referenciasCaso: ["anamnese.perguntasObrigatorias"], aliasesAceitos: ["dispneia", "falta de ar"] },
        { id: "pn-anm-trauma", descricao: "Identificou contexto de trauma/procedimento torácico.", pontos: 1, obrigatorio: true, tipoEvidencia: "anamnese", referenciasCaso: ["anamnese.perguntasObrigatorias", "anamnese.redFlagsAnamnese"], aliasesAceitos: ["trauma", "procedimento", "barotrauma"] },
        { id: "pn-anm-lateralidade", descricao: "Investigou lateralidade e piora progressiva.", pontos: 1, obrigatorio: false, tipoEvidencia: "anamnese", referenciasCaso: ["anamnese.perguntasObrigatorias"], aliasesAceitos: ["lateralidade", "piora", "progressiva"] },
      ],
    },
    {
      nome: "Exame físico",
      pontos: 3,
      criterios: [
        { id: "pn-exf-vitais", descricao: "Avaliou sinais vitais, saturação e pressão arterial.", pontos: 1, obrigatorio: true, tipoEvidencia: "exameFisico", referenciasCaso: ["exameFisico.manobrasObrigatorias"], aliasesAceitos: ["sinais vitais", "satura", "pressão", "pressao"] },
        { id: "pn-exf-ausculta-percussao", descricao: "Realizou ausculta comparativa e percussão torácica.", pontos: 1, obrigatorio: true, tipoEvidencia: "exameFisico", referenciasCaso: ["exameFisico.manobrasObrigatorias", "exameFisico.achadosEsperados"], aliasesAceitos: ["ausculta", "percussão", "percussao"] },
        { id: "pn-exf-jugular-traqueia", descricao: "Avaliou jugulares/traqueia e perfusão.", pontos: 1, obrigatorio: false, tipoEvidencia: "exameFisico", referenciasCaso: ["exameFisico.sinaisGravidade"], aliasesAceitos: ["jugular", "traqueia", "perfusão", "perfusao"] },
      ],
    },
    {
      nome: "Exames e monitorização",
      pontos: 3,
      criterios: [
        { id: "pn-exm-oximetria", descricao: "Monitorou oximetria contínua.", pontos: 1, obrigatorio: true, tipoEvidencia: "exameComplementar", referenciasCaso: ["exames.examesEssenciais"], aliasesAceitos: ["oximetria", "saturação"] },
        { id: "pn-exm-monitor", descricao: "Monitorização cardíaca e PA seriada.", pontos: 1, obrigatorio: true, tipoEvidencia: "exameComplementar", referenciasCaso: ["exames.examesEssenciais"], aliasesAceitos: ["monitorização", "monitor", "pressão seriada"] },
        { id: "pn-exm-nao-atrasou", descricao: "Não atrasou a conduta aguardando exames em paciente instável.", pontos: 1, obrigatorio: true, tipoEvidencia: "seguranca", referenciasCaso: ["exames.examesNaoPrioritarios", "fisiologia.criteriosInstabilidade"], aliasesAceitos: ["não atrasar", "descompressão imediata"], erroCriticoAssociado: "Atraso terapêutico aguardando exame" },
      ],
    },
    {
      nome: "Raciocínio clínico",
      pontos: 4,
      criterios: [
        { id: "pn-rac-reconhece", descricao: "Reconheceu pneumotórax hipertensivo.", pontos: 1, obrigatorio: true, tipoEvidencia: "diagnostico", referenciasCaso: ["diagnostico.diagnosticoPrincipal"], aliasesAceitos: ["pneumotórax hipertensivo", "tensão", "descompressão"] },
        { id: "pn-rac-gravidade", descricao: "Avaliou gravidade/instabilidade (hipoxemia, hipotensão, jugulares).", pontos: 1, obrigatorio: true, tipoEvidencia: "interpretacao", referenciasCaso: ["fisiologia.criteriosInstabilidade", "exameFisico.sinaisGravidade"], aliasesAceitos: ["instável", "hipotensão", "hipoxemia"] },
        { id: "pn-rac-diferenciais", descricao: "Considerou diferenciais perigosos sem perder a prioridade terapêutica.", pontos: 1, obrigatorio: false, tipoEvidencia: "diagnostico", referenciasCaso: ["diagnostico.diagnosticosPerigososQueDevemSerExcluidos"], aliasesAceitos: ["tamponamento", "tep", "iam", "dissecção"] },
        { id: "pn-rac-sem-alta", descricao: "Não deu alta / indicou observação/internação.", pontos: 1, obrigatorio: true, tipoEvidencia: "seguranca", referenciasCaso: ["fisiologia.criteriosAltaSegura", "errosCriticos.errosCriticosAlta"], aliasesAceitos: ["não dar alta", "observação", "internação"], erroCriticoAssociado: "Alta insegura" },
      ],
    },
    {
      nome: "Conduta e reavaliação",
      pontos: 4,
      criterios: [
        { id: "pn-cond-oxigenio", descricao: "Ofertou oxigênio de alto fluxo.", pontos: 1, obrigatorio: true, tipoEvidencia: "conduta", referenciasCaso: ["intervencoes.intervencoesEssenciais"], aliasesAceitos: ["oxigênio", "alto fluxo", "o2"] },
        { id: "pn-cond-descompressao", descricao: "Realizou descompressão torácica imediata.", pontos: 1, obrigatorio: true, tipoEvidencia: "conduta", referenciasCaso: ["intervencoes.intervencoesEssenciais", "intervencoes.intervencoesDeResgate"], aliasesAceitos: ["descompressão", "punção", "agulha"], erroCriticoAssociado: "Não realizou descompressão" },
        { id: "pn-cond-drenagem", descricao: "Indicou drenagem torácica após a descompressão.", pontos: 1, obrigatorio: false, tipoEvidencia: "conduta", referenciasCaso: ["intervencoes.intervencoesEssenciais"], aliasesAceitos: ["drenagem", "dreno", "toracostomia"] },
        { id: "pn-cond-reavaliou", descricao: "Reavaliou a resposta com melhora objetiva.", pontos: 1, obrigatorio: false, tipoEvidencia: "reavaliacao", referenciasCaso: ["reavaliacao.parametrosReavaliar", "fisiologia.criteriosMelhora"], aliasesAceitos: ["reavaliou", "melhora"] },
      ],
    },
  ],
};
