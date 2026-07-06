# Relatório Técnico — Arquitetura do Feedback Geral OSCE

**Data:** 28 de junho de 2026
**Natureza:** Análise (read-only). **Nenhum código funcional foi alterado.**
**Escopo:** Feedback OSCE, HealthBench, rubricas por diagnóstico, cards, normalização e PDF.

---

## 1. Resumo executivo

- O feedback nasce de **um grader de IA (HealthBench)** que avalia critérios sobre o transcript e produz `grades` (critério → `criteria_met`, `points`, `tags`, `explanation`).
- O **ViewModel dos 6 cards** é montado no **cliente** por `construirFeedbackViewDeHealthBench` (`lib/healthbench/feedback-view-builder.ts`): particiona as grades em 6 cards (pesos fixos), **nota = soma dos cards**.
- Sobre os cards do grader aplica-se **uma de duas camadas**:
  - **Rubrica específica** do diagnóstico (PAC, SCA) — quando existe — que **recalibra deterministicamente** os cards cobertos;
  - **Camada de consistência genérica** — para os demais casos.
- Em ambos os caminhos, há **normalização textual final** (`normalizarExplicacaoCard`): remove contradições, garante "o que faltou" quando < máximo, marca "Nenhuma pendência" quando completo.
- A **PAC é o modelo aprovado**: cobre os 6 cards com critérios clínicos determinísticos + lógica de consistência. **SCA** é o segundo diagnóstico modular.
- **Principal conflito histórico (já mitigado):** o texto/evidências do grader contradiziam os acertos da rubrica. Resolvido por: cards recalibrados usam os próprios acertos como evidências.

---

## 2. Arquivos analisados

| Arquivo | Papel |
|---|---|
| `app/api/osce/finalizar/route.ts` | Finaliza atendimento; chama `evaluateHealthBenchAttempt` (source of truth) + legado |
| `lib/healthbench/evaluator.ts` | Orquestra avaliação: transcript → rubric → grades → score/feedback |
| `lib/healthbench/grader.ts` | Grader IA por critério (`criteria_met`) |
| `lib/healthbench/transcript-normalizer.ts` | Converte chat/exames/exame físico em transcript |
| `lib/healthbench/rubric-adapter.ts` | Identifica diagnóstico e monta a rubrica de critérios |
| `lib/healthbench/diagnosis-microcriteria.ts` | Banco de microcritérios por diagnóstico (34+) |
| `lib/healthbench/cards-config.ts` | 6 cards: nome, axis, **pesoVisual** (2/4/3/2/5/4) |
| `lib/healthbench/feedback-view-builder.ts` | Monta os 6 cards (nota = soma); seleciona/ aplica rubrica específica |
| `lib/healthbench/feedback-consistency.ts` | Consistência genérica + avaliadores PAC (anamnese/exames/raciocínio/conduta) |
| `lib/healthbench/rubricas-diagnosticos/` | Arquitetura modular: `tipos`, `utils-deteccao`, `pac`, `sca`, `consistencia-textual`, `index` |
| `components/FeedbackOSCE.tsx` | Renderiza os cards (acertos / o que faltou / evidências / como recuperar) |
| `lib/pdf/exportar-feedback-atendimento.ts` | PDF (lê `rubricaAvaliacao`) |
| `app/caso/[id]/page.tsx` | Finaliza, monta o contexto e chama o view-builder |

---

## 3. Fluxo atual do feedback

