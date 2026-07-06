# Relatório — Simplificação da UI do Professor IA (Fase 25)

_Somente UI. Toda a infraestrutura continua ativa em segundo plano; apenas deixou de ser renderizada. Nenhum componente/arquivo foi apagado; nenhuma arquitetura foi removida._

## Objetivo
Transformar o Professor IA num **chat limpo**, estilo assistente conversacional (tipo ChatGPT): apenas um cabeçalho fixo, exemplos de perguntas, histórico e campo de texto.

## O que deixou de ser RENDERIZADO
Na seção Professor IA do `FeedbackOSCE`, deixou de aparecer **todo** o conteúdo do `ProfessorIAPreview`:
1. Diagnóstico da sessão
2. Plano da aula
3. Recursos recomendados
4. Base do Professor IA
5. "O que o professor diria primeiro"
6. Fala generativa (experimental) + botão "Gerar fala do Professor"
7. Qualquer referência visual ao LessonFlow / etapas / progresso / step atual
8. "preview estrutural", "modo experimental", badge "prévia", botão "Ver plano do Professor IA"
9. O chat controlado por LessonFlow (Fase 23) — já não era renderizado desde a Fase 24; agora nem a prévia aparece.

O componente `ProfessorIAPreview.tsx` **não foi apagado** — apenas não é mais importado/renderizado pelo `FeedbackOSCE`.

## Nova UI (única coisa exibida)
```
💬 Professor IA
Converse livremente sobre o seu atendimento.

Pergunte, por exemplo:
• Onde eu errei?
• Minha conduta estava correta?
• Explique meu raciocínio.
• Como eu faria nota máxima?
• Me ensine este caso como um professor.

(histórico do chat)

[ Pergunte ao Professor IA...            ] [Enviar]
```
Estilo: centralizado, muito espaço em branco, sem cards/listas técnicas/painéis/caixas informativas. As bolhas do aluno são "pílulas" à direita; a resposta do professor é texto corrido à esquerda (estilo ChatGPT). Sem rodapé técnico, sem badges, sem avisos.

## Arquivos alterados (só apresentação)
- `components/FeedbackOSCE.tsx` — a seção Professor IA passou a renderizar **apenas** `<ProfessorIAOpenChat/>` (removidos o `<ProfessorIAPreview/>`, o botão de expandir, o badge "prévia" e o estado `professorExpandido`). O import do `ProfessorIAPreview` foi retirado (componente permanece no projeto).
- `components/professor-ia/ProfessorIAOpenChat.tsx` — layout limpo: cabeçalho fixo "💬 Professor IA" + "Converse livremente sobre o seu atendimento.", exemplos de perguntas, histórico, campo redondo + "Enviar". Removidos badge "chat aberto", avisos e o rodapé informativo.

## Mantido (nada removido da arquitetura)
Backend, `StudentTrace`, `Gold Standard`, `Truth Layers`, `HealthBench`, `OpenChatContext`, guardrails, prompt, endpoint `POST /api/professor-ia/chat`, PDF context, `ProfessorLesson`/`LessonFlow`/`preview-builder` — **todos intactos**. O `FeedbackOSCE` ainda chama `buildProfessorIAPreview(...)` em segundo plano (monta `ProfessorLesson` + `StudentTrace` + `Gold Standard`), e o chat continua enviando `caso`/`feedback`/`atendimento`/`pdfText` ao endpoint.

## Validação
- ✅ **Type-check limpo** (`tsc --noEmit`) — só persistem os erros **pré-existentes** do `ecgGenerator`.
- ✅ `ProfessorIAPreview` **não é renderizado** no `FeedbackOSCE` (confirmado por grep); a seção só tem `<ProfessorIAOpenChat/>`.
- ✅ Sem textos técnicos na UI do chat (só "💬 Professor IA", "Converse livremente…", placeholder "Pergunte ao Professor IA..." e "Enviar"). As ocorrências de "LessonFlow/etapa/preview/experimental" restantes estão apenas em **comentários de código**, não na tela.
- ✅ **Professor IA continua respondendo** — `POST /api/professor-ia/chat` retornou `ok=true`, `source="model"`, `sourcesUsed=["gold_standard","student_trace","feedback_healthbench","pdf"]` para "Onde eu errei?".
- ✅ **StudentTrace / Gold Standard / Guardrails / PDF** continuam sendo usados (as 4 fontes aparecem em `sourcesUsed`; o guardrail e o contexto são montados no endpoint, inalterados).
- ✅ **Feedback / nota / HealthBench** inalterados (nenhuma dessas partes foi tocada).
- ⚠️ Playwright de UI não executado (exige completar um caso OSCE p/ chegar ao Feedback); validação por `tsc` + inspeção do render + chamada real ao endpoint.

## Conclusão
Apenas a **interface** mudou: a seção Professor IA agora é um chat limpo. Toda a arquitetura (contexto, rastro, gabarito, guardrails, endpoint, PDF) permanece **ativa em segundo plano** — só não é mais exibida.
