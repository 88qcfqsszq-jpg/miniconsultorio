import type { PerfilRubricaCaso } from '../../types'

export const ped15Perfil: PerfilRubricaCaso = {
  caseId: 'ped-15',
  tipo: 'pediatrico',
  titulo: "Anemia com Sinais de Alerta - Criança de 8 Anos",
  sistema: 'hematologia',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias",
  "fadiga, dispneia, sangramentos, icterícia, perda ponderal, dieta e uso de medicações",
  "história familiar/menstrual quando aplicável"
],
  focoExameFisico: [
  "sinais vitais pediátricos",
  "estado geral",
  "hidratação e perfusão",
  "exame do sistema principal",
  "sinais de gravidade",
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
  "orientar sinais de alarme ao responsável",
  "reavaliar gravidade antes da alta",
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
