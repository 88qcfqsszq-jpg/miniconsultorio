# Dependência do Legado no Feedback Visual — Auditoria de Campos

_Data: 2026-07-03 · Somente-leitura. Nenhum arquivo alterado._

## Descoberta central

O feedback visual é montado por **TRÊS geradores independentes**, e — no caminho normal — **o legado NÃO alimenta a tela**:

| Gerador | Endpoint / arquivo | Papel |
|---|---|---|
| **HealthBench** | `/api/osce/finalizar` → `evaluator.ts` → `construirFeedbackViewDeHealthBench` | **Nota + cards + erros críticos + plano (nextTrainingFocus)** |
| **Legado (examinador)** | `/api/corrigir` → `criarPromptExaminador` | Roda em paralelo, mas é **ignorado visualmente**; só assume no **fallback total** |
| **Estudo Final** | `/api/estudo-final-caso` (buscado pelo próprio `FeedbackOSCE.tsx`, useEffect linha 139) | **Mini-aula: resposta modelo, checklist nota máxima, erros críticos didáticos, seções** |

Prova no código: `app/caso/[id]/page.tsx` linha **469** — `// legacyCorrectionResult é IGNORADO visualmente (fallback técnico silencioso)` → `setFeedback(feedbackView)` (só HealthBench). O legado só chega à tela no bloco de fallback (linha ~544: `// Fallback legado: … só chega aqui se /api/osce/finalizar / HealthBench falhar`).

---

## Respostas objetivas

### 1. A nota exibida vem de qual motor?
**HealthBench.** `construirFeedbackViewDeHealthBench` (feedback-view-builder.ts) calcula `nota = soma dos 6 cards` (linha 214-215), derivada das `grades` do grader HealthBench + camada de consistência. `notaFinal` bruto do HealthBench vira auditoria. O legado só define a nota **se o HealthBench falhar inteiro** (fallback).

### 2. Os cards avaliativos vêm de qual motor?
**HealthBench.** `rubricaAvaliacao` = `montarRubrica(hb)` (particiona as grades nos 6 cards) → recalibrado por `aplicarRubricaNosCards` (rubrica determinística do diagnóstico: PAC/SCA) **ou** `aplicarConsistenciaCards` (genérico) → `aplicarConsistenciaGlobalCards`. Ou seja: **grades do HealthBench + camada de consistência determinística** (`feedback-consistency.ts` / `rubricas-diagnosticos/`). O legado **não** participa no caminho normal.

### 3. Os textos de "resposta modelo" vêm de qual motor?
**De NENHUM dos dois motores de nota — vêm do `/api/estudo-final-caso`.** No view do HealthBench, `respostaModeloOSCE = ""` (feedback-view-builder linha 280). A UI exibe `estudoFinal.respostaModelo` (FeedbackOSCE.tsx linha 698), buscado à parte. O legado gera um `respostaModeloOSCE`, mas ele é ignorado (só existiria no fallback).

### 4. O SOAP ideal vem de qual motor?
**De nenhum, na prática.** O view HealthBench devolve `soap: { subjetivo:"", objetivo:"", avaliacao:"", plano:"", comentarioGeral:"" }` (vazio, linha 279). A UI principal (`FeedbackOSCE.tsx`) **não renderiza** um "SOAP ideal" (só há o tipo `soap?: any`). O legado gera um objeto `soap`, porém ignorado no caminho normal. → **SOAP ideal hoje é vazio/não exibido.**

### 5. O plano de estudo vem de qual motor?
**Duas fontes, ambas ≠ legado:**
- `feedback.planoDeEstudo = hb.nextTrainingFocus` (**HealthBench**) — os focos de treino (ex.: ["Conduta","Anamnese","Conduta e Segurança"]).
- O bloco de estudo detalhado (seções, checklist nota máxima, resumo do especialista) vem do **`/api/estudo-final-caso`** (`estudoFinal.secoes`, `estudoFinal.checklistNotaMaxima`).
O legado tem seu próprio `planoDeEstudo`, **ignorado** no caminho normal.

