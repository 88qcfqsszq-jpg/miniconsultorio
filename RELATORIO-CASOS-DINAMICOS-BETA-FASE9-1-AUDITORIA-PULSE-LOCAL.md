# RELATÓRIO — Casos Dinâmicos Beta · Fase 9.1: Auditoria Build Pulse Local

**Data:** 2026-07-12  
**Fase:** 9.1 — Auditoria e preservação segura do build local do Pulse  
**Status:** ✅ CONCLUÍDA

---

## 1. Confirmação: `.reference-local` NÃO entrou no Git

| Verificação | Resultado |
|---|---|
| `git status --short` mostra arquivos de `.reference-local/` | ❌ Nenhum |
| `git diff --cached --name-only` retorna arquivos staged | ❌ Nenhum |
| Binários (`.so`, `.dylib`, `.a`, `.o`) aparecem no git status | ❌ Nenhum |
| CSVs ou logs aparecem no git status | ❌ Nenhum |

**Mecanismo de proteção:** `.reference-local/` está registrado em `.git/info/exclude` (exclusão local, nunca commitada). O engine-stable NÃO possui `.git` próprio — é um subdiretório do repositório do app, mas completamente invisível ao git graças ao `exclude`.

---

## 2. Status do PyPulse Compilado

| Item | Valor |
|---|---|
| Versão | `4.3.2` |
| Localização canônica | `.reference-local/engine-stable/build/install/lib/PyPulse.cpython-39-darwin.so` |
| Python runtime | `/Applications/Xcode.app/.../Python3.framework/Versions/3.9/bin/python3.9` |
| CMake usado no build | `/Users/marceloalmeida/Library/Android/sdk/cmake/3.22.1/bin/cmake` |
| Import funcional | ✅ `import PyPulse` → `PyPulse v4.3.2` |
| `initialize_engine()` funcional | ✅ ~9s, retorna `True` |
| `advance_time_s(1)` funcional | ✅ Sem crash (SIGSEGV corrigido) |

---

## 3. Status do CSV Real

| Item | Valor |
|---|---|
| Path | `/tmp/pulse_fase9_asthma_output.csv` |
| Tamanho | 2.1 MB |
| Linhas | 29.001 (1 header + 29.000 time steps de 0.02s = 580s) |
| Conteúdo | HeartRate, SystolicBP, DiastolicBP, RespirationRate, OxygenSaturation, TidalVolume, EndTidalCO2 |
| Persistência | ⚠️ Arquivo em `/tmp/` — efêmero (apagado no próximo reboot) |
| Script para regenerar | `/tmp/pulse_fase9_asthma.py` (também efêmero) |

**Para regenerar:**
```bash
ENGINE=".reference-local/engine-stable"
PYTHON="/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/bin/python3.9"
PYTHONPATH="$ENGINE/build/install/lib:$ENGINE/build/install/python" $PYTHON /tmp/pulse_fase9_asthma.py
```

---

## 4. Status da Pipeline Real Pulse → MEDIX

| Script | Critérios | Resultado |
|---|---|---|
| `testar-pulse-real-asthma-local.ts` com CSV real | 14/14 | ✅ |
| `testar-pulse-real-output-reader.ts` | 18/18 | ✅ |
| `testar-pulse-adapter-asthma.ts` | 15/15 | ✅ |
| `validar-dynamic-osce.ts` | Todos | ✅ |
| `tsc --noEmit` | Sem erros | ✅ |
| `npm run build` | Sucesso | ✅ |

---

## 5. Patches Locais Aplicados no Pulse Engine

Todos os patches estão preservados em `.reference-local/pulse-patches/fase9/` (local, não versionado).

### 5.1. Fix principal — GastrointestinalModel.cpp

**Crash:** SIGSEGV em `advance_time_s()` na primeira chamada em estado Active.  
**Root cause:** `m_StomachContents` (`SENutrition*`) permanecia `nullptr` porque `PulseConfiguration.json` está vazio → `HasDefaultStomachContents()` = false → `Initialize()` nunca chamava `GetStomachContents()` (lazy-allocator). O `else` branch (estabilização) nunca usa `m_StomachContents`; o `if (Active)` branch chama `DigestStomachNutrients()` → null deref imediato.

**Fix:** Uma linha em `Initialize()` (`GetStomachContents()`) + null guard em `DigestStomachNutrients()`.

### 5.2. Substance JSONs modificados

| Arquivo | Modificação | Motivo |
|---|---|---|
| `Glucose.json` | Adicionado `RenalClearance.Regulation` com `TransportMaximum=375 mg/min` | `CalculateGlomerularFilteredSubstance` causava NaN crash sem TransportMaximum |
| `Calcium.json` | Removido bloco `Regulation` do RenalClearance | Crash em `CalculateGlomerularTransport` com compartimentos não inicializados |
| `Albumin.json` | Removido bloco `Regulation` do RenalClearance | Idem |
| `Acetoacetate.json` | Removido bloco `Regulation` do RenalClearance | Idem |
| `Lactate.json` | Removido `Regulation` e `SystemicClearance` | Não modelado corretamente no v4.3.2 |
| 17 drogas inativas | Removido `SystemicClearance` de cada uma | `CalculateSubstanceClearance` acessava compartimentos não inicializados para drogas fora de uso |

---

## 6. Riscos Identificados

| Risco | Severidade | Mitigação |
|---|---|---|
| `.reference-local/` perdido (delete acidental) | Alta | Documenta-se neste relatório; patches em `pulse-patches/` dentro de `.reference-local/` |
| Python 3.9 (Xcode) removido | Média | Rebuild necessário com Python disponível |
| CMake Android SDK atualizado/removido | Baixa | CMake é standard; qualquer versão ≥3.22 funciona |
| CSV em `/tmp/` apagado no reboot | Baixa | Regenerar com `pulse_fase9_asthma.py` em ~23s |
| Patches não upstream | Info | Não impedem operação local; considerar PR upstream em Fase futura |

---

## 7. Recomendação para Fase 10

**Objetivo:** Integrar output do Pulse real na pipeline OSCE de forma estável.

**Abordagem recomendada:**
1. **Não integrar Pulse diretamente no processo Next.js** — manter como processo Python separado.
2. Criar script Python persistente (fora de `/tmp/`) que inicializa o engine uma vez e aceita pedidos de simulação via stdin/stdout ou arquivo.
3. Definir API de contrato (JSON): `{condition, severity, duration_s}` → `{vitals_csv_path, final_vitals}`.
4. No app, chamar via API endpoint seguro (ex: `app/api/pulse/simulate`) que executa o script Python e retorna vitais.
5. Manter `simulationProvider: "medix-rule-based"` como fallback — ativar `"pulse-local"` somente quando a API estiver estável.
6. Antes de cada sessão de desenvolvimento com Pulse, verificar: `python3.9 -c "import PyPulse; print(PyPulse.__version__)"`.

---

*Relatório criado pela auditoria Fase 9.1. Pode entrar no Git do app — contém apenas texto.*
