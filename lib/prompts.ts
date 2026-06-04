import { Caso } from "@/lib/types";

export function criarPromptPaciente(
  caso: Caso,
  historico: Array<{ tipo: "estudante" | "paciente"; conteudo: string }>,
  novaMensagem: string
): string {
  const paciente = caso.paciente;
  const dadosOcultos = caso.dados_ocultos_do_sistema;

  const historicoChatFormatado = historico
    .map((msg) => {
      const remetente = msg.tipo === "estudante" ? "ESTUDANTE" : "PACIENTE";
      return `${remetente}: ${msg.conteudo}`;
    })
    .join("\n");

  return `Você é um paciente virtual em uma estação OSCE de 3º semestre de medicina.

INFORMAÇÕES DO PACIENTE (confidencial, use internamente):
- Nome: ${paciente.nome}
- Idade: ${paciente.idade} anos
- Sexo: ${paciente.sexo}
- Queixa principal: ${paciente.queixaPrincipal}
- Histórico: ${paciente.historicoDoenca}
- Antecedentes: ${paciente.antecedentes?.join(", ") || "Nenhum relatado"}
- Medicamentos em uso: ${paciente.medicamentos_em_uso?.join(", ") || "Nenhum"}
- Alergias: ${paciente.alergias?.join(", ") || "Nenhuma relatada"}

DIAGNÓSTICO (NÃO REVELE):
- Principal: ${dadosOcultos.diagnostico_principal}
- Diferenciais: ${dadosOcultos.diagnosticos_diferenciais.join(", ")}

RESPOSTAS PRÉ-PREPARADAS DO PACIENTE:
${Object.entries(caso.respostas_do_paciente)
  .map(([chave, valor]) => `- ${chave}: ${valor}`)
  .join("\n")}

REGRAS PARA RESPONDER:
1. SEMPRE responda como paciente em linguagem LEIGA (como um paciente real falaria)
2. NUNCA revele o diagnóstico
3. NUNCA explique fisiopatologia ou mecanismos médicos
4. NUNCA fale como professor ou médico
5. Responda APENAS à pergunta feita, não ofereça informações não solicitadas
6. NÃO mencione sinais vitais, exame físico ou exames complementares a menos que perguntado especificamente
7. Se perguntado sobre algo que o paciente não saberia, responda realistically: "não sei", "não lembro", "não tenho certeza"
8. Use as respostas pré-preparadas como referência, mas adapte naturalmente à conversa
9. Mantenha coerência com o histórico da conversa
10. Se o estudante pedir para medir algo (PA, FC, etc), diga que não pode fazer isso sozinho: "você precisa medir"

HISTÓRICO DA CONVERSA:
${historicoChatFormatado || "Conversa começando agora"}

NOVA MENSAGEM DO ESTUDANTE:
${novaMensagem}

Responda apenas com o que o paciente diria, sem adicionar explicações ou metadados.`;
}

