import type { PerfilRubricaCaso } from '../../types'

export const ped09Perfil: PerfilRubricaCaso = {
  caseId: 'ped-09',
  tipo: 'pediatrico',
  titulo: "Pericardite Aguda - Menino de 12 Anos",
  sistema: 'cardiovascular',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias",
  "dispneia, cianose, síncope, palpitações, dor torácica, edema e tolerância ao esforço",
  "antecedentes cardíacos e familiares"
],
  focoExameFisico: [
  "sinais vitais pediátricos",
  "estado geral",
  "hidratação e perfusão",
  "exame do sistema principal",
  "sinais de gravidade",
  "exame cardiovascular completo",
  "pulsos e perfusão",
  "ausculta cardíaca",
  "sinais de congestão"
],
  examesEssenciais: [
  "ECG",
  "ecocardiograma quando indicado",
  "radiografia de tórax quando indicada",
  "marcadores cardíacos quando indicado"
],
  focoDiagnostico: [],
  condutasEssenciais: [
  "classificar gravidade",
  "suporte hemodinâmico/oxigênio se indicado",
  "encaminhar cardiologia/urgência quando necessário"
],
  criteriosCriticos: [],
  seguranca: [
  "orientar sinais de alarme ao responsável",
  "reavaliar gravidade antes da alta",
  "reconhecer sinais de baixo débito, choque, cianose ou instabilidade"
],

  aliasesExames: {
    hemograma: ['hemoglobina', 'hb', 'hematócrito', 'ht', 'leucócitos', 'leucocitos', 'plaquetas'],
    marcadoresInflamatorios: ['pcr', 'proteína c reativa', 'proteina c reativa', 'procalcitonina'],
    gasometria: ['ph', 'pco2', 'paCO2', 'po2', 'paO2', 'hco3', 'bicarbonato', 'saturação', 'saturacao', 'lactato'],
    ecg: ['eletrocardiograma', 'ecg de 12 derivações', '12 derivações'],
    imagemTorax: ['raio x de tórax', 'rx tórax', 'radiografia de tórax', 'tomografia de tórax'],
  },
}
