# Relatório — LessonStep Engine + LessonFlow: execução granular do ProfessorLesson (Fase 19)

_Data: 2026-07-03 · Camada **estrutural e aditiva**. NÃO chama IA, NÃO cria endpoint/chat/UI nova/login/banco. NÃO altera nota, HealthBench, OSCE, Centro Clínico, rotas ou layout. Apenas cria o motor granular para execução futura do Professor IA._

## Objetivo
Transformar o `ProfessorLesson` (roteiro completo) numa sequência **executável passo a passo**, para que o futuro Chat/voz não interprete a aula inteira de uma vez.

### Arquitetura em 3 camadas (ajuste solicitado)
```
ProfessorLesson   = roteiro pedagógico completo
       ↓ buildLessonFlowFromProfessorLesson
LessonFlow        = ordem, regras de navegação, checkpoints e ramificações (branches)
       ↓ (steps)
LessonStep        = unidade executável individual
```
- **ProfessorLesson**: o *quê* ensinar (conteúdo).
- **LessonFlow**: o *como navegar* (ordem, checkpoints, branches, pausar/retomar).
- **LessonStep**: a *unidade atômica* executável (1 instrução para o LLM + 1 texto para o Preview).

## Arquivos criados
- `lib/professor-ia/lesson-step-engine.ts` — tipos de LessonStep **e** LessonFlow + `buildLessonStepsFromProfessorLesson` + `buildLessonFlowFromProfessorLesson`.
- `docs/RELATORIO-LESSON-STEP-ENGINE-FASE19.md` — este relatório.

## Arquivos alterados
- `lib/professor-ia/professor-lesson.ts` — `lessonSteps?: LessonStepExecutionPlan` e `lessonFlow?: LessonFlow` (opcionais); preenchidos no `buildProfessorLesson`.
- `lib/professor-ia/dry-run.ts` — `professorLesson` do resultado já carrega `lessonSteps`/`lessonFlow`.
- `scripts/professor-ia-dry-run.mjs` — monta/imprime o LessonFlow inline.
- `lib/professor-ia/index.ts` — exporta o motor + tipos (alias `LessonStep as PlannerLessonStep` para o tipo homônimo antigo do lesson-planner).
- `lib/professor-ia/README.md` — seção da arquitetura de 3 camadas.
- `components/professor-ia/ProfessorIAPreview.tsx` — **inalterado** (visual atual preservado; o `ProfessorLesson` agora contém `lessonFlow`/`lessonSteps`).

## Tipos criados
- **LessonStep:** `LessonStep` · `LessonStepType` (18 tipos: opening, acknowledge_strength, calibrate_goal, reinforce_confidence, identify_error, correct_critical_error, ask_question, wait_student_answer, explain_concept, show_resource, show_sound, show_image, show_exam, compare_model_answer, mini_quiz, summarize, assign_next_step, closing) · `LessonStepStatus` · `LessonStepInstruction` · `LessonStepResource` · `LessonStepExpectedStudentAction` · `LessonStepTransition` · `LessonStepFeedbackRule` · `LessonStepExecutionPlan`.
- **LessonFlow:** `LessonFlow` · `LessonFlowRule` · `LessonFlowBranch` · `LessonFlowBranchCondition` · `LessonFlowCheckpoint`.

Cada **LessonStep** contém: `id`, `order`, `type`, `title`, `goal`, `instructionForLLM`, `staticPreviewText`, `expectedStudentAction`, `expectedAnswer?`, `resources`, `safetyRules`, `nextStepId`, `fallbackIfNoAnswer`, `stopCondition`, `isOptional`, `isCheckpoint`, `status`.

O **LessonFlow** contém: `flowId`, `lessonId`, `steps`, `currentStepId?`, `firstStepId`, `finalStepId`, `checkpoints`, `navigationRules`, `branches`, `canResume`, `canPause`, `canSkipOptionalSteps`, `requiresSequentialExecution` + agregados (`totalSteps`, `interactiveSteps`, `resourceSteps`).

