# Relatório — Lesson Planner + Teaching Actions (Fase 11)

_Data: 2026-07-03 · Camada **estrutural e aditiva**. Sem IA, endpoint, chat ou UI. Nenhum arquivo de runtime, tela, rota, OSCE, Feedback, HealthBench ou Centro Clínico foi tocado. **Não** implementa o Professor IA real — apenas a camada de planejamento da aula e das ações pedagógicas._

## Objetivo
Inserir, entre o **Persona Engine** e o **Conversation Builder**, uma camada que:
- decide a **ORDEM** da sessão pedagógica (o que vem antes/depois);
- transforma a estratégia (teaching + persona + limites de sessão) em **passos executáveis** (Teaching Actions).

Novo pipeline:
```
HealthBench → Teaching Engine → Persona Engine → Lesson Planner → Teaching Actions → Conversation Builder
```

## Arquivos criados
- `lib/professor-ia/lesson-planner.ts` — tipos + `buildLessonPlan(input)`.
- `docs/RELATORIO-LESSON-PLANNER-FASE11.md` — este relatório.

## Arquivos alterados
- `lib/professor-ia/conversation-builder.ts` — `montarConducaoPrompt` e `buildConversationModel` aceitam `lessonPlan`; o prompt de condução passa a listar a **sequência de Teaching Actions** + regras.
- `lib/professor-ia/dry-run.ts` — computa o `lessonPlan`, passa ao Conversation Builder e o inclui em `ProfessorIADryRunResult`.
- `scripts/professor-ia-dry-run.mjs` — cálculo inline do plano de aula + impressão (nº de actions, ordem, recursos, checkpoints, objetivo final, duração).
- `lib/professor-ia/index.ts` — exporta `buildLessonPlan` + tipos.
- `lib/professor-ia/README.md` — pipeline atualizado (Fases 9–11) + regras do planner.
- `docs/professor-ia-dry-run-pac.json` — regenerado com o `lessonPlan`.

## Tipos criados
- `TeachingActionType` — união dos **14** tipos de ação.
- `TeachingAction` — `{ tipo, descricao, pergunta?, recursoRef?, recursoTitulo?, checkpoint? }`.
- `LessonPhase` — `abertura · correcao_critica · desenvolvimento · pratica · fechamento`.
- `LessonStep` — `{ ordem, fase, action }`.
- `LessonPlan` — `{ titulo, objetivoFinal, steps, duracaoEstimadaMin, conceitosIncluidos, perguntasIncluidas, recursosUsados, checkpoints }`.
- `LessonPlannerInput` — `{ context, teaching, persona, studyPlan, knowledge, caso }`.
- `LessonPlannerOutput` — `lessonPlan` + `actions` + resumos (duração, conceitos, perguntas, recursos, checkpoints, objetivo final).

### Os 14 Teaching Actions
`acknowledge_strength` · `identify_error` · `ask_socratic_question` · `wait_for_student_answer` · `explain_concept` · `show_related_resource` · `show_sound_reference` · `show_image_reference` · `show_exam_reference` · `compare_with_model_answer` · `correct_critical_error` · `mini_quiz` · `summarize_session` · `assign_next_step`.

## Regras aplicadas (verbatim)
1. **Sempre** começar reconhecendo ≥1 acerto **real** (das competências com `score01 ≥ 0.8`).
2. Se houver **erro crítico**, `correct_critical_error` vem **antes** de qualquer desenvolvimento.
3. **Respeita `maxQuestions`** — contador `addQuestion` para em `sessionConfig.maxQuestions`.
4. **Respeita `maxConcepts`** — contador `addConcept` para em `sessionConfig.maxConcepts`.
5. **Respeita `stopAfterCriticalCorrection`** — se ligado e há erro crítico, o bloco de desenvolvimento é **pulado**.
6. Se `requireStudentAnswerBeforeExplanation` → insere `ask_socratic_question` + `wait_for_student_answer` **antes** de `explain_concept`.
7. `show_*_reference` só quando o recurso **existe** no `KnowledgeMap` do contexto (exames/sons/imagens); dedup por href/título.
8. `mini_quiz` se `generateMiniQuiz`; `summarize_session` se `reviewAtEnd`; `assign_next_step` **sempre** no fim.
9. Nunca ensina mais de **3 prioridades**; **nunca cria recurso** que não exista no contexto.

## Exemplo PAC (dry run · HealthBench MOCK 11.8/20 · erro crítico: antibiótico sem dose)
Persona: **Examinador rigoroso** · sessão: 8 min · máx. 4 perguntas · máx. 2 conceitos · exigir resposta antes de explicar **sim** · parar após correção crítica **sim** · mini-quiz **sim** · revisão **sim**.

**Sequência gerada (10 actions):**
```
1. acknowledge_strength     → "Mediu sinais vitais completos, incluindo SpO₂"
2. correct_critical_error   ⏸ → antibiótico sem dose (risco à segurança)
3. ask_socratic_question    → "Qual antibiótico e por quê? Qual a dose?"
4. wait_for_student_answer  ⏸
5. explain_concept          → dose/segurança do antibiótico
6. show_exam_reference      → RX de tórax · Hemograma
7. show_sound_reference     → Crepitações
8. mini_quiz                ⏸
9. summarize_session
10. assign_next_step        → próxima prioridade de treino
```
- **Desenvolvimento pulado** (stopAfterCriticalCorrection + erro crítico) → sem `compare_with_model_answer`/`identify_error` nesta sessão.
- **Recursos usados:** RX de tórax · Hemograma; Crepitações (só recursos do contexto).
- **Checkpoints (3):** correção crítica · espera de resposta · mini-quiz.
- **Objetivo final:** _"Corrigir com segurança: antibiótico sem dose e consolidar a conduta correta."_
- **Duração estimada:** 8 min.

## Conversation Builder — o que o prompt de condução passou a orientar
- Seguir a **sequência das Teaching Actions**; **não pular etapas**.
- Em `wait_for_student_answer`, **não antecipar a explicação** — esperar a resposta do aluno.
- Usar **apenas os recursos listados** no plano; não inventar recursos.
- **Encerrar ao final** do plano; não virar aula infinita.
- Ordem dos prompts: `system → seguranca → naoInventar → apenasBase → professor → conducao → caso → contexto` (o `conducao` agora embute o plano).

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) no `professor-ia` — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Dry run executa** (`node scripts/professor-ia-dry-run.mjs`) e imprime actions/ordem/recursos/checkpoints/objetivo/duração; JSON regenerado.
- ✅ Sequência PAC idêntica à especificada.
- ✅ Nenhuma IA/endpoint/UI/chat; OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**.

## Limitações
- Planejamento **determinístico** (regras) — decide a ordem e os passos; o ensino em si é do LLM futuro.
- No `.mjs`, o `KnowledgeMap` é aproximado pelos recursos do Centro Clínico inline (o `dry-run.ts` usa o mapa real como prova type-checked).
- HealthBench ainda é **MOCK** no dry run.

## Próximos passos
1. Trocar o mock pelo HealthBench real.
2. (Fase futura) orquestrador/endpoint envia os prompts guiados por persona + plano de aula a um modelo.
3. UI/aba/chat do Professor — fase futura.
