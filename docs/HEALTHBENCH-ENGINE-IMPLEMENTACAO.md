# MiniConsultorio HealthBench Engine — Implementação

**Data:** 24 de junho de 2026
**Status:** ✅ Base arquitetural implementada, integrada e testada
**Objetivo:** Motor central de avaliação OSCE inspirado no OpenAI HealthBench — atendimento completo + rubrica estruturada + avaliação critério-por-critério + score por competência + feedback auditável.

---

## 1. Relatório da Auditoria (Fase 0)

| Item | Localização | Formato atual |
|---|---|---|
| **Casos clínicos** | `data/casos-osce.ts` (tipo `Caso` em `lib/types.ts`) | 64 casos; diagnóstico oculto em `dados_ocultos_do_sistema.diagnostico_principal` |
| **Rubrica oficial** | `Caso.rubrica_correcao: RubricaAvaliacao[]` | `{ criterio, peso, descricao, pontuacao_maxima }` |
| **Checklist** | `Caso.checklist_osce: ChecklistOSCE[]` | `{ item, realizado, critico? }` |
| **Erros críticos** | `Caso.erros_criticos: ErrosCriticos[]` | `{ erro, descricao, penalidade }` |
| **Competências** | `MAXIMOS_COMPETENCIAS` em `/api/corrigir` | 6 eixos = 20 pts: Comunicação(2), Anamnese(4), Exame físico(4), Exames(2), Raciocínio(5), Conduta(3) |
| **Cálculo da nota (atual)** | `app/api/corrigir/route.ts` (764 linhas) | IA `gpt-4o-mini` + `criarPromptExaminador`; soma `pontosObtidos`; ≥17 Excelente, ≥16 Bom, ≥12 Regular |
| **Botão finalizar** | `handleFinalizarAtendimento` → `app/caso/[id]/page.tsx` | POST `/api/corrigir` |
| **Feedback (UI)** | `components/FeedbackOSCE.tsx` | nota 0–20, aprovado ≥17, fase `"feedback"` |
| **Cliente IA** | `lib/openai.ts` | `openai` (null se sem `OPENAI_API_KEY`) |

**Dados do atendimento já coletados no finalizar** (reaproveitados pelo HealthBench): `historico` (chat `{tipo, conteudo}`), `exameFisico` (`{categoria, textDigitado, resposta}`), `sinaisVitaisSolicitados` + valores, `hipoteseDiagnostica`, `diagnosticosDiferenciais`, `examesRealizados` (`{nome, resultado}`), `examesIndicadosNoFormulario`, `conduta`, `soap`, `tempoAtendimento`.

### Resumo dos arquivos de referência HealthBench
- **`healthbench_eval.py`** — motor: avalia 1 critério/vez via grader IA → JSON `{explanation, criteria_met}`; score = pontos cumpridos / pontos positivos; critérios negativos descontam; métricas por tag.
- **`healthbench_meta_eval.py`** — mede concordância grader-vs-humano (controle de qualidade do avaliador).
- **`healthbench_analysis.ipynb`** — análise pós-avaliação (dashboards). Inspira `analytics.ts`.
- **`types.py` / `common.py`** — tipos base e utilidades de agregação/relatório.
- **`simple_evals.py`** — orquestração (separa modelo avaliado, grader, eval, salvamento).

> Os arquivos Python serviram apenas de inspiração conceitual — **nenhum foi copiado** para o app.

---

## 2. Arquitetura nova

```
caso clínico
  ↓
diagnóstico + rubrica oficial do caso (rubrica_correcao + checklist_osce + erros_criticos)
  ↓
payload do atendimento (chat, exame físico, sinais vitais, exames, diagnóstico, conduta, SOAP)
  ↓
POST /api/healthbench/evaluate
  ↓
normalizarTranscript()   → linha do tempo única (HealthBenchMessage[])
  ↓
adaptarRubricaDoCaso()   → HealthBenchRubricItem[] (com tags axis:/theme:/skill:/error:)
  ↓
avaliarTodosCriterios()  → grader IA, UM critério por vez → HealthBenchCriterionGrade[]
  ↓
calcularScore()          → score01, notaFinal (0–20), passed
  ↓
calcularMetrics()        → score por competência / tema / skill
  ↓
construirFeedbackProfessor() + nextTrainingFocus
  ↓
salvarTentativa()        → persistência best-effort (memória + /tmp em dev)
  ↓
HealthBenchEvaluationResult → HealthBenchFeedbackPanel (abaixo do FeedbackOSCE existente)
```

