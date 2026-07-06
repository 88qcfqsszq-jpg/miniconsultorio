# Lote 2B — Rubricas Específicas Cardiovascular / Torácico Avançado

**Data:** 26 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Adicionar microcritérios específicos para 6 diagnósticos cardiovasculares/torácicos avançados, com desambiguações seguras (IC crônica × descompensada; derrame com IO citada como causa), mantendo fallback genérico, nota, classificação e layout, e sem regressão nos lotes anteriores.

---

## 1. Diagnósticos do lote (6)

| Chave | Diagnóstico |
|---|---|
| `ic_cronica_estavel` | Insuficiência cardíaca crônica estável / acompanhamento |
| `arritmia_fibrilacao_atrial` | Arritmias / fibrilação atrial |
| `estenose_aortica_valvopatia` | Valvopatias / estenose aórtica |
| `pericardite_aguda` | Pericardite aguda |
| `disseccao_aorta` | Dissecção aguda de aorta |
| `derrame_pleural` | Derrame pleural |

Cada um com microcritérios atômicos nos 6 cards (Comunicação, Anamnese, Exame físico, Exames complementares, Raciocínio diagnóstico, Conduta e Segurança).

---

## 2. Arquivos alterados (1)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/diagnosis-microcriteria.ts` | 6 rubricas + aliases; `DiagnosticoRubricaKey` ampliado; desambiguação de IC; seleção de match por **menor posição**; alias raiz `disseccao` |

> `rubric-adapter.ts`, `feedback-view-builder.ts`, `cards-config.ts`, `components/FeedbackOSCE.tsx`, `/api/corrigir`, ECG, Open-i, radiologia, exame físico visual e geração de imagens **não foram tocados** (a integração já estava pronta dos lotes anteriores).

---

## 3. Aliases adicionados

| Chave | Aliases |
|---|---|
| `ic_cronica_estavel` | insuficiencia cardiaca cronica, ic cronica, ic estavel, acompanhamento insuficiencia cardiaca, insuficiencia cardiaca compensada, insuficiencia cardiaca ambulatorial |
| `arritmia_fibrilacao_atrial` | arritmia, arritmias, fibrilacao atrial, fa, flutter atrial, taquiarritmia, palpitacoes, ritmo irregular |
| `estenose_aortica_valvopatia` | estenose aortica, valvopatia aortica, valvopatia, sopro sistolico ejetivo, sopro em foco aortico |
| `pericardite_aguda` | pericardite, pericardite aguda, dor pericardica, atrito pericardico |
| `disseccao_aorta` | disseccao, disseccao de aorta, disseccao aortica, sindrome aortica aguda, dor toracica rasgando |
| `derrame_pleural` | derrame pleural, efusao pleural, pleurite com derrame, liquido pleural, sindrome pleural |

---

## 4. Desambiguação IC crônica estável × IC descompensada

Marcadores no texto (avaliados após o match):
- **Descompensação (IC aguda → `insuficiencia_cardiaca`):** `descompensad | edema agudo | congestao pulmonar | dispneia aguda | descompensacao`
- **Cronicidade/estabilidade (→ `ic_cronica_estavel`):** `cronic | estavel | compensad | seguimento | ambulatorial | acompanhamento`
- Sem marcadores → default `insuficiencia_cardiaca` (preserva o comportamento do Lote 2A).

A descompensação é checada **antes** da cronicidade, porque "compensad" é substring de "descompensad".

Exemplos:
- "Insuficiência Cardíaca Crônica estável (acompanhamento)" → `ic_cronica_estavel`
- "Insuficiência cardíaca compensada ambulatorial" → `ic_cronica_estavel`
- "Insuficiência Cardíaca Descompensada (edema agudo de pulmão)" → `insuficiencia_cardiaca`
- "Insuficiência Cardíaca Sistólica (FEVE reduzida)" → `insuficiencia_cardiaca`

---

## 5. Robustez adicional

