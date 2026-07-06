# Relatório — Professor IA Dry Run (Fase 8)

_Data: 2026-07-03 · Simulação **estrutural, sem IA generativa**. Nenhuma chamada OpenAI, nenhum endpoint, nenhuma UI, nenhum chat. Nenhum arquivo de runtime, tela, rota, OSCE, Feedback, HealthBench ou Centro Clínico foi tocado._

## Arquivos criados
| Arquivo | Papel |
|---|---|
| `lib/professor-ia/dry-run.ts` | **Prova type-checked** da arquitetura real: importa CANONICAL_PAC + adapter + Knowledge Graph + os 4 builders (`buildProfessorContext`, `buildKnowledgeMap` via context, `buildStudyPlan`, `buildConversationModel`) + HealthBench MOCK → `ProfessorIADryRunResult`. |
| `scripts/professor-ia-dry-run.mjs` | Runner executável (Node) que reproduz o mesmo pipeline com dados inline, imprime o resumo e salva o JSON. |
| `docs/professor-ia-dry-run-pac.json` | Saída do dry run (contexto completo montado). |
| `docs/RELATORIO-PROFESSOR-IA-DRY-RUN-FASE8.md` | Este relatório. |

> **Nota de execução:** o Node ESM não roda os módulos `.ts` do projeto diretamente (imports relativos sem extensão exigiriam um loader/`tsx`, que não está instalado). Por isso `dry-run.ts` é a **prova de compilação** (o `tsc` verifica que todas as peças se conectam e os tipos batem de ponta a ponta) e o `.mjs` é o **executável equivalente** (mesma lógica/dados), evitando alterar 15+ arquivos ou o lockfile.

## Fluxo executado
```
CANONICAL_PAC ─▶ toLegacyOSCECase() ─▶ buildProfessorContext(caso, atendimento, HB mock, estudoFinal)
                                            │  (context-builder + knowledge-builder)
                                            ├─▶ buildStudyPlan(caso, avaliação, HB, checklist, conhecimento)
                                            └─▶ buildConversationModel(context)  → 7 prompts
                                                        ▼
                                            ProfessorIADryRunResult (+ JSON)
```

## Dados consumidos (todos estruturados; nenhuma IA)
- **Caso Canônico PAC** (id 2): identificação, diagnóstico, paciente, exames, ausculta, refs (soundRefs/imageRefs/examRefs/flowRefs), `professorObjectives`, `perguntasSocraticas`, `feedbackEsperado`.
- **Knowledge Graph**: resolução dos ids do caso → nós reais (Crepitações, Radiografia de tórax, Hemograma, Fluxo da Dispneia/Febre…).
- **HealthBench MOCK** realista: nota **11.8/20** (reprovado); forte em diagnóstico/exames; falho em anamnese e conduta; **erro crítico = antibiótico sem dose**; `nextTrainingFocus` coerente.

## Resultado do dry run (PAC)
- **Nota simulada:** 11.8/20 (abaixo do esperado).
- **Pontos fortes:** sinais vitais + SpO₂, ausculta (crepitações), RX de tórax, hemograma.
- **Principais falhas:** apresentar-se/explicar em linguagem acessível; antecedentes/alergias; sinais de gravidade; **dose do antibiótico**; orientar sinais de alarme/retorno.
- **Recursos ligados (Knowledge Graph):** sons=Crepitações; imagens=RX de tórax; exames=Hemograma; fluxos=Dispneia, Febre; +6 recursos do Centro Clínico.
- **Objetivos do Professor:** SpO₂/FR; justificar antibiótico+dose; correlação ausculta+RX+leucograma.
- **Perguntas socráticas:** 4 (consolidação vs broncoespasmo; papel da SpO₂/FR; PAC vs asma/IC/TEP; qual antibiótico e dose).

## Plano de estudo gerado
- **P1:** Corrigir erro crítico (dose do antibiótico) · Reforçar Anamnese dirigida · Reforçar Conduta e Segurança.
- **P2:** Reforçar Comunicação e postura médica.
- Cada item traz recursos relacionados (Centro Clínico).

## Prompts gerados (7, sem envio a modelo)
`system · seguranca · naoInventarMedicina · apenasBaseDoSistema · professor · caso · contexto` — ordem de composição sugerida idêntica; ~956 chars no total (versão inline). Nenhum foi enviado a uma IA.

## Riscos de alucinação evitados
- **Não inventar medicina:** proíbe achados/exames/condutas fora do caso/base.
- **Apenas base do sistema:** ancoragem em caso + HealthBench + material + Centro Clínico.
- **Segurança:** contexto educacional/simulado, sem prescrição real.
- **Proveniência por bloco** no contexto (fonte de cada dado), reduzindo especulação.

## Campos ausentes (detectados)
- `ecg` (não indicado no PAC).
- Sinais vitais detalhados no mock (parcial).
- Diferenciais/exames sem nó no grafo (bronquite, TB, procalcitonina) — texto, não ref.

## Limitações encontradas
- Node ESM não executa os `.ts` sem loader → runner autocontido (mesma lógica) em vez de importar os builders reais em runtime.
- HealthBench é MOCK (a integração real ligaria o resultado verdadeiro).

## A arquitetura está pronta para um endpoint futuro?
**Sim.** O `tsc` confirma que CANONICAL_PAC → adapter → `buildProfessorContext` → `buildStudyPlan` → `buildConversationModel` → `ProfessorIADryRunResult` **se conectam e batem os tipos**. O runner prova que o pacote de contexto sai **completo** (caso, nota, falhas, fortes, recursos, sons, imagens, exames, fluxos, objetivos, socráticas, plano, prompts) e que **há contexto suficiente para chamar uma IA no futuro** (✅). Um endpoint futuro só precisaria: receber o atendimento real + HealthBench real, chamar `buildProfessorContext/buildStudyPlan/buildConversationModel` e enviar os prompts a um modelo.

## Próximos passos
1. Adicionar um loader (`tsx`) ou expor os builders num ponto sem extensão para permitir o runner importar os módulos reais (opcional).
2. Substituir o HealthBench MOCK pelo resultado real (via `/api/osce/finalizar`).
3. Construir o orquestrador/endpoint (fase futura) que envia os prompts a um modelo — **fora do escopo desta fase**.
4. UI/aba/chat do Professor — fase futura.
