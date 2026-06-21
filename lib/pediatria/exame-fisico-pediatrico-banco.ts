// Banco de dados global para Exame Físico Pediátrico
// Define as 15 regiões, hotspots calibrados e ações por faixa etária

export type FaixaEtariaPediatrica = "lactente" | "pre_escolar" | "escolar";

export type MetodoExame =
  | "inspecao"
  | "palpacao"
  | "percussao"
  | "ausculta"
  | "medida"
  | "avaliacao";

// ============================================================================
// INTERFACES
// ============================================================================

export interface HotspotExamePediatrico {
  x: number; // left %
  y: number; // top %
  width: number; // width %
  height: number; // height %
}

export interface ImagemExamePediatrico {
  tipo: "tecnica" | "achado_clinico" | "comparativa" | "exame_complementar" | "anatomia" | "alerta";
  titulo: string;
  src: string;
  legenda?: string;
  alt?: string;
}

export interface AchadoExamePediatrico {
  id: string;
  casoId: string;
  regiaoId: string;
  acaoId: string;
  titulo: string;
  descricao: string;
  normal: boolean;
  gravidade?: "normal" | "leve" | "moderada" | "grave";
  origem:
    | "caso"
    | "exame_fisico_interativo"
    | "exame_fisico_correto"
    | "exameFisicoCorreto"
    | "sinais_vitais"
    | "fallback_normal"
    | "fallback_generico";
  campo_original?: string;
  sistemaClinico?: string;
  imagens?: ImagemExamePediatrico[];
  imagemAchadoId?: string;
}

export interface AcaoExamePediatrico {
  id: string;
  label: string;
  metodo: MetodoExame;
  instrucao?: string;
  faixas: FaixaEtariaPediatrica[];
}

export interface RegiaoExamePediatrico {
  id: string;
  label: string;
  descricao: string;
  sistemaClinico: string;
  hotspots: Record<FaixaEtariaPediatrica, HotspotExamePediatrico>;
  acoes: AcaoExamePediatrico[];
}

// ============================================================================
// FAIXAS ETÁRIAS
// ============================================================================

export const FAIXAS_ETARIAS_PEDIATRICAS = {
  lactente: {
    label: "Lactente",
    imagemFrontal: "/images/pediatria/corpo/lactente-frontal.png",
    faixaIdade: "até 2 anos",
  },
  pre_escolar: {
    label: "Pré-escolar",
    imagemFrontal: "/images/pediatria/corpo/pre-escolar-frontal.png",
    faixaIdade: "2 a 5 anos",
  },
  escolar: {
    label: "Escolar",
    imagemFrontal: "/images/pediatria/corpo/escolar-frontal.png",
    faixaIdade: "6 a 12 anos",
  },
};

// ============================================================================
// HOTSPOTS CALIBRADOS POR FAIXA ETÁRIA
// ============================================================================

const HOTSPOTS_LACTENTE: Record<string, HotspotExamePediatrico> = {
  estado_geral: { x: 45, y: 24, width: 10, height: 6 },
  antropometria_crescimento: { x: 45, y: 55, width: 10, height: 6 },
  cabeca_perimetro: { x: 45, y: 7, width: 10, height: 6 },
  face_olhos: { x: 45, y: 14, width: 10, height: 6 },
  orl_orofaringe: { x: 45, y: 19, width: 10, height: 6 },
  pescoco_linfonodos: { x: 45, y: 25, width: 10, height: 6 },
  torax_respiratorio: { x: 45, y: 36, width: 10, height: 6 },
  precordio_cardiovascular: { x: 42, y: 38, width: 10, height: 6 },
  pressao_arterial: { x: 27, y: 39, width: 10, height: 6 },
  abdome: { x: 45, y: 51, width: 10, height: 6 },
  figado: { x: 39, y: 49, width: 10, height: 6 },
  baco: { x: 52, y: 49, width: 10, height: 6 },
  pele_mucosas: { x: 59, y: 33, width: 10, height: 6 },
  membros_perfusao: { x: 45, y: 73, width: 10, height: 6 },
  desenvolvimento: { x: 45, y: 82, width: 10, height: 6 },
};

