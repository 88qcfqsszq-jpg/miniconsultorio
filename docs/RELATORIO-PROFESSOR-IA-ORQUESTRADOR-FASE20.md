# Relatório — Orquestrador Generativo Controlado do Professor IA (Fase 20)

_Data: 2026-07-03 · Primeiro orquestrador generativo **controlado**. NÃO altera nota, HealthBench, OSCE, Centro Clínico, rotas principais, Feedback (só adiciona um botão). NÃO cria login/banco/memória/streaming/voz/dashboard. Não é chat completo — apenas a primeira fala gerada por etapa._

## Objetivo
Conectar um modelo generativo ao Professor IA de forma **controlada**: o modelo **não decide** o que ensinar, qual erro priorizar, qual conduta é correta, qual recurso usar nem a próxima etapa — tudo isso vem de `ProfessorLesson → LessonFlow → LessonStep`. O modelo apenas **transforma o LessonStep atual em fala natural**.

```
ProfessorLesson → LessonFlow → LessonStep atual → Orquestrador → Modelo → Resposta do professor
```

## Arquivos criados
- `lib/professor-ia/orchestrator.ts` — `generateProfessorStepResponse(input, callModel?)` + `buildStepPrompt` + `resolveCurrentStep` + `staticFallbackResponse`.
- `app/api/professor-ia/route.ts` — endpoint `POST /api/professor-ia`.
- `docs/RELATORIO-PROFESSOR-IA-ORQUESTRADOR-FASE20.md` — este relatório.

## Arquivos alterados
- `components/professor-ia/ProfessorIAPreview.tsx` — vira client component; botão **experimental** "Gerar fala do Professor para esta etapa" + área de resultado (1 fala; sem chat).
- `lib/professor-ia/index.ts` — exporta o orquestrador + tipos.
- `lib/professor-ia/README.md` — seção do orquestrador.

## Arquitetura do orquestrador
- **Decoupled do modelo:** `orchestrator.ts` **não importa a SDK** da OpenAI. A chamada é injetada via `callModel: (prompt) => Promise<string>`. Assim o orquestrador é puro/testável e client-safe; a rota injeta o client real.
- `resolveCurrentStep(lesson, currentStepId?)` localiza o `LessonStep` no `LessonFlow` (ou o primeiro).
- `generateProfessorStepResponse` monta o prompt **apenas do step atual**, chama `callModel` (se houver) e devolve: `professorMessage`, `currentStepId`, `nextStepId`, `shouldWaitForStudent`, `resourcesToShow`, `safetyNotes`, `source` (`model`|`fallback`), `debug`. Respeita `wait_student_answer`/checkpoints (via `shouldWaitForStudent`) e não avança sozinho. **Nunca lança** para fora (try/catch → fallback).

## Contrato do endpoint
`POST /api/professor-ia`
```jsonc
// body
{ "lesson": ProfessorLesson, "currentStepId": "step-1", "studentMessage": "…?", "history": [{ "role": "aluno", "content": "…" }] }
// resposta (200)
{ "ok": true, "professorMessage": "…", "currentStepId": "step-1", "nextStepId": "step-2",
  "shouldWaitForStudent": false, "resourcesToShow": [...], "safetyNotes": [...],
  "experimental": true, "source": "model" | "fallback", "debug": { ... } }
```
- Funciona apenas com `OPENAI_API_KEY`; sem chave → `callModel` não é injetado → **fallback estático** (`staticPreviewText`). Erro da API → também fallback. Nunca quebra a app; não grava em banco. Modelo: `gpt-4o-mini`, `temperature 0.4`, `max_tokens 320`.

## Prompt usado (controlado)
- **Papel:** "Você é o Professor IA do Mini Consultório OSCE…".
- **Fonte de verdade:** "o Gold Standard e as Truth Layers VENCEM qualquer outra informação".
- **Escopo:** "responda APENAS sobre a etapa (LessonStep) atual; não avance".
- **Proibições:** não inventar diagnóstico/exame/conduta; não pular etapa; não gerar aula longa; não usar recurso fora da lista do step; não alterar a nota/recalcular feedback; não dar orientação médica real fora do simulado.
- **Saída:** texto curto (1–4 frases), didático, PT, adequado à persona. O bloco `user` traz só a etapa (tipo, objetivo, instrução, texto de referência, resposta esperada, recursos permitidos, regras de segurança, se exige resposta + fallback, condição de parada) + histórico curto + mensagem do aluno.

## Fallback sem API key (verificado)
- **Sem `OPENAI_API_KEY`:** `source: "fallback"`, `professorMessage` = `staticPreviewText` do step (ex.: a opening line do PAC). `ok: true`.
- **Com modelo (mock injetado):** `source: "model"`.
- **Caso sem Gold Standard:** `ok: false`, mensagem "Este caso ainda não possui um plano de aula estruturado do Professor IA." (fallback elegante).
- **Prompt:** confirma "VENCEM", "APENAS" e "NÃO pule etapas".

## Como o Preview chama o endpoint
Na seção Professor IA do Feedback, o botão experimental faz `fetch("POST /api/professor-ia", { lesson, currentStepId: lesson.lessonFlow.firstStepId })` e exibe a fala abaixo, com rótulo "modo experimental" e a origem (modelo/fallback). `try/catch`: se a rede falhar, usa o `staticPreviewText` do primeiro step localmente. **Não** há chat, múltiplas mensagens, streaming nem histórico persistente.

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) incl. rota e `.tsx` — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`. (Corrigido o narrowing de `openai` capturando `const client`.)
- ✅ **Execução real** (type-stripping, descartada): fallback sem chave; `source: model` com modelo mock; prompt controlado; `ok:false` sem gabarito.
- ✅ Feedback preservado: seção Professor IA continua aparecendo, botão experimental aparece; nota, cards, resposta modelo, checklist e mini-aula **inalterados**.
- ✅ Sem login/banco/memória/streaming/voz/dashboard; não substitui o Feedback.
- ⚠️ **Endpoint com chave** não exercitado aqui (sem `OPENAI_API_KEY` no ambiente de validação); o caminho `callModel` foi validado com modelo mock e o real usa o mesmo contrato via `lib/openai`.
- ⚠️ `next build` completo não executado (erros TS **pré-existentes** do `ecgGenerator`); validação por `tsc` + execução do orquestrador.

## Limitações
- **1 fala por clique**, sempre no primeiro step — não navega o LessonFlow ainda (sem cursor/execução real).
- Sem streaming, voz, chat, histórico persistente ou memória.
- Só o **PAC** tem gabarito; demais casos → fallback.
- A qualidade da fala depende do modelo; o controle é pelo prompt + estrutura (não há verificação pós-geração ainda).

## Próximos passos
1. **Runtime de navegação** no LessonFlow: avançar de step, respeitar checkpoints/branches, `wait_student_answer` real.
2. Chat com múltiplas mensagens + streaming (fase futura), reutilizando o mesmo orquestrador por step.
3. Verificação pós-geração (guard-rails): recusar respostas que citem recurso fora da lista ou avancem etapa.
4. Persistência de progresso e memória do aluno — quando houver login/banco.
