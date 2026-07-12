# Relatório — Casos OSCE Dinâmicos Beta · Fase 7 — Pulse Real Local

## Arquivos criados

| Arquivo | Ação |
|---------|------|
| `lib/dynamic-osce/pulse/pulse-local-discovery.ts` | **Criado** — `discoverLocalPulseInstallation()` |
| `lib/dynamic-osce/pulse/pulse-real-output-reader.ts` | **Criado** — `readPulseOutputFileAsRawOutput()` |
| `lib/dynamic-osce/scripts/descobrir-pulse-local.ts` | **Criado** — script de diagnóstico |
| `lib/dynamic-osce/scripts/testar-pulse-real-output-reader.ts` | **Criado** — 18 critérios |
| `RELATORIO-CASOS-DINAMICOS-BETA-FASE7-PULSE-REAL-LOCAL.md` | **Criado** — este arquivo |

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `lib/dynamic-osce/pulse/index.ts` | +2 exports (discovery + reader) |
| `lib/dynamic-osce/README-DYNAMIC-OSCE.md` | +seção Fase 7 (descoberta, reader, Fase 8) |

---

## Instalação Pulse encontrada

| Campo | Valor |
|-------|-------|
| Root | `.reference-local/engine-stable` |
| Python API | `.../src/python/pulse` |
| Total de cenários | **226** |
| Cenários de asma | **7** |
| HowTo files | 93 |
| PyPulse compilado | **❌ NÃO** — precisa de build C++ |
| Executável | `bin/run.sh` + Python HowTos |

---

## Cenários de asma disponíveis

| Cenário | Localização | Severidade | Relevância |
|---------|-------------|-----------|------------|
| `AsthmaAttackSevereAcute.json` | `scenarios/patient/` | 0.75 | **★★★ Recomendado** — PAC grave OSCE |
| `AsthmaAttack.json` | `scenarios/showcase/` | 0.70 | **★★☆** — Inclui albuterol + inhaler |
| `AsthmaAttackLifeThreateningAcute.json` | `scenarios/patient/` | - | **★★☆** — Risco de vida |
| `AsthmaAttackModerateAcute.json` | `scenarios/patient/` | - | ★☆☆ — Menos grave |
| `AsthmaAttackDeath.json` | `scenarios/miscellaneous/` | - | ★☆☆ — Fatal (estudo de limite) |
| `BronchoconstrictionDeath.json` | `scenarios/miscellaneous/` | - | ★☆☆ — Broncospasmo puro |
| `BronchoConstrictionVaried.json` | `scenarios/patient/` | - | ★☆☆ — Variado |

---

## Comando provável de execução (pós-compilação)

```bash
# Pré-requisito: PyPulse compilado
cd .reference-local/engine-stable/bin
PYTHONPATH=../src/python python3 ../src/python/pulse/howto/HowTo_AsthmaAttack.py
```

Ou via cenário direto (requer PulseScenarioDriver compilado ou runner Python):

```python
from pulse.engine.PulseEngine import PulseEngine
from pulse.cdm.patient_actions import SEAsthmaAttack

pulse = PulseEngine(data_root_dir="./")
pulse.serialize_from_file("./states/StandardMale@0s.json", None)

attack = SEAsthmaAttack()
attack.get_severity().set_value(0.75)  # AsthmaAttackSevereAcute
pulse.process_action(attack)
pulse.advance_time_s(30)
results = pulse.pull_data()
```

O `pull_data()` retorna dict de `"FieldName(unit)" → float`.

---

## Formato de output Pulse

### CSV (nativo — formato arquivo)

Cabeçalho: `Time(s),HeartRate(1/min),RespirationRate(1/min),OxygenSaturation(unitless),...`

```
Time(s),HeartRate(1/min),OxygenSaturation(unitless),SystolicArterialPressure(mmHg),...
0.00,68.2,0.990,120.1,...
0.02,68.2,0.990,...
30.0,122.5,0.880,128.0,...   ← última linha usada
```

**Atenção:** `OxygenSaturation` é fração (0–1), não percentual. O reader converte automaticamente.

### JSON (Python API — pull_data())

```json
{
  "HeartRate(1/min)": 122.5,
  "RespirationRate(1/min)": 34.2,
  "OxygenSaturation(unitless)": 0.88,
  "SystolicArterialPressure(mmHg)": 128.0,
  "Aorta-CarbonDioxide-PartialPressure(mmHg)": 42.1
}
```

---

## Mapeamentos do reader

