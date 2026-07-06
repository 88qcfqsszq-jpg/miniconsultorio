# Professor IA — Infraestrutura (Fase 0: preparação)

> **Status:** módulo **preparado, ainda NÃO utilizado**. Não chama IA, não cria endpoint,
> não abre chat, não altera Feedback/HealthBench/OSCE/Centro Clínico/Casos.
> Tudo aqui é **puro** (tipos + funções de montagem + templates de prompt).

## Objetivo
Reunir, de forma desacoplada, tudo o que um futuro Professor IA precisará para
ensinar o aluno após (ou durante) um caso OSCE — **sem** acoplar-se ao sistema atual.
Quando o Professor IA for ligado, ele consumirá estes objetos; nada aqui altera o
comportamento existente.

## Módulos

| Arquivo | Papel | IA? |
|---|---|---|
| `types.ts` | Tipos atômicos, enums, uniões, pesos das competências | ❌ |
| `interfaces.ts` | Interfaces compostas: `ProfessorIAContext`, `KnowledgeMap`, `StudyPlan`, `ConversationModel`, entradas dos builders | ❌ |
| `context-builder.ts` | `buildProfessorContext(input)` → monta o contexto completo (puro) | ❌ |
| `knowledge-builder.ts` | `buildKnowledgeMap(...)` → relaciona conhecimento do Centro Clínico ao caso | ❌ |
| `study-plan-builder.ts` | `buildStudyPlan(...)` → plano P1/P2/P3 + recursos | ❌ |
| `conversation-builder.ts` | `buildConversationModel(ctx)` → os 7 prompts (strings) | ❌ |
| `teaching-engine.ts` | `buildTeachingStrategy(input)` → decisão pedagógica (prioridade, modo, objetivos, plano 3 passos) | ❌ |
| `persona-engine.ts` | `buildProfessorPersona(input)` → persona + `sessionConfig` (tom/exigência/ritmo + limites) | ❌ |
| `lesson-planner.ts` | `buildLessonPlan(input)` → ORDEM da sessão + **Teaching Actions** executáveis | ❌ |
| `dry-run.ts` | `buildProfessorIADryRun()` → pacote de contexto completo (prova type-checked) | ❌ |
| `student-model.ts` | `buildStudentModel(input)` + `summarizeStudentModel(sm)` → perfil LONGITUDINAL do aluno (Fase 15) | ❌ |
| `learning-session.ts` | `buildLearningSession(input)` + `summarizeLearningSession(s)` → estado ATUAL da sessão (Fase 16) | ❌ |
| `professor-lesson.ts` | `buildProfessorLesson(input)` → **roteiro único** (ProfessorLesson) do pipeline (Fase 18) | ❌ |
| `lesson-step-engine.ts` | `buildLessonFlowFromProfessorLesson` / `buildLessonStepsFromProfessorLesson` → **LessonFlow → LessonStep** (Fase 19) | ❌ |
| `orchestrator.ts` | `generateProfessorStepResponse` → transforma **1 LessonStep** em fala natural (Fase 20) + **guardrail** anti-elogio-falso (Fase 22). Modelo via `callModel`; sem chave → fallback | ⚠️ via `/api/professor-ia` |
| `student-trace.ts` | `buildStudentTrace` / `summarizeStudentTrace` / `validateTraceAgainstGoldStandard` / `validateProfessorMessageAgainstTrace` → **rastro REAL do aluno** (Fase 22) | ❌ |
| `preview-builder.ts` | `buildProfessorIAPreview(input)` → monta o pipeline e devolve um `ProfessorLesson` (ou fallback) para o Feedback (Fases 17–18) | ❌ |
| `index.ts` | Barrel de re-exports | ❌ |

## ProfessorLesson — roteiro único (Fase 18)
O `ProfessorLesson` é o **resultado final** do pipeline: um objeto estável que serve
ao mesmo tempo o **Preview** (hoje) e o **futuro Chat/voz/aula guiada/plano de estudo**.
```
Pipeline → buildProfessorLesson → ProfessorLesson → Preview (hoje)
Pipeline → buildProfessorLesson → ProfessorLesson → Chat (futuro)
```
Contém: header, diagnóstico da sessão (caso, nota, prioridade, erro crítico, persona,
modo, duração), objetivo final, **opening line estática**, Teaching Actions normalizadas
(com rótulo PT), recursos, perguntas socráticas, mini-quiz, respostas esperadas,
pegadinhas, regras de segurança, **prompt plan** (metadado do que o Chat enviaria) e
próximo passo. `status`: `ok` | `sem_gabarito` | `sem_plano` (fallback elegante).
O componente `ProfessorIAPreview` renderiza **apenas** o `ProfessorLesson` — não conhece
os detalhes de TeachingEngine/PersonaEngine/LessonPlanner/ConversationBuilder.

