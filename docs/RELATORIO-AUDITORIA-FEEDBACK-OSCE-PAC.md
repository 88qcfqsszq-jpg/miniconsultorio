# Auditoria Profunda — Sistema de Feedback OSCE (PAC + HealthBench)

_Data: 2026-07-03 · Auditoria 100% somente-leitura. Nenhum arquivo funcional foi alterado. Único arquivo criado: este relatório._

---

## RESUMO EXECUTIVO

O Mini Consultório já possui um **motor de avaliação clínico maduro e bem arquitetado**, inspirado no OpenAI HealthBench: avaliação **critério-por-critério** com um grader de IA (com fallback heurístico), rubrica derivada do próprio caso, score normalizado, métricas por competência/tema, feedback textual de "professor" e persistência de tentativas.

**Existem hoje TRÊS camadas de avaliação coexistindo:**
1. **HealthBench Engine** (`lib/healthbench/*`) — **fonte da verdade** atual.
2. **Examinador legado** (`/api/corrigir` + `lib/prompts.ts`) — LLM único, roda em paralelo como fallback/comparação.
3. **Rubrica determinística por diagnóstico** (`feedback-consistency.ts` + `rubricas-diagnosticos/`) — camada NLP de consistência (ex.: PAC).

**Conclusão:** a arquitetura atual **é suficientemente robusta para servir de MOTOR PRINCIPAL do futuro Professor IA** — deve ser **reaproveitada e estendida (encapsulada)**, não reescrita. O que falta é sobretudo a camada de **Casos Canônicos** (fonte de conhecimento estruturada) e a **camada generativa/dialógica** do Professor. O motor de nota, rubrica, feedback e persistência já existe e funciona (validado com execução real do PAC neste relatório).

**Risco principal detectado:** os dois sistemas de IA (HealthBench × legado) **divergem significativamente** — no PAC executado, HealthBench deu **11.8/20 (reprovado)** e o legado deu **18/20 (Excelente)**, divergência de **-6.2** sinalizada automaticamente pelo `comparison`.

---

## ETAPA 1 — MAPEAMENTO COMPLETO

### Ponto de entrada (frontend)
- **`app/caso/[id]/page.tsx`** → `handleFinalizarAtendimento()` (linha ~334). Coleta transcript, exame físico, sinais vitais, exames, hipótese/diferenciais/conduta, SOAP, tempo.
  - **Primário:** `POST /api/osce/finalizar` (HealthBench = source of truth).
  - Constrói a view com `construirFeedbackViewDeHealthBench` (linha 18) → `setFeedback` → `<FeedbackOSCE>`.
  - **Fallback:** `POST /api/corrigir` (legado) se o primário falhar (linha ~482).

### APIs (rotas)
| Rota | Papel |
|---|---|
| `app/api/osce/finalizar/route.ts` | **Orquestrador central**: roda HealthBench + legado em paralelo, compara, persiste, retorna unificado |
| `app/api/corrigir/route.ts` | Examinador legado (LLM único, gpt-4o-mini, JSON) |
| `app/api/healthbench/evaluate/route.ts` | Endpoint direto do evaluator HealthBench |
| `app/api/healthbench/attempts/[attemptId]/route.ts` | Recupera uma tentativa persistida |
| `app/api/healthbench/analytics/route.ts` | Agregação/analytics de tentativas |
| `app/api/estudo-final-caso/route.ts` | Estudo/plano final do caso |

