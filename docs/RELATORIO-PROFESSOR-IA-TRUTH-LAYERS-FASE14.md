# Relatório — Professor IA consumindo Truth Layers (Fase 14)

_Data: 2026-07-03 · Camada **estrutural e aditiva**, limitada a `lib/professor-ia/`, `clinical-engine/gold-standard/` e `docs/`. Sem IA, endpoint, chat ou UI. Não altera Feedback, HealthBench, OSCE, Centro Clínico, rotas ou layout. Não substitui `data/casos-osce.ts`. Não implementa o Professor IA real._

## Objetivo
Fazer o módulo Professor IA passar a consumir o **Gold Standard** e suas **Truth Layers** como fonte de verdade pedagógica, mantendo **retrocompatibilidade total** (tudo é opcional: sem Gold Standard, o comportamento é idêntico ao anterior).

Antes: `contexto + KnowledgeMap + HealthBench + StudyPlan`.
Agora: `contexto + HealthBench + StudyPlan + Gold Standard + Truth Layers`.

## Arquivos alterados
- `lib/professor-ia/interfaces.ts` — tipos de resumo das 5 camadas + `goldStandard?`/`truthLayers?`/`truthLayersResumo?` no `ProfessorIAContext`; `goldStandard?` em `ProfessorContextInput` e `StudyPlanInput`; `ProfessorPrompts.verdade?`.
- `lib/professor-ia/context-builder.ts` — `resumirTruthLayers(gs)`; aceita `goldStandard`, extrai Truth Layers, passa `resourceTruth` ao knowledge-builder e anexa tudo ao contexto (+ proveniência).
- `lib/professor-ia/knowledge-builder.ts` — `buildKnowledgeMap` aceita `resourceTruth?`; os links do Centro Clínico da Resource Truth entram **primeiro** (preferenciais) em cada domínio.
- `lib/professor-ia/study-plan-builder.ts` — usa Evaluation/Teaching Truth para priorizar critérios críticos, checklist obrigatório e pontos de ensino.
- `lib/professor-ia/teaching-engine.ts` — usa Teaching Truth (perguntas/mini-aulas) e Evaluation Truth (critérios obrigatórios/críticos); novos campos opcionais em `TeachingDecision`.
- `lib/professor-ia/lesson-planner.ts` — perguntas e mini-quiz vêm da Teaching Truth; recursos das actions vêm da Resource Truth (via KnowledgeMap enriquecido); comparação com checklist da Evaluation Truth.
- `lib/professor-ia/conversation-builder.ts` — novo prompt **VERDADE** (Gold Standard + Truth Layers) com as regras de prioridade; inserido na ordem.
- `lib/professor-ia/dry-run.ts` — passa o `PAC_GOLD_STANDARD` por todo o pipeline.
- `scripts/professor-ia-dry-run.mjs` — bloco inline modesto das Truth Layers + prompt `verdade` + impressão da influência.
- `docs/RELATORIO-PROFESSOR-IA-TRUTH-LAYERS-FASE14.md` — este relatório.

## Como o Professor IA consome as Truth Layers
| Camada | Consumidor no Professor IA | Efeito |
|---|---|---|
| **Clinical Truth** | conversation-builder (prompt VERDADE) | diagnóstico, diferenciais, sinais de gravidade, conduta ideal, erros graves |
| **Educational Truth** | conversation-builder | conceitos essenciais, pontos de confusão |
| **Evaluation Truth** | study-plan-builder, teaching-engine, lesson-planner, conversation-builder | critérios obrigatórios/críticos priorizam plano de estudo, erros a explorar e comparação com checklist |
| **Teaching Truth** | teaching-engine, lesson-planner, conversation-builder | perguntas socráticas, mini-aulas e mini-quiz vêm daqui |
| **Resource Truth** | knowledge-builder (fonte preferencial), lesson-planner, conversation-builder | recursos (Centro Clínico + ids) das actions `show_*_reference` |

**Regra de precedência (prompt VERDADE):** priorizar Truth Layers sobre texto solto; não contradizer o Gold Standard; em conflito, **o Gold Standard vence**; não extrapolar além das Truth Layers e do contexto.