## Como o ProfessorLesson vira LessonSteps
- Abertura (`opening`) usando a *opening line* estática → cada `action` mapeada para um `LessonStepType` (tabela da Tarefa 4) → encerramento (`closing`).
- Regras: `wait_student_answer`/`mini_quiz` exigem input (`autoAdvance=false`, `isCheckpoint`, `fallbackIfNoAnswer`); `correct_critical_error` anexa `safetyRules` e `stopCondition`; `show_*` anexam **apenas** o recurso real do ProfessorLesson (nunca inventado); todo step tem `instructionForLLM` (LLM) e `staticPreviewText` (Preview).

## Como o LessonFlow é montado
Envolve os steps com: **checkpoints** (steps que param), **navigationRules** (sequencial, parar em resposta, não pular checkpoint, fallback sem resposta, só recursos anexados) e **branches** estruturais por step interativo — `on_correct` → próximo, `on_incorrect` → reforço/explicação, `on_no_answer` → fallback (repete o step), `on_request_explanation` → aprofundamento. **Sem branching dinâmico real** — apenas estrutura preparada.

## Exemplo com PAC (dry run — caminho examinador, verificado)
- **Total de steps:** 18 · **interativos:** 2 (`wait_student_answer`, `mini_quiz`) · **c/recurso:** 0–2 (conforme cenário) · **checkpoints:** 3 · **branches:** 8 (2 steps interativos × 4 condições).
- **Navegação:** `requiresSequentialExecution=true`, `canPause/canResume/canSkipOptionalSteps=true`.
- **Primeiro step:** `step-1 → opening`. **Step que exige resposta:** `step-10 (wait_student_answer)` com fallback "Dar dica e reformular; não entregar a resposta". **Último step:** `closing`.
- **Sequência:** opening → calibrate_goal → acknowledge_strength → explain_concept → reinforce_confidence → … → correct_critical_error → ask_question → **wait_student_answer** → explain_concept → show_exam → show_sound → **mini_quiz** → summarize → compare_model_answer → assign_next_step → closing.
- No caminho do **Preview** (persona mentor/pós-reprovação, sem Q&A forçado) o mesmo motor gera 15 steps com 0 interativos — comportamento correto e faithful ao pipeline.

## Fallback sem resposta / sem gabarito
- **Sem resposta do aluno:** o step interativo tem `fallbackIfNoAnswer` e o flow tem branch `on_no_answer` apontando para o próprio step (repetir com dica).
- **Sem Gold Standard:** `ProfessorLesson.status = "sem_gabarito"` → `lessonSteps`/`lessonFlow` ficam `undefined` (não quebra o Feedback).

## Como o futuro Chat/voz usará
O Chat/voz deve consumir o **LessonFlow** (não uma lista linear): começa em `firstStepId`, executa `instructionForLLM` de cada step, **para** nos steps com `requiresInput`, aplica os **branches** conforme a resposta (acertou/errou/não respondeu/pediu explicação), respeita `checkpoints` e `navigationRules`, e pode **pausar/retomar** (`canPause`/`canResume`). Voz/aula guiada usam o mesmo `staticPreviewText`/`instructionForLLM` por passo.

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`. (Resolvido o choque de nome `LessonStep` via alias `PlannerLessonStep` no barrel.)
- ✅ **Execução real** (type-stripping, descartada): PAC → `lessonSteps` + `lessonFlow` gerados; caso sem gabarito → ambos `undefined`; `ProfessorLesson` antigo compatível (campos novos opcionais).
- ✅ **dry-run executado** imprime total/interativos/recursos/checkpoints/branches, primeiro step, step que exige resposta e último step.
- ✅ Feedback preservado; sem IA/endpoint/chat/login/banco; OSCE/HealthBench/Centro Clínico/rotas intocados.

## Limitações
- **Branching estrutural** apenas — nenhuma decisão dinâmica é executada nesta fase.
- Textos/instruções são estáticos/derivados; nada gerado por IA.
- Só o **PAC** tem gabarito; demais casos → sem steps/flow.
- `next build` completo não executado (erros TS **pré-existentes** do `ecgGenerator`); validação por `tsc` + execução do motor.

## Próximos passos
1. (Fase futura) **runtime de execução** do LessonFlow no Chat/voz: cursor de step, avaliação da resposta, aplicação real dos branches.
2. Persistência de progresso (`currentStepId`, `status` por step) — quando houver login/banco.
3. Gabaritos dos demais casos → LessonFlow além do PAC.
4. Métricas por step (tempo, acerto) alimentando o Student Model.
