import type { RubricaOSCE } from './types'

export const RUBRICA_ADULTO_GENERICA: RubricaOSCE = {
  id: 'adulto-generica-v1',
  versao: '1.0.0',
  tipo: 'adulto',
  nome: 'Rubrica OSCE Adulto — Genérica',
  totalPontos: 20,
  dominios: [
    {
      id: 'comunicacao',
      titulo: 'Comunicação e postura médica',
      pontos: 2,
      criterios: [
        { id: 'com-01', descricao: 'Apresenta-se, confirma identificação do paciente e conduz a consulta com postura profissional.', peso: 0.4 },
        { id: 'com-02', descricao: 'Usa linguagem clara, empática e adequada ao nível de compreensão do paciente.', peso: 0.5 },
        { id: 'com-03', descricao: 'Explica hipóteses, exames e próximos passos sem gerar alarme desnecessário.', peso: 0.5 },
        { id: 'com-04', descricao: 'Orienta sinais de alarme, retorno e medidas de segurança quando aplicável.', peso: 0.6, obrigatorio: true },
      ],
    },
    {
      id: 'anamnese',
      titulo: 'Anamnese dirigida',
      pontos: 4,
      criterios: [
        { id: 'ana-01', descricao: 'Define queixa principal, início, duração, evolução e intensidade.', peso: 0.7, obrigatorio: true },
        { id: 'ana-02', descricao: 'Caracteriza sintomas principais e sintomas associados positivos e negativos relevantes.', peso: 0.9, obrigatorio: true },
        { id: 'ana-03', descricao: 'Investiga antecedentes pessoais, comorbidades, medicações, alergias e fatores de risco.', peso: 0.8 },
        { id: 'ana-04', descricao: 'Explora contexto epidemiológico, familiar, ocupacional e social quando pertinente.', peso: 0.5 },
        { id: 'ana-05', descricao: 'Busca sinais de gravidade e red flags relacionados ao caso.', peso: 1.1, obrigatorio: true },
      ],
    },
    {
      id: 'exameFisico',
      titulo: 'Exame físico',
      pontos: 3,
      criterios: [
        { id: 'fis-01', descricao: 'Solicita/avalia sinais vitais e estado geral.', peso: 0.7, obrigatorio: true },
        { id: 'fis-02', descricao: 'Realiza exame do sistema principal do caso.', peso: 1.0, obrigatorio: true },
        { id: 'fis-03', descricao: 'Busca sinais de gravidade e repercussão sistêmica.', peso: 0.8, obrigatorio: true },
        { id: 'fis-04', descricao: 'Complementa com exame físico dirigido a diferenciais importantes.', peso: 0.5 },
      ],
    },
    {
      id: 'examesComplementares',
      titulo: 'Exames complementares',
      pontos: 3,
      criterios: [
        { id: 'exa-01', descricao: 'Solicita exames essenciais ao diagnóstico e à estratificação de gravidade.', peso: 1.2, obrigatorio: true },
        { id: 'exa-02', descricao: 'Interpreta corretamente achados críticos e exames alterados.', peso: 1.1, obrigatorio: true },
        { id: 'exa-03', descricao: 'Reconhece exames agrupados: hemograma cobre Hb/leucócitos/plaquetas; marcadores inflamatórios cobrem PCR/procalcitonina quando disponíveis.', peso: 0.4 },
        { id: 'exa-04', descricao: 'Evita exames desnecessários ou incompatíveis com a hipótese e urgência.', peso: 0.3 },
      ],
    },
    {
      id: 'raciocinioDiagnostico',
      titulo: 'Raciocínio clínico e diagnóstico',
      pontos: 4,
      criterios: [
        { id: 'rac-01', descricao: 'Formula hipótese principal compatível com quadro clínico.', peso: 1.2, obrigatorio: true },
        { id: 'rac-02', descricao: 'Inclui diferenciais importantes e descarta hipóteses perigosas.', peso: 0.8 },
        { id: 'rac-03', descricao: 'Relaciona anamnese, exame físico e exames complementares.', peso: 1.0, obrigatorio: true },
        { id: 'rac-04', descricao: 'Classifica gravidade, risco e necessidade de urgência/observação/internação.', peso: 1.0, obrigatorio: true },
      ],
    },
    {
      id: 'conduta',
      titulo: 'Conduta e plano terapêutico',
      pontos: 4,
      criterios: [
        { id: 'con-01', descricao: 'Propõe conduta inicial segura e proporcional à gravidade.', peso: 1.0, obrigatorio: true },
        { id: 'con-02', descricao: 'Indica tratamento específico correto quando aplicável.', peso: 1.0, obrigatorio: true },
        { id: 'con-03', descricao: 'Define observação, internação, encaminhamento ou alta segura conforme o caso.', peso: 0.8, obrigatorio: true },
        { id: 'con-04', descricao: 'Orienta retorno, sinais de alarme, seguimento e educação do paciente.', peso: 0.7 },
        { id: 'con-05', descricao: 'Evita condutas perigosas ou incompatíveis com a hipótese.', peso: 0.5, obrigatorio: true },
      ],
    },
  ],
  regrasGerais: [
    'Pontuar em escala total de 0 a 20.',
    'Reconhecer exame físico clicado/registrado no sistema.',
    'Diferenciar: não solicitou; solicitou mas não interpretou; solicitou e interpretou corretamente.',
    'Reconhecer exames agrupados e seus analitos internos.',
    'Não duplicar feedback; cada ponto de melhoria deve ser único e acionável.',
  ],
}
