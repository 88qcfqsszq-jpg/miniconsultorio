# HealthBench Engine — Fase 2: Camada Backend Central de Tentativa OSCE

**Data:** 24 de junho de 2026
**Status:** ✅ Implementada e testada
**Objetivo:** Transformar o backend para que toda tentativa OSCE seja representada por um objeto central HealthBench-compatible, persistido e reutilizável — com o HealthBench como fonte oficial de avaliação e o `/api/corrigir` preservado como fallback temporário.

---

## 1. Contexto e decisão de arquitetura

A Fase 1 entregou o motor de avaliação (`lib/healthbench/*`), o endpoint técnico `/api/healthbench/evaluate` e o painel de feedback. O HealthBench rodava em paralelo ao feedback antigo.

A Fase 2 separa os papéis:

- **`/api/healthbench/evaluate`** → endpoint **técnico** (apenas avalia um atendimento).
- **`/api/osce/finalizar`** → endpoint **de produto** (finaliza a tentativa OSCE inteira: monta, avalia, compara com legado, persiste e retorna objeto unificado).

O `/api/corrigir` (legado) **não foi alterado** e permanece como fallback.

---

## 2. Auditoria prévia (sem duplicação)

Antes de codar, foram confirmados os exports existentes em `lib/healthbench/` para reúso:

- `evaluateHealthBenchAttempt(input, caso, opts)` → `HealthBenchEvaluationResult`
- `normalizarTranscript()`, `transcriptParaTexto()`
- `adaptarRubricaDoCaso(caso)`
- `calcularScore`, `calcularMetrics`, `construirFeedbackProfessor`
- `salvarTentativa` / `listarTentativasEmMemoria` (result-writer técnico)
- analytics: `mediaPorCompetencia`, `mediaPorTema`, `errosCriticosRecorrentes`, `evolucaoPorTentativa`, `casosComPiorDesempenho`

A camada nova **reaproveita** essas funções; não recria rubrica, transcript nem score.

---

## 3. Arquivos criados (7)

### Camada central — `lib/healthbench/`
| Arquivo | Conteúdo |
|---|---|
| `attempt-schema.ts` | Tipos oficiais: `OSCEAttemptInput`, `OSCEAttemptEvent`, `OSCEAttemptSnapshot`, `OSCEAttemptFinalPayload`, `HealthBenchAttemptRecord`, `LegacyCorrectionNormalized`, `LegacyVsHealthBenchComparison` + `normalizarModo()` |
| `attempt-builder.ts` | `construirSnapshot()` (transcript + eventos + metadados, reusa `normalizarTranscript`), `snapshotParaAtendimentoInput()`. Converte canais de imagem/ECG em contexto de transcript |
| `attempt-store.ts` | Persistência única: `saveAttempt`, `getAttempt`, `listAttemptsByCase`, `listAttemptsByStudent`, `listAllAttempts`, `updateAttempt` (memória + arquivo `/tmp` em dev; interface pronta para banco) |
| `legacy-adapter.ts` | `normalizeLegacyCorrectionResult()`, `compareLegacyVsHealthBench()` |

### Endpoints
| Arquivo | Método | Função |
|---|---|---|
| `app/api/osce/finalizar/route.ts` | POST | Endpoint central de produto |
| `app/api/healthbench/attempts/[attemptId]/route.ts` | GET | Recupera tentativa persistida |
| `app/api/healthbench/analytics/route.ts` | GET | Analytics inicial (aceita `?casoId=`) |

---

## 4. Arquivos alterados (1)

| Arquivo | Mudança |
|---|---|
| `app/caso/[id]/page.tsx` | `handleFinalizarAtendimento` chama **primeiro** `/api/osce/finalizar`; em caso de sucesso com `legacyCorrectionResult`, renderiza `FeedbackOSCE` (legado) + `HealthBenchFeedbackPanel`. Se `/api/osce/finalizar` falhar, **cai no fluxo antigo `/api/corrigir`** (fallback intacto). |

