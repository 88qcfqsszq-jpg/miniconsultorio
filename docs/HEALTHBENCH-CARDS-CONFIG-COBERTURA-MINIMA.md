# Config Única dos 6 Cards + Cobertura Mínima de Rubrica

**Data:** 25 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Tornar a estrutura dos 6 cards a **fonte única de configuração** do Feedback do Atendimento e garantir que o motor de rubrica OSCE gere **critérios positivos mínimos para todos os 6 cards** antes do HealthBench avaliar — eliminando os cards 0% por ausência de critério. A nota continua sendo a **soma dos 6 cards em 20 pontos** (sem normalização).

---

## 1. Decisões de produto aplicadas

| Tema | Decisão |
|---|---|
| Config dos cards | Estrutura dos 6 cards vira **fonte única** (`cards-config.ts`) |
| Conduta e Segurança | Eixo próprio `axis:conduta_seguranca`, consumindo `axis:conduta`, `axis:seguranca` e `axis:conduta_seguranca` |
| Nota | **Soma dos 6 cards em 20** (NÃO normalizar por eixos com critérios) |
| Cobertura | Motor de rubrica gera **critério positivo mínimo** para todo card sem cobertura |
| Grader | HealthBench continua sendo o avaliador; a rubrica enviada vai estruturada por competência |
| Layout | Não alterado; sem 7º card |

---

## 2. Arquivos

### Criado (1)
- **`lib/healthbench/cards-config.ts`** — fonte única dos 6 cards.

### Alterados (3)
| Arquivo | Mudança |
|---|---|
| `lib/healthbench/types.ts` | `axis:conduta_seguranca` adicionado em `AXIS_TAGS` e `AXIS_LABELS` |
| `lib/healthbench/rubric-adapter.ts` | `garantirCoberturaMinima()` (≥1 critério positivo por card), alinhada à mesma partição do builder |
| `lib/healthbench/feedback-view-builder.ts` | Consome `CARDS_CONFIG`; partição por `axis` do card via `resolverAxisDoCard` |

> `components/FeedbackOSCE.tsx`, `app/caso/[id]/page.tsx`, `/api/corrigir`, ECG, Open-i, radiologia e exame físico visual **não foram tocados**.

---

## 3. Fonte única — `cards-config.ts`

```ts
export interface CardConfig {
  nome: string;          // nome exibido na UI
  axis: string;          // eixo identificador do card
  pesoVisual: number;    // peso na nota de 20
  matchTags: string[];   // tags de grade que pertencem a este card
  criterioMinimo: string;// critério positivo mínimo (cobertura)
}
```

| Card | axis | peso | matchTags |
|---|---|---|---|
| Comunicação e postura médica | `axis:comunicacao` | 2 | `axis:comunicacao` |
| Anamnese dirigida | `axis:anamnese` | 4 | `axis:anamnese` |
| Exame físico | `axis:exame_fisico` | 3 | `axis:exame_fisico` |
| Exames complementares | `axis:exames_complementares` | 2 | `axis:exames_complementares` |
| Raciocínio diagnóstico | `axis:raciocinio_clinico` | 5 | `axis:raciocinio_clinico` |
| Conduta e Segurança | `axis:conduta_seguranca` | 4 | `axis:conduta_seguranca`, `axis:conduta`, `axis:seguranca` |

**Total = 20.**

### Partição única (sem duplicidade)
`resolverAxisDoCard(tags)` atribui cada critério a **um único** card, por ordem de prioridade:

```
axis:conduta_seguranca → axis:exames_complementares → axis:exame_fisico
→ axis:anamnese → axis:comunicacao → axis:raciocinio_clinico (default)
```

---

## 4. Cobertura mínima (motor de rubrica)

No `rubric-adapter`, após classificar os critérios reais do caso, `garantirCoberturaMinima()`:

```
para cada card em CARDS_CONFIG:
  se NÃO existe critério positivo que seria atribuído a este card (resolverAxisDoCard):
    adiciona { criterion: card.criterioMinimo, points: 1, tags: [card.axis], type: "positive" }
```

Pontos importantes:
- Usa a **mesma** `resolverAxisDoCard` da partição do builder, garantindo coerência (um critério `raciocínio+segurança` que vai para "Conduta e Segurança" **não** conta como cobertura de Raciocínio).
- **Não remove nem altera** critérios reais do caso; só adiciona quando o card ficaria vazio.
- O HealthBench continua sendo o grader desses critérios mínimos.

Critérios mínimos (texto enviado ao grader):
- Comunicação: "Estabeleceu comunicação adequada: apresentou-se, usou linguagem clara e demonstrou empatia."
- Anamnese: "Realizou anamnese dirigida ao caso: início, duração, sintomas associados e antecedentes."
- Exame físico: "Realizou exame físico direcionado e avaliou sinais vitais pertinentes."
- Exames: "Solicitou exames complementares essenciais para confirmar a hipótese e avaliar gravidade."
- Raciocínio: "Formulou hipótese diagnóstica principal coerente e considerou diagnósticos diferenciais."
- Conduta e Segurança: "Propôs conduta inicial adequada e reconheceu sinais de gravidade e critérios de segurança."

