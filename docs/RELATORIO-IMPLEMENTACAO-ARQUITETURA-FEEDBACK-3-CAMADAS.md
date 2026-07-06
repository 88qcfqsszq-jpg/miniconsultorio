# Relatório — Implementação da Arquitetura de Feedback OSCE em 3 Camadas

**Data:** 28 de junho de 2026
**Status:** ✅ Implementado (arquitetura + template; PAC congelada; SCA alinhada; nenhuma nova patologia ativada)
**Escopo:** Camada de feedback. **Não** altera paciente simulado, API OpenAI, prompt, modelo/parâmetros, ECG, exame físico visual, layout, casos clínicos ou PDF visual.

---

## 1. Resumo do que foi implementado

1. **Camada global de consistência** — ponto único `aplicarConsistenciaGlobalCards`, aplicado a **todos** os cards (com ou sem rubrica específica), no `feedback-view-builder`.
2. **Camada global por competência** — `competencias-globais.ts` com ~17 helpers reutilizáveis (lógica estrutural, não clínica).
3. **Camada específica por diagnóstico** — mantido o contrato existente (`pac.ts`, `sca.ts`); **SCA completado** para os 6 cards (Comunicação adicionada via helpers globais).
4. **Template** `_template-diagnostico.ts` (não registrado) para novas patologias.
5. **PAC congelada** (clínica intacta) e validada sem regressão. **Nenhuma** patologia nova ativada.

---

## 2. Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/rubricas-diagnosticos/consistencia-textual.ts` | `aplicarConsistenciaGlobalCards` (ponto único); regra 3.1 (frase de revisão não-genérica) |
| `lib/healthbench/rubricas-diagnosticos/index.ts` | `aplicarRubricaNosCards` retorna `{cards, recalibrados}`; exporta camada global + `normalizarCard` |
| `lib/healthbench/feedback-view-builder.ts` | Caminhos rubrica/genérico convergem para a camada global única |
| `lib/healthbench/rubricas-diagnosticos/competencias-globais.ts` | **Novo** — helpers globais por competência |
| `lib/healthbench/rubricas-diagnosticos/_template-diagnostico.ts` | **Novo** — template (não registrado) |
| `lib/healthbench/rubricas-diagnosticos/sca.ts` | `avaliarComunicacaoSCA` (6º card) usando helpers globais |

> **Não alterados:** `pac.ts` (clínica PAC), `feedback-consistency.ts`, `FeedbackOSCE.tsx`, PDF, `lib/prompts.ts`, `chat-paciente/route.ts`, `mockPaciente.ts`, grader/evaluator, casos, ECG, exame físico visual, pediatria.

---

## 3. Camada global de consistência

`aplicarConsistenciaGlobalCards(cards, ctx, recalibrados, normalizarCard)` combina, para **cada** card:
- **Lógica** (`normalizarCard`): dedup de acertos/melhorias; remove de "Melhorar" o que está em "Acertos" (por núcleo); clamp 0..peso; piso quando acerto+0 sem penalidade.
- **Textual** (`normalizarExplicacaoCard`):
  - remove **evidências contraditórias** (SpO₂/sinais vitais, RX, tosse/escarro, diferenciais);
  - card **recalibrado** → evidências = acertos (curtas, coerentes);
  - card **completo** → "Melhorar" = ["Nenhuma pendência identificada."];
  - card **incompleto sem melhoria específica** → "Revisar os critérios objetivos ainda não cumpridos desta competência." (**nunca** "Completar os critérios restantes…").

Aplicada em **ambos** os caminhos (rubrica específica e genérico) — inclusive casos sem rubrica.

---

## 4. Camada global por competência

`competencias-globais.ts` — helpers que leem diálogo/anamnese, exames, exame físico, conduta e SOAP (não dependem de campos formais), com termos por parâmetro:

- **Comunicação:** `detectarApresentacaoOuAcolhimento`, `detectarExplicacaoHipoteseAcessivel`, `detectarOrientacaoTratamentoOuReavaliacao`, `detectarSinaisAlarmeOuRetorno`.
- **Exame físico:** `detectarSinaisVitaisCompletos`, `detectarSpo2OuOximetria`, `detectarExameSistemaPrincipal`, `detectarGravidadeOuInstabilidade`.
- **Exames:** `detectarExameSolicitadoVisualizadoOuInterpretado` (regra global "solicitado/visualizado/interpretado"), `detectarInterpretacaoExame`.
- **Raciocínio:** `detectarHipotesePrincipal`, `detectarDiferenciaisVerbalizados`, `detectarRaciocinioVerbalizado`, `detectarAvaliacaoGravidadeLocalCuidado`.
- **Conduta:** `detectarCondutaEspecifica`, `detectarMedidasSuporte`, `detectarDoseDuracaoPosologia`.

