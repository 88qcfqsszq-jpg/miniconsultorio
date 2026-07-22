import type { PerfilRubricaCaso } from '../../types'

export const caso50Perfil: PerfilRubricaCaso = {
  caseId: '50',
  tipo: 'adulto',
  titulo: "Coagulação Intravascular Disseminada",
  sistema: 'hematologia',
  rubricaBase: 'adulto-generica-v1',
  focoAnamnese: [
  "queixa principal e duração",
  "caracterização do sintoma principal",
  "sintomas associados positivos e negativos",
  "antecedentes pessoais",
  "medicações em uso",
  "alergias",
  "fatores de risco relevantes",
  "fadiga, dispneia, sangramentos, icterícia, perda ponderal, dieta e uso de medicações",
  "história familiar/menstrual quando aplicável"
],
  focoExameFisico: [
  "sinais vitais",
  "exame geral",
  "exame do sistema principal",
  "busca de sinais de gravidade",
  "palidez/icterícia",
  "linfonodos",
  "hepatoesplenomegalia",
  "petéquias/equimoses"
],
  examesEssenciais: [
  "hemograma completo",
  "reticulócitos quando indicado",
  "ferritina/ferro/B12/coagulograma conforme hipótese",
  "esfregaço periférico quando indicado"
],
  focoDiagnostico: [],
  condutasEssenciais: [
  "tratar causa provável",
  "avaliar necessidade de encaminhamento hematológico/transfusão",
  "orientar sinais de sangramento/anemia grave"
],
  criteriosCriticos: [],
  seguranca: [
  "orientar sinais de alarme",
  "definir retorno, observação, encaminhamento ou internação quando indicado",
  "não ignorar sinais de neoplasia hematológica ou sangramento grave"
],

  aliasesExames: {
    hemograma: ['hemoglobina', 'hb', 'hematócrito', 'ht', 'leucócitos', 'leucocitos', 'plaquetas'],
    marcadoresInflamatorios: ['pcr', 'proteína c reativa', 'proteina c reativa', 'procalcitonina'],
    gasometria: ['ph', 'pco2', 'paCO2', 'po2', 'paO2', 'hco3', 'bicarbonato', 'saturação', 'saturacao', 'lactato'],
    ecg: ['eletrocardiograma', 'ecg de 12 derivações', '12 derivações'],
    imagemTorax: ['raio x de tórax', 'rx tórax', 'radiografia de tórax', 'tomografia de tórax'],
  },
}
