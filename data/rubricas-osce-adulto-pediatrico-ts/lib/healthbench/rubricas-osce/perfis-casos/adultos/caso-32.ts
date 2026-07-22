import type { PerfilRubricaCaso } from '../../types'

export const caso32Perfil: PerfilRubricaCaso = {
  caseId: '32',
  tipo: 'adulto',
  titulo: "Crise Asmática Grave",
  sistema: 'respiratorio',
  rubricaBase: 'adulto-generica-v1',
  focoAnamnese: [
  "queixa principal e duração",
  "caracterização do sintoma principal",
  "sintomas associados positivos e negativos",
  "antecedentes pessoais",
  "medicações em uso",
  "alergias",
  "fatores de risco relevantes",
  "dispneia, tosse, febre, sibilância, dor torácica e expectoração",
  "tempo de evolução e fatores desencadeantes/exposição",
  "tabagismo ou contato com doentes quando aplicável"
],
  focoExameFisico: [
  "sinais vitais",
  "exame geral",
  "exame do sistema principal",
  "busca de sinais de gravidade",
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
  "orientar sinais de alarme",
  "definir retorno, observação, encaminhamento ou internação quando indicado",
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
