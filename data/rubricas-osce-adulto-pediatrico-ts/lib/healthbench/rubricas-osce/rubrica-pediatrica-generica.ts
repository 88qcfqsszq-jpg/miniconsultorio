import type { RubricaOSCE } from './types'

export const RUBRICA_PEDIATRICA_GENERICA: RubricaOSCE = {
  id: 'pediatrica-generica-v1',
  versao: '1.0.0',
  tipo: 'pediatrico',
  nome: 'Rubrica OSCE Pediátrica — Genérica',
  totalPontos: 20,
  dominios: [
    {
      id: 'comunicacao',
      titulo: 'Comunicação com responsável e criança',
      pontos: 2,
      criterios: [
        { id: 'pcom-01', descricao: 'Identifica criança e responsável, confirma idade e vínculo.', peso: 0.4, obrigatorio: true },
        { id: 'pcom-02', descricao: 'Usa linguagem acolhedora e compreensível ao cuidador, respeitando a criança.', peso: 0.4 },
        { id: 'pcom-03', descricao: 'Explica gravidade, hipóteses, exames e próximos passos.', peso: 0.5, obrigatorio: true },
        { id: 'pcom-04', descricao: 'Orienta sinais de alarme, retorno e segurança domiciliar.', peso: 0.7, obrigatorio: true },
      ],
    },
    {
      id: 'anamnese',
      titulo: 'Anamnese pediátrica dirigida',
      pontos: 4,
      criterios: [
        { id: 'pana-01', descricao: 'Define queixa principal, início, duração e evolução.', peso: 0.5, obrigatorio: true },
        { id: 'pana-02', descricao: 'Investiga febre, alimentação, hidratação, diurese, evacuações, sono e atividade.', peso: 0.7, obrigatorio: true },
        { id: 'pana-03', descricao: 'Explora sintomas associados e sinais de gravidade pediátricos.', peso: 0.8, obrigatorio: true },
        { id: 'pana-04', descricao: 'Investiga antecedentes gestacionais, parto, neonatal, vacinação, crescimento e desenvolvimento quando pertinente.', peso: 0.7 },
        { id: 'pana-05', descricao: 'Investiga medicações, alergias, doenças prévias, contatos, creche/escola e exposição epidemiológica.', peso: 0.6 },
        { id: 'pana-06', descricao: 'Em lactentes, valoriza mamadas, ganho ponderal, cianose, sudorese, esforço respiratório e irritabilidade/letargia.', peso: 0.7 },
      ],
    },
    {
      id: 'exameFisico',
      titulo: 'Exame físico pediátrico',
      pontos: 3,
      criterios: [
        { id: 'pfis-01', descricao: 'Solicita sinais vitais pediátricos e avalia estado geral/atividade.', peso: 0.7, obrigatorio: true },
        { id: 'pfis-02', descricao: 'Avalia hidratação, perfusão, padrão respiratório e sinais de esforço.', peso: 0.7, obrigatorio: true },
        { id: 'pfis-03', descricao: 'Realiza exame do sistema principal conforme a hipótese.', peso: 0.8, obrigatorio: true },
        { id: 'pfis-04', descricao: 'Avalia crescimento, antropometria, desenvolvimento, pele/mucosas/linfonodos ou sinais de violência quando pertinente.', peso: 0.5 },
        { id: 'pfis-05', descricao: 'Reconhece sinais de gravidade pediátricos.', peso: 0.3, obrigatorio: true },
      ],
    },
    {
      id: 'examesComplementares',
      titulo: 'Exames complementares',
      pontos: 3,
      criterios: [
        { id: 'pexa-01', descricao: 'Solicita exames essenciais e proporcionais à idade/gravidade.', peso: 1.0, obrigatorio: true },
        { id: 'pexa-02', descricao: 'Interpreta exames conforme idade e contexto pediátrico.', peso: 1.0, obrigatorio: true },
        { id: 'pexa-03', descricao: 'Reconhece exames agrupados: hemograma, PCR/procalcitonina, eletrólitos, gasometria, urina, imagem, ECG ou ecocardiograma conforme o caso.', peso: 0.6 },
        { id: 'pexa-04', descricao: 'Evita excesso de exames em quadros leves e não perde exames críticos em urgências pediátricas.', peso: 0.4 },
      ],
    },
    {
      id: 'raciocinioDiagnostico',
      titulo: 'Raciocínio clínico pediátrico e diagnóstico',
      pontos: 4,
      criterios: [
        { id: 'prac-01', descricao: 'Formula hipótese principal correta e compatível com a idade.', peso: 1.1, obrigatorio: true },
        { id: 'prac-02', descricao: 'Inclui diferenciais importantes e urgências pediátricas.', peso: 0.8 },
        { id: 'prac-03', descricao: 'Relaciona idade, sinais clínicos, exame físico e exames complementares.', peso: 1.0, obrigatorio: true },
        { id: 'prac-04', descricao: 'Classifica gravidade e risco, sem tratar a criança como adulto pequeno.', peso: 1.1, obrigatorio: true },
      ],
    },
    {
      id: 'conduta',
      titulo: 'Conduta pediátrica',
      pontos: 4,
      criterios: [
        { id: 'pcon-01', descricao: 'Propõe conduta inicial segura conforme gravidade.', peso: 0.8, obrigatorio: true },
        { id: 'pcon-02', descricao: 'Indica tratamento específico adequado à idade e ao peso quando aplicável.', peso: 0.8, obrigatorio: true },
        { id: 'pcon-03', descricao: 'Define hidratação, oxigênio, antibiótico, broncodilatador, antitérmico ou suporte conforme o caso.', peso: 0.8 },
        { id: 'pcon-04', descricao: 'Define observação, internação, encaminhamento ou alta segura.', peso: 0.7, obrigatorio: true },
        { id: 'pcon-05', descricao: 'Orienta responsável sobre sinais de alarme, retorno e seguimento.', peso: 0.6, obrigatorio: true },
        { id: 'pcon-06', descricao: 'Aciona rede de proteção/notificação quando houver suspeita de violência.', peso: 0.3 },
      ],
    },
  ],
  regrasGerais: [
    'Pontuar em escala total de 0 a 20.',
    'Usar parâmetros pediátricos e gravidade conforme idade.',
    'Reconhecer exame físico pediátrico clicado/registrado no sistema.',
    'Diferenciar: não solicitou; solicitou mas não interpretou; solicitou e interpretou corretamente.',
    'Não duplicar feedback; cada ponto de melhoria deve ser único e acionável.',
  ],
}
