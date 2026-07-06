# Auditoria — Integração da OPENAI_API_KEY no /api/professor-ia (Fase 20)

_Auditoria de diagnóstico. Nenhuma alteração de arquitetura, lógica clínica, prompts, ProfessorLesson, LessonFlow ou HealthBench. Logs temporários adicionados e depois removidos._

## 1–3. Onde a chave é lida
- **Variável lida:** `OPENAI_API_KEY`.
- **Arquivo que faz a leitura:** `lib/openai.ts` (linha 3), **no nível do módulo**:
  ```ts
  export const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;
  ```
- **Consumo:** `app/api/professor-ia/route.ts` importa `{ openai }` e decide injetar (ou não) o modelo:
  ```ts
  const client = openai;
  const callModel = client ? async ({system,user}) => client.chat.completions.create(...) : undefined;
  ```
- No `.env.local`: `OPENAI_API_KEY` está **presente** (comprimento 164, prefixo `sk-proj`).

## 4. Log seguro adicionado (temporário, já removido)
```ts
console.log(`[professor-ia][auditoria] hasOpenAIKey=${!!process.env.OPENAI_API_KEY} keyPrefix=${process.env.OPENAI_API_KEY?.slice(0,7)} openaiClientInjected=${!!openai}`);
console.log("[professor-ia] callModelInjected:", !!callModel);
console.log("[professor-ia] source:", result.source);
```
(A chave inteira nunca foi impressa — apenas o prefixo `sk-proj`.)

## 5–6. POST real e resultado observado
`POST http://localhost:3000/api/professor-ia` (servidor dev em execução, PID 2456) → **HTTP 200**. Log do servidor:
```
[professor-ia][auditoria] hasOpenAIKey=true keyPrefix=sk-proj openaiClientInjected=true
[professor-ia] callModelInjected: true
[professor-ia] source: "model"
```
Resposta: `{ ok: true, source: "model", debug: { stepType: "opening", promptChars: 1411 }, professorMessage: "Você fez um bom trabalho no atendimento ao paciente com pneumonia. Agora, vamos revisar…" }`.

- **hasOpenAIKey = true.**
- **O código entrou no RAMO DO MODELO** (não no fallback): `source: "model"`, com fala gerada pelo `gpt-4o-mini`.
- **Linha da decisão:** `app/api/professor-ia/route.ts` — `const callModel = client ? (…) : undefined;` (client = `openai` de `lib/openai.ts:3`). Como `openai !== null`, `callModel` foi injetado e o orquestrador usou o modelo (`generateProfessorStepResponse`, ramo `if (!callModel)` NÃO foi tomado).

## 7. callModel é injetado quando hasOpenAIKey=true?
**Sim.** `callModelInjected: true` foi logado no mesmo request em que `hasOpenAIKey=true`. A injeção depende de `openai` (não-nulo) que depende de `process.env.OPENAI_API_KEY` no momento em que `lib/openai.ts` é carregado.

## Causa-raiz do fallback observado antes
O endpoint **não tem defeito de código**. `lib/openai.ts` lê `process.env.OPENAI_API_KEY` **no carregamento do módulo**, e o Next.js só injeta as variáveis de `.env.local` **no início do `next dev`/`next start`**. Portanto:

> Se o servidor de desenvolvimento estava rodando **antes** de a chave ser adicionada/alterada no `.env.local` (ou antes de o arquivo existir), aquele processo tem `process.env.OPENAI_API_KEY = undefined` durante toda a sua vida → `openai = null` → `callModel = undefined` → o orquestrador cai no ramo `if (!callModel)` e devolve o **fallback estático** com `debug.motivo = "sem_api_key"`.

No teste atual, o servidor em execução (PID 2456) foi iniciado **depois** de a chave existir → `hasOpenAIKey=true` → **modelo é usado**.

### Correção (sem mexer na arquitetura)
Reiniciar o servidor de desenvolvimento após adicionar/alterar `OPENAI_API_KEY`:
```
# parar o next dev atual e subir de novo
npm run dev
```
Se houver **mais de um** `next dev` rodando (o Next 16 usa lock de instância única e recusa um segundo), garanta que o navegador aponte para o servidor que carregou a chave. Não é necessária nenhuma mudança de código.

## Confirmações
- `hasOpenAIKey` = **true** (no servidor iniciado após a chave).
- Ramo usado: **modelo** (`source: "model"`).
- `callModel` injetado quando `hasOpenAIKey=true`: **sim**.
- Nada de lógica clínica, prompts, ProfessorLesson, LessonFlow ou HealthBench foi alterado.
- Logs temporários **removidos**; `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).
