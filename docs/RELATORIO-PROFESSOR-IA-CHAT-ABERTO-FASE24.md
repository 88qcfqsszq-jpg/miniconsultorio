# Relatório — Chat Aberto do Professor IA baseado no Atendimento + PDF (Fase 24)

_Substitui o Chat Controlado (LessonFlow) por um **Chat Aberto** (conversa livre). NÃO apaga a arquitetura antiga (só deixa de usá-la na UI). NÃO altera nota/HealthBench/OSCE/Centro Clínico/rotas; não cria login/banco/memória persistente/streaming/voz. Parece uma conversa real com um professor, não uma aula em etapas._

## Objetivo
Chat livre em que o aluno **pergunta o que quiser** sobre o próprio atendimento. Alimentado por: (1) dados estruturados do atendimento; (2) feedback/HealthBench; (3) **StudentTrace**; (4) **Gold Standard/Truth Layers**; (5) **texto do PDF** (complementar). Sem LessonFlow, sem etapas, sem botão "Próxima etapa".

## Arquivos criados
- `lib/pdf/texto-atendimento.ts` — `montarTextoAtendimento(dados)`: reaproveita o **conteúdo textual** do PDF (mesmos dados de `exportarAtendimentoPDF`) em texto puro. **Sem OCR, sem parse de binário.**
- `lib/professor-ia/open-chat-context.ts` — `buildProfessorOpenChatContext(input)`: monta o contexto (resumo do atendimento, dx esperado × informado, nota/competências/erros/pontos a melhorar, StudentTrace, conduta, exames, SOAP, Gold Standard, Truth Layers, texto do PDF) + `forbiddenPraise`/`confirmedStrengths`/`sourcesUsed`/`warnings`.
- `app/api/professor-ia/chat/route.ts` — `POST /api/professor-ia/chat`.
- `components/professor-ia/ProfessorIAOpenChat.tsx` — o chat livre.
- `docs/RELATORIO-PROFESSOR-IA-CHAT-ABERTO-FASE24.md` — este relatório.

## Arquivos alterados
- `components/professor-ia/ProfessorIAPreview.tsx` — **removido** o `<ProfessorIAChat>` (chat controlado da Fase 23). Preview mantido.
- `components/FeedbackOSCE.tsx` — adiciona `<ProfessorIAOpenChat>` **abaixo** da prévia, dentro da seção Professor IA; monta `professorAtendimento` (dados reais) e `professorPdfText` (via `montarTextoAtendimento`).
- `lib/professor-ia/index.ts` — exporta o builder do chat aberto.

## Contrato do endpoint
`POST /api/professor-ia/chat`
```jsonc
// body
{ "atendimentoId?": "...", "caso?": {...}, "feedback?": {...}, "atendimento?": { ... }, "goldStandard?": {...}, "pdfText?": "...", "messages": [{ "role": "aluno"|"professor", "content": "..." }] }
// resposta (200)
{ "ok": true, "message": "...", "sourcesUsed": ["gold_standard","student_trace","feedback_healthbench","pdf"], "warnings": [...], "source": "model"|"guardrail"|"fallback" }
```
Só com `OPENAI_API_KEY` (senão fallback estático). `gpt-4o-mini`, temp 0.4, max_tokens 500. try/catch em tudo; não grava em banco; não altera nota/feedback.

## Prompt do sistema (regras)
Responde **livremente** às perguntas; usa **primeiro os dados do atendimento**; usa **Gold Standard para corrigir**; usa **StudentTrace para elogiar só ações comprovadas**; usa **PDF como evidência complementar**; **não inventa** ação que o aluno não fez; não altera nota/recalcula feedback/substitui avaliação; explica de forma didática e clínica.

## Guardrails (Tarefa 7)
- **ELOGIO = StudentTrace** — o prompt lista as "Ações COMPROVADAS" e os "Elogios PROIBIDOS"; o **guardrail pós-geração** (`validateProfessorMessageAgainstTrace`) bloqueia elogio sem evidência.
- **Refinamento (Fase 24):** o guardrail passou a **ignorar frases negadas** — "você **não** auscultou" / "faltou pedir RX" são **correções** e passam; só "você auscultou" (afirmativo) é bloqueado. Isso corrigiu o falso-positivo que neutralizava respostas de erro.
- **Sem evidência → frase neutra.** **Off-topic** → o prompt orienta responder breve e voltar ao caso. **PDF × dados estruturados → estruturados vencem.** **Conflito clínico → Gold Standard vence.**

## Como não substitui o Feedback
O chat é uma seção **adicional** dentro do bloco Professor IA (colapsável). Estado só em memória. Não faz PATCH em nada; não muta feedback/nota/HealthBench/ProfessorLesson. O feedback, os cards, a resposta modelo, o checklist e a mini-aula continuam idênticos.

## Validação (contra o dev server, modelo real)
Cenário **sem ausculta** (aluno só formulou hipótese + prescreveu amoxicilina, **não** auscultou, **não** pediu RX):
- **"Eu auscultei?"** → _"Não, a ausculta pulmonar não foi registrada como parte do seu atendimento…"_ ✅ (não inventa ausculta).
- **"O que eu errei?"** → _"Você… embora tenha formulado a hipótese diagnóstica de pneumonia e registrado uma conduta ao prescrever amoxicilina, **não foram realizados** alguns passos essenciais…"_ ✅ (elogia só ações reais; lista omissões).
- **"Qual seria a conduta correta?"** → descreve a conduta ideal do Gold Standard (gravidade, SpO₂, antibiótico com dose…). ✅
- **"Me explique como professor."** → resposta livre, didática, sem elogio falso de ausculta. ✅
- **Fontes usadas:** `gold_standard`, `student_trace`, `feedback_healthbench`, `pdf` (todas as 4).
- Responde **livremente** (sem LessonFlow, sem etapas); nenhuma menção de "próxima etapa".
- ✅ **Type-check limpo** (`tsc --noEmit`) — só persistem os erros **pré-existentes** do `ecgGenerator`.
- ✅ Chat controlado (Fase 23) escondido; Preview mantido; nada do feedback substituído.
- ⚠️ Playwright de UI não executado (exige completar um caso OSCE p/ chegar ao Feedback) — validado via `tsc` + chamadas reais ao endpoint.

## Limitações
- **PDF ≈ digest textual** dos dados estruturados (não é parse do binário jsPDF) — por design (sem OCR); é evidência complementar.
- Sem streaming (resposta de uma vez), sem voz, sem histórico persistente entre sessões (estado em memória).
- Só o **PAC** tem Gold Standard → correções clínicas ricas; outros casos funcionam com atendimento+feedback (warning "sem gabarito estruturado").
- Guardrail ainda é baseado em texto (agora com tratamento de negação); casos raros de paráfrase podem escapar/superbloquear.
- A arquitetura de LessonFlow/ProfessorLesson permanece no código (não apagada), apenas não conduz mais o chat.

## Próximos passos
1. Streaming da resposta e histórico persistente (quando houver login/banco).
2. Guardrail semântico (distinguir elogio de descrição de erro com mais robustez).
3. Extração real de texto de PDFs anexados (upload), mantendo "dados estruturados vencem".
4. Reaproveitar o ProfessorLesson/LessonFlow como *ferramentas opcionais* que o chat aberto pode invocar (ex.: "quer um plano de estudo?").
