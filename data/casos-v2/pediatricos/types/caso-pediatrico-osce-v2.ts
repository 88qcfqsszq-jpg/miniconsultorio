export type FaixaEtariaPediatrica =
  | "neonato"
  | "lactente"
  | "pré-escolar"
  | "escolar"
  | "adolescente";

export type TipoEstacaoOSCE =
  | "anamnese"
  | "exame_fisico"
  | "integrada"
  | "procedimento"
  | "comunicacao"
  | "urgencia";

export type NivelCaso =
  | "iniciante"
  | "intermediario"
  | "avancado";

export type PrioridadeExame =
  | "obrigatorio_imediato"
  | "obrigatorio"
  | "importante"
  | "condicional"
  | "opcional"
  | "nao_indicado"
  | "nao_prioritario_na_crise";

export type GravidadeClinica =
  | "sem_sinais_de_gravidade"
  | "leve"
  | "moderado"
  | "grave"
  | "risco_iminente"
  | "emergencia";

export type DestinoPaciente =
  | "alta_com_orientacao"
  | "observacao"
  | "internacao_enfermaria"
  | "internacao_uti"
  | "encaminhamento_urgente"
  | "acionar_rede_protecao";

export interface CasoPediatricoOSCEV2 {
  id: string;
  codigo: string;
  versao: string;

  titulo: string;
  sistema: string;
  tema: string;
  subtema?: string;

  nivel: NivelCaso | string;
  tipo_estacao: TipoEstacaoOSCE | string;
  tipoPaciente: "pediatrico";
  tempo_osce_minutos: number;

  objetivo_pedagogico: string;

  dados_visiveis_ao_estudante: Record<string, any>;
  paciente: Record<string, any>;
  respostasPaciente: Record<string, string>;
  dados_ocultos_do_sistema: Record<string, any>;

  sinaisVitaisPediatricos: {
    entrada: Record<string, any>;
    referenciaPorIdade: Record<string, any>;
    interpretacaoInicial: string;
    evolucao: Record<string, any>;
    criteriosAltaOuSeguimento: Record<string, any>;
  };

  antropometria?: Record<string, any>;
  desenvolvimentoNeuropsicomotor?: Record<string, any>;

  exameFisicoPediatrico: Record<string, any>;

  exames: Record<string, any>;

  prescricaoPediatrica?: Record<string, any>;
  protecaoInfantil?: Record<string, any>;
  arbovirosePediatrica?: Record<string, any>;
  cardiologiaPediatrica?: Record<string, any>;

  diagnostico: Record<string, any>;
  condutaEsperada: Record<string, any>;
  criteriosGravidadePediatricos: Record<string, any>;
  errosCriticos: any[];

  feedbackDetalhado: {
    escala: { total: 20; minimoAprovacao: number };
    dominios: Array<{ nome: string; pontos: number; criterios: Array<Record<string, any>> }>;
    penalidadesAutomaticas: Array<Record<string, any>>;
  };

  modeloSOAP: Record<string, any>;
  feedbackModelo: Record<string, any>;
  checklistOcultoExaminador: Record<string, any>;

  temaOSCE: string;
  subtopicosOSCE: any[];
  diagnosticoCorreto: string;
  ativo: boolean;
}