1. **Finalização:** `app/caso/[id]/page.tsx` envia `POST /api/osce/finalizar` com `chatMessages`, `physicalExamEvents`, `vitalSignsEvents`, `examRequests`, `diagnosisAndPlan`, `soap`.
2. **Avaliação:** `finalizar/route.ts` → `evaluateHealthBenchAttempt(input, caso)` (+ legado em paralelo). HealthBench é **source of truth**.
3. **Transcrição:** `transcript-normalizer` consolida chat + exame físico + sinais vitais + exames em um transcript textual.
4. **Grades:** `evaluator` monta a rubrica (`rubric-adapter` + `diagnosis-microcriteria`) e o `grader` (IA) decide `criteria_met` por critério.
5. **Retorno:** a rota devolve `healthBenchResult` (grades, score técnico, professorFeedback) **cru** — não monta cards.
6. **Cards (cliente):** `page.tsx` chama `construirFeedbackViewDeHealthBench(hb, caso, ctx)`:
   - `montarRubrica(hb)` particiona cada grade em **um** card (`resolverAxisDoCard`), calcula `scoreCard × peso`, **nota = soma**.
   - `obterRubricaPorDiagnostico(diag, casoId)`: se houver rubrica específica → `aplicarRubricaNosCards` (recalibra cards cobertos); senão → `aplicarConsistenciaCards` (genérico).
   - `normalizarExplicacaoCard` em todos os cards.
7. **Tela:** `FeedbackOSCE.tsx` exibe nota + 6 cards.
8. **PDF:** `exportar-feedback-atendimento.ts` exporta os **mesmos** cards (`rubricaAvaliacao`).

**Respostas diretas:**
- **Rota que finaliza:** `POST /api/osce/finalizar`.
- **Dados que entram:** chat completo (aluno+paciente), exame físico (eventos/visual), sinais vitais, exames, diagnóstico/diferenciais/conduta e SOAP.
- **Usa chat, exames, exame físico, conduta e SOAP?** Sim — via transcript (grader) e via `ctx` textual (rubricas: `anamneseTexto`, `correlacaoTexto`, `examesTexto`, `condutaTexto`, `achadosTexto`, `sinaisVitais`).
- **Do HealthBench:** as grades (critérios cumpridos/não) e o feedback-resumo.
- **Das rubricas específicas:** pontos/acertos/melhorias determinísticos dos cards cobertos.
- **Calculado "manualmente":** nota = soma dos cards; recalibrações PAC/SCA; consistência.
- **Herdado do legado:** rodado em paralelo só para comparação (`compareLegacyVsHealthBench`); **não** alimenta a tela quando há HealthBench.

---

## 4. O que é genérico hoje

- **`montarRubrica`** (particiona grades, calcula pontos, nota = soma) — comum a todos.
- **`aplicarConsistenciaCards`** (`feedback-consistency.ts`) — usado **só quando não há rubrica específica**: consistência de sinais vitais no Exame físico; (para pneumonia genérica não-mapeada por caso, há helpers, mas o caminho principal de PAC é a rubrica).
- **`normalizarExplicacaoCard`** (`consistencia-textual.ts`) — global: remove evidências contraditórias; card recalibrado usa acertos como evidências; "Nenhuma pendência identificada." quando completo.
- **`sugestaoRecuperarPontos`** (`FeedbackOSCE.tsx`) — texto base por competência, **usado só como fallback**; o "Como recuperar" prioriza as melhorias do card.
- **Fallback de melhorias** no componente quando vazio.

---

## 5. O que é específico da PAC

Arquivos: `lib/healthbench/rubricas-diagnosticos/pac.ts` (+ avaliadores em `feedback-consistency.ts`).

| Card | Onde | Critérios/pesos |
|---|---|---|
| Comunicação (2) | `pac.ts:avaliarComunicacaoPAC` | apresentação/acolhimento 0.5 · **explica hipótese (infecção pulmonar/pneumonia) 0.5** · tratamento/reavaliação 0.5 · sinais de alarme 0.5 |
| Exame físico (3) | `pac.ts:avaliarExameFisicoPAC` | sinais vitais+SpO₂ 0.6 · avaliação geral/gravidade 0.5 · ausculta ant.+post. 0.7 · consolidação 0.6 · manobras 0.4 · perfusão 0.2 (fecha 3/3 se 1–5) |
| Anamnese (4) | `feedback-consistency.ts:avaliarAnamnesePAC` | queixa 0.6 · febre 0.5 · tosse/escarro 0.7 · dispneia/dor 0.6 · sistêmicos 0.4 · comorbidades 0.5 · epidemiologia 0.4 · alergias 0.3 |
| Exames (2) | `avaliarExamesPAC` | RX 1.0 · hemograma 0.4 · SpO₂ 0.3 · estratificação 0.2 · interpretação 0.1 |
| Raciocínio (5) | `avaliarRaciocinioPAC` | hipótese 1.2 · sintomas 0.8 · exame 0.9 · exames/imagem 0.8 · diferenciais 0.7 · gravidade 0.6 |
| Conduta (4) | `avaliarCondutaPAC` | antibiótico 3.0 · duração 0.2 · suporte 0.2 · alarme 0.2 · gravidade 0.2 · dose 0.2 |

