import type { PerfilRubricaCaso } from '../../types'

export const ped08Perfil: PerfilRubricaCaso = {
  caseId: 'ped-08',
  tipo: 'pediatrico',
  titulo: "Cardiopatia Congênita Cianótica - Lactente de 6 Meses",
  sistema: 'cardiovascular',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias",
  "dispneia, cianose, sudorese às mamadas, dificuldade alimentar, síncope, palpitações e tolerância ao esforço",
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
  "oximetria de pulso",
  "gasometria arterial/venosa",
  "ECG",
  "radiografia de tórax",
  "ecocardiograma com Doppler"
],
  focoDiagnostico: [
  "cardiopatia congênita cianótica",
  "diferenciar Tetralogia de Fallot, transposição de grandes artérias e outras cardiopatias cianóticas",
  "reconhecer hipoxemia persistente como sinal de gravidade"
],
  condutasEssenciais: [
  "classificar gravidade",
  "suporte hemodinâmico/oxigênio se indicado",
  "encaminhar cardiologia/urgência quando necessário"
],
  criteriosCriticos: [
  "não interpretar cianose central persistente como quadro benigno",
  "não liberar lactente com SpO2 < 85% sem avaliação especializada",
  "valorizar gasometria/oximetria e ecocardiograma"
],
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