## Execução granular (Fase 19): ProfessorLesson → LessonFlow → LessonStep
Para o futuro Chat/voz executar **um passo por vez** (sem interpretar a aula inteira):
```
ProfessorLesson  = roteiro pedagógico completo
      ↓ buildLessonFlowFromProfessorLesson
LessonFlow       = ordem, regras de navegação, checkpoints e ramificações (branches)
      ↓ (steps)
LessonStep       = unidade executável individual (instrução p/ LLM + texto de preview)
```
- `ProfessorLesson.lessonSteps?` (LessonStepExecutionPlan — agregados) e `ProfessorLesson.lessonFlow?` (navegação) são **opcionais** e preenchidos automaticamente (retrocompat total).
- **LessonStep**: `instructionForLLM` (o que o LLM deve fazer), `staticPreviewText` (o que o Preview mostra), `expectedStudentAction.requiresInput`, `expectedAnswer`, `resources` (só do ProfessorLesson), `safetyRules`, `fallbackIfNoAnswer`, `stopCondition`, `isOptional`, `isCheckpoint`.
- **LessonFlow**: `firstStepId`/`finalStepId`/`currentStepId`, `navigationRules`, `checkpoints`, **`branches`** (`on_correct` → próximo; `on_incorrect` → reforço; `on_no_answer` → fallback; `on_request_explanation` → aprofundamento), `requiresSequentialExecution`, `canPause`/`canResume`/`canSkipOptionalSteps`. O futuro Chat/voz deve consumir o **LessonFlow** (não uma lista linear de steps): ele navega passo a passo, para nos checkpoints e usa os branches.

## Orquestrador generativo controlado (Fase 20)
```
ProfessorLesson → LessonFlow → LessonStep atual → Orquestrador → Modelo → Fala do professor
```
- `generateProfessorStepResponse(input, callModel?)` transforma **apenas o LessonStep atual** em fala natural. O modelo **não decide** o que ensinar/priorizar/qual recurso/próxima etapa — tudo vem do LessonFlow.
- O orquestrador é **puro** quanto a dependências (não importa a SDK). A rota **`POST /api/professor-ia`** injeta o `callModel` real (OpenAI via `lib/openai`) **só se houver `OPENAI_API_KEY`**; sem chave (ou em erro) → **fallback estático** (`staticPreviewText` do step). `try/catch` em tudo; nunca quebra o Feedback; não altera nota/HealthBench; não salva em banco.
- Prompt controlado: papel + fonte de verdade (Gold Standard vence) + escopo (só o step atual) + proibições (não inventar dx/exame/conduta, não pular etapa, não usar recurso fora da lista, não alterar nota) + saída curta em PT.
- O Preview tem um botão **experimental** ("Gerar fala do Professor para esta etapa") que chama a rota para o **primeiro** step — 1 fala, sem chat/streaming/memória.

## Regra de ouro (Fase 22): ELOGIO = StudentTrace
Para o Professor IA **nunca elogiar ação que o aluno não fez**:
- **ELOGIO = StudentTrace** (o que o aluno **fez** — eventos reais: perguntou, auscultou, pediu exame, escreveu diagnóstico/conduta…).
- **GABARITO = Gold Standard** (o que **deveria** ser feito — nunca vira elogio).
- **ERRO = HealthBench + TraceValidation** (o que faltou / foi inseguro).
- `context.studentTrace` / `studentTraceSummary` / `traceValidation` são construídos no context-builder a partir dos dados de atendimento. `acknowledge_strength` e a `openingLine` usam **só** `confirmedStrengths` (evidência real); sem evidência → **abertura neutra** ("Vamos revisar seu atendimento e corrigir o ponto mais importante com segurança.").
- `ProfessorLesson.studentBase` carrega `confirmedStrengths` (permitidos), `forbiddenPraise` (proibidos) e `missingRequiredItems`. O **guardrail** `validateProfessorMessageAgainstTrace` roda **após** a geração e substitui a fala por texto neutro se contiver elogio proibido. `forbiddenPraise` depende da **ausência do evento** (prescrever sem dose ainda é ter prescrito).

