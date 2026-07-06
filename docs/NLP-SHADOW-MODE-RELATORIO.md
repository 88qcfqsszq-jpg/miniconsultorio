# NLP Shadow Mode — Relatório de Auditoria

**1. Data:** 29 de junho de 2026
**2. Status:** ✅ **Shadow Mode** — NLP roda em paralelo, **sem integração** e **sem alterar nota/rubrica/feedback**. Execução manual por terminal.

> **Atualização v3 (NLP):** após o Clinical NLP v3, os **gaps de alias do próprio NLP foram resolvidos**. As 10 consultas perfeitas sintéticas agora cobrem **100%** dos conceitos esperados, e na TB real `perda_peso` passou a ser detectado ("perdi peso"). Permanecem como achados os `nlp_detected_feedback_missed` (gaps do **grader**, não do NLP). Tabelas abaixo refletem o estado v3.

---

## 3. Arquivos criados
- [scripts/nlp-shadow-mode-audit.ts](../scripts/nlp-shadow-mode-audit.ts) — runner (TB real + 10 consultas perfeitas sintéticas).
- [scripts/nlp-shadow-utils.ts](../scripts/nlp-shadow-utils.ts) — texto agregado, mapa `NLP_TO_FEEDBACK_CRITERIA_HINTS`, classificação de inconsistências.
- [scripts/fixtures/tuberculose-real-roberto-santos.ts](../scripts/fixtures/tuberculose-real-roberto-santos.ts) — fixture do atendimento real.
- [docs/NLP-SHADOW-MODE-RELATORIO.md](NLP-SHADOW-MODE-RELATORIO.md) (este) + [docs/nlp-shadow-results.json](nlp-shadow-results.json).

## 4. Arquivos de produção alterados
**Nenhum.** `git diff` idêntico ao baseline; `lib/nlp/*` apenas **importado**, não modificado.

---

## 5. Como o texto agregado foi montado
`montarTextoAgregado` concatena, quando presentes: transcript da conversa, exame físico, registros de exame físico, physicalExamEvents, exames solicitados, sinais vitais, diagnóstico informado, conduta e SOAP. Sobre esse texto rodam `detectClinicalConcepts(texto)` e `detectDiagnosisConcepts(texto, diagnosisKey)`.

## 6. Atendimentos testados
1 atendimento **real** (Tuberculose / Roberto Santos) + **10 consultas perfeitas sintéticas** (TB, PAC, IC, SCA/IAM, asma, DPOC, TEP, pneumotórax, dengue, anemia hemolítica), em linguagem natural com abreviações/sinônimos.

---

## 9. Caso real — Tuberculose pulmonar / Roberto Santos

**Texto agregado:** transcript + "Solicito trm tb e hemograma." + "tuberculose pulmonar" + "antibioticoterapia e dipirona para a febre."

| Conceito NLP | Detectado? | Evidência textual | Feedback reconheceu? | Classificação / Observação |
|---|---|---|---|---|
| tosse_cronica | sim | "tosse há mais de 3 semanas" | sim | **both_detected** — ok |
| febre_vespertina_noturna | sim | "febre à noite" | não | **nlp_detected_feedback_missed** — possível alias gap no grader |
| contato_tb | sim | "irmão teve tuberculose" | não (subpontuado) | **nlp_detected_feedback_missed** — revisar reconhecimento no grader |
| trm_tb | sim | "trm tb" | não | **nlp_detected_feedback_missed** — feedback disse "TRM-TB não solicitado" ⚠️ |
| perda_peso | **sim (v3)** | "perdi peso" | sim | **both_detected** — resolvido na v3 (alias "perdi peso") |
| sudorese_noturna | não | — | n/a | both_missed — não citado pelo aluno |
| hemoptise | não | — | n/a | both_missed |
| rx_torax | não | — | não | **both_missed — ausência real** |
| baciloscopia_escarro | não | — | não | **both_missed — ausência real** |
| cultura_escarro | não | — | não | both_missed — ausência real |
| mascara_etiqueta_respiratoria | não | — | não | **both_missed — ausência real** |
| notificacao_vigilancia | não | — | não | **both_missed — ausência real** |
| investigar_contatos | não | — | n/a | both_missed |
| ripe | não | — | não | **both_missed — ausência real** |
| adesao_tratamento | não | — | n/a | both_missed |
| ausculta_pulmonar / linfonodos / risco_epi / imunossupressao | não | — | n/a | both_missed |

**Resumo de issues (TB real, v3):** both_detected 2 (tosse_cronica, perda_peso) · nlp_detected_feedback_missed 4 (tosse, febre_vespertina_noturna, contato_tb, trm_tb) · both_missed 14. O `feedback_detected_nlp_missed` da v1 (perda_peso) **foi eliminado** — não há mais gaps de NLP, apenas gaps do grader.

### 6/7. Conceitos detectados na TB real
`tosse_cronica`, `febre_vespertina_noturna`, `contato_tb`, `trm_tb`.

