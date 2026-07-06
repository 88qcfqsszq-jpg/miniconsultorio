# Relatório — Paciente Simulado Realista V1.1 (implantação global)

**Data:** 28 de junho de 2026
**Status:** ✅ Implantado globalmente (todos os casos adultos e pediátricos)
**Escopo:** Apenas o texto do bloco de prompt do paciente. **Nenhuma alteração na API, modelo ou parâmetros OpenAI.**

> Atualiza o relatório V1.1 anterior com os reforços globais (abertura clínica, anti-repetição emocional, exames solicitados) motivados pelo teste real de SCA.

---

## 1. Resumo do ajuste

A V1.1 refina a V1 do paciente realista para valer em **todos** os pacientes. Corrige três problemas vistos no teste real de SCA:
1. Abertura clínica entregando checklist (dor + duração + suor + falta de ar).
2. Repetição da reação emocional "Isso me preocupa".
3. Comportamento precisava ser global, não só PAC.

Regra central mantida: **no máximo 1 dado clínico novo por fala** (salvo pergunta composta), com emoção natural permitida (sem carregar sintomas extras).

---

## 2. Arquivo alterado

| Arquivo | Mudança |
|---|---|
| `lib/prompts.ts` | Bloco `REGRAS_PACIENTE_OSCE_REALISTA_MINIMO_V1` (V1.1) refinado |

Confirmado por timestamp: **apenas** `lib/prompts.ts` foi tocado. `app/api/chat-paciente/route.ts` e `lib/mockPaciente.ts` **não** foram alterados.

---

## 3. O que mudou em relação à V1 (e à V1.1 inicial)

| Seção do bloco | Reforço desta tarefa |
|---|---|
| **ABERTURA CLÍNICA / PERGUNTAS ABERTAS** | Inclui "Como o senhor/a senhora está?" e "Como posso ajudar?"; **proíbe checklist** na abertura; exemplos por especialidade (SCA, PAC, abdominal, asma, pediatria) + 3 exemplos PROIBIDOS |
| **ANTI-REPETIÇÃO (ampla)** | Passa a cobrir **reações emocionais** repetitivas: "Isso me preocupa", "Estou preocupado(a)", "Isso me deixa preocupado(a)", "O que isso significa?" (máx. 2× cada); variações emocionais sugeridas |
| **EXAMES SOLICITADOS** (nova) | Consentir naturalmente a "ECG/Raio-X/Troponina/Hemograma/vou pedir exames", variando a resposta; não repetir "estou pronto para o exame de X" |
| **EMOÇÃO NATURAL** | Reforço: variar, não repetir a mesma frase |

Já presentes desde a V1.1 inicial (mantidos): revelação controlada (1 dado/fala), perguntas específicas, **evolução/piora** (1 detalhe), pergunta composta, **sinais vitais/medição** (pergunta-valor × comando), não-avaliador, não-inventar, pediatria/responsável.

---

## 4. Confirmação: API/modelo/parâmetros NÃO alterados

| Item | Valor | Estado |
|---|---|---|
| Rota `POST /api/chat-paciente` | — | inalterada |
| Modelo | `gpt-4o-mini` | inalterado |
| `temperature` | `0.7` | inalterado |
| `max_tokens` | `500` | inalterado |
| `top_p`/`presence_penalty`/`frequency_penalty` | default | inalterados |
| Estrutura | `role:"user"` | inalterada |
| Histórico / payload / dados do caso / segmentação | — | inalterados |
| Feedback, rubricas, HealthBench, PDF, ECG, exame físico, pediatria visual, casos, layout | — | inalterados |

---

## 5. Testes PAC

Validação **estrutural** (o prompt carrega os reforços em PAC) ✅. Comportamento esperado no navegador (OpenAI ativa):
- "O que está sentindo?" → "Estou com tosse. Estou preocupada porque não melhora." (sem febre/catarro/falta de ar juntos).
- "Está piorando?" → "Sim, piorou um pouco. Agora estou tossindo com catarro." (1 detalhe).

## 6. Testes SCA

Validação estrutural ✅ (reforços presentes no prompt SCA). Comportamento esperado:
- "Como o senhor está?" → "Estou com dor no peito. Fiquei preocupado porque não passou." (**sem** duração/suor/falta de ar/irradiação).
- "Há quanto tempo?" → "Começou há cerca de duas horas." · "Está suando?" → "Sim, estou com suor frio." · "A dor irradia?" → "Sim, vai para o braço esquerdo."

## 7. Testes abdominal / pediátrico

- Abdominal: "O que sente?" → "Estou com dor na barriga. Está me incomodando bastante." (sem localização+febre+vômito+diarreia juntos).
- Pediátrico: "O que aconteceu com ele?" → "Ele está com febre. Estou preocupada porque ele está abatido." (sem checklist). Reforços presentes no prompt pediátrico ✅.

## 8. Resultado da anti-repetição

Regra ampliada para reações emocionais. Critério: nenhuma de "Isso me preocupa" / "Certo, doutor" / "Ok, doutor" deve aparecer mais de 2× na conversa. Validação estrutural ✅ (regra no prompt); confirmação conversacional é manual.

> **Observação:** os testes de **resposta da IA** (Seção 12 da tarefa) exigem interação no chat com `OPENAI_API_KEY` ativa e não são executáveis automaticamente (sem a chave, a rota cai no fallback `mockPaciente`, que não usa este prompt). Validou-se que o bloco V1.1 com os reforços entra no prompt de PAC, SCA e pediátrico.

---

## 9. Como reverter para V1

No bloco entre `// PACIENTE_OSCE_REALISTA_MINIMO_V1_INICIO` e `// ..._FIM` em `lib/prompts.ts`:
- **Reverter só os reforços desta tarefa:** remover os exemplos por especialidade/"PROIBIDO" da ABERTURA, as reações emocionais da ANTI-REPETIÇÃO e a seção EXAMES SOLICITADOS.
- **Reverter para V1:** remover também as seções EVOLUÇÃO/PIORA e SINAIS VITAIS/MEDIÇÃO.
- **Reverter ao comportamento original:** remover o bloco inteiro ou a linha `${REGRAS_PACIENTE_OSCE_REALISTA_MINIMO_V1}` no `return` de `criarPromptPaciente`.

---

## 10. Conclusão

A V1.1 global é cirúrgica (1 arquivo, 1 bloco) e reversível, reforçando abertura sem checklist, anti-repetição emocional e consentimento a exames — para **todos** os pacientes (adultos e pediátricos), sem tocar na infraestrutura técnica da chamada OpenAI nem no feedback/rubricas. A confirmação conversacional final é manual, no navegador, com a chave OpenAI ativa.