### Motor HealthBench (`lib/healthbench/`)
| Arquivo | Responsabilidade |
|---|---|
| `evaluator.ts` | **Orquestrador**: normaliza → adapta rubrica → grader → score → métricas → feedback → persiste |
| `rubric-adapter.ts` | Converte `Caso.rubrica_correcao/checklist_osce/erros_criticos` → `HealthBenchRubricItem[]` (+ microcritérios) |
| `grader.ts` | **Avalia UM critério por vez** via OpenAI (gpt-4o-mini) com fallback heurístico |
| `grader-template.ts` | `GRADER_SYSTEM_PROMPT` + `construirGraderUserPrompt` |
| `score.ts` | `calcularScore` (achieved/max×20), `temErroCriticoCometido`, `extrairErrosCriticos` |
| `metrics.ts` | `competencyScores`, `themeScores`, `overall_score` |
| `feedback-builder.ts` | `construirFeedbackProfessor`, `construirNextTrainingFocus` |
| `feedback-view-builder.ts` | `construirFeedbackViewDeHealthBench` → objeto `FeedbackOSCE` para a tela (6 cards) |
| `cards-config.ts` | **Fonte única dos 6 cards** e pesos (2/4/3/2/5/4 = 20) |
| `types.ts` | Interfaces centrais (transcript, rubric, grade, result) |
| `transcript-normalizer.ts` | Monta o transcript unificado do atendimento |
| `attempt-builder.ts` | `construirSnapshot`, `snapshotParaAtendimentoInput` |
| `attempt-store.ts` / `result-writer.ts` | **Persistência** (Map em memória + arquivos `.json` em disco) |
| `attempt-schema.ts` | `OSCEAttemptInput`, `HealthBenchAttemptRecord` |
| `analytics.ts` | Métricas agregadas |
| `legacy-adapter.ts` | `normalizeLegacyCorrectionResult`, `compareLegacyVsHealthBench` |
| `meta-evaluator.ts` | Meta-avaliação (auto-verificação) |
| `diagnosis-microcriteria.ts` | Microcritérios específicos por diagnóstico |
| `rubricas-diagnosticos/` | Rubrica determinística por diagnóstico (pac.ts, sca.ts, index.ts, tipos.ts, utils-deteccao.ts) |
| `feedback-consistency.ts` | Funções NLP de consistência (avaliarAnamnesePAC, avaliarExamesPAC, …) |

### Prompts (`lib/prompts.ts`, 1174 linhas)
- `criarPromptExaminador` (linha 577) — examinador legado.
- `GRADER_SYSTEM_PROMPT` (`grader-template.ts`) — grader HealthBench.
- Também há prompt do paciente virtual e do agente de exame físico/exames (fora do escopo de nota).

### Componentes de exibição
- `components/FeedbackOSCE.tsx` — tela principal do feedback (6 competências, nota, plano).
- `components/healthbench/HealthBenchFeedbackPanel.tsx` — painel HealthBench.
- `components/LoadingFeedback.tsx` — estado de carregamento.
- `components/pediatria/FeedbackPediatrico.tsx` — feedback pediátrico (caminho separado).
- `lib/pdf/exportar-feedback-atendimento.ts` — exportação PDF.

### Diagrama de fluxo (real)

```
Aluno (chat + exame + exames + hipótese/conduta + SOAP)
        │  handleFinalizarAtendimento()  [app/caso/[id]/page.tsx]
        ▼
POST /api/osce/finalizar  ──────────────┐
        │                                │
        ▼                                ▼
construirSnapshot                   rodarLegado() → POST /api/corrigir
        │                                │            └ criarPromptExaminador → OpenAI (gpt-4o-mini)
        ▼                                │              └ parse → rubrica 6 comp → nota=soma
evaluateHealthBenchAttempt              │
  1 normalizarTranscript                │
  2 (NLP enrichment auxiliar)           │
  3 adaptarRubricaDoCaso  ◄── Caso.rubrica_correcao/checklist_osce/erros_criticos + microcritérios
  4 avaliarTodosCriterios ── grader por-critério → OpenAI (gpt-4o-mini) [fallback heurístico]
  5 calcularScore (achieved/max × 20)
  6 calcularMetrics (competency/theme)
  7 construirFeedbackProfessor + nextTrainingFocus
  8 salvarTentativa (fs .json)
        │                                │
        ▼                                ▼
     healthBenchResult            legacyCorrectionResult
        └──────────► compareLegacyVsHealthBench ◄──────────┘
                          │
                          ▼
             saveAttempt (attempt-store + disco)
                          │  resposta unificada (sourceOfTruth: healthbench)
                          ▼
construirFeedbackViewDeHealthBench → objeto FeedbackOSCE (6 cards, nota=soma)
                          ▼
                  <FeedbackOSCE /> (tela)
```

---

## ETAPA 2 — CASO PAC (id 2)