| Header Pulse CSV | Nome PulseRawOutput | Obs. |
|-----------------|---------------------|------|
| `HeartRate(1/min)` | `HeartRate` | |
| `RespirationRate(1/min)` | `RespirationRate` | |
| `OxygenSaturation(unitless)` | `OxygenSaturation` | 0–1 → ×100 |
| `SystolicArterialPressure(mmHg)` | `SystolicArterialPressure` | |
| `DiastolicArterialPressure(mmHg)` | `DiastolicArterialPressure` | |
| `CoreTemperature(degC)` | `CoreTemperature` | |
| `BloodPH(unitless)` | `BloodPH` | |
| `InspiratoryRespiratoryResistance(cmH2O s/L)` | `AirwayResistance` | proxy broncoespasmo |
| `Aorta-CarbonDioxide-PartialPressure(mmHg)` | `ArterialCarbonDioxidePressure` | |
| `Aorta-Oxygen-PartialPressure(mmHg)` | `ArterialOxygenPressure` | |

---

## Resultados dos scripts

### descobrir-pulse-local.ts

```
RESUMO: ✅ Pulse encontrado. 7 cenário(s) de asma disponíveis.
Pronto para Fase 8 (execução real) assim que PyPulse for compilado.
```

### testar-pulse-real-output-reader.ts

```
RESUMO: ✅ TODOS os 18 critérios passaram.
Reader pronto para receber output real do Pulse.
```

### testar-pulse-adapter-asthma.ts (regressão Fase 6)

```
RESUMO: ✅ TODOS os 15 critérios passaram.
```

### validar-dynamic-osce.ts (4 casos)

```
RESUMO: ✅ TODAS as checagens passaram (4 caso(s)).
```

### TypeScript (`npx tsc --noEmit`)

```
(sem saída — 0 erros)
```

### Build (`npm run build`)

```
✓ Compiled successfully
```

---

## Por que Pulse ainda não executa automaticamente

O Pulse é um engine C++ com binding Python (`PyPulse.so`). A compilação requer:
- CMake ≥ 3.12
- Compilador C++17 (GCC 9+, Clang 5+)
- Python 3 + numpy/pandas/matplotlib
- Java JDK 8 (para testes)

O código fonte está completo em `.reference-local/engine-stable`. A compilação não foi feita
nesta fase para manter o escopo focado na descoberta e no reader.

---

## Riscos remanescentes

| Risco | Mitigação |
|-------|-----------|
| Compilação C++ pode falhar (deps, versão) | Tentar Docker com Dockerfile existente |
| SpO₂ fração vs % pode variar por cenário | Reader detecta automaticamente (≤ 1.0 → ×100) |
| `InspiratoryRespiratoryResistance` é proxy imperfeito de broncoespasmo | Bridge usa BronchodilationLevel quando disponível |
| Output CSV de cenário pode ter colunas diferentes | Reader ignora colunas não mapeadas; normalizer aplica fallbacks |
| Estado inicial Pulse (StandardMale) difere do caso OSCE | Ajustar via SEPatientConfiguration ou patch de vitais |

---

## Próximos passos — Fase 8

**Objetivo:** Executar `AsthmaAttackSevereAcute.json` localmente e alimentar o pipeline do reader.

1. **Compilar PyPulse**:
   ```bash
   mkdir .reference-local/engine-stable/build
   cd .reference-local/engine-stable/build
   cmake -DPulse_PYTHON_API=ON -DCMAKE_BUILD_TYPE=Release ..
   make -j4
   ```

2. **Executar cenário**:
   ```bash
   cd .reference-local/engine-stable/bin
   PYTHONPATH=../src/python python3 ../src/python/pulse/howto/HowTo_AsthmaAttack.py
   ```

3. **Capturar CSV de output** e salvar em `/tmp/pulse_asthma_output.csv`.

4. **Alimentar reader**:
   ```typescript
   import { readPulseOutputFileAsRawOutput } from "./pulse-real-output-reader";
   import { normalizePulseOutputs } from "./pulse-output-normalizer";
   import { pulseVitalsToPatientState } from "./pulse-medix-bridge";

   const { raw } = readPulseOutputFileAsRawOutput("/tmp/pulse_asthma_output.csv");
   const { normalized } = normalizePulseOutputs(raw);
   const { patientState } = pulseVitalsToPatientState({ currentState: estadoInicial, normalized });
   // → PatientState real do Pulse integrado ao MEDIX
   ```

5. **Comparar** PatientState real vs fixture da Fase 6 — validar divergências.

---

## Confirmação de isolamento

Não foram tocados: `data/casos-v2`, `lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`,
`app/treinamento`, ECG, exames, dashboard, feedback, AppShell, AppSidebar.
Casos dinâmicos existentes (asma, pneumotórax, DPOC, pneumonia) não foram alterados.
Fase 6 continua passando integralmente.
Nenhuma dependência nova. Pulse real NÃO executado. Sem commit.
