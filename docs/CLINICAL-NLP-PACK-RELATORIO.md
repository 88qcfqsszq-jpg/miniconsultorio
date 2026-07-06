# Clinical NLP Pack — Relatório de Cobertura

**Data:** 29 de junho de 2026
**Status:** ✅ Pacote criado, testado e auditado — **NÃO integrado** ao pipeline.
**Versão:** **v3** — corrige gaps de alias do Shadow Mode (mantém 77/77 casos).
**Escopo:** dicionário NLP clínico global + pacotes por diagnóstico + normalizador/detector + auditoria de cobertura. Nenhum arquivo de produção foi alterado; nada conectado a HealthBench, rubricas, feedback, scoring, transcript-normalizer, exame físico, ECG, Open-i ou `/api/corrigir`.

---

## 1. Arquivos

| Arquivo | Conteúdo |
|---|---|
| [lib/nlp/clinical-nlp-dictionary.ts](../lib/nlp/clinical-nlp-dictionary.ts) | Dicionário global: **144 conceitos**, **992 sinônimos** + typos + regex |
| [lib/nlp/clinical-nlp-normalizer.ts](../lib/nlp/clinical-nlp-normalizer.ts) | `normalizeTextForClinicalNlp`, `detectClinicalConcepts`, `detectDiagnosisConcepts` |
| [lib/nlp/diagnosis-nlp-pack.ts](../lib/nlp/diagnosis-nlp-pack.ts) | **37 pacotes** por diagnóstico (aliases + concepts + sinônimos específicos) |
| [scripts/audit-clinical-nlp-coverage.ts](../scripts/audit-clinical-nlp-coverage.ts) | 42 testes de detecção + auditoria de cobertura |
| [docs/CLINICAL-NLP-PACK-RELATORIO.md](CLINICAL-NLP-PACK-RELATORIO.md) | Este relatório |
| [docs/clinical-nlp-coverage.json](clinical-nlp-coverage.json) | Resultado da auditoria (gerado) |

---

## 2. Números (v3)

| Métrica | v1 | v2 | **v3** |
|---|---|---|---|
| Conceitos globais | 60 | 141 | **144** |
| Sinônimos globais | 466 | 925 | **992** |
| Pacotes por diagnóstico | 20 | 37 | **37** |
| Casos cobertos | 60/77 | 77/77 | **77/77** |
| Casos sem pacote | 17 | 0 | **0** |
| Testes de detecção | 22/22 | 42/42 | **53/53 ✅** |

### v3 — gaps de alias corrigidos (Shadow Mode)
- **Novo conceito global:** `tosse` (genérico; `tosse_cronica` mantido para duração prolongada). Também promovidos a globais: `monitorizacao`, `evitar_aine` (antes só em pacotes).
- **Aliases adicionados:** `sudorese_noturna` (+"sudorese noturna", "acorda encharcado"…), `perda_peso` (+"perda de peso", "perdi peso", "emagreci"…), `ausculta_pulmonar` (+"auscultar os pulmoes", "escutar os pulmoes"…), `rx_torax` (+"rx de torax", "raio x do torax"…), `investigar_contatos` (+"investigacao dos contatos"…), `notificacao_vigilancia` (+"notificacao", "notificar caso"…), `adesao_tratamento` (+"adesao ao ripe", "tomar ripe ate o fim"…), `evitar_aine` (+"nao usar ibuprofeno"…), `monitorizacao` (+"monitorizo", "monitorar"…).
- **`tosse`** adicionado aos `concepts` de tuberculose_pulmonar, dpoc, atelectasia_pos_operatoria e bronquiolite_viral_aguda (pneumonia/asma já tinham).

---

## 3. Novos conceitos globais adicionados (v2 — +81)

- **Cardio/valvopatias/endocardite:** febre_prolongada, sopro_cardiaco, fator_risco_endocardite, hemoculturas, ecocardiograma_transesofagico, antibiotico_endocardite, estenose_mitral, fibrilacao_atrial, anticoagulacao_fa.
- **Emergência hipertensiva:** lesao_orgao_alvo, pa_muito_elevada, reducao_controlada_pa, creatinina.
- **TVP:** dor_panturrilha, edema_unilateral, risco_tvp, usg_doppler_venoso.
- **Arboviroses:** ictericia_hepatite, sangramento_mucoso, dor_retroorbitaria, artralgia_intensa, exantema, viagem_area_risco, vacina_febre_amarela, sinais_neurologicos_gbs, mialgia, conjuntivite.
- **Hematologia:** dor_ossea, lesoes_liticas, proteinuria_bence_jones, mielograma, sangramento_coagulopatia, tp_ttp_fibrinogenio, fator_viii, talassemia, transfusao_regular, quelacao_ferro, anemia, hipercalcemia, eletroforese_proteinas, hemartrose, esplenomegalia, eletroforese_hemoglobina, plaquetas, sepse.
- **Atelectasia/bronquiolite/pediatria:** pos_operatorio, hipoventilacao, fisioterapia_respiratoria, bronquiolite, tiragem, alimentacao_reduzida, desenvolvimento_normal, pa_pediatrica_elevada, rinossinusite, secrecao_nasal_purulenta, dor_facial, piora_apos_melhora, marcos_desenvolvimento, crescimento, vacinacao, alimentacao, sono, seguranca_infantil, orientacao_responsavel.
- **Conduta/suporte auxiliares:** coagulograma, funcao_hepatica, hidratacao, exame_neurologico, encaminhamento_hospitalar, analgesia, encaminhamento_hematologia, tratar_causa_base, suporte_hemoderivados, evitar_trauma, acompanhamento_hematologia, sinais_alarme_pediatria, historia_familiar_has, obesidade, doenca_renal, orientacao_medida_pa, antibioticoterapia.

---