O PAC não tem uma "rubrica hardcoded de nota"; a nota vem da **rubrica HealthBench adaptada do caso**. As fontes de critério do caso `id 2` (em `data/casos-osce.ts`):

**`rubrica_correcao`** (pesos na escala própria do caso):
| Critério | Peso / pontuacao_maxima |
|---|---|
| Diagnóstico Diferencial | 20 |
| Exames Complementares | 20 |
| Antibióticoterapia | 30 |
| … (demais itens do caso) | … |

**`checklist_osce`** (6 itens, **todos `critico: true`**):
| Item | Crítico |
|---|---|
| Caracterizou a tosse (seca vs produtiva) | ✔ |
| Perguntou sobre febre | ✔ |
| Mediu sinais vitais completos | ✔ |
| Realizou ausculta pulmonar completa | ✔ |
| Solicitou radiografia de tórax | ✔ |
| Prescreveu antibióticos apropriados | ✔ |

**`erros_criticos`** (critérios NEGATIVOS):
| Erro | Penalidade |
|---|---|
| Não solicitar radiografia de tórax | 1.5 |
| Prescrever antibiótico inapropriado | 2 |

`diagnosticoCorreto: "Pneumonia Adquirida na Comunidade"`.

**Como é avaliado:** `adaptarRubricaDoCaso` (rubric-adapter.ts) transforma cada item acima em `HealthBenchRubricItem` — infere o eixo (anamnese/exame/exames/raciocínio/conduta/segurança), atribui `points` (rubrica: peso; checklist: 1, crítico 2; erro: −penalidade), e completa cada card com **microcritérios atômicos** (`garantirCoberturaMinima`) até o `minimoCobertura`. No PAC executado geraram-se **26 critérios**.

---

## ETAPA 3 — RUBRICA (cálculo da nota)

### Rubrica visual (6 cards) — `cards-config.ts` (total 20)
| Card | Eixo | Peso | minimoCobertura |
|---|---|---|---|
| Comunicação e postura médica | axis:comunicacao | 2 | 4 |
| Anamnese dirigida | axis:anamnese | 4 | 4 |
| Exame físico | axis:exame_fisico | 3 | 4 |
| Exames complementares | axis:exames_complementares | 2 | 3 |
| Raciocínio diagnóstico | axis:raciocinio_clinico | 5 | 4 |
| Conduta e Segurança | axis:conduta_seguranca | 4 | 5 |

### Escala / normalização / cálculo (dois níveis)
1. **Score HealthBench bruto** (`score.ts`):
   - `maxPossibleScore` = Σ points positivos.
   - `achievedScore` = Σ points_awarded (positivos somam; **negativos descontam**; piso 0).
   - `score01` = clamp(achieved/max, 0, 1).
   - `notaFinal` = round(score01 × 20, 1 casa).
   - `passed` = `notaFinal ≥ 17` **E** nenhum erro crítico cometido.
2. **Nota visual da tela** (`feedback-view-builder.ts`):
   - Particiona as grades nos 6 cards (`resolverAxisDoCard`, prioridade em `CARD_PRIORIDADE`).
   - Por card: `pontosObtidos ≈ (cumpridos/total) × pesoVisual`, com correção de consistência (card com acertos não fica 0).
   - **`nota` visual = Σ pontosObtidos dos 6 cards** (0–20). A `notaFinal` HealthBench vira dado de auditoria.
   - **Classificação** (`classificarNota`): ≥17 Excelente · ≥15 Bom · ≥12 Regular · <12 Insuficiente. (No legado `/api/corrigir`: ≥17 / ≥16 / ≥12.)
- **Bônus:** não há. **Penalidades:** via critérios negativos (`erros_criticos`). **Arredondamento:** 1 casa decimal; clamp [0,20].

---

## ETAPA 4 — HEALTHBENCH (cobertura item a item)

