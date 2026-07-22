import type { PerfilRubricaCaso } from '../../types'

export const ped16Perfil: PerfilRubricaCaso = {
  caseId: 'ped-16',
  tipo: 'pediatrico',
  titulo: "Suspeita de Dengue - Criança de 8 Anos",
  sistema: 'infectologia',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias",
  "padrão da febre",
  "sinais de alarme",
  "hidratação/diurese",
  "sangramentos",
  "exposição epidemiológica"
],
  focoExameFisico: [
  "sinais vitais pediátricos",
  "estado geral",
  "hidratação e perfusão",
  "exame do sistema principal",
  "sinais de gravidade",
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
  "orientar sinais de alarme ao responsável",
  "reavaliar gravidade antes da alta",
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
