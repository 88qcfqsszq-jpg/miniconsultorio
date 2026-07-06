# Relatório — Canonical Case Engine / Gold Standard Engine (Fase 12)

_Data: 2026-07-03 · Camada **estrutural e aditiva**, limitada a `clinical-engine/` + `docs/` + prova type-checked em `lib/professor-ia/dry-run.ts`. Sem IA, endpoint, chat ou UI. Não altera Feedback, HealthBench, OSCE, Centro Clínico, rotas ou layout. Não substitui `data/casos-osce.ts` nem a resposta modelo atual._

## Objetivo
Criar a camada que transforma cada **Caso Canônico** no seu **Gold Standard** — o
gabarito perfeito, fonte de verdade pedagógica para (futuramente) Professor IA,
HealthBench, Feedback, resposta modelo, checklist de nota máxima, plano de estudo e
Centro Clínico inteligente.

```
Caso Canônico → Gold Standard Engine → gabarito perfeito do caso
```

## Arquivos criados
- `clinical-engine/gold-standard/types.ts` — tipos do Gold Standard.
- `clinical-engine/gold-standard/gold-standard-engine.ts` — `buildGoldStandardFromCanonicalCase` + helpers.
- `clinical-engine/gold-standard/pac-gold-standard.ts` — Gold Standard do PAC + registro + lookup.
- `clinical-engine/gold-standard/README.md` — documentação do módulo.
- `docs/RELATORIO-GOLD-STANDARD-ENGINE-FASE12.md` — este relatório.

## Arquivos alterados (mínimo, prova type-checked)
- `lib/professor-ia/dry-run.ts` — inclui o `goldStandard: GoldStandardCase` (PAC) no pacote final. **Não é runtime da app** (é a prova type-checked da arquitetura). O runner executado `scripts/professor-ia-dry-run.mjs` **não** foi alterado (ver "Próximos passos").

## Arquitetura
`buildGoldStandardFromCanonicalCase(caso)` é **puro e determinístico** (mesma entrada → mesma saída, exceto o timestamp `geradoEm`). Import do Caso Canônico é `import type` (zero acoplamento de runtime). Não consome nada do sistema atual e nada o consome ainda.

Derivações a partir do Caso Canônico:
| Área do Gold Standard | Origem no Caso Canônico |
|---|---|
| objetivos da estação | `identificacao.objetivosAprendizagem` |
| anamnese obrigatória | `rubrica.microcriteriosPorEixo.anamnese` |
| anamnese recomendada | `historia.*` (antecedentes/medicações/alergias/hábitos/fatores) |
| exame físico obrigatório | `microcriteriosPorEixo.exameFisico` |
| exame físico recomendado / achados | `exameFisico.*` |
| exames obrigatórios × complementares | `exames[]` (campo `obrigatoriedade` ou heurística de nome) |
| diagnóstico + diferenciais | `diagnostico.*` |
| conduta ideal | `conduta.*` |
| erros críticos | `rubrica.errosCriticos` |
| checklist nota máxima | `feedbackEsperado.checklistNotaMaxima` (+ heurística de criticidade) |
| pontos de ensino | `professorObjectives` × `perguntasSocraticas` |
| resposta modelo / pegadinhas / plano de reforço | `feedbackEsperado.*` |
| dicas do Professor IA | `professorIA.*` |
| recursos | `conhecimentoRelacionado.links` + `refs.*` (Knowledge Graph) |

O **PAC** parte da saída do engine sobre `CANONICAL_PAC` e recebe uma **curadoria da estação** (listas obrigatórias completas).

## Tipos criados (13)
`GoldStandardCase` · `GoldStandardSection` · `GoldStandardChecklistItem` · `GoldStandardHistory` · `GoldStandardPhysicalExam` · `GoldStandardExamRequest` · `GoldStandardDiagnosis` · `GoldStandardDifferential` · `GoldStandardManagement` · `GoldStandardCriticalError` · `GoldStandardTeachingPoint` · `GoldStandardFeedbackModel` · `GoldStandardProfessorHints`
(+ auxiliares: `GoldStandardObligation`, `GoldStandardAxis`, `GoldStandardResources`, `GoldStandardResourceLink`, const `GOLD_STANDARD_SCHEMA_VERSION = "1.0.0"`.)

## Função principal e helpers
- `buildGoldStandardFromCanonicalCase(canonicalCase): GoldStandardCase`
- `getGoldStandardByCanonicalId(canonicalId): GoldStandardCase | undefined`
- `getGoldStandardChecklist(gs)` · `getGoldStandardTeachingPoints(gs)` · `getGoldStandardCriticalErrors(gs)` · `getGoldStandardModelAnswer(gs)`
- `montarSecoes(gs)` (representação achatada e legível)

## Gold Standard PAC gerado (verificado em execução)
- **geradoDe:** canonicalId `pac`, legacyId `2`, diagnóstico igual ao `CANONICAL_PAC` ✅.

**Anamnese obrigatória (10):** Duração da tosse · Presença de febre · Expectoração (aspecto/cor) · Dispneia · Dor torácica pleurítica · Comorbidades · Tabagismo · Alergias · Uso prévio de antibiótico · Sinais de gravidade.

