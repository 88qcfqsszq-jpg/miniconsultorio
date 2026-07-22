# Relatório de Auditoria Visual e Instrumental — Lote-Piloto ECG
**Data:** 2026-07-15 (revisado 2026-07-15)
**Método:** Execução real do pipeline `generateECG` + capturas do ECGTrace via Playwright (CDP, headless:false) + medições nos arrays finais entregues ao ECGTrace
**Caso clínico:** `/caso/1` (dor torácica — angina típica, FC do caso = 102 bpm)
**Parâmetros do ECGTrace:** 25 mm/s · 10 mm/mV · 250 Hz · 5 s duração
**Scripts de auditoria:** `measure-pilot.ts`, `screenshot-pilot.ts`, `qrs-fc-audit.ts` (todos em scratchpad; nenhum arquivo do projeto foi alterado)

---

## 1. Resumo Executivo

| Preset | FC alvo | FC medida | FC exibida | QRS estimado (prov.)¹ | Classificação |
|---|---|---|---|---|---|
| normal_adulto | 75 | 68–69 | 102² | ~42 ms | **C** (morfologia B, compatibilidade C) |
| fibrilacao_atrial | 110³ | 82 | 102² | ~36 ms | **C** |
| flutter_atrial_2_1 | 150 | 140–141 | 150⁴ | ~23 ms | **D** |
| bloqueio_ramo_direito | 70³ | 64 | 102² | ~43 ms | **D** |
| iam_supra_anterosseptal | 108³ | 95 | 102² | ~31 ms | **B** |

¹ Estimado pelo algoritmo de medição atual — valor provisório até validação do método de início e fim do complexo (ver §3.5)
² FC do caso `/caso/1` (102 bpm) prevalece via política `estado_clinico`
³ FC testada no script de medição; no contexto do caso a UI exibe 102 bpm
⁴ Flutter usa política `preset` — FC 150 preservada independente do caso

**Achado crítico transversal:** `Eixo elétrico = 60°` em todos os presets (hardcoded em `transformarEm12Derivacoes`). `QTc` aleatório em todos os presets (`Math.round((250 + Math.random()*100) / sqrt(RR))`).

---

## 2. Metodologia

### 2.1 Execução Instrumental
Scripts `measure-pilot.ts` e `qrs-fc-audit.ts` executados via `npx tsx` do diretório do projeto. Importações diretas de `generateECG`. Medições nos arrays finais antes de entrega ao ECGTrace. Nenhum arquivo do projeto foi modificado.

### 2.2 Capturas Visuais
Script `screenshot-pilot.ts` via Playwright Chromium:
- Login simulado via `localStorage.setItem('medix.access.loggedIn', '1')`
- Navegação para `/caso/1` (caso free)
- Drag-drop simulado via `page.mouse` (CDP — eventos `isTrusted=true`)
- Confirmação de 10/10 eletrodos via leitura do fiber React (`simFiber.memoizedState` hook 0)
- Clique no botão "📊 Gerar ECG" após habilitação (polling `btn.isEnabled()`)
- Capturas em dois momentos: scroll 55% (traçado) e scroll 100% (interpretação)

### 2.3 Escala de Classificação
| Grau | Critério |
|---|---|
| A | Morfologicamente correto em todos os critérios diagnósticos chave; seguro para treinamento |
| B | Correto nos critérios primários; desvios menores documentados |
| C | Critério primário parcialmente presente; limitações explícitas necessárias |
| D | Critério diagnóstico morfológico ausente ou incorreto; requer correção antes do uso |
| E | Enganoso/perigoso; ocultar imediatamente |

> Regra aplicada: **"Não atribuir A ou B sem captura real"** — todas as classificações B–A foram obtidas após confirmação visual.

---

## 3. Medições Instrumentais — Arrays Finais

### 3.1 Tabela Mestra

| Parâmetro | normal | FA | Flutter | BRD | IAM |
|---|---|---|---|---|---|
| FC alvo (bpm) | 75 | 110 | 150 | 70 | 108 |
| **FC medida (bpm)** | **68–69** | **82** | **140–141** | **64** | **95** |
| Déficit FC | −8 a −9% | −25% | −6 a −7% | −8 a −9% | −12% |
| RR médio real (ms) | 877 | 736 | 427 | 934 | 630 |
| RR CV | 4.0% | **14.1%** | 3.2% | 4.1% | 5.8% |
| PR estimado (ms) | 150 | 91 | 72 | 161 | 108 |
| **QRS estimado DII (ms) ¹** | **42** | **36** | **23** | **43** | **31** |
| QT estimado (ms) | 477 | 408 | 232 | 509 | 343 |
| QTc estimado | 510 | 478 | 355 | 527 | 433 |
| Amp P (mV) | 0.191 | **0.000** | 0.105 | 0.174 | 0.174 |
| Amp R DII (mV) | 2.047 | 2.013 | 1.987 | 2.042 | 2.035 |

¹ Valores provisórios — ver §3.5 para limitações do método de medição.

> **Nota sobre PR estimado:** PR visual ≈ 0.17 × RR (frações Gaussianas fixas em `gerarBatimento`). O campo `prIntervalMs` do preset não afeta o traçado.

