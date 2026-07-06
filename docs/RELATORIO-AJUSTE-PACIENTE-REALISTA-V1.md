# Relatório — Ajuste de comportamento do Paciente Simulado (Realista Mínimo V1)

**Data:** 28 de junho de 2026
**Status:** ✅ Implementado (alteração mínima e reversível)
**Escopo:** Apenas o texto do prompt global do paciente simulado. **Nenhuma alteração na API, modelo ou parâmetros OpenAI.**

---

## 1. Objetivo

Melhorar o realismo da conversa do paciente simulado, corrigindo 5 problemas observados:
1. Entregava muitos dados clínicos de uma vez.
2. Antecipava informações não perguntadas.
3. Repetia respostas mecânicas ("Ok, doutor").
4. Parecia obediente demais e pouco humano.
5. Demonstrava pouca emoção/dúvida realista.

**Regra central:** o paciente pode falar de forma natural e emocional, mas revela **no máximo 1 dado clínico novo por fala** (exceto em pergunta composta).

---

## 2. Arquivo alterado (1)

| Arquivo | Mudança |
|---|---|
| `lib/prompts.ts` | Constante `REGRAS_PACIENTE_OSCE_REALISTA_MINIMO_V1` (entre marcadores) + 1 concatenação no `return` de `criarPromptPaciente` |

Nenhum outro arquivo foi tocado.

---

## 3. O que foi adicionado

Bloco reversível, delimitado por:
```
// PACIENTE_OSCE_REALISTA_MINIMO_V1_INICIO
const REGRAS_PACIENTE_OSCE_REALISTA_MINIMO_V1 = ` ... `;
// PACIENTE_OSCE_REALISTA_MINIMO_V1_FIM
```
Concatenado **uma vez** no prompt, logo após `${instrucoesSpeciais}` e **antes** do `HISTÓRICO DA CONVERSA`.

Regras cobertas pelo bloco:
- **Revelação clínica controlada** — máx. 1 dado clínico novo por fala (com a lista do que conta como "dado clínico novo").
- **Perguntas abertas** → 1 dado principal + 1 emoção/preocupação.
- **Perguntas específicas** → só o ponto perguntado (emoção permitida, sem novo dado).
- **Pergunta composta (exceção)** → responde todos os itens explicitamente perguntados.
- **Anti-repetição** — "Ok, doutor" no máximo 2× e nunca em falas seguidas; variações sugeridas.
- **Emoção natural** — preocupação/medo/dúvida sem virar lista de sintomas.
- **Não-avaliador** — não sugere diagnóstico/exame/conduta nem ensina medicina.
- **Não inventar** — sem dados fora do caso ("não sei", "não reparei").
- **Pediátrico/responsável** — mesmas regras aplicadas ao cuidador.

---

## 4. Confirmação: API/modelo/parâmetros NÃO alterados

`app/api/chat-paciente/route.ts` permaneceu intacto (verificado):

| Item | Valor | Estado |
|---|---|---|
| Rota | `POST /api/chat-paciente` | inalterada |
| Modelo | `gpt-4o-mini` | inalterado |
| `temperature` | `0.7` | inalterado |
| `max_tokens` | `500` | inalterado |
| Estrutura | `role: "user"` (única mensagem) | inalterada |
| Histórico / payload / dados do caso | — | inalterados |

Também intactos: `lib/mockPaciente.ts` (fallback), rubricas, HealthBench, feedback, PDF, exame físico, ECG, pediatria, casos.

---

## 5. Validação automática (estrutural)

| Verificação | Resultado |
|---|---|
| Build (`npm run build`) | ✅ compila |
| Tipos `lib/prompts.ts` | ✅ sem erros |
| Bloco presente no prompt — PAC (caso 2) | ✅ (antes do histórico) |
| Bloco presente no prompt — SCA (caso 1) | ✅ (antes do histórico) |
| Bloco presente no prompt — pediátrico (ped-01) | ✅ |
| Regras pediátricas originais preservadas | ✅ (o bloco soma, não substitui) |
| Constante referenciada 2× (definição + concatenação) | ✅ |
| App em execução | ✅ HTTP 200 (home e casos) |
| `OPENAI_API_KEY` presente (`.env.local`) | ✅ usa OpenAI real (não fallback) |

---

## 6. Validação comportamental (pendente — manual do usuário)

Os testes de **resposta da IA** (Seção 12 da tarefa: PAC, SCA, abdominal) dependem de interação no chat com a `OPENAI_API_KEY` ativa e **não podem ser executados automaticamente** pelo agente. Comportamento esperado a conferir no navegador:

**PAC (caso 2)**
- "O que trouxe você aqui?" → 1 dado ("Estou com tosse…") + emoção; **não** listar tosse+febre+catarro+falta de ar.
- "Tem febre?" → "Tenho sim. Isso me deixou preocupada." (sem acrescentar outros sintomas).
- "Qual a cor do catarro?" → "É amarelado." (sem febre/dispneia).
- "Você está com pneumonia." → reação emocional ("Isso é grave?"), sem agir como avaliador.

**SCA (caso 1)**
- "O que está sentindo?" → "Estou com dor no peito…" (1 dado), **não** dor+irradiação+suor+duração.
- "Está suando ou enjoado?" (composta) → pode responder os dois.

**Abdominal**
- "O que sente?" → "Estou com dor na barriga…" (1 dado), sem febre+náusea+vômito juntos.

---

## 7. Como reverter

Alteração isolada; qualquer uma destas opções restaura o comportamento anterior:
1. Remover o bloco entre `// PACIENTE_OSCE_REALISTA_MINIMO_V1_INICIO` e `// ..._FIM`; **ou**
2. Remover/comentar a linha `${REGRAS_PACIENTE_OSCE_REALISTA_MINIMO_V1}` no `return` de `criarPromptPaciente`.

---

## 8. Conclusão

O ajuste é cirúrgico (1 arquivo, 1 bloco), reversível e não toca na infraestrutura técnica da chamada OpenAI. A validação estrutural confirma que o bloco entra no prompt de casos adulto e pediátrico, preservando as regras pediátricas existentes. A confirmação final do comportamento conversacional é manual, no navegador, com a chave OpenAI ativa.
