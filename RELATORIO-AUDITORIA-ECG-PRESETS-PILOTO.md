# Auditoria ECG — Lote-Piloto (5 Presets)

**Data:** 15/07/2026  
**Método:** Leitura integral do pipeline de geração — `ecgsynAdapter.ts`, `leadTransform.ts`, `leadModifiers.ts`, `index.ts` e arquivos de presets. Sem execução de código. Sem alteração de código.

---

## Sumário Executivo

| Preset ID | Categoria | FC declarada | Política FC | Diagnóstico exibido | Traçado realiza diagnóstico? | Classe |
|---|---|---|---|---|---|---|
| `normal_adulto` | normal | 75 bpm | `estado_clinico` | Ritmo sinusal (derivado da FC) | Parcialmente | **B** |
| `fibrilacao_atrial` | ritmo | 120 bpm | `estado_clinico` | Fibrilação atrial | Parcial — sem f-waves | **C** |
| `flutter_atrial_2_1` | ritmo | 150 bpm | `preset` | Flutter atrial com condução 2:1 | Não — sem ondas F serrilhadas | **D** |
| `bloqueio_ramo_direito` | conducao | 75 bpm | `estado_clinico` | Bloqueio de ramo direito | Não — QRS normal, sem rSR' | **D** |
| `iam_supra_anterosseptal` | isquemia | 75 bpm (fallback) | `estado_clinico` | IAM com supra de ST anterosseptal | Parcialmente — ST presente, Q e recíproca ausentes | **B** |

---

## 1. Inventário Técnico dos Parâmetros

| Parâmetro | normal_adulto | fibrilacao_atrial | flutter_atrial_2_1 | bloqueio_ramo_direito | iam_supra_anterosseptal |
|---|---|---|---|---|---|
| `heartRate` | 75 | 120 | 150 | 75 | 75 |
| `rrVariability` | 0.02 | 0.30 | 0.01 | 0.02 | 0.04 |
| `prIntervalMs` | 160 | 0 (sem P org.) | 150 (F) | 160 | 160 |
| `qrsDurationMs` | 90 | 90 | 90 | **140 ⚠** | 90 |
| `qtIntervalMs` | 420 | — | — | — | 400 |
| `axisProfile` | normal | normal | normal | normal | normal |
| `pAmplitude` | 0.12 | **0.0 ✓** | 0.08 | 0.12 | 0.12 |
| `qAmplitude` | 0.02 | 0.02 | 0.02 | 0.02 | 0.03 |
| `rAmplitude` | 0.80 | 0.78 | 0.78 | 0.85 | 0.85 |
| `sAmplitude` | 0.30 | 0.32 | 0.32 | 0.35 | 0.18 |
| `tAmplitude` | 0.35 | 0.34 | 0.34 | 0.35 | 0.35 |
| `stSegment` | normal | normal | normal | normal | elevation |
| `qrsPattern` | — | — | — | **rsR_prime_V1 ⚠** | — |
| `leadModifiers` | — | — | — | — | V1 +0.30, V2 +0.35, V3 +0.30 ✓ |
| `category` | normal | ritmo | ritmo | conducao | isquemia |
| Política FC | `estado_clinico` | `estado_clinico` | **`preset`** | `estado_clinico` | `estado_clinico` |

---

## 2. Problemas Arquiteturais Transversais

Estes problemas afetam todos os 5 presets antes de analisar qualquer um individualmente.

### Problema A — `prIntervalMs`, `qrsDurationMs` e `qtIntervalMs` não conectados ao gerador

Os três campos são armazenados no preset mas **nunca lidos por `gerarBatimento()`**. A morfologia é ditada por posições Gaussianas fixas:

| Onda | Centro (frac RR) | σ (frac RR) | FC 75 bpm (RR=800 ms) | FC 150 bpm (RR=400 ms) |
|---|---|---|---|---|
| P | 0.06 | 0.04 | Centro 48 ms | Centro 24 ms |
| Q | 0.21 | 0.012 | 168 ms | 84 ms |
| R | 0.23 | 0.010 | 184 ms | 92 ms |
| S | 0.26 | 0.015 | 208 ms | 104 ms |
| T | 0.45 | 0.08 | Centro 360 ms | Centro 180 ms |

**Intervalo PR real no traçado:** `(0.23 − 0.06) × RR = 0.17 × RR`  
- A 75 bpm: **136 ms** (vs 160 ms declarado)  
- A 150 bpm: **68 ms** (vs 150 ms declarado para flutter)