---

## 3. Arquivos criados (16)

### Motor — `lib/healthbench/`
| Arquivo | Responsabilidade |
|---|---|
| `types.ts` | Tipos centrais (Message, Transcript, RubricItem, CriterionGrade, EvaluationResult, AttemptResult, CompetencyScore) + tags padrão + disclaimer |
| `transcript-normalizer.ts` | Transforma todo o atendimento numa linha do tempo única; serializa para o prompt |
| `rubric-adapter.ts` | Converte a rubrica OSCE oficial → `HealthBenchRubricItem[]`; infere tags `axis:`/`theme:`; trata erros críticos como critérios negativos |
| `grader-template.ts` | Prompt do avaliador (1 critério por vez, equivalências clínicas, JSON estrito) |
| `grader.ts` | Chama IA (gpt-4o-mini, JSON mode); fallback heurístico se IA indisponível |
| `score.ts` | `score01 = clamp(achieved/maxPossible)`; negativos descontam; `passed` (≥17 e sem erro crítico) |
| `metrics.ts` | Agrega score por `axis:`, `theme:`, `skill:`; conta cumpridos/falhos/críticos |
| `evaluator.ts` | Orquestrador `evaluateHealthBenchAttempt()` |
| `feedback-builder.ts` | Feedback do professor + plano de melhoria (determinístico, auditável) |
| `result-writer.ts` | Persistência best-effort (memória + arquivo `/tmp` só em dev) |
| `analytics.ts` | Funções de agregação para dashboards futuros |
| `meta-evaluator.ts` | Tipos + estrutura para concordância IA-vs-humano (TODO futuro) |

### Endpoint
- `app/api/healthbench/evaluate/route.ts` — `POST`, carrega o caso por `casoId`, chama o evaluator, retorna `HealthBenchEvaluationResult`.

### Componentes — `components/healthbench/`
| Componente | Função |
|---|---|
| `HealthBenchFeedbackPanel.tsx` | Painel principal (nota, aprovado/reprovado, erros críticos, competências, critérios, feedback, plano) |
| `CriterionGradeCard.tsx` | Card por critério (positivo/negativo/crítico, explicação, pontos) |
| `CompetencyScoreCard.tsx` | Barras de score por competência |
| `CriticalErrorsBox.tsx` | Destaque de erros críticos / segurança |

---

## 4. Arquivos alterados (1)

| Arquivo | Mudança |
|---|---|
| `app/caso/[id]/page.tsx` | Estado `healthBenchResult`; função `avaliarHealthBench()` (best-effort, disparada após o feedback antigo); render do `HealthBenchFeedbackPanel` abaixo do `FeedbackOSCE`; 2 imports. **O feedback antigo permanece intacto.** |

---

## 5. Fluxo de dados

```
caso → diagnóstico → rubrica oficial → transcript normalizado →
grader (1 critério/vez) → grades → score/metrics → feedback → painel
```

O `/api/corrigir` (feedback antigo) **não foi modificado**. O HealthBench roda em paralelo e é puramente aditivo.

---

## 6. Tags padrão adotadas

- **Eixos:** `axis:anamnese`, `axis:comunicacao`, `axis:exame_fisico`, `axis:exames_complementares`, `axis:raciocinio_clinico`, `axis:conduta`, `axis:seguranca`
- **Temas:** `theme:respiratorio`, `theme:cardiovascular`, `theme:infectologia`, `theme:pediatria`, `theme:urgencia`
- **Skills:** `skill:reavaliacao`, `skill:sinais_de_gravidade`
- **Erros:** `error:alta_insegura`

---

## 7. Exemplo real de JSON retornado (caso 3 — Asma)

```json
{
  "casoId": 3,
  "attemptId": "hb_3_1782321655696_qyekv2",
  "score01": 0.778,
  "notaFinal": 15.6,
  "pontuacaoMaxima": 20,
  "passed": false,
  "grades": [
    {
      "rubricItemId": "rubrica-1-terapia-broncodilatadora",
      "criterion": "Terapia Broncodilatadora — Salbutamol apropriadamente prescrito",
      "criteria_met": true,
      "explanation": "O aluno prescreveu Salbutamol inalatório como parte da conduta...",
      "points": 25,
      "points_awarded": 25,
      "tags": ["axis:conduta", "theme:respiratorio"],
      "type": "positive"
    }
  ],
  "competencyScores": { "axis:conduta": 0.55, "axis:seguranca": 0, "axis:raciocinio_clinico": 0 },
  "themeScores": { "theme:respiratorio": 0.26 },
  "criticalErrors": [ /* ... */ ],
  "professorFeedback": "Nota: 15.6/20 (78% da rubrica)...",
  "nextTrainingFocus": ["Segurança", "Raciocínio clínico", "Anamnese"],
  "usage": { "input_tokens": 4058, "output_tokens": 450, "estimated_cost_usd": 0.000879 },
  "disclaimer": "Avaliação educacional gerada por simulação OSCE. Não constitui orientação médica real..."
}
```