> **Nota sobre QRS estimado:** Estimado pelo método de limiar de 5% do pico R em DII (ver §3.5). Os valores refletem a largura do pico Gaussiano R, não a duração anatômica do QRS. O campo `qrsDurationMs` do preset não afeta o traçado.

### 3.2 Área ST por Derivação (mV·ms — integral na janela Phase C, NÃO amplitude pontual)

> **Importante:** os valores abaixo são integrais calculadas pela função `medirDesnivelST()` sobre uma janela após o pico R. A unidade é mV·ms (área sob a curva), não mV (amplitude pontual do ponto J ou do supra). Não devem ser usados para afirmar diretamente "X mm de supra". As comparações relativas entre IAM e baseline (3–4×) são válidas; os valores absolutos requerem calibração adicional do método.

| Derivação | Normal | FA | Flutter | BRD | IAM |
|---|---|---|---|---|---|
| I | 213 | 223 | 208 | 205 | 203 |
| II | 291 | 305 | 284 | 280 | 277 |
| III | 78 | 82 | 76 | 75 | 74 |
| aVR | 378 | 397 | 368 | 363 | 360 |
| aVL | 81 | 85 | 79 | 78 | 77 |
| aVF | 277 | 290 | 270 | 266 | 264 |
| **V1** | **106** | **112** | **104** | **102** | **401** |
| **V2** | **141** | **147** | **137** | **135** | **484** |
| **V3** | **166** | **174** | **162** | **160** | **458** |
| V4 | 224 | 235 | 218 | 215 | 213 |
| V5 | 221 | 232 | 216 | 213 | 211 |
| V6 | 164 | 172 | 160 | 158 | 156 |

> IAM: V1/V2/V3 exibem 3–4× acima do baseline em área ST. V2 > V1 e V3 ✓. Nenhuma derivação inferior (DII/DIII/aVF) mostra depressão recíproca significativa.

### 3.3 Progressão R Precordial (amplitude mediana)

| Lead | Normal | FA | Flutter | BRD | IAM |
|---|---|---|---|---|---|
| V1 | 0.749 | 0.737 | 0.727 | 0.747 | 0.745 |
| V2 | 1.089 | 1.073 | 1.060 | 1.086 | 1.083 |
| V3 | 1.369 | 1.349 | 1.335 | 1.366 | 1.362 |
| V4 | 1.874 | 1.847 | 1.827 | 1.869 | 1.864 |
| V5 | 1.759 | 1.733 | 1.713 | 1.754 | 1.749 |
| V6 | 1.154 | 1.135 | 1.120 | 1.151 | 1.147 |

> Progressão normal V1→V4 em todos os presets. V5 < V4 (cauda normal). **BRD e Normal têm progressão idêntica** — confirma que o preset BRD não altera morfologia de R.

---

### 3.4 Auditoria da Divergência de FC

Cada coluna descreve um nível da cadeia: FC solicitada → FC aplicada pelo gerador → RR teórico (sem modulação) → batimentos esperados → picos detectados → FC calculada dos picos → FC exibida na UI.

| Preset | FC solicitada | FC gerador (target) | RR nominal (ms) | Beats teóricos (5s) | Picos R detectados | FC dos picos (bpm) | FC metadata (bpm) | FC UI (bpm) |
|---|---|---|---|---|---|---|---|---|
| normal_adulto | N/A (preset=75) | 75 | 800 | 6,25 | 6 | 68,4 | 68 | 102¹ |
| fibrilacao_atrial | 110 | 110 | 545 | 9,17 | 7 | 81,5 | 82 | 102¹ |
| flutter_atrial_2_1 | 150 | 150 | 400 | 12,50 | 12 | 140,4 | 140 | 150 |
| bloqueio_ramo_direito | 70 | 70 | 857 | 5,83 | 6 | 64,2 | 64 | 102¹ |
| iam_supra_anterosseptal | 108 | 108 | 556 | 9,00 | 8 | 95,3 | 95 | 102¹ |

¹ FC do caso `/caso/1` (102 bpm) prevalece via política `estado_clinico` na UI.

**Observação crítica — distância mínima do detector:** A `detectarComplexosQRS()` do `ecgsynAdapter.ts` rejeita picos com distância < 300ms (75 amostras a 250 Hz). Nenhum intervalo RR ficou abaixo de 300ms em nenhum preset (RR mais curto: 404ms em Flutter). Portanto, **a rejeição por distância mínima não contribuiu para o déficit de FC** nesta rodada.

**Hipótese primária plausível, ainda não confirmada pelos intervalos RR internos:** A função `gerarIntervalosRR()` usa modulação LF a 0,05 Hz. Com uma janela de 5 segundos, a modulação LF percorre exatamente o **primeiro quarto do ciclo sinusoidal** (de 0 ao pico positivo). Se confirmado, todos os intervalos RR gerados durante a janela receberiam valores de modulação LF sistematicamente positivos — de 0 (no início) até o valor máximo (no final) — tornando a média dos intervalos maior do que `RRMédio = 60/FC_alvo` e reduzindo a FC medida. A confirmação depende de registrar ou expor temporariamente cada RR gerado, sua posição temporal, o componente LF, o componente HF, o ruído aleatório e o RR final aplicado.

