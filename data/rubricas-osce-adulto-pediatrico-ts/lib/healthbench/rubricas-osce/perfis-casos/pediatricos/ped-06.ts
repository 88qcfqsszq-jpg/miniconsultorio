import type { PerfilRubricaCaso } from '../../types'

export const ped06Perfil: PerfilRubricaCaso = {
  caseId: 'ped-06',
  tipo: 'pediatrico',
  titulo: "Suspeita de Maus-Tratos - Menina de 6 Anos",
  sistema: 'protecao-infantil',
  rubricaBase: 'pediatrica-generica-v1',
  focoAnamnese: [
  "identificação da criança e responsável",
  "queixa principal e duração",
  "febre, alimentação, hidratação, diurese e atividade",
  "vacinação",
  "antecedentes gestacionais/perinatais quando pertinentes",
  "medicações, alergias e doenças prévias",
  "mecanismo do trauma",
  "compatibilidade entre história e lesões",
  "atraso na procura",
  "lesões prévias",
  "segurança domiciliar"
],
  focoExameFisico: [
  "sinais vitais pediátricos",
  "estado geral",
  "hidratação e perfusão",
  "exame do sistema principal",
  "sinais de gravidade",
  "exame físico completo",
  "descrição objetiva das lesões",
  "avaliação neurológica e sinais de trauma oculto"
],
  examesEssenciais: [
  "radiografias/avaliação de lesões ocultas quando indicada",
  "exames laboratoriais se sangramento/trauma"
],
  focoDiagnostico: [],
  condutasEssenciais: [
  "acionar rede de proteção",
  "notificação obrigatória",
  "garantir segurança da criança"
],
  criteriosCriticos: [
  "suspeitar de violência quando história e lesões são incompatíveis"
],
  seguranca: [
  "orientar sinais de alarme ao responsável",
  "reavaliar gravidade antes da alta",
  "não devolver a criança para ambiente inseguro sem acionar rede de proteção"
],

  aliasesExames: {
    hemograma: ['hemoglobina', 'hb', 'hematócrito', 'ht', 'leucócitos', 'leucocitos', 'plaquetas'],
    marcadoresInflamatorios: ['pcr', 'proteína c reativa', 'proteina c reativa', 'procalcitonina'],
    gasometria: ['ph', 'pco2', 'paCO2', 'po2', 'paO2', 'hco3', 'bicarbonato', 'saturação', 'saturacao', 'lactato'],
    ecg: ['eletrocardiograma', 'ecg de 12 derivações', '12 derivações'],
    imagemTorax: ['raio x de tórax', 'rx tórax', 'radiografia de tórax', 'tomografia de tórax'],
  },
}
