# Lote 1 — Rubricas Pediatria / Febre / Infecção + Correção de Consistência dos Cards

**Data:** 26 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Adicionar o primeiro lote de rubricas específicas (6 diagnósticos de pediatria/febre/infecção) e corrigir a inconsistência em que um card podia exibir acertos mas ficar com 0 pontos. Mantém fallback genérico, layout, nota e classificação.

---

## 1. Diagnósticos do lote (6)

1. Infecção viral inespecífica / virose pediátrica (`virose_pediatrica`)
2. Dengue clássica (`dengue_classica`)
3. Dengue grave (`dengue_grave`)
4. Pneumonia pediátrica (`pneumonia_pediatrica`)
5. Gastroenterite / desidratação (`gastroenterite`)
6. Amigdalite / faringite (`amigdalite_faringite`)

Cada um com microcritérios atômicos nos 6 cards (Comunicação, Anamnese, Exame físico, Exames complementares, Raciocínio diagnóstico, Conduta e Segurança).

---

## 2. Arquivos alterados (2)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/diagnosis-microcriteria.ts` | 6 novas rubricas + aliases; tipo `DiagnosticoRubricaKey` ampliado |
| `lib/healthbench/feedback-view-builder.ts` | Correção de consistência (acertos × pontos) + log `[FEEDBACK HB CONSISTENCY ERROR]` |

> `rubric-adapter.ts` não precisou de mudança (consome `DIAGNOSIS_MICROCRITERIA` automaticamente). `cards-config.ts`, `components/FeedbackOSCE.tsx`, `/api/corrigir`, ECG, Open-i, radiologia, exame físico visual e geração de imagens **não foram tocados**.

---

## 3. Aliases adicionados

| Chave | Aliases |
|---|---|
| `virose_pediatrica` | infeccao viral inespecifica, virose, virose pediatrica, sindrome viral, febre viral, quadro viral inespecifico |
| `dengue_grave` | dengue grave, dengue com sinais de alarme, choque por dengue, dengue hemorragica |
| `dengue_classica` | dengue, dengue classica, dengue sem sinais de alarme, arbovirose dengue |
| `pneumonia_pediatrica` | pneumonia pediatrica, pneumonia infantil, pneumonia comunitaria pediatrica, pac pediatrica |
| `gastroenterite` | gastroenterite, gastroenterite aguda, diarreia aguda, vomitos e diarreia, desidratacao |
| `amigdalite_faringite` | amigdalite, faringite, amigdalofaringite, faringoamigdalite, tonsilite, odinofagia febril |

**Ordem de avaliação:** `dengue_grave` é definido **antes** de `dengue_classica` no objeto. Como a identificação retorna o primeiro alias que casa, "dengue com sinais de alarme" cai corretamente em `dengue_grave`, e "dengue clássica"/"dengue grupo A" em `dengue_classica`.

---

## 4. Regras dos microcritérios

- Atômicos (uma ação avaliável por critério); sem juntar várias ações obrigatórias numa frase.
- Específicos têm prioridade sobre genéricos; genéricos completam a cobertura mínima por card.
- Deduplicação por texto normalizado.
- O HealthBench (grader) decide se cada microcritério foi cumprido; nada é marcado automaticamente.

---

## 5. Correção de consistência (card com acertos e 0 pontos)

No builder (`montarRubrica`), `acertos` e o cálculo de pontos usam a **mesma base** (critérios positivos cumpridos). Adicionada verificação:

```
se pontosObtidos === 0 e acertos.length > 0:
  log [FEEDBACK HB CONSISTENCY ERROR] { card, acertos, penalidadeCriticaAtiva }
  se NÃO há penalidade crítica (apenas arredondamento):
      pontosObtidos = 0.1   // piso: acertos cumpridos refletem na pontuação
  se HÁ penalidade crítica:
      mantém 0, mas a penalidade já aparece em "O que faltou" (causa visível)
```

Garantias:
- Apenas critérios **positivos cumpridos** aparecem em "O que foi reconhecido".
- Critérios **negativos não acionados** nunca aparecem como acerto (ficam fora de `positivos`, que exige `points > 0`).
- Penalidade crítica que zera o card é **exibida explicitamente** em "O que faltou".
- Evidências vêm apenas da partição única do card (sem misturar cards).

---

## 6. Logs

```
[OSCE DIAG RUBRIC] diagnóstico identificado: <chave|nenhum>
[OSCE DIAG RUBRIC] rubrica específica aplicada: <chave>
[OSCE DIAG RUBRIC] critérios específicos adicionados: <n>
[OSCE RUBRIC MICRO] cobertura para card: <nome> { reais, adicionados, especificos, totalCobertura }
[FEEDBACK HB CARD] score parcial por microcritérios: <nome> { cumpridos, possiveis, pontos, penalidadesCriticas }
[FEEDBACK HB CONSISTENCY ERROR] card com acertos e zero pontos { card, acertos, penalidadeCriticaAtiva }
```

---

## 7. Testes

### Identificação por aliases (10/10 ✅)
Virose, febre viral, dengue com sinais de alarme → `dengue_grave`, dengue clássica/grupo A → `dengue_classica`, pneumonia pediátrica, gastroenterite com desidratação, amigdalite, faringoamigdalite estreptocócica → corretos; IAM → `null` (fallback).

### Ponta a ponta (casos reais)
| Caso | Diagnóstico | Rubrica aplicada | Específicos | Consistência | Nota = soma |
|---|---|---|---|---|---|
| 39 | Dengue com Sinais de Alarme | `dengue_grave` | 19 | ✅ | ✅ |
| 38 | Dengue Clássica | `dengue_classica` | 19 | ✅ | 6.5 == 6.5 |
| 2 | PAC (adulto) | fallback genérico (correto: rubrica é pediátrica) | — | ✅ | ✅ |

- **0 erros** `[FEEDBACK HB CONSISTENCY ERROR]` nos testes.
- Nenhum card com acertos e 0 pontos sem penalidade.
- Todos os 6 cards com critérios específicos nos casos mapeados.

> As notas baixas refletem atendimento de teste sintético (grader marca não cumprido) — não é bug.

---

## 8. Confirmações

| Item | Status |
|---|---|
| 6 rubricas do lote implementadas | ✅ |
| Fallback genérico para não mapeados | ✅ |
| Card com acertos não fica 0 sem causa visível | ✅ |
| Critério negativo não acionado não vira acerto | ✅ |
| Evidência no card correto | ✅ |
| Nota = soma dos 6 cards | ✅ |
| Classificação textual usa nota visual | ✅ |
| Layout inalterado / sem 7º card | ✅ |
| ECG, Open-i, radiologia, exame físico visual, imagens, /api/corrigir intactos | ✅ |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

---

## 9. Observações

- A rubrica `pneumonia_pediatrica` é específica para pediatria; casos de PAC adulto (ex.: caso 2) corretamente usam o fallback genérico. Se desejado, um lote futuro pode incluir "pneumonia adulto" com aliases próprios.
- Virose, gastroenterite, amigdalite e pneumonia pediátrica foram validados na identificação por alias; dengue (grave e clássica) também em ponta a ponta com casos reais do banco.

---

## 10. Próximos passos sugeridos

1. Lote 2: SCA/IAM, ICC, DPOC, ITU/pielonefrite, sepse, bronquiolite, pneumonia adulto.
2. Validar no navegador com atendimentos reais completos.
3. Eventual marcação discreta no verso do card distinguindo critério específico do caso vs mínimo genérico (sem redesenho).
