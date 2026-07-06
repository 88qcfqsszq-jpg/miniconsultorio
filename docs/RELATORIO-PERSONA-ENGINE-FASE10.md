# Relatório — Professor Persona Engine + Teaching Session Control (Fase 10)

_Data: 2026-07-03 · Camada **estrutural e aditiva**. Sem IA, endpoint, chat ou UI. Nenhum arquivo de runtime, tela, rota, OSCE, Feedback, HealthBench ou Centro Clínico foi tocado._

## Arquivos criados
- `lib/professor-ia/persona-engine.ts` — personas + controle de sessão (`buildProfessorPersona`).
- `docs/RELATORIO-PERSONA-ENGINE-FASE10.md` — este relatório.

## Arquivos alterados
- `lib/professor-ia/teaching-engine.ts` — adicionado `teachingSession` ao `TeachingDecision` (sem quebrar a API).
- `lib/professor-ia/conversation-builder.ts` — novo prompt de **condução** (persona + estratégia + limites) + `opts.teaching/persona`.
- `lib/professor-ia/interfaces.ts` — `ProfessorPrompts.conducao?` (opcional).
- `lib/professor-ia/dry-run.ts` — computa a persona e inclui `personaDecision` no resultado; prompts guiados por teaching+persona.
- `scripts/professor-ia-dry-run.mjs` — computa/imprime persona + sessão; `conducao` nos prompts.
- `lib/professor-ia/index.ts` — exporta persona-engine.
- `lib/professor-ia/README.md` — pipeline atualizado (Fases 9–10).
- `docs/professor-ia-dry-run-pac.json` — regenerado com persona/sessão.

## Tipos criados
`ProfessorTone` · `ProfessorStrictness` · `ProfessorPacing` · `ProfessorInteractionStyle` · `ProfessorPersonaKey` · `ProfessorPersona` · `TeachingSessionConfig` · `ProfessorPersonaDecision` · `PersonaInput`.

## Personas criadas (6)
| Persona | Tom | Exigência | Ritmo | Estilo |
|---|---|---|---|---|
| examinador_rigoroso | firme | alta | moderado | avaliativo |
| mentor_clinico | acolhedor | média | moderado | misto |
| professor_socratico | encorajador | média | lento | socrático |
| professor_emergencia | urgente | alta | rápido | diretivo |
| professor_semiologia | técnico | média | moderado | explicativo |
| professor_revisao_rapida | encorajador | baixa | rápido | avaliativo |

Cada persona define: tom, exigência, ritmo, estilo de feedback/pergunta, quantidade de elogios/explicação, diretividade, **frases proibidas**, **frases recomendadas**, quando interromper e quando aprofundar.

## TeachingSessionConfig
`estimatedDurationMinutes` · `maxQuestions` · `maxConcepts` · `reviewAtEnd` · `generateMiniQuiz` · `allowFreeQuestions` · `requireStudentAnswerBeforeExplanation` · `stopAfterCriticalCorrection`.

## Regras de escolha da persona
1. **Erro crítico** → `professor_emergencia` (se caso de urgência) ou `examinador_rigoroso`.
2. **Caso de urgência** → `professor_emergencia`.
3. **Muitos erros simultâneos** (≥4 eixos < 0,6) → `mentor_clinico` (foco diretivo).
4. **Nota alta** (≥17) → `professor_revisao_rapida`.
5. **Lacuna principal por eixo:** condutaSegurança→`professor_emergencia`; anamnese→`professor_socratico`; exameFísico→`professor_semiologia`; comunicação→`mentor_clinico`; exames/raciocínio→`mentor_clinico`.

## Conversation Builder — o que o prompt de condução orienta
- Seguir o **tom da persona** (exigência/ritmo).
- **Não ensinar mais conceitos** do que `maxConcepts`; **não fazer mais perguntas** do que `maxQuestions`.
- Respeitar o **modo pedagógico** escolhido.
- **Não sair da base** do sistema (caso + avaliação + Centro Clínico).
- **Não transformar o feedback em aula infinita**.
- Pedir a resposta do aluno antes de explicar (se `requireStudentAnswerBeforeExplanation`).
- **Parar após corrigir o erro crítico** (se `stopAfterCriticalCorrection`).
- Terminar com **revisão** (se `reviewAtEnd`) e propor **mini-quiz** (se `generateMiniQuiz`).
- Ordem dos prompts: `system → seguranca → naoInventar → apenasBase → professor → conducao → caso → contexto`.

## Exemplo com PAC (dry run, HealthBench MOCK 11.8/20)
- **Persona escolhida:** **Examinador rigoroso** (`examinador_rigoroso`).
- **Justificativa:** erro crítico de segurança (antibiótico sem dose) em caso **não** de urgência → rigor na correção.
- **Tom:** firme.
- **sessionConfig gerado:** duração ~8 min · máx. 4 perguntas · máx. 2 conceitos · mini-quiz **sim** · revisão final **sim** · parar após correção crítica **sim** · perguntas livres **não** · exigir resposta antes de explicar **sim**.
- **Prompts:** 8 (inclui `conducao`), ~1344 chars; contexto suficiente para chamar IA no futuro ✅.

## Validação
- ✅ **Type-check limpo** no `professor-ia` (só persistem os erros PRÉ-EXISTENTES em `ecgGenerator`).
- ✅ **Dry run executa** e imprime persona/sessão; JSON regenerado.
- ✅ Nenhuma IA/endpoint/UI/chat.
- ✅ OSCE, Feedback, HealthBench, Centro Clínico e rotas **intocados**.

## Limitações
- Seleção **por regras** (determinística) — a persona decide *como* ensinar; o ensino em si é do LLM futuro.
- `sessionConfig` usa valores-base por persona + ajuste leve pela estratégia; calibração fina numa fase futura.
- HealthBench ainda é MOCK no dry run.

## Próximos passos
1. Trocar o mock pelo HealthBench real.
2. Enriquecer o prompt de condução com `frasesRecomendadas/proibidas` completas da persona (já disponíveis).
3. Só então (fase futura) o orquestrador/endpoint enviaria os prompts guiados por persona+sessão a um modelo.
4. UI/aba/chat do Professor — fase futura.
