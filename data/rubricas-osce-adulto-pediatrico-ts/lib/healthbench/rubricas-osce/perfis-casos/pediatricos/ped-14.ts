import type { PerfilRubricaCaso } from '../../types'

export const ped14Perfil: PerfilRubricaCaso = {
  caseId: 'ped-14',
  tipo: 'pediatrico',
  titulo: "Linfonodomegalia Cervical - Criança de 7 Anos",
  sistema: 'infectologia',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias"
],
  focoExameFisico: [
  "sinais vitais pediátricos",
  "estado geral",
  "hidratação e perfusão",
  "exame do sistema principal",
  "sinais de gravidade"
],
  examesEssenciais: [
  "exames essenciais conforme hipótese principal"
],
  focoDiagnostico: [],
  condutasEssenciais: [
  "plano terapêutico coerente com diagnóstico e gravidade"
],
  criteriosCriticos: [],
  seguranca: [
  "orientar sinais de alarme ao responsável",
  "reavaliar gravidade antes da alta"
],

  aliasesExames: {
    hemograma: ['hemoglobina', 'hb', 'hematócrito', 'ht', 'leucócitos', 'leucocitos', 'plaquetas'],
    marcadoresInflamatorios: ['pcr', 'proteína c reativa', 'proteina c reativa', 'procalcitonina'],
    gasometria: ['ph', 'pco2', 'paCO2', 'po2', 'paO2', 'hco3', 'bicarbonato', 'saturação', 'saturacao', 'lactato'],
    ecg: ['eletrocardiograma', 'ecg de 12 derivações', '12 derivações'],
    imagemTorax: ['raio x de tórax', 'rx tórax', 'radiografia de tórax', 'tomografia de tórax'],
  },
}
