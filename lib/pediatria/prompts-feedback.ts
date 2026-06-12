// Prompts de feedback e correção específicos para pediatria

export function criarPromptCorrecaoPediatrica(
  casoId: string,
  casoPaciente: string,
  caseTitle: string,
  manobrasSolicitadas: any[]
): string {
  return `
Você é um avaliador de OSCE (Objective Structured Clinical Examination) no contexto de PEDIATRIA.

## Seu papel:
Corrigir e dar feedback sobre a abordagem de um estudante de medicina em um caso pediátrico.

## Contexto do caso:
- ID: ${casoId}
- Título: ${caseTitle}
- Paciente: ${casoPaciente}

## Critérios de avaliação PEDIÁTRICOS (NÃO use critérios adultos puros):

### 1. Comunicação Pediátrica
- Apresentação adequada ao responsável e à criança?
- Linguagem adaptada à idade?
- Explicações de procedimentos antes de executar?
- Postura acolhedora e tranquilizadora?
- Envolvimento da criança quando apropriado?

### 2. Anamnese da Queixa Atual
- Investigou início, duração e intensidade?
- Perguntou sobre sinais de gravidade?
- Questionou sintomas associados relevantes?
- Aceitação alimentar e de líquidos?
- Medicações usadas (inclusive caseiras)?
- Contato com pessoas doentes?

### 3. História Pediátrica Essencial
- Estado vacinal e aderência?
- Antecedentes de gestação e parto?
- Internações prévias?
- Alergias a medicamentos?
- Medicamentos de uso contínuo?
- Marcos do desenvolvimento?
- Padrão alimentar atual?

### 4. Exame Físico Pediátrico
- Estado geral adequadamente avaliado?
- Sinais vitais com técnica apropriada para idade?
- FR contada por 1 minuto?
- Sinais de hidratação avaliados?
- Ausculta pulmonar e cardíaca realizada?
- Palpação abdominal e pesquisa de visceromegalias?
- Avaliação de pele/exantema/petéquias quando indicado?

### 5. Procedimentos Pediátricos (se aplicável)
- Técnica adequada de medida (PA, perímetro, FR, etc.)?
- Manguito no tamanho correto para PA?
- Posicionamento adequado?
- Interpretação conforme idade, sexo e estatura?

### 6. Raciocínio Clínico
- Hipótese principal coerente com dados?
- Diferenciais plausíveis mencionados?
- Gravidade adequadamente avaliada?
- Sinais de alerta reconhecidos?
- Decisões justificadas?

### 7. Exames Complementares
- Solicitação apropriada (nem excessiva, nem insuficiente)?
- Justificativa clara para cada exame?
- Escolha adequada conforme hipótese?

### 8. Conduta e Orientação
- Sinais de alarme transmitidos ao responsável?
- Acompanhamento planejado?
- Notificação compulsória mencionada (se caso TB/abuso/dengue)?
- Aconselhamento compatível com idade da criança?

## Manobras/ações solicitadas:
${JSON.stringify(manobrasSolicitadas, null, 2)}

## Sua avaliação deve incluir:
1. Diagnóstico esperado do caso
2. Diagnóstico/hipótese do aluno (se mencionada)
3. Pontos fortes da abordagem
4. Lacunas críticas (itens obrigatórios não executados)
5. Áreas de melhoria
6. Feedback específico pediátrico (não genérico de OSCE adulto)
7. Referência a critérios pediátricos (vacinação, desenvolvimento, antropometria, etc.)

## Importante:
- NÃO use critérios adultos puros para avaliar resposta a sinais vitais ou abordagem geral
- ENFATIZE características pediátricas (comunicação com responsável, desenvolvimento, crescimento)
- Considere idade/faixa etária na avaliação (lactente ≠ criança maior ≠ adolescente)
- Reconheça que pediatria envolve DUAS abordagens simultâneas: criança + responsável

Forneça feedback construtivo, específico e educativo.
`;
}

export function criarPromptFeedbackFinalPediatrico(
  casoId: string,
  diagnosticoEsperado: string,
  diagnosticoAluno: string,
  pontuacao: number,
  pontosFortes: string[],
  pontosPerdidos: string[],
  falaModelo: string
): string {
  return `
Baseado na avaliação de OSCE pediátrico realizada, gere um feedback estruturado:

## Dados da avaliação:
- Caso: ${casoId}
- Diagnóstico esperado: ${diagnosticoEsperado}
- Diagnóstico do aluno: ${diagnosticoAluno}
- Pontuação: ${pontuacao}/20
- Pontos fortes: ${pontosFortes.join("; ")}
- Pontos perdidos: ${pontosPerdidos.join("; ")}

## Fala modelo para referência:
"${falaModelo}"

## Gere um feedback que inclua:

1. **Abertura encorajadora**: Comece reconhecendo o que foi feito bem.

2. **Diagnóstico**: Confirmação do diagnóstico esperado vs. o que o aluno apresentou.

3. **Análise de abordagem**:
   - Comunicação com responsável/criança
   - Qualidade da anamnese pediátrica
   - Adequação do exame físico
   - Raciocínio clínico

4. **Lacunas críticas**: Itens obrigatórios em pediatria que foram perdidos (vacinação, desenvolvimento, gestação/parto, sinais vitais por técnica pediátrica).

5. **Sugestões de melhoria**: Dicas práticas para próximas OSCE pediátricas.

6. **Pontuação e contexto**: Feedback sobre a nota de forma construtiva.

7. **Estudo recomendado**: Tópicos a aprofundar para próximas OSCE.

## Tom:
- Educativo e construtivo
- Reconhecer especificidades pediátricas
- Não fazer parecer falha total se pontuação baixa
- Incentivar aprendizado contínuo

Gere este feedback em português, mantendo estrutura clara.
`;
}

/**
 * Criar prompt para análise de mensagens do chat visando identificar itens de checklist
 *
 * @param mensagens - Array de mensagens da anamnese
 * @param checklist - Checklist esperado
 * @returns Prompt para análise
 */
export function criarPromptAnaliseMensagensChat(
  mensagens: any[],
  checklistItens: any[]
): string {
  const chavetoricamente = checklistItens.map((item) => ({
    id: item.id,
    descricao: item.descricao,
    palavrasChave: item.palavrasChave || [],
  }));

  return `
Você é um analisador de transcripts de consultas pediátricas.

## Sua tarefa:
Analisar as mensagens de uma anamnese pediátrica e identificar quais itens de checklist foram cobertos.

## Mensagens do chat:
${JSON.stringify(mensagens, null, 2)}

## Itens de checklist esperados:
${JSON.stringify(chavetoricamente, null, 2)}

## Análise:
Para cada item de checklist, determine se foi coberto nas mensagens. Use palavra-chave matching ou reconhecimento semântico.

## Retorne:
Um JSON com este formato:
{
  "itensAtingidos": ["item_id_1", "item_id_2", ...],
  "itensNaoAtingidos": ["item_id_3", "item_id_4", ...],
  "observacoes": {
    "item_id_1": "Mencionado em: '...' (mensagem X)",
    "item_id_3": "Não foi perguntado explicitamente"
  }
}

Seja generoso ao interpretar: se o responsável/aluno mencionou algo espontaneamente, conte como atingido.
`;
}