**Melhor que o genérico:** reconhece RX **solicitado OU visualizado** (Open-i); SpO₂ no objeto de sinais vitais; tosse/escarro perguntados; diferencial (TB) verbalizado; correlação clínica no diálogo; conduta por parsing textual tolerante a grafia.

---

## 6. PAC como modelo de referência

- **O que ficou bom:** os 6 cards têm critérios objetivos, rastreáveis e tolerantes (texto livre do diálogo); sem contradição evidência×acerto; fechamento de pontuação quando os critérios são cumpridos; "Como recuperar" derivado do que faltou.
- **Cards ajustados:** todos os 6.
- **Regras de consistência criadas:** `removerEvidenciasContraditorias`, `normalizarExplicacaoCard`, fechamento automático (exame físico 1–5 → 3/3), detecção "solicitado/visualizado/interpretado".
- **Reaproveitável (vira global):** ver §10.
- **Permanece específico:** os termos clínicos (RX, antibiótico, ausculta de consolidação, diferenciais infecciosos) — ver §11.

> Princípio: **copiar a lógica, não a clínica.** Ex.: não levar "RX de tórax" a todos; levar "exame solicitado/visualizado/interpretado conta como cumprido".

---

## 7. Problemas atuais do feedback geral

| Risco | Estado |
|---|---|
| "Nenhuma pendência" em card incompleto | ✅ resolvido (PAC/SCA + normalização) — **risco residual em casos sem rubrica** |
| Evidência contraditória ao acerto | ✅ resolvido p/ cards recalibrados; nos genéricos, filtro cobre os 4 casos principais |
| "Como recuperar" genérico | ✅ derivado das melhorias; fallback genérico ainda existe p/ casos sem rubrica |
| Nota incoerente com acertos | ✅ nota = soma; piso quando acerto+0 |
| Texto antigo do HealthBench em conflito | ✅ cards recalibrados ignoram explanation do grader |
| PDF ≠ tela | ✅ mesma fonte (`rubricaAvaliacao`) |
| Rubrica sobrescrita por genérico | ✅ rubrica tem precedência quando existe |
| Acertos/melhorias duplicados | ✅ `dedup` |
| Prolixidade | ✅ evidências curtas (cards recalibrados) |
| Perder ponto por campo formal vazio apesar de verbalizar | ✅ na PAC/SCA (lê diálogo); **❌ ainda ocorre em casos só com grader** |

**Conclusão:** a qualidade alta existe **onde há rubrica específica (PAC, SCA)**. Casos sem rubrica dependem do grader + consistência genérica, onde os riscos acima são apenas parcialmente mitigados.

---

## 8. Papel do HealthBench

- **Avaliador principal** (source of truth) para casos **sem** rubrica específica; **complementar/base** quando há rubrica (a rubrica recalibra os cards cobertos).
- Ele **não monta os cards finais** — gera grades + texto; os cards são montados no view-builder.
- **Conflito:** o `explanation`/`professorFeedback` do grader pode contradizer a rubrica → **mitigado** porque cards recalibrados usam os próprios acertos como evidências (o texto do grader não vaza nesses cards).
- **Uso seguro recomendado:**
  1. Manter HealthBench para **análise ampla** e para cards sem rubrica;
  2. Usar **rubricas estruturadas** para a pontuação dos diagnósticos prioritários;
  3. Manter **normalização final** removendo contradições;
  4. **Nunca** deixar texto solto do grader sobrescrever critério objetivo de rubrica.