## Gold Standard, Truth Layers e Student Model (Fases 14–15)
O contexto pode carregar, **opcionalmente**, três fontes de verdade:
- **Gold Standard + Truth Layers** (Fase 14): `context.goldStandard` / `context.truthLayersResumo` — o que é o gabarito perfeito do caso e como usá-lo (Clinical/Educational/Evaluation/Teaching/Resource Truth).
- **Student Model** (Fase 15): `context.studentModel` / `context.studentSummary` — perfil longitudinal do aluno (forças, fraquezas, **erros recorrentes**, evolução, risco). Quando presente, personaliza:
  - **study-plan**: erros recorrentes/temas persistentes sobem de prioridade (erro repetido > erro isolado); revisão longitudinal.
  - **teaching-engine**: detecta repetição, ajusta o modo (recorrente+segurança → diretivo; erro novo → socrático; evolução → reforço positivo; queda → revisão guiada).
  - **persona-engine**: inseguro → mentor; avançado → examinador/revisão rápida; erro recorrente grave → examinador/emergência; evolução → mentor com reforço.
  - **lesson-planner**: 3 novas actions — `reinforce_progress`, `review_recurring_error`, `compare_with_previous_attempts`.
  - **conversation-builder**: prompt `aluno` (histórico + regras: usar só para personalizar, não expor dados sensíveis, **não humilhar** por erro recorrente).

- **Learning Session** (Fase 16): `context.learningSession` / `context.learningSessionSummary` — estado **atual** da sessão (modo, tempo, energia, emoção, **confiança/frustração**, restrições). Enquanto o Student Model diz "quem é o aluno ao longo do tempo", a Learning Session diz "como ele está agora". Quando presente, adapta:
  - **study-plan**: sessão curta reduz itens; pós-reprovação prioriza reconstrução de confiança; revisão rápida foca erros críticos/pegadinhas; primeiro contato usa explicação progressiva; treino pré-prova prioriza checklist/tempo; frustração alta reduz carga; confiança alta permite desafio.
  - **teaching-engine**: modo por sessão (pós-reprovação → reforço positivo; treino pré-prova → avaliador; primeiro contato → demonstrativo) e **reduz o máximo de prioridades** quando tempo/energia curtos.
  - **persona-engine**: frustração alta/pós-reprovação → mentor; tempo curto → revisão rápida; treino pré-prova → examinador; energia baixa → menos perguntas; calibra `sessionConfig` (tempo, mini-quiz, revisão).
  - **lesson-planner**: 6 novas actions — `calibrate_session_goal`, `reduce_cognitive_load`, `reinforce_confidence`, `timeboxed_review`, `challenge_student`, `close_session_early`.
  - **conversation-builder**: prompt `sessao` (objetivo/modo/tempo/estado + regras: adaptar linguagem, ser acolhedor se frustrado, não abrir aula longa se tempo curto, não reforçar o fracasso se pós-reprovação, ser direto se treino pré-prova).

Sem Gold Standard/Student Model/Learning Session, o pipeline funciona **exatamente como antes** (tudo opcional).

## Pipeline pedagógico (Fases 9–11)
```
HealthBench (nota + competências + erros)
      │
      ▼
buildProfessorContext ─▶ buildStudyPlan ─▶ buildTeachingStrategy ─▶ buildProfessorPersona ─▶ buildLessonPlan ─▶ buildConversationModel ─▶ [LLM futuro]
                                              (teaching-engine)         (persona-engine)        (lesson-planner)      (7–8 prompts,
                                              prioridade · modo ·       persona · tom ·          ORDEM da aula +       inclui "condução"
                                              objetivos · plano 3       exigência · ritmo ·      Teaching Actions      com a sequência
                                                                        sessionConfig (limites)  (14 tipos) +          de actions)
                                                                                                 checkpoints
```
- **teaching-engine** decide *o que* ensinar (prioridade, modo, plano 3 passos).
- **persona-engine** decide *como* o professor fala (tom/exigência/ritmo) e *controla a sessão*
  (duração, nº máx. de perguntas/conceitos, mini-quiz, revisão, parar após correção crítica).
- **lesson-planner** decide a **ORDEM** da sessão e transforma a estratégia em **Teaching Actions**
  executáveis (14 tipos: `acknowledge_strength`, `identify_error`, `ask_socratic_question`,
  `wait_for_student_answer`, `explain_concept`, `show_*_reference`, `compare_with_model_answer`,
  `correct_critical_error`, `mini_quiz`, `summarize_session`, `assign_next_step`), respeitando
  `maxQuestions`/`maxConcepts`/`stopAfterCriticalCorrection` e usando **apenas recursos do contexto**.
- **conversation-builder** injeta um prompt de **condução** que orienta o LLM a seguir a sequência
  das Teaching Actions (não pular etapas, esperar a resposta em `wait_for_student_answer`, não
  inventar recursos, encerrar ao final).