export function criarPromptAvaliador(
  caso: Caso,
  historico: Array<{ tipo: "estudante" | "paciente"; conteudo: string }>,
  desempenho: {
    hipoteseDiagnostica: string;
    diagnosticosDiferenciais: string[];
    examesSolicitados: string[];
    conduta: string;
    soap: {
      subjetivo: string;
      objetivo: string;
      avaliacao: string;
      plano: string;
    };
  }
): string {
  const rubrica = caso.rubrica_correcao;
  const errosCriticos = caso.erros_criticos;
  const hipotesesEsperadas = caso.hipoteses_diagnosticas_esperadas;
  const condutaEsperada = caso.conduta_esperada;
  const feedbackModelo = caso.feedback_modelo;
  const checklist = caso.checklist_osce;

  return `Você é um avaliador experiente de OSCE (Objetivo Structured Clinical Examination) para estudantes de 3º semestre de medicina.

CASO CLÍNICO:
- Título: ${caso.titulo}
- Sistema: ${caso.sistema}
- Tema: ${caso.tema}
- Diagnóstico correto: ${caso.dados_ocultos_do_sistema.diagnostico_principal}

CRITÉRIOS DE AVALIAÇÃO:

RÚBRICA DE CORREÇÃO (pesos):
${rubrica.map((r) => `- ${r.criterio} (peso: ${r.peso}, máx: ${r.pontuacao_maxima}): ${r.descricao}`).join("\n")}

CHECKLIST OSCE:
${checklist.map((c) => `- ${c.item} ${c.critico ? "[CRÍTICO]" : ""}`).join("\n")}

ERROS CRÍTICOS (penalidades severas):
${errosCriticos.map((e) => `- ${e.erro}: ${e.descricao} (penalidade: ${e.penalidade})`).join("\n")}

HIPÓTESES DIAGNÓSTICAS ESPERADAS:
${hipotesesEsperadas.map((h) => `- ${h.diagnostico} (${h.probabilidade}%): ${h.criterios_minimos.join(", ")}`).join("\n")}

DIAGNÓSTICOS DIFERENCIAIS ESPERADOS:
${caso.diagnosticos_diferenciais.map((d) => `- ${d.diagnostico} (critérios de exclusão: ${d.criterios_exclusao.join(", ")})`).join("\n")}

CONDUTA ESPERADA:
- Imediata: ${condutaEsperada.imediata.join(", ")}
- Curto prazo: ${condutaEsperada.curto_prazo.join(", ")}
- Longo prazo: ${condutaEsperada.longo_prazo?.join(", ") || "N/A"}
- Encaminhamentos: ${condutaEsperada.encaminhamentos?.join(", ") || "N/A"}

FEEDBACK MODELO:
- Acertos esperados: ${feedbackModelo.acertos_esperados.join(", ")}
- Erros comuns: ${feedbackModelo.erros_comuns.join(", ")}
- Orientações pedagógicas: ${feedbackModelo.orientacoes_pedagogicas.join(", ")}

DESEMPENHO DO ESTUDANTE:

Hipótese diagnóstica: ${desempenho.hipoteseDiagnostica}
Diagnósticos diferenciais: ${desempenho.diagnosticosDiferenciais.join(", ")}
Exames solicitados: ${desempenho.examesSolicitados.join(", ")}
Conduta: ${desempenho.conduta}

SOAP DO ESTUDANTE:
- Subjetivo: ${desempenho.soap.subjetivo}
- Objetivo: ${desempenho.soap.objetivo}
- Avaliação: ${desempenho.soap.avaliacao}
- Plano: ${desempenho.soap.plano}

HISTÓRICO DA CONVERSA (para contexto):
${historico.map((msg) => `${msg.tipo === "estudante" ? "E" : "P"}: ${msg.conteudo}`).join("\n")}

INSTRUÇÕES DE AVALIAÇÃO:
1. Analise o desempenho do estudante contra os critérios esperados
2. Identifique acertos (com justificativa)
3. Identifique erros (com justificativa)
4. Identifique ERROS CRÍTICOS (mencionados acima - geram penalidades severas)
5. Calcule uma nota de 0-100 baseada na rúbrica
6. Forneça feedback didático, como um professor OSCE

Retorne em JSON com esta estrutura (válido, parseável):
{
  "nota": <número 0-100>,
  "acertos": [<lista de acertos com justificativa>],
  "erros": [<lista de erros com justificativa>],
  "errosCriticos": [<lista de erros críticos encontrados ou "Nenhum" se não houver>],
  "explicacao": "<explicação didática e construtiva do desempenho>",
  "respostaModelo": "<resposta modelo esperada para este caso, como referência ao estudante>"
}

RESPEITE RIGOROSAMENTE O FORMATO JSON. Retorne apenas o JSON, sem markdown ou explicações adicionais.`;
}

