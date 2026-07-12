# RELATÓRIO — Casos Dinâmicos Beta · Fase 10: Pulse Local Runner

**Data:** 2026-07-12  
**Fase:** 10 — Subprocess Python isolado + wrapper TypeScript  
**Status:** ✅ CONCLUÍDA

---

## Arquivos Criados

| Arquivo | Tipo | Propósito |
|---|---|---|
| `lib/dynamic-osce/pulse-local/pulse_asthma_runner.py` | Python | Runner persistente — inicializa PyPulse, aplica AsthmaAttack, avança tempo, gera CSV |
| `lib/dynamic-osce/pulse-local/pulse-local-runner.ts` | TypeScript | Wrapper — chama Python via `child_process.spawn`, lê CSV, converte em PatientState |
| `lib/dynamic-osce/pulse-local/index.ts` | TypeScript | Exportações públicas do módulo |
| `lib/dynamic-osce/scripts/testar-pulse-local-runner-asthma.ts` | TypeScript | Script de validação da Fase 10 (13 critérios) |

---

## Como o Python Runner Funciona

**Script:** `lib/dynamic-osce/pulse-local/pulse_asthma_runner.py`

1. Aceita argumentos CLI: `--severity`, `--duration`, `--output`, `--engine-root`
2. Resolve o engine root via argumento → `PULSE_ENGINE_ROOT` env → fallback por inferência do path do script
3. Adiciona ao `sys.path`: `build/install/lib`, `build/install/python`, `src/python`
4. Importa `PyPulse` (C extension) — falha com exit code 2 se não encontrado
5. Cria `PulseEngine`, `SEPatientConfiguration` (male, 44a, 77kg, 177cm)
6. Define 7 data requests: HR, SBP, DBP, RR, SpO₂, TidalVolume, EndTidalCO₂
3. Chama `initialize_engine()` (~9s de estabilização)
4. Aplica `SEAsthmaAttack` com `severity` especificado
5. Avança `duration` segundos (`advance_time_s()`)
6. Imprime JSON em stdout:
   ```json
   {
     "ok": true,
     "outputCsv": "/tmp/pulse_medix_asthma_<ts>.csv",
     "duration_s": 580.0,
     "severity": 0.75,
     "engineRoot": "...",
     "baselineVitals": {...},
     "finalVitals": {...}
   }
   ```
7. Exit codes: 0=sucesso, 1=engine não encontrado, 2=PyPulse não importa, 3=módulos Python falham, 4=initialize_engine() falhou

---

## Como o TS Wrapper Chama o Python

**Arquivo:** `lib/dynamic-osce/pulse-local/pulse-local-runner.ts`

```
runPulseLocalAsthmaSimulation({ conditionId, severity, duration_s })
  ├─ Valida conditionId (só "asthma-severe-adult")
  ├─ Valida pré-requisitos (Python bin, script py, engine root)
  ├─ Gera csvPath único: /tmp/pulse_medix_asthma_<timestamp>.csv
  ├─ spawn(python3.9, [script, --severity, --duration, --output, --engine-root], {
  │    env: { PYTHONPATH, PULSE_ENGINE_ROOT, ...process.env }
  │  })
  ├─ Timeout configurável (padrão 45s, teste usa 120s)
  ├─ Se exit != 0 → { ok:false, fallbackRecommended:true, error, warnings }
  ├─ Parseia JSON do stdout
  ├─ readPulseOutputFileAsRawOutput(csvPath) → PulseRawOutput
  ├─ normalizePulseOutputs(raw) → PulseNormalizedVitals
  ├─ pulseVitalsToPatientState({ currentState: estadoInicial, normalized }) → PatientState
  └─ → { ok:true, provider:"pulse-local", csvPath, raw, normalized, patientState, warnings }
```

**Sem shell=true.** Subprocess direto com `spawn`, sem interpolação de string de comando.

---

## Paths Usados

