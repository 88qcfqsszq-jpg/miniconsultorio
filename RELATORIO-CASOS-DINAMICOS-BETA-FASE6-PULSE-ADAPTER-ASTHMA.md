# Relatório — Casos OSCE Dinâmicos Beta · Fase 6 — Pulse Adapter Experimental (Asma Grave)

## Arquivos criados

| Arquivo | Ação |
|---------|------|
| `lib/dynamic-osce/pulse/pulse-output-normalizer.ts` | **Criado** — tipos PulseRawOutput/PulseNormalizedVitals + normalizePulseOutputs |
| `lib/dynamic-osce/pulse/pulse-medix-bridge.ts` | **Criado** — pulseVitalsToPatientState (bridge com recomputarClinica) |
| `lib/dynamic-osce/pulse/pulse-fixtures-asthma.ts` | **Criado** — 3 snapshots estáticos asma grave |
| `lib/dynamic-osce/pulse/pulse-experimental-adapter.ts` | **Criado** — ponto de entrada único (fixture → PatientState) |
| `lib/dynamic-osce/scripts/testar-pulse-adapter-asthma.ts` | **Criado** — 15 critérios de aceitação |
| `RELATORIO-CASOS-DINAMICOS-BETA-FASE6-PULSE-ADAPTER-ASTHMA.md` | **Criado** — este arquivo |

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `lib/dynamic-osce/pulse/index.ts` | +3 exports para novos módulos Fase 6 |
| `lib/dynamic-osce/README-DYNAMIC-OSCE.md` | +seção Fase 6 (pipeline, arquivos, comandos, invariantes) |

---

## Objetivo da Fase 6

Validar o **contrato do bridge Pulse→MEDIX** usando fixtures estáticas (snapshots sintéticos de
output Pulse), **antes** de qualquer integração real. O Pulse real não executa, não há rede, não há
processo externo, não há dependência nova. O provider em execução permanece `medix-rule-based`.

---

## Pipeline de conversão

```
PulseRawOutput                    (dict bruto: nomes reais do Pulse → valores)
  ↓ normalizePulseOutputs()
PulseNormalizedVitals             (nomes canônicos; essenciais garantidos por fallback)
  ↓ pulseVitalsToPatientState()
PatientState                      (vitals + broncoespasmo mapeado)
  ↓ recomputarClinica()           (chamado internamente na bridge)
PatientState.clinical             (texto clínico recalculado pelo motor MEDIX)
```

---

## Módulos criados

### `pulse-output-normalizer.ts`

| Item | Descrição |
|------|-----------|
| `PulseRawOutput` | `Record<string, number \| string \| boolean \| undefined>` |
| `PulseNormalizedVitals` | Interface com 6 campos essenciais (required) + 7 opcionais |
| `normalizePulseOutputs()` | Mapeia nomes Pulse → canônicos; aplica fallbacks seguros; retorna `{ normalized, warnings, usedFallbacks }` |
| Fallbacks | FC=80, FR=16, SpO₂=95, PA 120/75, Temp=37,0°C |
| Valores string/boolean | Ignorados pelo normalizador (não causam erro) |

Mapeamentos incluídos: `HeartRate`, `RespirationRate`, `OxygenSaturation`,
`SystolicArterialPressure`, `DiastolicArterialPressure`, `BodyTemperature`/`CoreTemperature`,
`BloodPH`, `ArterialCarbonDioxidePressure`, `ArterialOxygenPressure`,
`BronchodilationLevel`, `AirwayResistance`, `RespiratoryMusclePressure`, `TimestampSec`.

### `pulse-medix-bridge.ts`

| Item | Descrição |
|------|-----------|
| `pulseVitalsToPatientState()` | Converte `PulseNormalizedVitals` → `PatientState` |
| Broncoespasmo | Derivado de `BronchodilationLevel` (preferido): `100 - nivel`. Fallback: `AirwayResistance` (linear 2–20 cmH₂O/L/s). Fallback final: mantém valor do estado atual. |
| Spread de estado | Preserva todos os campos opcionais do estado atual (marcadores de condição, booleans de intervenção, `tempoDecorridoMin`) |
| `recomputarClinica()` | Chamado para recalcular `estadoGeral`, `ausculta`, `trabalhoRespiratorio`, `fala`, `perfusao` a partir dos novos números |

### `pulse-fixtures-asthma.ts`

Três snapshots de `PulseRawOutput` para o caso piloto (`dynamic-asthma-severe-adult-001`):

| Fixture | SpO₂ | FC | FR | BronchodilationLevel | broncoespasmo resultante |
|---------|------|----|----|----------------------|--------------------------|
| `PULSE_FIXTURE_ASTHMA_BASELINE` | 88% | 122 | 34 | 20 | 80 |
| `PULSE_FIXTURE_ASTHMA_AFTER_OXYGEN` | 93% | 118 | 31 | 22 | 78 |
| `PULSE_FIXTURE_ASTHMA_AFTER_BRONCHODILATOR` | 96% | 110 | 24 | 65 | 35 |

