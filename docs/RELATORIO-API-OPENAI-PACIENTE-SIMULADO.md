# Relatório Técnico — API OpenAI do Paciente Simulado

**Data:** 28 de junho de 2026
**Natureza:** Análise técnica (read-only). **Nenhum arquivo funcional foi alterado.**
**Escopo:** Integração OpenAI ↔ paciente simulado (chat da anamnese).

---

## 1. Resumo executivo

- O paciente simulado é atendido por **uma rota server-side**: `app/api/chat-paciente/route.ts` (handler `POST`).
- O cliente OpenAI vive em `lib/openai.ts` e é **`null` quando não há `OPENAI_API_KEY`** → nesse caso há **fallback** para respostas mock (`lib/mockPaciente.ts`).
- Modelo: **`gpt-4o-mini`**, via **Chat Completions** (`openai.chat.completions.create`), **sem streaming**, `temperature: 0.7`, `max_tokens: 500`.
- O prompt é montado em `lib/prompts.ts` → `criarPromptPaciente(caso, historico, novaMensagem)` e enviado como **uma única mensagem `role:"user"`** (não usa `system`/`assistant` separados).
- **O prompt já contém regras de revelação progressiva** ("responda apenas o que foi perguntado", "não liste sintomas"). Ou seja, o problema de "entregar cedo demais" **não** vem de ausência de regra, mas de fatores estruturais (ver §11): caso quase inteiro no prompt, **todas as respostas pré-preparadas expostas**, instruções como `user` (não `system`), `temperature 0.7` e `gpt-4o-mini` cooperativo.
- O **diagnóstico principal e os diferenciais são enviados** ao paciente (com instrução "NÃO REVELE"). Não há mistura com prompts de avaliador/examinador (esses são funções separadas em `lib/prompts.ts`).

---

## 2. Arquivos analisados

| Arquivo | Papel |
|---|---|
| `app/api/chat-paciente/route.ts` | Rota POST do paciente; chama OpenAI + fallback mock |
| `lib/openai.ts` | Instancia o cliente OpenAI (ou `null` sem chave) |
| `lib/prompts.ts` → `criarPromptPaciente` (linhas 3–242) | Monta o prompt do paciente |
| `lib/mockPaciente.ts` → `obterRespostaPaciente` | Fallback determinístico sem IA |
| `components/ChatPaciente.tsx` | UI do chat; captura mensagem, envia histórico, exibe resposta |
| `app/caso/[id]/page.tsx` | Mantém `mensagens` (via `onMensagensChange`); envia ao finalizar |
| `lib/types.ts` | Tipos `Caso` (`respostas_do_paciente`, `dados_ocultos_do_sistema`) |
| `lib/healthbench/transcript-normalizer.ts` | Converte chat em transcript para o grader |
| `lib/healthbench/rubricas-diagnosticos/*` | Rubricas leem a transcrição (anamnese/correlação) |
| `lib/pdf/exportar-feedback-atendimento.ts` | PDF exporta a transcrição do chat |

> Outros prompts de IA existem mas **não** participam do chat do paciente: `criarPromptAvaliador`, `criarPromptExaminador`, `criarPromptExameFisico`, `criarPromptAgentExames` (lib/prompts.ts), `lib/healthbench/grader.ts`/`evaluator.ts` e as rotas de radiologia. São papéis separados.

---

## 3. Fluxo atual da mensagem

1. **Aluno digita** no `ChatPaciente.tsx` e envia.
2. Componente cria `MensagemChat` do estudante e atualiza estado local `mensagens`.
3. Monta `historico = mensagensAtualizadas.map(...)` (inclui a mensagem recém-digitada) e faz **`fetch("/api/chat-paciente", POST)`** com `{ casoId, mensagem, historico }`.
4. A rota (`route.ts:POST`) recebe `casoId`, `mensagem`, `historico`.
5. Busca o caso: `casosOSCE.find(c => c.id === casoId)` (de `data/casos-osce.ts`).
6. Monta o prompt: `criarPromptPaciente(caso, historico, mensagem)`.
7. **Histórico é incluído** — formatado como texto dentro do prompt (não como mensagens estruturadas).
8. Chama `obterRespostaOpenAI(prompt)` → `openai.chat.completions.create(...)`.
9. Resposta volta como `{ resposta }` (JSON).
10. `ChatPaciente` cria `MensagemChat` do paciente e exibe no chat.
11. `page.tsx` recebe `mensagens` via `onMensagensChange` → guarda no estado `mensagens`. **Não há log/transcrição persistido durante o chat**; a conversa só é consolidada ao finalizar.
12. Ao finalizar, `page.tsx` envia `chatMessages: mensagens` para `/api/osce/finalizar` → `transcript-normalizer` → grader HealthBench; e monta `anamneseTexto`/`correlacaoTexto` para as **rubricas** e a transcrição para o **PDF**.

