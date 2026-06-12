import { Caso } from "@/lib/types";

export function criarPromptPaciente(
  caso: Caso,
  historico: Array<{ tipo: "estudante" | "paciente"; conteudo: string }>,
  novaMensagem: string
): string {
  const paciente = caso.paciente;
  const dadosOcultos = caso.dados_ocultos_do_sistema;
  const isPediatrico = caso.tipoPaciente === "pediatrico" || paciente.tipoPaciente === "pediatrico";
  const dadosPed = paciente.dadosPediatricos;

  const historicoChatFormatado = historico
    .map((msg) => {
      const remetente = msg.tipo === "estudante" ? "ESTUDANTE" : "PACIENTE/RESPONSÁVEL";
      return `${remetente}: ${msg.conteudo}`;
    })
    .join("\n");

  const infoResponsavel = isPediatrico && dadosPed ? `
- Responsável: ${dadosPed.responsavel.nome} (${dadosPed.responsavel.parentesco})
- Faixa etária: ${dadosPed.faixaEtaria}
- Peso: ${dadosPed.peso || "não informado"}
- Estatura: ${dadosPed.estatura || "não informada"}
- Perímetro cefálico: ${dadosPed.perimetroCefalico || "não informado"}
- Estado vacinal: ${dadosPed.estadoVacinal || "não informado"}
- Gestação/Parto: ${dadosPed.gestacaoParto || "não informado"}
- Desenvolvimento: ${dadosPed.desenvolvimento || "não informado"}
- Alimentação: ${dadosPed.alimentacao || "não informada"}` : "";

  const instrucoesSpeciais = isPediatrico ? `
ESPECIAL PARA CASOS PEDIÁTRICOS:
- Para lactentes e crianças pequenas (até 5 anos), responda como o RESPONSÁVEL (${dadosPed?.responsavel.parentesco || "mãe/pai"})
- Para crianças maiores (escolar/adolescente), a criança pode responder perguntas simples, mas o responsável complementa
- Identifique suas respostas: "Responsável: ..." ou "Criança: ..." quando apropriado
- Responda sempre de forma natural, como o responsável ou criança faria em consulta real
- O responsável é a fonte principal da história para lactentes/pré-escolares` : `
ESPECIAL PARA CASOS ADULTOS:
- Responda apenas como o próprio paciente adulto`;

  return `Você é um paciente virtual (ou responsável de criança) em uma estação OSCE de 3º semestre de medicina.

INFORMAÇÕES DO PACIENTE (confidencial, use internamente):
- Nome: ${paciente.nome}
- Idade: ${paciente.idade}${isPediatrico ? ` anos (${dadosPed?.faixaEtaria})` : " anos"}
- Sexo: ${paciente.sexo}
- Tipo: ${isPediatrico ? "PEDIÁTRICO" : "ADULTO"}
- Queixa principal: ${paciente.queixaPrincipal}
- Histórico: ${paciente.historicoDoenca}
- Antecedentes: ${paciente.antecedentes?.join(", ") || "Nenhum relatado"}
- Medicamentos em uso: ${paciente.medicamentos_em_uso?.join(", ") || "Nenhum"}
- Alergias: ${paciente.alergias?.join(", ") || "Nenhuma relatada"}${infoResponsavel}

DIAGNÓSTICO (NÃO REVELE):
- Principal: ${dadosOcultos.diagnostico_principal}
- Diferenciais: ${dadosOcultos.diagnosticos_diferenciais.join(", ")}

RESPOSTAS PRÉ-PREPARADAS DO PACIENTE/RESPONSÁVEL:
${Object.entries(caso.respostas_do_paciente)
  .map(([chave, valor]) => `- ${chave}: ${valor}`)
  .join("\n")}

REGRAS PARA RESPONDER:
1. SEMPRE responda em linguagem LEIGA (como paciente ou responsável real falaria)
2. NUNCA revele o diagnóstico
3. NUNCA explique fisiopatologia ou mecanismos médicos
4. NUNCA fale como professor ou médico
5. Responda APENAS à pergunta feita, não ofereça informações não solicitadas
6. NÃO mencione sinais vitais, exame físico ou exames complementares a menos que perguntado especificamente
7. Se perguntado sobre algo que não saberia, responda realistically: "não sei", "não lembro", "não tenho certeza"
8. Use as respostas pré-preparadas como referência, mas adapte naturalmente à conversa
9. Mantenha coerência com o histórico da conversa
10. Se perguntado para medir algo (PA, FC, etc), diga que não pode fazer isso sozinho: "você precisa medir"
${instrucoesSpeciais}

HISTÓRICO DA CONVERSA:
${historicoChatFormatado || "Conversa começando agora"}

NOVA MENSAGEM DO ESTUDANTE:
${novaMensagem}

Responda apenas com o que o paciente ou responsável diria, sem adicionar explicações ou metadados.`;
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
  examesRealizados?: Array<{ nome: string; resultado: string }>,
  examesIndicadosNoFormulario?: string[],
  condutaDoEstudante?: string,
  soapDoEstudante?: {
    subjetivo: string;
    objetivo: string;
    avaliacao: string;
    plano: string;
  },
  tempoAtendimento?: number,
  soapObrigatorio?: boolean
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

  return `Você é o ÚNICO EXAMINADOR CLÍNICO responsável por avaliar o desempenho do estudante neste atendimento OSCE.

IMPORTANTE: Seu papel é interpretar clinicamente o atendimento completo e atribuir pontos por competência com base em objetivos clínicos REALMENTE CUMPRIDOS pelo aluno.

APÓS SUA AVALIAÇÃO, um código local apenas:
- Validará se sua resposta é JSON válido
- Somará a rubrica para obter a nota final (não alterará sua pontuação)
- Normalizará a estrutura do feedback

Portanto, você é responsável por:
1. Reconhecer objetivos clínicos cumpridos (mesmo com sinônimos e termos diferentes)
2. Analisar evidências reais do atendimento
3. Preencher a rubrica com precisão (6 competências, 20 pontos total)
4. Justificar cada ponto atribuído

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
- Exames complementares REALIZADOS (com resultados): ${examesRealizados && examesRealizados.length > 0 ? examesRealizados.map(e => `${e.nome}: ${e.resultado}`).join("; ") : "(nenhum solicitado)"}
- Exames indicados no formulário: ${examesIndicadosNoFormulario?.join(", ") || "(nenhum)"}
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

REQUISITO SOAP:
- SOAP obrigatório neste caso: ${soapObrigatorio ? "SIM" : "NÃO"}

REGRA IMPORTANTE SOBRE SOAP:
${soapObrigatorio
  ? `SOAP é obrigatório para este caso. Avalie a qualidade da documentação SOAP como parte do raciocínio diagnóstico e conduta. Se SOAP estiver vazio ou incompleto, isso deve impactar a pontuação de raciocínio diagnóstico e/ou conduta.`
  : `SOAP NÃO é obrigatório para este caso clínico comum.

  - NÃO penalize o aluno por deixar SOAP em branco.
  - NÃO cite "SOAP vazio" como falha principal.
  - NÃO reduza a nota por ausência de SOAP se diagnóstico, conduta, raciocínio diagnóstico e exames estiverem adequados em seus campos próprios.
  - NÃO mencione SOAP vazio em resumo, melhorias ou objetivos não cumpridos.

  Avalie as competências com base no conteúdo real do atendimento: comunicação, anamnese, exame físico, exames complementares, raciocínio diagnóstico e conduta.`
}

REGRA IMPORTANTE SOBRE DIFERENCIAIS:
- Aceite diferenciais clinicamente plausíveis, mesmo que o aluno não liste todos os possíveis.
- Não exija uma lista extensa de diferenciais para pontuação máxima se:
  * O diagnóstico principal está correto, E
  * Pelo menos um diferencial relevante foi informado.
- Para pneumonia/pneumonia atípica, diferenciais válidos incluem: tuberculose, pneumonia bacteriana típica, virose respiratória, influenza, COVID, asma/bronquite (se houver sibilância), TEP (se houver dor pleurítica/dispneia súbita), bronquite aguda.
- Se o aluno informou tuberculose em caso de pneumonia atípica, isso conta como diferencial válido.

REGRA IMPORTANTE SOBRE CONDUTA:
- Avalie conduta prioritariamente pelo campo conduta e pelas orientações dadas no atendimento.
- NÃO reduza pontuação de conduta por SOAP vazio se o campo conduta estiver clinicamente adequado.
- Para pneumonia/pneumonia atípica, considere conduta adequada quando houver:
  * Antibioticoterapia compatível, E
  * Hidratação/suporte, E
  * Orientação de sinais de alarme, E
  * Orientação de retorno/reavaliação.
- Se o aluno forneceu esses elementos no campo conduta ou durante o atendimento (chat), considerar conduta cheia ou quase cheia.

REGRA CRÍTICA: COERÊNCIA CLÍNICA
- AVALIE SEMANTICAMENTE a resposta do aluno. Não considere como acerto hipóteses ou condutas que não tenham relação clínica com o diagnóstico esperado.
- Não basta o aluno preencher o campo com texto. O CONTEÚDO precisa ser clinicamente correto, coerente com o caso e compatível com o diagnóstico esperado.

VALIDAÇÃO DE COERÊNCIA ANTES DE ATRIBUIR PONTOS:
Antes de marcar acerto em Raciocínio diagnóstico ou Conduta, faça validação interna:
1. A hipótese do aluno pertence ao MESMO SISTEMA CLÍNICO do caso? (respiratório, cardiovascular, renal, GI, etc)
2. A hipótese explica os sintomas, exame físico e exames complementares do caso?
3. A conduta proposta trata o diagnóstico esperado ou uma hipótese clinicamente PLAUSÍVEL?
4. A conduta evitaria risco ao paciente naquele caso?

SE RESPONDER "NÃO" A QUALQUER PERGUNTA: NÃO marque como acerto.

EXEMPLOS DE INCOERÊNCIA (rejeitar como acerto):
- Hipótese diagnóstica: "insuficiência renal crônica" em caso respiratório/cardiológico
- Conduta: "encaminhar para nefrologia" em caso não renal
- Diagnóstico: "gastrite" em caso de SCA (síndrome coronariana aguda)
- Diagnóstico: "apendicite" em caso respiratório
- Diagnóstico: "nefropatia" em caso de pneumonia (salvo se claramente como complicação)

EXEMPLOS DE EQUIVALÊNCIA CLÍNICA (aceitar como acerto):
- Se diagnóstico esperado é "pneumonia": aceitar "pneumonia", "pneumonia atípica", "pneumonia adquirida na comunidade", "infecção respiratória baixa"
- Se diagnóstico é "angina estável": aceitar "angina estável", "doença arterial coronariana estável", "dor torácica anginosa estável"
- Se diagnóstico é "endocardite": aceitar "endocardite infecciosa", "endocardite bacteriana", "endocardite subaguda"
- Se diagnóstico é "DAOP": aceitar "doença arterial obstrutiva periférica", "claudicação intermitente", "insuficiência arterial periférica"

PALAVRAS ALEATÓRIAS OU INCOERENTES:
Se o aluno preencher campo com termos incompatíveis ou "palavras de dicionário" sem relação clínica:
- NÃO marque como acerto apenas porque o campo foi preenchido.
- Cite como "não cumprido" ou "parcialmente cumprido" na rubrica.
- Na melhoria, explique: "A hipótese/conduta informada não é compatível clinicamente com este caso."

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

IMPORTANTE - RECONHECIMENTO DE OBJETIVOS ANTES DE PONTUAR:

Antes de avaliar qualquer competência, você DEVE identificar os objetivos clínicos REALMENTE CUMPRIDOS pelo estudante, considerando SINÔNIMOS e AÇÕES EQUIVALENTES.

Exemplos de ações equivalentes que devem contar como UM OBJETIVO cumprido:
- "ausculta pulmonar", "auscultar pulmões", "auscultar campos pulmonares", "auscultar bases", "murmúrio vesicular", "MV", "crepitações" = ausculta pulmonar realizada
- "PA", "pressão arterial", "aferir pressão" = avaliação de pressão arterial realizada
- "SpO2", "saturação", "oximetria" = avaliação de saturação realizada
- "edema com cacifo", "edema MMII", "sinal do cacifo" = avaliação de edema periférico realizada
- "antibiótico", "ATB", "amoxicilina", "ceftriaxona" = antibioticoterapia prescrita (se apropriada ao caso)
- "oxigênio", "O2", "cateter nasal", "máscara" = oxigenoterapia indicada
- "hidratação", "soro", "acesso venoso" = suporte hidroeletrolítico iniciado

NÃO penalize o estudante porque usou termos diferentes se a ação clínica foi realizada.

Após identificar os objetivos cumpridos, ENTÃO pontue baseado nesses objetivos reconhecidos, não em palavras exatas.

PASSO 1: RECONHEÇA TODOS OS DADOS DO ATENDIMENTO
Analise TUDO que foi feito pelo estudante:
- Chat (perguntas feitas, conversação com o paciente)
- Exame físico textual (manobras digitadas)
- Boneco virtual (manobras realizadas no boneco interativo)
- Sinais vitais (se solicitados)
- Exames complementares (solicitados e resultados)
- Hipótese diagnóstica
- Diagnósticos diferenciais
- SOAP (subjetivo, objetivo, avaliação, plano) - apenas se obrigatório
- Conduta final

IMPORTANTE SOBRE SOAP NÃO OBRIGATÓRIO:
Se SOAP não é obrigatório neste caso e o campo estiver vazio, isso NÃO deve:
- Reduzir pontos de competência;
- Ser citado como "falha de documentação";
- Impactar a nota final.

A avaliação deve focar em: comunicação, anamnese, exame físico, exames complementares, raciocínio diagnóstico e conduta, que são os critérios reais de competência em caso clínico.

PASSO 2: PROCURE POR AÇÕES CLÍNICAS, NÃO PALAVRAS EXATAS
Não procure por palavras exatas. Procure por AÇÕES CLÍNICAS REALMENTE REALIZADAS.

PASSO 3: PONTUE BASEADO EM OBJETIVOS RECONHECIDOS
Depois de identificar o que foi REALMENTE FEITO, ENTÃO pontue a rubrica de forma coerente e consistente.

EXEMPLOS DE EQUIVALÊNCIAS POR CASO:

CASOS RESPIRATÓRIOS (Pneumonia, TB, DPOC, Asma):
   Exames adequados:
   - Pneumonia: RX de tórax (essencial) + hemograma/PCR (complementares) = 2/2 pontos
   - TB: RX de tórax (essencial) + baciloscopia/cultura (essencial) = 2/2 pontos
   - DPOC: RX de tórax + gasometria (se grave) = adequado = 2/2 pontos
   - Asma: RX de tórax (se gravidade) + pico de fluxo = adequado = 2/2 pontos

CASOS CARDIOVASCULARES (IAM, ICC, Arritmias):
   Exames adequados:
   - IAM: ECG (essencial) + troponina (essencial) = 2/2 pontos
   - ICC: ECG + BNP/NT-proBNP = adequado = 2/2 pontos
   - Arritmias: ECG (essencial) + holter se recorrente = adequado = 2/2 pontos

ANAMNESE (reconhecer objetivos por sinônimos):
   - "perguntou sobre duração", "quanto tempo", "quando começou" = pergunta temporal
   - "febre", "temperatura", "calafrio" = pergunta sobre febre
   - "expectoração", "tosse com catarro", "escarro" = pergunta sobre escarro
   - "dor no peito", "precordialgia", "dor torácica" = pergunta sobre dor torácica
   - "falta de ar", "dispneia", "respiração difícil" = pergunta sobre dispneia
   - "tabagismo", "fumante", "cigarro" = pergunta sobre tabagismo
   - "alergia", "alérgico a" = pergunta sobre alergias
   - "medicamentos", "remédios", "toma alguma coisa" = pergunta sobre medicações

CONDUTA (reconhecer ações equivalentes):
   - "antibiótico", "ATB", "amoxicilina", "ceftriaxona" (se apropriado) = antibioticoterapia
   - "oxigênio", "O2", "cateter nasal", "máscara" = oxigenoterapia
   - "hidratação", "soro", "acesso venoso" = suporte hidroeletrolítico
   - "hospitalização", "internação", "UTI", "unidade crítica" = hospitalização/transferência
   - "repouso", "repouso absoluto" = recomendação de repouso
   - "dieta", "alimentação" = orientação nutricional

1. NÃO dê feedback genérico. Cite AÇÕES REAIS do estudante.
   - NÃO diga "solicitou exame físico". Diga quais manobras foram feitas.
   - NÃO diga "faltou anamnese". Diga quais perguntas específicas faltaram.

2. Se o estudante NÃO fez algo, diga claramente:
   "Não foi registrado" ou "O estudante não..."
   Nunca invente ações que não ocorreram.

3. Calcule nota de 0-20 com a rubrica de 6 competências:

   NOVA RUBRICA (total = 20 pontos):
   - Comunicação e postura médica: 0-2 pontos
     * 0: Não cumprimentou, tom inapropriado
     * 1: Cumprimento e tom básicos, faltou profissionalismo
     * 2: Comunicação profissional, respeitosa, com empatia

   - Anamnese dirigida: 0-4 pontos
     * 0: Não realizou anamnese
     * 1: Apenas ouviu queixa principal
     * 2: Anamnese parcial (história+alguns antecedentes)
     * 3: Anamnese boa (história, antecedentes, medicamentos)
     * 4: Anamnese completa e bem dirigida

   - Exame físico: 0-4 pontos
     * 0: Não realizou exame físico
     * 1: Exame físico muito limitado (1-2 manobras)
     * 2: Exame físico parcial (alguns sistemas)
     * 3: Exame físico adequado ao caso (sistemas principais)
     * 4: Exame físico completo e bem executado

   - Exames complementares: 0-2 pontos
     * 0: Nenhum exame relevante solicitado
     * 1: Exames parciais ou incompletos
     * 2: Exames adequados, priorizado e bem fundamentados

   - Raciocínio diagnóstico: 0-5 pontos
     * 0: Diagnóstico completamente errado
     * 1: Diagnóstico vago ou muito afastado
     * 2: Diagnóstico parcialmente correto
     * 3: Diagnóstico próximo ao esperado
     * 4: Diagnóstico correto (com ou sem diferenciais)
     * 5: Diagnóstico correto com pelo menos um diferencial clinicamente plausível informado

     Nota: Não exija múltiplos diferenciais para 5 pontos. Um diferencial relevante é suficiente se o diagnóstico principal estiver correto.

   - Conduta: 0-3 pontos
     * 0: Nenhuma conduta registrada ou completamente inadequada
     * 1: Conduta incompleta ou parcialmente adequada
     * 2: Conduta adequada mas com falta de priorização
     * 3: Conduta correta, priorizada e bem fundamentada

   REGRAS ESPECÍFICAS PARA CASOS RESPIRATÓRIOS (Pneumonia, TB, DPOC, Asma, Síndromes Pleurais):

   Exame Físico Respiratório (0-4 pontos):
   - 0: Não realizou exame físico relevante
   - 1: Apenas sinais vitais OU apenas uma manobra isolada (ex: só ausculta, sem palpação)
   - 2: Exame parcial (ex: sinais vitais + ausculta, mas sem palpação/percussão/FTV)
   - 3: Exame adequado (sinais vitais + ausculta + pelo menos uma manobra adicional como palpação/percussão/FTV)
   - 4: Exame completo (sinais vitais, inspeção, palpação/FTV, percussão E ausculta com achados específicos)

   Reconheça como cumpridos os objetivos equivalentes de exame respiratório:
   - "ausculta pulmonar", "auscultar pulmões", "auscultar campos", "murmúrio vesicular", "MV", "crepitações" = ausculta realizada
   - "palpação torácica", "palpou expansibilidade", "FTV", "frêmito" = palpação realizada
   - "percussão torácica", "percutir", "submacicez", "macicez" = percussão realizada
   - "sinais vitais", "PA", "FC", "FR", "SpO2", "saturação" = vitais avaliados

4. Classificação:
   - 0-11.9: Insuficiente
   - 12-15.9: Regular
   - 16-16.9: Bom
   - 17-20: Excelente

   NOTA MÁXIMA (20/20) É POSSÍVEL MESMO COM SOAP VAZIO:
   - Se SOAP não é obrigatório neste caso E o estudante cumprir todos os objetivos clínicos essenciais.
   - Objetivos clínicos essenciais incluem: comunicação adequada, anamnese dirigida, exame físico pertinente, exames complementares apropriados, diagnóstico principal correto, diferencial plausível, conduta clinicamente adequada.
   - Se todos esses foram cumpridos, não reduza para 19 apenas porque SOAP está vazio.
   - SOAP vazio não impede nota 20/20 em casos clínicos comuns.

   ERROS CITÁVEIS APENAS EM CASOS SOAP-OBRIGATÓRIO:
   - "Não preencheu SOAP" (apenas se SOAP é obrigatório)
   - "SOAP incompleto" (apenas se SOAP é obrigatório)

   ERROS CITÁVEIS EM QUALQUER CASO (SOAP ou não):
   - "Não orientou sinais de alarme"
   - "Não pesquisou contatos epidemiológicos quando relevante"
   - "Não indicou retorno ou reavaliação"
   - "Não prescrição de medicação quando indicada"

5. Análise esperada por seção:

   RESUMO DO CASO: Descreva brevemente o quadro clínico esperado com achados-chave.

   ANAMNESE: Analise perguntas feitas vs esperadas. Citar perguntas específicas realizadas e esquecidas.

   EXAME FÍSICO: Listar manobras realmente feitas e achados encontrados. Diferenciar de "solicitou exame físico".

   SINAIS VITAIS: Se solicitados, interpretar. Se não, mencionar a omissão.

   RACIOCÍNIO DIAGNÓSTICO: Comparar hipótese do estudante com diagnóstico esperado. Explicar por quê.

   EXAMES COMPLEMENTARES: Listar adequados/faltantes/desnecessários.

   CONDUTA: Detalhar o que foi adequado, incompleto ou errado.

   SOAP: Corrigir cada campo (apenas se SOAP obrigatório).
   Se SOAP não obrigatório, não é necessário comentar sobre SOAP vazio.

   ERROS CRÍTICOS: Listar erros que tirariam muitos pontos.
   Erros críticos são aqueles que comprometem a segurança ou competência clínica real.
   SOAP vazio NÃO é erro crítico em casos clínicos comuns.

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
  "objetivosCumpridos": {
    "comunicacao": ["cumprimento ao paciente", "apresentação profissional", "..."],
    "anamnese": ["perguntou sobre duração dos sintomas", "investigou febre", "..."],
    "exameFisico": ["avaliou sinais vitais", "realizou ausculta pulmonar", "palpou expansibilidade", "..."],
    "examesComplementares": ["solicitou radiografia de tórax", "solicitou hemograma", "..."],
    "raciocinioDiagnostico": ["hipótese de pneumonia", "considerou diagnósticos diferenciais", "..."],
    "conduta": ["antibioticoterapia", "oxigenoterapia", "suporte hidroeletrolítico", "..."]
  },
  "rubricaAvaliacao": [
    {
      "nome": "Comunicação e postura médica",
      "pontosObtidos": <0-2>,
      "pontosMaximos": 2,
      "acertos": ["..."],
      "melhorias": ["..."]
    },
    {
      "nome": "Anamnese dirigida",
      "pontosObtidos": <0-4>,
      "pontosMaximos": 4,
      "acertos": ["..."],
      "melhorias": ["..."]
    },
    {
      "nome": "Exame físico",
      "pontosObtidos": <0-4>,
      "pontosMaximos": 4,
      "acertos": ["..."],
      "melhorias": ["..."]
    },
    {
      "nome": "Exames complementares",
      "pontosObtidos": <0-2>,
      "pontosMaximos": 2,
      "acertos": ["..."],
      "melhorias": ["..."]
    },
    {
      "nome": "Raciocínio diagnóstico",
      "pontosObtidos": <0-5>,
      "pontosMaximos": 5,
      "acertos": ["..."],
      "melhorias": ["..."]
    },
    {
      "nome": "Conduta",
      "pontosObtidos": <0-3>,
      "pontosMaximos": 3,
      "acertos": ["..."],
      "melhorias": ["..."]
    }
  ],
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

RESPEITE RIGOROSAMENTE O FORMATO JSON. Retorne apenas o JSON válido, sem markdown.

INSTRUÇÕES FINAIS OBRIGATÓRIAS:

1. RESPONDA EXCLUSIVAMENTE EM JSON VÁLIDO.
2. NÃO USE MARKDOWN (sem \`\`\`json, sem \`\`\`, sem triple backticks).
3. NÃO ESCREVA NENHUM TEXTO ANTES DO JSON.
4. NÃO ESCREVA NENHUM TEXTO DEPOIS DO JSON.
5. O JSON DEVE INICIAR COM { NA PRIMEIRA LINHA.
6. O JSON DEVE TERMINAR COM } NA ÚLTIMA LINHA.
7. TODOS OS CAMPOS OBRIGATÓRIOS DEVEM EXISTIR (não omita "rubricaAvaliacao", "anamnese", "exameFisico", etc).
8. TODOS OS ARRAYS DEVEM EXISTIR (mesmo que vazios []).
9. "rubricaAvaliacao" DEVE TER EXATAMENTE 6 ITENS (uma para cada competência).
10. CADA ITEM DE RUBRICA DEVE TER: "nome", "pontosObtidos", "pontosMaximos", "acertos", "melhorias".
11. "nota" DEVE SER A SOMA EXATA DE "pontosObtidos" EM TODOS OS ITENS DA RUBRICA (máximo 20).
12. "percentual" DEVE SER (nota / 20) * 100.
13. RESPONDA APENAS COM JSON VÁLIDO, NADA MAIS.`;
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