---

## 9. Estrutura dos cards (onde cada coisa acontece)

| Elemento | Local |
|---|---|
| Pontuação base (grader) | `feedback-view-builder.ts:montarRubrica` (scoreCard × peso) |
| Pontuação recalibrada (PAC/SCA) | `pac.ts` / `sca.ts` (avaliar*) → `aplicarRubricaNosCards` |
| Acertos | rubrica específica (cobertos) ou grades positivas cumpridas (genérico) |
| Melhorias | rubrica específica ou grades positivas não cumpridas + erros críticos |
| Evidências | recalibrado = acertos; genérico = `explanation` do grader filtrado |
| "Como recuperar" | `FeedbackOSCE.tsx` — melhorias do card; fallback `sugestaoRecuperarPontos` |
| Render tela | `components/FeedbackOSCE.tsx` |
| Export PDF | `lib/pdf/exportar-feedback-atendimento.ts` (mesma `rubricaAvaliacao`) |

Pesos fixos (`cards-config.ts`): Comunicação 2 · Anamnese 4 · Exame físico 3 · Exames 2 · Raciocínio 5 · Conduta 4 = **20**.

---

## 10. Regras globais que devem ser reaproveitadas

Estas já estão **implementadas para PAC/SCA** e devem ser garantidas para **todos** os diagnósticos:

1. Card abaixo do máximo **nunca** diz "Nenhuma pendência identificada".
2. Nenhum acerto contradito por evidência negativa.
3. "Como recuperar" derivado do critério faltante (não genérico).
4. Evidências curtas e objetivas.
5. Pontuação rastreável por critério.
6. Item cumprido não aparece em "Melhorar" (dedup por núcleo).
7. Exame **solicitado, visualizado ou interpretado** = cumprido (não cobrar como ausente).
8. SpO₂/sinais vitais no objeto = não negar saturação.
9. Diferencial **verbalizado no diálogo** conta, mesmo sem campo formal.
10. Raciocínio **verbalizado no chat** conta, mesmo sem SOAP formal.
11. Nota = soma dos cards; sem acerto+0 sem penalidade.
12. PDF = mesma fonte da tela.

> **Recomendação:** extrair 1–6, 11 e a consistência textual para uma **camada global** aplicada a **qualquer** card (inclusive casos só-grader), não apenas aos recalibrados.

---

## 11. O que deve continuar específico por diagnóstico

Apenas os **termos clínicos** de cada doença:

| Diagnóstico | Específico |
|---|---|
| PAC | RX de tórax, hemograma/leucograma, antibiótico, ausculta de consolidação, diferenciais infecciosos |
| SCA | ECG/troponina, AAS/antiagregação, nitrato, anticoagulação, dor torácica típica, fatores de risco CV |
| Asma | broncodilatador, corticoide, SpO₂, esforço respiratório, sibilos, pico de fluxo |
| DPOC exacerbado | broncodilatador, corticoide, O₂ controlado, tabagismo, gasometria |
| IC | diurético, BNP, turgência/edema/crepitações, ecocardiograma |
| TEP | risco tromboembólico, D-dímero/angioTC, dispneia súbita, dor pleurítica |
| Pneumotórax | RX/TC, MV abolido, hipertimpanismo, drenagem |
| Dengue | prova do laço, hematócrito/plaquetas, sinais de alarme, hidratação |
| Dor abdominal | localização, Blumberg/Murphy, amilase/lipase, USG/TC |
| Pediatria | faixa etária, responsável, hidratação, sinais de gravidade pediátricos |

---

## 12. Arquitetura recomendada para próximos diagnósticos

Três camadas (a base já existe em `rubricas-diagnosticos/`):

**12.1 Camada global de consistência** (regras §10) — aplicar a todo card, todo diagnóstico, **inclusive casos só-grader**. Hoje vive em `consistencia-textual.ts` + `feedback-consistency.ts` (parcial). Recomenda-se garantir que o caminho genérico também passe por ela integralmente.