### Inconsistências entre NLP e feedback (TB real)
- ⚠️ **`trm_tb`**: NLP detectou "trm tb" no texto, mas o feedback real marcou "teste rápido molecular não solicitado". **Inconsistência forte** → alias/payload gap no grader (o grader não reconhece a abreviação "trm tb").
- **`febre_vespertina_noturna`**: NLP detectou "febre à noite"; feedback não valorizou → possível alias gap.
- **`contato_tb`**: NLP detectou "irmão teve tuberculose"; feedback subpontuou o contato epidemiológico → revisar grader.
- **`perda_peso`**: feedback reconheceu, NLP perdeu "perdi peso" → gap de sinônimo no NLP.
- **Ausências reais confirmadas** (both_missed — o aluno realmente não fez): RIPE, máscara/etiqueta respiratória, notificação/vigilância, RX tórax, baciloscopia/cultura. O shadow mode **não** as inventa — permanecem como ausência legítima.

---

## 8. Consultas perfeitas textuais — cobertura NLP (v3)

| Caso | Cobertura v1 | **Cobertura v3** |
|---|---|---|
| Tuberculose | 9/16 | **16/16 ✅** |
| Pneumonia / PAC | 9/9 | **9/9 ✅** |
| Insuficiência cardíaca | 10/11 | **11/11 ✅** |
| SCA / IAM | 11/12 | **12/12 ✅** |
| Asma | 8/9 | **9/9 ✅** |
| DPOC | 11/11 | **11/11 ✅** |
| TEP | 9/9 | **9/9 ✅** |
| Pneumotórax | 5/6 | **6/6 ✅** |
| Dengue | 9/10 | **10/10 ✅** |
| Anemia hemolítica | 11/11 | **11/11 ✅** |

**Todas as 10 consultas em 100%.** Nenhum caso piorou.

## 9. Gaps de alias — status v3 (todos resolvidos)

| Conceito | Variante antes não reconhecida | Status v3 |
|---|---|---|
| sudorese_noturna | "sudorese noturna" | ✅ resolvido |
| perda_peso | "perda de peso", "perdi peso" | ✅ resolvido |
| ausculta_pulmonar | "auscultar os pulmoes" | ✅ resolvido |
| rx_torax | "rx de torax" | ✅ resolvido |
| investigar_contatos | "investigacao dos contatos" | ✅ resolvido |
| notificacao_vigilancia | "notificacao" (isolado) | ✅ resolvido |
| adesao_tratamento | "adesao ao ripe" | ✅ resolvido |
| monitorizacao | "monitorizo" | ✅ resolvido (conceito global novo) |
| tosse | (sem conceito global) | ✅ resolvido (conceito global novo) |
| evitar_aine | "nao usar ibuprofeno" | ✅ resolvido (conceito global novo) |

**Gaps de alias restantes do NLP: nenhum** (no escopo testado).

---

## 11/12. Inconsistências prováveis — classificação consolidada

| Tipo | Onde apareceu | Significado |
|---|---|---|
| `both_detected` | TB: tosse_cronica | NLP e feedback concordam |
| `nlp_detected_feedback_missed` | TB: trm_tb, febre_vespertina_noturna, contato_tb | **grader não reconhece o termo** (alias/payload gap no avaliador) |
| `feedback_detected_nlp_missed` | TB: perda_peso; sintéticas (10 conceitos) | **NLP precisa de mais sinônimos** |
| `both_missed` | TB: RIPE, máscara, RX, baciloscopia… | **ausência clínica real** (correto) |
| `possible_payload_gap` | (não observado neste lote) | conceito fora do payload avaliado |
| `possible_event_gap` | candidato: ausculta interativa sem token anterior/posterior | ação registrada parcial (ver relatório Gold Standard) |
| `possible_rubric_gap` | candidato: diferenciais SCA (teto inatingível) | rubrica sem critério/teto equivalente |

---

## 13. Recomendações para integração futura
1. **Integrar como camada de enriquecimento ANTES do grader** (não no scoring): anexar os conceitos detectados ao texto enviado ao avaliador, de forma que abreviações ("trm tb") cheguem expandidas ("teste rápido molecular para tuberculose"). Resolveria os 3 `nlp_detected_feedback_missed` da TB sem tocar rubricas/nota.
2. **Antes de integrar, lançar NLP v3** cobrindo os 10 gaps de alias da seção 9 (baixo risco, só sinônimos).
3. **Manter o shadow mode** como teste de não-regressão: rodar a cada mudança de NLP/grader e comparar `nlp_detected_feedback_missed` ao longo do tempo.
4. **Nunca** deixar o NLP marcar `both_missed` como presente — ausências reais devem permanecer (validado: RIPE/máscara/RX seguem como ausência na TB real).

## 14. Confirmação — nota/rubrica/HealthBench
**Não** foram alterados: nota, scoring, cards, rubricas, HealthBench, feedback visual, transcript-normalizer de produção, `/api/osce/finalizar`, `/api/corrigir`, casos, exame físico adulto/pediátrico, ausculta pulmonar, ECG, Open-i/radiologia, layout. O NLP roda **somente** no script de auditoria, executado manualmente.

---

## Reproduzir
```bash
npx tsx scripts/nlp-shadow-mode-audit.ts
# saída: docs/nlp-shadow-results.json + resumo no console
```
