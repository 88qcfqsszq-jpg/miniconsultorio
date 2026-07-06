# Microcritérios Mínimos por Card — Pontuação Parcial Justa

**Data:** 25 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Substituir os critérios mínimos amplos (uma frase com várias ações) por **microcritérios atômicos** por card, permitindo **pontuação parcial real**. O HealthBench continua sendo o grader; passa a receber critérios atômicos que avaliam os 6 cards com justiça.

---

## 1. Problema

No teste real, "Comunicação e postura médica" ficou **0/2** apesar da evidência reconhecer parte do comportamento:

- Critério (amplo): *"Estabeleceu comunicação adequada: apresentou-se, usou linguagem clara e demonstrou empatia."*
- Evidência: *"O aluno se apresentou como Dr. Marcelo e utilizou linguagem clara, mas não demonstrou empatia."*
- Resultado: **0/2** (injusto).

Causa: o critério continha **várias ações obrigatórias numa única frase** → o grader marca tudo-ou-nada.

---

## 2. Solução

Cada card passa a ter **vários microcritérios atômicos** (uma ação avaliável cada). Score do card = `cumpridos / possíveis × pesoVisual` → pontuação parcial.

Exemplo (Comunicação, 5–6 microcritérios):
- "Apresentou-se ao paciente ou identificou seu papel no atendimento."
- "Usou linguagem compreensível e adequada ao paciente."
- "Demonstrou acolhimento, escuta ativa ou empatia…"
- "Confirmou compreensão ou abriu espaço para dúvidas ao final."

Cumpriu 2 de 4 → **1.0/2** (em vez de 0/2).

---

## 3. Arquivos alterados (3)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/cards-config.ts` | `criterioMinimo: string` → `criteriosMinimos: string[]`; novo `minimoCobertura` por card; nova `ehCriterioComposto()` |
| `lib/healthbench/rubric-adapter.ts` | Cobertura por microcritérios: completa cada card até `minimoCobertura` com critérios atômicos; alerta de critério composto |
| `lib/healthbench/feedback-view-builder.ts` | Log `[FEEDBACK HB CARD] score parcial por microcritérios` |

> `components/FeedbackOSCE.tsx`, `app/caso/[id]/page.tsx`, `/api/corrigir`, ECG, Open-i, radiologia e exame físico visual **não foram tocados**.

---

## 4. Nova estrutura da config

```ts
export interface CardConfig {
  nome: string;
  axis: string;
  pesoVisual: number;
  matchTags: string[];
  criteriosMinimos: string[]; // microcritérios atômicos
  minimoCobertura: number;    // nº mínimo de critérios positivos por card
}
```

| Card | Peso | minimoCobertura | microcritérios disponíveis |
|---|---|---|---|
| Comunicação e postura médica | 2 | 4 | 6 |
| Anamnese dirigida | 4 | 4 | 6 |
| Exame físico | 3 | 4 | 5 |
| Exames complementares | 2 | 3 | 4 |
| Raciocínio diagnóstico | 5 | 4 | 6 |
| Conduta e Segurança | 4 | 5 | 7 |

---

## 5. Regra de cobertura mínima (rubric-adapter)

Para cada card:
1. Conta os critérios positivos **reais** já atribuídos ao card (mesma partição do builder, `resolverAxisDoCard`).
2. Se `reais < minimoCobertura`, completa com microcritérios atômicos da config até atingir a cobertura (sem duplicar texto já presente).
3. Detecta e registra critérios **compostos** entre os reais (apenas alerta; não altera).

Assim os microcritérios vêm de: (1) rubrica real do caso, (2) checklist, (3) microcritérios mínimos — adicionando **apenas o necessário**, evitando excesso.

### Detecção de critério composto (`ehCriterioComposto`)
Marca como composto quando há **3+ vírgulas** ou **2+ conjunções "e"** ligando ações **sem** "ou" no meio. "ou" é permitido (ações equivalentes).

- ✅ Aceitável: "Apresentou-se ao paciente **ou** identificou seu papel no atendimento."
- ❌ Composto: "Apresentou-se, confirmou identidade, explicou atendimento **e** demonstrou empatia."

---

## 6. Pontuação

```
scoreCard = clamp((Σ points positivos cumpridos − penalidades) / Σ points positivos possíveis, 0, 1)
pontosObtidos = scoreCard × pesoVisual
```
Cada microcritério tem `points: 1`. Nota visual (header) = soma dos 6 cards, clamp 0–20 (inalterado).

---

## 7. Logs

```
[OSCE RUBRIC MICRO] microcritérios mínimos aplicados para card: <nome> { reais, adicionados, totalCobertura }
[OSCE RUBRIC MICRO] total de critérios por card: <nome> <n>
[OSCE RUBRIC MICRO] critério composto detectado: <texto>
[OSCE RUBRIC MICRO] critério mínimo adicionado: <nome> → <microcritério>
[FEEDBACK HB CARD] score parcial por microcritérios: <nome> { cumpridos, possiveis, pontos }
```

---

## 8. Teste — Comunicação parcial ✅

Atendimento: apresentou-se + linguagem clara, **sem empatia/confirmação**.

```
Comunicação e postura médica — 1.0/2  (2 de 4 microcritérios)
  O QUE FOI RECONHECIDO:
    ✓ Apresentou-se ao paciente ou identificou seu papel no atendimento.
    ✓ Usou linguagem compreensível e adequada ao paciente.
  O QUE FALTOU:
    ✗ Confirmou a identidade do paciente ou o contexto do atendimento.
    ✗ Explicou o que faria durante o atendimento em linguagem clara.
```

**Não zera mais.** Pontuação parcial proporcional.

---

## 9. Teste — Caso 44 (Anemia hemolítica) ✅

Atendimento completo (apresentação, anamnese de hemólise, exame físico, exames laboratoriais, hipótese, conduta com investigação etiológica/sinais de alarme):

| Card (peso) | Pontos | Critérios positivos |
|---|---|---|
| Comunicação | 1.0/2 | 4 |
| Anamnese | 3.8/4 | 4 |
| Exame físico | 2.2/3 | 4 |
| Exames complementares | 1.6/2 | 3 |
| Raciocínio diagnóstico | 5.0/5 | 4 |
| Conduta e Segurança | 2.4/4 | 5 |
| **Nota** | **16.0/20** | header == distribuição ✅ |

Todos os cards pontuam **proporcionalmente** ao que foi realizado.

---

## 10. Confirmações

| # | Item | Status |
|---|---|---|
| 1 | `criterioMinimo` → `criteriosMinimos` | ✅ |
| 2 | Microcritérios por card (4–7) | ✅ |
| 3 | Comunicação parcial não zera | ✅ 1.0/2 |
| 4 | Caso 44 proporcional | ✅ 16.0/20 |
| 5 | Cards aceitam pontuação parcial | ✅ |
| 6 | Critério composto não zera o card | ✅ (atômicos) |
| 7 | Nota = soma dos 6 cards | ✅ |
| 8 | Card 0 sempre lista o que faltou | ✅ |
| 9 | Layout não alterado / sem 7º card | ✅ |
| 10 | ECG, Open-i, radiologia, exame físico visual, /api/corrigir intactos | ✅ |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

---

## 11. Próximos passos sugeridos

1. Validar no navegador com atendimento real completo (não sintético).
2. Especializar microcritérios por caso/diagnóstico (a config já tem o vocabulário; o adapter pode, no futuro, escolher microcritérios específicos quando o caso for de anemia hemolítica, asma, etc.).
3. Opcional: marcar discretamente no verso do card quando o critério é "mínimo de competência" vs específico do caso (sem redesenho).
