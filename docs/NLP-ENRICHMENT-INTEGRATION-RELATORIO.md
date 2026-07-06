# Clinical NLP — Integração como Camada de Enriquecimento (antes do grader)

**Data:** 29 de junho de 2026
**Status:** ✅ Integrado como **camada auxiliar** antes do grader. **Não pontua**, não altera rubricas/scoring/cards/nota. Desligável por env.

---

## 1. Arquivos criados
- [lib/nlp/clinical-nlp-enricher.ts](../lib/nlp/clinical-nlp-enricher.ts) — `buildClinicalNlpEnrichment` (detecção + dedup + filtro de negação + bloco textual).
- [scripts/test-nlp-enrichment.ts](../scripts/test-nlp-enrichment.ts) — teste do enricher (TB real + negação).
- [docs/NLP-ENRICHMENT-INTEGRATION-RELATORIO.md](NLP-ENRICHMENT-INTEGRATION-RELATORIO.md) (este) + [docs/nlp-enrichment-test-results.json](nlp-enrichment-test-results.json).

## 2. Arquivos de produção alterados (mínimo e cirúrgico)
- **[lib/healthbench/evaluator.ts](../lib/healthbench/evaluator.ts)** — **ponto de integração**. Após `normalizarTranscript`, anexa **uma mensagem auxiliar** (`role: "system_event"`) com o bloco de enriquecimento ao transcript **enviado ao grader**. O `transcript` original (armazenado no resultado) permanece **intacto**.
- **[lib/nlp/clinical-nlp-normalizer.ts](../lib/nlp/clinical-nlp-normalizer.ts)** — correção de qualidade: matching por **limite de palavra** (evita "fa" casar dentro de "**fa**lta", "alt" dentro de palavras). Estritamente melhor; 53/53 testes seguem passando. Evita falsos positivos no contexto do grader.

> Nenhum outro arquivo de produção foi tocado. `rubric-adapter`, `grader`, `score`, `feedback-builder`, `feedback-view-builder`, cards-config, casos, exame físico, ECG, Open-i, `/api/corrigir` e `/api/osce/finalizar` **não** foram alterados.

## 3-5. Garantias de segurança
- **3. Não altera scoring:** o enriquecimento só adiciona texto ao transcript; `calcularScore`/`avaliarTodosCriterios`/rubrica intactos. A nota continua sendo a soma dos cards decidida pelo grader/rubrica.
- **4. Não altera rubricas:** `adaptarRubricaDoCaso` e microcritérios inalterados.
- **5. Texto original preservado:** o bloco é **acrescentado ao final** como mensagem `system_event` claramente rotulada; nada do transcript original é removido ou reescrito. O `transcript` salvo no resultado é o original (sem enriquecimento).

## 3. Ponto exato de integração
[lib/healthbench/evaluator.ts](../lib/healthbench/evaluator.ts), entre **passo 1 (normalizar transcript)** e **passo 3 (avaliar critérios)**:
```ts
const transcript = normalizarTranscript(input);          // original, preservado
const transcriptParaGrader = [...transcript];
if (ENABLE_CLINICAL_NLP_ENRICHMENT) {
  const textoAgregado = transcript.map(m => m.content).join("\n");
  const diagnosisKey = caso?.dados_ocultos_do_sistema?.diagnostico_principal || caso?.titulo;
  const enr = buildClinicalNlpEnrichment({ text: textoAgregado, diagnosisKey });
  if (enr.enrichmentText) transcriptParaGrader.push({ role: "system_event", content: enr.enrichmentText });
}
const { grades, usage } = await avaliarTodosCriterios(transcriptParaGrader, rubric);
```

## 4. Bloco de enriquecimento gerado — TB real (Roberto Santos)
```
[ENRIQUECIMENTO NLP — CONCEITOS CLÍNICOS DETECTADOS]
Este bloco é auxiliar e NÃO substitui a avaliação clínica nem atribui pontos.
Use apenas como apoio para interpretar abreviações, sinônimos e termos informais do aluno.
Não infira itens não realizados a partir deste bloco.
- tosse_cronica: o texto contém "tosse ha mais de 3 semanas", interpretado como tosse persistente/prolongada, compatível com tosse crônica.
- febre_vespertina_noturna: o texto contém "febre a noite", interpretado como relato ou investigação de febre à noite, equivalente a febre vespertina/noturna.
- perda_peso: o texto contém "perdi peso", interpretado como perda ponderal ou emagrecimento.
- trm_tb: o texto contém "trm tb", interpretado como solicitação de TRM-TB, equivalente a teste rápido molecular para tuberculose.
- contato_tb: o texto contém "alguem com tuberculose", interpretado como investigação de contato epidemiológico com tuberculose.
(+ tosse, hemograma, antibioticoterapia, analgesia, confirmacao_identidade, dispneia investigada)
```
**Não** contém (ausências reais, corretamente ausentes): `ripe`, `mascara_etiqueta_respiratoria`, `rx_torax`, `baciloscopia_escarro`, `cultura_escarro`, `notificacao_vigilancia`, `ausculta_pulmonar`, `linfonodos`. ✅