**Duração QRS visual** (Q−2σ até S+2σ): `≈ (0.26+0.03 − (0.21−0.024)) × RR ≈ 0.104 × RR`  
- A 75 bpm: **≈83 ms** — indistinguível entre `normal_adulto` (declarado 90 ms) e `bloqueio_ramo_direito` (declarado 140 ms).

**QTc retornado:** `250 + Math.random() * 100` ms / √RRmédio — valor aleatório a cada geração, não medido no traçado.

> ⚠ **Impacto crítico:** `bloqueio_ramo_direito` com `qrsDurationMs=140` produz traçado com QRS ~83 ms — normal. O aluno não vê QRS alargado.

---

### Problema B — `axisProfile` ignorado; eixo hardcoded em 60°

A chamada em `index.ts`:

```ts
transformarEm12Derivacoes(sinalProcessado, 60)
```

Passa **60° fixo**, ignorando o `axisProfile` do preset. Todos os presets produzem o mesmo eixo de 60°, incluindo os pediátricos com `axisProfile: 'rightward'`.

> ⚠ Não afeta os 5 presets do piloto (todos `axisProfile: 'normal'`), mas é um bug estrutural que impede futuros presets com desvio de eixo.

---

### Problema C — Derivações precordiais: modelo de ganho fixo com offset DC

Em `leadTransform.ts`, todas as V1–V6 são versões do sinal DII com ganhos distintos. O campo `offset` em `CONFIG_DERIVACOES` cria deslocamento DC de baseline:

| Lead | `ganhoR` (pos) | `ganhoS` (neg) | `offset` aplicado | `ganho` (config) |
|---|---|---|---|---|
| V1 | 0.5 | −0.6 | 0 | ×1.0 + 0 |
| V2 | 0.6 | −0.5 | **+0.1 mV DC** | ×1.1 + 0.1 |
| V3 | 0.65 | −0.35 | **+0.2 mV DC** | ×1.2 + 0.2 |
| V4 | 0.75 | −0.2 | +0.3 mV DC | ×1.4 + 0.3 |
| V5 | 0.8 | −0.1 | +0.2 mV DC | ×1.3 + 0.2 |
| V6 | 0.7 | 0 | 0 | ×1.1 + 0 |

> ⚠ V2 e V3 possuem offset DC de +0.1 e +0.2 mV. A visualização mostra baseline deslocado para cima antes mesmo dos `leadModifiers`. A medição interna por baseline-subtraction (`medirDesnivelST`) cancela o offset, mas o aluno vê o artefato.

---

### Problema D — `intervalsPR` e `duracoesQRS` retornados são aleatórios

```ts
const intervalosPR = Array(metricas.numeroComplexos).fill(null).map(() => 100 + Math.random() * 60 + ...)
const duracoesQRS  = Array(metricas.numeroComplexos).fill(null).map(() => 65  + Math.random() * 35 + ...)
```

Valores aleatórios em [100–160] ms e [65–100] ms, respectivamente. Não medidos no sinal real.

> ⚠ Impacto moderado: esses arrays não são exibidos diretamente no painel atual, mas enganosos se consumidos por componentes futuros.

---

## 3. Análise Individual dos Presets

### 3.1 `normal_adulto` — Classe **B** (Representação parcial)

**Parâmetros declarados vs gerados:**

| Campo | Declarado | Real no traçado |
|---|---|---|
| FC | 75 bpm | 75 bpm ✓ |
| Ritmo exibido | Ritmo sinusal | Ritmo sinusal ✓ (classificador por FC) |
| PR | 160 ms | ≈136 ms (0.17×800) |
| QRS | 90 ms | ≈83 ms (0.104×800) |
| QTc | 420 ms | Aleatório ~310–370 ms |
| Eixo | 0–90° (normal) | 60° hardcoded |
| ST | isoelétrico | isoelétrico ✓ (sem modificadores) |
| Onda P | presente | presente ✓ (amplitude 0.12) |

**Checklist clínico:**
- ✓ Ritmo sinusal detectável (P regular, QRS regular, RR estável)
- ✓ FC 75 bpm correta
- ✓ Onda P visível
- ✓ ST isoelétrico (sem modificadores)
- ~ PR real ≈136 ms — dentro de 120–200 ms, aceitável educacionalmente
- ~ QRS visual ≈83 ms vs 90 ms declarado — diferença mínima
- ✗ QTc exibido é aleatório — não confiável para ensino de QTc
- ✗ Offset DC em V2 (+0.1) e V3 (+0.2) eleva baseline precordial — não representa ECG normal fisiológico

