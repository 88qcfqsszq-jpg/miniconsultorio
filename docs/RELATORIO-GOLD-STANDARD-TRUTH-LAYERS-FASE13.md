# Relatório — Modularização do Gold Standard em Truth Layers (Fase 13)

_Data: 2026-07-03 · Camada **estrutural e aditiva**, limitada a `clinical-engine/gold-standard/` + `docs/` + prova type-checked em `lib/professor-ia/dry-run.ts`. Sem IA, endpoint, chat ou UI. Não altera Feedback, HealthBench, OSCE, Centro Clínico, rotas ou layout. Não substitui `data/casos-osce.ts` nem o Caso Canônico PAC._

## Objetivo
Refatorar conceitualmente o Gold Standard para que ele não seja apenas um objeto grande, organizando a verdade do caso em **5 Truth Layers** escaláveis:
1. **Clinical Truth** — a medicina pura.
2. **Educational Truth** — como ensinar.
3. **Evaluation Truth** — como avaliar.
4. **Teaching Truth** — como o Professor IA conduz.
5. **Resource Truth** — recursos da plataforma ligados ao caso.

## Arquivos alterados
- `clinical-engine/gold-standard/types.ts` — tipos das 5 camadas + `truthLayers?` opcional no `GoldStandardCase`.
- `clinical-engine/gold-standard/gold-standard-engine.ts` — `buildGoldStandardFromCanonicalCase` passa a gerar `truthLayers` (via `buildTruthLayers`); 6 novos helpers.
- `clinical-engine/gold-standard/pac-gold-standard.ts` — PAC com as 5 Truth Layers **curadas**.
- `clinical-engine/gold-standard/README.md` — seção Truth Layers.
- `lib/professor-ia/dry-run.ts` — inclui `truthLayersResumo` no pacote (prova type-checked; não é runtime da app).
- `docs/RELATORIO-GOLD-STANDARD-TRUTH-LAYERS-FASE13.md` — este relatório.

## Tipos adicionados
`GoldStandardTruthLayers` · `ClinicalTruth` · `EducationalTruth` · `EvaluationTruth` · `TeachingTruth` · `ResourceTruth` (+ auxiliares `EvaluationWeight`, `TeachingQuizItem`). Campo novo: `GoldStandardCase.truthLayers?` (**opcional** → retrocompatível).

## Truth Layers criadas
Cada camada é derivada deterministicamente do Caso Canônico (engine) e pode ser **curada** por caso (PAC). O engine sempre preenche `truthLayers`; o PAC tem versão curada.

## Conteúdo das 5 camadas do PAC (curado e verificado em execução)

### 1. Clinical Truth
- **Diagnóstico:** Pneumonia Adquirida na Comunidade (PAC).
- **Fisiopatologia:** inflamação/infecção do parênquima pulmonar com preenchimento alveolar (consolidação), tipicamente bacteriana.
- **Diferenciais (6):** asma, DPOC, TEP, IC, tuberculose, bronquite.
- **Justificativa:** febre + tosse + dispneia + crepitações + consolidação no RX; síndrome consolidativa; RX + leucocitose.
- **Achados-chave:** febre, tosse produtiva, dispneia, crepitações focais, frêmito↑/submacicez, consolidação no RX.
- **Sinais de gravidade (5):** SpO₂ baixa, FR elevada, confusão, hipotensão, comorbidades descompensadas.
- **Conduta ideal (6):** gravidade → local de tratamento → antibiótico com dose/via/duração → sinais de alarme → reavaliação → internação se critérios.
- **Erros clínicos graves (6):** não pedir RX, antibiótico inadequado, sem dose, ignorar hipoxemia, alta sem critérios, não avaliar sinais vitais.

### 2. Educational Truth
- **Conceitos essenciais (5):** diferenciar consolidação de broncoespasmo; correlacionar ausculta + RX + clínica; importância da SpO₂/FR; antibiótico com dose; CURB-65.
- **Sequência didática, pegadinhas, erros comuns, analogias (1), pontos de confusão (3), perguntas de raciocínio (4).**

