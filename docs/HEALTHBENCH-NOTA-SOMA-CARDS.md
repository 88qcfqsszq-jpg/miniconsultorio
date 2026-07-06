# Nota Final do Feedback = Soma Ponderada dos 6 Cards

**Data:** 25 de junho de 2026
**Status:** ✅ Implementado e testado · ⚠️ 1 consequência de produto para sua análise
**Objetivo:** Corrigir a incoerência em que o header mostrava 19.3/20 e a soma dos cards era 12.7/20. A nota final exibida ao aluno passa a ser **exatamente a soma ponderada dos 6 cards visíveis**. O HealthBench continua sendo a fonte dos critérios; `notaFinal` vira dado técnico/auditoria.

---

## 1. Causa da divergência (19.3 vs 12.7)

Existiam **duas fórmulas de nota diferentes** na tela:

| | Fórmula | Ponderação |
|---|---|---|
| `healthBenchResult.notaFinal` | `score01_global × 20` | Pelos **points reais** de TODOS os critérios HB (variam de tamanho, ex.: 25/critério) e incluem eixos não exibidos (ex.: `axis:seguranca` solto, checklist) |
| Soma dos cards | `Σ (score_eixo × peso_visual)` | Pelos **pesos visuais fixos** (2/4/3/2/5/4); eixos sem critério contam 0 |

A divergência aparece quando:
1. O aluno acerta critérios "caros" (points altos) concentrados em poucos eixos → infla `notaFinal`.
2. Há eixos visuais **sem critério** no caso → o peso desses cards "se perde" na soma visual.

Resultado: o `notaFinal` (19.3) sobe pela ponderação por points, mas a soma dos cards (12.7) fica menor porque parte do peso visual está em eixos zerados.

**Decisão de produto:** a nota pedagógica visível é a **soma dos cards** (rubrica que o aluno vê). `notaFinal` deixa de ser a nota do header.

---

## 2. Arquivos alterados (2)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/feedback-view-builder.ts` | Nota visual = soma dos cards (clamp 0–20); `resolverCardPrincipal` (partição única por card); score do card calculado das grades reais (positivos cumpridos − penalidades); logs de auditoria + assert de consistência |
| `lib/healthbench/rubric-adapter.ts` | Vocabulário de inferência ampliado; `axis:seguranca` aplicada **apenas por conteúdo** (não para todo item crítico do checklist) |

`components/FeedbackOSCE.tsx` e `app/caso/[id]/page.tsx` **não foram alterados** nesta tarefa (o rótulo "Distribuição por competência" já fora ajustado antes).

---

## 3. Nota visual oficial

```ts
const somaCards = rubricaAvaliacao.reduce((s, c) => s + c.pontosObtidos, 0);
const nota = Math.max(0, Math.min(20, Math.round(somaCards * 10) / 10));
```

Alimenta: nota grande do header, percentual (`nota/20*100`), classificação e texto do resultado.

`healthBenchResult.notaFinal` permanece **apenas** nos logs `[FEEDBACK HB AUDIT]` (auditoria) — não é exibido ao aluno.

### Classificação (pela nota visual)
| Nota | Classificação |
|---|---|
| ≥ 17 | Excelente |
| 15–16.9 | Bom |
| 12–14.9 | Regular |
| < 12 | Insuficiente |

---

## 4. Cálculo de cada card (a partir das grades reais)

```
criteriosDoCard       = grades atribuídas exclusivamente a este card
positivos             = points > 0
pontosPositivosPossiveis = Σ points(positivos)
pontosPositivosCumpridos = Σ points(positivos com criteria_met = true)
penalidades           = Σ |points| (negativos/críticos com criteria_met = true)
scoreCard             = clamp((cumpridos − penalidades) / possiveis, 0, 1)
pontosObtidos         = scoreCard × pesoVisual
```

Se um card não tem nenhum critério positivo, registra `[FEEDBACK HB CARD] sem critérios aplicáveis para: NOME` e fica 0.

---

## 5. Partição única (Fase 6 — sem duplicidade)

Cada critério é atribuído a **exatamente um** card por `resolverCardPrincipal`:

```ts
function resolverCardPrincipal(tags) {
  if (tags.includes("axis:seguranca"))            return "Conduta e Segurança";
  if (tags.includes("axis:conduta"))              return "Conduta e Segurança";
  if (tags.includes("axis:exames_complementares"))return "Exames complementares";
  if (tags.includes("axis:exame_fisico"))         return "Exame físico";
  if (tags.includes("axis:anamnese"))             return "Anamnese dirigida";
  if (tags.includes("axis:comunicacao"))          return "Comunicação e postura médica";
  if (tags.includes("axis:raciocinio_clinico"))   return "Raciocínio diagnóstico";
  return "Raciocínio diagnóstico";
}
```

Nenhum critério soma pontos em dois cards. Critérios com `axis:seguranca` vão para "Conduta e Segurança".

---

## 6. Cards e pesos (total 20)

| # | Card | Tags | Peso |
|---|---|---|---|
| 1 | Comunicação e postura médica | `axis:comunicacao` | 2 |
| 2 | Anamnese dirigida | `axis:anamnese` | 4 |
| 3 | Exame físico | `axis:exame_fisico` | 3 |
| 4 | Exames complementares | `axis:exames_complementares` | 2 |
| 5 | Raciocínio diagnóstico | `axis:raciocinio_clinico` | 5 |
| 6 | Conduta e Segurança | `axis:conduta` + `axis:seguranca` | 4 |