A magnitude do déficit aumenta com `variacaoRR` (que escala a amplitude da modulação): FA tem `rrVariability` estimada em ~0,15 (CV observado de 14,1%), produzindo amplitude de modulação ≈ 0,27 × RRMedio, o que explica o déficit de −25%. Normal e BRD têm `rrVariability` ≈ 0,02, produzindo amplitude de modulação ≈ 0,10 × RRMedio, compatível com déficits de −8 a −9%.

**Classificação da causa por preset:**

| Preset | Causa | Classificação |
|---|---|---|
| normal_adulto | LF em fase ascendente durante 5s (amplitude modulação: ~10% RR) | Hipótese primária, não conclusivo sem rastreio de RR internos |
| fibrilacao_atrial | LF em fase ascendente + `rrVariability` alta (~0,15) compostos | Combinação de fatores |
| flutter_atrial_2_1 | LF em fase ascendente + `numeroIntervalos=12` com 12,5 batimentos teóricos | Combinação de fatores |
| bloqueio_ramo_direito | LF em fase ascendente (amplitude modulação: ~10% RR) | Hipótese primária, não conclusivo |
| iam_supra_anterosseptal | LF em fase ascendente + `rrVariability` moderada | Combinação de fatores |

> `normalizarSinal()` **não é causa do déficit de FC.** Normalização de amplitude não altera tempo, quantidade de amostras, posição dos batimentos, intervalo RR nem duração do sinal. Poderia, no máximo, afetar a detecção de picos R se o detector usasse limiar absoluto — mas `detectarComplexosQRS()` usa limiar relativo (60% do máximo local), portanto é independente da escala de amplitude.

---

### 3.5 Auditoria do Método de Medição do QRS

#### Especificação do método

O método `estimarQRS()` no script `measure-pilot.ts` mede o complexo usando os seguintes parâmetros:

| Parâmetro | Valor |
|---|---|
| Derivação de referência | DII (ou fallback para I, V1 se DII ausente) |
| Onset: ponto inicial do QRS | Primeira amostra à esquerda do pico R onde `sinal < 5% × ampR` |
| Offset: ponto final do QRS | Primeira amostra à direita do pico R onde `sinal < 5% × ampR` |
| Limiar | 5% da amplitude do pico R na derivação de referência |
| Janela de busca | ±8% do intervalo RR a partir do pico R |
| Influência da filtragem | Filtro passa-alta (fc=0,5 Hz, α≤0,02) — impacto provavelmente pequeno pela configuração do filtro, mas não quantificado nesta auditoria (comparação sinal pré/pós filtro não realizada) |
| Influência da normalização | `normalizarSinal()` escala o sinal para max=1,5 mV; o limiar 5% escala proporcionalmente — sem impacto no método relativo |
| Complexos negativos | O código usa `rAmp = signal[r]` (valor do pico R); em leads onde R é negativo (ex: aVR), o cálculo fica inválido |
| Comportamento em V2 | Ver tabela abaixo — clipping pela janela de busca (artefato) |

#### Comportamento em complexos negativos

Em derivações onde o pico máximo não corresponde ao R anatômico (como aVR, onde o QRS é predominantemente negativo), `rAmp = signal[r]` seria zero ou negativo. O método não foi projetado para essas derivações e retorna resultados inválidos. Não auditado neste relatório.

#### Medição do mesmo complexo em DII, V1, V2, V5, V6 e I — normal_adulto e BRD

| Preset | Lead | Início (ms rel. R) | Fim (ms rel. R) | Duração (ms) | Amp R (mV) | Observação |
|---|---|---:|---:|---:|---:|---|
| normal_adulto | DII | −20 | +20 | **42** | 2,029 | Resultado válido |
| normal_adulto | V1 | −20 | +48 | **71** | 0,743 | Resultado parcial¹ |
| normal_adulto | V2 | −72 | +72 | **142** | 1,080 | ⚠ Clipping pela janela² |
| normal_adulto | V5 | −72 | +72 | **142** | 1,745 | ⚠ Clipping pela janela² |
| normal_adulto | V6 | −20 | +20 | **42** | 1,144 | Resultado válido |
| normal_adulto | I | −20 | +20 | **42** | 1,485 | Resultado válido |
| BRD | DII | −24 | +20 | **43** | 2,049 | Resultado válido |
| BRD | V1 | −24 | +52 | **60** | 0,750 | Resultado parcial¹ |
| BRD | V2 | −76 | +76 | **152** | 1,090 | ⚠ Clipping pela janela² |
| BRD | V5 | −76 | +76 | **152** | 1,760 | ⚠ Clipping pela janela² |
| BRD | V6 | −24 | +20 | **43** | 1,155 | Resultado válido |
| BRD | I | −24 | +20 | **43** | 1,500 | Resultado válido |

¹ V1: offset encontrado dentro da janela, mas mais distante que o onset — possivelmente influenciado pela onda S de V1 (lead precordial direito onde S é relativamente maior). Valor parcialmente confiável.

² **Artefato de clipping:** Em V2 e V5, o limiar 5% do pico R (ex: 5% × 1,08 = 0,054 mV) é muito baixo. A onda T (amplitude ~0,35–0,47 mV em V2) mantém o sinal acima desse limiar até além do limite da janela de busca (8% × RR ≈ ±72ms). O algoritmo atinge o fim da janela sem encontrar o threshold e retorna o valor máximo mensurável (2 × 8% × RR ≈ 142ms). **Esses valores de 142ms/152ms não representam duração de QRS e são inválidos.**

