// ============================================================================
// Casos OSCE Dinâmicos — Beta · CASO (contrato Fase 2 + mapa Pulse Fase 2.5)
// "Pneumonia Grave — Adulto"
// ----------------------------------------------------------------------------
// 1 caso = 1 arquivo TS: o caso E a rubrica vivem aqui. Isolado do OSCE
// principal. Compatível com o motor medix-rule-based e mapeado para Pulse
// (não executado nesta fase). Regra clínica central: antibiótico precoce
// é essencial — atraso aumenta mortalidade; SpO₂ alvo ≥ 92%; avaliar sepse.
// ============================================================================

import type { DynamicCase, DynamicRubric, PatientState } from "../types";
import { recomputarClinica } from "../dynamic-state-engine";

const estadoInicialBase: PatientState = {
  vitals: { fc: 118, fr: 32, paSys: 105, paDia: 65, spo2: 87, temp: 39.1 },
  clinical: {
    estadoGeral: "febril, prostrado, dispneico, alerta",
    trabalhoRespiratorio: "aumentado",
    ausculta: "crepitações finas em base direita, murmúrio reduzido ipsilateralmente",
    fala: "frases curtas",
    perfusao: "discretamente lentificada",
  },
  broncoespasmo: 0,
  oxigenioSuplementar: false,
  corticoideAdministrado: false,
  tempoDecorridoMin: 0,
  // Marcadores Pneumonia:
  infeccaoPulmonar: 80,
  cargaInflamatoria: 75,
  fluidosAplicados: false,
  antibioticoAplicado: false,
};

const estadoInicial: PatientState = {
  ...estadoInicialBase,
  clinical: recomputarClinica(estadoInicialBase),
};

