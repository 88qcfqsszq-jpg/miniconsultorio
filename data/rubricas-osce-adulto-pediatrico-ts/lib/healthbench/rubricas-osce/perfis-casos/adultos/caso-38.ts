import type { PerfilRubricaCaso } from '../../types'

export const caso38Perfil: PerfilRubricaCaso = {
  caseId: '38',
  tipo: 'adulto',
  titulo: "Dengue Clássica",
  sistema: 'infectologia',
  rubricaBase: 'adulto-generica-v1',
  focoAnamnese: [
  "queixa principal e duração",
  "caracterização do sintoma principal",
  "sintomas associados positivos e negativos",
  "antecedentes pessoais",
  "medicações em uso",
  "alergias",
  "fatores de risco relevantes",
  "padrão da febre",
  "sinais de alarme",
  "hidratação/diurese",
  "sangramentos",
  "exposição epidemiológica"
],
  focoExameFisico: [
  "sinais vitais",
  "exame geral",
  "exame do sistema principal",
  "busca de sinais de gravidade",
  "estado geral e perfusão",
  "hidratação",
  "pele e mucosas",
  "dor abdominal/hepatomegalia quando aplicável"
],
  examesEssenciais: [
  "hemograma",
  "plaquetas",
  "hematócrito",
  "função hepática/renal quando indicado",
  "testes específicos conforme hipótese"
],
  focoDiagnostico: [],
  condutasEssenciais: [
  "hidratação adequada",
  "analgesia/antitérmico seguro",
  "evitar AINEs se dengue suspeita",
  "observação/internação se sinais de alarme"
],
  criteriosCriticos: [],
  seguranca: [
  "orientar sinais de alarme",
  "definir retorno, observação, encaminhamento ou internação quando indicado",
  "não liberar paciente com sinais de choque, sangramento ou alarme sem plano seguro"
],

  aliasesExames: {
    hemograma: ['hemoglobina', 'hb', 'hematócrito', 'ht', 'leucócitos', 'leucocitos', 'plaquetas'],
    marcadoresInflamatorios: ['pcr', 'proteína c reativa', 'proteina c reativa', 'procalcitonina'],
    gasometria: ['ph', 'pco2', 'paCO2', 'po2', 'paO2', 'hco3', 'bicarbonato', 'saturação', 'saturacao', 'lactato'],
    ecg: ['eletrocardiograma', 'ecg de 12 derivações', '12 derivações'],
    imagemTorax: ['raio x de tórax', 'rx tórax', 'radiografia de tórax', 'tomografia de tórax'],
  },
}
