# Relatório — Reavaliação de Sinais Vitais / Sinais Vitais de Saída

_Feature aditiva na aba "Sinais Vitais". Preserva os sinais de entrada, o layout desktop/mobile e todos os demais módulos (Paciente, Exame Físico, Exames Laboratoriais, ECG, chat, SOAP, diagnóstico, conduta, feedback). Determinística; orienta a decisão, não substitui o raciocínio clínico. NÃO implementa TreatmentResponseEngine._

## Objetivo
Na aba "Sinais Vitais", permitir reavaliar o paciente após um tempo de observação, gerando sinais de **saída** coerentes com o caso/gravidade e orientando a decisão: **alta segura**, **observação** ou **encaminhamento hospitalar**.

## Arquivos criados/completados
- `src/vitals/evaluateDisposition.ts` — regra de estabilidade/disposição (novo).
- `src/components/VitalsReassessment.tsx` — interface da reavaliação (novo).
- (Base já existente, reutilizada: `vitalTypes.ts`, `vitalUtils.ts`, `vitalProfiles.ts`, `generateDischargeVitals.ts`.)
- `docs/RELATORIO-SINAIS-VITAIS-REAVALIACAO.md` — este relatório.

## Arquivos modificados
- `app/caso/[id]/page.tsx` — estado `vitalsReavaliadoMin` (persiste ao trocar de aba); import do `VitalsReassessment`; inserção do componente **dentro** da aba "Sinais Vitais" (desktop e mobile), **abaixo** dos sinais de entrada existentes. Nada mais foi tocado.

## Como o motor funciona
1. `parseInitialVitals(caso)` extrai os sinais de **entrada** de `caso.sinaisVitaisCorretos` (PA, FC, FR, Temp, SpO₂, glicemia/dor), com defaults seguros.
2. `getVitalProfile(caso)` resolve o **perfil clínico** (17 perfis) por diagnóstico/categoria.
3. `generateDischargeVitals({ caso, initialVitals, elapsedMinutes })` aplica as **tendências** do perfil aos sinais de entrada, proporcional ao tempo de observação, com **PRNG determinístico** (seed = `caseId + perfil + tempo`) → mesmos sinais de saída para mesmo caso e tempo.
4. `evaluateDisposition({ caso, exitVitals })` avalia os sinais de saída e o perfil → `{ disposition, stabilityLabel, reasons, warnings }`.

## Interface (aba Sinais Vitais)
- **Sinais Vitais de Entrada** (preservados) — PA, FC, FR, Temp, SpO₂, glicose/dor.
- **Tempo de observação**: chips 15 / 30 / 60 / 120 min.
- Botão **"Reavaliar sinais vitais"**.
- **Sinais Vitais de Saída** (após N min) com setas ▲/▼ vs. entrada.
- **Status de estabilidade**: Alta segura (verde) / Manter observação (âmbar) / Encaminhamento hospitalar (vermelho), com justificativas curtas e alertas.

## Contrato de `evaluateDisposition`
```ts
{ disposition: "alta_segura" | "observacao" | "encaminhamento_hospitalar",
  stabilityLabel: string, reasons: string[], warnings: string[] }
```

## Critérios de estabilidade (sinais de saída)
- **SpO₂** < 88 → hospital; 88–91 → observação.
- **FR** > 32 → hospital; 25–32 → observação.
- **FC** > 130 ou < 45 → hospital; 115–130 → observação.
- **PA** sistólica < 90 → hospital; > 210/130 → hospital; > 180/120 → observação.
- **Temperatura** > 39,5 °C → observação.
- **Glicemia** > 400 ou < 50 → hospital; 250–400 ou < 70 → observação.
- **Dor** ≥ 8/10 → observação.

## Regra clínica de segurança (nunca alta simples)
Perfis de alto risco (`nuncaAltaDireta` + provável hospital) → **encaminhamento hospitalar SEMPRE**, mesmo com sinais melhorando: **IAM/SCA, sepse, TEP, dengue com alarme, cetoacidose, insuficiência cardíaca descompensada, pneumonia grave**. Perfis com `podeAlta=false` (**DPOC exacerbado, crise asmática grave**) nunca recebem alta simples (observação/hospital).

## Exemplos por caso (verificado por script, 60 min)
| Caso | Disposição |
|---|---|
| Asma leve/moderada | ✅ alta_segura (SpO₂/FR/FC melhoram) |
| Pneumonia grave | 🏥 encaminhamento_hospitalar |
| Sepse | 🏥 encaminhamento_hospitalar |
| Dengue sem alarme | ✅ alta_segura |
| Dengue com alarme | 🏥 encaminhamento_hospitalar |
| IAM/SCA | 🏥 encaminhamento_hospitalar (mesmo com sinais aceitáveis) |
| TEP | 🏥 encaminhamento_hospitalar |
| Cetoacidose | 🏥 encaminhamento_hospitalar |
| HAS / inespecífico | ✅ alta_segura |

**Nenhum quadro de alto risco recebeu alta simples** (confirmado). Saída **determinística** por caseId+tempo+perfil (mesmo caso+tempo → mesmos valores; verificado).

## Preservação
- Sinais de entrada preservados; layout desktop/mobile mantido (componente inserido abaixo dos sinais atuais nos dois layouts).
- O estado do tempo/saída fica no componente pai (`vitalsReavaliadoMin`) → **trocar de aba e voltar mantém os sinais de saída**.
- Paciente, Exame Físico, Exames Laboratoriais, ECG, chat, SOAP, diagnóstico, conduta e feedback: **intactos**.

## Validação
- ✅ `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).
- ✅ Testes de disposição para asma, pneumonia grave, sepse, dengue (sem/com alarme), IAM/SCA, TEP, cetoacidose e HAS/inespecífico.
- ✅ Determinismo confirmado.

## Riscos / revisão médica
- Perfis e magnitudes são **didáticos/genéricos** — revisão médica recomendada antes de uso avaliativo.
- A resposta ainda **não** considera as condutas registradas (interventions) — há `TODO` no `generateDischargeVitals` para integração futura (TreatmentResponseEngine, fora do escopo desta fase).
- Alguns limiares (ex.: pneumonia grave observação vs. hospital) podem ser calibrados conforme protocolo local.