---

## 7. Ajuste no rubric-adapter (Fase 5)

- **Vocabulário ampliado** por eixo (anamnese, exame físico, exames, raciocínio, conduta) conforme a especificação — sem inventar critérios, só reclassificando os existentes.
- **`axis:seguranca` agora é conservadora**: aplicada só quando o texto é genuinamente de segurança (sinais de gravidade, reavaliação, contraindicação, alta insegura, dor torácica/dispneia grave, etc.).
- **Correção crítica:** removida a regra que dava `axis:seguranca` a **todo item crítico** do checklist. Antes, isso fazia a partição (que prioriza segurança) **canibalizar** os outros cards.

Efeito medido (caso 3): critérios com segurança caíram de **10/12 → 4/12** (`[HEALTHBENCH RUBRIC] axis refinado { total: 12, comSeguranca: 4 }`).

---

## 8. Consistência numérica (Fase 7)

- "Distribuição por competência: X/20" usa a mesma soma dos cards → bate com o header.
- Assert em runtime:
```ts
if (Math.abs(somaCards - nota) > 0.05 && somaCards >= 0 && somaCards <= 20)
  console.warn("[FEEDBACK HB SCORE] divergência nota/cards", { nota, somaCards });
```

---

## 9. Logs de auditoria

```
[FEEDBACK HB AUDIT] notaFinal HealthBench bruto: <x>
[FEEDBACK HB AUDIT] score01 HealthBench: <x>
[FEEDBACK HB AUDIT] cards calculados: [{nome,obt,max}...]
[FEEDBACK HB AUDIT] soma dos cards: <x>
[FEEDBACK HB AUDIT] nota visual enviada ao FeedbackOSCE: <x>
[FEEDBACK HB AUDIT] divergência HB bruto vs nota visual: <x>
[FEEDBACK HB CARD] sem critérios aplicáveis para: <nome>   (quando ocorre)
[HEALTHBENCH RUBRIC] axis refinado { total, comSeguranca }
```

---

## 10. Testes executados (2 casos, dados reais)

| Caso | Header | Distribuição por competência | Consistente |
|---|---|---|---|
| 3 — Asma | 1.4/20 | 1.4/20 | ✅ |
| 44 — Anemia hemolítica | 1.0/20 | 1.0/20 | ✅ |

- ✅ Header == soma dos cards em ambos.
- ✅ "Conduta e Segurança" recebe critérios de `axis:seguranca`.
- ✅ Exame físico peso 3, Conduta e Segurança peso 4.
- ✅ Sem 7º card, sem card duplicado, sem painel paralelo, sem duas notas.
- ✅ Sem vazamento de campos técnicos (`axis:`, `score01`, `criteria_met`, `theme:`).

> As notas dos testes ficaram baixas porque o **atendimento de teste foi sintético/mínimo** (o grader marcou critérios como não cumpridos). Não é bug — num atendimento real e completo a nota sobe.

---

## 11. Layout e escopo

- ✅ Layout **não** redesenhado (header, cards, cores, espaçamentos, expansão, "Estudo final do caso" intactos).
- ✅ `/api/corrigir` **não** alterado (`git diff` vazio).
- ✅ **ECG, Open-i, radiologia não tocados.** Prova por mtime: arquivos desta tarefa editados em **Jun 25 18:15**; `lib/radiology/*` e `src/services/ecgGenerator/index.ts` em **Jun 21/23** (modificações pré-existentes de tarefas anteriores).
- ⚠️ `npm run build` completo segue bloqueado pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

---

## 12. ⚠️ Consequência de produto para sua análise

Com **nota = soma de cards de pesos fixos**, um caso cuja rubrica **não cobre os 6 eixos** tem **teto de nota abaixo de 20**: os eixos sem critério contribuem 0 mesmo num atendimento perfeito.

**Exemplo:** se um caso só tem critérios de Anamnese (4) + Raciocínio (5) + Conduta e Segurança (4) = 13, a nota máxima possível é **13/20**, ainda que o aluno acerte tudo.

Isso é a **matemática da decisão** "nota = soma dos cards", não um bug. Há dois caminhos possíveis (decisão sua):

1. **Manter como está** (soma fixa de 20). Simples e consistente; exige que as rubricas dos casos cubram bem os 6 eixos para permitir notas altas.
2. **Normalizar pelos eixos com critérios**: a nota passa a ser `Σ pontosObtidos / Σ pesos(cards com critérios) × 20`. Cards sem critério viram "não avaliado" (exigiria pequeno ajuste no componente para exibir "N/A" em vez de 0/peso). Permite 20/20 em casos de cobertura parcial.

---

## 13. Próximos passos sugeridos

1. Decidir entre **soma fixa de 20** vs **normalização por eixos com critérios** (seção 12).
2. Revisar a cobertura das rubricas dos casos (`rubrica_correcao` / `checklist_osce`) para que os 6 eixos sejam contemplados quando clinicamente fizer sentido.
3. Validar visualmente no navegador com um atendimento real completo (não sintético).
