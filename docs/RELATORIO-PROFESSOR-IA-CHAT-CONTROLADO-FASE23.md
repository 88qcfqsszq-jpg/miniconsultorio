# Relatório — Chat Controlado do Professor IA usando LessonFlow (Fase 23)

_Transforma a prévia estrutural num **chat funcional, mas controlado passo a passo pelo LessonFlow**. NÃO substitui o Feedback, NÃO altera nota/HealthBench/OSCE/Centro Clínico/rotas, NÃO cria login/banco/memória persistente/streaming/voz e NÃO refatora a arquitetura._

## Objetivo
Adicionar, dentro da seção Professor IA do Feedback, a primeira versão de **chat** que conduz o aluno **etapa por etapa** pelo `LessonFlow` já existente, usando o `ProfessorLesson` e o endpoint `POST /api/professor-ia` (1 step por vez). Não é chat livre: o modelo não escolhe etapa; o aluno segue o roteiro.

## Arquivos criados
- `components/professor-ia/ProfessorIAChat.tsx` — o chat controlado (client component, estado só em memória).
- `docs/RELATORIO-PROFESSOR-IA-CHAT-CONTROLADO-FASE23.md` — este relatório.

## Arquivos alterados
- `components/professor-ia/ProfessorIAPreview.tsx` — insere `<ProfessorIAChat lesson={lesson} />` **abaixo** de tudo que já existia (Diagnóstico, Plano da aula, Recursos, Base do Professor IA, Fala experimental). **Nada removido.**
- (Orquestrador e rota **não precisaram mudar** — o endpoint já suportava `currentStepId`, `history` e `studentMessage`.)

## Como o chat usa cada peça
- **ProfessorLesson:** recebido via prop `lesson`. Usa `lesson.status`/`lesson.lessonFlow`; não muta nada.
- **LessonFlow:** fonte da navegação — `flow.firstStepId`, `flow.steps`, e o `nextStepId` de cada `LessonStep`. O progresso ("Etapa X de Y"), a trilha compacta (concluídas · atual · próximas), o tipo/objetivo/checkpoint e os recursos vêm do step atual.
- **currentStepId:** estado local. Iniciar → `firstStepId`; "Próxima etapa" → `currentStep.nextStepId`; enviar resposta → mantém o `currentStepId`.
- **/api/professor-ia:** cada transição chama `POST { lesson, currentStepId, studentMessage?, history }`. A resposta preenche a fala do professor e `shouldWaitForStudent` (controla o input).

## Fluxo (Tarefas 2–4)
1. **Iniciar tutoria** → chama o `firstStepId`; mostra a fala; se `shouldWaitForStudent` → habilita input; senão → habilita "Próxima etapa".
2. **Enviar (aluno)** → adiciona a mensagem ao histórico e chama o **mesmo** step com `studentMessage`; o professor responde só àquele step.
3. **Próxima etapa** → usa `currentStep.nextStepId`; marca o anterior como concluído; gera a fala do novo step. Sem `nextStepId` → **"Sessão finalizada. Revise o próximo passo sugerido."**

## Controle visual do LessonFlow (Tarefa 5–6)
Bloco compacto com: nº/título/tipo/objetivo do step, "⏳ exige resposta", "⏸ checkpoint", trilha numérica colorida (verde=concluída, índigo=atual, cinza=próxima) e, se houver, os **recursos sugeridos** da etapa (cards pequenos, não abrem sozinhos).

## Fallback (Tarefa 7)
Toda chamada tem `try/catch`. Se o endpoint falhar, o chat usa **localmente** `step.staticPreviewText` (nunca quebra o Feedback). Sem `OPENAI_API_KEY`, o endpoint já devolve o fallback estático (`source: "fallback"`). O guardrail da Fase 22 continua ativo no servidor (bloqueia elogio sem evidência).

## Caso sem Gold Standard (Tarefa 8)
Se `lesson.status !== "ok"` ou não há `lessonFlow`/steps, o chat mostra o estado vazio ("Chat do Professor IA indisponível para este caso porque ainda não existe gabarito estruturado.") e **não renderiza input**.

## Como impede substituir o Feedback / segurança
- Estado **apenas em memória** (React `useState`), zerado a cada montagem — sem banco, login ou memória persistente.
- Não faz PATCH/POST em nada além de `/api/professor-ia` (que é read-only quanto a nota/feedback).
- Não muta `lesson`; nota, cards, resposta modelo, checklist e mini-aula do Feedback ficam intocados (o chat é uma seção **adicional**).

## Validação
- ✅ **Type-check limpo** (`npx tsc --noEmit`) incl. os `.tsx` — só persistem os erros **pré-existentes** em `src/services/ecgGenerator/*`.
- ✅ **Fluxo do endpoint** (sequência real contra o dev server, fixture PAC): **Iniciar** (step-1 → step-2) → **Avançar** encadeando `nextStepId` → parou em `wait_student_answer` com `shouldWaitForStudent=true` → **resposta do aluno** manteve o mesmo step e o professor respondeu via **modelo** (`source: "model"`). Confirma: o modelo **não pula etapas**, respeita `wait_student_answer` e checkpoints.
- ✅ Preview continua aparecendo (chat adicionado **abaixo**, nada removido).
- ✅ Sem banco/login/memória/streaming/voz; Feedback/nota/HealthBench/OSCE/Centro Clínico intocados.
- ⚠️ **Playwright de UI não executado** (o fluxo exige completar um caso OSCE para chegar ao Feedback; recomendado numa próxima janela). A validação foi por `tsc` + sequência real de chamadas ao endpoint que o chat aciona.

## Limitações
- **Avanço manual** (botão "Próxima etapa") — nesta fase não há avaliação semântica da resposta do aluno (não decide acerto/erro); os branches do LessonFlow ainda não são executados dinamicamente.
- **Guardrail conservador:** por ser casamento de string, ele pode neutralizar a **abertura** quando o texto do erro crítico contém um verbo proibido (ex.: "prescreveu" no enunciado do erro, quando o aluno não prescreveu) — resultado é uma abertura neutra (seguro, porém às vezes genérico). É a mesma limitação registrada na Fase 22.
- Sem streaming (resposta aparece de uma vez), sem voz, sem histórico persistente entre sessões.
- Só o **PAC** tem gabarito → chat disponível; outros casos mostram o estado vazio.

## Próximos passos
1. **Execução dinâmica dos branches** do LessonFlow (on_correct/on_incorrect/on_no_answer/on_request_explanation) com avaliação leve da resposta.
2. Avanço automático quando o step não exige resposta; streaming da fala.
3. Persistência de progresso (`currentStepId`/`completedStepIds`) e memória do aluno — quando houver login/banco.
4. Guardrail semântico (distinguir "elogiar ação" de "descrever o erro") para reduzir falsos-positivos.