#### Conclusões da auditoria do método

1. **Valores em DII, V6, I (~42ms para normal e BRD) refletem apenas a largura do pico Gaussiano R** ao nível de 5% da amplitude. O modelo `gerarBatimento()` define R com largura σ = 0,010 × RR. A distância ao ponto de 5% é ±2,45σ ≈ ±0,0245 × RR ≈ ±21ms para RR=877ms → QRS ≈ 42ms. Confirma que o resultado é função do RR, não de propriedades morfológicas do preset.

2. **Nenhum lead produz estimativa do QRS anatômico completo.** O onset real do QRS (início do deflexo Q) estaria ~17ms antes do pico R no modelo Gaussiano, e o offset (J point após a onda S) estaria além da janela de busca em leads onde a onda T é proeminente. O método atual mede o núcleo do pico R, não o intervalo P-Q–S.

3. **Todos os valores de QRS desta auditoria devem ser tratados como provisórios** até implementação de método com detecção de J-point e baseline P-Q calibrado por derivação.

4. **Conclusão sobre BRD permanece válida:** mesmo com a imprecisão do método, o BRD apresenta os mesmos valores de QRS que o normal em todas as derivações confiáveis (DII, V6, I). Em V2, a diferença (142ms vs 152ms) é explicada inteiramente pela diferença de RR entre os dois presets (877ms vs 934ms → 8% × 877 × 2 = 140ms vs 8% × 934 × 2 = 149ms). **Não há evidência de alargamento morfológico no preset BRD**.

---

## 4. Capturas Visuais — Confirmação por Preset

### 4.1 normal_adulto

**Captura real obtida:** ✓
**UI exibida:** "ECG Normal — Adulto" no selector; traçado 12 derivações + faixa longa DII

**Achados visuais — morfologia isolada:**
- QRS estreito, P visível antes de cada QRS, T positiva em DII — morfologia plausível ✓
- Ritmo regular no strip DII ✓
- Progressão R V1→V4 visível ✓
- Morfologia consistente com traçado sinusal normal

**Achados visuais — compatibilidade no caso /caso/1:**
- Interpretação exibida: **"Taquicardia sinusal"** — classificação clinicamente correta para FC clínica = 102 bpm ✓
  - Mecanismo: política `estado_clinico` → FC clínica 102 bpm > 100 → classificado como taquicardia sinusal
  - A morfologia waveform permanece sinusal adulta sem outra alteração; apenas a faixa de frequência muda a classificação
- FC exibida: 102 bpm; Eixo: 60°; QTc: 325 ms (aleatório)
- **Problema pedagógico:** o nome "ECG Normal — Adulto" pode ser interpretado como frequência obrigatoriamente normal. Com FC clínica > 100 bpm, o preset exibe "Taquicardia sinusal" — o que está correto, mas confunde o aluno que espera ver "ritmo normal" por ter selecionado "ECG Normal"
- O item de ensino "FC 60–100 bpm é considerado normal" cria ambiguidade em relação ao nome do preset, não em relação à classificação exibida (que está correta para FC=102)

**Conclusão visual:** Morfologia sinusal adulta normal, com classificação do ritmo derivada da FC clínica. A classificação "Taquicardia sinusal" está correta para FC=102 bpm. O problema pedagógico é o nome do preset ("ECG Normal — Adulto"), que implica FC obrigatoriamente normal.

---

### 4.2 fibrilacao_atrial

**Captura real obtida:** ✓
**UI exibida:** "Fibrilação Atrial" no selector

**Achados visuais:**
- **Irregularidade RR visível** no strip DII: espaçamentos variáveis ✓ (RR CV = 14,1%)
- **Ausência de P organizada** em todas as derivações ✓ (amplitude P = 0,000 mV)
- **Baseline liso** — sem trama fibrilatória (ondas f) ✗ (energia ≈ 0 confirmada instrumentalmente)
- QRS estreito e morfologicamente igual ao normal (Gaussianas inalteradas)
- Interpretação: "Fibrilação atrial" ✓; FC: 102; Eixo: 60°; QTc: 341
- Pontos de ensino: menciona "trama fibrilatória fina (FA rápida) vs grosseira (FA lenta)" — **não observável no traçado gerado**

**Conclusão visual:** O critério diagnóstico primário (irregularidade RR) é visualmente verificável. Critério secundário (f-waves) ausente, com tensão entre o ensino prometido nos pontos e o que o traçado entrega.

---

### 4.3 flutter_atrial_2_1

**Captura real obtida:** ✓
**UI exibida:** "Flutter Atrial 2:1" no selector

**Achados visuais:**
- Ritmo rápido e regular ✓ (~12 QRS em 5s → FC ≈ 140 bpm, exibido como 150)
- **Sem padrão "dente de serra"** nas derivações inferiores (DII, DIII, aVF) ✗ — zero-crossings inter-QRS = 0
- QRS estreito (estimado em ~23ms) e morfologicamente idêntico ao normal
- Sem ondas F distintas detectáveis entre complexos QRS
- Interpretação: "Flutter atrial com condução 2:1" ✓; FC: 150 (política `preset` funciona ✓)
- Pontos de ensino: "Procurar padrão de ondas F em 'dente de serra'" — **não presente no traçado**