## 5/7/8. Resultado E2E TB real (grader real — 1 amostra)
- **Antes (Shadow Mode):** `trm_tb`, `febre_vespertina_noturna`, `contato_tb` detectados pelo NLP mas **não reconhecidos** pelo grader (`nlp_detected_feedback_missed`).
- **Depois (enriquecimento ligado):** o grader passou a marcar **MET**:
  - ✅ "Solicitou teste rápido molecular para tuberculose quando disponível." (**trm_tb** — antes não reconhecido!)
  - ✅ "Investigou tosse >3 semanas"
  - ✅ "Indagou sobre contatos e fatores de risco" (**contato_tb**)
  - ✅ "Relacionou tosse crônica, sintomas constitucionais e risco epidemiológico"
- **Ausências reais mantidas como NÃO-MET** (penalizadas corretamente): Baciloscopia, RX de tórax, esquema RIPE, notificação/vigilância.
- **Nota: 0.9/20 — parcial, NÃO 20/20.** O atendimento real era incompleto (sem exame físico, sem sinais vitais, conduta genérica) e segue assim penalizado.

> Observação honesta: o grader é via LLM, portanto **não-determinístico**; este é **um sample**. O ganho qualitativo (trm_tb passou a ser reconhecido) é o esperado; a nota absoluta pode variar entre execuções.

## 9. Como desligar a feature
```bash
ENABLE_CLINICAL_NLP_ENRICHMENT=false
```
Ausente ou qualquer valor ≠ "false" → **ligado** (padrão). Log por avaliação: `[NLP ENRICHMENT] enabled=true concepts=N diagnosis=...`.

## 10. Testes de não regressão
| Teste | Resultado |
|---|---|
| NLP coverage | **77/77 casos · 53/53 testes ✅** |
| Shadow Mode | **10/10 consultas 100%; sem gaps de alias ✅** |
| Gold Standard (`--all`) | **65×20/20 · 12×19.8 · 0 falhas — idêntico ao baseline ✅** |
| Enricher TB real | conceitos certos detectados; **0 falsos positivos**; negação OK ✅ |
| Build + tipos | ✅ compila, sem erros |

Nenhum caso perfeito piorou; nenhuma ausência real foi inventada.

## 11. Cuidados implementados
- **Dedup** (TAREFA 10): prefere `diagnosis_pack`; depois maior confiança.
- **Negação** (TAREFA 11): janela ANTES (`não`, `sem`, `nega`…) e janela DEPOIS com negadores fortes (`negou`, `nega`, `ausente`, `abolido`). Validado: "negou falta de ar" e "não tem dor no peito" **não** viram conceito presente.
- **Sem inventar ausências** (TAREFA 12): só descreve o que está no texto; TB real continua sem RIPE/máscara/RX/baciloscopia/notificação.

## 12. Confirmação — não alterados
feedback visual (`FeedbackOSCE`), cards, rubricas, microcritérios, scoring, nota, classificação textual, casos clínicos, exame físico adulto/pediátrico, ausculta pulmonar, ECG, Open-i/radiologia, `/api/corrigir`, `/api/osce/finalizar`, layout. **Nenhum** desses foi tocado.

## 13. Como reproduzir
```bash
npx tsx scripts/test-nlp-enrichment.ts          # enricher + negação (TB real)
npx tsx scripts/audit-clinical-nlp-coverage.ts  # 77/77 · 53/53
npx tsx scripts/nlp-shadow-mode-audit.ts        # shadow 100%
npx tsx scripts/validate-gold-standard-osce.ts --all   # 65/12/0 (inalterado)
```

---

## Critério final
✅ O Clinical NLP enriquece o texto enviado ao grader (abreviações/sinônimos → linguagem médica padronizada), **sem alterar pontuação diretamente** e **sem inventar itens não realizados**. O E2E demonstrou o ganho-alvo: "trm tb" passou a ser reconhecido como teste rápido molecular, enquanto as ausências reais seguem penalizadas e a nota permanece parcial. Desligável via `ENABLE_CLINICAL_NLP_ENRICHMENT=false`.