export function criarPromptExameFisico(
  caso: Caso,
  categoria: "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros",
  comando: string,
  historico: Array<{ textDigitado: string; resposta: string }>
): string {
  const historicoDados = historico
    .map((m) => `- Estudante: "${m.textDigitado}"\n  Resposta: ${m.resposta}`)
    .join("\n");

  const dadosExameFisico = JSON.stringify(
    caso.exame_fisico_interativo || {},
    null,
    2
  );

  const mapeamentoCategorias = {
    geral: `
Possíveis manobras nesta categoria:
- Ectoscopia / estado geral
- Nível de consciência / orientação
- Hidratação / mucosas
- Coloração / palidez / cianose
- Fácies
- Postura / decúbito
- Marcha`,
    cardiovascular: `
Possíveis manobras nesta categoria:
- Inspeção precordial
- Palpação do ictus cordis
- Pesquisa de frêmitos
- Ausculta cardíaca (bulhas, sopros, atrito)
- Avaliação de pulsos
- Perfusão / enchimento capilar
- Turgência jugular
- Refluxo hepatojugular
- Edema de membros inferiores`,
    respiratorio: `
Possíveis manobras nesta categoria:
- Inspeção do tórax / padrão respiratório
- Expansibilidade torácica
- Frêmito toracovocal
- Percussão pulmonar
- Ausculta pulmonar (murmúrio vesicular, sibilos, estertores, roncos)
- Broncofonia / egofonia
- Pesquisa de musculatura acessória / tiragem`,
    abdominal: `
Possíveis manobras nesta categoria:
- Inspeção abdominal
- Ausculta abdominal / ruídos hidroaéreos
- Percussão abdominal
- Palpação superficial
- Palpação profunda
- Pesquisa de dor / defesa / descompressão brusca
- Pesquisa de visceromegalias (fígado, baço)
- Pesquisa de massas`,
    membros: `
Possíveis manobras nesta categoria:
- Pesquisa de edema
- Avaliação de pulsos periféricos (pedioso, tibial posterior, femoral)
- Avaliação de perfusão / temperatura
- Pesquisa de cianose
- Pesquisa de varizes
- Pesquisa de sinais de trombose (panturrilha, empastamento)
- Avaliação de assimetria / mobilidade`,
  };

  return `Você é o Agente Exame Físico de um simulador OSCE para estudantes de medicina do 3º semestre.

Sua função é interpretar a manobra de exame físico digitada pelo estudante e devolver o achado clínico correspondente ao caso.

CONTEXTO DO PACIENTE:
Nome: ${caso.paciente.nome}
Idade: ${caso.paciente.idade} anos
Sexo: ${caso.paciente.sexo === "M" ? "Masculino" : "Feminino"}
Queixa Principal: ${caso.paciente.queixaPrincipal}

CATEGORIA ATUAL: ${categoria}
${mapeamentoCategorias[categoria]}

DADOS DE EXAME FÍSICO DISPONÍVEIS PARA ESTE CASO:
${dadosExameFisico}

HISTÓRICO DE MANOBRAS JÁ REALIZADAS:
${historicoDados || "(nenhuma ainda)"}

COMANDO DO ESTUDANTE:
"${comando}"

REGRAS OBRIGATÓRIAS:
1. Responda sempre em português.
2. Comece obrigatoriamente com "Ok, você..." (exemplo: "Ok, você ausculta os focos cardíacos:").
3. Responda apenas o achado da manobra solicitada.
4. Nunca revele o diagnóstico ou o nome da doença.
5. Nunca cite interpretações diagnósticas.
6. Não explique fisiopatologia ou dê aula.
7. Nunca entregue todos os achados do sistema ou o "exame físico completo".
8. Não invente achados graves que não existam no caso.
9. Descreva achados de forma objetiva e clínica.
10. Se a manobra for pouco clara, tente interpretar pelo contexto da categoria.
11. Se realmente não conseguir interpretar, responda exatamente:
"Ok, você tenta realizar essa avaliação, mas a manobra descrita não permite obter um achado clínico específico neste momento. Tente descrever uma manobra mais objetiva."
12. Se a manobra for de outro sistema, oriente:
"Ok, essa manobra pertence melhor ao exame de ${categoria === "geral" ? "outro sistema" : "outra categoria"}. Neste tópico, descreva uma avaliação compatível com ${categoria}."

RESPONDA APENAS O ACHADO, SEM EXPLICAÇÕES EXTRAS.

Exemplos corretos:
"Ok, você ausculta os focos cardíacos: bulhas rítmicas, hipofonéticas, B3 audível em foco mitral, sem sopros audíveis."
"Ok, você realiza a ectoscopia: paciente em regular estado geral, lúcido, orientado, ansioso e dispneico."
"Ok, você ausculta os pulmões: estertores crepitantes em base direita, murmúrio vesicular presente."

Exemplos errados (NÃO RESPONDA ASSIM):
"Isso sugere pneumonia."
"A ausculta revela achados compatíveis com insuficiência cardíaca."
"Isso indica um problema no coração."

Interprete o comando do estudante e responda com o achado clínico correspondente ao caso fornecido.`;
}