const HOTSPOTS_PRE_ESCOLAR: Record<string, HotspotExamePediatrico> = {
  estado_geral: { x: 43, y: 22, width: 10, height: 6 },
  antropometria_crescimento: { x: 43, y: 60, width: 10, height: 6 },
  cabeca_perimetro: { x: 43, y: 6, width: 10, height: 6 },
  face_olhos: { x: 43, y: 11, width: 10, height: 6 },
  orl_orofaringe: { x: 43, y: 16, width: 10, height: 6 },
  pescoco_linfonodos: { x: 43, y: 22, width: 10, height: 6 },
  torax_respiratorio: { x: 43, y: 33, width: 10, height: 6 },
  precordio_cardiovascular: { x: 40, y: 35, width: 10, height: 6 },
  pressao_arterial: { x: 25, y: 37, width: 10, height: 6 },
  abdome: { x: 43, y: 49, width: 10, height: 6 },
  figado: { x: 38, y: 47, width: 10, height: 6 },
  baco: { x: 49, y: 47, width: 10, height: 6 },
  pele_mucosas: { x: 56, y: 31, width: 10, height: 6 },
  membros_perfusao: { x: 43, y: 72, width: 10, height: 6 },
  desenvolvimento: { x: 43, y: 84, width: 10, height: 6 },
};

const HOTSPOTS_ESCOLAR: Record<string, HotspotExamePediatrico> = {
  estado_geral: { x: 45, y: 22, width: 10, height: 6 },
  antropometria_crescimento: { x: 45, y: 61, width: 10, height: 6 },
  cabeca_perimetro: { x: 45, y: 6, width: 10, height: 6 },
  face_olhos: { x: 45, y: 11, width: 10, height: 6 },
  orl_orofaringe: { x: 45, y: 16, width: 10, height: 6 },
  pescoco_linfonodos: { x: 45, y: 21, width: 10, height: 6 },
  torax_respiratorio: { x: 45, y: 32, width: 10, height: 6 },
  precordio_cardiovascular: { x: 42, y: 34, width: 10, height: 6 },
  pressao_arterial: { x: 30, y: 36, width: 10, height: 6 },
  abdome: { x: 45, y: 48, width: 10, height: 6 },
  figado: { x: 40, y: 46, width: 10, height: 6 },
  baco: { x: 51, y: 46, width: 10, height: 6 },
  pele_mucosas: { x: 58, y: 31, width: 10, height: 6 },
  membros_perfusao: { x: 45, y: 72, width: 10, height: 6 },
  desenvolvimento: { x: 45, y: 84, width: 10, height: 6 },
};

// ============================================================================
// AÇÕES POR REGIÃO
// ============================================================================