**Veredito:** Ritmo sinusal reconhecível, FC correta, P presente. Adequado para treino de "ECG normal básico". Insuficiente para treinar reconhecimento de PR longo, QTc anormal ou morfologia precordial detalhada.

---

### 3.2 `fibrilacao_atrial` — Classe **C** (Simplificação clinicamente relevante)

**Parâmetros declarados vs gerados:**

| Campo | Declarado | Real no traçado |
|---|---|---|
| Onda P | Ausente (`pAmplitude=0.0`) | Ausente ✓ (0.0 × 0.8 = 0) |
| Irregularidade RR | `rrVariability=0.30` | Irregular ✓ mas com padrão sinusoidal (LF+HF) |
| Trama fibrilatória (f-waves) | "Visível na linha de base" | **AUSENTE** ✗ |
| Ruído de baseline | implícito no diagnóstico | Nenhum (`ruido=0`) |
| FC | 120 bpm | 120 bpm (ou `patientHeartRate` se fornecida) |

**Checklist clínico:**
- ✓ Ausência de onda P organizada (`pAmplitude=0`)
- ✓ RR irregular (rrVariability=0.30 gera variação ampla)
- ✓ QRS estreito
- ~ Irregularidade RR simulada por modulação sinusoidal — não verdadeiramente aleatória; a 5s de traçado pode parecer periódica
- ✗ Trama fibrilatória (f-waves ~400–600/min entre QRS): completamente ausente
- ✗ `expectedInterpretation[3]` afirma "Trama fibrilatória visível na linha de base" — achado que o gerador não produz

**Veredito:** P ausente e RR irregular são características diagnósticas presentes. Porém sem f-waves, o aluno treina apenas 2 dos 3 critérios clássicos de FA. A `expectedInterpretation` promete achado que não existe no traçado.

---

### 3.3 `flutter_atrial_2_1` — Classe **D** (Diagnóstico não realizável com pipeline atual)

**Parâmetros declarados vs gerados:**

| Campo | Declarado | Real no traçado |
|---|---|---|
| FC | 150 bpm (política `preset`) | 150 bpm ✓ |
| RR | `rrVariability=0.01` (quasi-regular) | Regular ✓ |
| Ondas F por ciclo QRS | 2 (razão 2:1) | **1 "P" pequena por ciclo** ✗ |
| Padrão serrilhado DII/DIII/aVF | esperado | **AUSENTE** ✗ |
| `pAmplitude` | 0.08 (simulação de F) | 1 onda arredondada pequena |

**Por que flutter 2:1 não é realizável no pipeline atual:**

Flutter atrial exige duas ondas F por complexo QRS — frequência atrial ~300 bpm com condução 2:1. O gerador `gerarBatimento()` possui um único ciclo P–QRS–T por intervalo RR. Não há mecanismo para:
- ✗ Gerar 2 ondas F por ciclo QRS
- ✗ Padrão "dente de serra" em DII/DIII/aVF (F-waves negativas nas derivações inferiores)
- ✗ Mascaramento da 2ª onda F pelo QRS
- ✓ Taquicardia regular a 150 bpm: presente
- ✓ QRS estreito: presente

**Veredito:** O traçado produz taquicardia regular com "P" discreta — diagnosticamente confundível com TSV. O aluno treinando para reconhecer "dente de serra" e razão 2 F:1 QRS não encontrará esses elementos. Diagnóstico diferencial flutter vs TSV não é treinável com este preset.

---

### 3.4 `bloqueio_ramo_direito` — Classe **D** (Traçado indistinguível de `normal_adulto`)

**Parâmetros declarados vs gerados:**

| Campo | Declarado | Real no traçado |
|---|---|---|
| `qrsDurationMs` | 140 ms | ≈83 ms (Gaussianas fixas) ✗ |
| `qrsPattern` | `rsR_prime_V1` | Campo ignorado pelo pipeline ✗ |
| rSR' em V1 | esperado | AUSENTE — V1 unimodal ✗ |
| S profunda em DI/V6 | esperado | Não ajustado por derivação ✗ |
| Alterações secundárias ST-T | esperadas | AUSENTES ✗ |
| Diferença vs `normal_adulto` | diagnóstico distinto | R=0.85 vs 0.80; S=0.35 vs 0.30 — mínima |

**Campo `qrsPattern` nunca lido:**

O campo `qrsPattern: 'rsR_prime_V1'` existe na interface `ECGPreset` mas nenhuma etapa do pipeline o lê. Não há código que implemente o padrão rSR' em V1 a partir desse campo.

