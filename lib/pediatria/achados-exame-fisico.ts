// Mapeamento de ações para achados brutos de exame físico pediátrico
// Os achados são específicos por caso (tipoPaciente e id do caso)

import { Caso } from "@/lib/types";

export interface AchadoExameFisicoPed {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  sistema: string;
  acaoRealizada: string;
  imagemAchadoId?: string; // ID opcional para imagem educativa/patológica
}

// ============================================================================
// TIPOS DE SÍNDROME PEDIÁTRICA
// ============================================================================

type SindromeType =
  | "puericultura"
  | "desenvolvimento"
  | "has_infantil"
  | "maus_tratos"
  | "pericardite"
  | "rinossinusite"
  | "linfonodomegalia"
  | "anemia_hematologica"
  | "pneumonia"
  | "asma"
  | "tuberculose"
  | "dengue"
  | "insuficiencia_cardiaca"
  | "cardiopatia_acianotica"
  | "cardiopatia_cianotica"
  | "febre_sem_foco"
  | "pediatrico_generico";

// ============================================================================
// IDENTIFICADOR DE SÍNDROME
// ============================================================================

function identificarSindromePediatrica(caso: Caso): SindromeType {
  const titulo = (caso.titulo || "").toLowerCase();
  const diagnostico = (caso.dados_ocultos_do_sistema?.diagnostico_principal || "").toLowerCase();
  const resumo = (caso.descricaoBreve || "").toLowerCase();
  const texto = `${titulo} ${diagnostico} ${resumo}`;

  if (texto.includes("puericultura") || texto.includes("crescimento normal")) return "puericultura";
  if (texto.includes("desenvolvimento normal")) return "desenvolvimento";
  if (texto.includes("pressão arterial") || texto.includes("hipertensão")) return "has_infantil";
  if (texto.includes("maus-trato") || texto.includes("abuso") || texto.includes("abuso físico")) return "maus_tratos";
  if (texto.includes("pericardite")) return "pericardite";
  if (texto.includes("rinossinusite") || texto.includes("sinusite")) return "rinossinusite";
  if (texto.includes("linfonodomegalia")) return "linfonodomegalia";
  if (texto.includes("anemia") || texto.includes("trombocitopenia")) return "anemia_hematologica";
  if (texto.includes("pneumonia")) return "pneumonia";
  if (texto.includes("asma") || texto.includes("broncoespasmo")) return "asma";
  if (texto.includes("tuberculose")) return "tuberculose";
  if (texto.includes("dengue")) return "dengue";
  if (texto.includes("insuficiência cardíaca") || texto.includes("ic ")) return "insuficiencia_cardiaca";
  if (texto.includes("cardiopatia acian")) return "cardiopatia_acianotica";
  if (texto.includes("cardiopatia cian")) return "cardiopatia_cianotica";
  if (texto.includes("febre") && !texto.includes("pneumonia")) return "febre_sem_foco";

  return "pediatrico_generico";
}

// ============================================================================
// FALLBACKS POR SÍNDROME
// ============================================================================