| Dimensão | Status | Onde |
|---|---|---|
| Comunicação | ✅ Implementado | card `axis:comunicacao` (cards-config) + microcritérios |
| Anamnese | ✅ | `axis:anamnese` + checklist/rubrica do caso |
| Exame físico | ✅ | `axis:exame_fisico` (+ ausculta integrada) |
| Hipóteses diagnósticas | ✅ | `axis:raciocinio_clinico` |
| Diagnóstico principal | ✅ | raciocínio + `diagnosisAndPlan.hipotesePrincipal` |
| Diagnósticos diferenciais | ✅ | microcritério "considerou diferenciais" |
| Solicitação de exames | ✅ | `axis:exames_complementares` |
| Interpretação de exames | 🟡 Parcial | avaliada só se o aluno verbaliza a interpretação no transcript |
| Conduta / Tratamento | ✅ | `axis:conduta_seguranca` |
| Segurança do paciente | ✅ | tag `axis:seguranca` + `erros_criticos` negativos |
| Priorização | 🟡 Parcial | via microcritérios de gravidade; sem eixo próprio |
| Raciocínio clínico | ✅ | `axis:raciocinio_clinico` |
| Ética | ❌ Não implementado | sem critérios dedicados |
| Empatia | 🟡 Parcial | dentro de Comunicação (acolhimento/escuta) |
| Organização | 🟡 Parcial | implícita no SOAP/transcript, sem score próprio |
| Documentação (SOAP) | 🟡 Parcial | SOAP entra no transcript; só é obrigatório em casos específicos (`casoExigeSOAP`) |
| Seguimento | ✅ | microcritério "acompanhamento/reavaliação/retorno" |
| Red flags / sinais de alarme | ✅ | `skill:sinais_de_gravidade` + Comunicação/Conduta |
| Gestão de risco | ✅ | `erros_criticos` (alta insegura, antibiótico inapropriado) |

---

## ETAPA 5 — PROMPTS

### 5.1 Grader HealthBench (`lib/healthbench/grader-template.ts`) — **INTEGRAL**
System:
```
Você é um avaliador OSCE médico rigoroso e justo.
Analise o transcript completo do atendimento (conversa, ações do aluno e resultados/eventos) e avalie APENAS o critério da rubrica fornecido.

Regras:
- Não avalie o caso inteiro, apenas o critério informado.
- Não dê crédito por ações que o aluno não realizou.
- Use somente evidências presentes no transcript/eventos.
- Se o critério exigir múltiplas ações, marque criteria_met=true apenas se TODAS foram cumpridas.
- Se o critério for NEGATIVO (comportamento indesejado/erro), marque criteria_met=true apenas se o comportamento indesejado de fato ocorreu.
- Considere equivalências clínicas simples e seguras (ex.: "chiado" equivale a "sibilância"...; "falta de ar" equivale a "dispneia").
- Seja objetivo e breve na explicação.

Retorne SOMENTE um JSON válido no formato:
{"explanation": "string", "criteria_met": true | false}
```
User (`construirGraderUserPrompt`): `# Transcript do atendimento … # Critério da rubrica a avaliar (POSITIVO/NEGATIVO) … Critério: <criterion> … # Instrução: Retorne apenas o JSON {...}`.

Chamado por `avaliarCriterio` → `openai.chat.completions.create({ model:"gpt-4o-mini", temperature:0.1, response_format:{type:"json_object"} })`, **uma chamada por critério** (26 no PAC).

### 5.2 Examinador legado (`lib/prompts.ts` → `criarPromptExaminador`, linha 577) — **estrutura**
System (montado em `/api/corrigir`): *"Você é um examinador OSCE rigoroso e justo. Responda exclusivamente em JSON válido. Não use markdown…"* (+ variante de "MÁXIMO RIGOR" quando `textoProvavelmenteIncoerenteComCaso`).
User: *"Você é o ÚNICO EXAMINADOR CLÍNICO responsável por avaliar…"* — inclui caso, transcript, exame físico, exames, hipótese/conduta/SOAP, e exige o JSON de saída (nota, percentual, classificacao, justificativaNota, objetivosCumpridos, `rubricaAvaliacao` com as 6 competências e pesos 2/4/4/2/5/… , errosCriticos, respostaModeloOSCE, planoDeEstudo). Termina com 13 regras de formatação JSON estritas (linhas 1109–1121).

---

## ETAPA 6 — JSON / TYPES

### Enviado ao grader → resposta esperada
```
→ {"explanation": string, "criteria_met": boolean}   // por critério
```