### 6. O legado está preenchendo lacunas narrativas?
**Não, no caminho normal.** As lacunas narrativas (resposta modelo, mini-aula, checklist, erros didáticos) são preenchidas pelo **`/api/estudo-final-caso`**, não pelo legado. O legado (`/api/corrigir`) roda em paralelo (`Promise.allSettled` em `/api/osce/finalizar`) e é **descartado visualmente** (page.tsx linha 469). Ele **só** preenche a tela inteira no **fallback total** (quando o HealthBench falha por completo).

### 7. Se desligarmos o legado, quais campos ficam piores ou vazios?
**No caminho feliz (HealthBench ok): NENHUM campo piora** — o legado já é ignorado. Ganha-se: menos custo/latência de OpenAI e fim da divergência de nota (ex.: PAC 18 × 11.8).
**Perde-se apenas a REDE DE SEGURANÇA:** se o HealthBench falhar inteiro, hoje o legado assume e preenche **tudo** (nota, cards, resposta modelo, soap, plano). Sem o legado, esse cenário de falha ficaria **sem feedback de nota/cards** (a mini-aula do `/api/estudo-final-caso` ainda funcionaria, mas nota/competências/erros críticos ficariam ausentes).
→ Campos que ficam vazios **somente no cenário de falha do HealthBench**: `nota`, `rubricaAvaliacao`, `errosCriticos`, `justificativaNota`, `classificacao`.

### 8. Quais partes do legado preservar como "gerador narrativo"?
- **Preservar prioritariamente o `/api/estudo-final-caso`** — é o verdadeiro gerador narrativo já em uso (resposta modelo, checklist nota máxima, seções, erros críticos didáticos). Não é "legado": é a peça narrativa ativa.
- Do **`/api/corrigir` (legado)**: preservar apenas a **capacidade generativa de texto** do `criarPromptExaminador` — `respostaModeloOSCE`, `soap` ideal e os comentários narrativos por competência (anamnese/exameFisico/raciocinio/conduta) — **desacoplada da nota**, como possível fallback narrativo ou fonte extra de "resposta modelo/SOAP ideal" (campos que hoje ficam vazios).

### 9. Quais partes NÃO devem mais influenciar a nota?
- Toda a **pontuação do legado**: `normalizarRubricaAvaliacao`, `calcularNotaDaRubrica`, `classificarNota` e o próprio `rubricaAvaliacao`/`nota` de `/api/corrigir`. Já não influenciam o caminho normal, mas **rodam a cada atendimento** e produzem a nota divergente registrada em `comparison`. Devem deixar de ser executadas em paralelo (apenas fallback de emergência), pois **a nota é competência exclusiva do HealthBench**.
- A **nota pediátrica aleatória** (`/api/corrigir`: `12 + Math.random()*8`) — nunca deveria influenciar avaliação.

---

## Mapa final: campo da tela → fonte

| Campo visual (FeedbackOSCE) | Fonte real | Legado influencia? |
|---|---|---|
| Nota (X/20) | HealthBench (soma dos cards) | Só no fallback total |
| Classificação / percentual | HealthBench (derivado da nota) | Só no fallback |
| 6 cards (acertos/melhorias/pontos) | HealthBench grades + consistência determinística | Só no fallback |
| Erros críticos (nota) | HealthBench (`criticalErrors`) | Só no fallback |
| Justificativa da nota | HealthBench (`resumoCurto(hb)`) | Só no fallback |
| Plano de estudo (focos) | HealthBench (`nextTrainingFocus`) | Não |
| Resposta modelo | **`/api/estudo-final-caso`** | Não |
| Checklist nota máxima / seções / mini-aula | **`/api/estudo-final-caso`** | Não |
| Erros críticos (didáticos) | **`/api/estudo-final-caso`** | Não |
| SOAP ideal | Vazio (não exibido) | — |

**Conclusão:** o legado **não sustenta nenhum campo visual no caminho normal** — serve como **fallback total** de emergência e gera uma nota paralela (divergente) que hoje só entra no `comparison`. O gerador narrativo real e preservável é o **`/api/estudo-final-caso`**. Desligar o legado é seguro para o caminho feliz, desde que se mantenha uma estratégia de fallback (ou se aceite exibir erro quando o HealthBench falhar).