**Checklist clínico:**
- ✗ QRS ≥ 120 ms: traçado mostra ~83 ms
- ✗ rSR' em V1: morfologia unimodal derivada de DII
- ✗ S profunda em DI e V6: não realçado especificamente por derivação
- ✗ Alterações secundárias de repolarização ST-T em V1: ausentes
- ✓ Rótulo "Bloqueio de ramo direito" exibido na interpretação

**Veredito:** Pior caso do lote-piloto. O traçado é visualmente idêntico ao `normal_adulto` com amplitude R/S levemente aumentada. O aluno lê "Bloqueio de ramo direito" no painel mas não vê nenhuma das características morfológicas que definem esse diagnóstico.

---

### 3.5 `iam_supra_anterosseptal` — Classe **B** (Melhor realizado do piloto)

**Parâmetros declarados vs gerados:**

| Campo | Declarado | Real no traçado |
|---|---|---|
| ST em V1 | +0.30 mV | +0.30 mV via `leadModifiers` ✓ |
| ST em V2 | +0.35 mV | +0.35 mV (+ DC offset 0.1 mV) ✓ |
| ST em V3 | +0.30 mV | +0.30 mV (+ DC offset 0.2 mV) ✓ |
| `diagnosticoPrincipal` | "IAM com supra de ST anterosseptal" | Populado ✓ |
| `laudo`, `achados`, `alteracoesST` | — | Todos populados ✓ |
| Ondas Q patológicas V1–V3 | — | AUSENTES (escopo futuro) |
| Alterações recíprocas inferiores | — | AUSENTES (documentado no preset) |

**Análise do envelope ST (FC 75 bpm):**

| Parâmetro | Valor |
|---|---|
| RR @ 75 bpm, 250 Hz | 200 amostras |
| J index (r + 0.06×200) | r + 12 amostras (48 ms pós-R) |
| T peak index (r + 0.22×200) | r + 44 amostras (176 ms pós-R) |
| winLen (T_peak − J) | 32 amostras |
| Ponto de medição (u=0.25) | J + 8 amostras → u=0.25 |
| Fase no envelope | C (platô: 0.12 ≤ 0.25 ≤ 0.38) → envelope=1.0 ✓ |
| Amplitude aplicada | 1.0 × amplitudeMv = valor exato ✓ |

**Checklist clínico:**
- ✓ Supradesnivelamento de ST em V1, V2 e V3 presente no traçado
- ✓ V2 com maior amplitude (+0.35 vs +0.30 em V1/V3)
- ✓ Ritmo sinusal mantido
- ✓ Interpretação estruturada completa: `diagnosticoPrincipal`, `laudo`, `achados`, `alteracoesST`
- ✓ Pré-rampa garante transição suave no J (sem degrau abrupto)
- ~ DC offset em V2 (+0.1 mV) e V3 (+0.2 mV) desloca baseline visual — medição interna cancela por baseline subtraction, mas visual fica impuro
- ✗ Ondas Q patológicas em V1–V3: ausentes (documentado como fora do escopo)
- ✗ Alterações recíprocas inferiores (DII, DIII, aVF): ausentes (documentado no preset)
- ✗ `tWavePolarity` não implementado no commit 3b — inversão de T em V1–V3 ausente

**Veredito:** Melhor realizado do piloto. O elemento diagnóstico principal (supra de ST anterosseptal) está presente no traçado com amplitude correta e interpretação estruturada completa. Limitações identificadas são documentadas no próprio preset e representam escopo incremental futuro.

---

## 4. Análise Comparativa — Fidelidade por Elemento Diagnóstico

| Elemento diagnóstico | normal_adulto | fibrilacao_atrial | flutter_2_1 | bloqueio_ramo_dir | iam_anterosseptal |
|---|---|---|---|---|---|
| FC correta no traçado | ✓ | ✓ | ✓ (preset) | ✓ | ✓ |
| Ritmo exibido correto | ✓ sinusal | ✓ FA | ✓ flutter 2:1 | ✓ BRD | ✓ IAM supra |
| Morfologia P realística | ~ presente | ✓ ausente | ~ reduzida | ~ normal | ~ normal |
| RR regular/irregular correto | ✓ regular | ~ irregular (periódico) | ✓ regular | ✓ regular | ✓ regular |
| QRS alargado (BRD ≥120 ms) | N/A | N/A | N/A | ✗ ~83 ms | N/A |
| Morfologia característica QRS | ~ genérica | ~ genérica | ~ genérica | ✗ sem rSR' V1 | ~ sem Q patológica |
| Elemento diagnóstico principal | ✓ ausência alterações | ~ sem f-waves | ✗ sem F serrilhada | ✗ sem rSR'/S largo | ✓ supra ST V1–V3 |
| Achados secundários | ✓ ST isoelétrico | ✗ trama ausente | ✗ razão 2:1 ausente | ✗ S lat. ausente | ~ sem recíprocas |
| Interpretação estruturada no UI | ✓ tituloInterpretacao | ✓ ritmo FA | ✓ ritmo flutter | ✓ ritmo BRD | ✓ laudo completo |

