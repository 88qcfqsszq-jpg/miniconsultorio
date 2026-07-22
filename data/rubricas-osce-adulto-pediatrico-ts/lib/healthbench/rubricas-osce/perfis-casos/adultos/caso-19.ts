import type { PerfilRubricaCaso } from '../../types'

export const caso19Perfil: PerfilRubricaCaso = {
  caseId: '19',
  tipo: 'adulto',
  titulo: "Angina Instável",
  sistema: 'cardiovascular',
  rubricaBase: 'adulto-generica-v1',
  focoAnamnese: [
  "queixa principal e duração",
  "caracterização do sintoma principal",
  "sintomas associados positivos e negativos",
  "antecedentes pessoais",
  "medicações em uso",
  "alergias",
  "fatores de risco relevantes",
  "OPQRST da dor torácica",
  "irradiação, esforço, repouso, dispneia, sudorese, náuseas",
  "fatores de risco cardiovascular"
],
  focoExameFisico: [
  "sinais vitais",
  "exame geral",
  "exame do sistema principal",
  "busca de sinais de gravidade",
  "exame cardiovascular",
  "exame respiratório",
  "perfusão periférica"
],
  examesEssenciais: [
  "ECG",
  "troponina/marcadores cardíacos",
  "radiografia de tórax quando indicada"
],
  focoDiagnostico: [
  "síndrome coronariana aguda",
  "diferenciais de dor torácica grave"
],
  condutasEssenciais: [
  "estratificação de risco",
  "antiagregação/terapia anti-isquêmica quando indicada",
  "reperfusão/trombólise ou encaminhamento se indicado"
],
  criteriosCriticos: [
  "não perder síndrome coronariana aguda"
],
  seguranca: [
  "orientar sinais de alarme",
  "definir retorno, observação, encaminhamento ou internação quando indicado"
],

  aliasesExames: {
    hemograma: ['hemoglobina', 'hb', 'hematócrito', 'ht', 'leucócitos', 'leucocitos', 'plaquetas'],
    marcadoresInflamatorios: ['pcr', 'proteína c reativa', 'proteina c reativa', 'procalcitonina'],
    gasometria: ['ph', 'pco2', 'paCO2', 'po2', 'paO2', 'hco3', 'bicarbonato', 'saturação', 'saturacao', 'lactato'],
    ecg: ['eletrocardiograma', 'ecg de 12 derivações', '12 derivações'],
    imagemTorax: ['raio x de tórax', 'rx tórax', 'radiografia de tórax', 'tomografia de tórax'],
  },
}
