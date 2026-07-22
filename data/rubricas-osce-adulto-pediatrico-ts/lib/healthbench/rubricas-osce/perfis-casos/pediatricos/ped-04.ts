import type { PerfilRubricaCaso } from '../../types'

export const ped04Perfil: PerfilRubricaCaso = {
  caseId: 'ped-04',
  tipo: 'pediatrico',
  titulo: "Avaliação de Desenvolvimento - Lactente de 10 Meses",
  sistema: 'neurologico-desenvolvimento',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias",
  "alimentação, sono, eliminações, vacinação, marcos do desenvolvimento, crescimento e ambiente familiar"
],
  focoExameFisico: [
  "sinais vitais pediátricos",
  "estado geral",
  "hidratação e perfusão",
  "exame do sistema principal",
  "sinais de gravidade",
  "antropometria",
  "curvas de crescimento",
  "desenvolvimento neuropsicomotor",
  "exame físico completo"
],
  examesEssenciais: [
  "exames apenas se indicação clínica"
],
  focoDiagnostico: [],
  condutasEssenciais: [
  "orientações preventivas",
  "vacinação",
  "alimentação e segurança",
  "seguimento programado"
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