---

## 4. Payload enviado à OpenAI

A chamada (`route.ts:24-34`) envia **uma única mensagem**:

```
messages: [
  { role: "user", content: <PROMPT COMPLETO criarPromptPaciente(...)> }
]
model: "gpt-4o-mini"
temperature: 0.7
max_tokens: 500
```

Observações:
- **Não há `role:"system"`** nem separação `assistant`/`user` por turno. Toda a instrução de persona + dados do caso + histórico + nova pergunta vão concatenados num único `content` `user`.
- **Uma "mensagem de sistema" conceitual** existe (as instruções), mas tecnicamente está no papel `user`.
- **Há prompt de paciente**; **não há** prompt de professor/examinador misturado.
- **O caso é enviado quase inteiro** (ver §6).
- **Diagnóstico esperado e diferenciais são enviados** (rotulados "NÃO REVELE").
- **Histórico completo é enviado** (sem limite/resumo), embutido como texto.

---

## 5. Prompt atual do paciente

Fonte: `lib/prompts.ts` → `criarPromptPaciente`. Estrutura (trechos representativos):

**Persona e regra de não-iniciar:**
```
Você é um paciente virtual (ou responsável de criança) em uma estação OSCE de 3º semestre...
NUNCA inicie a conversa espontaneamente revelando sintomas ou queixa.
AGUARDE a pergunta do médico antes de responder.
```

**Dados confidenciais do paciente:** nome, idade, sexo, queixa principal, histórico da doença, antecedentes, medicamentos, alergias (+ bloco pediátrico do responsável).

**Diagnóstico (enviado, com proibição de revelar):**
```
DIAGNÓSTICO (NÃO REVELE):
- Principal: <diagnostico_principal>
- Diferenciais: <diagnosticos_diferenciais...>
```

**Respostas pré-preparadas (todas listadas):**
```
RESPOSTAS PRÉ-PREPARADAS (use como referência...):
- <chave>: <valor>   (para TODAS as entradas de caso.respostas_do_paciente)
```

**Regras de comportamento (revelação progressiva):**
```
🎯 RESPOSTAS SUBSEQUENTES:
- Responda APENAS o que foi perguntado
- Se pergunta é aberta ("me conte mais"), forneça 1-2 informações, não tudo
- Evite listas: não diga "febre, tosse, dor de cabeça, fraqueza"
- NÃO mencione informações não perguntadas (medicações/antecedentes/alergias/exame/sinais vitais)
- Se perguntado sobre medir algo (PA, FC), diga: "você precisa medir"
REGRA CRÍTICA GERAL: Não revele diagnóstico. Pareça uma pessoa conversando, não uma base de dados.
```

**Controles presentes:** persona de paciente leigo; tom natural com conectivos; regra de não antecipar; regra de responder só ao perguntado; controle de emoção mínimo (acolhimento); **controle de tamanho apenas textual** ("1-2 frases"/"breve") + `max_tokens: 500`. Há ramos distintos por **faixa etária pediátrica** e por **resposta inicial vs subsequente**.

**Avaliação:** o prompt **favorece** respostas contidas (texto é explícito sobre isso). O risco de prolixidade vem de fatores **fora** do texto da regra (§11).

---

## 6. Dados do caso enviados à IA

| Dado | Enviado ao paciente? | Observação |
|---|---|---|
| Nome/idade/sexo | ✅ | Confidencial, uso interno |
| Queixa principal | ✅ | |
| Histórico da doença | ✅ | Texto completo |
| Antecedentes / medicamentos / alergias | ✅ | |
| Bloco pediátrico (responsável, vacinas, etc.) | ✅ (se pediátrico) | |
| **Diagnóstico principal** | ✅ | Rotulado "NÃO REVELE" |
| **Diagnósticos diferenciais** | ✅ | Rotulado "NÃO REVELE" |
| **`respostas_do_paciente` (todas)** | ✅ | **Todas** as respostas pré-preparadas no prompt |
| Achados de exame físico | ❌ (não nesta rota) | Exame físico tem rota própria (`/api/exame-fisico`) |
| Exames complementares / conduta esperada | ❌ | Rotas próprias |
| Rubrica de avaliação | ❌ | Fica no HealthBench/grader |