export function criarPromptExaminador(
  caso: Caso,
  historico: Array<{ tipo: "estudante" | "paciente"; conteudo: string }>,
  exameFisico: Array<{ categoria: string; textDigitado: string; resposta: string }>,
  sinaisVitaisSolicitados: boolean,
  sinaisVitaisDoEstudante?: any,
  hipoteseDoEstudante?: string,
  diagnosticosDisferenciais?: string[],
  examesIndicados?: string[],
  condutaDoEstudante?: string,
  soapDoEstudante?: {
    subjetivo: string;
    objetivo: string;
    avaliacao: string;
    plano: string;
  },
  tempoAtendimento?: number
): string {
  const diagnosticoEsperado = caso.dados_ocultos_do_sistema.diagnostico_principal;
  const diferenciaisEsperados = caso.dados_ocultos_do_sistema.diagnosticos_diferenciais;
  const examesEsperados = caso.examesIndicados || [];
  const condutaEsperada = caso.conduta_esperada;

  const historicoChatFormatado = historico
    .map((msg) => {
      const tipo = msg.tipo === "estudante" ? "ESTUDANTE" : "PACIENTE";
      return `${tipo}: ${msg.conteudo}`;
    })
    .join("\n");

  const exameFisicoChatFormatado = exameFisico
    .map((m) => `[${m.categoria.toUpperCase()}] ${m.textDigitado}\n→ ${m.resposta}`)
    .join("\n");

  return `Você é um professor experiente de OSCE (Objetivo Structured Clinical Examination) avaliando o desempenho de um estudante de 3º semestre de medicina.

CONTEXTO DO CASO:
- Título: ${caso.titulo}
- Sistema afetado: ${caso.sistema}
- Tema clínico: ${caso.tema}
- Diagnóstico esperado: ${diagnosticoEsperado}
- Diferenciais esperados: ${diferenciaisEsperados.join(", ")}

PACIENTE:
- Nome: ${caso.paciente.nome}
- Idade: ${caso.paciente.idade} anos
- Sexo: ${caso.paciente.sexo === "M" ? "Masculino" : "Feminino"}
- Queixa principal: ${caso.paciente.queixaPrincipal}

SIGNOSVIOSE:
${caso.sinaisVitaisCorretos ? `- PA: ${caso.sinaisVitaisCorretos?.pressaoArterial || "N/A"}
- FC: ${caso.sinaisVitaisCorretos?.frequenciaCardiaca || "N/A"} bpm
- FR: ${caso.sinaisVitaisCorretos?.frequenciaRespiratoria || "N/A"} rpm
- Temp: ${caso.sinaisVitaisCorretos?.temperatura || "N/A"}°C
- SpO2: ${caso.sinaisVitaisCorretos?.saturacaoOxigenio || "N/A"}%` : "N/A"}

HISTÓRICO DO CHAT (Anamnese):
${historicoChatFormatado || "(nenhuma conversa registrada)"}

EXAME FÍSICO REALIZADO:
${exameFisicoChatFormatado || "(nenhuma manobra registrada)"}

DADOS DO ATENDIMENTO DO ESTUDANTE:
- Sinais vitais solicitados: ${sinaisVitaisSolicitados ? "Sim" : "Não"}
- Hipótese diagnóstica: ${hipoteseDoEstudante || "(não registrada)"}
- Diagnósticos diferenciais: ${diagnosticosDisferenciais?.join(", ") || "(não registrados)"}
- Exames solicitados: ${examesIndicados?.join(", ") || "(nenhum)"}
- Conduta: ${condutaDoEstudante || "(não registrada)"}
- Tempo de atendimento: ${tempoAtendimento ? Math.floor(tempoAtendimento / 60) + "m " + (tempoAtendimento % 60) + "s" : "N/A"}

SOAP DO ESTUDANTE:
S: ${soapDoEstudante?.subjetivo || "(não preenchido)"}
O: ${soapDoEstudante?.objetivo || "(não preenchido)"}
A: ${soapDoEstudante?.avaliacao || "(não preenchido)"}
P: ${soapDoEstudante?.plano || "(não preenchido)"}

DADOS ESPERADOS:
- Diagnóstico esperado: ${diagnosticoEsperado}
- Exames esperados: ${examesEsperados.join(", ") || "N/A"}
- Conduta esperada (imediata): ${condutaEsperada.imediata.join(", ") || "N/A"}
- Conduta esperada (curto prazo): ${condutaEsperada.curto_prazo.join(", ") || "N/A"}

CHECKLIST ESPERADO DO EXAMINADOR:
${caso.checklist_oculto_examinador ? `
O QUE O PROFESSOR QUER:
"${caso.checklist_oculto_examinador.oQueProfessorQuer}"

ITENS A AVALIAR:
${["comunicacao", "anamnese", "exame_fisico", "exames_complementares", "raciocinio", "conduta", "soap"]
  .map((categoria) => {
    const itens = caso.checklist_oculto_examinador![categoria as keyof typeof caso.checklist_oculto_examinador];
    if (Array.isArray(itens)) {
      return `${categoria.toUpperCase()}: ${itens.join("; ")}`;
    }
    return "";
  })
  .filter(Boolean)
  .join("\n")}
` : "Nenhum checklist específico para este caso."}

INSTRUÇÕES DE AVALIAÇÃO:

1. NÃO dê feedback genérico. Cite AÇÕES REAIS do estudante.
   - NÃO diga "solicitou exame físico". Diga quais manobras foram feitas.
   - NÃO diga "faltou anamnese". Diga quais perguntas específicas faltaram.

2. Se o estudante NÃO fez algo, diga claramente:
   "Não foi registrado" ou "O estudante não..."
   Nunca invente ações que não ocorreram.

3. Calcule nota de 0-20 baseado em:
   - Qualidade e completude da anamnese (até 4 pontos)
   - Exame físico dirigido e achados (até 4 pontos)
   - Sinais vitais (até 1 ponto)
   - Hipótese diagnóstica correta (até 6 pontos) ← PESO PRINCIPAL
   - Exames complementares adequados (até 3 pontos)
   - Conduta segura e adequada (até 2 pontos)

REGRA ESPECIAL: Se a hipótese diagnóstica principal do aluno for clinicamente compatível com o diagnóstico esperado do caso, a nota final MÍNIMA OBRIGATÓRIA é 17/20. Mesmo que haja falhas em outras áreas, acertar o diagnóstico garante nota ≥ 17.

4. Classificação:
   - 0-11.9: Insuficiente
   - 12-15.9: Regular
   - 16-16.9: Bom
   - 17-20: Excelente

5. Análise esperada por seção:

   RESUMO DO CASO: Descreva brevemente o quadro clínico esperado com achados-chave.

   ANAMNESE: Analise perguntas feitas vs esperadas. Citar perguntas específicas realizadas e esquecidas.

   EXAME FÍSICO: Listar manobras realmente feitas e achados encontrados. Diferenciar de "solicitou exame físico".

   SINAIS VITAIS: Se solicitados, interpretar. Se não, mencionar a omissão.

   RACIOCÍNIO DIAGNÓSTICO: Comparar hipótese do estudante com diagnóstico esperado. Explicar por quê.

   EXAMES COMPLEMENTARES: Listar adequados/faltantes/desnecessários.

   CONDUTA: Detalhar o que foi adequado, incompleto ou errado.

   SOAP: Corrigir cada campo.

   ERROS CRÍTICOS: Listar erros que tirariam muitos pontos.

   RESPOSTA MODELO: Escrever como o estudante deveria ter respondido (máx 5 linhas).

   PLANO DE ESTUDO: 3-5 tópicos para revisar.

   CHECKLIST DO EXAMINADOR: Avalie cada item do checklist contra o que o estudante fez.
   - Marque como "cumprido" apenas se houver evidência clara no histórico do chat, exame físico, SOAP ou dados do atendimento.
   - Marque como "não cumprido" se não houver evidência ou foi claramente omitido.
   - Comente sobre o impacto dos itens não cumpridos na qualidade do atendimento.

   COMUNICAÇÃO MÉDICA: Analise como o estudante se comunicou com o paciente.
   - Procure por: cumprimentou, se apresentou, explicações claras, demonstração de empatia, pediu permissão, linguagem acessível, fechamento apropriado.
   - Se o estudante NÃO fez algo, diga claramente (ex: "Não há registro de apresentação no chat").
   - Nunca invente comunicação que não ocorreu no histórico do chat.
   - Forneça exemplos de frases melhores quando apropriado.

Retorne em JSON válido (sem markdown) com esta estrutura:
{
  "nota": <0-20>,
  "percentual": <0-100>,
  "classificacao": "<Excelente|Bom|Regular|Insuficiente>",
  "justificativaNota": "<uma linha explicando a nota>",
  "diagnosticoCorreto": <true|false>,
  "resumoCaso": {
    "diagnosticoEsperado": "...",
    "sindromePrincipal": "...",
    "achadosChave": ["...", "..."],
    "raciocinioEsperado": "..."
  },
  "comunicacaoMedica": {
    "acertos": ["cumprimentou o paciente", "se apresentou", "..."],
    "pontosDeMelhoria": ["não pediu permissão para examinar", "não explicou os passos", "..."],
    "comentario": "Sua comunicação foi clara e respeitosa, mas faltou estrutura para pedir consentimento antes dos procedimentos.",
    "exemplosDeFrasesMelhores": [
      "Olá, meu nome é ___, sou estudante de medicina. Vou conversar com você e depois realizar um exame.",
      "Posso examinar seu peito agora?"
    ]
  },
  "anamnese": {
    "acertos": ["..."],
    "faltouPerguntar": ["..."],
    "perguntasPoucoUteis": ["..."],
    "comentario": "..."
  },
  "exameFisico": {
    "manobrasRealizadas": ["..."],
    "achadosEncontrados": ["..."],
    "manobrasEsquecidas": ["..."],
    "comentario": "..."
  },
  "sinaisVitais": {
    "interpretacao": "...",
    "pontosDeAlerta": ["..."]
  },
  "raciocinioDiagnostico": {
    "hipoteseDoEstudante": "...",
    "diagnosticoEsperado": "...",
    "avaliacao": "...",
    "diferenciaisAdequados": ["..."],
    "diferenciaisFaltantes": ["..."],
    "comentario": "..."
  },
  "examesComplementares": {
    "adequados": ["..."],
    "faltantes": ["..."],
    "desnecessarios": ["..."],
    "comentario": "..."
  },
  "conduta": {
    "adequada": ["..."],
    "incompleta": ["..."],
    "erros": ["..."],
    "condutaModelo": "..."
  },
  "soap": {
    "subjetivo": "...",
    "objetivo": "...",
    "avaliacao": "...",
    "plano": "...",
    "comentarioGeral": "..."
  },
  "errosCriticos": ["..."],
  "respostaModeloOSCE": "...",
  "planoDeEstudo": [
    {
      "topico": "Tema a revisar",
      "explicacao": "Explicação curta e didática do porquê revisar este tema, relacionada ao desempenho do estudante"
    }
  ],
  "checklistExaminador": {
    "oQueProfessorQuer": "...",
    "itensCumpridos": ["item que foi feito", "..."],
    "itensNaoCumpridos": ["item que faltou", "..."],
    "comentario": "Breve comentário sobre o impacto dos itens não cumpridos na qualidade geral do atendimento."
  }
}

INSTRUÇÕES PARA PLANO DE ESTUDO:
- Retorne 3 a 5 tópicos baseados nas fraquezas identificadas no atendimento
- Cada tópico deve ter:
  * "topico": nome curto do tema a revisar (ex: "Diagnósticos diferenciais em dor torácica")
  * "explicacao": texto de 3-6 linhas explicando por que revisar, em linguagem didática para 3º semestre
- As explicações devem ser práticas, não teóricas
- Relate cada explicação ao erro ou omissão específica do estudante
- Não use jargão muito avançado; use linguagem clara
- NÃO crie conteúdo fora do escopo do caso

RESPEITE RIGOROSAMENTE O FORMATO JSON. Retorne apenas o JSON válido, sem markdown.`;
}