`barrel index.ts` reexporta tudo.

### Regras do Lesson Planner
1. **Sempre** abrir reconhecendo ≥1 acerto real do aluno.
2. Se houver **erro crítico**, corrigi-lo **antes** de qualquer aula longa.
3. Respeitar `maxQuestions`, `maxConcepts` e `stopAfterCriticalCorrection`.
4. Se `requireStudentAnswerBeforeExplanation` → inserir `ask_socratic_question` + `wait_for_student_answer` antes de `explain_concept`.
5. Inserir `show_*_reference` só quando o recurso **existe** no contexto (KnowledgeMap).
6. `mini_quiz` se `generateMiniQuiz`; `summarize_session` se `reviewAtEnd`; sempre `assign_next_step` no fim.
7. Nunca ensinar mais de **3 prioridades**; nunca criar recurso fora do contexto.

## Como funcionará (visão futura)

```
Atendimento (page.tsx já coleta)          HealthBench (já existe)      /api/estudo-final-caso (já existe)
        │                                        │                              │
        └──────────────► buildProfessorContext(input) ◄──────────────┬─────────┘
                                   │  (context-builder)              │
                                   ▼                                 │
                          ProfessorIAContext ──────────► buildKnowledgeMap (knowledge-builder)
                                   │                                 │
                                   ├──────────► buildStudyPlan (study-plan-builder) → StudyPlan
                                   │
                                   ▼
                          buildConversationModel (conversation-builder)
                                   │  → { system, contexto, caso, professor,
                                   │      seguranca, naoInventarMedicina, apenasBaseDoSistema }
                                   ▼
                    [FUTURO] orquestrador → modelo → resposta do Professor
                    (NÃO existe ainda — sem endpoint, sem chat, sem IA)
```

## Quais dados o Professor IA acessa (via `ProfessorIAContext`)
- **Caso**: título, diagnóstico correto, diferenciais esperados, objetivo pedagógico, tema clínico.
- **Paciente**: idade, sexo, tipo (adulto/pediátrico), queixa, dados visíveis.
- **Timeline do atendimento**: conversa (aluno/paciente), exame físico (ações + achados + locais clicados), **auscultas** (foco, som esperado, arquivo, resposta do aluno), **exames** solicitados, **ECG** visualizado, **imagens** abertas (termo/fonte/URL), sinais vitais, tempo.
- **Resposta do aluno**: hipótese, diferenciais, exames indicados, conduta, SOAP.
- **Avaliação HealthBench** (resumida): nota, `passed`, 6 competências (pontos + acertos + a melhorar), erros críticos, focos de treino.
- **Material didático** (`/api/estudo-final-caso`): resposta modelo, checklist nota máxima, erros críticos didáticos, mini-aula.
- **Conhecimento relacionado**: semiologia, fluxos, exames, imagens, sons, escores, guia — com `href` para as rotas reais do Centro Clínico.
- **Referências**: Open-i/NLM, HLS-CMDS, Centro Clínico.
- **Proveniência**: para cada bloco, a fonte (`caso`/`atendimento`/`healthbench`/`estudo_final`/`centro_clinico`) e se está presente.

## Prompts (conversation-builder)
`system` · `contexto` · `caso` · `professor` · `seguranca` · `naoInventarMedicina` · `apenasBaseDoSistema`.
`preverPromptCompleto(model)` concatena na ordem sugerida para inspeção. **Nada é enviado a um modelo.**

## O que ainda falta (próximas fases)
1. **Orquestrador** (server) que receba o `ConversationModel` e chame o modelo — **não existe** (por decisão desta fase).
2. **Endpoint** `/api/professor-ia` — não criado.
3. **UI/chat** do Professor — não criado.
4. **Casos Canônicos** como fonte formal (hoje o contexto usa o `Caso` atual + gabarito).
5. **Persistência de conversas** e memória do aluno.
6. Enriquecer o `KnowledgeMap` com âncoras profundas (IDs de seções/sons/imagens específicos).

## Como será conectado ao Feedback (futuramente)
Sem alterar o `FeedbackOSCE` atual: um botão/aba futura poderá, ao abrir o feedback,
chamar `buildProfessorContext({ caso, ...atendimento, healthBenchResult, estudoFinal })`
→ `buildStudyPlan` / `buildConversationModel`, e então um orquestrador conversaria com o aluno.
A nota, os cards e o HealthBench **permanecem intactos**: o Professor IA só **lê** esses dados.

## Garantia
Este módulo é **100% aditivo**. Nenhum arquivo fora de `lib/professor-ia/` foi tocado.
Remover a pasta não afeta nada no sistema.
