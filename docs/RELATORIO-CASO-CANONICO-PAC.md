# Relatório — Caso Canônico PAC (Fase 2)

_Data: 2026-07-03 · Etapa **aditiva e compatível**. Nenhum arquivo funcional existente foi alterado._

## Arquivos criados
| Arquivo | Papel |
|---|---|
| `clinical-engine/types/canonical-case.ts` | Modelo `CanonicalCase` — 15 blocos + interfaces de cada bloco |
| `clinical-engine/cases/pac.ts` | `CANONICAL_PAC` — primeiro caso canônico (dados reais do legado id 2) |
| `clinical-engine/helpers/canonical-case-adapter.ts` | `toLegacyOSCECase()` — Canônico → formato de `data/casos-osce.ts` |
| `clinical-engine/README.md` | Documentação da arquitetura canônica |
| `docs/RELATORIO-CASO-CANONICO-PAC.md` | Este relatório |

## Arquivos modificados
**Nenhum.** Só houve criação de arquivos novos (`clinical-engine/*` + este relatório). `data/casos-osce.ts`, HealthBench, Feedback, OSCE, Centro Clínico, rotas e layout **intactos**.

## Estrutura do caso (15 blocos)
1. **Identificação** — legacyId 2, título, diagnóstico, especialidade, síndrome, dificuldade, objetivos.
2. **Paciente** — Ana Santos, 38, F, professora; personalidade/colaboração/linguagem/estado emocional.
3. **História clínica** — HDA completa, antecedentes, medicações, alergias, hábitos, social, fatores de risco, **red flags**.
4. **Script do paciente** — abertura, respostas dirigidas, sintomas presentes/ausentes, resposta vaga (pergunta ruim) × completa (pergunta boa).
5. **Exame físico** — sinais vitais, geral, respiratório, cardiovascular, abdominal, achados +/−.
6. **Ausculta** — pulmonar: **Crepitações grossas**, base esquerda, `M_CC_LLA.wav`, origem `soundsCatalog` (csvId `M_G_LLA`, translated-code); cardíaca normal.
7. **Exames** — RX de tórax, hemograma, procalcitonina (resultado/justificativa/interpretação/pegadinhas).
8. **Imagens** — RX de tórax, termo Open-i `pneumonia chest xray consolidation`, achados, interpretação.
9. **ECG** — não indicado de rotina; se feito, taquicardia sinusal reativa.
10. **Diagnóstico** — PAC: **por que é** + diferenciais com **por que não é** (bronquite/asma/TEP/IC/TB).
11. **Conduta** — antibiótico (betalactâmico + macrolídeo), gravidade, orientações, seguimento, internação/alta.
12. **Rubrica HealthBench** — `rubrica_correcao`, `checklist_osce`, `erros_criticos` **idênticos ao legado** + microcritérios por eixo.
13. **Feedback esperado** — resposta modelo, checklist nota máxima, erros comuns, pegadinhas, plano de reforço.
14. **Centro Clínico relacionado** — semiologia respiratória, fluxo dispneia/febre, exames (RX/hemograma), imagem (pneumonia), sons (crepitações), CURB-65.
15. **Professor IA** — pontos a reforçar, perguntas socráticas, erros a explorar, mini-aula, plano de treino.

## Quais dados foram migrados (do legado id 2)
- Identificação, paciente, HDA, antecedentes, `respostas_do_paciente`, sinais vitais, exame físico interativo, exames complementares, hipóteses/diferenciais, conduta, critérios de gravidade.
- **Rubrica/checklist/erros críticos 1:1** (Diagnóstico Diferencial 20 · Exames 20 · Antibioticoterapia 30; 6 itens críticos; 2 erros críticos com penalidades 1.5 e 2).

## Quais dados ficaram pendentes / enriquecidos
- **Enriquecidos** (não existiam explícitos no legado): script vago×completo, red flags estruturadas, "por que não é" de cada diferencial, critérios de internação/alta, feedback esperado (resposta modelo/checklist/erros/plano), guia do Professor IA, links do Centro Clínico.
- **Pendente para próximos casos:** derrame parapneumônico como variação, CURB-65 como escore interativo, ausculta cardíaca detalhada (não relevante aqui).

## Como alimentará o Professor IA
`lib/professor-ia/context-builder.ts` poderá receber o `CANONICAL_PAC` como fonte de gabarito;
`professorIA` (bloco 15) e `feedbackEsperado` (bloco 13) preenchem diretamente
`MaterialDidatico` e a orientação socrática do `conversation-builder`.

## Como alimentará o HealthBench
`toLegacyOSCECase(CANONICAL_PAC)` produz `rubrica_correcao/checklist_osce/erros_criticos`
no formato que o `lib/healthbench/rubric-adapter.ts` já consome — **sem mudança** no motor.
Como os valores são idênticos ao caso 2, a nota permaneceria equivalente.

## Como alimentará o Centro Clínico
O bloco 14 já traz `href` para as rotas reais (`/centro-clinico/semiologia|fluxos|exames|imagens|sons`)
e âncoras; um futuro "conteúdo relacionado" no caso pode ler daqui.

## Validação realizada
- ✅ **Type-check** limpo em `clinical-engine/*` (só persistem erros PRÉ-EXISTENTES em `src/services/ecgGenerator/*`).
- ✅ **Nenhum arquivo funcional existente alterado** (apenas arquivos novos).
- ✅ **15 blocos** presentes em `CANONICAL_PAC`.
- ✅ **Adapter** `toLegacyOSCECase` compila e devolve `LegacyOSCECaseShape` compatível (id, dados visíveis/ocultos, paciente, respostas, sinais vitais, exame físico, exames, checklist, rubrica, erros).
- ✅ OSCE, Feedback, HealthBench e Centro Clínico **não foram tocados**.

## Riscos
- **Baixo:** módulo isolado; nada importado por código de produção. Remover a pasta não afeta nada.
- Ao conectar no futuro, garantir que `toLegacyOSCECase` cubra TODOS os campos que um caso específico usa (o shape atual cobre o essencial do pipeline; casos com campos extras exigirão ampliar o adapter).
- Divergência de nota HealthBench × legado (documentada em auditorias anteriores) permanece — não é objeto desta fase.

## Próximos passos
1. Converter mais casos legados para canônicos (SCA, Asma, IC…).
2. Ampliar o adapter para cobrir campos opcionais usados por casos específicos.
3. Criar um `registry` canônico e, atrás de flag, permitir que um caso canônico substitua o legado no pipeline (com testes de equivalência de nota).
4. Ligar `CANONICAL_PAC` ao `lib/professor-ia` (context/knowledge/study-plan) num protótipo isolado.
