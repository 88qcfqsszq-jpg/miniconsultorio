# Relatório — Student Model / Perfil Longitudinal do Aluno (Fase 15)

_Data: 2026-07-03 · Camada **estrutural e aditiva**, limitada a `lib/professor-ia/`, `clinical-engine/` e `docs/`. Sem IA, endpoint, chat, UI, login ou banco. Não altera Feedback, HealthBench, OSCE, Centro Clínico, rotas ou layout._

## Objetivo
Criar o modelo estrutural do aluno para que, no futuro, o Professor IA ensine também com base no **histórico**, **erros recorrentes** e **evolução individual** — não só no caso.

Antes: `Caso + Gold Standard + Truth Layers → Professor IA`.
Agora (preparado): `Aluno + Histórico + Desempenho longitudinal + Caso + Gold Standard → Professor IA`.

**Retrocompatibilidade total:** sem `StudentModel`, o pipeline funciona exatamente como antes (tudo opcional).

## Arquivos criados
- `lib/professor-ia/student-model.ts` — tipos + `buildStudentModel(input)` + `summarizeStudentModel(sm)`.
- `docs/RELATORIO-STUDENT-MODEL-FASE15.md` — este relatório.

## Arquivos alterados
- `lib/professor-ia/interfaces.ts` — `studentModel?`/`studentSummary?` no `ProfessorIAContext`; `studentModel?` em `ProfessorContextInput`/`StudyPlanInput`; `ProfessorPrompts.aluno?`.
- `lib/professor-ia/context-builder.ts` — anexa `studentModel` + `studentSummary` (via `summarizeStudentModel`) e proveniência.
- `lib/professor-ia/study-plan-builder.ts` — prioriza erros recorrentes, temas persistentes e revisão longitudinal.
- `lib/professor-ia/teaching-engine.ts` — detecta repetição, ajusta o modo pedagógico, sinaliza reforço positivo.
- `lib/professor-ia/persona-engine.ts` — seleção de persona pelo perfil do aluno.
- `lib/professor-ia/lesson-planner.ts` — 3 novas `TeachingActionType` longitudinais.
- `lib/professor-ia/conversation-builder.ts` — prompt `aluno` (histórico + regras).
- `lib/professor-ia/dry-run.ts` — `mockStudentModelPAC()` + threading; `studentModel`/`studentSummary` no resultado.
- `scripts/professor-ia-dry-run.mjs` — resumo/influência do Student Model + prompt `aluno` + 3 actions.
- `lib/professor-ia/index.ts` — exporta `buildStudentModel`/`summarizeStudentModel` + tipos.
- `lib/professor-ia/README.md` — seção Fases 14–15.

## Tipos criados (13 principais)
`StudentModel` · `StudentProfile` · `StudentCompetencySnapshot` · `StudentLongitudinalPerformance` · `StudentRecurringError` · `StudentCaseAttemptSummary` · `StudentSystemWeakness` · `StudentExamWeakness` · `StudentLearningPreference` · `StudentProgressTrend` · `StudentReviewNeed` · `StudentRiskPattern` · `StudentModelSummary`
(+ auxiliares: `StudentLevel`, `TrendDirection`, `StudentModelInput`, `StudentAttemptInput`, const `STUDENT_MODEL_SCHEMA_VERSION`).

O `StudentModel` comporta: userId/nome opcionais, nível, semestre, objetivos, competências fortes/fracas, erros recorrentes, casos realizados/reprovados, dificuldade por sistema/exame/raciocínio/conduta, tempo médio, curva de evolução, revisão pendente, confiança estimada, histórico resumido, preferências e riscos.