---

## 5. Cálculo da nota (inalterado nesta tarefa)

Por card:
```
scoreCard = clamp((pontosPositivosCumpridos − penalidades) / pontosPositivosPossiveis, 0, 1)
pontosObtidos = scoreCard × pesoVisual
```
Nota visual (header):
```
nota = clamp(0, 20, Σ pontosObtidos)
```
"Distribuição por competência" usa a mesma soma → bate com o header.

---

## 6. Bug encontrado e corrigido durante o desenvolvimento

**Sintoma:** após a primeira versão da cobertura mínima, "Raciocínio diagnóstico" ainda aparecia vazio no caso 3.

**Causa:** a checagem de cobertura usava `matchTags` simples (tem `axis:raciocinio_clinico`?), mas a **partição** do builder usa prioridade (`resolverAxisDoCard`). Um critério `raciocínio + segurança` era contado como cobertura de Raciocínio, mas na partição ia para "Conduta e Segurança" — deixando Raciocínio sem critério no card final.

**Correção:** a cobertura passou a usar a **mesma** `resolverAxisDoCard`. Resultado: Raciocínio do caso 3 passou de vazio → 5/5.

---

## 7. Testes executados (2 casos)

| Card (peso) | Caso 3 — Asma | Caso 44 — Anemia hemolítica |
|---|---|---|
| Comunicação (2) | 1 crit | 1 crit |
| Anamnese (4) | 2 crit | 1 crit |
| Exame físico (3) | 3 crit | 1 crit |
| Exames (2) | 1 crit | 2 crit |
| Raciocínio (5) | 1 crit | 2 crit |
| Conduta e Segurança (4) | 5 crit | 1 crit |
| **Header == Distribuição** | **8.4 == 8.4** ✅ | **3.0 == 3.0** ✅ |

- ✅ Todos os 6 cards com ≥1 critério positivo (nenhum 0 por ausência).
- ✅ Exatamente 6 cards (sem 7º).
- ✅ Sem vazamento técnico (`axis:`, `score01`, `criteria_met`, `theme:` não chegam à UI).
- ✅ Logs `[HEALTHBENCH RUBRIC] critério mínimo adicionado para card: …` quando aplicável.

> As notas dos testes são baixas porque o **atendimento de teste é sintético/mínimo** (o grader marca critérios como não cumpridos). Em atendimento real e completo a nota sobe. Não é bug.

---

## 8. Logs

```
[HEALTHBENCH RUBRIC] axis refinado { total, comSeguranca }
[HEALTHBENCH RUBRIC] critério mínimo adicionado para card: <nome>
[FEEDBACK HB AUDIT] notaFinal HealthBench bruto / score01 / cards calculados / soma dos cards / nota visual / divergência
[FEEDBACK HB SCORE] divergência nota/cards   (só dispara se inconsistente)
```

---

## 9. Confirmações de escopo

- ✅ Layout **não** redesenhado; sem 7º card; sem painel paralelo; sem duas notas.
- ✅ Nota = soma dos 6 cards em 20 (sem normalização).
- ✅ "Conduta e Segurança" consome `axis:conduta`/`axis:seguranca`/`axis:conduta_seguranca`.
- ✅ `lib/healthbench` sem erros de tipo.
- ✅ `/api/corrigir` preservado (`git diff` vazio).
- ✅ **ECG, Open-i, radiologia, exame físico visual não tocados.** Só editei 4 arquivos em `lib/healthbench` (mtime 25/jun 19:15–19:21). O erro de tipo em `src/services/ecgGenerator/types.ts:210` é **pré-existente**.
- ⚠️ `npm run build` completo segue bloqueado pelo erro **pré-existente de ECG**; o app compila e roda em dev.

---

## 10. Efeito prático

- O **teto de 20 agora é atingível em qualquer caso**, porque todo card tem ao menos o critério mínimo — sem precisar normalizar.
- Casos cuja rubrica original cobria poucos eixos agora avaliam as 6 competências (com critérios mínimos onde faltava), de forma estruturada e justa.
- A nota visível continua coerente: header = soma dos cards = "Distribuição por competência".

---

## 11. Próximos passos sugeridos

1. Validar visualmente no navegador com um atendimento real completo (não sintético).
2. Opcional: enriquecer as rubricas dos casos (`rubrica_correcao`/`checklist_osce`) para reduzir o uso de critérios mínimos genéricos onde o caso comporta critérios específicos.
3. Avaliar exibir, no verso do card, uma marca discreta quando o critério é "mínimo de competência" vs específico do caso (sem redesenho).