**Conclusão visual:** A FC e regularidade estão corretas. A característica morfológica definidora do flutter (ondas F a ~300 bpm em "dente de serra") está ausente. O traçado é indistinguível de uma taquicardia supraventricular regular sem acesso à interpretação textual.

---

### 4.4 bloqueio_ramo_direito

**Captura real obtida:** ✓
**UI exibida:** "Bloqueio de Ramo Direito" no selector

**Achados visuais:**
- **QRS visivelmente igual ao normal** — sem alargamento perceptível ✗
- **Sem padrão rSR' em V1** ✗ — morfologia de V1 idêntica à do preset normal
- **Sem S largo em V6** ✗ — S em V6 = 0,000 mV (instrumentalmente confirmado)
- S em DI presente (−0,390 mV) mas não largo/empastado
- Progressão R idêntica ao normal
- Ritmo e FC: 102 bpm (caso), regular
- Interpretação exibida: "Bloqueio de ramo direito"; FC: 102; Eixo: 60°; QTc: 423
- Pontos de ensino: "BRDE completo: QRS > 120 ms" — **QRS estimado: ~43ms** (provisório) — contradição visual direta independente da exatidão da medição

**Conclusão visual:** O BRD está visualmente incompatível porque não apresenta QRS largo, rSR' em V1/V2 nem S terminal larga em I/V6. Essa conclusão permanece válida mesmo que a duração exata de 43ms esteja imprecisa. O rótulo textual na interpretação é o único elemento que distingue este preset do normal.

---

### 4.5 iam_supra_anterosseptal

**Captura real obtida:** ✓
**UI exibida:** "IAM Anterosseptal" no selector

**Achados visuais:**
- **Supradesnivelamento de ST em V1–V3 visível** ✓ — ST take-off elevado comparado ao normal
- **V2 mais proeminente que V1 e V3** ✓ (área ST em mV·ms: V2=484 > V3=458 > V1=401 — valores relativos confiáveis; amplitude absoluta em mV não derivável diretamente desses valores)
- Morfologia precordial consistente com lesão subepicárdica anterosseptal
- Ausência de alterações recíprocas inferiores ✗ (documentado nos pontos de ensino: "não estão incluídas neste modelo")
- Interpretação completa exibida:
  - Diagnóstico principal: "IAM com supra de ST anterosseptal"
  - Laudo: "Ritmo sinusal, FC 102 bpm. Supradesnivelamento de ST em V1–V3..."
  - Achados: "Supradesnivelamento de ST em V1–V3" | "V2 com maior elevação de ST"
  - Alterações: "V1, V3: elevação de 0,30 mV" | "V2: elevação de 0,35 mV"
- FC: 102 (caso); Eixo: 60°; QTc: 382

**Conclusão visual:** O preset mais completo do lote. Critério diagnóstico primário (supra de ST em V1–V3) visualmente confirmado. V2 hierarquicamente correto. Laudo, achados e mapa ST preenchidos corretamente. Limitação conhecida (ausência de recíprocas) declarada nos pontos de ensino.

---

## 5. Comparação Estática vs. Visual/Instrumental

| Achado Estático | Preset | Status Visual |
|---|---|---|
| `prIntervalMs` não afeta traçado (PR real = 0.17×RR) | todos | **CONFIRMADO** — PR medido segue frações Gaussianas |
| `qrsDurationMs` não afeta traçado (QRS estimado ≈ 0.04–0.05×RR em DII) | todos | **CONFIRMADO** — BRD qrs=140ms declarado, estimado=43ms em DII |
| `axisProfile` ignorado (eixo hardcoded 60°) | todos | **CONFIRMADO** — UI exibe "Eixo: 60°" em todos |
| `QTc` calculado aleatoriamente | todos | **CONFIRMADO** — valores distintos a cada geração |
| FA: irregularidade RR | FA | **CONFIRMADO** — CV 14,1%, visível no strip DII |
| FA: ausência de P | FA | **CONFIRMADO** — amplitude P = 0,000 mV |
| FA: sem ondas f na baseline | FA | **CONFIRMADO** — energia TP ≈ 0 |
| Flutter FC preservada (política `preset`) | Flutter | **CONFIRMADO** — FC=150 na UI independente do caso |
| Flutter: sem ondas F serralhadas | Flutter | **CONFIRMADO** — zero-crossings = 0, não visível |
| BRD: sem rSR' em V1 | BRD | **CONFIRMADO** — morfologia V1 idêntica ao normal |
| BRD: sem S em V6 | BRD | **CONFIRMADO** — S V6 = 0,000 mV |
| `qrsPattern: 'rsR_prime_V1'` nunca lido | BRD | **CONFIRMADO** — campo existe no tipo mas pipeline ignora |
| IAM: área ST em V1–V3 ~ 3–4× acima do baseline | IAM | **CONFIRMADO** — área mV·ms: V1=401 vs 106 normal; V2=484 vs 141 |
| IAM: V2 hierarquicamente maior | IAM | **CONFIRMADO** — V2=484 > V3=458 > V1=401 mV·ms |
| IAM: sem alterações recíprocas | IAM | **CONFIRMADO** — DII/DIII/aVF em range normal |
| FC medida sempre inferior à FC alvo | todos | **CONFIRMADO** — déficit 7–25%; hipótese primária plausível, não confirmada pelos RR internos (§3.4) |
| normal_adulto: interpretação muda com FC do caso | Normal | **CONFIRMADO** — "Taquicardia sinusal" exibido (FC caso=102) |