export const pneumoniaGraveAdulto: DynamicCase = {
  identificacao: {
    caseId: "dynamic-severe-pneumonia-adult-001",
    titulo: "Pneumonia Grave — Adulto",
    subtitulo: "PAC grave com hipoxemia, febre e risco de sepse — antibiótico precoce é essencial",
    tipo: "adulto",
    especialidade: "Emergência / Infectologia",
    sistema: "Respiratório",
    nivel: "intermediario",
    tags: ["pneumonia", "pac-grave", "hipoxemia", "sepse", "antibiotico-precoce"],
    status: "beta",
    objetivoClinico:
      "Reconhecer PAC grave, iniciar oxigênio, antibiótico precoce e suporte; avaliar risco de sepse; não atrasar antibiótico por exames; indicar internação.",
  },

  paciente: {
    nome: "Maria Santos",
    idade: 62,
    sexo: "feminino",
    pesoKg: 68,
    faixaEtaria: "adulto",
    contexto:
      "Professora aposentada, hipertensa em tratamento, não tabagista. Chega à UPA com 4 dias de febre, tosse produtiva com escarro purulento, dispneia progressiva e dor em hemitórax direito, piora ao respirar.",
    fatoresRisco: [
      "Hipertensão arterial (nega DM, cardiopatia ou imunossupressão)",
      "Idade ≥ 60 anos",
      "Vacinação antipneumocócica desconhecida",
    ],
    antecedentesRelevantes: [
      "Hipertensão arterial sistêmica em tratamento",
      "Sem internações anteriores",
      "Nega uso de imunossupressores ou corticoide crônico",
    ],
    medicamentosUso: [
      "Losartana 50 mg/dia",
      "Nega uso de antibiótico nos últimos 30 dias",
    ],
    alergias: ["Nega alergias medicamentosas conhecidas"],
  },

  diagnostico: {
    diagnosticoPrincipal: "Pneumonia adquirida na comunidade grave (PAC grave)",
    diagnosticosAceitos: [
      "Pneumonia grave",
      "Pneumonia adquirida na comunidade grave",
      "PAC grave",
      "Pneumonia bacteriana grave",
      "Sepse de foco pulmonar",
    ],
    diagnosticosDiferenciaisEsperados: [
      "TEP (tromboembolismo pulmonar)",
      "Pneumotórax",
      "Insuficiência cardíaca descompensada",
      "DPOC exacerbado",
      "Asma grave",
      "Tuberculose pulmonar",
    ],
    diagnosticosPerigososQueDevemSerExcluidos: [
      "TEP maciço (pode simular pneumonia com hipoxemia grave)",
      "Pneumotórax (especialmente hipertensivo)",
      "Insuficiência cardíaca aguda (edema pulmonar pode mimetizar)",
    ],
  },

  fisiologia: {
    estadoInicial,
    estadoEsperadoSemIntervencao:
      "Progressão para insuficiência respiratória grave, hipotensão séptica e falência de órgãos sem antibiótico e suporte imediatos.",
    criteriosMelhora: [
      "SpO₂ ≥ 92% com oxigênio suplementar",
      "FR reduzindo para < 28 irpm",
      "Temperatura em queda após antitérmico",
      "PA sistólica ≥ 100 mmHg com perfusão preservada",
      "Nível de consciência preservado",
      "Antibiótico iniciado dentro de 1 hora",
    ],
    criteriosPiora: [
      "SpO₂ < 90% persistente",
      "FR > 30 irpm persistente",
      "PA sistólica < 90 mmHg ou queda progressiva",
      "Confusão mental ou rebaixamento do nível de consciência",
      "Lactato elevado (> 2 mmol/L)",
      "Oligúria",
      "Piora da perfusão periférica",
      "Necessidade crescente de oxigênio",
    ],
    criteriosInstabilidade: [
      "SpO₂ < 90% com oxigênio",
      "FR > 30",
      "PA sistólica < 90 mmHg",
      "Confusão ou rebaixamento",
      "Lactato > 4 mmol/L",
    ],
    criteriosAltaSegura: [
      "SpO₂ ≥ 92% em ar ambiente ou com baixo fluxo de O₂",
      "FR ≤ 20 irpm",
      "Afebril por ≥ 24 h",
      "PA estável",
      "Tolerância oral para antibiótico VO",
      "Antibiótico completado conforme protocolo",
      "Retorno ambulatorial agendado",
    ],
    criteriosInternacao: [
      "Hipoxemia (SpO₂ < 92%)",
      "FR ≥ 30 irpm",
      "PA sistólica < 100 mmHg",
      "Confusão ou piora do estado geral",
      "Suspeita de sepse",
      "Necessidade de antibiótico EV",
      "Extensão da consolidação ou complicações",
    ],
    criteriosUTI: [
      "Choque séptico (PAM < 65 com vasopressor)",
      "Necessidade de ventilação invasiva",
      "Hipoxemia grave refratária (PaO₂/FiO₂ < 200)",
      "Confusão/rebaixamento com risco de via aérea",
      "Lactato elevado persistente",
    ],
  },

  comunicacao: {
    itensEsperados: [
      "Apresentação e acolhimento ao paciente febril e dispneico",
      "Explicação da conduta e importância do antibiótico precoce",
    ],
  },

  anamnese: {
    perguntasObrigatorias: [
      "Início e duração da febre, calafrios e prostração",
      "Tosse: início, caráter e volume do escarro",
      "Dispneia: início, progressão e gravidade",
      "Dor torácica: localização, irradiação, relação com respiração",
      "Uso recente de antibiótico nos últimos 30 dias",
      "Alergias medicamentosas conhecidas",
    ],
    perguntasImportantes: [
      "Comorbidades relevantes (diabetes, cardiopatia, imunossupressão, uso de corticoide)",
      "Internação hospitalar ou procedimento invasivo nos últimos 90 dias",
      "Vacinação antipneumocócica e antigripal",
      "Contato com doentes respiratórios ou animais",
      "Tabagismo atual ou prévio",
      "Confusão mental ou alteração do comportamento",
    ],
    respostasEsperadas: {
      "Início e duração da febre, calafrios e prostração":
        "Febre há 4 dias, 39–40°C, com calafrios e queda do estado geral.",
      "Tosse: início, caráter e volume do escarro":
        "Tosse produtiva com escarro amarelado a esverdeado e espesso.",
      "Dispneia: início, progressão e gravidade":
        "Dispneia progressiva há 2 dias, inicialmente aos esforços e agora em repouso.",
      "Dor torácica: localização, irradiação, relação com respiração":
        "Dor em hemitórax direito, piora ao respirar e tossir (ventilatório-dependente).",
    },
    redFlagsAnamnese: [
      "Confusão mental ou alteração do nível de consciência",
      "Dispneia de repouso com SpO₂ < 90%",
      "PA sistólica < 90 mmHg ou queda de > 40 mmHg do basal",
      "Internação ou antibiótico recente (risco de germe resistente)",
      "Imunossupressão (risco de germe atípico ou oportunista)",
    ],
  },

  exameFisico: {
    manobrasObrigatorias: [
      "Sinais vitais completos com saturação periférica (SpO₂) e temperatura",
      "Ausculta pulmonar bilateral (focos de crepitação, murmúrio e simetria)",
      "Avaliação do padrão respiratório e uso de musculatura acessória",
      "Avaliação de perfusão, hidratação e nível de consciência",
      "Avaliação cardiovascular básica (bulhas, ritmo, PA nas duas posições)",
    ],
    achadosEsperados: [
      "Crepitações finas em base direita",
      "Murmúrio vesicular reduzido em base direita",
      "Macicez à percussão em base direita",
      "Frêmito toracovocal aumentado em base direita (condensação)",
      "Taquipneia (FR 32 irpm)",
      "Taquicardia (FC 118 bpm)",
    ],
    sinaisGravidade: [
      "FR > 30 irpm",
      "SpO₂ < 90% em ar ambiente",
      "PA sistólica < 100 mmHg",
      "Confusão ou rebaixamento do nível de consciência",
      "Cianose perioral",
      "Uso de musculatura acessória",
    ],
    sinaisAusentesImportantes: [
      "Sem assimetria importante na expansibilidade (afasta pneumotórax)",
      "Sem hiperfonese ou timpanismo (afasta pneumotórax hipertensivo)",
      "Sem edema de membros inferiores ou B3 (afasta IC descompensada como causa principal)",
    ],
  },

  exames: {
    examesEssenciais: [
      "Oximetria contínua",
      "Hemograma com diferencial",
      "PCR e proteína C-reativa",
      "Função renal e eletrólitos (ureia, creatinina, sódio, potássio)",
      "Radiografia de tórax (PA e perfil)",
      "Gasometria arterial (hipoxemia grave)",
      "Lactato sérico (suspeita de sepse)",
      "Hemoculturas (2 amostras, sem atrasar antibiótico)",
    ],
    examesComplementaresAceitos: [
      "Cultura de escarro (se internado e quadro grave)",
      "Antígeno urinário de Legionella e Pneumococo",
      "Teste viral (influenza/COVID-19 conforme contexto epidemiológico)",
      "ECG (dor torácica associada a comorbidade cardíaca)",
      "Tomografia de tórax (dúvida diagnóstica ou suspeita de complicação após estabilização)",
    ],
    examesNaoPrioritarios: [
      "Tomografia de tórax como primeiro exame antes de estabilizar",
      "Broncoscopia diagnóstica na fase aguda sem suspeita de corpo estranho ou tumoral",
      "Ecocardiograma antes de afastar pneumonia como causa",
    ],
    interpretacoesEsperadas: {
      "Radiografia de tórax (PA e perfil)":
        "Opacidade em base direita compatível com condensação (pneumonia lobar/segmentar).",
      "Gasometria arterial (hipoxemia grave)":
        "PaO₂ reduzida, PaO₂/FiO₂ < 300 (PAC grave); pH levemente ácido.",
      "Hemograma com diferencial":
        "Leucocitose com desvio à esquerda (leucócitos > 12.000/mm³).",
      "Lactato sérico (suspeita de sepse)":
        "Lactato ≥ 2 mmol/L → sepse; ≥ 4 mmol/L → choque séptico.",
    },
    examesQueMudamConduta: [
      "Radiografia de tórax (confirma diagnóstico)",
      "Gasometria arterial (define gravidade, indica VNI ou IOT)",
      "Lactato sérico (define sepse/choque)",
    ],
  },

  intervencoes: {
    intervencoesEssenciais: [
      "oxigenio_suplementar",
      "antibiotico_precoce",
      "antitermico",
      "hidratacao_cautelosa",
      "monitorizacao",
      "reavaliar",
      "internacao",
    ],
    intervencoesAceitas: [
      "acesso_venoso",
      "coleta_culturas_sem_atrasar_antibiotico",
      "analgesia",
      "ventilacao_nao_invasiva",
      "intubacao-uti",
    ],
    intervencoesContraindicadas: [
      "alta_precoce",
      "atrasar_antibiotico_por_exames",
    ],
    intervencoesDeResgate: ["ventilacao_nao_invasiva", "intubacao-uti"],
    respostaEsperadaPorIntervencao: [
      {
        intervencao: "oxigenio_suplementar",
        efeitoEsperado: "SpO₂ sobe (meta ≥ 92%). FR melhora parcialmente. Não trata infecção.",
      },
      {
        intervencao: "antibiotico_precoce",
        efeitoEsperado: "Conduta essencial. Não melhora vitais de imediato — efeito nas próximas horas.",
      },
      {
        intervencao: "antitermico",
        efeitoEsperado: "Temperatura reduz; FC melhora discretamente.",
      },
      {
        intervencao: "hidratacao_cautelosa",
        efeitoEsperado: "PA e perfusão melhoram discretamente se houver hipovolemia. Monitorar congestão.",
      },
      {
        intervencao: "coleta_culturas_sem_atrasar_antibiotico",
        efeitoEsperado: "Ideal: identificação etiológica sem atraso terapêutico.",
      },
      {
        intervencao: "atrasar_antibiotico_por_exames",
        efeitoEsperado: "Erro grave: piora do prognóstico e risco de sepse. ERRO CRÍTICO.",
      },
      {
        intervencao: "ventilacao_nao_invasiva",
        efeitoEsperado: "FR cai, SpO₂ melhora. Indicada se hipoxemia grave persistente sem contraindicação.",
      },
      {
        intervencao: "alta_precoce",
        efeitoEsperado: "Erro crítico com hipoxemia e/ou antibiótico não iniciado.",
      },
      {
        intervencao: "reavaliar",
        efeitoEsperado: "Checar SpO₂, FR, temperatura, PA, perfusão e resposta inicial.",
      },
    ],
  },

  reavaliacao: {
    tempoReavaliacaoMinutos: 30,
    parametrosReavaliar: [
      "SpO₂ (meta ≥ 92%)",
      "FR",
      "Temperatura",
      "PA sistólica e perfusão",
      "Nível de consciência",
      "Lactato de controle",
      "Resposta clínica ao antibiótico (expectativa: melhora em 24–48 h)",
    ],
    respostaAdequada: "SpO₂ ≥ 92%, FR < 28, temperatura em queda, PA estável, nível de consciência preservado.",
    respostaInadequada: "SpO₂ < 90%, FR > 30, hipotensão progressiva, rebaixamento, lactato em ascensão.",
    proximaCondutaSeMelhora: "Manter antibiótico EV, O₂, suporte e monitorização; planejar transição oral em 48–72 h.",
    proximaCondutaSePiora:
      "Considerar VNI se hipoxemia persistente; se falha da VNI ou choque → UTI e intubação.",
  },

  errosCriticos: {
    errosCriticosDiagnostico: [
      "Não reconhecer pneumonia grave e liberar como virose leve",
      "Não avaliar risco de sepse (PAM, lactato, nível de consciência)",
    ],
    errosCriticosConduta: [
      "Atrasar antibiótico para aguardar exames em paciente grave (aumenta mortalidade)",
      "Não ofertar oxigênio com SpO₂ < 90%",
      "Hidratação agressiva sem avaliar risco de congestão (especialmente em IC associada)",
    ],
    errosCriticosSeguranca: [
      "Não monitorar nível de consciência (sinal precoce de deterioração séptica)",
      "Ignorar lactato elevado (≥ 2 mmol/L = sepse, ≥ 4 mmol/L = choque séptico)",
    ],
    errosCriticosAlta: [
      "Alta com SpO₂ < 92% em ar ambiente",
      "Alta sem antibiótico iniciado",
      "Alta sem reavaliação ou plano de seguimento",
    ],
  },

  simulacao: {
    simulationProvider: "medix-rule-based",
    pulseReady: true,
    pulseScenarioId: "data/human/adult/scenarios/patient/Pneumonia.json",
    pulseScenarioIsPlaceholder: false,
    pulseAdapterNotes:
      "Mapear consolidação, shunt, V/Q e resposta ao O₂ e antibiótico (via carga inflamatória) para parâmetros Pulse.",
    physiologicModelTags: ["respiratory", "infection", "hypoxemia", "sepsis", "consolidation", "gas-exchange"],
    pulseCompatibility: {
      conditionId: "pneumonia-severe-adult",
      compatibility: "strong",
      suggestedSimulationProvider: "hybrid",
      pulseScenarioCandidates: [
        "data/human/adult/scenarios/patient/Pneumonia.json",
        "data/human/adult/scenarios/patient/PneumoniaSevere.json",
        "data/human/adult/scenarios/patient/SepsisPneumonia.json",
      ],
      requiresMedixOverlay: true,
      pediatricSafetyAdapterRequired: false,
      notes: [
        "Pneumonia grave com hipoxemia, foco de consolidação e risco de sepse.",
        "Antibiótico precoce é regra clínica crítica avaliada pela rubrica MEDIX, não pelo Pulse.",
        "Pulse modela shunt/V-Q e resposta ao O₂; MEDIX cobre comunicação, anamnese e raciocínio.",
      ],
    },
  },

  rubricaId: "rubrica-dynamic-severe-pneumonia-adult-001",
};

