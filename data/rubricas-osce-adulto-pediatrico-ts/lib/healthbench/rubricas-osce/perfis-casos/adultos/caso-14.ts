import type { PerfilRubricaCaso } from '../../types'

export const caso14Perfil: PerfilRubricaCaso = {
  caseId: '14',
  tipo: 'adulto',
  titulo: "Estenose Mitral",
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
  "dispneia, cianose, síncope, palpitações, dor torácica, edema e tolerância ao esforço",
  "antecedentes cardíacos e familiares"
],
  focoExameFisico: [
  "sinais vitais",
  "exame geral",
  "exame do sistema principal",
  "busca de sinais de gravidade",
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
  "orientar sinais de alarme",
  "definir retorno, observação, encaminhamento ou internação quando indicado",
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
