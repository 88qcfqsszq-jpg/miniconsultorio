# Relatório — Casos OSCE Dinâmicos (Beta) · Fase 3.4 · Avaliador Contextual de Atraso Terapêutico

## Problema clínico corrigido

Na Fase 3.3, qualquer exame não essencial solicitado antes da descompressão torácica
perdia automaticamente o critério **"Não atrasou a conduta aguardando exames em paciente instável"**
(`pn-exm-nao-atrasou`). Essa regra era **clinicamente rígida demais**:

- Gasometria/ECG/USG antes da descompressão podem ser aceitáveis se a descompressão vier logo depois.
- Apenas solicitar 1 ou 2 exames toleráveis **não é**, por si só, o erro no pneumotórax hipertensivo.
- O erro real é **deixar o exame atrasar a intervenção salvadora** — priorização diagnóstica excessiva.

## Regra anterior (Fase 3.3 — rígida)

```
Flag booleana: examesNaoPrioritariosAntesDescompressao
→ qualquer exame não essencial antes da descompressão = perde o ponto
→ Gasometria isolada antes da descompressão → perde ponto (incorreto clinicamente)
```

## Nova regra contextual (Fase 3.4)

O avaliador `avaliarAtrasoTerapiaSalvadora` avalia a **sequência completa** antes da
intervenção salvadora e classifica o grau de atraso em 4 níveis:

| Classificação | Condição | Pontua `nao-atrasou`? | Gera erro crítico? |
|---|---|---|---|
| `sem-atraso` | Só essenciais/suporte antes da descompressão | ✅ sim | ✗ |
| `alerta-leve` | 1–2 exames toleráveis (gasometria, ECG, USG) antes | ✅ sim | ✗ |
| `atraso-relevante` | RX antes da descompressão, OU 3+ exames não essenciais | ✗ não | ✗ |
| `erro-critico` | `aguardar_exames`/`solicitar_rx_torax` como intervenção, OU sem descompressão | ✗ não | ✅ sim |

**Parâmetros do caso pneumotórax:**
- `examesEssenciais`: Oximetria contínua, Monitorização cardíaca, Pressão arterial seriada
- `examesCriticosAntesDoSalvador`: `["radiografia"]` (match parcial case-insensitive)
- `intervencoesDeAtraso`: `["aguardar_exames", "solicitar_rx_torax"]`
- `limiteToleravel`: 2

## Cenários testados e resultados

### Cenário A — sequência perfeita (sem atraso)
```
Oximetria contínua → Monitorização cardíaca → PA seriada
→ oxigenio_alto_fluxo → descompressao_toracica → drenagem_toracica → reavaliar
```
- Classificação: `sem-atraso`
- `devePontuarNaoAtrasou`: true
- Feedback: **20/20** ✅

### Cenário B — alerta leve (pode manter 20/20)
```
Oximetria contínua → Gasometria
→ oxigenio_alto_fluxo → descompressao_toracica → drenagem_toracica → reavaliar
```
- Classificação: `alerta-leve`
- `devePontuarNaoAtrasou`: true
- Timeline mostra: "⚠️ Exame solicitado antes da intervenção salvadora — aceitável apenas se não atrasar a descompressão."
- Feedback: **20/20** (com mensagem educativa em `melhorias`) ✅

### Cenário C — atraso relevante
```
Gasometria → ECG → USG → Radiografia de tórax após estabilização
→ oxigenio_alto_fluxo → descompressao_toracica → drenagem_toracica
```
- Classificação: `atraso-relevante` (Radiografia detectada via match `"radiografia"`)
- `devePontuarNaoAtrasou`: false
- Feedback: **19/20** (perde `pn-exm-nao-atrasou`) ✅
- Explicação em `melhorias`: "Exame(s) que indicam priorização diagnóstica inadequada…"

### Cenário D — erro crítico
```
aguardar_exames → solicitar_rx_torax (sem descompressão)
```
- Classificação: `erro-critico`
- `devePontuarNaoAtrasou`: false
- `deveGerarErroCritico`: true ✅

## Arquivos criados

- `lib/dynamic-osce/dynamic-therapeutic-delay-evaluator.ts` — avaliador puro (`avaliarAtrasoTerapiaSalvadora`)

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `lib/dynamic-osce/types.ts` | Adicionados `ItemSequencia`, `ClassificacaoAtraso`, `AvaliacaoAtrasoTerapeutico`; `RubricEvalContext` substituiu `examesNaoPrioritariosAntesDescompressao` por `atrasoTerapiaSalvadora?` |
| `lib/dynamic-osce/dynamic-feedback-engine.ts` | `pn-exm-nao-atrasou` usa `atrasoTerapiaSalvadora.devePontuarNaoAtrasou` com fallback para casos sem o avaliador; alertas do avaliador vão para `melhorias` (educativo) ou `errosCriticos` (critico) |
| `components/dynamic-osce/DynamicCaseRunner.tsx` | Flags rígidas removidas; novo estado `sequenciaUnificada: ItemSequencia[]`; `finalizar()` chama `avaliarAtrasoTerapiaSalvadora` e passa resultado ao feedback |
| `lib/dynamic-osce/scripts/validar-dynamic-osce.ts` | Seção 5b substituída por 4 cenários (A/B/C/D) com 13 checks; importa `avaliarAtrasoTerapiaSalvadora` e `ItemSequencia` |

## Resultado do script

```
### Avaliador contextual de atraso terapêutico (13 checks)
  ✅ Cenário A: apenas essenciais → sem-atraso
  ✅ Cenário A: pontua pn-exm-nao-atrasou
  ✅ Cenário A: sequência perfeita mantém 20/20 (obtido 20)
  ✅ Cenário B: 1 tolerável → alerta-leve
  ✅ Cenário B: alerta-leve ainda pontua pn-exm-nao-atrasou
  ✅ Cenário B: alerta-leve não perde ponto → 20/20 (obtido 20)
  ✅ Cenário C: RX + múltiplos → atraso-relevante
  ✅ Cenário C: atraso-relevante não pontua pn-exm-nao-atrasou
  ✅ Cenário C: nota < 20 com atraso-relevante (obtido 19)
  ✅ Cenário C: pn-exm-nao-atrasou NÃO cumprido
  ✅ Cenário D: aguardar+RX → erro-critico
  ✅ Cenário D: não pontua pn-exm-nao-atrasou
  ✅ Cenário D: deveGerarErroCritico=true

RESUMO: ✅ TODAS as checagens passaram (2 caso(s))
```

## Resultado type-check / build

- `npx tsc --noEmit` → **0 erros**
- `npm run build` → **Compiled successfully + Finished TypeScript**, rota `○ /casos-dinamicos` gerada

## Confirmação de isolamento

Tudo em `lib/dynamic-osce/**` e `components/dynamic-osce/**`. Não foram tocados:
`data/casos-v2`, `lib/healthbench`, `app/caso/[id]`, `app/faca-o-osce`, `app/treinamento`,
ECG, laboratório, exames, dashboard, feedback principal, AppShell, AppSidebar.

Nenhuma dependência nova. Pulse não integrado. Sem commit.