// ============================================================================
// RUBRICA (mesmo arquivo do caso) — total 20, 6 domínios obrigatórios.
// ============================================================================
export const rubricaDynamicSeverePneumoniaAdult001: DynamicRubric = {
  rubricaId: "rubrica-dynamic-severe-pneumonia-adult-001",
  caseId: "dynamic-severe-pneumonia-adult-001",
  totalPontos: 20,
  dominios: [
    {
      nome: "Comunicação",
      pontos: 2,
      criterios: [
        {
          id: "pnm-com-apresentacao",
          descricao: "Apresentou-se e acolheu o paciente febril e dispneico.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "comunicacao",
          referenciasCaso: ["comunicacao.itensEsperados"],
          aliasesAceitos: ["apresent", "acolh", "tranquiliz"],
        },
        {
          id: "pnm-com-explicou",
          descricao: "Explicou a conduta e a importância do antibiótico precoce.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "comunicacao",
          referenciasCaso: ["comunicacao.itensEsperados"],
          aliasesAceitos: ["explic", "orient", "antibiótico"],
        },
      ],
    },
    {
      nome: "Anamnese",
      pontos: 4,
      criterios: [
        {
          id: "pnm-anm-febre-tosse",
          descricao: "Investigou febre, tosse e características do escarro.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["febre", "tosse", "escarro", "expectoração", "expectoracao"],
        },
        {
          id: "pnm-anm-dispneia-dor",
          descricao: "Investigou dispneia e dor torácica ventilatório-dependente.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["dispneia", "falta de ar", "dor torácica", "dor toracica", "torácica", "pleurítica"],
        },
        {
          id: "pnm-anm-comorbidades",
          descricao: "Investigou comorbidades relevantes e imunossupressão.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasImportantes"],
          aliasesAceitos: ["comorbidade", "imunossupress", "diabetes", "cardiopatia", "comorbidades"],
        },
        {
          id: "pnm-anm-alergias-vacinacao",
          descricao: "Investigou alergias, vacinação e uso recente de antibiótico.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["alergi", "vacin", "antibiótico", "antibiotico"],
        },
      ],
    },
    {
      nome: "Exame físico",
      pontos: 3,
      criterios: [
        {
          id: "pnm-exf-vitais-spo2",
          descricao: "Avaliou sinais vitais completos e saturação (SpO₂).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.manobrasObrigatorias"],
          aliasesAceitos: ["sinais vitais", "satura", "spo2", "oximetria", "temperatura"],
        },
        {
          id: "pnm-exf-ausculta-bilateral",
          descricao: "Realizou ausculta pulmonar bilateral (foco de crepitação/consolidação).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.manobrasObrigatorias", "exameFisico.achadosEsperados"],
          aliasesAceitos: ["ausculta", "crepitação", "crepita", "ausculta pulmonar", "murmúrio"],
        },
        {
          id: "pnm-exf-perfusao-consciencia",
          descricao: "Avaliou perfusão periférica e nível de consciência.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.manobrasObrigatorias", "exameFisico.sinaisGravidade"],
          aliasesAceitos: ["perfus", "consciência", "consciencia", "nível de consciência", "nivel de consciencia"],
        },
      ],
    },
    {
      nome: "Exames e monitorização",
      pontos: 3,
      criterios: [
        {
          id: "pnm-exm-rx-torax",
          descricao: "Solicitou radiografia de tórax.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameComplementar",
          referenciasCaso: ["exames.examesEssenciais"],
          aliasesAceitos: ["radiografia", "rx", "tórax", "torax", "rx tórax"],
        },
        {
          id: "pnm-exm-laboratorio",
          descricao: "Solicitou hemograma, PCR e função renal.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameComplementar",
          referenciasCaso: ["exames.examesEssenciais"],
          aliasesAceitos: ["hemograma", "pcr", "função renal", "funcao renal", "creatinina", "laborat"],
        },
        {
          id: "pnm-exm-gaso-lactato-culturas",
          descricao: "Solicitou gasometria e/ou lactato e/ou hemoculturas.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameComplementar",
          referenciasCaso: ["exames.examesEssenciais"],
          aliasesAceitos: ["gasometria", "lactato", "hemocultura", "culturas", "gaso"],
        },
      ],
    },
    {
      nome: "Raciocínio clínico",
      pontos: 4,
      criterios: [
        {
          id: "pnm-rac-reconhece-pac-grave",
          descricao: "Reconheceu PAC grave e iniciou O₂ e antibiótico.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "diagnostico",
          referenciasCaso: ["diagnostico.diagnosticoPrincipal", "intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["pneumonia grave", "pac grave", "pac-grave", "pneumonia adquirida"],
        },
        {
          id: "pnm-rac-considera-sepse",
          descricao: "Considerou sepse (lactato, hemoculturas ou avaliação sistêmica).",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "interpretacao",
          referenciasCaso: ["diagnostico.diagnosticosAceitos", "exames.examesEssenciais"],
          aliasesAceitos: ["sepse", "lactato", "hemocultura", "hipoperfus", "choque séptico"],
        },
        {
          id: "pnm-rac-nao-atrasa-antibiotico",
          descricao: "Não atrasou o antibiótico por exames.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "seguranca",
          referenciasCaso: ["errosCriticos.errosCriticosConduta", "intervencoes.intervencoesContraindicadas"],
          aliasesAceitos: ["antibiótico precoce", "sem atraso", "1 hora"],
          penalidadeSeAusente: 2,
          erroCriticoAssociado: "Atraso no antibiótico em pneumonia grave",
        },
        {
          id: "pnm-rac-sem-alta",
          descricao: "Não deu alta precoce com hipoxemia e/ou sem antibiótico.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "seguranca",
          referenciasCaso: ["fisiologia.criteriosAltaSegura", "errosCriticos.errosCriticosAlta"],
          aliasesAceitos: ["não dar alta", "internação", "observação"],
          erroCriticoAssociado: "Alta insegura em pneumonia grave",
        },
      ],
    },
    {
      nome: "Conduta e reavaliação",
      pontos: 4,
      criterios: [
        {
          id: "pnm-cond-oxigenio",
          descricao: "Administrou oxigênio suplementar (SpO₂ alvo ≥ 92%).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["oxigênio", "o2", "oxigenio", "suplementar"],
        },
        {
          id: "pnm-cond-antibiotico-precoce",
          descricao: "Administrou antibiótico precoce (≤ 1 hora).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["antibiótico", "antibiotico", "atb precoce", "amoxicilina", "ceftriaxona", "azitromicina"],
          erroCriticoAssociado: "Antibiótico não administrado na 1ª hora",
        },
        {
          id: "pnm-cond-suporte",
          descricao: "Realizou suporte (antitérmico e/ou hidratação cautelosa).",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["antitérmico", "antitermico", "paracetamol", "dipirona", "hidratação", "hidratacao"],
        },
        {
          id: "pnm-cond-reavaliou-internou",
          descricao: "Reavaliou a resposta e indicou internação.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "reavaliacao",
          referenciasCaso: ["reavaliacao.parametrosReavaliar", "fisiologia.criteriosInternacao"],
          aliasesAceitos: ["reavaliou", "internação", "internacao", "hospital", "observação"],
        },
      ],
    },
  ],
};