**Risco de vazamento:** o diagnóstico e **todas** as respostas pré-preparadas estão no contexto. O modelo é instruído a não revelar o diagnóstico, mas tem **todo o roteiro disponível**, o que facilita antecipar sintomas/detalhes antes da pergunta correspondente.

---

## 7. Histórico, memória e logs

- **Histórico completo** é reenviado a cada mensagem (o `ChatPaciente` envia `mensagensAtualizadas` inteiro; o prompt o formata como texto). **Sem limite, sem resumo, sem janela.**
- O "lembrar" é por reenvio do histórico (stateless no servidor) — o paciente "lembra" porque o texto anterior está no prompt.
- **Risco de repetição:** não há `frequency_penalty`/`presence_penalty`; conversas longas podem gerar repetições ("Ok, doutor"). Não há instrução explícita contra repetir saudações.
- **Persistência:** durante o chat não há gravação em disco/log; a conversa vive no estado React (`mensagens`) e só é enviada ao backend **no fim** (`/api/osce/finalizar`).

---

## 8. Modelo e parâmetros

| Parâmetro | Valor | Comentário |
|---|---|---|
| `model` | `gpt-4o-mini` | Modelo pequeno, tende a ser cooperativo/literal |
| `temperature` | `0.7` | Moderada-alta; favorece variação e algum excesso |
| `max_tokens` | `500` | **Permite respostas longas** (≈350–400 palavras) |
| `top_p` | (não definido) | default |
| `frequency_penalty` | (não definido) | sem controle de repetição |
| `presence_penalty` | (não definido) | sem controle de repetição |
| `response_format` | (não definido) | texto livre |
| `stream` | `false` | resposta completa |

Avaliação: a combinação **`max_tokens:500` + `temperature:0.7` + instrução só textual de brevidade** permite respostas mais longas do que o ideal para revelação progressiva. Não há teto curto de tokens que force concisão.

---

## 9. Separação de papéis

- A rota do paciente usa **somente** `criarPromptPaciente`. **Não** injeta `criarPromptAvaliador`/`criarPromptExaminador`/rubrica/gabarito de correção.
- **Porém** o paciente **recebe o diagnóstico** (principal + diferenciais) e **todas as respostas pré-preparadas**. Isso não o transforma em "professor", mas dá a ele conhecimento privilegiado que, sob `temperature 0.7`, pode "ajudar demais".
- Risco de o paciente responder como professor: **baixo** (não há instrução de avaliar). Risco de **ajudar demais / antecipar**: **moderado**, por ter o roteiro completo.

---

## 10. Relação com feedback e PDF

- **Falas do paciente e perguntas do aluno** ficam no estado `mensagens` (`page.tsx`).
- Ao finalizar: `chatMessages: mensagens` → `/api/osce/finalizar` → `transcript-normalizer` (vira transcript) → **grader HealthBench**; e `page.tsx` deriva `anamneseTexto`/`correlacaoTexto` (transcrição completa **aluno + paciente**) para as **rubricas por diagnóstico**.
- **PDF** (`exportar-feedback-atendimento.ts`) exporta a transcrição completa do chat.
- **Ponto crítico:** as rubricas de anamnese avaliam a **transcrição completa** (inclui falas do paciente). Se o paciente **entrega um sintoma sem ter sido perguntado**, o detector textual (ex.: "tosse/escarro") dispara mesmo sem mérito do aluno → **pode inflar a anamnese**. O feedback lê a conversa diretamente (não um resumo).

---

## 11. Diagnóstico dos problemas observados

**Por que o paciente pode entregar informações cedo demais** (causas, em ordem de probabilidade):

1. **Todas as `respostas_do_paciente` no prompt** — o modelo vê o roteiro inteiro e tende a "puxar" respostas além da pergunta. (causa provável principal)
2. **Caso quase inteiro exposto** (histórico, antecedentes, medicações, alergias) sem separação entre "revelável sob pergunta" e "interno".
3. **Instruções como `role:"user"`, não `role:"system"`** — regras de comportamento têm menos peso do que teriam como system.
4. **`max_tokens: 500`** sem teto curto — não força concisão; brevidade é só sugerida em texto.
5. **`temperature: 0.7`** — favorece elaboração/cooperação.
6. **Sem `presence/frequency_penalty`** — repetições e prolixidade não penalizadas.
7. **Diagnóstico + diferenciais no contexto** — conhecimento privilegiado que facilita antecipar.
8. **Histórico sem janela/resumo** — em conversas longas o padrão pode degradar.

