# Classificação Textual do Feedback = Nota Visual (Soma dos 6 Cards)

**Data:** 25 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Garantir que a classificação textual/selo do Feedback do Atendimento ("Excelente", "Bom", "Regular", "Insuficiente") seja derivada **exclusivamente da nota visual final** (`feedback.nota`), que é a **soma ponderada dos 6 cards** em 20 pontos.

---

## 1. Decisão

A classificação textual usa **somente** `feedback.nota` (nota visual = soma dos 6 cards).

Não usa:
- `healthBenchResult.notaFinal` (bruto);
- `healthBenchResult.score01`;
- `healthBenchResult.passed`;
- nota antiga/legada;
- soma alternativa ou status técnico interno.

> "Excelente" significa desempenho excelente, **não** apenas aprovado. Ex.: **16.3/20 → "Bom"**, não "Excelente".

---

## 2. Arquivo alterado (1)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/feedback-view-builder.ts` | Função `classificarNota` (exportada, limiares exatos); `feedback.classificacao` derivado da nota visual; log `[FEEDBACK HB CLASSIFICACAO]` |

Nenhum outro arquivo foi tocado. O componente `components/FeedbackOSCE.tsx` apenas **consome** `feedback.classificacao` (não recalcula).

---

## 3. Função `classificarNota`

```ts
export function classificarNota(nota: number): FeedbackOSCE["classificacao"] {
  if (nota >= 17) return "Excelente";
  if (nota >= 15) return "Bom";
  if (nota >= 12) return "Regular";
  return "Insuficiente";
}
```

Uso no builder (após calcular a nota visual = soma dos cards):

```ts
const classificacao = classificarNota(nota); // nota = soma dos 6 cards, clamp 0..20
console.log("[FEEDBACK HB CLASSIFICACAO]", { notaVisual: nota, classificacao });
// view.nota = nota;  view.classificacao = classificacao;
```

---

## 4. Regra de classificação

| Faixa de nota | Classificação |
|---|---|
| nota ≥ 17 | Excelente |
| 15 ≤ nota < 17 | Bom |
| 12 ≤ nota < 15 | Regular |
| nota < 12 | Insuficiente |

---

## 5. Tabela de testes (unitário, 9/9 ✅)

| Nota | Classificação esperada | Resultado |
|---|---|---|
| 20.0 | Excelente | ✅ Excelente |
| 17.0 | Excelente | ✅ Excelente |
| 16.9 | Bom | ✅ Bom |
| 16.3 | Bom | ✅ Bom |
| 15.0 | Bom | ✅ Bom |
| 14.9 | Regular | ✅ Regular |
| 12.0 | Regular | ✅ Regular |
| 11.9 | Insuficiente | ✅ Insuficiente |
| 0 | Insuficiente | ✅ Insuficiente |

### Teste de ponta a ponta
Atendimento real (caso 44 — anemia hemolítica): nota visual (soma dos cards) = **17.5 → "Excelente"**, enquanto `healthBenchResult.notaFinal` bruto era **18.7** (ignorado). Confirma que a classificação usa a **nota visual**, não o valor bruto do HealthBench.

---

## 6. Confirmação das fontes NÃO utilizadas

- ❌ `healthBenchResult.notaFinal` — não usado para classificação visual.
- ❌ `healthBenchResult.score01` — não usado.
- ❌ `healthBenchResult.passed` — não usado.
- ❌ Nota legada / status técnico / regra antiga de aprovação — não usados.
- ✅ Único insumo: `feedback.nota` (soma dos 6 cards).

O componente não contém referência a `notaFinal`, `score01` ou `.passed`; apenas exibe `feedback.classificacao`.

---

## 7. Confirmação do que NÃO foi alterado

- ✅ **Nota final** — inalterada (continua soma dos 6 cards, clamp 0–20).
- ✅ **Cards** — inalterados (`cards-config.ts` não tocado nesta tarefa).
- ✅ **Microcritérios** — inalterados (`rubric-adapter.ts` não tocado nesta tarefa).
- ✅ **Layout** — inalterado (header azul, selo, cores, espaçamentos, tamanho/expansão dos cards, bloco "Estudo final do caso"); `FeedbackOSCE.tsx` não tocado.
- ✅ **ECG, Open-i, radiologia, exame físico visual, geração de imagens** — não tocados.
- ✅ **`/api/corrigir`** — não tocado (`git diff` vazio).

> `lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

---

## 8. Critério de sucesso

A classificação textual reflete a nota visual final:
- **16.3/20 → "Bom"** (não "Excelente").
- 17.0/20 ou mais → "Excelente".
- 12 a 14.9 → "Regular".
- abaixo de 12 → "Insuficiente".

Todo o restante do sistema permanece como estava.