| Variável | Valor | Override |
|---|---|---|
| `PYTHON_BIN` | `/Applications/Xcode.app/.../Python3.framework/Versions/3.9/bin/python3.9` | `PULSE_PYTHON_BIN` env |
| `ENGINE_ROOT` | `<CWD>/.reference-local/engine-stable` | `--engine-root` arg ou `PULSE_ENGINE_ROOT` env |
| `PYTHONPATH` | `ENGINE_ROOT/build/install/lib:ENGINE_ROOT/build/install/python:ENGINE_ROOT/src/python` | via env do subprocess |
| CSV output | `/tmp/pulse_medix_asthma_<timestamp>.csv` | `--output` arg |

---

## Resultados da Simulação (Fase 10)

Asthma severity=0.75, duration=580s, wall clock ~24s:

| Parâmetro | Valor |
|---|---|
| SpO₂ | 94.9% (baseline: 97.4%) |
| FR | 18.9 irpm (baseline: 12.0) |
| FC | 74.2 bpm |
| PAS | 114.6 mmHg |
| TidalVolume | 309.8 mL (baseline: 526.9) |

**PatientState gerado:**
- `vitals.spo2` = 95%
- `broncoespasmo` = 80
- `clinical.ausculta` = "sibilos difusos intensos, murmúrio vesicular reduzido"
- `clinical.trabalhoRespiratorio` = "muito aumentado"
- `clinical.estadoGeral` = "mais confortável, respondendo ao tratamento"

---

## Fallback Behavior

Se qualquer etapa falhar (Python não encontrado, PyPulse não importa, timeout, etc.), o wrapper retorna:
```typescript
{
  ok: false,
  provider: "pulse-local",
  fallbackRecommended: true,
  error: "mensagem descritiva",
  warnings: [...]
}
```

O chamador pode usar `fallbackRecommended` para ativar o `medix-rule-based` como fallback automático.

---

## Validações Executadas

| Script | Critérios | Resultado |
|---|---|---|
| `testar-pulse-local-runner-asthma.ts` (Fase 10) | 13/13 | ✅ |
| `testar-pulse-real-asthma-local.ts` (CSV real) | 14/14 | ✅ |
| `testar-pulse-real-output-reader.ts` | 18/18 | ✅ |
| `testar-pulse-adapter-asthma.ts` | 15/15 | ✅ |
| `validar-dynamic-osce.ts` | Todos | ✅ |
| `tsc --noEmit` | Sem erros | ✅ |
| `npm run build` | Sucesso | ✅ |

---

## Confirmações

| Item | Status |
|---|---|
| `simulationProvider` dos casos = `"medix-rule-based"` | ✅ Inalterado |
| UI não foi alterada | ✅ Zero arquivos de componente tocados |
| Nenhuma rota API criada | ✅ `app/api/pulse/` não existe |
| `.reference-local` não entrou no Git | ✅ Protegido por `.git/info/exclude` |
| Binários, `.so`, CSV, logs não versionados | ✅ |
| `app/treinamento`, `CasoCard`, `PainelGerarCaso` inalterados | ✅ |
| Output CSV em `/tmp/` (não no app) | ✅ |
| Sem commit | ✅ |

---

## Recomendação para Fase 11

**API route server-side:** Criar `app/api/pulse/simulate/route.ts` que:
1. Aceita `POST { conditionId, severity, duration_s }`
2. Chama `runPulseLocalAsthmaSimulation()` internamente
3. Retorna `{ patientState, normalized, csvPath, warnings }`
4. Adiciona autenticação básica (apenas requests do próprio app)

**Ativação do provider:** Quando a API estiver estável, adicionar `"pulse-local"` como opção em `SimulationProvider` e trocar o provider do caso piloto.

**Casos adicionais:** Implementar `pulse_dpoc_runner.py` e `pulse_pneumonia_runner.py` com o mesmo padrão da Fase 10.