> `/api/corrigir`, `FeedbackOSCE`, ECG, Open-i, radiologia e componentes de imagem **não foram tocados**.

---

## 5. Novo fluxo `/api/osce/finalizar`

```
1. valida casoId + carrega caso (casosOSCE)
2. construirSnapshot(input)            → transcript + eventos + metadados (attempt-builder)
3. Promise.allSettled([
     evaluateHealthBenchAttempt(...)   → SOURCE OF TRUTH
     rodarLegado(origin, input)        → /api/corrigir interno (best-effort)
   ])
4. compareLegacyVsHealthBench(...)     → comparação de notas (legacy-adapter)
5. saveAttempt(HealthBenchAttemptRecord) → persistência (attempt-store)
6. retorna objeto unificado
```

### Resiliência
- HealthBench falha + legado ok → retorna **legado** (`sourceOfTruth: "legacy"`).
- Legado falha → retorna **HealthBench** normalmente (`fallbackAvailable: false`).
- Ambos falham → HTTP 500.
- Nunca quebra o fluxo do usuário.

---

## 6. Estrutura do `HealthBenchAttemptRecord` (persistido)

```ts
{
  attemptId, casoId, alunoId?,
  startedAt, finishedAt, mode: "training" | "exam",
  transcript, eventosDoAtendimento,
  soap, diagnosisAndPlan,
  healthBenchResult, legacyCorrectionResult?, comparison?,
  createdAt, updatedAt
}
```

---

## 7. Regras de score (mantidas do HealthBench)

- `max_possible_score` = soma dos `points > 0`
- `achieved_score` = soma dos `points_awarded` (negativos descontam quando `criteria_met=true`)
- `score01 = clamp(achieved / max_possible, 0, 1)`
- `notaFinal = score01 × 20`
- `passed = notaFinal ≥ 17` **e** sem erro crítico negativo cometido

---

## 8. Exemplo de JSON retornado por `/api/osce/finalizar`

```json
{
  "success": true,
  "attemptId": "hb_3_1782324468816_28p79t",
  "casoId": 3,
  "healthBenchResult": {
    "notaFinal": 16, "passed": false, "score01": 0.8,
    "grades": [ /* ... */ ],
    "competencyScores": { "axis:conduta": 1, "axis:seguranca": 0.88, "axis:raciocinio_clinico": 0.22 }
  },
  "legacyCorrectionResult": { "nota": 17, "classificacao": "Excelente" },
  "comparison": {
    "legacyNota": 17, "healthBenchNota": 16, "diferenca": -1,
    "legacyClassificacao": "Excelente", "healthBenchPassed": false,
    "divergenciaSignificativa": false
  },
  "sourceOfTruth": "healthbench",
  "fallbackAvailable": true
}
```

---

## 9. Exemplo de tentativa salva (GET `/api/healthbench/attempts/[attemptId]`)

```json
{
  "attemptId": "hb_3_1782324468816_28p79t",
  "casoId": 3,
  "mode": "exam",
  "startedAt": "2026-06-24T18:08:24.088Z",
  "finishedAt": "2026-06-24T18:08:24.088Z",
  "transcript": [ /* 8 mensagens */ ],
  "eventosDoAtendimento": [ /* 6 eventos */ ],
  "soap": { "subjetivo": "...", "objetivo": "...", "avaliacao": "...", "plano": "..." },
  "diagnosisAndPlan": { "hipotesePrincipal": "Crise asmática", "conduta": "..." },
  "healthBenchResult": { /* ... */ },
  "legacyCorrectionResult": { /* ... */ },
  "comparison": { /* ... */ },
  "createdAt": "2026-06-24T18:08:24.088Z",
  "updatedAt": "2026-06-24T18:08:24.088Z"
}
```

---

## 10. Como testar em localhost

