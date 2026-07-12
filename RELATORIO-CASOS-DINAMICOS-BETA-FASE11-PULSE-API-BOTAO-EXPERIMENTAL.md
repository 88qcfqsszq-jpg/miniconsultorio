# RELATÓRIO — Casos Dinâmicos Beta · Fase 11: API Route + Botão Experimental

**Data:** 2026-07-12  
**Fase:** 11 — API route server-side + painel discreto na tela Beta  
**Status:** ✅ CONCLUÍDA

---

## Arquivos Criados / Alterados

| Arquivo | Ação | Propósito |
|---|---|---|
| `app/api/pulse/simulate/route.ts` | Criado | API Route POST/GET experimental |
| `components/dynamic-osce/PulseLocalExperimentPanel.tsx` | Criado | Painel client-side discreto com botão |
| `components/dynamic-osce/DynamicCaseRunner.tsx` | Alterado (±5 linhas) | Inclui painel apenas no caso de Asma |
| `lib/dynamic-osce/scripts/testar-pulse-api-route-local.ts` | Criado | Teste do handler diretamente (16 critérios) |

---

## Como a API Funciona

**Endpoint:** `POST /api/pulse/simulate`

**Fluxo:**
```
POST { conditionId, severity, duration_s }
  ├─ conditionId !== "asthma-severe-adult" → HTTP 400 + fallbackRecommended:true
  ├─ body JSON inválido → HTTP 400
  ├─ runPulseLocalAsthmaSimulation() [subprocess Python]
  │    ├─ Python não encontrado → HTTP 503 + fallbackRecommended:true
  │    ├─ PyPulse não importa → HTTP 503 + fallbackRecommended:true
  │    ├─ initialize_engine falha → HTTP 503 + fallbackRecommended:true
  │    └─ Sucesso → reader → normalizer → bridge → PatientState
  └─ HTTP 200 { ok:true, patientState, normalized, warnings, duration_s, severity }
```

**Resposta de sucesso:**
```json
{
  "ok": true,
  "provider": "pulse-local",
  "patientState": { "vitals": {...}, "clinical": {...}, "broncoespasmo": 80 },
  "normalized": { "heartRate_bpm": 74.2, "oxygenSaturation": 94.9, ... },
  "warnings": ["OxygenSaturation convertida de fração Pulse..."],
  "duration_s": 580,
  "severity": 0.75
}
```

**Resposta de erro:**
```json
{
  "ok": false,
  "provider": "pulse-local",
  "fallbackRecommended": true,
  "error": "PyPulse não pôde ser importado: ...",
  "warnings": []
}
```

**`csvPath` omitido** da resposta HTTP (path local sensível, não relevante para o cliente).

**`GET /api/pulse/simulate`** retorna `{ ok: true, status: "pulse-local-route-ready" }` (health check sem executar nada).

---

## Como o Botão Funciona

**Componente:** `PulseLocalExperimentPanel`  
**Localização na tela:** abaixo do `DynamicPatientStatePanel`, acima dos checklists  
**Condição de exibição:** APENAS quando `caso.identificacao.caseId === "dynamic-asthma-severe-adult-001"`

**Comportamento:**
1. Estado inicial: botão "Rodar Pulse local experimental"
2. Ao clicar: `fetch POST /api/pulse/simulate` → estado "loading" → "⏳ Rodando Pulse local... pode levar até 30s"
3. Em sucesso: painel com SpO₂, FC, FR, PA, ausculta, trabalho respiratório, warnings
4. Em erro: "Pulse local indisponível. Fluxo MEDIX rule-based preservado." + error/warnings

**O painel NÃO altera o estado da simulação principal.** É puramente comparativo.

---

## Produção / Render — Fallback

Na Render (sem PyPulse compilado):
1. `POST /api/pulse/simulate` chama `runPulseLocalAsthmaSimulation()`
2. O wrapper detecta que Python binary não existe ou PyPulse não importa
3. Retorna `{ ok:false, fallbackRecommended:true, error: "..." }` com HTTP 503
4. O build **NÃO quebra** (nenhum import de PyPulse no código TS — apenas subprocess Python)
5. A tela exibe "Pulse local indisponível. Fluxo MEDIX rule-based preservado."
6. O fluxo principal da simulação continua sem interrupção

---

## Confirmações

| Item | Status |
|---|---|
| `simulationProvider` dos casos = `"medix-rule-based"` | ✅ Inalterado |
| Provider dos casos NÃO trocado para `"pulse-local"` | ✅ |
| OSCE principal (`app/caso/[id]`) não alterado | ✅ |
| `app/faca-o-osce`, `app/treinamento` não alterados | ✅ |
| `CasoCard.tsx`, `PainelGerarCaso.tsx` não alterados | ✅ |
| UI global (sidebar, layout, cores, tipografia) não alterada | ✅ |
| Botão aparece APENAS no caso de Asma Grave | ✅ |
| PatientState do Pulse NÃO aplicado ao fluxo principal | ✅ |
| Build passa em produção (sem Pulse local) | ✅ |
| `.reference-local` não versionado | ✅ |
| Sem commit | ✅ |

---

## Resultados das Validações

| Script | Critérios | Resultado |
|---|---|---|
| `testar-pulse-api-route-local.ts` | 16/16 | ✅ |
| `testar-pulse-local-runner-asthma.ts` | 13/13 | ✅ |
| `testar-pulse-real-output-reader.ts` | 18/18 | ✅ |
| `testar-pulse-adapter-asthma.ts` | 15/15 | ✅ |
| `validar-dynamic-osce.ts` | Todos | ✅ |
| `tsc --noEmit` | Sem erros | ✅ |
| `npm run build` | Sucesso | ✅ |

---

## Limitações

1. **Apenas asma:** `conditionId "asthma-severe-adult"` é o único suportado.
2. **Local only:** requer o PyPulse compilado na Fase 9 — não funciona no Render.
3. **Latência:** ~25s para rodar (9s init + 15s advance). Sem cache.
4. **Botão visível sempre:** o botão aparece mesmo quando Pulse não está disponível — o erro é tratado graciosamente.
5. **Sem autenticação na route:** a API está aberta para qualquer request (aceitável para beta local).

---

## Recomendação para Fase 12

1. **Cache do estado inicializado:** reutilizar o engine entre chamadas (subprocess persistente ou state file) para reduzir latência de 25s → <5s.
2. **Autenticação:** adicionar header de token simples para proteger a route em staging/produção.
3. **Casos adicionais:** implementar `conditionId: "dpoc-exacerbado-adult"` com `pulse_dpoc_runner.py`.
4. **Diff visual:** mostrar comparação lado a lado entre vitais MEDIX e vitais Pulse.
5. **Ativar provider:** quando latência < 5s, considerar trocar `simulationProvider` do caso piloto para `"pulse-local"`.
