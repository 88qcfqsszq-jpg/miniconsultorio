# Relatório de Auditoria — Divergência entre FC Solicitada e FC Gerada no ECG

**Data:** 2026-07-15 (v4 — auditoria D3: malha fechada pelo detector real)  
**Escopo:** Presets normal_adulto, fibrilacao_atrial, flutter_atrial_2_1, bloqueio_ramo_direito, iam_supra_anterosseptal  
**Status:** Somente auditoria. Nenhum arquivo de produção foi alterado. Nenhum commit. Nenhum push.

---

## Correção conceitual obrigatória (v2)

**Multiplicar todos os intervalos RR por uma constante comum preserva:**

- a razão entre os intervalos;
- o coeficiente de variação;
- a ordem dos intervalos;
- o padrão relativo de irregularidade.

A distorção somente pode ocorrer se houver clipping posterior em 0,3–2,0 s ou se o fator for calculado sobre uma janela inadequada (RRs fora da janela de exibição).

Dados da Fase 5 confirmam: CV(A)=0,167 vs CV(D)=0,168 para FA — preservação completa do padrão de irregularidade. Clips=0 para D contra clips=329 para B (fase aleatória) em FA. A afirmação anterior de que o escalonamento poderia distorcer a FA foi incorreta.

---

## 1. Resumo executivo

A FC medida nos arrays finais é sistematicamente menor que a FC solicitada em todos os presets. A divergência é determinística — não causada por ruído aleatório — e varia de **6,3 % a 28,1 %** dependendo do preset e FC clínica.

**Causa principal confirmada:** modulação LF (0,05 Hz) e HF (0,15 Hz) com fase inicial = 0, percorrendo o semiciclo positivo na janela de 5 s. Intervalos RR sistematicamente longos → menos batimentos na janela → FC detectada baixa.

**A FC exibida na UI não é afetada:** `interpretation.frequenciaCardiaca` = FC alvo (valor clínico). O déficit ocorre exclusivamente no traçado físico.

**Resumo comparativo das estratégias (por ECG individual, 1000 execuções, 5 s):**

| Estratégia | ≤1 bpm (pior preset) | ≤2 bpm (pior preset) | Clips | FC_max_segura |
|---|---|---|---|---|
| A (atual) | 0 % | 0 % | 0 | qualquer |
| B (fases aleatórias) | ~10–27 % | ~10–27 % | 329 em FA | qualquer |
| C (centralização) | 0 % (FA) | 0 % (FA) | 0 | qualquer |
| D (escalonamento global) | 0 % (IAM) | 44 % (IAM) | 0 | qualquer |
| D2 (janela efetiva) | 7 % (FA) | **99 % (FA)** | 0 | 185 bpm |
| D3 (malha fechada) | 18,6 % (FA) | 96,4 % (FA) | 0 | 180 bpm |

**Nenhuma estratégia atinge ≥99 % dentro de ±1 bpm para FA@110 em 5 s.** Causa raiz: com ~8 picos detectados e rrVar=0,30, a contagem de picos visíveis oscila entre 7 e 9 dependendo da posição da janela, introduzindo variação intrínseca de ±2 bpm no FC medida — piso de quantização irredutível com o detector atual.