```bash
npm run dev

# 1. Finalizar tentativa (endpoint central)
curl -X POST http://localhost:3000/api/osce/finalizar \
  -H "Content-Type: application/json" \
  -d '{
    "casoId": "3",
    "chatMessages": [{"tipo":"paciente","conteudo":"Falta de ar e chiado."},{"tipo":"estudante","conteudo":"Tem asma? Usou bombinha?"}],
    "physicalExamEvents": [{"categoria":"respiratorio","textDigitado":"ausculta pulmonar","resposta":"Sibilos difusos"}],
    "vitalSignsEvents": {"solicitado": true, "dados": {"frequenciaRespiratoria": 32, "saturacaoO2": 91}},
    "examRequests": [],
    "diagnosisAndPlan": {"hipotesePrincipal":"Crise asmática","diagnosticosDiferenciais":["DPOC"],"examesIndicados":["RX tórax"],"conduta":"Salbutamol e corticoide"},
    "soap": {"subjetivo":"...","objetivo":"...","avaliacao":"Crise asmática moderada","plano":"..."},
    "mode": "exam"
  }'

# 2. Recuperar tentativa
curl http://localhost:3000/api/healthbench/attempts/<attemptId>

# 3. Analytics
curl http://localhost:3000/api/healthbench/analytics
curl "http://localhost:3000/api/healthbench/analytics?casoId=3"
```

### Resultados dos testes executados
| Teste | Resultado |
|---|---|
| `POST /api/osce/finalizar` (caso 3) | ✅ HB 16 + legado 17 + comparison; `sourceOfTruth: "healthbench"`, `fallbackAvailable: true` |
| `GET /api/healthbench/attempts/[id]` | ✅ transcript (8), eventos (6), ambos resultados, timestamps |
| `GET /api/healthbench/analytics` | ✅ 3 tentativas agregadas, médias por competência/tema |
| `POST /api/healthbench/evaluate` | ✅ 200 (continua funcionando) |
| `POST /api/corrigir` | ✅ 200 (preservado, não alterado) |
| `POST /api/osce/finalizar` caso `9999` | ✅ HTTP 404 limpo |
| `tsc --noEmit` nos arquivos novos | ✅ 0 erros |

---

## 11. Logs identificáveis

`[OSCE FINALIZAR]`, `[HEALTHBENCH ATTEMPT BUILDER]`, `[HEALTHBENCH ATTEMPT STORE]`, `[HEALTHBENCH LEGACY ADAPTER]`, `[HEALTHBENCH ANALYTICS]` — todos confirmados em runtime.

---

## 12. Confirmações de escopo

- ✅ **`/api/corrigir` preservado** — `git diff` vazio.
- ✅ **`FeedbackOSCE` não removido** — continua sendo renderizado.
- ✅ **ECG, Open-i, radiologia, exame físico visual e componentes de imagem não foram tocados** nesta fase. O único arquivo de produto alterado é `app/caso/[id]/page.tsx`. (Marcas `M` em `lib/radiology/*` e `src/services/ecgGenerator/index.ts` no `git status` são pré-existentes de tarefas anteriores.)
- ✅ Arquivos novos da Fase 2: **0 erros de tipo**.

> **Pendência pré-existente (fora de escopo):** `npm run build` completo ainda falha no type-check pelo erro antigo de ECG em `src/services/ecgGenerator/leadTransform.ts:286`. O app compila e o dev server funciona normalmente.

---

## 13. Pendências para a Fase 3

1. **Persistência real (banco)** substituindo memória/`/tmp` no `attempt-store` (interface já pronta).
2. **UI de comparação** legado vs HealthBench e **dashboard** consumindo `/api/healthbench/analytics`.
3. **Migração** do `FeedbackOSCE` para consumir `healthBenchResult` como fonte principal e aposentar gradualmente o `/api/corrigir`.
4. **`alunoId` real** (hoje opcional) para `listAttemptsByStudent` e evolução por aluno.
5. **Meta-avaliação humana** (`meta-evaluator.ts`) com coleta de rótulos médicos e cálculo de concordância.