### Interfaces centrais (`lib/healthbench/types.ts`)
- `HealthBenchMessage { role, content }` (roles: patient | student | student_action | student_final_answer | system_event).
- `HealthBenchRubricItem { id, criterion, points, tags[], critical?, type: positive|negative, sourceRubricId? }`.
- `HealthBenchCriterionGrade { rubricItemId, criterion, criteria_met, explanation, points, points_awarded, tags, critical?, type }`.
- `HealthBenchEvaluationResult { casoId, attemptId, score01, notaFinal, pontuacaoMaxima, passed, grades[], competencyScores, themeScores, criticalErrors[], professorFeedback, nextTrainingFocus[], usage, disclaimer }`.
- `HealthBenchAttemptRecord` (attempt-schema.ts) — record persistido (transcript, rubrics, grades, metrics, feedback, comparison…).
- Objeto final da tela: `FeedbackOSCE` (`lib/types.ts`) — nota, percentual, classificacao, `rubricaAvaliacao: CompetenciaAvaliacao[]` (nome, pontosObtidos, pontosMaximos, acertos[], melhorias[]), anamnese, exameFisico, raciocinioDiagnostico, conduta, soap, errosCriticos, respostaModeloOSCE, planoDeEstudo.

---

## ETAPA 7 — EXECUÇÃO REAL (PAC, caso 2)

Atendimento PAC simulado (tosse produtiva + febre + dispneia; ausculta com crepitações em base direita; RX com consolidação; hemograma com leucocitose; hipótese PAC; conduta amoxicilina + reavaliação). `POST /api/osce/finalizar` retornou (real, com IA):

| Campo | Valor |
|---|---|
| success / sourceOfTruth | true / **healthbench** |
| **notaFinal** | **11.8 / 20** (score01 0.588) · **passed: false** |
| grades | 26 critérios avaliados |
| criticalErrors | **2** |
| competencyScores | raciocínio 1.0 · exames 1.0 · exame físico 1.0 · comunicação 0.5 · anamnese 0.2 · conduta 0.06 · conduta_seguranca 0.33 |
| themeScores | theme:respiratorio 0.61 |
| usage | 35.245 in / 1.331 out tokens · ~US$ 0.0061 (só HealthBench) |
| **professorFeedback** | "Nota: 11.8/20 (59% da rubrica). **Pontos fortes:** Diagnóstico Diferencial; Exames Complementares; Caracterizou a tosse; Mediu sinais vitais. **A melhorar:** Antibioticoterapia — indicou amoxicilina mas **não especificou a dose**; Perguntou sobre febre…" |
| nextTrainingFocus | ["Conduta", "Anamnese", "Conduta e Segurança"] |
| **Legado (paralelo)** | nota **18 / Excelente** |
| **comparison** | diferença **-6.2** · `divergenciaSignificativa: true` |

> O exemplo ilustra a robustez (identificou a falta de dose do antibiótico) **e** o risco de divergência entre os dois motores.

---

## ETAPA 8 — FLUXO DE EXECUÇÃO (ordem)
1. `page.tsx` `handleFinalizarAtendimento` monta payload (React state: `historico`, `exameFisico`, `sinaisVitais`, `hipotese`, `diferenciais`, `conduta`, `soap`, `tempo`).
2. `POST /api/osce/finalizar` → valida caso → `construirSnapshot` → `snapshotParaAtendimentoInput`.
3. `Promise.allSettled([ evaluateHealthBenchAttempt(...), rodarLegado(→/api/corrigir) ])`.
4. HealthBench: normalizarTranscript → (NLP enrichment) → adaptarRubricaDoCaso → avaliarTodosCriterios (grader por item, **sequencial**) → calcularScore → calcularMetrics → construirFeedbackProfessor/nextTrainingFocus → salvarTentativa.
5. Legado: `/api/corrigir` → criarPromptExaminador → OpenAI → parseJSONSeguro → normalizarRubricaAvaliacao → nota=soma → limpeza SOAP.
6. `compareLegacyVsHealthBench` → `saveAttempt` (Map + disco).
7. Resposta unificada → `construirFeedbackViewDeHealthBench` → `setFeedback` → `<FeedbackOSCE>`.

