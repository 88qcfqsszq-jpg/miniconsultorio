# Relatório — Teaching Strategy Engine (Fase 9)

_Data: 2026-07-03 · Camada **estrutural e aditiva**. Sem IA, sem endpoint, sem chat, sem UI. Nenhum arquivo de runtime, tela, rota, OSCE, Feedback, HealthBench ou Centro Clínico foi tocado._

## Arquivos criados
- `lib/professor-ia/teaching-engine.ts` — a engine pedagógica (`buildTeachingStrategy`).
- `docs/RELATORIO-TEACHING-ENGINE-FASE9.md` — este relatório.

## Arquivos alterados
- `lib/professor-ia/dry-run.ts` — inclui `teachingStrategy` no `ProfessorIADryRunResult`.
- `scripts/professor-ia-dry-run.mjs` — computa e imprime a estratégia (prioridade, modo, objetivos, plano 3 passos) e a salva no JSON.
- `lib/professor-ia/index.ts` — exporta a engine + tipos.
- `lib/professor-ia/README.md` — novo pipeline `HealthBench → StudyPlan → TeachingEngine → ConversationBuilder → LLM futuro`.
- `docs/professor-ia-dry-run-pac.json` — saída regenerada com a estratégia.

## Tipos / estruturas criados
`TeachingMode` · `TeachingStrategy` · `TeachingStrategyKey` · `TeachingPriority` · `TeachingObjective` · `TeachingIntervention` · `TeachingDecision` · `TeachingRoadmap` · `TeachingInput`.

**Modos pedagógicos:** `socratico` · `demonstrativo` · `diretivo` · `avaliador` · `revisao_rapida` · `reforco_de_erro_critico`.

## Entrada / saída
- **Entrada** (`TeachingInput`): `ProfessorIAContext` + `StudyPlan` + `HealthBenchEvaluationResult` + `CanonicalCase` + `KnowledgeMap`.
- **Saída** (`TeachingDecision`): prioridade principal · prioridades secundárias · modo pedagógico · objetivos da sessão · recursos do Centro Clínico · perguntas socráticas · mini-aulas · erros a explorar · **erros a ignorar por agora** · plano em 3 passos · roadmap · **alerta de segurança** (se erro crítico).

## Regras pedagógicas implementadas
1. **Erro crítico → sempre prioridade 1** + modo `reforco_de_erro_critico` + alerta de segurança.
2. **Conduta insegura > diagnóstico incompleto** — o eixo `condutaSeguranca` recebe bônus de severidade (+0.15) no ranking.
3. **Anamnese fraca + diagnóstico certo → investigação dirigida** (estratégia `investigacao_dirigida`, modo socrático).
4. **Diagnóstico errado → diferenciais** (modo demonstrativo).
5. **Exame físico fraco → semiologia** (modo demonstrativo).
6. **Exames fracos → justificativa dos exames** (modo socrático).
7. **Comunicação fraca → fala médica clara** (modo demonstrativo).
8. **Máximo de 3 prioridades** — o resto vai para "erros a ignorar por agora" (não ensinar tudo de uma vez).
9. Modo global: erro crítico → reforço; muitos gaps (≥4) → diretivo; nota alta sem gaps → revisão rápida; senão, o modo da prioridade principal.
10. Plano em 3 passos: (1) reconhecer acertos, (2) atacar a prioridade 1 no modo escolhido, (3) avançar/consolidar.

## Exemplo com PAC (dry run, HealthBench MOCK 11.8/20)
- **Alerta de segurança:** ⚠️ erro crítico — antibiótico sem dose.
- **Prioridade principal:** *Corrigir erro crítico* (severidade crítica).
- **Modo pedagógico escolhido:** `reforco_de_erro_critico`.
- **Prioridades secundárias:** Conduta segura (modo diretivo) · Investigação dirigida (modo socrático) — nesta ordem porque conduta/segurança (0.35 + bônus) supera anamnese (0.33).
- **Objetivos da sessão (3):** Corrigir erro crítico · Conduta segura · Investigação dirigida.
- **Plano em 3 passos:**
  1. Reconhecer acertos: Exame físico, Exames complementares, Raciocínio diagnóstico.
  2. Prioridade 1 (modo reforço de erro crítico): antibiótico sem dose.
  3. Avançar: Conduta segura (modo diretivo) e consolidar.
- **Erros a ignorar por agora:** Fala médica clara (apresentar-se/explicar) — adiado por já haver 3 prioridades.

## Fluxo (pipeline pedagógico)
```
HealthBench ─▶ buildProfessorContext ─▶ buildStudyPlan ─▶ buildTeachingStrategy ─▶ buildConversationModel ─▶ [LLM futuro]
```

## Validação
- ✅ **Type-check limpo** (teaching-engine, dry-run, professor-ia) — só persistem os erros PRÉ-EXISTENTES em `ecgGenerator`.
- ✅ **Dry run executa** e imprime a estratégia; JSON regenerado.
- ✅ **Nenhuma IA chamada**, nenhum endpoint/UI/chat criado.
- ✅ OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**.

## Limitações
- `buildTeachingStrategy` é **determinística por regras** (não generativa) — é justamente a camada que *decide* como o LLM deverá ensinar, não o ensino em si.
- Usa o resumo de competências do `ProfessorIAContext` (6 eixos); nuances além dos 6 eixos não são consideradas.
- HealthBench ainda é MOCK no dry run.

## Próximos passos
1. Substituir o HealthBench MOCK pelo resultado real.
2. Passar a `TeachingDecision` ao `conversation-builder` (enriquecer os prompts com o modo/estratégia escolhidos) — pequena extensão futura.
3. Só então (fase futura) o orquestrador/endpoint enviaria os prompts guiados pela estratégia a um modelo.
4. UI/aba/chat do Professor — fase futura.
