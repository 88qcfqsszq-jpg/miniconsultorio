# RELATÓRIO — Casos Dinâmicos Beta · Fase 9: PyPulse Build Local

**Data:** 2026-07-12  
**Fase:** 9 — Pulse Physiology Engine Local (PyPulse)  
**Status:** ✅ CONCLUÍDA

---

## Objetivo

Executar o Pulse Physiology Engine v4.3.2 localmente via bindings Python (PyPulse) para gerar dados fisiológicos reais de asma grave, validando a pipeline completa: Pulse → CSV → MEDIX PatientState.

---

## Crash SIGSEGV — Root Cause & Fix

### Sintoma
`advance_time_s()` causava `SIGSEGV` (exit code 139) imediatamente na primeira chamada após `initialize_engine()` completar com sucesso.

### Diagnóstico
**Localizado via macOS crash report** (`~/Library/Logs/DiagnosticReports/Python-2026-07-12-*.ips`):

```
EXC_BAD_ACCESS KERN_INVALID_ADDRESS at 0x0000000000000000
pulse::GastrointestinalModel::PreProcess() [symbolLocation:448]
pulse::Controller::PreProcess()
pulse::Controller::AdvanceModelTime()
PhysiologyEngineThunk::AdvanceTimeStep()
```

### Root Cause

`m_StomachContents` (`SENutrition*` em `SEGastrointestinalSystem`) permanecia `nullptr` porque:

1. `PulseConfiguration.json` está vazio (`{}`) → `initialstomachcontentsfile` não configurado
2. `HasDefaultStomachContents()` retorna `false`
3. `GastrointestinalModel::Initialize()` nunca chamava `GetStomachContents()` (lazy-allocator)
4. `m_StomachContents` permanecia `nullptr`
5. Primeiro avanço em estado `Active` → `DigestStomachNutrients()` → `m_StomachContents->GetWater()` → **SIGSEGV**

O `else` branch (estabilização, non-Active) **nunca acessa `m_StomachContents`**, o que explica por que a estabilização era bem-sucedida.

### Fix Aplicado

**Arquivo:** `src/cpp/engine/common/system/physiology/GastrointestinalModel.cpp`

```cpp
// Initialize() — garante que m_StomachContents é sempre alocado
void GastrointestinalModel::Initialize() {
    Model::Initialize();
    GetStomachContents(); // ← FIX: força alocação (lazy-allocator)
    if (m_data.GetConfiguration().HasDefaultStomachContents())
        GetStomachContents().Copy(*m_data.GetConfiguration().GetDefaultStomachContents());
}

// DigestStomachNutrients() — guard defensivo para path de load-from-file
void GastrointestinalModel::DigestStomachNutrients(double duration_s) {
    if (duration_s <= 0 || m_StomachContents == nullptr)  // ← FIX: null guard
        return;
    ...
}
```

**Rebuild:** `make -j4` no `build/Innerbuild/` + `make install` → `PyPulse.cpython-39-darwin.so` atualizado.

---

## Resultados da Simulação — Asma Grave (severity=0.75, 580s)

| Parâmetro | Basal | Após 580s asma |
|-----------|-------|----------------|
| FC (bpm) | 72.0 | 74.2 |
| PAS (mmHg) | 114.2 | 114.6 |
| PAD (mmHg) | 73.6 | 75.0 |
| FR (irpm) | 12.0 | **18.9** |
| SpO₂ | 97.4% | **94.9%** |
| Volume corrente (mL) | 526.9 | **309.8** |

**Interpretação clínica:** Taquipneia (12→19 irpm), hipoxemia moderada (97.4→94.9%), redução severa do volume corrente (527→310 mL) — compatíveis com broncoespasmo grave.

**CSV gerado:** `/tmp/pulse_fase9_asthma_output.csv` — 29001 linhas, 2.2 MB, 0.02s por time step.

---

## Validações Executadas

### ETAPA 1 — Fix do SIGSEGV
- ✅ `advance_time_s(1)` com exit code 0 (antes: exit 139)

### ETAPA 8 — Simulação AsthmaAttack
- ✅ `process_action(SEAsthmaAttack, severity=0.75)` sem erro
- ✅ `advance_time_s(580)` concluído em 14.6s wall clock

### ETAPA 9 — CSV Output
- ✅ `/tmp/pulse_fase9_asthma_output.csv` gerado (29001 linhas, 2.2MB)
- ✅ Headers: `Time(s),HeartRate(1/min),SystolicArterialPressure(mmHg),...`
- ✅ Última linha: `580.00,74.19,114.58,74.99,18.87,0.949,309.85,0.052`

### ETAPA 10 — Pipeline MEDIX
- ✅ **14/14 critérios aprovados** em `testar-pulse-real-asthma-local.ts`
- ✅ `readPulseOutputFileAsRawOutput` detectou formato CSV
- ✅ SpO₂ convertida de fração Pulse (0.949) → % (94.9%)
- ✅ `normalizePulseOutputs` + `pulseVitalsToPatientState` funcionando
- ✅ `recomputarClinica` gerou estado clínico coerente
- ✅ `simulationProvider === "medix-rule-based"` preservado

### ETAPA 11 — Build do App
- ✅ `tsc --noEmit` — sem erros de tipo
- ✅ `npm run build` — build de produção concluído

---

## Fixes Acumulados na Fase 9

| Arquivo modificado | Fix |
|---|---|
| `substances/Glucose.json` | Adicionado `RenalClearance.Regulation` com `TransportMaximum=375 mg/min` |
| `substances/*.json` (drogas inativas) | Removido `SystemicClearance` de 17 substâncias para evitar crash no DrugModel |
| `substances/Calcium.json` | Removido `Regulation` block (causava crash em `CalculateGlomerularTransport`) |
| `substances/Albumin.json` | Idem |
| `substances/Acetoacetate.json` | Idem |
| `substances/Lactate.json` | Removido `Regulation` desnecessário |
| **`GastrointestinalModel.cpp`** | **Fix principal:** `GetStomachContents()` em `Initialize()` + null guard em `DigestStomachNutrients()` |

---

## Próximos Passos

- **Fase 10:** Integrar engine Pulse (via subprocess seguro ou via API) na pipeline OSCE dinâmica
- **Fase 10:** Casos adicionais: sepse, DPOC, choque hemorrágico
- **Produção:** Substituir `simulationProvider: "medix-rule-based"` por `"pulse-local"` quando Pulse real for integrado ao server-side da app