### 3. Evaluation Truth
- **Critérios obrigatórios (7):** pedir RX, medir SpO₂, auscultar pulmão, diagnosticar PAC, prescrever antibiótico com dose, orientar sinais de alarme, programar reavaliação.
- **Checklist nota máxima:** 9 itens (**4 críticos**). **Microcritérios:** 6 eixos. **Pesos:** 3 (rubrica). **Erros críticos:** 6. **Eixos HealthBench:** 6. **Critérios que reprovam:** os 6 erros críticos.

### 4. Teaching Truth
- **Modo se erro crítico:** `reforco_de_erro_critico` (corrigir antibiótico sem dose / hipoxemia antes de aula longa).
- **Modo se nota alta:** `revisao_rapida`.
- **Mini-quiz (5):** por que antibiótico sem dose é inseguro · por que o RX muda a conduta · por que asma não explica consolidação · por que o TEP pode ter RX normal · qual escore avalia gravidade (CURB-65).
- **Explicações curtas (4)**, mini-aulas (1) e explicações aprofundadas (1).

### 5. Resource Truth
- **Sons:** `ls-crepitacoes` · **Imagens:** `img-rx-torax` · **Exames:** `lab-hemograma` · **Fluxos:** `flow-febre`, `flow-dispneia` · **Guidelines:** `guide-pneumonia` · **Scores:** `score-curb65` · **Fármacos:** `drug-amoxicilina` · **Referências:** `ref-open-i`, `ref-hls-cmds`.
- **Centro Clínico:** 6 links reais das rotas · **Knowledge Graph:** 17 ids.

## Helpers criados
`getClinicalTruth(gs)` · `getEducationalTruth(gs)` · `getEvaluationTruth(gs)` · `getTeachingTruth(gs)` · `getResourceTruth(gs)` · `getTruthLayerSummary(gs)` (+ `buildTruthLayers(gs, caso)` exportado).

## Impacto no Gold Standard existente / compatibilidade
- **Zero quebra:** todos os campos antigos (`anamnese`, `exameFisico`, `exames`, `diagnostico`, `conduta`, `errosCriticos`, `checklistNotaMaxima`, `pontosDeEnsino`, `feedbackModelo`, `professor`, `recursos`, `secoes`) permanecem presentes e inalterados.
- `truthLayers?` é **opcional** — consumidores anteriores (Fase 12) e seus helpers continuam funcionando sem modificação.
- O engine agora sempre popula `truthLayers`; quem não usar simplesmente ignora o campo.

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Execução real** (type-stripping em cópia temporária, descartada): `truthLayers` presente; **campos antigos preservados**; 5 camadas preenchidas; helpers retornam as camadas; `getTruthLayerSummary` confere as contagens (clinical: 6 dif / 5 gravidade / 6 erros; educational: 5 conceitos / 3 confusão; evaluation: 9 checklist / 4 críticos / 6 eixos / 3 pesos / 6 erros; teaching: 5 mini-quiz / 4 curtas; resource: 6 CC / 17 KG + sons/imagens/exames/fluxos/guidelines/scores/fármacos/referências).
- ✅ OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**; Caso Canônico PAC **não** alterado.
- ✅ Sem IA / endpoint / chat / UI.

## Limitações
- Só o **PAC** tem Truth Layers curadas; os demais casos recebem derivação genérica do engine (analogias/mini-quiz vazios até curadoria).
- `analogiasPermitidas` e `miniQuiz` são vazios na derivação genérica (preenchidos só na curadoria por caso).
- Imports sem extensão não rodam direto no Node (limitação conhecida do projeto); **type-check é a prova** e a execução foi confirmada por type-stripping numa cópia temporária.
- Nada consome as Truth Layers em runtime (por decisão desta fase).

## Próximos passos
1. Curar as Truth Layers dos demais casos canônicos (asma, DPOC, IC, SCA, TEP).
2. (Fase futura) HealthBench derivar a rubrica de **Evaluation Truth**; Professor IA consumir **Teaching Truth**; Centro Clínico inteligente consumir **Resource Truth**; Feedback consumir **Clinical/Educational Truth**.
3. Integrar o resumo das Truth Layers ao runner executado `scripts/professor-ia-dry-run.mjs` (hoje só o `dry-run.ts` type-checked o inclui).
4. Nada disso implica endpoint/chat/aba/IA nesta fase.
