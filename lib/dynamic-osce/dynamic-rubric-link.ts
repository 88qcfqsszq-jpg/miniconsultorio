// ============================================================================
// Casos OSCE Dinâmicos — Beta · RUBRICA DINÂMICA (contrato Fase 2, isolada)
// ----------------------------------------------------------------------------
// Rubrica de 20 pontos VIVE AQUI, dentro do módulo dinâmico. NÃO importa nem
// altera lib/healthbench nem as rubricas OSCE principais. Cada critério declara
// tipoEvidencia e referenciasCaso (campos do caso que o sustentam).
// ============================================================================

import type { DynamicRubric } from "./types";
import { rubricaDynamicTensionPneumothoraxAdult001 } from "./cases/pneumotorax-hipertensivo-adulto";
import { rubricaDynamicCopdExacerbationAdult001 } from "./cases/dpoc-exacerbado-adulto";
import { rubricaDynamicSeverePneumoniaAdult001 } from "./cases/pneumonia-grave-adulto";

/** Rubrica dinâmica do piloto de crise asmática grave (total = 20). */
export const RUBRICA_ASMA_GRAVE_PILOTO: DynamicRubric = {
  rubricaId: "rubrica-asma-grave-piloto",
  caseId: "dynamic-asthma-severe-adult-001",
  totalPontos: 20,
  dominios: [
    {
      nome: "Comunicação",
      pontos: 2,
      criterios: [
        {
          id: "com-apresentacao",
          descricao: "Apresentou-se e tranquilizou o paciente dispneico.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "comunicacao",
          referenciasCaso: ["comunicacao.itensEsperados"],
          aliasesAceitos: ["apresentou", "tranquilizou", "acolheu"],
        },
        {
          id: "com-explicou",
          descricao: "Explicou a conduta/gravidade em linguagem acessível.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "comunicacao",
          referenciasCaso: ["comunicacao.itensEsperados"],
          aliasesAceitos: ["explicou", "orientou"],
        },
      ],
    },
    {
      nome: "Anamnese",
      pontos: 4,
      criterios: [
        {
          id: "anm-inicio",
          descricao: "Caracterizou início da falta de ar e chiado.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["início", "inicio", "chiado", "dispneia"],
        },
        {
          id: "anm-broncodilatador",
          descricao: "Investigou uso prévio de broncodilatador.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["broncodilatador", "bombinha", "salbutamol prévio"],
        },
        {
          id: "anm-internacoes",
          descricao: "Investigou internações/intubação prévias.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias", "anamnese.redFlagsAnamnese"],
          aliasesAceitos: ["interna", "intuba", "uti prévia"],
        },
        {
          id: "anm-gatilhos",
          descricao: "Investigou gatilhos, febre/infecção ou alergias.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasImportantes"],
          aliasesAceitos: ["gatilho", "alergi", "febre", "infec"],
        },
      ],
    },
    {
      nome: "Exame físico",
      pontos: 3,
      criterios: [
        {
          id: "exf-vitais",
          descricao: "Avaliou sinais vitais e saturação.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.manobrasObrigatorias"],
          aliasesAceitos: ["sinais vitais", "satura", "spo2", "oximetria"],
        },
        {
          id: "exf-ausculta",
          descricao: "Avaliou padrão respiratório e ausculta pulmonar.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.manobrasObrigatorias", "exameFisico.achadosEsperados"],
          aliasesAceitos: ["ausculta", "padrão respiratório", "padrao respiratorio", "sibilos"],
        },
        {
          id: "exf-esforco",
          descricao: "Avaliou esforço/musculatura acessória e fala.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.sinaisGravidade"],
          aliasesAceitos: ["musculatura", "fala", "esforço", "esforco", "tiragem"],
        },
      ],
    },
    {
      nome: "Exames e monitorização",
      pontos: 3,
      criterios: [
        {
          id: "exm-oximetria",
          descricao: "Monitorou oximetria de pulso.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameComplementar",
          referenciasCaso: ["exames.examesEssenciais"],
          aliasesAceitos: ["oximetria", "spo2", "saturação"],
        },
        {
          id: "exm-gasometria",
          descricao: "Solicitou gasometria na crise grave.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "exameComplementar",
          referenciasCaso: ["exames.examesEssenciais", "exames.examesComplementaresAceitos"],
          aliasesAceitos: ["gasometria", "gaso"],
        },
        {
          id: "exm-reavaliacao",
          descricao: "Reavaliou/monitorizou a resposta.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "reavaliacao",
          referenciasCaso: ["reavaliacao.parametrosReavaliar"],
          aliasesAceitos: ["reavaliar", "reavaliação", "monitorizar"],
        },
      ],
    },
    {
      nome: "Raciocínio clínico",
      pontos: 4,
      criterios: [
        {
          id: "rac-reconhece",
          descricao: "Reconheceu crise asmática grave.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "diagnostico",
          referenciasCaso: ["diagnostico.diagnosticoPrincipal"],
          aliasesAceitos: ["asma grave", "crise asmática grave", "exacerbação grave"],
        },
        {
          id: "rac-gravidade",
          descricao: "Avaliou gravidade pela fala, FR, SpO₂ e esforço.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "interpretacao",
          referenciasCaso: ["fisiologia.criteriosInstabilidade", "exameFisico.sinaisGravidade"],
          aliasesAceitos: ["gravidade", "fala entrecortada", "hipoxemia", "taquipneia"],
        },
        {
          id: "rac-sem-alta",
          descricao: "Não deu alta com hipoxemia/esforço mantidos.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "seguranca",
          referenciasCaso: ["fisiologia.criteriosAltaSegura", "errosCriticos.errosCriticosAlta"],
          aliasesAceitos: ["alta segura", "não dar alta", "manter observação"],
          penalidadeSeAusente: 2,
          erroCriticoAssociado: "Alta insegura em crise grave",
        },
        {
          id: "rac-escalona",
          descricao: "Escalonou (ipratrópio/magnésio) na crise grave/refratária.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesDeResgate", "fisiologia.criteriosInternacao"],
          aliasesAceitos: ["ipratrópio", "magnésio", "internação", "uti"],
        },
      ],
    },
    {
      nome: "Conduta e reavaliação",
      pontos: 4,
      criterios: [
        {
          id: "cond-oxigenio",
          descricao: "Administrou oxigênio.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["oxigênio", "o2", "oxigenioterapia"],
        },
        {
          id: "cond-saba",
          descricao: "Administrou broncodilatador de curta ação.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["salbutamol", "saba", "broncodilatador"],
        },
        {
          id: "cond-corticoide",
          descricao: "Prescreveu corticoide sistêmico.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["corticoide", "corticosteroide", "prednisona", "hidrocortisona"],
        },
        {
          id: "cond-reavaliou",
          descricao: "Reavaliou a resposta com melhora objetiva.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "reavaliacao",
          referenciasCaso: ["reavaliacao.parametrosReavaliar", "fisiologia.criteriosMelhora"],
          aliasesAceitos: ["reavaliou", "melhora objetiva", "resposta"],
        },
      ],
    },
  ],
};

const REGISTRO_RUBRICAS: Record<string, DynamicRubric> = {
  "rubrica-asma-grave-piloto": RUBRICA_ASMA_GRAVE_PILOTO,
  "rubrica-dynamic-tension-pneumothorax-adult-001": rubricaDynamicTensionPneumothoraxAdult001,
  "rubrica-dynamic-copd-exacerbation-adult-001": rubricaDynamicCopdExacerbationAdult001,
  "rubrica-dynamic-severe-pneumonia-adult-001": rubricaDynamicSeverePneumoniaAdult001,
};

/** Liga um caso (via rubricaId) à sua rubrica dinâmica. Null se não existir. */
export function linkRubrica(rubricaId: string): DynamicRubric | null {
  return REGISTRO_RUBRICAS[rubricaId] ?? null;
}