const ACOES_ESTADO_GERAL: AcaoExamePediatrico[] = [
  { id: "avaliar_estado_geral", label: "Avaliar estado geral", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_nivel_atividade", label: "Nível de atividade", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_consciencia_responsividade", label: "Consciência e responsividade", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_interacao_com_responsavel", label: "Interação com responsável", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_sinais_gravidade", label: "Sinais de gravidade", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_comportamento_durante_exame", label: "Comportamento durante exame", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_ANTROPOMETRIA: AcaoExamePediatrico[] = [
  { id: "medir_peso", label: "Medir peso", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "medir_estatura_ou_comprimento", label: "Medir estatura/comprimento", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "medir_perimetro_cefalico", label: "Medir perímetro cefálico", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "medir_circunferencia_braquial", label: "Circunferência braquial", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "medir_circunferencia_abdominal", label: "Circunferência abdominal", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_curva_de_crescimento", label: "Avaliar curva de crescimento", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_ganho_ponderal", label: "Ganho ponderal", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_CABECA_LACTENTE: AcaoExamePediatrico[] = [
  { id: "avaliar_formato_cranio", label: "Formato do crânio", metodo: "inspecao", faixas: ["lactente"] },
  { id: "medir_perimetro_cefalico", label: "Perímetro cefálico", metodo: "medida", faixas: ["lactente"] },
  { id: "avaliar_fontanela", label: "Fontanela", metodo: "palpacao", faixas: ["lactente"] },
  { id: "avaliar_suturas_cranianas", label: "Suturas cranianas", metodo: "palpacao", faixas: ["lactente"] },
  { id: "avaliar_sinais_trauma_cranio", label: "Sinais de trauma craniano", metodo: "inspecao", faixas: ["lactente"] },
];

const ACOES_CABECA_OUTROS: AcaoExamePediatrico[] = [
  { id: "avaliar_formato_cranio", label: "Formato do crânio", metodo: "inspecao", faixas: ["pre_escolar", "escolar"] },
  { id: "medir_perimetro_cefalico", label: "Perímetro cefálico", metodo: "medida", faixas: ["pre_escolar", "escolar"] },
  { id: "avaliar_sinais_trauma_cranio", label: "Sinais de trauma craniano", metodo: "inspecao", faixas: ["pre_escolar", "escolar"] },
];

const ACOES_FACE_OLHOS: AcaoExamePediatrico[] = [
  { id: "avaliar_palidez_conjuntival", label: "Palidez conjuntival", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_cianose_central", label: "Cianose central", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_sinais_desidratacao", label: "Sinais de desidratação", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_conjuntivite", label: "Conjuntivite", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_ictericia_escleral", label: "Icterícia escleral", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_face_toxemica_ou_abatida", label: "Face tóxêmica ou abatida", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_ORL: AcaoExamePediatrico[] = [
  { id: "avaliar_orofaringe", label: "Orofaringe", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_amigdalas", label: "Amígdalas", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_mucosa_oral", label: "Mucosa oral", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_congestao_nasal", label: "Congestão nasal", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_secrecao_nasal", label: "Secreção nasal", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_sinais_otite", label: "Sinais de otite", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_manchas_koplik", label: "Manchas de Koplik", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_tosse_coriza_conjuntivite", label: "Tríade tosse-coriza-conjuntivite", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_PESCOCO: AcaoExamePediatrico[] = [
  { id: "palpar_linfonodos_cervicais", label: "Linfonodos cervicais", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_cadeia_submentoniana", label: "Cadeia submentoniana", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_cadeia_submandibular", label: "Cadeia submandibular", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_cervical_anterior", label: "Cervical anterior", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_cervical_posterior", label: "Cervical posterior", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_supraclaviculares", label: "Supraclaviculares", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_occipitais", label: "Occipitais", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "descrever_caracteristicas_linfonodos", label: "Características de linfonodos", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_rigidez_de_nuca", label: "Rigidez de nuca", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_TORAX: AcaoExamePediatrico[] = [
  { id: "avaliar_frequencia_respiratoria", label: "Frequência respiratória", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_padrao_respiratorio", label: "Padrão respiratório", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_tiragens", label: "Tiragens", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_expansibilidade_toracica", label: "Expansibilidade torácica", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_sinais_esforco_respiratorio", label: "Sinais de esforço respiratório", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "auscultar_pulmoes_anterior", label: "Ausculta anterior", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "auscultar_pulmoes_posterior", label: "Ausculta posterior", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_murmurio_vesicular", label: "Murmúrio vesicular", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_sibilos", label: "Sibilos", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_crepitacoes", label: "Crepitações", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_roncos", label: "Roncos", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "percutir_torax", label: "Percussão torácica", metodo: "percussao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_submacicez", label: "Submacicez", metodo: "percussao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_PRECORDIO: AcaoExamePediatrico[] = [
  { id: "inspecionar_precorcio", label: "Inspecionar precórdio", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_precorcio", label: "Palpar precórdio", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_ictus", label: "Avaliar ictus cordis", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "auscultar_foco_aortico", label: "Foco aórtico", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "auscultar_foco_pulmonar", label: "Foco pulmonar", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "auscultar_foco_tricuspide", label: "Foco tricúspide", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "auscultar_foco_mitral", label: "Foco mitral", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_bulhas", label: "Bulhas cardíacas", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_ritmo_cardiaco", label: "Ritmo cardíaco", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_sopro", label: "Sopro cardíaco", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_atrito_pericardico", label: "Atrito pericárdico", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_precorcio_hiperdinamico", label: "Precórdio hiperdinâmico", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_PRESSAO_ARTERIAL: AcaoExamePediatrico[] = [
  { id: "escolher_manguito_adequado", label: "Escolher manguito adequado", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "posicionar_crianca_para_pa", label: "Posicionar criança", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "posicionar_braco_altura_coracao", label: "Posicionar braço ao nível cardíaco", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "aferir_pressao_arterial", label: "Aferir pressão arterial", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "classificar_pressao_por_percentil", label: "Classificar PA por percentil", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "registrar_braco_utilizado", label: "Registrar braço utilizado", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_ABDOME: AcaoExamePediatrico[] = [
  { id: "inspecionar_abdome", label: "Inspecionar abdome", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "auscultar_ruidos_hidroaereos", label: "Auscultar ruídos", metodo: "ausculta", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_abdome_superficial", label: "Palpação superficial", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_abdome_profundo", label: "Palpação profunda", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_dor_abdominal", label: "Dor abdominal", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_defesa_abdominal", label: "Defesa abdominal", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "percutir_abdome", label: "Percussão abdominal", metodo: "percussao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_massas_abdominais", label: "Massas abdominais", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_FIGADO: AcaoExamePediatrico[] = [
  { id: "palpar_figado", label: "Palpar fígado", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "pesquisar_hepatomegalia", label: "Pesquisar hepatomegalia", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "medir_borda_hepatica", label: "Medir borda hepática", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_consistencia_figado", label: "Consistência do fígado", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_dor_hepatica", label: "Dor hepática", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "realizar_manoobra_lemos_torres", label: "Manobra de Lemos Torres", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "realizar_manoobra_mathieu", label: "Manobra de Mathieu", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_BACO: AcaoExamePediatrico[] = [
  { id: "palpar_baco", label: "Palpar baço", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "pesquisar_esplenomegalia", label: "Pesquisar esplenomegalia", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_borda_esplenica", label: "Borda esplênica", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_hepatoesplenomegalia", label: "Hepatoesplenomegalia", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_PELE: AcaoExamePediatrico[] = [
  { id: "avaliar_hidratacao", label: "Hidratação", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_turgor_cutaneo", label: "Turgor cutâneo", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_exantema", label: "Exantema", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_lesoes_elementares", label: "Lesões elementares", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_petequias", label: "Petéquias", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_equimoses", label: "Equimoses", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_hematomas", label: "Hematomas", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_ictericia_cutanea", label: "Icterícia cutânea", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_palidez_cutanea", label: "Palidez cutânea", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_sinais_maus_tratos", label: "Sinais de maus-tratos", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_distribuicao_lesoes", label: "Distribuição de lesões", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_MEMBROS: AcaoExamePediatrico[] = [
  { id: "avaliar_perfusao_periferica", label: "Perfusão periférica", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_tempo_enchimento_capilar", label: "Tempo de enchimento capilar", metodo: "medida", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "palpar_pulsos_perifericos", label: "Pulsos periféricos", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_edema", label: "Edema", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_baqueteamento_digital", label: "Baqueteamento digital", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_cianose_extremidades", label: "Cianose em extremidades", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_equimoses_membros", label: "Equimoses em membros", metodo: "inspecao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_deformidades_ou_fraturas", label: "Deformidades ou fraturas", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_dor_a_palpacao_membros", label: "Dor à palpação", metodo: "palpacao", faixas: ["lactente", "pre_escolar", "escolar"] },
  { id: "avaliar_teste_do_laco", label: "Teste do laço", metodo: "avaliacao", faixas: ["lactente", "pre_escolar", "escolar"] },
];

const ACOES_DESENVOLVIMENTO_LACTENTE: AcaoExamePediatrico[] = [
  { id: "avaliar_marcos_motores", label: "Marcos motores", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "avaliar_sustento_cefalico", label: "Sustento cefálico", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "avaliar_sentado_sem_apoio", label: "Sentar sem apoio", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "avaliar_engatinhar", label: "Engatinhar", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "avaliar_pinca", label: "Pinça", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "avaliar_balbucio", label: "Balbúcio", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "avaliar_interacao_social", label: "Interação social", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "comparar_marcos_com_idade", label: "Comparar marcos com idade", metodo: "avaliacao", faixas: ["lactente"] },
  { id: "avaliar_sinais_alerta_desenvolvimento", label: "Sinais de alerta", metodo: "avaliacao", faixas: ["lactente"] },
];

const ACOES_DESENVOLVIMENTO_PRE_ESCOLAR: AcaoExamePediatrico[] = [
  { id: "avaliar_marcos_motores", label: "Marcos motores", metodo: "avaliacao", faixas: ["pre_escolar"] },
  { id: "avaliar_marcha", label: "Marcha", metodo: "avaliacao", faixas: ["pre_escolar"] },
  { id: "avaliar_linguagem", label: "Linguagem", metodo: "avaliacao", faixas: ["pre_escolar"] },
  { id: "avaliar_interacao_social", label: "Interação social", metodo: "avaliacao", faixas: ["pre_escolar"] },
  { id: "avaliar_brincar", label: "Brincar", metodo: "avaliacao", faixas: ["pre_escolar"] },
  { id: "avaliar_coordenacao", label: "Coordenação", metodo: "avaliacao", faixas: ["pre_escolar"] },
  { id: "comparar_marcos_com_idade", label: "Comparar marcos com idade", metodo: "avaliacao", faixas: ["pre_escolar"] },
  { id: "avaliar_sinais_alerta_desenvolvimento", label: "Sinais de alerta", metodo: "avaliacao", faixas: ["pre_escolar"] },
];

const ACOES_DESENVOLVIMENTO_ESCOLAR: AcaoExamePediatrico[] = [
  { id: "avaliar_desempenho_funcional", label: "Desempenho funcional", metodo: "avaliacao", faixas: ["escolar"] },
  { id: "avaliar_marcha", label: "Marcha", metodo: "avaliacao", faixas: ["escolar"] },
  { id: "avaliar_linguagem_comunicacao", label: "Linguagem e comunicação", metodo: "avaliacao", faixas: ["escolar"] },
  { id: "avaliar_interacao_social", label: "Interação social", metodo: "avaliacao", faixas: ["escolar"] },
  { id: "avaliar_comportamento", label: "Comportamento", metodo: "avaliacao", faixas: ["escolar"] },
  { id: "comparar_marcos_com_idade", label: "Comparar marcos com idade", metodo: "avaliacao", faixas: ["escolar"] },
  { id: "avaliar_sinais_alerta_desenvolvimento", label: "Sinais de alerta", metodo: "avaliacao", faixas: ["escolar"] },
];

// ============================================================================
// REGIÕES DO EXAME PEDIÁTRICO
// ============================================================================

export const REGIOES_EXAME_PEDIATRICO: RegiaoExamePediatrico[] = [
  {
    id: "estado_geral",
    label: "Estado Geral",
    descricao: "Avaliação global da criança",
    sistemaClinico: "Geral",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.estado_geral,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.estado_geral,
      escolar: HOTSPOTS_ESCOLAR.estado_geral,
    },
    acoes: ACOES_ESTADO_GERAL,
  },
  {
    id: "antropometria_crescimento",
    label: "Antropometria e Crescimento",
    descricao: "Medidas de peso, altura, perímetros",
    sistemaClinico: "Geral",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.antropometria_crescimento,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.antropometria_crescimento,
      escolar: HOTSPOTS_ESCOLAR.antropometria_crescimento,
    },
    acoes: ACOES_ANTROPOMETRIA,
  },
  {
    id: "cabeca_perimetro",
    label: "Cabeça e Perímetro",
    descricao: "Formato, fontanela, suturas e perímetro cefálico",
    sistemaClinico: "Neurológico",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.cabeca_perimetro,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.cabeca_perimetro,
      escolar: HOTSPOTS_ESCOLAR.cabeca_perimetro,
    },
    acoes: [...ACOES_CABECA_LACTENTE, ...ACOES_CABECA_OUTROS],
  },
  {
    id: "face_olhos",
    label: "Face e Olhos",
    descricao: "Expressão facial, olhos, palidez, cianose",
    sistemaClinico: "Geral",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.face_olhos,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.face_olhos,
      escolar: HOTSPOTS_ESCOLAR.face_olhos,
    },
    acoes: ACOES_FACE_OLHOS,
  },
  {
    id: "orl_orofaringe",
    label: "ORL e Orofaringe",
    descricao: "Boca, garganta, amígdalas, nariz",
    sistemaClinico: "ORL",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.orl_orofaringe,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.orl_orofaringe,
      escolar: HOTSPOTS_ESCOLAR.orl_orofaringe,
    },
    acoes: ACOES_ORL,
  },
  {
    id: "pescoco_linfonodos",
    label: "Pescoço e Linfonodos",
    descricao: "Pescoço, linfonodos cervicais, rigidez",
    sistemaClinico: "Geral",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.pescoco_linfonodos,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.pescoco_linfonodos,
      escolar: HOTSPOTS_ESCOLAR.pescoco_linfonodos,
    },
    acoes: ACOES_PESCOCO,
  },
  {
    id: "torax_respiratorio",
    label: "Tórax Respiratório",
    descricao: "Frequência, padrão, ausculta, percussão",
    sistemaClinico: "Respiratório",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.torax_respiratorio,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.torax_respiratorio,
      escolar: HOTSPOTS_ESCOLAR.torax_respiratorio,
    },
    acoes: ACOES_TORAX,
  },
  {
    id: "precordio_cardiovascular",
    label: "Precórdio Cardiovascular",
    descricao: "Inspeção, palpação, ausculta cardíaca",
    sistemaClinico: "Cardiovascular",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.precordio_cardiovascular,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.precordio_cardiovascular,
      escolar: HOTSPOTS_ESCOLAR.precordio_cardiovascular,
    },
    acoes: ACOES_PRECORDIO,
  },
  {
    id: "pressao_arterial",
    label: "Pressão Arterial",
    descricao: "Aferição de PA com manguito adequado",
    sistemaClinico: "Cardiovascular",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.pressao_arterial,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.pressao_arterial,
      escolar: HOTSPOTS_ESCOLAR.pressao_arterial,
    },
    acoes: ACOES_PRESSAO_ARTERIAL,
  },
  {
    id: "abdome",
    label: "Abdome",
    descricao: "Inspeção, ausculta, palpação, percussão",
    sistemaClinico: "Abdominal",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.abdome,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.abdome,
      escolar: HOTSPOTS_ESCOLAR.abdome,
    },
    acoes: ACOES_ABDOME,
  },
  {
    id: "figado",
    label: "Fígado",
    descricao: "Palpação, borda hepática, hepatomegalia",
    sistemaClinico: "Abdominal",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.figado,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.figado,
      escolar: HOTSPOTS_ESCOLAR.figado,
    },
    acoes: ACOES_FIGADO,
  },
  {
    id: "baco",
    label: "Baço",
    descricao: "Palpação, borda esplênica, esplenomegalia",
    sistemaClinico: "Abdominal",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.baco,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.baco,
      escolar: HOTSPOTS_ESCOLAR.baco,
    },
    acoes: ACOES_BACO,
  },
  {
    id: "pele_mucosas",
    label: "Pele e Mucosas",
    descricao: "Hidratação, exantema, lesões, equimoses",
    sistemaClinico: "Dermatológico",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.pele_mucosas,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.pele_mucosas,
      escolar: HOTSPOTS_ESCOLAR.pele_mucosas,
    },
    acoes: ACOES_PELE,
  },
  {
    id: "membros_perfusao",
    label: "Membros e Perfusão",
    descricao: "Pulsos, perfusão, edema, deformidades",
    sistemaClinico: "Vascular",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.membros_perfusao,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.membros_perfusao,
      escolar: HOTSPOTS_ESCOLAR.membros_perfusao,
    },
    acoes: ACOES_MEMBROS,
  },
  {
    id: "desenvolvimento",
    label: "Desenvolvimento",
    descricao: "Marcos motores, linguagem, interação social",
    sistemaClinico: "Neurológico",
    hotspots: {
      lactente: HOTSPOTS_LACTENTE.desenvolvimento,
      pre_escolar: HOTSPOTS_PRE_ESCOLAR.desenvolvimento,
      escolar: HOTSPOTS_ESCOLAR.desenvolvimento,
    },
    acoes: [...ACOES_DESENVOLVIMENTO_LACTENTE, ...ACOES_DESENVOLVIMENTO_PRE_ESCOLAR, ...ACOES_DESENVOLVIMENTO_ESCOLAR],
  },
];

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

export function obterRegioesPorFaixa(faixa: FaixaEtariaPediatrica): RegiaoExamePediatrico[] {
  return REGIOES_EXAME_PEDIATRICO;
}

export function obterAcoesPorRegiao(regiaoId: string, faixa: FaixaEtariaPediatrica): AcaoExamePediatrico[] {
  const regiao = REGIOES_EXAME_PEDIATRICO.find((r) => r.id === regiaoId);
  if (!regiao) return [];

  return regiao.acoes.filter((acao) => acao.faixas.includes(faixa));
}

export function obterHotspotPorRegiao(regiaoId: string, faixa: FaixaEtariaPediatrica): HotspotExamePediatrico | null {
  const regiao = REGIOES_EXAME_PEDIATRICO.find((r) => r.id === regiaoId);
  if (!regiao) return null;

  return regiao.hotspots[faixa] || null;
}

export function inferirFaixaEtaria(idade: number): FaixaEtariaPediatrica {
  if (idade < 2) return "lactente";
  if (idade <= 5) return "pre_escolar";
  return "escolar";
}
