# Relatório — ProfessorLesson: roteiro único do Preview e do futuro Chat (Fase 18)

_Data: 2026-07-03 · Camada **estrutural e aditiva**. NÃO chama IA, NÃO cria endpoint/chat/UI nova/login/banco. NÃO altera nota, HealthBench, OSCE, Centro Clínico, rotas ou layout. Apenas cria o objeto `ProfessorLesson` como roteiro único reutilizável._

## Objetivo
Consolidar a saída do pipeline pedagógico num **objeto único** — `ProfessorLesson` — que serve ao mesmo tempo o **Preview** (hoje) e o **futuro Chat/voz/aula guiada/plano de estudo**.
```
Antes:  Pipeline → Preview (montava dados à mão)
Agora:  Pipeline → buildProfessorLesson → ProfessorLesson → Preview
Futuro: Pipeline → buildProfessorLesson → ProfessorLesson → Chat
```

## Arquivos criados
- `lib/professor-ia/professor-lesson.ts` — tipos + `buildProfessorLesson(input)`.
- `docs/RELATORIO-PROFESSOR-LESSON-FASE18.md` — este relatório.

## Arquivos alterados
- `lib/professor-ia/preview-builder.ts` — deixou de montar dados próprios: agora roda o pipeline e chama `buildProfessorLesson`, devolvendo um `ProfessorLesson` (ou fallback).
- `components/professor-ia/ProfessorIAPreview.tsx` — passa a receber e renderizar um `ProfessorLesson` (prop `lesson`), sem conhecer os engines internos.
- `components/FeedbackOSCE.tsx` — apenas o nome da prop (`data` → `lesson`); o resto (seção expansível, try/catch) permanece.
- `lib/professor-ia/dry-run.ts` — inclui `professorLesson` no resultado.
- `scripts/professor-ia-dry-run.mjs` — monta/imprime o `ProfessorLesson` inline.
- `lib/professor-ia/index.ts` — exporta `buildProfessorLesson` + tipos.
- `lib/professor-ia/README.md` — seção ProfessorLesson.

## Estrutura do ProfessorLesson (12 tipos)
`ProfessorLesson` (raiz) + `ProfessorLessonHeader` · `ProfessorLessonDiagnosis` · `ProfessorLessonObjective` · `ProfessorLessonAction` · `ProfessorLessonResource` · `ProfessorLessonPromptPlan` · `ProfessorLessonOpeningLine` · `ProfessorLessonMiniQuiz` · `ProfessorLessonExpectedAnswer` · `ProfessorLessonSafetyRule` · `ProfessorLessonNextStep`.

Campos: título/aviso (header), caso, diagnóstico, nota, prioridade principal, erro crítico, persona, modo pedagógico, duração, objetivo final, **opening line estática**, Teaching Actions normalizadas (com rótulo PT), recursos recomendados, perguntas socráticas, mini-quiz, respostas esperadas (resposta modelo + checklist), pegadinhas, regras de segurança, **prompt plan** e próximo passo. `status`: `ok` | `sem_gabarito` | `sem_plano`.

## `buildProfessorLesson(input)`
Entrada: `ProfessorIAContext`, `StudyPlan?`, `TeachingDecision?`, `ProfessorPersonaDecision?`, `LessonPlannerOutput?`, `ConversationModel?`, `GoldStandard?`, `StudentModel?`, `LearningSession?`, `notaExibida?`, `header?`. Saída: `ProfessorLesson`. Puro; normaliza o que os builders já produziram. Fallback controlado: sem gabarito → `sem_gabarito`; sem teaching/persona/lessonPlan → `sem_plano` (nunca quebra).

## Como o Preview passou a consumir o ProfessorLesson
`buildProfessorIAPreview` agora: detecta o gabarito → roda `buildProfessorContext → buildStudyPlan → buildTeachingStrategy → buildProfessorPersona → buildLessonPlan → buildConversationModel` → chama `buildProfessorLesson` → devolve o `ProfessorLesson`. O componente `ProfessorIAPreview` renderiza só o objeto final (`lesson.status`, `lesson.diagnostico`, `lesson.actions`, `lesson.recursos`, `lesson.openingLine`, `lesson.header.aviso`).

## Como o futuro Chat consumirá o ProfessorLesson
O mesmo `ProfessorLesson` já carrega o **prompt plan** (`ordem`, `prompts`, `totalChars`) — o metadado do que um orquestrador enviaria a um modelo — além de opening line, perguntas socráticas, mini-quiz, respostas esperadas, regras de segurança e próximo passo. Um futuro Chat/voz reutilizará o **mesmo objeto**, sem reconstruir nada: `Pipeline → ProfessorLesson → Chat`.

## Exemplo com PAC (verificado em execução)
- **status:** `ok`; diagnóstico: caso "Pneumonia Adquirida na Comunidade", nota 11.8/20, prioridade "Corrigir erro crítico", erro crítico "antibiótico sem dose", persona "Mentor clínico", modo `diretivo`, ~8 min, sessão `pos_reprovacao`.
- **objetivo final:** "Corrigir com segurança: … e consolidar a conduta correta."
- **13 actions** (Calibrar objetivo → Reconhecer acerto → Reforçar confiança → … → Próximo passo).
- **recursos:** 5 refs (som/imagem/exame/fluxos) + 6 links do Centro Clínico.
- **perguntas socráticas:** 4 · **mini-quiz:** 5 · **pegadinhas:** 3 · **resposta modelo:** 417 chars · **checklist:** 9 · **regras de segurança:** 3 · **prompt plan:** 11 prompts / 11.581 chars.
- **opening line:** "Você foi bem em Auscultou o tórax e identificou crepitações. Agora vamos corrigir um ponto crítico: …".
- **próximo passo:** "Conduta segura".

## Fallback para caso sem Gold Standard
`buildProfessorIAPreview({ caso: {id:99…} })` → `ProfessorLesson` com `status: "sem_gabarito"`, `motivo` "Professor IA ainda não possui gabarito estruturado para este caso", `actions: []`. O componente mostra o estado vazio elegante; o Feedback dos demais casos não quebra.

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) incl. os `.tsx` — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Execução real** (type-stripping, descartada): PAC → `ProfessorLesson` completo; caso sem gabarito → `sem_gabarito`.
- ✅ **dry-run executado** imprime título, prioridade, persona, nº de actions, opening line, recursos e próximo passo.
- ✅ Feedback preservado: nota, cards HealthBench, resposta modelo, checklist e mini-aula **inalterados**; a seção Professor IA continua adicional e colapsada.
- ✅ Sem IA/endpoint/chat/login/banco.

## Limitações
- `ProfessorLesson` é **estrutural**: opening line e demais textos são estáticos/derivados; nada é gerado por IA.
- Só o **PAC** tem gabarito; demais casos → `sem_gabarito`.
- HealthBench do preview ainda é **mock leve** (a nota exibida é a real do feedback).
- `next build` completo não executado (erros TS **pré-existentes** do `ecgGenerator` fariam falhar por motivo alheio à fase); validação por `tsc` + execução do builder. Playwright recomendado numa próxima janela.

## Próximos passos
1. Mapear o **HealthBench real** do atendimento para o preview/ProfessorLesson.
2. Gabaritos para os demais casos → `ProfessorLesson` além do PAC.
3. (Fase futura) **Chat generativo** consumindo o mesmo `ProfessorLesson` via orquestrador/endpoint.
4. Reutilizar o `ProfessorLesson` para voz, aula guiada e plano de estudo.