SCA já usa os de Comunicação (prova de reutilização). PAC permanece com suas funções aprovadas (congelada) — pode migrar para os helpers no futuro, sem urgência.

---

## 5. Estado da PAC após a mudança (não-regressão)

Teste com atendimento PAC completo → **nota 19/20**:

| Card | Pontos |
|---|---|
| Comunicação | 2/2 |
| Anamnese | 4/4 |
| Exame físico | 3/3 |
| Exames complementares | 1.8/2 |
| Raciocínio | 4.2/5 |
| Conduta | 4/4 |

Camada global: **0 contradições, 0 acerto-em-melhorar, 0 incompleto-sem-faltou, 0 completo-com-faltou.** Clínica PAC inalterada (`pac.ts` não tocado).

---

## 6. Estado da SCA após a mudança

SCA passou a ter os **6 cards** (Comunicação adicionada via helpers globais). Teste com atendimento SCA bom → **nota 19.3/20**:

| Card | Pontos |
|---|---|
| Comunicação | 2/2 |
| Anamnese | 3.8/4 |
| Exame físico | 3/3 |
| Exames complementares | 1.9/2 |
| Raciocínio | 4.6/5 |
| Conduta | 4/4 |

Evidências curtas (recalibrado = acertos), sem evidência negativa contradizendo acerto. SCA incompleto continua penalizando ausência de ECG/emergência (validado em tarefas anteriores).

---

## 7. Template para novas patologias

`_template-diagnostico.ts` (**não registrado** no `index.ts`):
- Constante `PESOS` (2/4/3/2/5/4) e blocos de `TERMOS` vazios a preencher.
- Avaliadores por card já esboçados usando os **helpers globais**.
- Contrato igual a `pac.ts`/`sca.ts` (`avaliar(ctx) → ResultadoCardRubrica[]`).
- Instruções: copiar → preencher termos/critérios → validar (testes bom/incompleto) → só então registrar no `index.ts`.

---

## 8. Testes realizados

| Teste | Resultado |
|---|---|
| Build (`npm run build`) | ✅ compila (só erro pré-existente de ECG) |
| Tipos dos arquivos alterados | ✅ sem erros |
| PAC completo (não-regressão) | ✅ 19/20, camada global OK |
| SCA bom | ✅ 19.3/20, 6 cards, Comunicação 2/2 |
| Caso **sem rubrica** (HAS/genérico) | ✅ camada global OK (sem "Nenhuma pendência" em incompleto; sem acerto-em-melhorar; sem frase genérica) |
| Escopo proibido (paciente/API/PDF/ECG/pediatria/casos/`pac.ts`) | ✅ intacto (por timestamp) |

> Testes de **conversa real** dependem da OpenAI + navegador (validação manual). Aqui validou-se a montagem dos cards com `healthBenchResult` reais (PAC e SCA).

---

## 9. O que não foi alterado

Paciente simulado, prompt do paciente, API OpenAI, modelo/temperature/max_tokens, layout, ECG, Exame Físico Adulto Visual, imagens, casos clínicos, PDF visual (continua lendo a mesma `rubricaAvaliacao`), clínica da PAC, grader/evaluator do HealthBench.

---

## 10. Como reverter

- **Camada global única:** em `feedback-view-builder.ts`, voltar a aplicar `aplicarRubricaNosCards`/`aplicarConsistenciaCards` + `normalizarExplicacaoCard` por card (e `aplicarRubricaNosCards` retornar só `cards`).
- **Comunicação SCA:** remover `avaliarComunicacaoSCA` e o card `comunicacao` do retorno em `sca.ts`.
- **Helpers/template:** remover `competencias-globais.ts` e `_template-diagnostico.ts` (não referenciados em runtime além de SCA→Comunicação).
- Regra 3.1: reverter a frase de revisão para o comportamento anterior em `consistencia-textual.ts`.

---

## 11. Próxima patologia recomendada

**Asma** (1º da ordem): copiar `_template-diagnostico.ts` → `asma.ts`, preencher termos (broncodilatador/salbutamol, corticoide, SpO₂, esforço respiratório, sibilos, pico de fluxo), validar bom/incompleto pelo checklist do relatório de arquitetura, registrar no `index.ts`. Depois: DPOC → IC → TEP → Pneumotórax → Dengue → Dor abdominal → Pediatria.

> **Nenhuma patologia nova foi ativada nesta tarefa.**