## Exemplo com PAC (dry run · HealthBench MOCK 11.8/20)
Executado ponta a ponta (`buildProfessorContext → buildStudyPlan → buildTeachingStrategy → buildProfessorPersona → buildLessonPlan → buildConversationModel`):

### Mudanças no contexto
- `goldStandard` presente ✅ · `truthLayers` presente ✅ · `truthLayersResumo.presente = true` (5 camadas).
- **KnowledgeMap preferencial:** `conhecimento.exames[0]` = "RX de tórax · Hemograma" (`id: truth-exame-2`) e `conhecimento.sons[0]` = "Crepitações" (`id: truth-som-4`) — vindos da **Resource Truth**, não mais do índice por tema.

### Mudanças no plano de estudo
- 11 itens (6 P1, 5 P2). Agora inclui: **critérios críticos** ("Garantir critério crítico: …"), **checklist obrigatório** ("Cobrir o checklist obrigatório do caso") e **pontos de ensino** ("Ponto de ensino: …").
- Resumo: _"…Baseado no Gold Standard (Truth Layers): 4 critério(s) crítico(s), 5 item(ns) de mini-quiz."_

### Mudanças no Teaching Engine
- `fonteDidatica = "gold_standard"` · `criteriosCriticos` (4) e `criteriosObrigatorios` (7) preenchidos da Evaluation Truth.
- Perguntas socráticas e erros a explorar priorizam Teaching/Evaluation Truth.

### Mudanças no Lesson Plan
- Sequência preservada (idêntica à Fase 11): `acknowledge_strength → correct_critical_error → ask_socratic_question → wait_for_student_answer → explain_concept → show_exam_reference → show_sound_reference → mini_quiz → summarize_session → assign_next_step`.
- **Recursos usados vêm da Resource Truth:** "RX de tórax · Hemograma", "Crepitações".
- **Mini-quiz vem da Teaching Truth:** _"Por que prescrever antibiótico sem dose é inseguro?"_.

### Prompts atualizados
- Novo prompt `verdade` presente; ordem: `system → seguranca → naoInventarMedicina → apenasBaseDoSistema → **verdade** → professor → conducao → caso → contexto`.
- O prompt `verdade` contém as 5 camadas + a regra "em conflito, o Gold Standard VENCE".

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Execução real** (type-stripping em cópia temporária, descartada) do pipeline completo: PAC carrega Gold Standard + Truth Layers; plano usa elementos das Truth Layers; Lesson Planner usa recursos da Resource Truth; prompt `verdade` presente.
- ✅ **Runner executado** (`node scripts/professor-ia-dry-run.mjs`): imprime camadas carregadas, principais itens e influência no Teaching Engine e Lesson Planner; prompt `verdade` incluído.
- ✅ **Retrocompatibilidade:** sem `goldStandard`, todo o pipeline funciona como antes (campos opcionais).
- ✅ Sem IA / endpoint / chat / UI; OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**.

## Limitações
- Só o **PAC** tem Truth Layers curadas; outros casos usam derivação genérica do engine (menos mini-quiz/analogias).
- O alvo da correção crítica no Lesson Planner continua sendo o **erro real do aluno** (HealthBench); as Truth Layers informam *como* ensinar e *quais* recursos usar, não substituem o que o aluno errou.
- Imports sem extensão não rodam direto no Node (limitação conhecida); **type-check é a prova** e a execução foi confirmada por type-stripping numa cópia temporária.
- Nada consome os prompts em runtime (sem endpoint/IA, por decisão desta fase).

## Próximos passos
1. Curar as Truth Layers dos demais casos e alimentar o Professor IA com todos.
2. (Fase futura) orquestrador/endpoint enviaria os prompts (incl. `verdade`) a um modelo, respeitando "o Gold Standard vence".
3. HealthBench derivar a rubrica da Evaluation Truth; Feedback exibir a Clinical/Educational Truth; Centro Clínico inteligente abrir a Resource Truth.
4. UI/aba/chat do Professor — fase futura.