**12.2 Camada global por competência** — padrões comuns por card (ex.: Comunicação sempre valoriza apresentação + explicação acessível + sinais de alarme; Exames sempre aceita "solicitado/visualizado/interpretado"; Raciocínio sempre lê diálogo). Hoje implícita dentro de cada `avaliar*`; poderia ser fatorada em helpers reutilizáveis por competência.

**12.3 Camada específica por diagnóstico** — um arquivo por doença (`asma.ts`, `dpoc.ts`, …) seguindo o molde de `pac.ts`/`sca.ts`, definindo só os termos clínicos e pesos; registrado no `index.ts` (`obterRubricaPorDiagnostico`).

Cada novo diagnóstico = 1 arquivo + 1 linha no registro. A consistência e o padrão de cards vêm "de graça" das camadas globais.

---

## 13. Riscos

- **Casos sem rubrica específica** ainda dependem do grader + consistência parcial (qualidade inferior à PAC).
- **Fatorar camadas globais** pode mexer no caminho genérico → risco de regressão em ~32 diagnósticos só-grader; exige testes de não-regressão.
- **Comunicação determinística** (PAC) é por termos — pode subavaliar linguagem acolhedora atípica; ampliar para outros diagnósticos exige cuidado.
- **Dependência de `ctx` textual** bem montado em `page.tsx` (anamneseTexto/correlacaoTexto/etc.) — novos canais (ex.: ECG interpretado) precisam entrar no contexto.
- **Grader IA é não-determinístico** — a rubrica específica reduz, mas casos só-grader variam.

---

## 14. Ordem segura de implementação

1. **Consolidar camada global de consistência** dos cards (aplicar a todo caminho, inclusive genérico).
2. **Padronizar geração de evidências curtas** (estender a regra "evidências = acertos/positivos" a todos os cards).
3. **Garantir tela = PDF** (já ok; manter como invariante testada).
4. **Congelar PAC** como referência (snapshot de teste).
5. **SCA** já implementado — validar bom/incompleto end-to-end.
6. **Testar SCA** (bom e incompleto) no navegador.
7. **Expandir** para Asma → DPOC → IC → TEP (1 arquivo cada), reusando camadas globais.

---

## 15. Checklist de validação para novos diagnósticos

1. A nota fecha corretamente (soma dos cards = nota)?
2. Todo ponto perdido tem critério faltante explícito?
3. Nenhum acerto é contradito por evidência?
4. "Como recuperar" é específico do critério faltante?
5. O PDF bate com a tela?
6. Raciocínio verbalizado no chat foi considerado (sem exigir SOAP formal)?
7. Exames visualizados/solicitados/interpretados foram contados?
8. Sinais vitais/SpO₂ reconhecidos quando presentes?
9. Conduta avaliada por critérios objetivos (não por frase exata)?
10. Feedback curto, útil e sem prolixidade/duplicatas?
11. Card completo mostra "Nenhuma pendência identificada"?
12. Não há regressão nos diagnósticos já validados (PAC, SCA)?

---

## 16. Conclusão

O feedback é montado em duas etapas: **grader HealthBench** (critérios sobre o transcript) → **view-builder no cliente** (6 cards, nota = soma) com **rubrica específica** (PAC/SCA) recalibrando os cards cobertos e **normalização textual** garantindo coerência. A **PAC** atingiu alta qualidade porque cobre os 6 cards com critérios objetivos, lê o diálogo (não só campos formais) e elimina contradições. Para levar essa qualidade ao geral, a recomendação é **promover as regras de consistência da PAC a uma camada global** (aplicável inclusive a casos só-grader), **fatorar padrões por competência**, e **manter apenas os termos clínicos como camada específica por diagnóstico** — expandindo um arquivo por doença no padrão `pac.ts`/`sca.ts`.

**Próxima etapa sugerida:** consolidar a camada global de consistência (Etapa 1) e validar SCA end-to-end, antes de adicionar Asma.

> **Nenhum código foi alterado nesta tarefa.** Relatório apenas.