## Funcionamento
- `buildStudentModel(input)` consolida tentativas passadas (**mock** no dry-run; sem banco/login/persistência): calcula snapshots por eixo com tendência, detecta **erros recorrentes** (chave normalizada; `persistente` ≥ 2 ocorrências), agrupa dificuldade por sistema/exame, monta a **curva de evolução** (tendência via primeira metade × segunda), estima **confiança** (nota média ± tendência) e classifica **riscos** (erro crítico recorrente, queda, estagnação, insegurança).
- `summarizeStudentModel(sm)` → top 3 forças, top 3 fraquezas, top 3 erros recorrentes, temas de revisão, risco pedagógico (maior severidade) e recomendação de foco.

## Exemplo com PAC (dry run · aluno mock)
Perfil: intermediário, 3º semestre, **confiança 63%**, **evolução melhorando**.
- **Forças:** Raciocínio diagnóstico (89%).
- **Fraquezas:** Conduta e segurança (37%); Anamnese (55%).
- **Erro recorrente detectado:** "Antibiótico sem dose" (**3×**, eixo conduta/segurança) → risco `erro_critico_recorrente`.

### Como o histórico alterou a prioridade / StudyPlan
- StudyPlan passou de **11 → 13 itens**; o erro recorrente entra no **topo** (P1) acima de erros isolados ("Erro RECORRENTE (3x): …").
- Resumo inclui: _"Histórico do aluno: 1 erro(s) recorrente(s), evolução melhorando."_

### Como alterou a Teaching Engine
- `erroAtualEhRepeticao = true`; `errosRecorrentesDetectados = ["Antibiótico sem dose (3x)"]`.
- Ajuste: _"Erro recorrente de segurança → modo mais DIRETIVO (não é a primeira vez)."_

### Como alterou a Persona
- **Examinador rigoroso**, justificado por _"Erro crítico recorrente no histórico → rigor/objetividade na correção."_

### Como alterou o Lesson Plan
- 3 actions longitudinais adicionadas: `reinforce_progress`, `review_recurring_error`, `compare_with_previous_attempts`.
- Sequência: `acknowledge_strength → reinforce_progress → review_recurring_error → correct_critical_error → ask_socratic_question → wait_for_student_answer → explain_concept → show_exam_reference → show_sound_reference → mini_quiz → summarize_session → compare_with_previous_attempts → assign_next_step`.

### Como alterou os prompts
- Novo prompt `aluno` (histórico + regras); ordem: `system → seguranca → naoInventarMedicina → apenasBaseDoSistema → verdade → **aluno** → professor → conducao → caso → contexto`.
- Regras no prompt: usar histórico só para personalizar; não expor dados sensíveis desnecessários; **não humilhar** por erro recorrente; reconhecer o padrão com respeito.

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Execução real** (type-stripping, descartada): **sem** StudentModel o pipeline é idêntico (11 itens, sem ajuste, sequência original, sem prompt `aluno`); **com** StudentModel usa o histórico (13 itens, ajuste diretivo, persona rigorosa, 3 actions longitudinais, prompt `aluno` com regra anti-humilhação).
- ✅ **Runner executado** (`node scripts/professor-ia-dry-run.mjs`): imprime forças, fraquezas, erro recorrente, prioridade modificada, persona, actions por histórico e prompt do aluno.
- ✅ Nenhuma IA / endpoint / UI / chat / login / banco criado; OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**.

## Limitações
- Dados de tentativas são **mock** no dry-run; não há persistência, login nem memória real (por decisão desta fase).
- Detecção de erro recorrente por **heurística** de palavras-chave (suficiente para o exemplo; calibração futura).
- A ligação "erro atual == erro recorrente" usa casamento aproximado (descrição/eixo).
- Imports sem extensão não rodam direto no Node (limitação conhecida); **type-check é a prova** e a execução foi confirmada por type-stripping numa cópia temporária.

## Próximos passos
1. Fonte real de tentativas (quando houver persistência/login) alimentando `buildStudentModel`.
2. Memória do aluno entre sessões e dashboard longitudinal (fase futura, fora do escopo aqui).
3. (Fase futura) orquestrador/endpoint enviaria os prompts (incl. `aluno`) a um modelo, respeitando as regras de privacidade.
4. Calibrar pesos de confiança/risco com dados reais.
