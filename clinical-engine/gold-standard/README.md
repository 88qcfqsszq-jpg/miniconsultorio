# Gold Standard Engine (Fase 12)

> **Status:** módulo **estrutural, aditivo e desacoplado**. NÃO chama IA, NÃO cria
> endpoint/UI/chat, NÃO altera Feedback/HealthBench/OSCE/Centro Clínico/rotas e
> **não é consumido por nenhum runtime**. Remover a pasta não afeta o sistema.

## O que é
O **Gold Standard** é o **gabarito perfeito** de um caso: uma normalização estável
do **Caso Canônico** numa estrutura pensada para ser a **fonte de verdade pedagógica**
de vários consumidores futuros.

```
Caso Canônico → Gold Standard Engine → gabarito perfeito do caso
```

## Por que existe
Hoje cada consumidor (Professor IA, HealthBench, Feedback, resposta modelo, plano de
estudo, Centro Clínico) derivaria "o certo" do caso à sua maneira. O Gold Standard
centraliza **uma única definição** de: o que é obrigatório perguntar/examinar/pedir,
qual o diagnóstico e diferenciais, qual a conduta ideal, quais os erros críticos, a
resposta modelo, o checklist de nota máxima, as pegadinhas e os pontos de ensino.

## Arquivos
| Arquivo | Papel | IA? |
|---|---|---|
| `types.ts` | 13 tipos do Gold Standard (`GoldStandardCase`, seções, checklist, história, exame, exames, diagnóstico, diferencial, conduta, erro crítico, ponto de ensino, feedback modelo, dicas do professor) | ❌ |
| `gold-standard-engine.ts` | `buildGoldStandardFromCanonicalCase(caso)` + `buildTruthLayers` + helpers (`getGoldStandardChecklist/TeachingPoints/CriticalErrors/ModelAnswer` + `getClinical/Educational/Evaluation/Teaching/ResourceTruth`, `getTruthLayerSummary`) | ❌ |
| `pac-gold-standard.ts` | Gold Standard do **PAC** (gerado do `CANONICAL_PAC` + curadoria da estação) + registro + `getGoldStandardByCanonicalId` | ❌ |
| `README.md` | este arquivo | ❌ |

## Como funciona
`buildGoldStandardFromCanonicalCase(canonicalCase)` é **puro e determinístico**
(mesma entrada → mesma saída, exceto o timestamp `geradoEm`). Ele deriva:

- **objetivos da estação** ← `identificacao.objetivosAprendizagem`;
- **anamnese obrigatória** ← `rubrica.microcriteriosPorEixo.anamnese`;
- **anamnese recomendada** ← história (antecedentes/medicações/alergias/hábitos/fatores);
- **exame físico obrigatório** ← `microcriteriosPorEixo.exameFisico`;
- **exame físico recomendado / achados** ← exame físico canônico;
- **exames obrigatórios × complementares** ← `exames[]` (campo `obrigatoriedade` ou heurística pelo nome);
- **diagnóstico + diferenciais** ← `diagnostico`;
- **conduta ideal** ← `conduta`;
- **erros críticos** ← `rubrica.errosCriticos`;
- **checklist nota máxima** ← `feedbackEsperado.checklistNotaMaxima` (+ heurística de criticidade);
- **pontos de ensino** ← `professorObjectives` × `perguntasSocraticas`;
- **resposta modelo / pegadinhas / plano de reforço** ← `feedbackEsperado`;
- **dicas do Professor IA** ← `professorIA`;
- **recursos** ← Centro Clínico (`conhecimentoRelacionado.links`) + Knowledge Graph (`refs.*`).

### PAC (curadoria da estação)
`pac-gold-standard.ts` começa da saída do engine sobre `CANONICAL_PAC` e sobrepõe as
listas **obrigatórias completas** exigidas pela estação de PAC (anamnese, exame físico,
exames obrigatórios incluindo oximetria e gasometria complementar, diferenciais com
DPOC, conduta ideal, 6 erros críticos e 5 pontos de ensino).

## Truth Layers (Fase 13)
O Gold Standard não é só um objeto grande: ele organiza a verdade do caso em **5 camadas**
escaláveis, expostas em `truthLayers?` (opcional, retrocompatível). O engine sempre as
preenche; o PAC tem versão **curada**.

| Camada | Responde à pergunta | Conteúdo |
|---|---|---|
| **Clinical Truth** | Qual é a medicina pura? | diagnóstico, fisiopatologia, diferenciais, justificativa, achados-chave, gravidade, conduta/tratamento, internação/alta, erros clínicos graves |
| **Educational Truth** | Como ensinar? | objetivos, conceitos essenciais, sequência didática, pegadinhas, erros comuns, analogias, pontos de confusão, perguntas de raciocínio |
| **Evaluation Truth** | Como avaliar? | checklist nota máxima, critérios obrigatórios/críticos, microcritérios, pesos, erros críticos, eixos HealthBench, critérios que reprovam, objetivos avaliáveis |
| **Teaching Truth** | Como o Professor IA conduz? | objetivos do professor, perguntas socráticas, mini-aulas, modo se erro crítico/nota alta, feedback esperado, plano de treino, mini-quiz, explicações curtas/aprofundadas |
| **Resource Truth** | Quais recursos da plataforma? | links do Centro Clínico, ids do Knowledge Graph, sons, imagens, exames, fluxos, guidelines, scores, fármacos, referências |

Helpers: `getClinicalTruth` · `getEducationalTruth` · `getEvaluationTruth` · `getTeachingTruth` · `getResourceTruth` · `getTruthLayerSummary`.

## Uso (exemplos)
```ts
import { getGoldStandardByCanonicalId } from "./pac-gold-standard";
import { getGoldStandardChecklist, getGoldStandardModelAnswer } from "./gold-standard-engine";

const gs = getGoldStandardByCanonicalId("pac");
const checklist = gs && getGoldStandardChecklist(gs);
const respostaModelo = gs && getGoldStandardModelAnswer(gs);
```

## Relação com os consumidores (FUTURO — nada conectado ainda)
- **HealthBench:** poderá usar checklist obrigatório + erros críticos como base da rubrica.
- **Professor IA:** poderá usar objetivos, pontos de ensino, perguntas socráticas e resposta modelo (o dry-run já inclui o Gold Standard PAC no pacote, como prova type-checked).
- **Feedback / resposta modelo:** poderá exibir `feedbackModelo.respostaModelo` e `checklistNotaMaxima`.
- **Centro Clínico inteligente:** poderá usar `recursos.centroClinico` + `recursos.knowledgeGraph`.

## Garantias
- 100% aditivo; nenhum arquivo de runtime/OSCE/Feedback/HealthBench/Centro Clínico/rota alterado.
- Sem IA, sem endpoint, sem chat, sem UI.
- Type-check limpo. Verificação de execução feita por type-stripping (imports sem extensão não rodam direto no Node — mesma limitação conhecida do projeto; o type-check é a prova).