---

## 8. Como testar em localhost

```bash
npm run dev
```

**Via UI:** abrir um caso OSCE → fazer atendimento → "Finalizar Atendimento e Ver Feedback" → o painel HealthBench aparece **abaixo** do feedback OSCE existente.

**Via API:**
```bash
curl -X POST http://localhost:3000/api/healthbench/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "casoId": "3",
    "chatMessages": [{"tipo":"estudante","conteudo":"A senhora tem chiado no peito?"}],
    "physicalExamEvents": [{"categoria":"respiratorio","textDigitado":"ausculta pulmonar","resposta":"Sibilos difusos"}],
    "vitalSignsEvents": {"solicitado": true, "dados": {"frequenciaRespiratoria": 32, "saturacaoO2": 91}},
    "diagnosisAndPlan": {"hipotesePrincipal":"Crise asmática","conduta":"Salbutamol e corticoide"},
    "soap": {"avaliacao":"Crise asmática moderada"}
  }'
```

### Resultados dos testes executados
| Teste | Resultado |
|---|---|
| Atendimento completo (asma) | ✅ 15.6/20, grades com explicações em PT |
| Atendimento fraco (1 pergunta) | ✅ 4.2/20, 8 itens críticos sinalizados |
| Caso inexistente (`9999`) | ✅ HTTP 404 limpo |
| Logs `[HEALTHBENCH ...]` | ✅ AUDIT, NORMALIZER, RUBRIC, GRADER, SCORE, RESULT |
| `tsc --noEmit` nos arquivos novos | ✅ 0 erros |

---

## 9. Score e fórmula

- `max_possible_score` = soma dos `points > 0`
- `achieved_score` = soma dos `points_awarded` (positivos somam; negativos descontam)
- `score01 = clamp(achieved / max_possible, 0, 1)`
- `notaFinal = score01 × 20` (escala do Mini Consultório)
- `passed` = `notaFinal ≥ 17` **e** nenhum erro crítico negativo cometido

---

## 10. Segurança e limitações

- Todo resultado carrega `disclaimer`: **avaliação educacional simulada**, não é orientação médica real.
- Não usa dados de pacientes reais.
- O grader avalia só evidências do transcript; não dá crédito por ação não realizada.
- Paciente IA e avaliador IA **não** compartilham prompt.
- Fallback: se a IA estiver indisponível, o grader usa heurística textual (não quebra).

---

## 11. Compatibilidade e fallback

- O feedback antigo (`/api/corrigir` + `FeedbackOSCE`) **não foi alterado** e continua sendo o caminho principal.
- A avaliação HealthBench é **aditiva e best-effort**: chamada em `try/catch`, e o painel só renderiza se `healthBenchResult` existir. Se a API falhar, o fluxo antigo funciona normalmente.

---

## 12. Confirmação de escopo

- ✅ **ECG não alterado.** `tsc --noEmit` confirma que os 17 erros de tipo do projeto são **todos pré-existentes** e exclusivos do módulo ECG (`src/services/ecgGenerator/*`). Nenhum arquivo HealthBench/Open-i tem erro.
- ✅ Open-i, radiologia, exame físico visual e layout geral **não** foram tocados.
- ✅ Rubrica existente é a fonte oficial; nenhuma rubrica paralela criada.

> **Pendência pré-existente (fora deste escopo):** `npm run build` completo ainda falha no type-check por erro antigo de ECG em `src/services/ecgGenerator/leadTransform.ts:286` (mapped type declarado em `interface`). O módulo HealthBench compila e roda; o dev server funciona normalmente.

---

## 13. Próximos passos sugeridos (não implementados)

- Dashboard usando `analytics.ts` (média por competência/tema, erros recorrentes, evolução por tentativa).
- Meta-avaliação humana via `meta-evaluator.ts` (concordância IA-vs-humano, critérios injustos).
- Persistência real (banco) substituindo o `result-writer` em memória/arquivo.
- Migração gradual do feedback antigo para o HealthBench como fonte única, após validação.