---

## 5. Grupos de Presets por Criticidade de Correção

### Grupo 1 — Funcionais para ensino básico (manter, melhorar incrementalmente)

- **`normal_adulto`** — adequado para treinar "reconhecer ECG normal". Melhorias: corrigir offset DC em V2/V3, ajustar PR real para corresponder ao declarado.
- **`iam_supra_anterosseptal`** — elemento diagnóstico principal presente. Melhorias incrementais: ondas Q patológicas, alterações recíprocas, `tWavePolarity`.

### Grupo 2 — Parcialmente funcionais (necessitam melhoria estrutural)

- **`fibrilacao_atrial`** — P ausente e RR irregular corretos. Necessita: mecanismo de f-waves no baseline (e.g., Gaussianas extras de alta frequência sobrepostas ao segmento TP/PR, com amplitude ~0.05–0.15 mV e frequência ~5–7 Hz no sinal temporal).

### Grupo 3 — Enganosos para ensino (requerem novo mecanismo de geração)

> Estes presets exibem um diagnóstico no painel mas não produzem o traçado correspondente. Risco de reforçar reconhecimento incorreto.

- **`flutter_atrial_2_1`** — Requer: modelo de duas ondas F por ciclo QRS, padrão serrilhado diferencial por derivação inferior (negativo em DII/DIII/aVF). Não realizável sem extensão do `gerarBatimento()`.
- **`bloqueio_ramo_direito`** — Requer: (a) conectar `qrsDurationMs` ao gerador (alargamento das Gaussianas R+S); (b) implementar rSR' em V1 (dupla Gaussiana em R); (c) realçar S em derivações laterais (I, V5, V6). Nenhuma dessas funcionalidades existe no pipeline atual.

---

## 6. Problemas Transversais a Resolver

Ordenados por impacto:

1. **Problema A (PR/QRS/QT não conectados):** Conectar `prIntervalMs` ao offset temporal entre P e QRS em `gerarBatimento()`; conectar `qrsDurationMs` à largura das Gaussianas Q+R+S; derivar QTc do traçado real ou de `qtIntervalMs`.

2. **Problema D (QTc aleatório):** Medir QT no traçado real ou derivar de `qtIntervalMs` do preset.

3. **Problema B (axisProfile ignorado):** Passar `eixoMedio` derivado de `axisProfile` para `transformarEm12Derivacoes()` em vez de 60° fixo.

4. **Problema C (offset DC V2/V3/V4/V5):** Os campos `offset` em `CONFIG_DERIVACOES` criam baseline não-zero nas precordiais — remover ou documentar como intencional e isolado da medição.

---

## 7. Tabela de Classificações — Lote-Piloto

**Escala:** A — Fiel | B — Parcial | C — Simplificado (não enganoso) | D — Enganoso (elemento diagnóstico ausente) | E — Incompatível

| Preset | Classe | Elemento OK | Elemento Ausente / Incorreto | Impacto Educacional |
|---|---|---|---|---|
| `normal_adulto` | **B** | FC, ritmo sinusal, P presente, ST isoelétrico | PR 136 ms vs 160 ms; DC offset V2/V3; QTc aleatório | Baixo — discrepâncias menores; treinamento válido |
| `fibrilacao_atrial` | **C** | P ausente, RR irregular, QRS estreito | Sem f-waves; irregularidade periódica (não aleatória) | Médio — treina 2/3 critérios FA |
| `flutter_atrial_2_1` | **D** | Regular a 150 bpm, QRS estreito | Sem ondas F serrilhadas; razão 2:1 inexistente; parece TSV | Alto — risco de confusão flutter/TSV |
| `bloqueio_ramo_direito` | **D** | FC normal, ritmo, label correto | QRS ~83 ms (não 140 ms); sem rSR'; sem S largo; igual a normal | Alto — label mostra diagnóstico que o traçado não realiza |
| `iam_supra_anterosseptal` | **B** | ST supra V1-V3 presente; amplitude correta; interpretação completa | Sem Q patológica; sem recíprocas; offset V2/V3 | Baixo-Médio — elemento principal presente |

---

*Auditoria de leitura de código — sem alteração de arquivos, sem commit, sem push.*