**Exame físico obrigatório (8):** Sinais vitais completos · SpO₂ (oximetria) · Frequência respiratória · Estado geral · Ausculta pulmonar · Pesquisa de sinais de consolidação · Avaliação cardiovascular básica · Hidratação/perfusão.

**Exames obrigatórios (3):** RX de tórax PA e perfil · Hemograma completo · Saturação/oximetria de pulso.
**Complementares (2):** Gasometria arterial (se hipoxemia/gravidade) · Procalcitonina (opcional).

**Diagnóstico:** Pneumonia Adquirida na Comunidade (PAC).
**Diferenciais (6):** Asma · DPOC · TEP · Insuficiência cardíaca · Tuberculose · Bronquite aguda.

## Checklist obrigatório (nota máxima)
9 itens (todos `obrigatorio`), **4 marcados como críticos** pela heurística (RX, antibiótico/dose, SpO₂/sinais vitais):
apresentar-se · caracterizar tosse/febre · investigar dispneia/dor/contatos · **medir sinais vitais com SpO₂** · auscultar e identificar crepitações · **solicitar RX + hemograma** · formular PAC com diferenciais · **prescrever antibiótico com dose** · avaliar gravidade e orientar alarme/retorno.

## Resposta modelo
Reaproveitada do caso canônico (417 chars): hipótese de PAC a partir de tosse produtiva + febre + dor pleurítica + dispneia com crepitações/submacicez em base esquerda; RX + hemograma; avaliação de gravidade (SpO₂ 92%, FR 24); antibioticoterapia empírica (betalactâmico + macrolídeo) com hidratação e O₂; orientação de sinais de alarme e reavaliação em 48–72h.

## Conduta ideal (6)
Avaliar gravidade (SpO₂/FR/CURB-65) · definir local de tratamento · iniciar antibiótico adequado com dose, via e duração · orientar sinais de alarme · programar reavaliação em 48–72h · considerar internação se critérios de gravidade.

## Erros críticos (6)
Não solicitar RX · prescrever antibiótico inadequado · não especificar a dose · ignorar hipoxemia · dar alta sem critérios · não avaliar sinais vitais.

## Pontos de ensino (5)
Correlacionar febre + tosse + crepitações + RX · diferenciar consolidação de broncoespasmo · importância da SpO₂/FR · antibiótico com dose · critérios de gravidade. (Cada um pareado a uma pergunta socrática.)

## Relação com HealthBench
O checklist obrigatório + erros críticos do Gold Standard espelham a rubrica do caso (mesmos itens críticos: RX, antibiótico/dose, SpO₂). No futuro, o HealthBench poderá **derivar a rubrica** do Gold Standard em vez de duplicá-la — sem alterar o motor atual nesta fase.

## Relação com Professor IA
O dry-run do Professor IA já **inclui** `goldStandard` (PAC) no pacote final (prova type-checked). O Professor IA poderá usar objetivos da estação, pontos de ensino, perguntas socráticas, conduta ideal e resposta modelo como fonte única de verdade, alinhando Teaching Engine / Lesson Planner ao gabarito.

## Relação com Centro Clínico
`recursos.centroClinico` (links reais das rotas) + `recursos.knowledgeGraph` (17 ids do grafo) permitem, no futuro, um Centro Clínico "inteligente" que abre exatamente os recursos do gabarito do caso.

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Execução real** (via type-stripping em cópia temporária com extensões, depois descartada): Gold Standard PAC gerado a partir do `CANONICAL_PAC`; helpers funcionam; contagens conferidas (anamnese 10, exame 8, exames 3+2, diferenciais 6, conduta 6, erros 6, ensino 5, checklist 9/4 críticos, KG 17, seções 13); `getGoldStandardByCanonicalId("pac")` retorna o caso e `("xxx")` → `undefined`.
- ✅ **Nenhum arquivo de runtime da app alterado** (apenas `dry-run.ts`, que é prova type-checked e não é executado pela aplicação).
- ✅ OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**; `data/casos-osce.ts` **não** substituído.
- ✅ Sem chamada de IA / endpoint / chat / UI.

## Limitações
- Só o **PAC** tem Gold Standard curado; os demais casos canônicos podem ser gerados pelo engine puro, mas ainda sem curadoria da estação.
- A **criticidade** do checklist usa heurística por palavras-chave derivadas dos erros críticos/comuns do caso (suficiente para o PAC; calibração fina numa fase futura).
- Imports sem extensão não rodam direto no Node (limitação conhecida do projeto); o **type-check é a prova** e a execução foi confirmada por type-stripping numa cópia temporária.
- Nada consome o Gold Standard em runtime (por decisão desta fase).

## Próximos passos
1. Curar o Gold Standard dos demais casos canônicos (asma, DPOC, IC, SCA, TEP).
2. Integrar o Gold Standard ao **runner executado** `scripts/professor-ia-dry-run.mjs` (hoje só o `dry-run.ts` type-checked o inclui).
3. (Fase futura) HealthBench derivar a rubrica do Gold Standard; Feedback exibir a resposta modelo do Gold Standard; Centro Clínico inteligente abrir os recursos do gabarito.
4. Nada disso implica endpoint/chat/aba nesta fase.
