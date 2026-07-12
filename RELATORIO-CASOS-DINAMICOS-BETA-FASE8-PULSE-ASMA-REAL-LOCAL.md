# Relatório — Casos OSCE Dinâmicos Beta · Fase 8 — Teste Real Local do Pulse (Asma Grave)

## Arquivo criado

| Arquivo | Ação |
|---------|------|
| `lib/dynamic-osce/scripts/testar-pulse-real-asthma-local.ts` | **Criado** — pipeline Pulse→MEDIX (real ou sintético) |
| `RELATORIO-CASOS-DINAMICOS-BETA-FASE8-PULSE-ASMA-REAL-LOCAL.md` | **Criado** — este arquivo |

Nenhum outro arquivo foi alterado.

---

## Status da execução real do Pulse

### PyPulse já existia?

**❌ Não.** O binding C++ (`PyPulse.so`) não estava pré-compilado. Nenhum `.so`, `.dylib` ou
executável Pulse foi encontrado em `.reference-local/engine-stable`.

### Resultado do cmake

Tentativa de cmake **não realizada** por dois motivos simultâneos:

| Bloqueador | Detalhe |
|-----------|---------|
| **Baixar dependências** | O superbuild do Pulse baixa Eigen3 (eigen-3.4.0.zip, GitLab), pybind11 (v2.13.1, GitHub), protobuf e absl durante `cmake`. Violaria a regra "Não baixar nada". |
| **Disco quase cheio** | Apenas **2.8 Gi livres** (99% do volume usado). Um build C++ de motor fisiológico exige facilmente 5–10 Gi adicionais. |

**CMake disponível:** `/Users/marceloalmeida/Library/Android/sdk/cmake/3.22.1/bin/cmake` (versão 3.22.1 — atende ao mínimo ≥ 3.12 do Pulse).

**Compilador disponível:** Apple clang 17.0.0, GNU make 3.81 — ambos compatíveis com C++17.

**Python disponível:** 3.14.6 — sem numpy/pandas/matplotlib instalados.

### Resultado do make

**Não realizado** (cmake bloqueado).

### HowTo_AsthmaAttack.py executou?

**❌ Não.** Tentativa de execução retornou:

```
ModuleNotFoundError: No module named 'PyPulse'
```

A linha `import PyPulse` falha em `scalars.py` — o binding C++ precisa existir antes de qualquer
execução Python do Pulse.

---

## Output real encontrado?

**❌ Nenhum.** Nenhum CSV, JSON ou TXT gerado pelo Pulse foi encontrado.

---

## Pipeline com CSV sintético (formato Pulse)

Na ausência de output real, a Fase 8 criou um CSV sintético que **reproduce exatamente o formato
nativo do Pulse** (cabeçalho com unidade, SpO₂ como fração 0–1, múltiplos timesteps). O script
usa a última linha temporal, conforme o reader da Fase 7.

### Formato do CSV sintético

```
Time(s),HeartRate(1/min),RespirationRate(1/min),OxygenSaturation(unitless),...
0.0,68.0,16.0,0.9890,120.0,75.0,37.0,7.400,40.0,95.0,2.10    ← estado saudável (t=0)
30.0,122.0,34.0,0.8800,130.0,82.0,37.2,7.340,42.0,62.0,17.50  ← crise asmática grave
580.0,94.0,22.0,0.9600,124.0,78.0,37.0,7.380,39.0,82.0,5.20   ← pós-resolução parcial ←USADA
```

### Resultado do script `testar-pulse-real-asthma-local.ts`

```
RESUMO: ✅ TODOS os 15 critérios passaram.
Pipeline CSV sintético → MEDIX funcionando.
```

### PatientState gerado (última linha: t=580s, pós-resolução parcial)

| Campo | Valor | Origem |
|-------|-------|--------|
| `vitals.spo2` | **96%** | OxygenSaturation: 0.960 → ×100 |
| `vitals.fc` | **94 bpm** | HeartRate: 94 |
| `vitals.fr` | **22 irpm** | RespirationRate: 22 |
| `vitals.paSys` | **124 mmHg** | SystolicArterialPressure |
| `vitals.temp` | **37.0°C** | CoreTemperature |
| `broncoespasmo` | **18** | AirwayResistance 5.2 → linear map (sem BronchodilationLevel) |
| `clinical.estadoGeral` | "mais confortável, respondendo ao tratamento" | recomputarClinica() |
| `clinical.ausculta` | "murmúrio vesicular presente, sibilos raros" | recomputarClinica() |
| `clinical.trabalhoRespiratorio` | "próximo do normal" | recomputarClinica() |

### Comparação com fixtures da Fase 6

