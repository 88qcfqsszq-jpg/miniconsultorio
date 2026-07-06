# Relatório — Primeira integração visual do Professor IA no Feedback OSCE (Fase 17)

_Data: 2026-07-03 · Integração **puramente aditiva** na UI do Feedback. NÃO substitui nada do feedback atual, NÃO altera nota, HealthBench, OSCE, Centro Clínico ou rotas. NÃO chama IA, NÃO abre chat, NÃO cria endpoint/login/banco. Apenas adiciona a primeira visualização estrutural do Professor IA._

## Objetivo
Adicionar ao Feedback OSCE uma seção **👨‍🏫 Professor IA** que consome toda a infraestrutura já criada (Fases 0–16) e exibe um **preview estruturado** da sessão de tutoria — sem chat real nem modelo generativo.

## Etapa 1 — Inspeção do Feedback (sem editar)
- Componente principal: `components/FeedbackOSCE.tsx` (`"use client"`, ~744 linhas).
- **Não usa abas**: é um fluxo de `<section>`s roláveis; há uma seção "Estudo final do caso" **expansível** (padrão botão + estado `estudoExpandido`).
- Nota/cards/rubrica: derivados de `feedback` (prop `FeedbackOSCE`); `percentual = feedback.nota/20`.
- `estudoFinal` vem de `fetch("/api/estudo-final-caso")` (resposta modelo, checklist nota máxima, mini-aula, erros críticos).
- Ponto seguro de inserção: **uma nova `<section>` expansível imediatamente antes dos "BOTÕES FINAIS"**, espelhando o padrão do "Estudo final".

## Etapa 2/3 — Arquivos criados
- `lib/professor-ia/preview-builder.ts` — `buildProfessorIAPreview(input)`: monta os dados prontos para render reutilizando `buildProfessorContext → buildStudyPlan → buildTeachingStrategy → buildProfessorPersona → buildLessonPlan → buildConversationModel`. **Puro** (sem IA/endpoint/banco). Mocks **leves** e auto-contidos de HealthBench/StudentModel/LearningSession (não arrasta o `dry-run`/knowledge registry para o bundle do cliente).
- `components/professor-ia/ProfessorIAPreview.tsx` — componente **presentacional** (sem hooks, sem fetch) que renderiza o preview.
- `docs/RELATORIO-PROFESSOR-IA-PREVIEW-FEEDBACK-FASE17.md` — este relatório.

## Arquivos alterados
- `components/FeedbackOSCE.tsx` — **aditivo**: importa o preview; novo estado `professorExpandido`; `useMemo` que monta `professorPreview` (try/catch — nunca quebra o feedback); nova `<section>` "👨‍🏫 Professor IA" com botão "Ver plano do Professor IA" antes dos botões finais.
- `lib/professor-ia/index.ts` — exporta `buildProfessorIAPreview` + tipos.

## O que a seção exibe (Etapa 2)
1. **Cabeçalho:** "Professor IA" + "Sessão de tutoria personalizada baseada no seu desempenho".
2. **Diagnóstico da sessão:** caso, nota (real do feedback), prioridade principal, erro crítico, modo pedagógico, persona, duração estimada, modo da sessão.
3. **Plano da aula:** as Teaching Actions em ordem, com rótulo PT + descrição.
4. **Recursos recomendados:** sons, imagens, exames, fluxos (ids da Resource Truth) + links reais do Centro Clínico.
5. **O que o professor diria primeiro:** texto **estático** derivado do lesson plan (acerto + erro crítico), sem IA.
6. **Aviso:** "Prévia estrutural — o chat generativo será ativado em fase futura."

## Como usa Gold Standard / Truth Layers (Etapa 5)
- Detecta o **PAC** (id 2 ou "pneumonia/PAC" no título/diagnóstico) → usa `PAC_GOLD_STANDARD` + `CANONICAL_PAC` + Truth Layers + StudentModel/LearningSession mock.
- **Fallback elegante** para casos sem gabarito: "Professor IA ainda não possui gabarito estruturado para este caso." (não quebra outros casos).

## Exemplo (PAC, nota real 11.8) — verificado em execução
- **Diagnóstico da sessão:** caso "Pneumonia Adquirida na Comunidade", nota 11.8/20, prioridade "Corrigir erro crítico", erro crítico "antibiótico sem dose", modo `diretivo`, persona "Mentor clínico", ~8 min, sessão `pos_reprovacao`.
- **Plano (13 actions):** Calibrar objetivo → Reconhecer acerto → Reforçar confiança → Reduzir carga cognitiva → Reforçar evolução → Revisar erro recorrente → Corrigir erro crítico → Explicar conceito → Mostrar exame → Mostrar som → Revisão final → Comparar com histórico → Próximo passo.
- **Recursos:** exames `lab-hemograma`, sons `ls-crepitacoes`, fluxos `flow-febre/flow-dispneia`, 6 links do Centro Clínico.
- **Primeira fala:** "Você foi bem em Auscultou o tórax e identificou crepitações. Agora vamos corrigir um ponto crítico: …".

## Como preserva o feedback atual (Etapa 4)
- Nenhuma seção/aba existente removida; nota, cards HealthBench, rubrica, resposta modelo, checklist e mini-aula **inalterados**.
- A seção Professor IA é **colapsada por padrão** (botão "Ver plano do Professor IA") e vem **depois** de todo o feedback, antes dos botões.
- O `useMemo` do preview é isolado por `try/catch`: qualquer falha apenas oculta a seção (retorna `null`), sem afetar o restante.

## Validação (Etapa 6)
- ✅ **Type-check limpo** (`npx tsc --noEmit`) incluindo os `.tsx` novos — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Execução real** (type-stripping, descartada) do `buildProfessorIAPreview`: PAC → preview completo; caso sem gabarito → fallback elegante.
- ✅ Alteração no `FeedbackOSCE` é **aditiva** (nova seção/estado/memo); nota, cards, resposta modelo, checklist e mini-aula preservados.
- ✅ Sem chamada OpenAI, sem endpoint, sem banco/login, sem chat.
- ⚠️ **Build Next completo não executado**: o projeto **não** tem `ignoreBuildErrors` e possui erros TS **pré-existentes** em `src/services/ecgGenerator/*` que fariam o `next build` falhar por motivos alheios a esta fase. A validação foi feita por `tsc --noEmit` (isolando os erros pré-existentes) + execução do builder. Recomenda-se um smoke test Playwright do fluxo de feedback numa próxima janela.

## Limitações
- Preview **estrutural**: nenhuma resposta é gerada por IA; a "primeira fala" é texto estático derivado do lesson plan.
- Só o **PAC** tem gabarito; demais casos mostram o fallback.
- StudentModel/LearningSession são **mock** (sem persistência/login/banco).
- HealthBench usado pelo preview é **mock leve** (a nota exibida é a real do feedback; competências/erros são do mock) — a ligação com o HealthBench real do atendimento fica para uma fase futura.
- Playwright não executado nesta fase (ver validação).

## Próximos passos
1. Alimentar o preview com o **HealthBench real** do atendimento (mapear `feedback` → `HealthBenchEvaluationResult`).
2. Gabaritos (Gold Standard) para os demais casos → preview além do PAC.
3. (Fase futura) ativar o **chat generativo** via orquestrador/endpoint, enviando os prompts já montados (system/segurança/verdade/aluno/sessão/condução/…) a um modelo.
4. Smoke test Playwright do fluxo de feedback + a11y da nova seção.
