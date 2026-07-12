# RELATÓRIO — Casos Dinâmicos Beta · Fase 11.1: Teste Visual Pulse Local

**Data:** 2026-07-12  
**Fase:** 11.1 — Teste visual guiado da API e botão experimental  
**Servidor:** `npm run dev` (localhost:3000)  
**Status:** ✅ CONCLUÍDA — API e UI confirmadas

---

## Resultado

Botão experimental Pulse apareceu e funcionou. Fluxo MEDIX rule-based preservado.

---

## 1. Confirmação da API

Testado via curl com o dev server no ar:

| Chamada | HTTP | Resultado |
|---|---|---|
| `GET /api/pulse/simulate` | 200 | `{ ok:true, status:"pulse-local-route-ready" }` |
| `POST` com `conditionId:"pneumonia-severe-adult"` | 400 | `{ ok:false, fallbackRecommended:true, error:"conditionId 'pneumonia-severe-adult' não suportado." }` |
| `POST` com body JSON mal-formado | 400 | `{ ok:false, error:"Body JSON inválido" }` |
| `POST` com `conditionId:"asthma-severe-adult"` | 200 | PatientState real do Pulse (25.2s) |

Todos os casos de erro retornam resposta controlada. App não quebrou em nenhuma chamada.

---

## 2. Confirmação do botão (navegador)

**Tela:** `http://localhost:3000/casos-dinamicos`  
**Caso:** Crise Asmática Grave — Adulto (`dynamic-asthma-severe-adult-001`)

- Badge "Experimental" roxo apareceu corretamente abaixo do painel de vitais MEDIX.
- Botão **"Rodar Pulse local experimental"** visível e clicável.
- Ao clicar: mensagem "⏳ Rodando Pulse local... pode levar até 30s" exibida durante execução.
- Após ~25s: painel **"Resultado Pulse local"** apareceu com pills de vitais.

---

## 3. Valores retornados (Pulse Engine real — 580s simulados, severity 0.75)

| Parâmetro | Valor | Origem |
|---|---|---|
| SpO₂ | **94.9%** | Pulse real (convertido de fração 0.949) |
| FC | **74 bpm** | Pulse real |
| FR | **19 irpm** | Pulse real |
| PA | **115/75 mmHg** | Pulse real |
| Ausculta | sibilos difusos intensos, murmúrio vesicular reduzido | Bridge (baseado em severity) |
| Trabalho respiratório | muito aumentado | Bridge (baseado em severity) |

Warnings exibidos no painel:

1. "CSV/TXT: 29000 linhas de dados — usando a última." — normal (580s × 50Hz)
2. "OxygenSaturation convertida de fração Pulse (0.949) para % (94.9%)." — normalização correta
3. "Campo essencial 'bodyTemperature_C' ausente no output Pulse — usando fallback 37." — temperatura não mapeada no CSV Pulse; fallback clínico aceitável

Os warnings apareceram no painel mas **não impediram o funcionamento**. Todos são informativos.

---

## 4. Pulse NÃO substitui o estado principal

- O painel Pulse exibe apenas dados comparativos.
- O footer do painel informa: *"Este resultado NÃO altera o fluxo MEDIX principal."*
- As ações MEDIX rule-based (oxigênio, salbutamol, reavaliar) continuaram funcionando normalmente após rodar o Pulse.
- A timeline do runner continuou registrando as ações MEDIX sem interferência.
- O `simulationProvider` dos casos permanece `"medix-rule-based"`.
- O `PatientState` retornado pelo Pulse não foi aplicado ao estado do runner.

---

## 5. Confirmação do fluxo MEDIX

- Checklist de comunicação, anamnese, exame físico e exames complementares: operacionais.
- Botões de intervenção (oxigênio, salbutamol, reavaliar, descompressão): operacionais.
- Timeline de eventos: atualizada corretamente com cada ação.
- Botão "Finalizar Beta": funcionou.
- Feedback da rubrica dinâmica: nota e domínios exibidos corretamente.
- Nenhuma regressão observada no fluxo principal.

---

## 6. Outros casos — sem botão Pulse

Não testado manualmente nesta sessão (confiado na verificação por código):

```typescript
// DynamicCaseRunner.tsx
{caso.identificacao.caseId === ASTHMA_CASE_ID && (
  <PulseLocalExperimentPanel ... />
)}
```

| Caso | caseId | Botão Pulse |
|---|---|---|
| Asma Grave | `dynamic-asthma-severe-adult-001` | ✅ aparece |
| DPOC Exacerbado | `dynamic-copd-exacerbation-adult-001` | ❌ não aparece |
| Pneumotórax Hipertensivo | `dynamic-tension-pneumothorax-adult-001` | ❌ não aparece |
| Pneumonia Grave | `dynamic-severe-pneumonia-adult-001` | ❌ não aparece |

---

## 7. Recomendações para Fase 12

1. **Cache do estado inicializado:** subprocess persistente ou serialização do estado Pulse para reutilização. Objetivo: reduzir latência de ~25s para <5s.
2. **Temperatura:** mapear coluna `CoreTemperature` do CSV Pulse para eliminar o warning do fallback.
3. **Casos adicionais:** implementar `conditionId:"dpoc-exacerbado-adult"` com runner Python dedicado.
4. **Diff visual:** comparar lado a lado vitais MEDIX vs. vitais Pulse para uso didático.
5. **Ativar provider:** quando latência < 5s, avaliar trocar `simulationProvider` do caso piloto para `"pulse-local"`.
