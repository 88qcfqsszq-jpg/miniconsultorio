# Relatório — Integração Casos Canônicos ↔ Knowledge Graph (Fase 6)

_Data: 2026-07-03 · Fase **aditiva/estrutural dentro do `clinical-engine`**. Nenhum arquivo de runtime, tela, rota, OSCE, Feedback, HealthBench ou Centro Clínico foi tocado. `data/casos-osce.ts` intacto._

## Arquivos alterados (6 casos canônicos)
`clinical-engine/cases/`: **pac.ts, asma.ts, dpoc.ts, insuficiencia-cardiaca.ts, sindrome-coronariana.ts, tep.ts** — adicionado o bloco `refs` (ids do Knowledge Graph) + `soundRef` na ausculta + `imageRef` (com `modalidade`/`regiaoAnatomica`/`obrigatoriedade`) na imagem principal.

## Arquivos criados
- `clinical-engine/helpers/validate-canonical-refs.ts` — validador (`validarCanonicalRefs`).
- `docs/RELATORIO-CANONICAL-KNOWLEDGE-REFS-FASE6.md` — este relatório.

## Refs adicionadas por caso (bloco `refs` — só ids existentes)
| Caso | symptomRefs | examRefs | imageRefs | soundRefs | flowRefs | guidelineRefs | knowledgeRefs |
|---|---|---|---|---|---|---|---|
| **PAC** | tosse, febre, dispneia, dor torácica | lab-hemograma | img-rx-torax | ls-crepitacoes | dispneia, febre | guide-pneumonia | dx-pneumonia, score-curb65, drug-amoxicilina, pf-submacicez, pf-fremito-aumentado, ref-open-i, ref-hls-cmds |
| **Asma** | dispneia | — | img-rx-torax | ls-sibilos | dispneia | guide-asma | dx-asma, drug-salbutamol, drug-corticosteroide, proc-oxigenoterapia, proc-nebulizacao, pf-taquipneia |
| **DPOC** | dispneia, tosse | lab-gasometria, lab-hemograma | img-rx-torax | ls-sibilos, ls-roncos | dispneia | guide-dpoc | dx-dpoc, drug-salbutamol, drug-corticosteroide, proc-oxigenoterapia, proc-nebulizacao, proc-intubacao, pf-taquipneia |
| **IC** | dispneia | ecg-taquicardia-sinusal | img-rx-torax | ls-crepitacoes, hs-b3 | dispneia | guide-ic | dx-ic, dx-edema-pulmonar, drug-diuretico, proc-oxigenoterapia, pf-turgencia-jugular, pf-edema-mmii, score-killip |
| **SCA** | dor torácica | ecg-supra-st, lab-troponina | img-rx-torax | — | dor torácica | guide-sca | dx-sca, drug-aas, drug-anticoagulante, score-killip, hs-b4 |
| **TEP** | dispneia, dor torácica, hemoptise, síncope | lab-ddimero, lab-gasometria, ecg-s1q3t3, ecg-taquicardia-sinusal | img-tc-torax, img-rx-torax | — | dispneia, dor torácica | guide-tep | dx-tep, drug-anticoagulante, score-wells, proc-oxigenoterapia, ecg-s1q3t3 |

Block-level: `ausculta.pulmonar.soundRef` (PAC/asma/dpoc/IC) + `ausculta.cardiaca.soundRef` (IC=hs-b3); `imagens[0].imageRef` (todos). SCA/TEP não têm soundRef pois a ausculta é **normal** (não patológica) — correto.

## Refs inexistentes encontradas
**Nenhuma.** Validação de integridade: **0 refs quebradas** (55 ids distintos citados pelos casos; todos existem no `KNOWLEDGE_REGISTRY` de 65 nós).

## Conexão ao grafo
- **100% conectados: 6 de 6** — todos têm `refs` preenchidas, ≥1 `guidelineRef`, ≥1 `flowRef` e `soundRef` quando há ausculta patológica, com 0 refs quebradas.
- **Parcialmente conectados: 0.**

## Pendências (ids ausentes no grafo — NÃO inventados, conforme a regra)
Exames citados textualmente nos casos que ainda **não existem** como nó no grafo (ficaram fora dos `examRefs`, registrados aqui):
- **Procalcitonina** (PAC/DPOC), **Oximetria de pulso** e **Pico de fluxo** (Asma), **Ecocardiograma** e **BNP/NT-proBNP** (IC).
- `examRef` por-exame (bloco): preenchido no nível do caso (`refs.examRefs`); o preenchimento por objeto de exame é um micro-passo trivial (opcional) para a próxima fase.
- Sons "normais" (SCA/TEP) não têm nó no grafo (só achados patológicos foram modelados) — por isso sem `soundRef`, o que é correto.

## Validação realizada
- ✅ **Type-check limpo** em `clinical-engine/*` (persistem só os erros PRÉ-EXISTENTES em `ecgGenerator`).
- ✅ **Validador compila** (`validate-canonical-refs.ts`) e a checagem de integridade de ids confirma **0 refs quebradas**.
- ✅ **Todos os 6 casos canônicos continuam compilando** (refs são campos opcionais do schema v1.1.0).
- ✅ **OSCE, Feedback, HealthBench, Centro Clínico e rotas não foram tocados**; `data/casos-osce.ts` intacto.

## Riscos
- **Baixo.** Alterações apenas em dados de casos canônicos (módulo isolado, não importado por produção). Remover a pasta não afeta nada.
- Ao expandir o grafo (próxima fase), preencher os nós pendentes (procalcitonina, oximetria, peak flow, ecocardiograma, BNP) e então completar os `examRefs` correspondentes.

## Próximos passos
1. Adicionar ao grafo os poucos exames pendentes e ligar aos `examRefs`.
2. Preencher `examRef` por objeto de exame (bloco) reaproveitando `refs.examRefs`.
3. Rodar `validarCanonicalRefs()` em CI a cada novo caso/nó.
4. Converter mais casos canônicos já com `refs` desde a criação.
5. Só então avaliar (fase futura) a ligação opcional ao Professor IA / navegação do Centro Clínico.