Nota: `AirwayResistance: "alto"` no baseline é valor qualitativo (string → ignorado pelo
normalizador; `BronchodilationLevel` é o campo efetivo para broncoespasmo).

### `pulse-experimental-adapter.ts`

| Item | Descrição |
|------|-----------|
| `applyPulseExperimentalSnapshot()` | Entrada única; recebe `caseId + currentState + rawSnapshot` |
| Casos suportados | Apenas `dynamic-asthma-severe-adult-001` nesta fase |
| caseId inválido | Retorna estado inalterado + warning, sem exceção |
| Invariante runtime | `if (PULSE_EXECUTION_ENABLED) throw` — nunca deve rodar com Pulse real |
| `source` | Sempre `"pulse-fixture"` — rastreabilidade no log |

---

## Resultados de validação

### Teste Fase 6 (npx tsx lib/dynamic-osce/scripts/testar-pulse-adapter-asthma.ts)

```
======================================================================
TESTE: Pulse Adapter Experimental — Asma Grave (Fase 6)
======================================================================

── Critério 1 — PULSE_EXECUTION_ENABLED ────────────────────────────────────────
  ✅ PULSE_EXECUTION_ENABLED é false

── Critério 2 — caseId inválido ────────────────────────────────────────────────
  ✅ Estado não alterado para caseId inválido
  ✅ Warning menciona o caseId inválido

── Critérios 3–4 — Snapshot BASELINE ──────────────────────────────────────────
     SpO₂=88%  FC=122  FR=34  bronco=80
  ✅ Baseline SpO₂ = 88%
  ✅ Baseline FC = 122 bpm
  ✅ Baseline FR = 34 irpm
  ✅ Baseline broncoespasmo = 80 (100 − 20)

── Critérios 5–6 — Snapshot APÓS OXIGÊNIO ─────────────────────────────────────
     SpO₂=93%  FC=118  FR=31  bronco=78
  ✅ SpO₂ sobe após O₂ (88% → 93%)
  ✅ Broncoespasmo = 78 após O₂ (100 − 22)

── Critérios 7–9 — Snapshot APÓS BRONCODILATADOR ──────────────────────────────
     SpO₂=96%  FC=110  FR=24  bronco=35
  ✅ SpO₂ mantém melhora após BD (93% → 96%)
  ✅ Broncoespasmo reduz após BD (80 → 35)
  ✅ FR reduz após BD (34 → 24 irpm)

── Critérios 10–11 — Texto clínico recalculado ─────────────────────────────────
  ✅ clinical.ausculta preenchido: "sibilos esparsos, murmúrio audível..."
  ✅ clinical.trabalhoRespiratorio: "aumentado"

── Critério 12 — simulationProvider inalterado ─────────────────────────────────
  ✅ simulationProvider permanece medix-rule-based

======================================================================
RESUMO: ✅ TODOS os 15 critérios passaram.
Pulse adapter experimental validado para o caso de asma grave.
======================================================================
```

### Validação geral (npx tsx lib/dynamic-osce/scripts/validar-dynamic-osce.ts)

```
RESUMO: ✅ TODAS as checagens passaram (4 caso(s)).
```

### TypeScript (npx tsc --noEmit)

```
(sem saída — 0 erros)
```

### Build (npm run build)

```
✓ Compiled successfully
```

---

## O que o bridge NÃO faz (escopo desta fase)

| Fora do escopo | Motivo |
|----------------|--------|
| Executar o Pulse real | `PULSE_EXECUTION_ENABLED = false`; nenhum child_process |
| Modificar marcadores de condição (infeccaoPulmonar, retencaoCO2, etc.) | Esses campos vêm do caso, não do Pulse nesta fase |
| Calcular rubrica ou nota OSCE | Motor de feedback MEDIX inalterado |
| Suportar outros casos além da asma | Lista explícita — pneumotórax, DPOC, pneumonia aguardam fixtures validadas |
| Evolução temporal contínua | Estado ainda evolui por ação (clique), não por tempo |

---

## Próximos passos sugeridos (pós-Fase 6)

1. **Fixtures para pneumotórax, DPOC, pneumonia** — adicionar a `CASOS_SUPORTADOS_EXPERIMENTAL` após criar e validar cada conjunto.
2. **Campos opcionais via Pulse** — mapear `infeccaoPulmonar` e `retencaoCO2` quando o Pulse modelar esses estados (ex.: consolidação → `infeccaoPulmonar` calculada).
3. **Integração real** — quando `PULSE_EXECUTION_ENABLED = true`, substituir fixture por snapshot real em `applyPulseExperimentalSnapshot`; a pipeline downstream não muda.
4. **Evolução temporal** — avaliar ticker de tempo para evolução contínua sem ação do aluno.

---

## Confirmação de isolamento

Não foram tocados: `data/casos-v2`, `lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`,
`app/treinamento`, ECG, laboratório, exames, dashboard, feedback principal, AppShell, AppSidebar.
Casos existentes (asma, pneumotórax, DPOC, pneumonia) não foram alterados; validam corretamente.

Nenhuma dependência nova. Pulse real não integrado. Sem commit.