1. **Match por menor posição no texto** — o diagnóstico principal aparece primeiro; entre múltiplos matches, escolhe-se o de menor índice. Resolve "Derrame Pleural (provável insuficiência cardíaca)" → `derrame_pleural` (e não IC, que aparece depois como causa).
2. **Word boundary** (dos lotes anteriores) protege siglas curtas: `fa` só casa isolado; `ic` não casa dentro de "insuficiência".
3. **Alias raiz `disseccao`** — cobre "Dissecção Aguda de Aorta", "Dissecção de Aorta", "Dissecção Aórtica" e "Síndrome Aórtica Aguda" sem falsos positivos.

---

## 6. Testes — Lote 2B (casos reais)

| Caso | Diagnóstico | Rubrica aplicada | Consistência | Nota = soma |
|---|---|---|---|---|
| 7 | Pericardite Aguda | `pericardite_aguda` | ✅ | ✅ |
| 21 | Fibrilação Atrial Paroxística | `arritmia_fibrilacao_atrial` | ✅ | ✅ |
| 24 | Estenose Aórtica Grave | `estenose_aortica_valvopatia` | ✅ | ✅ |
| 16 | Derrame Pleural (provável IC) | `derrame_pleural` (não IC) | ✅ | ✅ |

Exemplo de especificidade (Estenose aórtica — Exame físico): ausculta nos focos valvares; sopro sistólico ejetivo em foco aórtico; irradiação para carótidas; pulso parvus et tardus.

---

## 7. Testes de não-regressão (Lotes 1 e 2A)

| Caso / termo | Esperado | Obtido |
|---|---|---|
| Caso 8 — IC Sistólica (FEVE reduzida) | `insuficiencia_cardiaca` | ✅ |
| Caso 1 — SCA/IAMCSST | `sca_iam` | ✅ |
| Caso 9 — DPOC Exacerbação | `dpoc_exacerbado` | ✅ |
| Caso 2 — PAC adulto | `pneumonia_adulto` | ✅ |
| PAC + pediátrico | `pneumonia_pediatrica` | ✅ |
| Dengue com Sinais de Alarme | `dengue_grave` | ✅ |
| Virose pediátrica | `virose_pediatrica` | ✅ |
| "Falta de ar por ansiedade" | `null` (fallback) | ✅ |

`insuficiencia_cardiaca` descompensada **não** foi quebrada por `ic_cronica_estavel`; pneumonia adulto e pediátrica continuam separadas.

---

## 8. Confirmações

| Item | Status |
|---|---|
| 6 rubricas do lote implementadas | ✅ |
| Desambiguação IC crônica × descompensada | ✅ |
| Match por menor posição (derrame × IC) | ✅ |
| Aliases curtos protegidos (fa, ic) | ✅ |
| Todos os 6 cards com critérios específicos | ✅ |
| Card com acertos não fica 0 | ✅ (0 consistency errors) |
| Critério negativo não acionado não vira acerto | ✅ |
| Evidência no card correto | ✅ |
| Nota = soma dos 6 cards | ✅ |
| Classificação textual usa nota visual | ✅ |
| Fallback genérico preservado | ✅ |
| Rubricas dos Lotes 1 e 2A intactas | ✅ |
| Layout inalterado / sem 7º card | ✅ |
| ECG, Open-i, radiologia, exame físico visual, imagens, /api/corrigir | ✅ intactos |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

> As notas dos testes são baixas porque o atendimento de teste é sintético/genérico (o grader marca critérios como não cumpridos) — não é bug.

---

## 9. Próximos passos sugeridos (não implementados agora)

1. Outros sistemas em lotes futuros: infectologia (sepse, ITU/pielonefrite, meningite), neurologia (AVC, cefaleia), abdome agudo, endócrino/metabólico (CAD).
2. Validação no navegador com atendimentos reais completos.
3. Eventual marcação discreta no verso do card distinguindo critério específico do caso vs mínimo genérico (sem redesenho).
