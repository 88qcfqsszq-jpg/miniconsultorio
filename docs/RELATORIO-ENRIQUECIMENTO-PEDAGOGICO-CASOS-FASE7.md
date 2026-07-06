# Relatório — Enriquecimento Pedagógico dos Casos Canônicos (Fase 7)

_Data: 2026-07-03 · Alterações apenas em `clinical-engine/` e `docs/`. Nenhum arquivo de runtime, tela, rota, OSCE, Feedback, HealthBench ou Centro Clínico foi tocado. `data/casos-osce.ts` intacto._

## Arquivos alterados
- `clinical-engine/types/canonical-case.ts` — schema **v1.1.0 → v1.2.0** (campos pedagógicos opcionais).
- `clinical-engine/cases/*.ts` (6 casos) — pac, asma, dpoc, insuficiencia-cardiaca, sindrome-coronariana, tep.
- `clinical-engine/helpers/validate-canonical-refs.ts` — validador estendido para checar as refs pedagógicas.
- `docs/RELATORIO-ENRIQUECIMENTO-PEDAGOGICO-CASOS-FASE7.md` — este relatório.

## Campos adicionados ao schema (todos OPCIONAIS, retrocompatíveis)
- `teachingRefs?: { semiologia?, fluxos?, exames?, imagens?, sons?, scores?, guidelines? }` — ids do Knowledge Graph por eixo de ensino.
- `pitfallRefs?: string[]` — ids do grafo tocados pelas pegadinhas.
- `differentialRefs?: string[]` — ids de diagnósticos diferenciais (`dx-*`).
- `clinicalReasoningRefs?: string[]` — ids-âncora do raciocínio (`flow-/score-/dx-*`).
- `professorObjectives?: string[]` — objetivos do Professor IA (texto).
- `masteryTargets?: { communication, history, physicalExam, diagnosis, complementaryExams, conduct, safety, documentation }` — alvos 0..1.
- `commonMistakes?: string[]` — erros comuns (texto; não são refs).

## Enriquecimentos por caso (todos com 0 refs quebradas)
| Caso | teachingRefs (destaques) | differentialRefs | pitfallRefs | professorObjectives / commonMistakes | masteryTargets (foco) |
|---|---|---|---|---|---|
| **PAC** | sons ls-crepitacoes · exames lab-hemograma · imagens img-rx-torax · scores score-curb65 · guide-pneumonia | dx-asma, dx-tep, dx-ic | img-rx-torax, lab-hemograma | SpO₂/FR; dose do antibiótico; correlação clínica | safety 0.95, diagnosis/exams/conduct 0.9 |
| **Asma** | pf-taquipneia · ls-sibilos · guide-asma | dx-tep, dx-edema-pulmonar | drug-corticosteroide | corticosteroide obrigatório; gravidade | conduct/safety 0.9 |
| **DPOC** | ls-sibilos, ls-roncos · lab-gasometria · guide-dpoc | dx-asma, dx-pneumonia, dx-ic, dx-tep | proc-oxigenoterapia, drug-corticosteroide, lab-gasometria | O₂ 88–92%; corticoide; asma×DPOC | safety 0.95 |
| **IC** | pf-turgencia-jugular, pf-edema-mmii · ls-crepitacoes, hs-b3 · score-killip · guide-ic | dx-asma, dx-dpoc, dx-pneumonia, dx-tep | drug-diuretico, hs-b3 | diurético; B3+congestão; eco/FEVE | physicalExam/diagnosis 0.9 |
| **SCA** | ecg-supra-st, lab-troponina · hs-b4 · score-killip · guide-sca | dx-tep | ecg-supra-st, lab-troponina | ECG ≤10 min; reperfusão; AAS | diagnosis/exams/conduct/safety 0.95 |
| **TEP** | lab-ddimero, ecg-s1q3t3 · img-tc-torax, img-rx-torax · score-wells · guide-tep | dx-sca, dx-pneumonia | img-tc-torax, drug-anticoagulante, score-wells | ausculta/RX normais não excluem; anticoagular; Wells | safety 0.95 |

## Refs usadas
Todas as refs pedagógicas apontam para **ids existentes** do Knowledge Graph (65 nós). Validador (id-check): **0 refs quebradas** — 55 ids distintos citados pelos 6 casos (refs de conexão + refs pedagógicas), todos presentes.

## Pendências
- Diferenciais **sem nó no grafo** (não viraram ref, ficam no texto de `diagnostico.diferenciais`): bronquite, tuberculose, anafilaxia, pneumotórax, angina, pericardite, dissecção de aorta, síncope de outra causa.
- Exames **sem nó** (já pendentes da Fase 6): procalcitonina, oximetria, pico de fluxo, ecocardiograma, BNP — citados em texto/commonMistakes quando relevante, não como ref.
- `masteryTargets` são estimativas didáticas iniciais (calibração fina numa fase futura).

## Riscos
- **Baixo.** Alterações apenas em dados de casos canônicos + tipos + validador (módulo isolado, não importado por produção). Remover a pasta não afeta nada.

## Compatibilidade (confirmada)
- ✅ **Type-check limpo** em `clinical-engine/*` (persistem só os erros PRÉ-EXISTENTES em `ecgGenerator`).
- ✅ **Validador** compila e a checagem de integridade confirma **0 refs quebradas** (incluindo as pedagógicas).
- ✅ Os **6 casos continuam compilando** (campos pedagógicos são opcionais no schema v1.2.0).
- ✅ **Rubrica, checklist, erros críticos e dados clínicos originais NÃO foram alterados** — apenas foram acrescentados campos de ensino.
- ✅ OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**.

## Próximos passos
1. Adicionar ao grafo os nós faltantes (bronquite, TB, anafilaxia, pneumotórax, pericardite, dissecção, ecocardiograma, BNP, procalcitonina) e então ampliar `differentialRefs`/`teachingRefs.exames`.
2. Calibrar `masteryTargets` com dados reais de desempenho (quando houver histórico).
3. Converter novos casos já com o bloco pedagógico.
4. Só então (fase futura) o Professor IA consumirá `teachingRefs`/`professorObjectives`/`masteryTargets`/`commonMistakes` — sem UI/endpoint nesta fase.
