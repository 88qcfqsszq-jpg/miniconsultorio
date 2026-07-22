import type { PerfilRubricaCaso } from '../../types'

export const caso63Perfil: PerfilRubricaCaso = {
  caseId: '63',
  tipo: 'adulto',
  titulo: "Atelectasia pós-operatória",
  sistema: 'respiratorio',
  rubricaBase: 'adulto-generica-v1',
  focoAnamnese: [
  "queixa principal e duração",
  "caracterização do sintoma principal",
  "sintomas associados positivos e negativos",
  "antecedentes pessoais",
  "medicações em uso",
  "alergias",
  "fatores de risco relevantes"
],
  focoExameFisico: [
  "sinais vitais",
  "exame geral",
  "exame do sistema principal",
  "busca de sinais de gravidade"
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
