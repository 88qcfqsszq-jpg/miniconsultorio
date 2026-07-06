# Relatório — Remoção do card lateral "Sinais Vitais"

_Removido apenas o card lateral redundante que aparecia abaixo do box Atendimento na coluna esquerda. A aba/menu "Sinais Vitais" e a reavaliação continuam intactas._

## Arquivo modificado
- `app/caso/[id]/page.tsx`

## Bloco removido
A `<section className="medix-vitals-card">` da coluna esquerda (logo acima de "Diagnóstico e Conduta"), que renderizava:
- header **"Sinais Vitais — Dados iniciais do paciente"**;
- botão **"Solicitar Sinais Vitais" / "✓ Coletado"**;
- grade `medix-vitals-grid` com **PA, FC, FR, Temp, SpO₂ e Glicose**.

Substituído por um comentário indicando a remoção. Nenhum outro trecho foi alterado.

## Confirmações
- ✅ **Aba/menu "Sinais Vitais" central continua funcionando**: os blocos `menuAtivo === "sinaisVitais"` (desktop) e `abaAtiva === "sinaisVitais"` (mobile) permanecem, cada um renderizando o `VitalsReassessment` (botões "Sinais vitais de entrada" e "Sinais vitais de saída / Reavaliação").
- ✅ **Reavaliação de sinais vitais intacta**: `VitalsReassessment`, `TreatmentResponseEngine`, `applyTreatmentResponseToVitals`, `evaluateDisposition` e os sinais de entrada/saída da área central não foram tocados.
- ✅ **Coleta preservada**: `sinaisVitaisSolicitados`/`setSinaisVitaisSolicitados` continua acionado pelo botão "Sinais vitais de entrada" (via `onSolicitarEntrada`) e ainda alimenta o payload/feedback.
- ✅ **Layout desktop e mobile preservados**; a aba "Sinais Vitais" no menu Atendimento continua presente.
- ✅ Não foram alterados Exames, Exames Laboratoriais, ECG, Paciente nem Exame Físico.
- ✅ `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).