---

## 6. Classificações Finais

### normal_adulto — Morfologia: **B** | Compatibilidade contextual: **C**

**Morfologia waveform (avaliação independente do caso):**
✓ P antes do QRS, QRS estreito, T coerente, progressão R plausível
✓ Ritmo sinusal regular, eixo 60° (fixo mas aceitável como referência)
→ **Grau B:** Morfologia adequada para representar ECG sinusal normal

**Compatibilidade no caso /caso/1 (FC clínica = 102 bpm):**
→ Classificação "Taquicardia sinusal" está correta para FC clínica = 102 bpm
→ A morfologia waveform continua sendo sinusal adulta normal — sem alteração patológica
→ O nome "ECG Normal — Adulto" é o problema pedagógico: pode ser interpretado como FC obrigatoriamente normal, mas o sistema usa a FC do caso para classificar o ritmo
→ **Grau C:** O nome do preset cria ambiguidade pedagógica no contexto de casos com FC > 100 bpm

> **Hipóteses de solução futura (registradas, não autorizadas):**
> - Renomear para "Morfologia Sinusal — Adulto", tornando explícito que o preset descreve a morfologia waveform, não a faixa de frequência
> - Separar "morfologia" de "classificação de frequência" no sistema de presets

> **Para uso seguro:** Usar com caso clínico cuja FC resulte na classificação esperada (ex: FC 60–100 bpm → "Ritmo sinusal"), ou adicionar nota explícita de que a classificação de frequência deriva da FC clínica do caso, não do preset.

---

### fibrilacao_atrial — **C** (Parcialmente correto)

**Morfologia:** ✓ Parcial — irregularidade RR presente, ausência de P presente; baseline sem f-waves
**Interpretação:** ✓ Correta — "Fibrilação atrial", ritmo, FC
**FC exibida:** ✗ 102 bpm (caso) — não reflete FC alvo do preset
**Ensinamento prometido vs. entregue:** ✗ Pontos de ensino mencionam "trama fibrilatória" ausente no traçado

> **Para uso seguro:** Adequado para ensinar irregularidade e ausência de P. Inadequado para ensinar a identificar f-waves. Adicionar disclaimer nos pontos de ensino sobre limitação da baseline sintética.

---

### flutter_atrial_2_1 — **D** (Insuficiente para uso educacional)

**Morfologia:** ✗ Ausência total das ondas F (critério diagnóstico primário do flutter)
**FC:** ✓ 150 bpm preservado (política `preset`)
**Regularidade:** ✓ Ritmo regular
**Diagnóstico diferencial:** ✗ Indistinguível de TSV regular sem a interpretação textual
**Contradição ensino/traçado:** ✗ "Procurar padrão de ondas F em 'dente de serra'" — impossível no traçado gerado

> **Não recomendado para uso** sem correção do motor de geração de ondas F. Aluno não pode desenvolver habilidade de reconhecimento visual de flutter a partir deste traçado.

---

### bloqueio_ramo_direito — **D** (Insuficiente para uso educacional)

**Morfologia:** ✗ Traçado visualmente idêntico ao normal em todos os critérios observáveis
**Padrão rSR':** ✗ Ausente em V1
**S largo em V6:** ✗ Ausente (0,000 mV)
**Contradição ensino/traçado:** ✗ "QRS > 120ms" nos pontos — traçado não apresenta QRS visualmente alargado

> **Não recomendado para uso.** O BRD está visualmente incompatível porque não apresenta QRS largo, rSR' em V1/V2 nem S terminal larga em I/V6. O rótulo textual "Bloqueio de ramo direito" é o único elemento diferenciador. Uso desta forma reforça incorretamente que um QRS estreito é compatível com BRDE.

---

### iam_supra_anterosseptal — **B** (Adequado com ressalvas documentadas)

**Morfologia:** ✓ Área ST em V1–V3 elevada (3–4× acima do baseline); V2 hierarquicamente correto
**Interpretação:** ✓ Completa — diagnóstico, laudo, achados, mapa ST
**Limitação declarada:** ✓ Pontos de ensino mencionam ausência de recíprocas
**FC exibida:** Menor que alvo (102 vs 108) — impacto mínimo para o ensino do IAM
**Eixo:** 60° fixo — aceitável para este preset

> **Pode ser usado** com a ressalva de que não há alterações recíprocas inferiores (já declarado). É o preset mais robusto do lote-piloto.

---

## 7. Tabela de Recomendações de Segurança