| | Fixture baseline | Fixture após BD | Output sintético (pós-resolução) |
|--|--|--|--|
| SpO₂ | 88% | 96% | **96%** — converge com após-BD |
| FC | 122 bpm | 110 bpm | **94 bpm** (melhor que fixture) |
| FR | 34 irpm | 24 irpm | **22 irpm** (melhor que fixture) |
| broncoespasmo | 80 | 35 | **18** (resolução mais completa) |

---

## Uso do script com output real (Fase 9+)

Quando PyPulse for compilado (via liberar disco + permitir download):

```bash
# 1. Executar cenário
cd .reference-local/engine-stable/bin
PYTHONPATH=../src/python python3 ../src/python/pulse/howto/HowTo_AsthmaAttack.py

# 2. Localizar CSV gerado
find /tmp .reference-local/engine-stable -name "*.csv" -mmin -5

# 3. Alimentar pipeline
npx tsx lib/dynamic-osce/scripts/testar-pulse-real-asthma-local.ts /tmp/caminho/output.csv
```

O script aceita qualquer path como argumento. Se o path não existir, usa o CSV sintético
automaticamente (modo de desenvolvimento seguro).

---

## Resultados de validação

| Script | Resultado |
|--------|-----------|
| `testar-pulse-real-asthma-local.ts` | ✅ **15/15 critérios** |
| `testar-pulse-real-output-reader.ts` | ✅ **18/18 critérios** |
| `testar-pulse-adapter-asthma.ts` | ✅ **15/15 critérios** |
| `validar-dynamic-osce.ts` | ✅ **4 casos passaram** |
| `npx tsc --noEmit` | ✅ **0 erros** |
| `npm run build` | ✅ **Compiled successfully** |

---

## Diagnóstico das ferramentas locais

| Ferramenta | Status | Detalhe |
|-----------|--------|---------|
| cmake | ✅ Disponível | Android SDK: v3.22.1 — atende ≥ 3.12 |
| clang | ✅ Disponível | Apple clang 17.0.0 (C++17) |
| make | ✅ Disponível | GNU make 3.81 |
| python3 | ✅ Disponível | 3.14.6 |
| numpy/pandas | ❌ Não instalado | Necessário para scripts Python do Pulse |
| java | ✅ Disponível | OpenJDK 21.0.10 (Homebrew) |
| PyPulse.so | ❌ Não compilado | Precisa de build C++ |
| Disco livre | ⚠️ 2.8 Gi | 99% cheio — insuficiente para build seguro |
| Dependências cmake | ❌ Bloqueadas | Eigen3/pybind11/protobuf baixados via URL |

---

## Bloqueadores para execução real

1. **Disco cheio:** 2.8 Gi livres é insuficiente. O build do Pulse gera facilmente 5–10 Gi de
   artefatos. **Solução:** liberar ≥ 10 Gi antes de compilar.

2. **Dependências externas:** cmake baixa Eigen3, pybind11, protobuf, absl da internet.
   **Solução:** permitir download ou pre-vendor as deps em `.reference-local/`.

3. **numpy/pandas ausentes:** necessários para scripts auxiliares Python (não para o binding).
   **Solução:** `pip3 install --user numpy pandas matplotlib` em venv local.

---

## Próximos passos — Fase 9

**Pré-condições:**
- Liberar ≥ 10 Gi em disco
- Permitir download das dependências cmake OU pre-vendorizar Eigen3/pybind11

**Sequência:**
```bash
# 1. Compilar
cd .reference-local/engine-stable
mkdir -p build && cd build
/Users/marceloalmeida/Library/Android/sdk/cmake/3.22.1/bin/cmake \
  -DPulse_PYTHON_API=ON -DPulse_JAVA_API=OFF -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ ..
make -j4 2>&1 | tee /tmp/pulse_make.log

# 2. Verificar PyPulse
python3 -c "import sys; sys.path.insert(0, 'lib/python'); import PyPulse; print(PyPulse.__version__)"

# 3. Executar e capturar
PYTHONPATH=src/python python3 src/python/pulse/howto/HowTo_AsthmaAttack.py
# Localizar CSV e alimentar:
npx tsx lib/dynamic-osce/scripts/testar-pulse-real-asthma-local.ts /tmp/pulse_asthma_output.csv
```

---

## Confirmação de isolamento

- `.reference-local/` **não versionado** — nenhum arquivo dessa pasta entrou em staging.
- Nenhum binário, `.so`, `.dylib`, CSV real ou output do Pulse foi criado ou versionado.
- `git diff --cached --name-only` → vazio no início da fase.
- Provider dos casos: `medix-rule-based` (inalterado em todos os 4 casos).
- Sem commit (conforme instrução).
