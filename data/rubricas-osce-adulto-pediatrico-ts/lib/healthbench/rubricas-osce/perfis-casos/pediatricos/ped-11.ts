import type { PerfilRubricaCaso } from '../../types'

export const ped11Perfil: PerfilRubricaCaso = {
  caseId: 'ped-11',
  tipo: 'pediatrico',
  titulo: "Asma na Infância - Criança de 7 Anos",
  sistema: 'respiratorio',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias",
  "dispneia, tosse, febre, sibilância, dor torácica e expectoração",
  "tempo de evolução e fatores desencadeantes/exposição",
  "tabagismo ou contato com doentes quando aplicável"
],
  focoExameFisico: [
  "sinais vitais pediátricos",
  "estado geral",
  "hidratação e perfusão",
  "exame do sistema principal",
  "sinais de gravidade",
  "ausculta respiratória",
  "saturação de oxigênio",
  "sinais de esforço respiratório"
],
  examesEssenciais: [
  "oximetria",
  "radiografia de tórax quando indicada",
  "hemograma/PCR conforme gravidade",
  "gasometria se grave"
],
  focoDiagnostico: [],
  condutasEssenciais: [
  "oxigênio se hipoxemia",
  "broncodilatador/corticoide/antibiótico conforme hipótese",
  "definir observação/internação conforme gravidade"
],
  criteriosCriticos: [],
  seguranca: [
  "orientar sinais de alarme ao responsável",
  "reavaliar gravidade antes da alta",
  "reconhecer insuficiência respiratória e hipoxemia"
],

  aliasesExames: {
    hemograma: ['hemoglobina', 'hb', 'hematócrito', 'ht', 'leucócitos', 'leucocitos', 'plaquetas'],
    marcadoresInflamatorios: ['pcr', 'proteína c reativa', 'proteina c reativa', 'procalcitonina'],
    gasometria: ['ph', 'pco2', 'paCO2', 'po2', 'paO2', 'hco3', 'bicarbonato', 'saturação', 'saturacao', 'lactato'],
    ecg: ['eletrocardiograma', 'ecg de 12 derivações', '12 derivações'],
    imagemTorax: ['raio x de tórax', 'rx tórax', 'radiografia de tórax', 'tomografia de tórax'],
  },
}