## 4. Novos pacotes por diagnóstico (v2 — +17)

endocardite_infecciosa · estenose_mitral · estenose_mitral_fa · emergencia_hipertensiva_loa · tvp · febre_amarela · zika_guillain_barre · chikungunya · mieloma_multiplo · cid · hemofilia_a · talassemia_maior · atelectasia_pos_operatoria · bronquiolite_viral_aguda · pa_elevada_pediatrica · desenvolvimento_normal_pediatrico · rinossinusite_bacteriana.

**Total de pacotes (v1+v2): 37.**

### Mapeamento dos 17 casos antes descobertos → pacote
```
[13] Endocardite Infecciosa      → endocardite_infecciosa
[14] Estenose Mitral             → estenose_mitral
[22] Emergência Hipertensiva     → emergencia_hipertensiva_loa
[26] Estenose Mitral + FA        → estenose_mitral_fa
[29] Trombose Venosa Profunda    → tvp
[40] Febre Amarela               → febre_amarela
[41] Zika + Guillain-Barré       → zika_guillain_barre
[42] Chikungunya                 → chikungunya
[48] Mieloma Múltiplo            → mieloma_multiplo
[50] CID                         → cid
[51] Hemofilia A                 → hemofilia_a
[53] Talassemia Maior            → talassemia_maior
[63] Atelectasia pós-operatória  → atelectasia_pos_operatoria
[64] Bronquiolite viral aguda    → bronquiolite_viral_aguda
[ped-03] PA elevada p/ idade     → pa_elevada_pediatrica
[ped-04] Desenvolvimento normal  → desenvolvimento_normal_pediatrico
[ped-12] Rinossinusite           → rinossinusite_bacteriana
```

---

## 5. Cobertura final

**77/77 casos cobertos · 0 sem pacote.** Confirmado por `scripts/audit-clinical-nlp-coverage.ts` (`casosComPack: 77`, `casosSemPack: 0`).

---

## 6. Testes de detecção (42/42 ✅)

Aos 22 testes da v1 somam-se 20 novos (v2), todos aprovados:

| Frase | Conceitos detectados |
|---|---|
| "febre prolongada e sopro no coracao" | febre_prolongada + sopro_cardiaco |
| "vou coletar hemoculturas e pedir eco transesofagico" | hemoculturas + ecocardiograma_transesofagico |
| "ritmo irregular e ruflar diastolico" | fibrilacao_atrial + estenose_mitral |
| "pa 180/120 com lesao de orgao alvo" | pa_muito_elevada + lesao_orgao_alvo |
| "panturrilha dolorosa e edema unilateral" | dor_panturrilha + edema_unilateral |
| "vou pedir doppler venoso" | usg_doppler_venoso |
| "febre, ictericia e sangramento gengival" | ictericia_hepatite + sangramento_mucoso |
| "nao tomou vacina de febre amarela" | vacina_febre_amarela |
| "zika com fraqueza ascendente nas pernas" | sinais_neurologicos_gbs |
| "febre e dor intensa nas juntas" | artralgia_intensa |
| "dor ossea, anemia e lesoes liticas" | dor_ossea + anemia + lesoes_liticas |
| "eletroforese de proteinas e mielograma" | eletroforese_proteinas + mielograma |
| "sangramento, plaquetas baixas e fibrinogenio baixo" | sangramento_coagulopatia + plaquetas + tp_ttp_fibrinogenio |
| "hemartrose e fator viii baixo" | hemartrose + fator_viii |
| "talassemia maior com transfusoes regulares e quelacao de ferro" | talassemia + transfusao_regular + quelacao_ferro |
| "pos operatorio com hipoventilacao e fisioterapia respiratoria" | pos_operatorio + hipoventilacao + fisioterapia_respiratoria |
| "lactente chiando com tiragem e mamando menos" | bronquiolite + tiragem + alimentacao_reduzida |
| "pa acima do percentil 95 para idade" | pa_pediatrica_elevada |
| "marcos do desenvolvimento e vacinacao em dia" | desenvolvimento_normal + vacinacao |
| "secrecao nasal purulenta e piora apos melhora" | secrecao_nasal_purulenta + piora_apos_melhora |

---

## 7. Casos ainda sem pacote

**Nenhum.** 77/77 cobertos.

---

## 8. Não integração / não alteração de produção

- Os detectores **não** estão conectados a HealthBench, scoring, `transcript-normalizer` nem feedback.
- `git diff --name-only` ao final é **idêntico ao baseline**; **nenhum** arquivo de produção alterado por esta tarefa.
- Alterados/criados **somente**: `lib/nlp/clinical-nlp-dictionary.ts`, `lib/nlp/diagnosis-nlp-pack.ts`, `scripts/audit-clinical-nlp-coverage.ts`, `docs/CLINICAL-NLP-PACK-RELATORIO.md`, `docs/clinical-nlp-coverage.json`. (`clinical-nlp-normalizer.ts` **não** precisou de mudança — regex/sinônimos já suportados.)
- Não tocados: **HealthBench/rubricas**, **feedback**, **nota/scoring**, **transcript-normalizer**, **exame físico** adulto/pediátrico, **ausculta pulmonar**, **ECG**, **Open-i/radiologia**, **casos clínicos**, **`/api/corrigir`**, **layout**.

---

## 9. Reproduzir

```bash
npx tsx scripts/audit-clinical-nlp-coverage.ts
# saída: docs/clinical-nlp-coverage.json + resumo no console
```

---

## 10. Critério final

✅ O pacote NLP cobre **77/77 casos cadastrados** — 141 conceitos globais, 925 sinônimos, 37 pacotes por diagnóstico — mantendo-se **isolado**, sem alterar o funcionamento real do Mini Consultório. Pronto para revisão humana e posterior integração segura.