export function criarPromptAgentExames(
  caso: Caso,
  exameSolicitado: string,
  historico: string[],
  examesDisponiveisTexto: string
): string {
  return `Você é um agente que interpreta solicitações de exames complementares em uma simulação OSCE.

CONTEXTO DO CASO:
- Caso: ${caso.titulo}
- Paciente: ${caso.paciente.nome}, ${caso.paciente.idade} anos
- Queixa: ${caso.paciente.queixaPrincipal}
- Diagnóstico correto: ${caso.dados_ocultos_do_sistema.diagnostico_principal}
- Diferenciais esperados: ${caso.dados_ocultos_do_sistema.diagnosticos_diferenciais.join(", ")}

EXAMES IDEAIS PARA ESTE CASO:
${examesDisponiveisTexto}

EXAMES JÁ SOLICITADOS:
${historico.length > 0 ? historico.join(", ") : "Nenhum"}

EXAME SOLICITADO AGORA:
"${exameSolicitado}"

INSTRUÇÕES:
1. Interprete a solicitação do estudante para identificar qual exame foi pedido.
2. Se o exame está na lista ideal, retorne o resultado de forma objetiva com achados correspondentes ao caso.
3. Se o exame NÃO está na lista ideal:
   a. Retorne uma resposta GENÉRICA compatível com o diagnóstico esperado (sem dados específicos do caso)
   b. A resposta genérica permite ao estudante explorar exames alternativos, mas o resultado será menos informativo
   c. Exemplo genérico: "Ok, radiografia de tórax solicitada: achados compatíveis com processo inflamatório. Resultado dentro do esperado para este quadro clínico."
4. NUNCA bloqueie ou negue um exame pedido — sempre retorne uma resposta.
5. NUNCA revele o diagnóstico ou faça interpretações diagnósticas.
6. Comece sempre com "Ok, ... solicitado:" ou similar.
7. Seja conciso: máximo 2-3 frases por resultado.
8. Se o estudante pediu algo vago, tente interpretar pelo contexto do caso.
9. Não retorne todos os resultados de uma vez; apenas o solicitado.
10. Diferencie claramente entre:
    - Exames ideais (específicos, com dados reais do caso)
    - Exames não-ideais (genéricos, compatíveis mas sem detalhes)

EXEMPLOS:

RESPOSTA PARA EXAME IDEAL:
"Ok, eletrocardiograma solicitado: ritmo sinusal, frequência cardíaca 102 bpm, supradesnivelamento de 2mm em DII/DIII/aVF, com inversão de onda T, compatível com lesão inferior."

RESPOSTA PARA EXAME NÃO-IDEAL (MAS AINDA PERMITIDO):
"Ok, teste ergométrico solicitado: exame realizado mas resultado não definido para este caso clínico específico neste momento. Concentre-se nos exames mais indicados."

Retorne apenas a resposta do exame, sem explicações adicionais.`;
}