| Preset | Recomendação | Ação prioritária |
|---|---|---|
| normal_adulto | **Manter com aviso** | Adicionar disclaimer: "Interpretação depende da FC do caso. Caso com FC > 100 exibirá 'Taquicardia sinusal', não 'Ritmo sinusal'." |
| fibrilacao_atrial | **Manter com aviso** | Atualizar pontos de ensino para não mencionar f-waves como observáveis. Adicionar nota sobre baseline sintético. |
| flutter_atrial_2_1 | **Ocultar temporariamente** | Requer geração de ondas F serralhadas no motor antes do uso educacional. |
| bloqueio_ramo_direito | **Ocultar temporariamente** | Requer QRS visualmente alargado + rSR' em V1 + S terminal em I/V6. `qrsPattern: 'rsR_prime_V1'` existe no tipo mas não é consumido pelo pipeline. |
| iam_supra_anterosseptal | **Manter** | Preset de referência do lote. Pode ser usado conforme especificado. |

---

## 8. Problemas Transversais (todos os presets)

### P-1: FC sistematicamente inferior à FC alvo (7–25%)
**Causa hipotética (não comprovada):** A FC medida pelo algoritmo de detecção ficou inferior à FC solicitada. A causa ainda não foi comprovada. A hipótese principal é que a modulação LF em `gerarIntervalosRR()` (frequência 0,05 Hz) parte de zero e atinge seu pico positivo ao longo dos primeiros 5 segundos — exatamente o comprimento do sinal gerado — tornando todos os intervalos RR sistematicamente mais longos que o `RRMédio = 60/FC_alvo`. Hipóteses secundárias incluem: variabilidade RR estocástica (Box-Muller), batimentos incompletos nas bordas e `numeroIntervalos=12` fixo (potencialmente insuficiente para FC > 150 bpm). Nesta rodada, nenhum pico R foi rejeitado pela distância mínima de 300ms.
**Impacto:** Baixo para fins pedagógicos; FC exibida ao aluno é `targetHeartRate` (não medida), mascarando o déficit.

### P-2: FC do caso prevalece sobre FC do preset para todos exceto flutter
**Causa:** Política `estado_clinico` usa `patientHeartRate` do caso clínico. O caso 1 tem FC=102.
**Impacto:** Para o preset `normal_adulto`, a FC clínica de 102 bpm resulta na classificação "Taquicardia sinusal" — clinicamente correta para essa FC, mas potencialmente confusa dado o nome "ECG Normal — Adulto", que implica frequência obrigatoriamente normal.

### P-3: Eixo elétrico hardcoded (60°)
**Causa:** `transformarEm12Derivacoes(sinalProcessado, 60)` — argumento literal.
**Impacto:** `axisProfile` do preset (`normal`, `leftDeviation`, etc.) nunca aplicado.

### P-4: QTc aleatório
**Causa:** `Math.round((250 + Math.random() * 100) / Math.sqrt(rrMedio))` — não medido do sinal.
**Impacto:** QTc inconsistente entre gerações. Não deve ser usado para ensinar critérios de QT longo.

### P-5: Intervalos PR, QRS, QT declarados não afetam traçado
**Causa:** `gerarBatimento()` usa posições Gaussianas fixas como fração de RR. `prIntervalMs`, `qrsDurationMs`, `qtIntervalMs` do preset não são lidos no pipeline de síntese. Adicionalmente, `duracoesQRS` na interpretação é gerada aleatoriamente em `index.ts` (`65 + Math.random() * 35` ms), independente do traçado.
**Impacto:** Critérios de diagnóstico baseados em intervalos (BRD: QRS ≥120ms) não podem ser implementados sem mudança arquitetural no gerador.

---

## 9. Limitações desta Auditoria