Sem React Context/Provider dedicado: o estado do feedback é local (`useState` em `page.tsx`); a persistência é server-side (arquivos JSON + Map em memória).

---

## ETAPA 9 — ACOPLAMENTO
- **Tela OSCE:** `components/FeedbackOSCE.tsx` (via `construirFeedbackViewDeHealthBench`). Painel alternativo: `components/healthbench/HealthBenchFeedbackPanel.tsx`.
- **Persistência/Histórico:** `attempt-store.ts` (Map global + `fs` `.json`) + `result-writer.ts`. Recuperação: `GET /api/healthbench/attempts/[attemptId]`.
- **Métricas/Analytics:** `lib/healthbench/analytics.ts` + `GET /api/healthbench/analytics` (agregações). (Obs.: `AnalyticsPageView`/`GoogleAnalytics` são Google Analytics, coisa distinta.)
- **PDF:** `lib/pdf/exportar-feedback-atendimento.ts`.
- **Dashboard/Ranking/Gamificação:** `DashboardLanding.tsx` usa **dados estáticos/mock** — ainda **não** consome o histórico HealthBench real. Ponto de integração futuro.
- **Coach/Professor/Examiner:** o "examiner" é o grader; **não há Professor IA generativo** ainda.

---

## ETAPA 10 — PONTOS FORTES
- **Separação de responsabilidades exemplar**: normalizer → adapter → grader → score → metrics → feedback → store, cada um isolado e testável.
- **Rubrica derivada do caso** (não paralela): `adaptarRubricaDoCaso` usa `rubrica_correcao/checklist_osce/erros_criticos` como fonte oficial + microcritérios atômicos para pontuação parcial.
- **Avaliação critério-por-critério** (metodologia HealthBench real) — muito mais fiel que "um prompt avalia tudo".
- **Resiliência**: fallback heurístico no grader, fallback legado no orquestrador, `Promise.allSettled`, nunca quebra o fluxo.
- **Auto-verificação**: `compareLegacyVsHealthBench` + `meta-evaluator.ts`.
- **Score honesto**: negativos descontam; `passed` exige ≥17 **e** ausência de erro crítico.
- **Cards-config como fonte única** dos pesos (2/4/3/2/5/4=20) — sem duplicação de pesos.
- **Persistência canônica** de tentativas (auditável).
- **Reaproveitável**: tudo é função pura + tipos claros; fácil de encapsular.

## O que seria erro reescrever
- O motor `lib/healthbench/*` (adapter, grader, score, metrics, feedback-builder, cards-config).
- Os tipos (`types.ts`, `attempt-schema.ts`).
- A estratégia de rubrica-derivada-do-caso.

---

## ETAPA 11 — LIMITAÇÕES / RISCOS / CÓDIGO MORTO
- **Dois motores de IA rodam SEMPRE em paralelo** (HealthBench + legado `/api/corrigir`): **dobra custo e latência** de OpenAI e produz **divergência de nota** (PAC: 18 × 11.8). O legado deveria virar só fallback sob demanda.
- **Latência**: grader **sequencial**, 1 chamada por critério (26 no PAC) → dezenas de chamadas por atendimento. Sem paralelização/batch.
- **Custo por atendimento**: ~US$0.006 (HB) + custo do legado, a cada finalização.
- **Três camadas de scoring** coexistindo (HealthBench, examinador legado, rubrica determinística `feedback-consistency`/`rubricas-diagnosticos`) — sobreposição conceitual e risco de manutenção.
- **Persistência não durável**: Map em memória (perde no restart) + arquivos `.json` locais (não escala multi-instância; sem DB).
- **Dashboard/histórico** ainda com dados mock — o histórico real não alimenta métricas do aluno.
- **Dimensões ausentes**: Ética (0), Empatia/Organização/Interpretação de exames apenas parciais.
- **Código legado/morto**: `data/casos-osce.ts.bak` (~148 KB), `lib/avaliacaoObjetivosOSCE.ts` (aparentemente não referenciado no fluxo vivo), variante pediátrica com **nota parcialmente aleatória** (`/api/corrigir`: `12 + Math.random()*8`).
- **Dependência forte de OpenAI**: sem chave, cai para heurística (qualidade menor, mas não quebra).