export const ACHADOS_FALLBACK_POR_SINDROME: Record<SindromeType, Record<string, AchadoExameFisicoPed>> = {
  puericultura: {
    "ped-estado-geral": { id: "fb-puericultura-eg", titulo: "Estado Geral", descricao: "Lactente em bom estado geral, ativo, responsivo e bem-nutrido.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-frequencia-respiratoria": { id: "fb-puericultura-fr", titulo: "Frequência Respiratória", descricao: "Frequência respiratória dentro dos limites normais para a idade.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
    "ped-ausculta-pulmonar": { id: "fb-puericultura-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular presente bilateralmente, sem ruídos adventícios.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
    "ped-ausculta-focos": { id: "fb-puericultura-focos", titulo: "Ausculta Cardíaca", descricao: "Bulhas rítmicas, sem sopros evidentes ao exame.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
    "ped-palpacao-abdome": { id: "fb-puericultura-abd", titulo: "Abdome", descricao: "Abdome flácido, indolor à palpação, sem visceromegalias evidentes.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar abdome" },
    "ped-pele-mucosas": { id: "fb-puericultura-pele", titulo: "Pele e Mucosas", descricao: "Pele corada, mucosas úmidas, sem cianose central ou lesões aparentes.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    "ped-marcos-desenvolvimento": { id: "fb-puericultura-marc", titulo: "Marcos do Desenvolvimento", descricao: "Marcos de desenvolvimento compatíveis com a idade, interação normal com cuidadores.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar marcos do desenvolvimento" },
  },

  desenvolvimento: {
    "ped-estado-geral": { id: "fb-desen-eg", titulo: "Estado Geral", descricao: "Criança ativa, responsiva, com interação adequada para a idade.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-marcos-desenvolvimento": { id: "fb-desen-marc", titulo: "Marcos do Desenvolvimento", descricao: "Marcos de desenvolvimento dentro do esperado para a faixa etária, sem atrasos significativos observados.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar marcos do desenvolvimento" },
    "ped-nivel-atividade": { id: "fb-desen-ativ", titulo: "Nível de Atividade", descricao: "Criança ativa, com bom engagement com examinador e acompanhantes.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar nível de atividade" },
  },

  has_infantil: {
    "ped-estado-geral": { id: "fb-has-eg", titulo: "Estado Geral", descricao: "Criança em bom estado geral, podendo apresentar discreto desconforto.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-ausculta-focos": { id: "fb-has-focos", titulo: "Ausculta Cardíaca", descricao: "Bulhas rítmicas, sem sopros detectados neste momento.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
    "ped-pele-mucosas": { id: "fb-has-pele", titulo: "Pele e Mucosas", descricao: "Pele corada, mucosas úmidas, sem cianose central.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
  },

  maus_tratos: {
    "ped-estado-geral": { id: "fb-maus-eg", titulo: "Estado Geral", descricao: "Criança consciente e responsiva, porém podendo apresentar comportamento de cautela ou retraimento.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-pele-mucosas": { id: "fb-maus-pele", titulo: "Pele e Mucosas", descricao: "Exame de pele detalhado necessário; procurar por lesões, hematomas ou cicatrizes de padrão suspeito.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    "ped-ausculta-pulmonar": { id: "fb-maus-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular presente bilateralmente, avaliação sem achados diretos de trauma pulmonar neste momento.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
  },

  pericardite: {
    "ped-estado-geral": { id: "fb-peri-eg", titulo: "Estado Geral", descricao: "Criança podendo estar desconfortável, principalmente em posições que aumentam a pressão pericárdica.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-ausculta-focos": { id: "fb-peri-focos", titulo: "Ausculta Cardíaca", descricao: "Possível atrito pericárdico ou bulhas abafadas conforme presença de derrame. Avaliar com cuidado.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
    "ped-precordio": { id: "fb-peri-pre", titulo: "Precórdio", descricao: "Dor ou desconforto à palpação precordial, podendo ter sopro ou atrito associado.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Inspecionar e palpar precórdio" },
  },

  rinossinusite: {
    "ped-estado-geral": { id: "fb-rino-eg", titulo: "Estado Geral", descricao: "Criança podendo estar com congestão nasal e desconforto, porém responsiva.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-orofaringe": { id: "fb-rino-oro", titulo: "Orofaringe", descricao: "Possível exsudato faríngeo, hiperemia de orofaringe, drenagem pós-nasal.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Inspecionar orofaringe" },
    "ped-linfonodos-cervicais": { id: "fb-rino-linfo", titulo: "Linfonodos Cervicais", descricao: "Possível linfonodomegalia cervical reativa, móvel, sensível à palpação.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Palpar linfonodos cervicais" },
  },

  linfonodomegalia: {
    "ped-linfonodos-cervicais": { id: "fb-linfo-cerv", titulo: "Linfonodos Cervicais", descricao: "Linfonodomegalia cervical palpável, móvel, conforme padrão reativo de resposta linfonodal.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Palpar linfonodos cervicais", imagemAchadoId: "linfonodos-cervicais" },
    "ped-estado-geral": { id: "fb-linfo-eg", titulo: "Estado Geral", descricao: "Criança em bom estado geral geral, podendo ter histórico recente de infecção.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-figado-espleno": { id: "fb-linfo-figado", titulo: "Avaliação de Fígado e Baço", descricao: "Hepatomegalia e esplenomegalia podem estar presentes conforme etiologia da linfonodomegalia.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Avaliar fígado e baço" },
  },

  anemia_hematologica: {
    "ped-estado-geral": { id: "fb-anem-eg", titulo: "Estado Geral", descricao: "Criança podendo apresentar palidez, conforme grau de anemia. Nível de atividade pode estar reduzido.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-palidez": { id: "fb-anem-pal", titulo: "Palidez", descricao: "Palidez conjuntival e de mucosas compatível com anemia. Avaliar palmas das mãos e conjuntivas.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar palidez", imagemAchadoId: "palidez-conjuntival-comparativo" },
    "ped-pele-mucosas": { id: "fb-anem-pele", titulo: "Pele e Mucosas", descricao: "Mucosas pálidas, possível presença de petéquias ou equimoses conforme plaquetopenia associada.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    "ped-frequencia-cardiaca": { id: "fb-anem-fc", titulo: "Frequência Cardíaca", descricao: "Possível taquicardia compensatória conforme severidade da anemia.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Aferir frequência cardíaca" },
  },

  pneumonia: {
    "ped-frequencia-respiratoria": { id: "fb-pneum-fr", titulo: "Frequência Respiratória", descricao: "Frequência respiratória elevada para a idade, devendo ser correlacionada aos sinais vitais do caso.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
    "ped-ausculta-pulmonar": { id: "fb-pneum-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular reduzido ou estertores localizados em região acometida, compatível com processo infeccioso pulmonar.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares", imagemAchadoId: "ausculta-pulmonar" },
    "ped-tiragens": { id: "fb-pneum-tir", titulo: "Tiragens", descricao: "Pode haver tiragem subcostal discreta, conforme gravidade do quadro.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Avaliar tiragens" },
    "ped-estado-geral": { id: "fb-pneum-eg", titulo: "Estado Geral", descricao: "Criança febril ou hipoativa, porém responsiva ao exame.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-pele-mucosas": { id: "fb-pneum-pele", titulo: "Pele e Mucosas", descricao: "Mucosas discretamente ressecadas, sem cianose central evidente, salvo se SpO₂ muito baixa.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
  },

  asma: {
    "ped-ausculta-pulmonar": { id: "fb-asma-aus", titulo: "Ausculta Pulmonar", descricao: "Sibilos expiratórios difusos bilateralmente, com tempo expiratório prolongado.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares", imagemAchadoId: "ausculta-pulmonar" },
    "ped-frequencia-respiratoria": { id: "fb-asma-fr", titulo: "Frequência Respiratória", descricao: "Taquipneia com aumento do trabalho respiratório, compatível com crise asmática.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
    "ped-tiragens": { id: "fb-asma-tir", titulo: "Tirages", descricao: "Tiragem leve a moderada pode estar presente durante inspiração.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Avaliar tirages", imagemAchadoId: "tiragem" },
    "ped-estado-geral": { id: "fb-asma-eg", titulo: "Estado Geral", descricao: "Criança alerta, ansiosa ou desconfortável respiratoriamente.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
  },

  tuberculose: {
    "ped-ausculta-pulmonar": { id: "fb-tb-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular reduzido em região acometida ou achados localizados discretos.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
    "ped-estado-geral": { id: "fb-tb-eg", titulo: "Estado Geral", descricao: "Aspecto de doença crônica, possível perda ponderal ou cansaço.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-pele-mucosas": { id: "fb-tb-pele", titulo: "Pele e Mucosas", descricao: "Mucosas discretamente hipocoradas.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    "ped-linfonodos-cervicais": { id: "fb-tb-linfo", titulo: "Linfonodos Cervicais", descricao: "Linfonodos cervicais pequenos ou aumentados, móveis, sem sinais flogísticos importantes.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Palpar linfonodos cervicais" },
  },

  dengue: {
    "ped-estado-geral": { id: "fb-dengue-eg", titulo: "Estado Geral", descricao: "Criança febril, hipoativa, porém responsiva.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-pele-mucosas": { id: "fb-dengue-pele", titulo: "Pele e Mucosas", descricao: "Exantema maculopapular discreto, possível presença de petéquias. Mucosas sem sangramento ativo.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas", imagemAchadoId: "exantema-maculopapular" },
    "ped-palpacao-abdome": { id: "fb-dengue-abd", titulo: "Abdome", descricao: "Dor abdominal leve à palpação, sem irritação peritoneal, salvo sinais de alarme.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar abdome" },
    "ped-perfusao-tec": { id: "fb-dengue-tec", titulo: "Tempo de Enchimento Capilar", descricao: "TEC em torno de 2 segundos, avaliar sinais de choque conforme caso.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Medir TEC" },
  },

  insuficiencia_cardiaca: {
    "ped-estado-geral": { id: "fb-ic-eg", titulo: "Estado Geral", descricao: "Lactente ou criança cansada, com baixa tolerância ao esforço ou alimentação.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-frequencia-respiratoria": { id: "fb-ic-fr", titulo: "Frequência Respiratória", descricao: "Taquipneia compatível com insuficiência cardíaca.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
    "ped-ausculta-pulmonar": { id: "fb-ic-aus", titulo: "Ausculta Pulmonar", descricao: "Possível presença de estertores finos em bases, sugerindo congestão pulmonar.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
    "ped-ausculta-focos": { id: "fb-ic-focos", titulo: "Ausculta Cardíaca", descricao: "Taquicardia e possível sopro ou precórdio hiperdinâmico.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
    "ped-palpar-figado": { id: "fb-ic-fig", titulo: "Hepatomegalia", descricao: "Fígado palpável abaixo do rebordo costal direito, sugerindo congestão sistêmica.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar fígado" },
    "ped-perfusao-tec": { id: "fb-ic-tec", titulo: "Tempo de Enchimento Capilar", descricao: "TEC entre 2 e 3 segundos, perfusão limítrofe.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Medir TEC" },
  },

  cardiopatia_acianotica: {
    "ped-estado-geral": { id: "fb-caac-eg", titulo: "Estado Geral", descricao: "Criança/lactente ativo ou discretamente cansado, sem cianose central.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-ausculta-focos": { id: "fb-caac-focos", titulo: "Ausculta Cardíaca", descricao: "Sopro sistólico audível em precórdio.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
    "ped-pele-mucosas": { id: "fb-caac-pele", titulo: "Pele e Mucosas", descricao: "Sem cianose central evidente.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    "ped-perfusao-tec": { id: "fb-caac-tec", titulo: "Tempo de Enchimento Capilar", descricao: "Perfusão preservada, TEC menor que 2 segundos.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Medir TEC" },
  },

  cardiopatia_cianotica: {
    "ped-estado-geral": { id: "fb-cac-eg", titulo: "Estado Geral", descricao: "Lactente ou criança com cianose, podendo estar hipoativo conforme gravidade.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-cianose": { id: "fb-cac-cia", titulo: "Cianose Central", descricao: "Cianose central em lábios e língua compatível com hipoxemia.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar cianose", imagemAchadoId: "cianose-central" },
    "ped-pele-mucosas": { id: "fb-cac-pele", titulo: "Pele e Mucosas", descricao: "Extremidades cianóticas, associadas à hipoxemia.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    "ped-perfusao-tec": { id: "fb-cac-tec", titulo: "Tempo de Enchimento Capilar", descricao: "TEC prolongado, extremidades frias ou cianóticas.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Medir TEC" },
  },

  febre_sem_foco: {
    "ped-estado-geral": { id: "fb-fsf-eg", titulo: "Estado Geral", descricao: "Criança febril, responsiva, sem sinais de toxemia importante.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-orofaringe": { id: "fb-fsf-oro", titulo: "Orofaringe", descricao: "Orofaringe sem exsudato importante, podendo haver hiperemia discreta.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Inspecionar orofaringe" },
    "ped-ausculta-pulmonar": { id: "fb-fsf-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular presente bilateralmente, sem ruídos adventícios importantes.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
    "ped-palpacao-abdome": { id: "fb-fsf-abd", titulo: "Abdome", descricao: "Abdome flácido, indolor, sem visceromegalias evidentes.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar abdome" },
    "ped-pele-mucosas": { id: "fb-fsf-pele", titulo: "Pele e Mucosas", descricao: "Sem exantema importante, mucosas hidratadas ou discretamente ressecadas.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
  },

  pediatrico_generico: {
    "ped-estado-geral": { id: "fb-gen-eg", titulo: "Estado Geral", descricao: "Paciente pediátrico em bom estado geral, consciente, responsivo e sem sinais de toxemia evidente.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
    "ped-frequencia-respiratoria": { id: "fb-gen-fr", titulo: "Frequência Respiratória", descricao: "Frequência respiratória dentro dos limites normais para a idade.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
    "ped-ausculta-pulmonar": { id: "fb-gen-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular presente bilateralmente, sem ruídos adventícios importantes.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
    "ped-ausculta-focos": { id: "fb-gen-focos", titulo: "Ausculta Cardíaca", descricao: "Bulhas rítmicas, sem sopros evidentes ao exame.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
    "ped-palpacao-abdome": { id: "fb-gen-abd", titulo: "Abdome", descricao: "Abdome flácido, indolor à palpação, sem visceromegalias evidentes.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar abdome" },
    "ped-pele-mucosas": { id: "fb-gen-pele", titulo: "Pele e Mucosas", descricao: "Pele corada, mucosas úmidas, sem cianose central ou lesões aparentes.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    "ped-perfusao-tec": { id: "fb-gen-tec", titulo: "Tempo de Enchimento Capilar", descricao: "TEC menor que 2 segundos, perfusão periférica normal.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Medir TEC" },
    "ped-pulsos-perifericos": { id: "fb-gen-pulsos", titulo: "Pulsos Periféricos", descricao: "Pulsos palpáveis e simétricos bilateralmente.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Palpar pulsos" },
    "ped-marcos-desenvolvimento": { id: "fb-gen-marc", titulo: "Marcos do Desenvolvimento", descricao: "Marcos de desenvolvimento compatíveis com a idade, sem alterações significativas observadas.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar marcos do desenvolvimento" },
  },
};

// ============================================================================
// FUNÇÃO PRINCIPAL DE BUSCA COM FALLBACK
// ============================================================================

// Função geral para obter achado bruto baseado na ação e no caso
export function obterAchadoExameFisicoPed(
  casoId: string,
  acaoId: string,
  caso?: Caso
): AchadoExameFisicoPed | null {
  // Mapeamento por caso
  const achadosPorCaso: Record<string, Record<string, AchadoExameFisicoPed>> = {
    // ===== CASO PED-01: FEBRE EM CRIANÇA DE 4 ANOS =====
    "ped-01": {
      "ped-estado-geral": {
        id: "ped-01-estado-geral",
        titulo: "Estado Geral",
        descricao: "Criança apática, em repouso, com leve desconforto.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar estado geral",
      },
      "ped-nivel-atividade": {
        id: "ped-01-nivel-atividade",
        titulo: "Nível de Atividade/Irritabilidade",
        descricao: "Criança hipoativa, responsiva aos estímulos, sem irritabilidade exagerada.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar nível de atividade/irritabilidade",
      },
      "ped-hidratacao": {
        id: "ped-01-hidratacao",
        titulo: "Hidratação",
        descricao: "Mucosas úmidas, turgor normal, sem sinais de desidratação.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar hidratação",
      },
      "ped-perfusao-tec": {
        id: "ped-01-perfusao",
        titulo: "Perfusão Periférica/TEC",
        descricao: "Extremidades quentes, TEC <2 segundos, coloração normal.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar perfusão/TEC",
      },
      "ped-cianose": {
        id: "ped-01-cianose",
        titulo: "Cianose",
        descricao: "Sem cianose central ou periférica.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar cianose",
      },
      "ped-palidez": {
        id: "ped-01-palidez",
        titulo: "Palidez",
        descricao: "Palidez leve, sem alterações significativas.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar palidez",
      },
      "ped-frequencia-respiratoria": {
        id: "ped-01-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR = 28 irpm (ligeiramente elevada para idade).",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Contar frequência respiratória",
      },
      "ped-tiragens": {
        id: "ped-01-tiragens",
        titulo: "Tiragens",
        descricao: "Sem tiragens intercostais, subcostais ou supraesternais.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar tiragens",
      },
      "ped-batimento-asa-nasal": {
        id: "ped-01-asa-nasal",
        titulo: "Batimento de Asa Nasal",
        descricao: "Sem batimento de asa nasal.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar batimento de asa nasal",
      },
      "ped-expansibilidade": {
        id: "ped-01-expansibilidade",
        titulo: "Expansibilidade Torácica",
        descricao: "Expansão simétrica bilateral.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar expansibilidade torácica",
      },
      "ped-ausculta-pulmonar": {
        id: "ped-01-ausculta-pulm",
        titulo: "Ausculta Pulmonar",
        descricao: "Murmúrio vesicular presente bilateralmente, sem roncos, sibilos ou crepitações.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Auscultar pulmões",
      },
      "ped-ausculta-focos": {
        id: "ped-01-ausculta-focos",
        titulo: "Ausculta de Focos Cardíacos",
        descricao: "Bulhas normofonéticas, ritmo regular, FC = 118 bpm (taquicardia leve).",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Auscultar focos cardíacos",
      },
      "ped-sopro": {
        id: "ped-01-sopro",
        titulo: "Avaliação de Sopro",
        descricao: "Sem sopros cardíacos detectados.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Avaliar presença de sopro",
      },
      "ped-pulsos-perifericos": {
        id: "ped-01-pulsos",
        titulo: "Pulsos Periféricos",
        descricao: "Pulsos radiais, braquiais e femorais presentes, simétricos e de amplitude normal.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Avaliar pulsos periféricos",
      },
      "ped-perfusao-card": {
        id: "ped-01-perfusao-card",
        titulo: "Perfusão Sistêmica",
        descricao: "Extremidades quentes, cor normal, TEC <2 segundos.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Avaliar perfusão sistêmica",
      },
      "ped-hepatomegalia": {
        id: "ped-01-hepatomegalia",
        titulo: "Palpação Hepática",
        descricao: "Fígado não palpável ou discretamente palpável na margem costal.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Palpar fígado (congestão)",
      },
      "ped-inspecao-abdome": {
        id: "ped-01-inspecao-abd",
        titulo: "Inspeção do Abdome",
        descricao: "Abdome plano, sem abaulamentos, cicatrizes ou alterações visíveis.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Inspecionar abdome",
      },
      "ped-palpacao-abdome": {
        id: "ped-01-palpacao-abd",
        titulo: "Palpação Superficial",
        descricao: "Abdome flácido, indolor, sem defesa abdominal.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Palpar abdome superficial",
      },
      "ped-palpar-figado": {
        id: "ped-01-figado",
        titulo: "Palpação Hepática",
        descricao: "Fígado não palpável abaixo da margem costal direita.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Palpar fígado",
      },
      "ped-palpar-baco": {
        id: "ped-01-baco",
        titulo: "Palpação Esplênica",
        descricao: "Baço não palpável.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Palpar baço",
      },
      "ped-verificar-peso": {
        id: "ped-01-peso",
        titulo: "Verificação de Peso",
        descricao: "Peso = 16 kg (percentil 50 para idade).",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Verificar peso",
      },
      "ped-verificar-comprimento": {
        id: "ped-01-comprimento",
        titulo: "Verificação de Comprimento/Estatura",
        descricao: "Estatura = 103 cm (percentil 50 para idade).",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Verificar comprimento/estatura",
      },
      "ped-perimetro-cefalico": {
        id: "ped-01-pc",
        titulo: "Perímetro Cefálico",
        descricao: "Não aplicável para esta faixa etária (criança 4 anos).",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Medir perímetro cefálico",
      },
      "ped-marcos-desenvolvimento": {
        id: "ped-01-marcos",
        titulo: "Marcos do Desenvolvimento",
        descricao: "Fala clara, coordenação motora adequada para idade, comportamento social esperado.",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Avaliar marcos do desenvolvimento",
      },
      "ped-alimentacao": {
        id: "ped-01-alimentacao",
        titulo: "Avaliação de Alimentação",
        descricao: "Alimentação reduzida por causa da febre, aceitação baixa no momento.",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Avaliar alimentação",
      },
      "ped-linfonodos-cervicais": {
        id: "ped-01-linfonodos",
        titulo: "Palpação de Linfonodos Cervicais",
        descricao: "Linfonodos cervicais não palpáveis ou discretamente palpáveis (<1 cm), móveis, indolores.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Palpar linfonodos cervicais",
      },
      "ped-figado-espleno": {
        id: "ped-01-figado-espleno",
        titulo: "Avaliação de Fígado e Baço",
        descricao: "Hepatomegalia e esplenomegalia ausentes.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Avaliar fígado e baço",
      },
      "ped-equimoses-petequias": {
        id: "ped-01-equimoses",
        titulo: "Avaliação de Equimoses/Petéquias",
        descricao: "Sem equimoses ou petéquias.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Avaliar equimoses/petéquias",
      },
      "ped-palidez-mucosas": {
        id: "ped-01-palidez-mucosas",
        titulo: "Palidez Cutaneomucosa",
        descricao: "Palidez discreta, mucosas levemente pálidas.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Avaliar palidez cutaneomucosa",
      },
      "ped-exantema": {
        id: "ped-01-exantema",
        titulo: "Avaliação de Exantema",
        descricao: "Sem exantema visível.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar exantema",
      },
      "ped-petequias": {
        id: "ped-01-petequias",
        titulo: "Avaliação de Petéquias",
        descricao: "Sem petéquias.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar petéquias",
      },
      "ped-equimoses-pele": {
        id: "ped-01-equimoses-pele",
        titulo: "Avaliação de Equimoses",
        descricao: "Sem equimoses.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar equimoses",
      },
      "ped-mucosas": {
        id: "ped-01-mucosas",
        titulo: "Avaliação de Mucosas",
        descricao: "Mucosas úmidas, sem lesões, aftas ou alterações significativas.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar mucosas",
      },
    },

    // ===== CASO PED-13: PNEUMONIA ADQUIRIDA NA COMUNIDADE - RICARDO, 5 ANOS =====
    "ped-13": {
      "ped-estado-geral": {
        id: "ped-13-estado-geral",
        titulo: "Estado Geral",
        descricao: "Criança febril, com dificuldade respiratória moderada, prostrada, porém responsiva e em contato com o examinador.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar estado geral",
      },
      "ped-nivel-atividade": {
        id: "ped-13-nivel-atividade",
        titulo: "Nível de Atividade/Irritabilidade",
        descricao: "Criança hipoativa, secundário ao quadro febril e desconforto respiratório, responsiva aos estímulos, consola-se com a mãe.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar nível de atividade/irritabilidade",
      },
      "ped-hidratacao": {
        id: "ped-13-hidratacao",
        titulo: "Hidratação",
        descricao: "Mucosas discretamente ressecadas, compatível com febre e possível desidratação moderada, turgor discretamente reduzido.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar hidratação",
      },
      "ped-perfusao-tec": {
        id: "ped-13-perfusao",
        titulo: "Perfusão Periférica/TEC",
        descricao: "Extremidades com temperatura normal, TEC <2 segundos, perfusão periférica preservada apesar da febre sistêmica.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar perfusão/TEC",
      },
      "ped-cianose": {
        id: "ped-13-cianose",
        titulo: "Cianose",
        descricao: "Sem cianose central franco evidente, SpO₂ 91% em ar ambiente indicando hipoxemia discreta.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar cianose",
      },
      "ped-palidez": {
        id: "ped-13-palidez",
        titulo: "Palidez",
        descricao: "Leve palidez cutaneomucosa, compatível com quadro febril agudo.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar palidez",
      },
      "ped-frequencia-respiratoria": {
        id: "ped-13-fr",
        titulo: "Frequência Respiratória",
        descricao: "Frequência respiratória 48 irpm, elevada para a idade (normal até 30 em repouso para criança de 5 anos), compatível com desconforto respiratório.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Contar frequência respiratória",
      },
      "ped-tiragens": {
        id: "ped-13-tiragens",
        titulo: "Tiragens",
        descricao: "Tiragem subcostal discreta presente durante a respiração, sugerindo desconforto respiratório moderado.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar tiragens",
      },
      "ped-batimento-asa-nasal": {
        id: "ped-13-ban",
        titulo: "Batimento de Asa Nasal",
        descricao: "Batimento de asa nasal discreto, associado ao esforço respiratório aumentado.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar batimento de asa nasal",
      },
      "ped-expansibilidade": {
        id: "ped-13-expansibilidade",
        titulo: "Expansibilidade Torácica",
        descricao: "Expansão torácica discretamente assimétrica, com menor expansibilidade em base direita (região acometida).",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar expansibilidade torácica",
      },
      "ped-ausculta-pulmonar": {
        id: "ped-13-ausculta",
        titulo: "Ausculta Pulmonar",
        descricao: "Murmúrio vesicular reduzido em base pulmonar direita, com estertores crepitantes localizados, compatível com acometimento infeccioso pulmonar.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Auscultar pulmões",
      },
      "ped-ausculta-focos": {
        id: "ped-13-focos",
        titulo: "Ausculta de Focos Cardíacos",
        descricao: "Bulhas cardíacas rítmicas, frequência cardíaca 124 bpm (taquicardia), compatível com febre e compensação cardiorespiratória.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Auscultar focos cardíacos",
      },
      "ped-sopro": {
        id: "ped-13-sopro",
        titulo: "Sopro Cardíaco",
        descricao: "Sem sopro cardíaco significativo detectado, coração estruturalmente normal.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Pesquisar sopros",
      },
      "ped-ausculta-abdominal": {
        id: "ped-13-ausculta-abd",
        titulo: "Ausculta Abdominal",
        descricao: "Ruídos hidroaéreos presentes e normais, sem alterações significativas.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Auscultar abdome",
      },
      "ped-palpacao-abdominal": {
        id: "ped-13-palpacao-abd",
        titulo: "Palpação Abdominal",
        descricao: "Abdome flácido, sem defesa ou rigidez peritoneal, sem hepatomegalia importante.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Palpar abdome",
      },
    },

    // ===== CASO PED-10: TUBERCULOSE PULMONAR - CLARA =====
    "ped-10": {
      "ped-estado-geral": { id: "ped-10-eg", titulo: "Estado Geral", descricao: "Criança emagrecida com aspecto de doença crônica, consciente e responsiva.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
      "ped-nivel-atividade": { id: "ped-10-na", titulo: "Nível de Atividade/Irritabilidade", descricao: "Criança responsiva, com possível hipoatividade discreta pelo quadro crônico.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar nível de atividade/irritabilidade" },
      "ped-frequencia-respiratoria": { id: "ped-10-fr", titulo: "Frequência Respiratória", descricao: "Frequência respiratória levemente elevada, compatível com acometimento pulmonar crônico.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
      "ped-ausculta-pulmonar": { id: "ped-10-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular reduzido em ápice, estertores localizados compatíveis com TB ativa.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar pulmões" },
    },

    // ===== CASO PED-11: ASMA NA INFÂNCIA - PEDRO =====
    "ped-11": {
      "ped-estado-geral": { id: "ped-11-eg", titulo: "Estado Geral", descricao: "Criança alerta, ansiosa, com desconforto respiratório leve a moderado.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
      "ped-frequencia-respiratoria": { id: "ped-11-fr", titulo: "Frequência Respiratória", descricao: "Taquipneia com aumento do trabalho respiratório, compatível com crise asmática.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
      "ped-tiragens": { id: "ped-11-tir", titulo: "Tirages", descricao: "Tiragem subcostal e intercostal discreta a moderada durante a inspiração.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Avaliar tirages" },
      "ped-ausculta-pulmonar": { id: "ped-11-aus", titulo: "Ausculta Pulmonar", descricao: "Sibilos expiratórios difusos bilateralmente, com tempo expiratório prolongado.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar pulmões" },
      "ped-expansibilidade": { id: "ped-11-exp", titulo: "Expansibilidade Torácica", descricao: "Expansibilidade preservada, com tórax discretamente hiperinsuflado.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Avaliar expansibilidade torácica" },
    },

    // ===== CASO PED-16: SUSPEITA DE DENGUE - DANILO =====
    "ped-16": {
      "ped-estado-geral": { id: "ped-16-eg", titulo: "Estado Geral", descricao: "Criança febril, hipoativa, porém consciente e orientada.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
      "ped-nivel-atividade": { id: "ped-16-na", titulo: "Nível de Atividade/Irritabilidade", descricao: "Criança hipoativa, compatível com quadro febril e mal-estar.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar nível de atividade/irritabilidade" },
      "ped-palidez": { id: "ped-16-pal", titulo: "Palidez", descricao: "Palidez discreta compatível com doença aguda.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar palidez" },
      "ped-cianose": { id: "ped-16-cia", titulo: "Cianose", descricao: "Sem cianose central, porém presença de exantema com petéquias.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar cianose", imagemAchadoId: "petequias" },
    },

    // ===== CASO PED-05: INSUFICIÊNCIA CARDÍACA - MATHEUS, LACTENTE 4 MESES =====
    "ped-05": {
      "ped-estado-geral": { id: "ped-05-eg", titulo: "Estado Geral", descricao: "Lactente cansado, com sudorese referida durante mamadas e menor tolerância aos esforços, mantendo responsividade ao exame.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
      "ped-frequencia-respiratoria": { id: "ped-05-fr", titulo: "Frequência Respiratória", descricao: "FR elevada para a idade, compatível com desconforto respiratório no contexto de insuficiência cardíaca.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Contar frequência respiratória" },
      "ped-tiragens": { id: "ped-05-tir", titulo: "Tiragens", descricao: "Tiragem subcostal discreta, associada ao aumento do trabalho respiratório.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Avaliar tiragens" },
      "ped-ausculta-pulmonar": { id: "ped-05-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular presente bilateralmente, com estertores finos em bases, sugerindo congestão pulmonar.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
      "ped-expansibilidade": { id: "ped-05-exp", titulo: "Expansibilidade Torácica", descricao: "Expansibilidade torácica globalmente preservada, sem assimetria importante.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Palpar expansibilidade torácica" },
      "ped-ausculta-focos": { id: "ped-05-focos", titulo: "Frequência Cardíaca", descricao: "Taquicardia para a idade, compatível com esforço compensatório no quadro de insuficiência cardíaca.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Aferir frequência cardíaca" },
      "ped-sopro": { id: "ped-05-sopro", titulo: "Ausculta Cardíaca", descricao: "Bulhas rítmicas, com sopro sistólico audível em precórdio.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
      "ped-precordio": { id: "ped-05-pre", titulo: "Precórdio", descricao: "Precórdio hiperdinâmico à inspeção e palpação.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Inspecionar e palpar precórdio" },
      "ped-palpar-figado": { id: "ped-05-fig", titulo: "Hepatomegalia", descricao: "Fígado palpável abaixo do rebordo costal direito, sugerindo congestão sistêmica.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar fígado" },
      "ped-palpacao-abdome": { id: "ped-05-abd", titulo: "Abdome", descricao: "Abdome globoso, flácido, sem sinais de irritação peritoneal.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar abdome" },
      "ped-perfusao-tec": { id: "ped-05-tec", titulo: "Tempo de Enchimento Capilar", descricao: "TEC entre 2 e 3 segundos, com perfusão periférica limítrofe.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Medir TEC" },
      "ped-pulsos-perifericos": { id: "ped-05-pulsos", titulo: "Pulsos periféricos", descricao: "Pulsos periféricos palpáveis, sem assimetria grosseira.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Palpar pulsos" },
      "ped-pele-mucosas": { id: "ped-05-pele", titulo: "Pele e mucosas", descricao: "Pele discretamente pálida, sem cianose central intensa no momento.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas", imagemAchadoId: "palidez-conjuntival" },
    },

    // ===== CASO PED-07: CARDIOPATIA ACIANÓTICA - FELIPE, LACTENTE 12 MESES =====
    "ped-07": {
      "ped-estado-geral": { id: "ped-07-eg", titulo: "Estado Geral", descricao: "Lactente ativo, responsivo, sem cianose central evidente, podendo apresentar cansaço aos esforços.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
      "ped-ausculta-focos": { id: "ped-07-focos", titulo: "Ausculta Cardíaca", descricao: "Sopro sistólico audível em foco precordial, compatível com cardiopatia congênita acianótica.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio", imagemAchadoId: "ausculta-cardiaca-focos" },
      "ped-precordio": { id: "ped-07-pre", titulo: "Precórdio", descricao: "Ictus palpável, sem sinais intensos de hiperdinamismo.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Palpar precórdio" },
      "ped-frequencia-respiratoria": { id: "ped-07-fc", titulo: "Frequência Cardíaca", descricao: "Frequência cardíaca dentro do esperado ou discretamente elevada para a idade, sem sinais de instabilidade no momento.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Aferir frequência cardíaca" },
      "ped-batimento-asa-nasal": { id: "ped-07-resp", titulo: "Padrão Respiratório", descricao: "Respiração sem desconforto importante em repouso.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Inspecionar padrão respiratório" },
      "ped-ausculta-pulmonar": { id: "ped-07-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular presente bilateralmente, sem ruídos adventícios importantes.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
      "ped-palpar-figado": { id: "ped-07-fig", titulo: "Hepatomegalia", descricao: "Fígado não aumentado ou discretamente palpável, sem sinais importantes de congestão sistêmica.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar fígado" },
      "ped-perfusao-tec": { id: "ped-07-tec", titulo: "Tempo de Enchimento Capilar", descricao: "TEC menor que 2 segundos, com perfusão periférica preservada.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Medir TEC" },
      "ped-pulsos-perifericos": { id: "ped-07-pulsos", titulo: "Pulsos periféricos", descricao: "Pulsos periféricos palpáveis e simétricos.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Palpar pulsos" },
      "ped-cianose": { id: "ped-07-cia", titulo: "Cianose Central", descricao: "Lábios e língua sem coloração azulada evidente.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar cianose" },
      "ped-pele-mucosas": { id: "ped-07-pele", titulo: "Pele e mucosas", descricao: "Pele corada, mucosas úmidas, sem sinais de hipoxemia central.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
    },

    // ===== CASO PED-08: CARDIOPATIA CIANÓTICA - ARTUR, LACTENTE 12 MESES, SpO₂ 82% =====
    "ped-08": {
      "ped-estado-geral": { id: "ped-08-eg", titulo: "Estado Geral", descricao: "Lactente hipoativo, com cianose evidente, porém responsivo ao estímulo.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar estado geral" },
      "ped-cianose": { id: "ped-08-cia", titulo: "Cianose Central", descricao: "Lábios e língua com coloração azulada evidente, compatível com cianose central.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Avaliar cianose", imagemAchadoId: "cianose-central" },
      "ped-saturacao-oxigenio": { id: "ped-08-spo2", titulo: "Saturação de Oxigênio", descricao: "SpO₂ reduzida, em torno de 82%, compatível com hipoxemia importante no contexto de cardiopatia cianótica.", categoria: "geral", sistema: "pediatria", acaoRealizada: "Aferir oximetria de pulso" },
      "ped-pele-mucosas": { id: "ped-08-pele", titulo: "Pele e mucosas", descricao: "Pele com coloração discretamente arroxeada em extremidades, associada à hipoxemia.", categoria: "pele", sistema: "pediatria", acaoRealizada: "Avaliar pele e mucosas" },
      "ped-ausculta-focos": { id: "ped-08-focos", titulo: "Ausculta Cardíaca", descricao: "Sopro cardíaco audível em precórdio, associado ao quadro de cardiopatia congênita.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Auscultar precórdio" },
      "ped-frequencia-respiratoria": { id: "ped-08-fc", titulo: "Frequência Cardíaca", descricao: "Frequência cardíaca elevada para a idade, em resposta à hipoxemia.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Aferir frequência cardíaca" },
      "ped-precordio": { id: "ped-08-pre", titulo: "Precórdio", descricao: "Precórdio com impulsões discretas à palpação, sem sinais isolados de instabilidade hemodinâmica grave.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Inspecionar e palpar precórdio" },
      "ped-batimento-asa-nasal": { id: "ped-08-resp", titulo: "Padrão Respiratório", descricao: "Respiração discretamente acelerada, sem sinais de infecção pulmonar predominante.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Inspecionar padrão respiratório" },
      "ped-ausculta-pulmonar": { id: "ped-08-aus", titulo: "Ausculta Pulmonar", descricao: "Murmúrio vesicular presente bilateralmente, sem estertores localizados predominantes.", categoria: "respiratorio", sistema: "pediatria", acaoRealizada: "Auscultar campos pulmonares" },
      "ped-perfusao-periferica": { id: "ped-08-perf", titulo: "Perfusão periférica", descricao: "Extremidades frias ou discretamente cianóticas, com TEC entre 2 e 3 segundos.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Avaliar perfusão periférica" },
      "ped-pulsos-perifericos": { id: "ped-08-pulsos", titulo: "Pulsos periféricos", descricao: "Pulsos periféricos palpáveis, com perfusão periférica reduzida pela hipoxemia.", categoria: "cardiovascular", sistema: "pediatria", acaoRealizada: "Palpar pulsos" },
      "ped-palpar-figado": { id: "ped-08-fig", titulo: "Hepatomegalia", descricao: "Fígado palpável discretamente abaixo do rebordo costal direito, podendo indicar sobrecarga cardíaca.", categoria: "abdome", sistema: "pediatria", acaoRealizada: "Palpar fígado" },
    },

  };

  // ========== PRIORIDADE 1: Achado Específico ==========
  if (achadosPorCaso[casoId] && achadosPorCaso[casoId][acaoId]) {
    return achadosPorCaso[casoId][acaoId];
  }

  // ========== PRIORIDADE 2: Achado por Síndrome ==========
  if (caso) {
    const sindrome = identificarSindromePediatrica(caso);
    if (ACHADOS_FALLBACK_POR_SINDROME[sindrome] && ACHADOS_FALLBACK_POR_SINDROME[sindrome][acaoId]) {
      return ACHADOS_FALLBACK_POR_SINDROME[sindrome][acaoId];
    }
  }

  // ========== PRIORIDADE 3: Fallback Genérico Pediátrico ==========
  if (ACHADOS_FALLBACK_POR_SINDROME["pediatrico_generico"][acaoId]) {
    return ACHADOS_FALLBACK_POR_SINDROME["pediatrico_generico"][acaoId];
  }

  // ========== PRIORIDADE 4: Última Tentativa = null ==========
  return null;
}

// Função para converter achado em formato compatível com o sistema de achados geral
export function converterAchadoParaSistema(achado: AchadoExameFisicoPed): any {
  return {
    id: achado.id,
    titulo: achado.titulo,
    descricao: achado.descricao,
    categoria: "exame_fisico",
    regiao: achado.categoria,
    acaoRealizada: achado.acaoRealizada,
  };
}