> Observação importante: **não** é o caso de "falta de regra de revelação progressiva" — essa regra existe e é detalhada. O ganho virá de **reduzir/segmentar o que o paciente vê** e **fortalecer o canal de instrução** (system role + parâmetros), não de reescrever a regra.

---

## 12. Pontos exatos de intervenção futura (NÃO alterar agora)

| Arquivo | Função | Intervenção futura sugerida |
|---|---|---|
| `lib/prompts.ts` | `criarPromptPaciente` | Segmentar dados: públicos iniciais × reveláveis sob pergunta × internos (diagnóstico) nunca espontâneos; **não despejar todas as `respostas_do_paciente`** de uma vez |
| `app/api/chat-paciente/route.ts` | `obterRespostaOpenAI` | Usar `role:"system"` para as instruções e `role:"user"/"assistant"` para o histórico turno a turno; considerar `max_tokens` menor e `presence_penalty` leve |
| `app/api/chat-paciente/route.ts` | `POST` | Reduzir os dados do caso passados ao prompt (separar revelável de interno) |
| `lib/prompts.ts` | `criarPromptPaciente` | Reforçar regra anti-repetição e teto de tamanho por turno |
| `lib/healthbench/rubricas-diagnosticos/*` + `page.tsx` | montagem de `anamneseTexto` | (Opcional) Avaliar anamnese considerando **perguntas do aluno**, não só a transcrição total, para não inflar por fala espontânea do paciente |

---

## 13. Riscos de alteração

- **Quebrar o fluxo de chat** (rota é simples; mudanças no payload precisam manter `{ resposta }`).
- **Reduzir informação demais** → paciente deixa de responder quando perguntado corretamente → prejudica anamnese e o feedback.
- **Mudar `role` para system** pode alterar o "tom" das respostas (revalidar casos).
- **Impacto no feedback/rubricas:** menos sintomas espontâneos → notas de anamnese caem para atendimentos que dependiam da fala espontânea (efeito desejado, mas precisa recalibrar expectativas).
- **Impacto no PDF:** muda o conteúdo da transcrição exportada.
- **Casos antigos e pediatria:** o prompt tem ramos por faixa etária; qualquer mudança precisa preservar neonato/lactente/pré-escolar/escolar/adolescente.
- **Fallback mock** (`mockPaciente`) precisa continuar funcionando sem chave de API.

---

## 14. Recomendações técnicas

| Opção | Descrição | Dificuldade | Risco | Impacto esperado | Recomendação |
|---|---|---|---|---|---|
| **A** | Ajustar apenas o prompt global (reforçar concisão/anti-antecipação; mover instruções para `system`) | Baixa | Baixo | Médio | **Primeiro passo recomendado** |
| **B** | Regra textual de revelação progressiva por estágios (já parcialmente existe; formalizar) | Média | Médio | Médio-alto | Bom complemento da A |
| **C** | Segmentar dados do caso: públicos iniciais / reveláveis sob pergunta / internos nunca espontâneos | Média-alta | Médio | **Alto** (ataca a causa nº 1 e 2) | Recomendado após A |
| **D** | Classificador da pergunta do aluno para decidir o dado a revelar | Alta | Alto | Alto, porém complexo | Adiar; só se A+C forem insuficientes |

**Sequência mais segura:** **A → C** (prompt + segmentação de dados), validando casos adulto e pediátrico a cada etapa. Evitar D inicialmente (complexidade/risco).

---

## 15. Conclusão

A IA do paciente é chamada por `POST /api/chat-paciente` (server-side, disparada pelo `ChatPaciente`), usando **`gpt-4o-mini` via Chat Completions**, com **um único `role:"user"`** contendo o prompt de `criarPromptPaciente` (`lib/prompts.ts`). **O caso é enviado quase inteiro**, incluindo **diagnóstico** e **todas as respostas pré-preparadas**, com regra de revelação progressiva já presente. O paciente pode entregar dados cedo demais principalmente porque **vê o roteiro completo** e porque as **instruções estão no canal `user`** com `max_tokens:500`/`temperature:0.7`. A intervenção mais segura é **ajustar o prompt + mover instruções para `system` (Opção A)** e, em seguida, **segmentar os dados do caso (Opção C)** — sempre preservando fallback mock, pediatria e o fluxo de feedback/PDF.

> **Nenhum código foi alterado nesta tarefa.** Relatório apenas.