---

## ETAPA 12 — COMPATIBILIDADE COM O FUTURO PROFESSOR IA

**Recomendação:** ☑ **reaproveitado + estendido + encapsulado + servir como MOTOR PRINCIPAL.** ☐ substituído.

Justificativa técnica: o motor HealthBench já é exatamente o "cérebro avaliativo" que um Professor IA precisa — ele transforma um atendimento em (nota, competências, erros, feedback textual, foco de treino). O Professor IA generativo deve **encapsular** esse motor: (1) os **Casos Canônicos** substituem/estruturam a fonte de rubrica (hoje `rubrica_correcao/checklist/erros`), alimentando `adaptarRubricaDoCaso`; (2) a **camada dialógica/generativa** consome `HealthBenchEvaluationResult` (grades + explicações + nextTrainingFocus) para conversar com o aluno ("por que a dose importa?"). Reescrever o motor seria desperdício.

---

## ETAPA 13 — MATURIDADE (estimativa)
| Peça | % | Justificativa |
|---|---|---|
| Motor de avaliação | **85%** | Pipeline completo e resiliente; falta paralelizar/consolidar os dois motores |
| Rubricas | **90%** | 6 cards + microcritérios + rubrica-do-caso; falta padronizar via Casos Canônicos |
| Feedback textual | **85%** | professorFeedback + acertos/melhorias/plano; ainda não dialógico |
| Correção (grading) | **90%** | critério-por-critério com IA + fallback; falta batching |
| Persistência/Histórico | **50%** | grava JSON/Map; sem DB durável e sem consumo no dashboard |
| HealthBench (dimensões) | **75%** | maioria coberta; ética/empatia/interpretação parciais/ausentes |
| Casos Canônicos | **0–10%** | inexistente como camada formal (hoje é o array `casos-osce.ts`) |
| Professor IA (generativo/dialógico) | **20%** | há examinador, feedback e nextTrainingFocus; falta a camada conversacional |
| Banco de conhecimento | **40%** | Centro Clínico (semiologia/fluxos/exames/sons/imagens) + microcritérios existem, mas não conectados ao motor |

---

## ETAPA 14 — ATUAL × FUTURO (Casos Canônicos + Professor IA)
| Item | Decisão |
|---|---|
| **Reaproveitar (sem alterar)** | grader, score, metrics, cards-config, types, attempt-schema, transcript-normalizer |
| **Expandir** | `adaptarRubricaDoCaso` para ler Casos Canônicos; feedback-builder → camada dialógica; persistência → DB |
| **Não precisa mudar** | metodologia critério-por-critério; escala 0–20; `passed`/erros críticos |
| **Desperdício reconstruir** | todo o `lib/healthbench/*` core |
| **Consolidar/aposentar** | rodar o legado sempre; escolher UMA fonte de verdade; remover `.bak`/código morto |

---

## ETAPA 15 — RECOMENDAÇÃO TÉCNICA (evolução, sem implementar)
1. **Consolidar a fonte da verdade:** manter HealthBench como motor único; rodar o legado **apenas** como fallback sob falha (não em todo atendimento) → corta custo/latência/divergência.
2. **Paralelizar o grader** (ou batch de critérios) para reduzir latência.
3. **Casos Canônicos** como camada formal que alimenta `adaptarRubricaDoCaso` (rubrica + microcritérios + gabarito + fontes).
4. **Persistência durável** (DB) e **conectar o histórico ao dashboard** (métricas reais do aluno).
5. **Professor IA generativo** encapsulando o motor: usa `grades + explanation + nextTrainingFocus` para diálogo socrático.
6. **Fechar lacunas** de ética/empatia/interpretação com critérios dedicados.
7. **Higiene:** remover `casos-osce.ts.bak`, avaliar `avaliacaoObjetivosOSCE.ts`, substituir a nota pediátrica aleatória por rubrica real.

**Veredito:** a arquitetura de feedback atual **já é robusta o suficiente para ser o motor principal do Professor IA** — evolução incremental (encapsular + Casos Canônicos + consolidar os dois motores), **não** reescrita estrutural.