1. **Capturas em escala reduzida:** O traçado está em escala de thumbnail na grade 4×3. Algumas nuances de morfologia (rSR' sutil, S leve em V6) poderiam ser visíveis em ampliação. Capturas individuais de derivação foram capturadas mas a resolução de thumbnail ainda limita análise submilimétrica.

2. **FC do caso:** Todas as capturas foram feitas com FC=102 do caso 1. Resultados de classificação (especialmente `normal_adulto`) seriam diferentes com um caso de FC normal (60–100 bpm).

3. **Uma única execução por preset:** Os valores aleatórios (QTc, RR variabilidade) refletem uma execução específica. Múltiplas execuções mostrariam variação nos parâmetros aleatórios.

4. **`medirDesnivelST` retorna área (mV·ms) não deflexão pontual (mV):** Os valores ST na tabela são integrais da janela Phase C, não leituras de ponto J. Os valores do preset (`amplitudeMv`) são deflexões pontuais; a comparação é apenas qualitativa — IAM mostrando 3–4× acima do baseline confirma elevação relativa, não a amplitude exata em mV ou mm.

5. **Medição de QRS provisória:** O método atual (5% do pico R, janela ±8% RR) captura apenas o núcleo Gaussiano do pico R. Em V2 e V5, os valores retornados são artefatos de clipping (142ms/152ms). A duração anatômica real do QRS gerado não é mensurável com este método.

6. **RR internos não acessíveis:** A auditoria do déficit de FC inferiu a causa a partir da estrutura do código (`gerarIntervalosRR`), sem acesso direto aos valores gerados (eles não são expostos na `RespostaGeracaoECG`). A hipótese da modulação LF é plausível mas requer rastreio dos intervalos gerados para confirmação.

---

## 10. Próximos Passos Recomendados

1. **Validar a hipótese de déficit de FC:**
   a. Expor temporariamente os intervalos RR gerados em `metadata` para auditoria
   b. Comparar RR gerados com RRMédio teórico por posição no tempo (verificar se aumentam ao longo dos 5 segundos)
   c. Confirmar ou refutar o papel da modulação LF em fase ascendente

2. **Validar o medidor de QRS antes de qualquer correção morfológica no motor:**
   a. Implementar detecção de J-point (ponto após S antes da onda T) com threshold no baseline P-Q
   b. Comparar resultados em DII, I, V5 (leads com R dominante e S pequena)
   c. Só após validação do medidor decidir se o motor realmente não gera o QRS correto

3. **Observação para eventual correção de BRD (não autorizada ainda):**
   O BRD está visualmente incompatível porque não apresenta QRS largo, rSR' em V1/V2 nem S terminal larga em I/V6. Qualquer abordagem de correção deve ser precedida por (a) medidor de QRS validado e (b) decisão arquitetural sobre como o motor widening seria implementado.

4. **Correção de ondas F para flutter:**
   Requer gerador de ondas F a ~300 bpm com morfologia serralhada nas derivações inferiores. Esta é a correção mais impactante para uso educacional.

5. **Correção rápida — Interpretação:**
   a. `normal_adulto`: avaliar renomear para "Morfologia Sinusal — Adulto" ou adicionar nota explícita de que a classificação de frequência deriva da FC clínica do caso
   b. Todos: QTc medido do sinal (não aleatório)

6. **Auditoria do próximo lote:** Após correções, re-auditar os 5 presets + expandir para `taquicardia_sinusal_adulto`, `bradicardia_sinusal`, `bloqueio_ramo_esquerdo`

---

## 11. Correções Metodológicas Após Revisão

Esta seção registra as correções feitas ao relatório após revisão técnica crítica da versão anterior.

### 11.1 Causa do déficit de FC — reclassificada como hipótese

**Versão anterior:** atribuía o déficit de FC a `normalizarSinal()` em `ecgsynAdapter.ts`.

**Correção:** `normalizarSinal()` escala amplitude, não tempo. Não altera quantidade de amostras, posição dos batimentos, intervalo RR, nem duração do sinal. Portanto, não é causa do déficit de FC. A causa ainda não foi comprovada. A hipótese primária atualmente é o viés de fase da modulação LF durante a janela de 5 segundos (ver §3.4 e §P-1). A frase "FC inferior à FC solicitada. A causa ainda não foi comprovada" substitui a atribuição direta anterior.

### 11.2 Medição de QRS — marcada como provisória

**Versão anterior:** apresentava valores como "QRS medido = 43ms" com caráter definitivo.

**Correção:** Os valores de QRS desta auditoria refletem a largura do pico Gaussiano R ao nível de 5% da amplitude em DII, com search window clipando em V2 e V5 (artefato). A duração anatômica do QRS não é mensurável com este método. Todos os valores estão agora marcados como "QRS estimado pelo algoritmo atual = X ms, valor provisório até validação do método de início e fim do complexo."

### 11.3 normal_adulto — separado em duas avaliações

**Versão anterior:** classificação única **C**.

**Correção:** duas avaliações distintas:
- Morfologia waveform isolada: **B** — P, QRS estreito, T coerente, progressão R plausível
- Compatibilidade contextual no caso /caso/1 (FC=102): **C** — o nome "ECG Normal — Adulto" cria ambiguidade pedagógica (a classificação "Taquicardia sinusal" exibida está correta para FC=102, mas contradiz a expectativa gerada pelo nome do preset)

As hipóteses de solução futura (renomear para "Morfologia Sinusal — Adulto" ou separar morfologia de classificação de frequência) foram registradas sem autorizar implementação.

### 11.4 Área ST do IAM — tratada explicitamente como integral

**Versão anterior:** tabela indicava valores ST sem ênfase suficiente na unidade.

**Correção:** seção §3.2 expandida com nota explícita: valores são integrais em mV·ms (área), não amplitude pontual em mV. Não devem ser usados para afirmar "X mm de supra". A conclusão relativa (IAM ~ 3–4× acima do baseline; V2 mais proeminente) permanece válida.

### 11.5 qrsWidenFactor — implementação não autorizada

**Versão anterior:** seção 10 sugeria "Implementar `qrsWidenFactor` para alargar QRS baseado em `qrsDurationMs`".

**Correção:** essa implementação está condicionada a (a) validação prévia do medidor de QRS e (b) confirmação de que o motor realmente não gera QRS adequado para o BRD. A sugestão foi substituída pela observação sobre incompatibilidade visual e pela exigência de validação antes de qualquer mudança no motor.

### 11.6 Decisões de segurança — mantidas

- normal_adulto: **manter com aviso**
- fibrilacao_atrial: **manter com aviso**
- flutter_atrial_2_1: **ocultar temporariamente**
- bloqueio_ramo_direito: **ocultar temporariamente**
- iam_supra_anterosseptal: **manter**

---

*Relatório gerado após auditoria visual + instrumental completa do lote-piloto com revisão metodológica. Nenhum arquivo de código, configuração, preset ou interface do projeto foi modificado. Somente este relatório não rastreado foi atualizado. Nenhum commit foi criado e nenhum push foi realizado.*