**D2 melhor para FA@110 × 5 s** (99 % ≤2bpm vs 96,4 % de D3). **D3 melhor para presets de baixo rrVar** (100 % ≤1bpm vs D2's 100 % — empate, mas D3 usa menos iterações). **D3 instável a FC ≥ 185 bpm** (cascata por picos rejeitados).

---

## 2. Cadeia completa da FC

```
patientHeartRate (props) / ecgPreset.heartRate
        ↓
resolverFrequencia()  [index.ts:90]
  politica: 'estado_clinico' → prevalece patientHeartRate se válida
  politica: 'preset'         → sempre ecgPreset.heartRate
        ↓
frequenciaResolvida  [index.ts:174]  → VALOR CLÍNICO ÚNICO
        ↓
parametrosECGSyn.frequenciaCardiaca [index.ts:178]
        ↓
gerarSinalECGSyn(parametrosECGSyn)  [ecgsynAdapter.ts:156]
    ↓
    gerarIntervalosRR(N=12, FC, rrVar, razaoLFHF=1.0, fs=250)  [ecgsynAdapter.ts:51]
        RRMedio = 60 / FC
        ampHF = sqrt(rrVar / (1+1,0))
        ampLF = ampHF × 1,0   ← igual a ampHF para razaoLFHF=1,0
        tempo = 0
        para i=0..11:
            modHF = ampHF × sin(2π × 0,15 × tempo)   ← FASE INICIAL = 0
            modLF = ampLF × sin(2π × 0,05 × tempo)   ← FASE INICIAL = 0
            ruido = Box-Muller × rrVar × 0,1
            RR = clamp(RRMedio × (1 + modHF + modLF + ruido), 0,3, 2,0)
            tempo += RR
        → 12 intervalos RR em segundos
    ↓
    loop de amostras: 1250 amostras (5s × 250 Hz)
        cada amostra avança tFrac = tempoNoIntervalo / RRAtual
        gerarBatimento(tFrac, amp) → gaussianas P-QRS-T
    ↓
aplicarFiltroPassaAlta(0,5 Hz, α≤0,02) → efeito mínimo sobre timing
normalizarSinal(ganho=1,0) → escala amplitude, sem efeito sobre RR
transformarEm12Derivacoes(sinal, 60°)
aplicarModificadoresPorDerivacao(...)
        ↓
calcularMetricasECG(sinalProcessado, 250, parametros)
    detectarComplexosQRS → threshold = max(|sinal|)×0,6, distMin=300ms
    intervalosRR_ms = diff(picos) / 250 × 1000
    fcMedia = 60000 / mean(intervalosRR_ms)
    → metricas.frequenciaCardiaca = round(fcMedia)
        ↓
metadata.measuredHeartRate = metricas.frequenciaCardiaca   → AUDITORIA TÉCNICA
interpretation.frequenciaCardiaca = frequenciaResolvida    → EXIBIDA NA UI
```

| Variável | Arquivo:linha | Unidade | Tipo |
|---|---|---|---|
| `patientHeartRate` | props | bpm | entrada externa |
| `ecgPreset.heartRate` | preset | bpm | definido no preset |
| `frequenciaResolvida` | index.ts:174 | bpm | resolvido por política |
| `RRMedio` | ecgsynAdapter.ts:59 | s | derivado de FC |
| `ampHF = ampLF` | ecgsynAdapter.ts:62-63 | adim. | = sqrt(rrVar/2) |
| `RR[i]` | ecgsynAdapter.ts:81 | s | gerado com modulação |
| `metricas.frequenciaCardiaca` | ecgsynAdapter.ts:311 | bpm | medido no sinal |
| `metadata.targetHeartRate` | index.ts:366 | bpm | = frequenciaResolvida |
| `metadata.measuredHeartRate` | index.ts:367 | bpm | medido |
| `interpretation.frequenciaCardiaca` | index.ts:288 | bpm | = frequenciaResolvida |

---

## 3. Validação determinística da réplica contra generateECG() (v3 — 100 seeds × 6 presets)

RNG Mulberry32 com seed S aplicado globalmente antes de cada chamada: réplica e `generateECG()` consomem as mesmas 2 × N chamadas de `Math.random()` (Box-Muller para RR) na mesma ordem.

| Preset | FC clínica | Seeds | Diff máx. (réplica vs produção) | Diff média | Dentro ≤1 bpm |
|---|---|---|---|---|---|
| normal_adulto | 75 bpm | 100 | **0 bpm** | 0,00 bpm | 100 % |
| fibrilacao_atrial | 110 bpm | 100 | **0 bpm** | 0,00 bpm | 100 % |
| flutter_atrial_2_1 | 150 bpm | 100 | **0 bpm** | 0,00 bpm | 100 % |
| bloqueio_ramo_direito | 70 bpm | 100 | **0 bpm** | 0,00 bpm | 100 % |
| iam_supra_anterosseptal | 108 bpm | 100 | **0 bpm** | 0,00 bpm | 100 % |
| normal_adulto (FC=102) | 102 bpm | 100 | **0 bpm** | 0,00 bpm | 100 % |

**Conclusão:** réplica = produção de forma bit a bit (diff=0 em 100 % dos casos, 600 pares testados). Todos os resultados de estratégias D e D2 são aplicáveis ao comportamento real de `generateECG()`.

---

## 4. Estatísticas de 100 execuções por preset (Fase 4 — auditoria anterior)

Confirmado: déficit com DP < 0,7 bpm em todos os presets com estratégia A. Causa determinística.

| Preset | FC alvo | FC média (A) | Déficit |
|---|---|---|---|
| normal_adulto | 75 | 68,6 | 8,6 % |
| fibrilacao_atrial | 120 | 90,5 | 24,6 % |
| flutter_atrial_2_1 | 150 | 140,6 | 6,3 % |
| bloqueio_ramo_direito | 75 | 68,6 | 8,6 % |
| iam_supra_anterosseptal | 75 | 66,5 | 11,4 % |

---

## 5. Comparação de estratégias — 1000 execuções, duração 5 s (Fases 2+4+D2)

### 5.1 Definição das estratégias

**A — Atual:** LF e HF com fase inicial = 0.

**B — Fases aleatórias:** fase LF ∈ U(0, 2π), fase HF ∈ U(0, 2π), independentes.

**C — Centralização dos componentes:** Pre-computa modLF[i], modHF[i] e ruido[i] no tempo nominal (i × RRmédio), subtrai a média de cada sequência, aplica ao RRmédio. Garante soma(componentes) = 0 por construção.

**D — Escalonamento global:** Gera RRs pelo método A, calcula fator = RRmédio_nominal / média(TODOS os RRs gerados), multiplica todos pelo fator.

**D2 — Escalonamento sobre janela efetiva (iterativo):**
1. Gera N = ⌈duração / RRnom⌉ + 4 intervalos (N > 12 para durações longas).
2. Simula o loop de amostras (250 Hz) para identificar picos R analíticos na janela (tFrac = 0,23 dentro de cada intervalo).
3. Calcula fator = RRnom / média_do_intervalo_entre_picos_visíveis.
4. Escala TODOS os RRs pelo fator; clamp [0,3 s, 2,0 s] aplicado depois da escala.
5. Itera até 3 vezes se |fcJanela − FCAlvo| > 0,5 bpm.
6. Valida FC final pelo detector de produção sobre o sinal completo.

> **Preservação matemática (D e D2 sem clips):** multiplicar todos os RRs por uma constante preserva CV, RMSSD/média, ordem relativa e razão máx/mín. Confirmado empiricamente (§7): Pearson = 1,0000, CV ratio = 1,0000 em 200 seeds × 2 presets.

**E — C + D:** Aplica centralização (C) e depois escalonamento proporcional residual (D).

### 5.2 Resultados por preset e estratégia (1000 runs, 5 s)

#### normal_adulto (FC=75, rrVar=0,02)

| Estratégia | Média | DP | ErrMed | ≤1 bpm | ≤2 bpm | ≤5 bpm | >5 bpm | Clips | Iters |
|---|---|---|---|---|---|---|---|---|---|
| A (atual) | 68,6 | 0,49 | 6,39 | 0 % | 0 % | 0 % | 100 % | 0 | — |
| B (aleatório) | 75,9 | 5,52 | 4,77 | — | 24,5 % | 63,5 % | 36,5 % | — | — |
| C (centrado) | 74,0 | 0,04 | 1,00 | — | 100 % | 100 % | 0 % | 0 | — |
| D (escala global) | 74,75 | 0,43 | 0,25 | 100 % | 100 % | 100 % | 0 % | 0 | — |
| **D2 (janela efet.)** | **75,00** | **0,05** | **0,00** | **100 %** | **100 %** | **100 %** | **0 %** | **0** | **2,0** |
| E (C+D) | 74,0 | 0,05 | 1,00 | — | 100 % | 100 % | 0 % | 0 | — |

#### fibrilacao_atrial (FC=110, rrVar=0,30)

| Estratégia | Média | DP | ErrMed | ≤1 bpm | ≤2 bpm | ≤5 bpm | >5 bpm | Clips | Iters |
|---|---|---|---|---|---|---|---|---|---|
| A (atual) | 81,9 | 0,67 | 28,1 | 0 % | 0 % | 0 % | 100 % | 0 | — |
| B (aleatório) | 108,4 | 17,6 | 14,8 | — | 10,1 % | 22,0 % | 78 % | 329 | — |
| C (centrado) | 99,2 | 0,71 | 10,8 | — | 0 % | 0 % | 100 % | 0 | — |
| D (escala global) | 111,6 | 0,53 | 1,65 | 36,4 % | 98,4 % | 100 % | 0 % | 0 | — |
| **D2 (janela efet.)** | **111,9** | **0,50** | **1,94** | **7 %** | **99 %** | **100 %** | **0 %** | **0** | **3,0** |
| E (C+D) | 99,3 | 0,71 | 10,7 | — | 0 % | 0 % | 100 % | 0 | — |

> Nota D2 FA: FC média = 111,9 vs alvo 110. Deslocamento residual de +1,9 bpm. Causa: com rrVar=0,30, a quantização em 250 Hz produz intervalos entre picos que em média ficam 4 ms acima do nominal. 99 % dos ECGs ficam dentro de ±2 bpm; ≤1 bpm em apenas 7 % (quantização limita). Sem clips.

#### flutter_atrial_2_1 (FC=150, rrVar=0,01)

| Estratégia | Média | DP | ErrMed | ≤1 bpm | ≤2 bpm | ≤5 bpm | >5 bpm | Clips | Iters |
|---|---|---|---|---|---|---|---|---|---|
| A (atual) | 140,9 | 0,29 | 9,09 | 0 % | 0 % | 0 % | 100 % | 0 | — |
| D (escala global) | 149,8 | 0,38 | 0,18 | 100 % | 100 % | 100 % | 0 % | 0 | — |
| **D2 (janela efet.)** | **150,0** | **0,03** | **0,00** | **100 %** | **100 %** | **100 %** | **0 %** | **0** | **2,0** |

#### bloqueio_ramo_direito (FC=70, rrVar=0,02)

| Estratégia | Média | DP | ErrMed | ≤1 bpm | ≤2 bpm | Clips | Iters |
|---|---|---|---|---|---|---|---|
| A (atual) | 64,0 | 0,00 | 6,00 | 0 % | 0 % | 0 | — |
| D (escala global) | 69,0 | 0,00 | 1,00 | 100 % | 100 % | 0 | — |
| **D2 (janela efet.)** | **70,0** | **0,00** | **0,00** | **100 %** | **100 %** | **0** | **1,0** |

#### iam_supra_anterosseptal (FC=108, rrVar=0,04)

| Estratégia | Média | DP | ErrMed | ≤1 bpm | ≤2 bpm | ≤5 bpm | >5 bpm | Clips | Iters |
|---|---|---|---|---|---|---|---|---|---|
| A (atual) | 95,1 | 0,25 | 12,9 | 0 % | 0 % | 0 % | 100 % | 0 | — |
| B (aleatório) | 110,1 | 11,3 | 9,84 | — | 10,6 % | 27,1 % | 72,9 % | — | — |
| C (centrado) | 104,0 | 0,03 | 4,00 | — | 0 % | 100 % | 0 % | 0 | — |
| D (escala global) | 105,5 | 0,50 | 2,55 | 0 % | 45,3 % | 100 % | 0 % | 0 | — |
| **D2 (janela efet.)** | **108,0** | **0,00** | **0,00** | **100 %** | **100 %** | **100 %** | **0 %** | **0** | **2,5** |
| E (C+D) | 104,0 | 0,00 | 4,00 | — | 0 % | 100 % | 0 % | 0 | — |

> **D2 é decisivo no IAM@108:** 100 % vs 45,3 % de D. A causa do fracasso de D global: os 12 RRs gerados incluem RRs tardios (além da janela de 5 s) com modulação HF negativa que reduz a média global e faz o fator ≈ 0,98, insuficiente para corrigir totalmente. D2 mede apenas os picos dentro da janela (6–7 batimentos) e calcula o fator correto.

#### normal_adulto FC=102 (teste política estado_clinico)

| Estratégia | Média | DP | ErrMed | ≤1 bpm | ≤2 bpm | Clips | Iters |
|---|---|---|---|---|---|---|---|
| A (atual) | 93,0 | 0,00 | 9,00 | 0 % | 0 % | 0 | — |
| D (escala global) | 100,9 | 0,32 | 1,12 | 88 % | 100 % | 0 | — |
| **D2 (janela efet.)** | **102,0** | **0,00** | **0,00** | **100 %** | **100 %** | **0** | **2,0** |

### 5.3 Por que C falha para FA mas D/D2 não

C calcula as fases LF/HF usando tempo nominal (i × RRmédio) como base, o que elimina o viés das fases mas não o acúmulo real de tempo. Para rrVar=0,30, a diferença entre tempo nominal e tempo real acumulado cria um viés residual de ~10 bpm. D e D2 contornam isso diretamente: medem o efeito nos RRs já gerados e corrigem proporcionalmente — independente de como o viés surgiu.

### 5.4 Por que B falha por ECG individual

B elimina o viés médio (esperado) mas introduz alta variância (DP=7–18 bpm). Apenas 10–27 % dos ECGs individuais ficam dentro de ±2 bpm da FC solicitada. Para FA, 78 % dos ECGs ficam >5 bpm fora do alvo. Além disso, B produz 329 clips em FA (contra 0 para D), porque fases grandes com rrVar=0,30 empurram RRs para fora do intervalo [0,3 s, 2,0 s].

**B é a pior estratégia para exatidão por ECG individual.**

### 5.5 Estratégia D3 — malha fechada pelo detector real

**Definição:**
```
1. Gerar N RRs pelo método A (N = ceil(dur/RRnom) + 4)
2. Gerar sinal completo
3. Medir FC pelo detector real (detectarComplexosQRS + calcularMetricasECG)
4. fator = FC_medida / FC_alvo
   → FC_medida=82, FC_alvo=110: fator=0,745 → RRs menores → mais batimentos
5. RR[i] = clamp(RR[i] × fator, 0,3 s, 2,0 s)
6. Repetir passos 2–5 até max 5 iterações
7. Parar quando |FC_medida − FC_alvo| ≤ 1 bpm
8. Abortar se picos < 2 ou FC_medida = 0
```

**Resultados D3 vs D2 (1000 seeds, 5 s):**

| Preset | D2: ≤1bpm | D2: ≤2bpm | D3: ≤1bpm | D3: ≤2bpm | D3 errMax | D3 clips | D3 conv% | D3 iters_med |
|---|---|---|---|---|---|---|---|---|
| normal@75 | 100 % | 100 % | **100 %** | **100 %** | 1 | 0 | 100 % | 1,16 |
| **FA@110** | **7 %** | **99 %** | **18,6 %** | **96,4 %** | 3 | 0 | 19 % | 4,53 |
| flutter@150 | 100 % | 100 % | **100 %** | **100 %** | 1 | 0 | 100 % | 1,00 |
| BRD@70 | 100 % | 100 % | **100 %** | **100 %** | 1 | 0 | 100 % | 1,00 |
| IAM@108 | 100 % | 100 % | **100 %** | **100 %** | 1 | 0 | 100 % | 1,79 |
| normal@102 | 100 % | 100 % | **100 %** | **100 %** | 1 | 0 | 100 % | 1,00 |

**D2 é superior para FA@110 em 5 s** (99 % vs 96,4 % dentro de ±2 bpm). D3 oscila porque o detector retorna FC inteira e o número de picos visíveis (7, 8 ou 9) varia por quantização, não por imprecisão de correção. D2 usa o pico analítico (tFrac=0,23) que é mais estável para calcular o fator.

### 5.6 Piso de quantização irredutível para FA@110 em 5 s

| Fonte de variação | Valor | Impacto em FC |
|---|---|---|
| Número de picos visíveis | 7–9 (rrVar=0,30) | ±2–3 bpm por run |
| Quantização do detector a 250 Hz | ±4 ms por pico | ±0,4 bpm (mean de 8) |
| Math.round() em calcularMetricasECG | ±0,5 bpm | intrínseco |

**Conclusão:** com ~8 picos em 5 s e rrVar=0,30, a variação de ±1 bpm no detector é intrínseca ao sinal. Nenhuma estratégia pode garantir ≥99 % ≤1bpm com o detector atual sem aumentar a janela de tempo ou adicionar histerese ao round().

---

## 6. Preservação da variabilidade

### 6.1 Comparação entre estratégias (sequências independentes)

#### normal_adulto (FC=75, rrVar=0,02)

| Estratégia | CV médio | RMSSD | Razão máx/mín | Clips |
|---|---|---|---|---|
| A (atual) | 0,0509 | 0,0444 | 1,152 | 0 |
| B (aleatório) | 0,0882 | 0,0437 | 1,321 | 0 |
| C (centrado) | 0,0562 | 0,0397 | 1,168 | 0 |
| **D/D2 (escala)** | **0,0508** | **0,0412** | **1,151** | **0** |
| E (C+D) | 0,0563 | 0,0397 | 1,169 | 0 |

#### fibrilacao_atrial (FC=110, rrVar=0,30)

| Estratégia | CV médio | RMSSD | Razão máx/mín | Clips |
|---|---|---|---|---|
| A (atual) | 0,1671 | 0,0963 | 1,628 | 0 |
| **B (aleatório)** | **0,2625** | **0,0770** | **2,141** | **329** |
| C (centrado) | 0,2184 | 0,0794 | 1,867 | 0 |
| **D/D2 (escala)** | **0,1679** | **0,0768** | **1,629** | **0** |
| E (C+D) | 0,2173 | 0,0784 | 1,857 | 0 |

### 6.2 Teste correto de preservação (MESMA sequência A → D2/D3, 200 seeds)

Para isolar o efeito da correção, cada seed gera UMA sequência A e aplica D2/D3 à CÓPIA da mesma sequência — sem regenerar os RRs.

| Preset | Estrat. | Pearson | Spearman | CV ratio | RMSSD_norm ratio | Razão max/min | Inversões | Clips | Fator prod. |
|---|---|---|---|---|---|---|---|---|---|
| normal@75 | D2 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 0 | 0 | 0,914 |
| normal@75 | D3 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 0 | 0 | 0,918 |
| FA@110 | D2 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 0 | 0 | 0,744 |
| FA@110 | D3 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 1,00000 | 0 | 0 | 0,790 |

**D2 e D3 sem clips são matematicamente equivalentes a multiplicar todos os RRs por um escalar:** Pearson = Spearman = 1, CV preservado, RMSSD/média preservado, zero inversões de ordem. D3 aplica fatores multiplicativos sequenciais (produto final ≈ 0,790 para FA), que matematicamente é equivalente a um único escalar.

**B distorce substancialmente** o padrão de irregularidade (CV: 0,167 → 0,263; clips=329 em FA). Inaceitável para simulação clínica de FA.

---

## 7. Efeito da duração (200 seeds por combinação)

### 7.1 A × D × D2 × D3 por duração e preset

| Preset | Dur | Estrat. | Média | DP | ≤1 bpm | ≤2 bpm | ErrMax | Clips | Notas |
|---|---|---|---|---|---|---|---|---|---|
| normal@75 | 5 s | A | 68,6 | 0,49 | 0 % | 0 % | 7 | 0 | base |
| | | D | 75,0 | 0,00 | 100 % | 100 % | 0 | 0 | |
| | | D2 | 75,0 | 0,07 | 100 % | 100 % | 1 | 0 | |
| | | **D3** | **75,3** | **0,72** | **100 %** | **100 %** | **1** | **0** | |
| normal@75 | 10 s | A | 69,0 | 0,00 | 0 % | 0 % | 6 | 0 | |
| | | D | 71,0 | 0,00 | 0 % | 0 % | 4 | 0 | D piora |
| | | D2 | 75,0 | 0,00 | 100 % | 100 % | 0 | 0 | ✓ |
| | | **D3** | **75,1** | **0,26** | **100 %** | **100 %** | **1** | **0** | **✓** |
| normal@75 | 30 s | A | 73,7 | 0,45 | 72 % | 100 % | 2 | 0 | A melhora |
| | | D | 74,0 | 0,00 | 100 % | 100 % | 1 | 0 | |
| | | D2 | 75,0 | 0,00 | 100 % | 100 % | 0 | 0 | |
| | | **D3** | **74,3** | **0,45** | **100 %** | **100 %** | **1** | **0** | **✓** |
| FA@110 | 5 s | A | 81,8 | 0,68 | 0 % | 0 % | 30 | 0 | |
| | | D | 114,5 | 0,58 | 0 % | 0 % | 6 | 0 | D supercorrige |
| | | **D2** | **111,9** | **0,46** | **6 %** | **99,5 %** | **3** | **0** | **melhor ≤2bpm** |
| | | D3 | 111,7 | 0,94 | 15 % | 95 % | 3 | 0 | ≤2bpm pior |
| FA@110 | 10 s | A | 84,6 | 0,62 | 0 % | 0 % | 27 | 0 | |
| | | D | 87,9 | 0,40 | 0 % | 0 % | 23 | 0 | D falhou |
| | | D2 | 116,8 | 2,18 | 0 % | 3 % | 8 | 0 | ⚠ FALHA |
| | | **D3** | **108,3** | **2,02** | **59,5 %** | **59,5 %** | **5** | **134** | **melhor que D2** |
| FA@110 | 30 s | A | 99,1 | 0,85 | 0 % | 0 % | 13 | 0 | |
| | | **D** | **109,2** | **0,47** | **97 %** | **100 %** | **2** | **0** | **melhor 30s** |
| | | D2 | 109,8 | 1,61 | 98 % | 98 % | 12 | 57 | ⚠ clips |
| | | D3 | 109,2 | 0,38 | 100 % | 100 % | 1 | 3622 | ⚠ clips maciços |

### 7.2 Análise do fracasso de D em janelas longas

**Causa:** fator calculado sobre TODOS os RRs gerados. Em 10 s e 30 s, os RRs tardios têm modulação LF/HF negativa (completam mais ciclos), compensando o viés inicial. O fator → 1 e não corrige a janela de exibição.

### 7.3 Análise do fracasso de D2 em FA@110 × 10 s

D2 corrigiu D para a janela de 5 s (99,5 % dentro de ±2 bpm), mas **falha para FA em 10 s (FC média = 116,8, errMax = 8 bpm, ≤2 bpm = 3 %)**. Hipóteses:

1. **Divergência analítico × detector:** Com rrVar=0,30 e ~18 picos em 10 s, a simulação analítica (tFrac=0,23) diverge mais do detector real (baseado em amplitude). O fator calculado é impreciso.
2. **Interação iterações × quantização:** 3 iterações com step finito em 250 Hz e rrVar alto criam oscilação ao redor do ótimo em vez de convergência.
3. **Limite seguro para D2:** FA@110 em 10 s é um caso extremo (rrVar=0,30, ~18 picos, fator de correção ≈ 0,75). O caso de uso primário (5 s) funciona bem.

**Para 30 s, FA com D parece suficiente** (FC média = 109,2, 100 % ≤2 bpm). D2 em 30 s com FA introduz clips (57 em 200 seeds) — o escalonamento forte (fator≈0,74) com muitos RRs eleva a chance de hits no clamp.

### 7.4 Análise dos clips em D3 × 30 s

**FA@110 × 30s com D3:** 3622 clips em 200 seeds × N_RRs. Causa: para cobrir 30 s a FA@110 (RRnom=545ms), o script gera 59 RRs. D3 aplica fator ≈ 0,790 iterativamente. Com rrVar=0,30, os RRs mais curtos (≈380ms) depois de ×0,790 = 300ms → clamped. Em 30 s há muito mais RRs do que em 5 s, portanto o número absoluto de clips cresce. O resultado (100 % ≤2bpm) é enganoso — a variabilidade FA está distorcida pelo clamp.

**D global para FA@110 × 30 s:** FC média = 109,2 (100 % ≤2bpm), 0 clips, DP=0,47. Nenhum clamp porque o fator LF/HF cancela-se parcialmente em 30 s. D global é a melhor estratégia para durações longas com FA.

### 7.5 Resumo de durações por estratégia

| Condição | A | D | D2 | D3 | Recomendação |
|---|---|---|---|---|---|
| Qualquer preset exceto FA, 5 s | FALHA | OK | OK | **OK** | D3 (menos iters) |
| FA@110, 5 s | FALHA | supercorrige | **99 % ≤2bpm** | 96,4 % ≤2bpm | **D2** |
| Normal, 10 s e 30 s | FALHA | OK | OK | **OK** | D3 |
| FA@110, 10 s | FALHA | FALHA | ⚠ 3 % | 59,5 % | **D3** (melhor disponível) |
| FA@110, 30 s | FALHA | **100 % 0 clips** | 98 % + clips | 100 % + 3622 clips | **D global** |

---

## 8. Limites clínicos e auditor do detector (200 seeds por FC, rrVar=0,02, 5 s)

### 8.1 Limite preciso do detector de QRS

```
Código:  if (complexos.length === 0 || indicePico - complexos[ultimo] > fs × 0,3)
Em 250 Hz: fs × 0,3 = 75 amostras
Condição ESTRITA (>), não ≥
→ distância mínima ACEITA = 76 amostras = 304,0 ms
→ FC máxima teórica = 60 000 / 304 ≈ 197,4 bpm

Clamp RR: [0,3 s, 2,0 s] = [300 ms, 2000 ms]
→ RR = 300 ms gera separação de 300 × 250 / 1000 = 75 amostras
→ 75 NÃO é > 75  →  batimento INVISÍVEL ao detector mesmo dentro da faixa do clamp
→ Clamp e detector são incompatíveis para FC ≥ 200 bpm
```

### 8.2 Resultados A × D2 por FC alvo (200 seeds)

| FC alvo | RR nom (ms) | A (média) | D2 (média) | A ≤2 bpm | D2 ≤2 bpm | D2 clips | Status |
|---|---|---|---|---|---|---|---|
| 40 bpm | 1500 ms | 37 bpm | 40 bpm | 0 % | 100 % | 0 | ✓ |
| 60 bpm | 1000 ms | 55 bpm | 60 bpm | 0 % | 100 % | 0 | ✓ |
| 70 bpm | 857 ms | 64 bpm | 70 bpm | 0 % | 100 % | 0 | ✓ |
| 75 bpm | 800 ms | 68,6 bpm | 75,0 bpm | 0 % | 100 % | 0 | ✓ |
| 100 bpm | 600 ms | 91,5 bpm | 100 bpm | 0 % | 100 % | 0 | ✓ |
| 108 bpm | 556 ms | 99,0 bpm | 108 bpm | 0 % | 100 % | 0 | ✓ |
| 110 bpm | 545 ms | 101 bpm | 110,8 bpm | 0 % | 100 % | 0 | ✓ |
| 120 bpm | 500 ms | 109 bpm | 120 bpm | 0 % | 100 % | 0 | ✓ |
| 150 bpm | 400 ms | 137,6 bpm | 150 bpm | 0 % | 100 % | 0 | ✓ |
| 170 bpm | 353 ms | 155,1 bpm | 170,8 bpm | 0 % | 100 % | 0 | ✓ |
| 180 bpm | 333 ms | 164,8 bpm | 180 bpm | 0 % | 100 % | 0 | ✓ |
| 185 bpm | 324 ms | 169 bpm | 185 bpm | 0 % | 100 % | 0 | ✓ |
| **190 bpm** | **316 ms** | **174 bpm** | **162 bpm** | **0 %** | **0 %** | **1436** | **⚠ FALHA** |
| **195 bpm** | **308 ms** | **178 bpm** | **155 bpm** | **0 %** | **0 %** | **2596** | **⚠ FALHA** |
| **197 bpm** | **305 ms** | **180 bpm** | **135 bpm** | **0 %** | **0 %** | **2800** | **⚠ FALHA** |
| **200 bpm** | **300 ms** | **183 bpm** | **132 bpm** | **0 %** | **0 %** | **3201** | **⚠ FALHA TOTAL** |

### 8.3 Análise do limite de FC para D2 e D3

**FC ≤ 180 bpm (D3):** funciona perfeitamente — 100 % ≤1 bpm, 100 % ≤2 bpm.

**FC = 185 bpm (D3):** falha catastrófica. Motivo: A produz FC≈169. D3 calcula fator=169/185=0,913 e aplica aos RRs. RRs mínimos (≈257ms) são clamped a 300ms (=75 amostras) → detector REJEITA esses picos (condição >75 não satisfeita) → FC medida colapsa para ~100 bpm → fator₂=100/185=0,54 → destruição total. D3 falha 5 bpm antes de D2 porque aplica a correção mais agressivamente na primeira iteração.

**FC ≤ 185 bpm (D2):** funciona — 100 % ≤2 bpm (confirmado em audit-d2-core).

**FC = 190 bpm:** ambas D2 e D3 falham pelo mesmo mecanismo de cascata de clamp.

**FC = 200 bpm:** RRnom = 300 ms = exatamente 75 amostras = invisível ao detector.

**Fronteiras de segurança:**
- D3: FC ≤ 180 bpm
- D2: FC ≤ 185 bpm

**Presets clínicos atuais:** todos com FC ≤ 150 bpm. Ambas as fronteiras estão 20–24 % acima do preset mais rápido.

**FC = 40 bpm:** D3 funciona (100 % ≤1 bpm, 100 % ≤2 bpm, 0 clips). Apenas ~3 batimentos em 5 s.

### 8.4 Zona crítica FC 186–200 bpm (detalhada)

| FC | RRnom (ms) | Margem (amostras) | D3: ≤1 bpm | D3: clips | Status |
|---|---|---|---|---|---|
| 185 | 324,3 | +5,1 | 0,5 % | 3984 | ⚠ FALHA |
| 186 | 322,6 | +4,6 | 0 % | 4000 | ⚠ |
| 187 | 320,9 | +4,2 | 0 % | 4000 | ⚠ |
| 190 | 315,8 | +2,9 ⚠ | 0 % | 4000 | ⚠ |
| 195 | 307,7 | +0,9 ⚠ | 0 % | 4200 | ⚠ |
| 197 | 304,6 | +0,1 ⚠ | 0 % | 4200 | ⚠ |
| 200 | 300,0 | −1,0 ⚠ | 0 % | 4200 | ⚠ |

Margem = RRnom_amostras − 76. Zona de risco: margem < 3 amostras (qualquer modulação LF/HF cruza o limiar).

---

## 9. Causa provável por preset

| Preset | FC alvo testada | Déficit (%) | Causa | Certeza |
|---|---|---|---|---|
| normal_adulto | 75 | 8,6 % | Viés LF (4,2 %) + viés HF (4,4 %) | Confirmada |
| normal_adulto | 102 | 9,0 % | Mesmo mecanismo em FC maior | Confirmada |
| fibrilacao_atrial | 110 | 25,6 % | Mesmo mecanismo amplificado por rrVar=0,30 (ampLF/HF ≈ 3,9×) | Confirmada |
| flutter_atrial_2_1 | 150 | 6,3 % | Mesmo mecanismo com rrVar=0,01 (ampLF/HF ≈ 0,7×) | Confirmada |
| bloqueio_ramo_direito | 70 | 8,6 % | Idêntico ao normal_adulto (rrVar=0,02) | Confirmada |
| iam_supra_anterosseptal | 108 | 11,9 % | Mesmo com rrVar=0,04 (ampLF/HF ≈ 1,4×) | Confirmada |

**Causas descartadas por evidência:** `normalizarSinal()`, distância mínima do detector, `numeroIntervalos=12`, truncamento de borda com RR fixo, Math.random (DP < 0,7 bpm).

---

## 9.5 Desempenho computacional (D3 vs A, 1000 medições)

| Preset | Estrat. | Média (ms) | P95 (ms) | Máx (ms) | Overhead vs A | Iters med |
|---|---|---|---|---|---|---|
| normal@75 | A | 0,030 | 0,034 | 0,121 | — | — |
| | D | 0,030 | 0,034 | 0,080 | 1,0× | — |
| | D2 | 0,035 | 0,038 | 0,120 | 1,2× | 2,0 |
| | **D3** | **0,092** | **0,119** | **0,163** | **3,1×** | **1,16** |
| FA@110 | A | 0,031 | 0,034 | 0,111 | — | — |
| | D | 0,031 | 0,034 | 0,108 | 1,0× | — |
| | D2 | 0,036 | 0,040 | 0,088 | 1,2× | 3,0 |
| | **D3** | **0,195** | **0,218** | **0,299** | **6,3×** | **4,53** |

**Overhead absoluto:** D3 adiciona 0,062–0,164 ms no worst case. Imperceptível no navegador (limiar percepção ≈ 16 ms). O custo de 6,3× para FA@110 reflete as 4,53 iterações médias, não ineficiência algorítmica.

---

## 10. Comparação final A × D × D2 × D3

| Estratégia | ≤1bpm (pior caso, 5s) | ≤2bpm (pior caso, 5s) | FA@110 ≤2bpm | CV pres. | FC_max | Perf (FA) | Risco |
|---|---|---|---|---|---|---|---|
| A (atual) | 0 % | 0 % | 0 % | base | any | 0,03ms | alto (viés) |
| B (aleatório) | ~10 % | ~10 % | 10 % | não | any | — | ⚠ alto |
| C (centrado) | 0 % (FA) | 0 % (FA) | 0 % | sim | any | — | médio |
| D (global) | 0 % (IAM) | 44 % (IAM) | supercorrige | sim | any | 0,03ms | médio |
| **D2 (janela)** | **7 % (FA)** | **99 % (FA)** | **99 %** | **sim** | **185 bpm** | **0,04ms** | **baixo** |
| D3 (detector) | 18,6 % (FA) | 96,4 % (FA) | 96,4 % | sim | 180 bpm | 0,20ms | baixo |
| E (C+D) | 0 % (FA) | 0 % (FA) | 0 % | sim | any | — | baixo |

**Hierarquia para presets clínicos atuais (FC ≤ 150 bpm, 5 s):**
1. D3 = D2 (empate) para presets de baixo rrVar (normal, flutter, BRD, IAM)
2. **D2 > D3** para FA@110 (99 % vs 96,4 % ≤2bpm; D3 oscila no detector)
3. D3 > D2 para FA × 10 s (59,5 % vs 3 %)
4. D global > D3 e D2 para FA × 30 s (sem clips)

**Piso de quantização irredutível para FA@110 × 5s:**
Nenhuma estratégia supera 18,6 % dentro de ±1bpm. Causa: com ~8 intervalos e rrVar=0,30, a variação natural na contagem de picos visíveis (7–9) produz oscilação de ±2 bpm no detector. O critério de ≥99 % ≤1bpm é matematicamente inacessível com o detector atual (Math.round) e 5 segundos de janela para FA.

---

## 11. Recomendação final (v4)

> **A implementação não está autorizada neste relatório. Esta seção descreve apenas o que foi auditado e pode ser avaliado antes da decisão.**

### 11.1 Resumo dos achados D3

D3 (malha fechada pelo detector real) alcança 100 % ≤1bpm e 100 % ≤2bpm para todos os presets clínicos **exceto FA@110**. Para FA@110 em 5 s, D3 obteve apenas 18,6 % ≤1bpm e 96,4 % ≤2bpm — **pior que D2** (7 % e 99 %) no critério ≤2bpm.

**Causa do fracasso de D3 para FA@110:** O detector retorna FC como inteiro e o número de picos visíveis na janela de 5 s varia de 7 a 9 (com rrVar=0,30), produzindo oscilações de ±2 bpm que mantêm o loop de malha fechada em limite de convergência (4,53 iterações médias, conv=19 %). D2 usa o pico analítico (tFrac=0,23), que é mais estável para o cálculo do fator.

**Causa do colapso de D3 a FC=185:** Diferente de D2, D3 aplica o fator derivado do FC inteiro do detector (não da média analítica). A primeira correção é mais agressiva → mais clips → detector rejeita picos → FC medida colapsa → cascata.

### 11.2 Proposta de política de suporte (baseada nos dados, não autorizada)

| FC alvo | rrVar | Duração | Estratégia proposta | ≤2bpm esperado | Clips |
|---|---|---|---|---|---|
| 40–180 bpm | ≤ 0,04 | 5 s | D2 | 100 % | 0 |
| 40–180 bpm | ≤ 0,04 | 10 s | D3 | 100 % | 0 |
| 40–180 bpm | ≤ 0,04 | 30 s | D2 | 100 % | 0 |
| 110 bpm (FA) | 0,30 | 5 s | D2 | 99 % | 0 |
| 110 bpm (FA) | 0,30 | 10 s | D3 | 59,5 % | 134 |
| 110 bpm (FA) | 0,30 | 30 s | D global | 100 % | 0 |
| > 180 bpm | qualquer | qualquer | não suportado | — | — |

### 11.3 Critério de aprovação: o que ainda não foi atingido

O critério original exige ≥99 % dentro de ±1bpm para FC 40–170. O único preset que não passa é FA@110: nenhuma estratégia supera 18,6 % ≤1bpm para FA em 5 s. Isso não é uma falha de algoritmo — é um piso de quantização intrínseco ao detector com janela de 5 s e rrVar=0,30.

**Duas opções para aprovação:**
1. **Ajustar critério para FA:** aceitar ≥99 % ≤2bpm (D2 passa). Justificativa clínica: ±2bpm em 110 bpm = 1,8 % de erro — indistinguível clinicamente.
2. **Investigar mudança no detector:** substituir `Math.round()` por média de ponto flutuante, ou aumentar a janela de FA para 10 s. Cada uma dessas mudanças requer nova auditoria.

### 11.4 Estratégias descartadas

- **B:** variância ±18 bpm, 329 clips em FA. Inaceitável.
- **C:** viés de 10 bpm em FA. Pior que A.
- **D global:** IAM@108 passa apenas 45,3 % ≤2bpm. Inadequado para 5 s.
- **E (C+D):** não melhora C para FA.
- **D3 como estratégia única:** falha para FA@110 (96,4 % ≤2bpm < 99 %) e colapsa a FC=185. D2 é superior para o caso de uso primário (5 s).

---

## 12. Limitações

1. **Script isolado replica as funções de timing mas não o pipeline completo.** `transformarEm12Derivacoes()` e `leadModifiers` não afetam o timing — validado pela comparação com `generateECG()` em 600 pares determinísticos (diff = 0 em 100 %).

2. **Validação determinística:** RNG Mulberry32 com seed global. Diff = 0 em todos os 600 pares. Resultados são reproduzíveis bit a bit.

3. **FC ≥ 185 bpm (D3) / ≥ 190 bpm (D2):** clamp e detector são incompatíveis. Nenhuma estratégia funciona acima do limite.

4. **FA@110 × 10s com D3:** 59,5 % dentro de ±2bpm e 134 clips em 200 seeds. Melhor que D2 (3 %), mas ainda longe do critério. Não investigado além desta constatação.

5. **Piso de quantização FA@110 × 5s:** nenhuma estratégia ultrapassa 18,6 % ≤1bpm. É um limite físico do detector (Math.round com ~8 picos), não uma falha de algoritmo.

6. **D3 e FA × 30s:** 3622 clips produzem resultado (FC=109,2 bpm) que parece válido mas a variabilidade FA está distorcida pelo clamp. Não recomendado para 30 s.

7. **Amplitude dos presets não validada:** amplitudes P/Q/R/S/T no script são valores típicos. O timing (RR, FC) não é afetado pelas amplitudes — resultados de FC são válidos.

---

*Scripts de auditoria: scratchpad isolado fora do repositório. Nenhum arquivo de código, configuração ou preset do projeto foi modificado. Nenhum commit criado. Nenhum push realizado.*

---

*Nenhum arquivo de código, configuração ou preset do projeto foi modificado. Somente este relatório não rastreado foi atualizado. Nenhum commit foi criado e nenhum push foi realizado.*
