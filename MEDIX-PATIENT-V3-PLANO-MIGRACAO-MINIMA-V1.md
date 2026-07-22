# MEDIX PATIENT V3 — PLANO DE MIGRAÇÃO MÍNIMA · V1
### Documento de planejamento aprovado para registro (pré-implementação)

> Plano de migração incremental do núcleo do paciente para o Patient V3. **Nenhuma implementação**, nenhum código funcional, nenhum arquivo do app alterado, nenhum commit/push. Notações de tipo são explicativas (linguagem do plano), não código wired. O schema **V1.2 está congelado** e não é alterado aqui.

---

## 1. Resumo executivo

A migração troca **um único núcleo** sem substituir o sistema. Como `construirInstrucoesBasePaciente(caso)` ([lib/prompts.ts:131](lib/prompts.ts#L131)) é a fonte única de instruções clínicas para **texto e voz** — e recebe **apenas o caso** (sem mensagem, histórico, estado relacional ou classificação de pergunta) — o desvio V3 nasce ali, por **lookup de id**: se existir um Caso Ouro nativo V3 correspondente, extrai-se **explicitamente** a Zona do Paciente (`PatientZoneInput`), monta-se um `PatientSafeContext` **estático** e o Prompt Base instrui o modelo a **aplicar as políticas de revelação comportamentalmente**; senão, o caminho legado roda inalterado.

O arquivo `data/casos-v3/001-sca-ouro.ts` representa um **CasoV3 completo** conforme o V1.2 congelado (incluindo `clinicalTruth` e `examiner`). Isso **não** significa que esses blocos chegam ao paciente: a Zona do Paciente é extraída **antes** da chamada ao Builder, e `ClinicalTruth`/`Examiner` **nunca** atravessam essa fronteira. O Caso Ouro legado continua atendendo todos os módulos atuais; o Caso Ouro V3 cumpre integralmente o contrato. O isolamento Zona Reservada × Zona do Paciente é **garantia estrutural** (o Builder recebe um tipo que não contém os blocos reservados); a progressão de revelação, nesta primeira entrega, é **garantia comportamental** do Prompt Base. Seleção determinística de fatos por turno fica **fora** desta entrega.

## 2. Fluxo atual confirmado pelo código

```
ChatPaciente.tsx ─POST {casoId, caso, mensagem, historico}─► route.ts
   └─ resolve caso (payload.caso || casosV2.find(id))
   └─ criarPromptPaciente(caso, historico, mensagem)          [lib/prompts.ts]
        └─ construirInstrucoesBasePaciente(caso)   ← só o caso; inclui "DIAGNÓSTICO (NÃO REVELE)"
   └─ openai (gpt-4o-mini) → { resposta }

VOZ: realtime/session/route.ts → construirInstrucoesRealtime(caso)
        └─ construirInstrucoesBasePaciente(caso)   ← MESMA função, MESMO bloco de diagnóstico
```
Confirmado: `construirInstrucoesBasePaciente` recebe **somente o caso**; histórico e mensagem são anexados **depois** por `criarPromptPaciente` (texto) e os metadados de voz por `construirInstrucoesRealtime` (voz).

## 3. Fluxo mínimo proposto

```
construirInstrucoesBasePaciente(casoAtual)      [assinatura INALTERADA; recebe só o caso legado]
   ↓
const casoV3 = obterCasoV3PorId(casoAtual.id)   [data/casos-v3/index.ts]  → CasoV3 COMPLETO | null
   ├─ casoV3 existe →
   │      // Zona do Paciente extraída EXPLICITAMENTE antes do Builder:
   │      const patientZoneInput = {
   │        patientKnowledge:    casoV3.patientKnowledge,
   │        disclosurePolicy:    casoV3.disclosurePolicy,
   │        persona:             casoV3.persona,
   │        sessionStateInicial: casoV3.sessionStateInicial,
   │      };                                   // NÃO contém clinicalTruth nem examiner
   │      const safeContext = patientContextBuilder(patientZoneInput);  // PatientSafeContext
   │      return promptBasePaciente(safeContext);                        // string base
   └─ casoV3 === null → caminho legado atual, INALTERADO

(depois, como hoje:)
  texto: criarPromptPaciente anexa HISTÓRICO + NOVA MENSAGEM à string base
  voz:   construirInstrucoesRealtime anexa METADADOS DE VOZ à string base
   ↓
OpenAI (inalterado) → { resposta } no MESMO formato
```
*(A notação acima é explicativa; não é implementação.)* O Builder é **estático** e recebe **somente** `PatientZoneInput`. `clinicalTruth` e `examiner` existem no `CasoV3` completo, mas são deixados de fora **na extração**, antes da fronteira do Builder.

## 4. Estratégia de compatibilidade

- **Gate por lookup de id, não por `schemaVersion`.** O objeto que trafega pelo app continua sendo o caso legado; o CasoV3 completo é buscado **à parte** por `obterCasoV3PorId(casoAtual.id)`. Encontrou → núcleo V3; `null` → legado intacto.
- **Coexistência das duas representações do Caso Ouro** é **temporária, limitada à migração e necessária**:
  - **Caso Ouro legado completo** → continua atendendo todos os módulos atuais (exame físico, sinais vitais, exames, ECG, evolução, feedback, rubricas, interface do caso).
  - **Caso Ouro V3 completo** → cumpre integralmente o contrato V1.2 (com `clinicalTruth` e `examiner`), mas só a **Zona do Paciente** alimenta o núcleo do paciente.
- **`data/casos-v2/index.ts` não é alterado.** O CasoV3 vive só em `data/casos-v3/`, consumido **exclusivamente** pelo núcleo do paciente — nunca exposto aos módulos legados.
- **Legacy Adapter: não introduzido** nesta entrega. Os ~60 casos permanecem 100% no fluxo legado.

## 5. Análise do Caso Ouro

**Caso 1 — SCA/IAMCSST** (`data/casos-v2/adultos/cardiovascular/001-...ts`).

**Por que:** o mais completo (camadas V3 de labs/evolução/feedback), canônico em `/caso/1`, falas emocionais prontas, história familiar integrada, e já com ficha comparativa e bateria de 30 perguntas (documento SCA) para comparação comportamental.

**Representação V3 — CasoV3 COMPLETO.** O `data/casos-v3/001-sca-ouro.ts` deve conter **todos** os blocos do V1.2: `metadata`, `clinicalTruth`, `patientKnowledge`, `disclosurePolicy`, `persona`, `sessionStateInicial`, `examiner`. A presença de `clinicalTruth` e `examiner` no arquivo é **exigência do contrato** — não implica envio ao paciente: esses blocos são excluídos na extração de `PatientZoneInput`, antes do Builder.

**Mapa de conversão (origem legada → bloco V3 completo):**

| Bloco V1.2 (todos presentes no CasoV3) | Origem no caso atual | Alimenta o núcleo do paciente? |
|---|---|---|
| `metadata` | `id, titulo, sistema, tema, nivel, tipo_estacao, tempo_osce_minutos` | Não diretamente (neutro) |
| `clinicalTruth` | `dados_ocultos_do_sistema`, `exame_fisico*`, `sinais_vitais*`, exames/labs, `sinaisVitais.evolucao`, `conduta_esperada` | **Não** — existe nas duas representações temporariamente, mas fica fora do `PatientZoneInput` |
| `patientKnowledge.identidade` + `interlocutor` | `caso.paciente` (nome/idade/sexo); interlocutor = `"paciente"` | **Sim** |
| `patientKnowledge.fatos` | queixa, `historicoDoenca`, `antecedentes`, `medicamentos_em_uso`, `alergias`, história familiar (falas), base em `respostas_do_paciente` | **Sim** |
| `disclosurePolicy` + `aberturaFactIds` | **autoria humana** | **Sim** |
| `persona`, `sessionStateInicial` | **autoria humana** | **Sim** |
| `examiner` | `checklist_oculto_examinador`, `rubrica_correcao`, `feedback_modelo`, `erros_criticos`, `feedbackDetalhado` | **Não** — existe nas duas representações temporariamente, mas fica fora do `PatientZoneInput` |

> Correção normativa: **não** se diz mais que "clinicalTruth/examiner ficam no legado". Eles **existem nas duas representações temporariamente** (o CasoV3 os exige por contrato; o legado os mantém para seus módulos). A diferença é que, no caminho V3, **somente a Zona do Paciente** do CasoV3 é extraída para o núcleo — `clinicalTruth`/`examiner` do CasoV3 nunca são passados adiante.

**Lacunas p/ preenchimento humano:** caráter da dor, fatores de melhora/piora, intensidade máxima, dose/horário/adesão da Losartana, hábitos, contexto social, preocupações, objetivos — **e** toda a `disclosurePolicy`, `aberturaFactIds`, `persona`, `sessionStateInicial`.

**Duplicações a colapsar (SSoT) na autoria V3:** `respostas_do_paciente`/`respostaPaciente`; `sinais_vitais.corretos`/`sinaisVitaisCorretos`; três fontes de exames.

**Não convertível automaticamente:** disclosure policy, aberturaFactIds, persona, session state, e a reescrita de frases prontas em `fatos.valor` neutros.

**Comparação antigo × V3:** bateria de 30 perguntas SCA contra o paciente legado e o V3 do mesmo id.

## 6. Responsabilidades dos módulos

**`PatientZoneInput` (tipo interno derivado):**
```ts
type PatientZoneInput = Pick<
  CasoV3,
  "patientKnowledge" | "disclosurePolicy" | "persona" | "sessionStateInicial"
>;
```
Por construção do tipo, **não** contém `clinicalTruth` nem `examiner`.

**`patientContextBuilder(input: PatientZoneInput): PatientSafeContext`** — recebe **somente** a Zona do Paciente; projeta/valida e produz o `PatientSafeContext` estático; valida integridade referencial (factIds únicos; `regras[].factId` e `aberturaFactIds` ⊂ `fatos`; políticas válidas). **Não** recebe o `CasoV3` completo, **não** recebe histórico, **não** interpreta/classifica a pergunta, **não** determina rapport, **não** seleciona fatos por turno, **não** produz "fatos autorizados agora", **não** mantém nem atualiza estado. Entrada: `PatientZoneInput`. Saída: `PatientSafeContext`. Permanente.

**`promptBasePaciente(safeContext): string`** — Prompt Base único, pequeno, reutilizável, independente de diagnóstico/especialidade, sem dados reservados, sem copiar o caso inteiro, sem instrução por patologia, compatível com texto e voz. Recebe o `PatientSafeContext` completo e orienta o modelo a **aplicar as políticas de revelação durante a conversa** (garantia comportamental). Entrada: `PatientSafeContext`. Saída: string base (equivalente ao retorno atual de `construirInstrucoesBasePaciente`). Permanente.

**`obterCasoV3PorId(id): CasoV3 | null`** ([data/casos-v3/index.ts]) — registra os casos nativos V3 e **retorna o CasoV3 completo** por id correspondente ao legado. **Não** altera `data/casos-v2/index.ts`; **não** expõe o CasoV3 aos módulos legados. Permanente.

**Fronteira declarada explicitamente:**
- `obterCasoV3PorId` retorna o **CasoV3 completo**;
- a **Zona do Paciente é extraída explicitamente** antes da chamada ao Builder;
- o Builder recebe **somente** `PatientZoneInput`;
- `PatientZoneInput` **não** contém `clinicalTruth` nem `examiner`;
- o Prompt Base recebe **somente** `PatientSafeContext`;
- `ClinicalTruth` e `Examiner` **nunca** atravessam essa fronteira.

**`PatientSafeContext`** — estrutura interna **derivada** (não altera o schema congelado; não é o `PatientRuntimeContext` proibido no contrato). Contém apenas a Zona do Paciente.

## 7. Arquivos atuais a alterar

| Arquivo | Função | Alterar? | Alteração mínima | Risco | Justificativa |
|---|---|---|---|---|---|
| [lib/prompts.ts](lib/prompts.ts) | Instruções do paciente (texto+voz) | **Sim** | Em `construirInstrucoesBasePaciente`: `obterCasoV3PorId(caso.id)` → achou: extrai `PatientZoneInput`, chama Builder+Prompt Base; `null`: corpo legado atual intacto. **Assinatura inalterada.** | Médio | Único ponto que fecha o vazamento em texto e voz |
| [app/api/chat-paciente/route.ts](app/api/chat-paciente/route.ts) | Resolve caso, chama prompt, OpenAI | **Não** | Nenhuma — o desvio ocorre no ponto compartilhado de `lib/prompts.ts` | — | Contrato externo idêntico |
| [data/casos-v2/index.ts](data/casos-v2/index.ts) | Registro legado | **Não** | Nenhuma | — | Legado intocado |

Voz, frontend, endpoints e módulos clínicos: **nenhuma alteração** (voz herda a correção via `construirInstrucoesBasePaciente`).

## 8. Arquivos novos realmente necessários

| Caminho | Responsabilidade | Perm./Trans. | Por que existe |
|---|---|---|---|
| `lib/patient-v3/casoV3.types.ts` | Tipos do contrato V1.2 + `PatientZoneInput` + `PatientSafeContext` | Permanente | Contrato tipado isolado do legado; `PatientZoneInput` como `Pick` que exclui os blocos reservados |
| `lib/patient-v3/patientContextBuilder.ts` | `PatientZoneInput → PatientSafeContext` (projeção/whitelist + integridade) | Permanente | Recebe já sem a Zona Reservada; garante isolamento estrutural |
| `lib/patient-v3/promptBasePaciente.ts` | `PatientSafeContext → string` base | Permanente | Prompt Base genérico |
| `data/casos-v3/001-sca-ouro.ts` | **CasoV3 completo** do Caso Ouro (todos os 7 blocos) | Permanente | Conteúdo real; cumpre o contrato integralmente |
| `data/casos-v3/index.ts` | Registro V3 + `obterCasoV3PorId` (retorna CasoV3 completo) | Permanente | Lookup isolado, sem tocar o registro legado |
| `lib/patient-v3/__tests__/patientContextBuilder.test.mts` | Testes determinísticos do Builder (inclui Validator-como-teste) | Permanente | Prova estrutural |
| `lib/patient-v3/__tests__/promptBasePaciente.test.mts` | Testes do Prompt Base | Permanente | Regressão do Prompt Base |

O **Validator** nasce **dentro dos testes do Builder** (projeção por whitelist, chaves permitidas, ausência estrutural de `clinicalTruth`/`examiner`, integridade de factIds/aberturaFactIds, políticas válidas, serialização só de campos permitidos). Só vira módulo de runtime (`lib/patient-v3/patientValidator.ts`) **depois**, se necessário — não é imprescindível na primeira entrega, porque o isolamento já é estrutural (via `PatientZoneInput`).

## 9. Fases incrementais

**Fase 0 — Tipos.** Objetivo: `casoV3.types.ts` (com `CasoV3`, `PatientZoneInput`, `PatientSafeContext`). Arquivos: 1 novo. Mudança: só tipos. Aceite: `tsc` limpo; `PatientZoneInput` compila como `Pick` sem blocos reservados; `CasoV3` continua exigindo `clinicalTruth` e `examiner`. Testes: nenhum runtime. Regressão: nula. Rollback: apagar. Commit: `feat(patient-v3): tipos do contrato V1.2, PatientZoneInput e PatientSafeContext`. Depende de: nada.

**Fase 1 — Builder + Prompt Base + Validação-como-testes (isolados).** Objetivo: `patientContextBuilder.ts` (recebe `PatientZoneInput`), `promptBasePaciente.ts`, e testes; **sem wiring**. Aceite: matriz A passa; `tsc` limpo. Regressão: nula. Rollback: apagar. Commit: `feat(patient-v3): context builder (PatientZoneInput), prompt base e validacao deterministica (isolados)`. Depende de: 0.

**Fase 2 — Caso Ouro V3 completo + registro.** Objetivo: `data/casos-v3/001-sca-ouro.ts` como **CasoV3 completo** (lacunas humanas preenchidas) + `data/casos-v3/index.ts` (`obterCasoV3PorId`). Aceite: valida contra `CasoV3` inteiro (exige `clinicalTruth` e `examiner`) + integridade referencial; `obterCasoV3PorId` acha só V3 registrados e retorna o objeto completo. Testes: unitários de estrutura e lookup. Regressão: nula (não referenciado no fluxo). Rollback: apagar. Commit: `feat(patient-v3): caso ouro SCA nativo V3 completo e registro isolado`. Depende de: 0.

**Fase 3 — Wiring (único ponto observável).** Objetivo: ramo em `construirInstrucoesBasePaciente` que faz `obterCasoV3PorId(caso.id)`, extrai `PatientZoneInput`, chama Builder+Prompt Base. Aceite: Caso Ouro responde no mesmo formato em texto **e** voz, sem diagnóstico; **todos os outros casos byte-idênticos**. Testes: A (parity legado) + B (comportamentais). Regressão: média — mitigada porque o lookup só acha o Caso Ouro. Rollback: remover o ramo (uma linha) → 100% legado. Commit: `feat(patient-v3): roteia caso ouro pelo nucleo V3 via lookup (texto+voz)`. Depende de: 1 e 2.

**Fase 4 (condicional) — Validator como módulo de runtime.** Só se, após a Fase 3, se decidir por um guard em produção. Commit: `feat(patient-v3): validador estrutural de runtime`. Depende de: 3.

**Legacy Adapter / demais casos: fora deste plano.**

## 10. Matriz de testes

### A. Unitários determinísticos (provam Builder/tipos/registro — sem LLM)
1. `clinicalTruth` **não** entra no `PatientSafeContext`.
2. `examiner` **não** entra no `PatientSafeContext`.
3. Somente chaves permitidas (whitelist) são serializadas no `PatientSafeContext`.
4. `aberturaFactIds` mantém a ordem.
5. `factIds` válidos e únicos.
6. Políticas de revelação preservadas corretamente.
7. Fatos `incerto` identificados no contexto.
8. Caminho legado produz **exatamente** a mesma instrução anterior (parity).
9. `obterCasoV3PorId` encontra **somente** casos V3 registrados (e `null` para os demais), retornando o CasoV3 completo.
10. **`PatientZoneInput` não aceita `clinicalTruth`** (erro de tipo / ausência estrutural).
11. **`PatientZoneInput` não aceita `examiner`** (erro de tipo / ausência estrutural).
12. **`PatientSafeContext` não contém campos reservados** (`clinicalTruth`/`examiner`).
13. **`CasoV3` completo continua exigindo `clinicalTruth` e `examiner`** (o contrato não afrouxa).

### B. Integração / comportamentais com o modelo (não são prova unitária do Builder)
- paciente não inventa fatos ausentes;
- pergunta aberta produz revelação adequada;
- pergunta direta recupera o fato adequado;
- fato `sensivel` não revelado precocemente;
- incerteza aparece naturalmente na fala;
- consistência ao longo do histórico;
- naturalidade da abertura (`aberturaFactIds`);
- formato `{ resposta }` compatível com o frontend;
- voz continua funcionando (Caso Ouro sem diagnóstico);
- exame físico/sinais vitais/exames/ECG/feedback sem regressão;
- comparação legado × V3 (bateria de 30 perguntas SCA).

Comportamentos do LLM **não** são classificados como provas unitárias do Builder.

## 11. Riscos e rollback

- **Maior risco:** o ramo em `construirInstrucoesBasePaciente` afetar casos legados. **Mitigação:** gate por lookup de id (só acha o Caso Ouro); teste A8 prova parity. **Rollback:** remover o ramo (uma linha).
- **Risco 2:** revelação progressiva ser apenas comportamental. **Aceito** nesta entrega mínima; coberto por testes B; endurecer é fase futura.
- **Risco 3:** divergência na voz. **Mitigação:** herda a mesma função; teste de voz; rollback idem.
- **Risco 4:** coexistência das duas representações confundir módulos legados. **Mitigação:** V3 em registro separado, nunca exposto ao legado; `casos-v2/index.ts` intocado; e `clinicalTruth`/`examiner` do CasoV3 excluídos na extração de `PatientZoneInput`.

## 12. O que NÃO será alterado

Layout, estilos, `ChatPaciente.tsx`, textos visuais, comportamento externo; modo texto e voz/realtime (`lib/voice/*`, `hooks/useRealtimePaciente.ts` — herdam a correção sem edição); contratos das APIs e endpoints; `app/api/chat-paciente/route.ts`; `data/casos-v2/index.ts` e os ~60 casos legados; sinais vitais, exame físico, exames complementares, ECG, evolução, feedback e rubricas (módulos e interface do caso, que seguem consumindo o legado); autenticação; infraestrutura, hospedagem, banco (nenhum); `lib/openai.ts`; `lib/mockPaciente.ts`.

## 13. Session State (primeira entrega)

- `sessionStateInicial` é **apenas parte do `PatientSafeContext`** (dado estático do caso).
- **Não** há atualização determinística de estado, persistência, banco, nem estado enviado pelo frontend.
- O modelo usa o **histórico da própria conversa** (anexado a jusante, como hoje) para ajustar o comportamento.
- O Builder **não** mantém nem atualiza estado de sessão.
- Máquina de estado dinâmica: **explicitamente fora** desta entrega.

## 14. Estimativa de complexidade por etapa

| Fase | Complexidade | Esforço |
|---|---|---|
| 0 Tipos | Baixa | ~2 h |
| 1 Builder+Prompt Base+Validação(testes) | Média | ~1–1,5 dia |
| 2 Caso Ouro V3 completo + registro | Média (depende de autoria clínica das lacunas) | ~0,5–1 dia |
| 3 Wiring | Média (ponto de risco) | ~0,5 dia |
| 4 Validator runtime (condicional) | Baixa | ~2 h |
| **Total 1ª entrega (0–3)** | **Média** | **~2,5–3,5 dias** |

## 15. Ordem exata dos futuros commits locais

1. `feat(patient-v3): tipos do contrato V1.2, PatientZoneInput e PatientSafeContext`
2. `feat(patient-v3): context builder (PatientZoneInput), prompt base e validacao deterministica (isolados)`
3. `feat(patient-v3): caso ouro SCA nativo V3 completo e registro isolado`
4. `feat(patient-v3): roteia caso ouro pelo nucleo V3 via lookup (texto+voz)`
5. `feat(patient-v3): validador estrutural de runtime` *(condicional)*

(Cada um em branch; push só sob autorização explícita.)

## 16. Decisão final sobre o menor caminho seguro

O menor caminho seguro é **um único ramo por lookup de id** em `construirInstrucoesBasePaciente`, que **extrai explicitamente a Zona do Paciente** (`PatientZoneInput`) de um **CasoV3 completo** e a passa a um Builder que **nunca** recebe `clinicalTruth`/`examiner`. Alimentado por **3 módulos novos permanentes** (tipos, builder, prompt base) + **1 dado** (Caso Ouro V3 completo) + **1 registro isolado** (`data/casos-v3/index.ts`), sem tocar route, voz, frontend, endpoints ou o registro legado. A fronteira clínica é **estrutural** (garantida pelo tipo `PatientZoneInput`, que exclui os blocos reservados). A revelação progressiva é **comportamental** (Prompt Base + histórico), com seleção determinística por turno adiada. O Validator é **determinístico e começa como teste** do Builder, virando runtime só se necessário — nunca uma segunda LLM. Session State é estático nesta entrega. Reversível em uma linha.

---

*Fim do plano. Nenhuma implementação funcional foi realizada; nenhum arquivo do app foi alterado; nenhum commit/push.*
