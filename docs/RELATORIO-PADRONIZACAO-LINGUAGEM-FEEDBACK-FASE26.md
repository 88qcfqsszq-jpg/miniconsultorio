# Relatório — Padronização da linguagem do Feedback OSCE (Fase 26)

_Mudança **apenas de linguagem/normalização textual**. NÃO altera nota, pesos, HealthBench scoring, rubrica clínica, lógica de correção, StudentTrace, Gold Standard, Professor IA, OSCE ou rotas._

## Problema
Os cards de competência misturavam tempos verbais: itens em **"Melhorar"** apareciam no passado (ex.: "Solicitou NS1 e hemograma"), sugerindo que o aluno fez a ação, quando o sistema quer dizer o que ele **deveria** fazer.

## Regra padronizada
- **ACERTOS** → passado (o que o aluno realmente fez): "Investigou febre.", "Mediu sinais vitais completos."
- **MELHORAR** → infinitivo (o que deve fazer na próxima vez): "Solicitar NS1 e hemograma.", "Avaliar hidratação e perfusão."

## Arquivos criados
- `lib/feedback/normalizeFeedbackText.ts` — `normalizeFeedbackText(item, tipo)` + `normalizeFeedbackList(itens, tipo)`.

## Arquivos alterados
- `lib/healthbench/feedback-view-builder.ts` — **ponto único**: no retorno de cada card de competência, `acertos` passa por `normalizeFeedbackList(…, "acerto")` e `melhorias` por `normalizeFeedbackList(…, "melhorar")`. Como o `FeedbackOSCE` (view model) é montado aqui e reutilizado pela tela, pelo PDF e pelo Professor IA, a normalização se propaga a todos.

## Função criada
`normalizeFeedbackText(item, tipo)`:
- **Conjuga apenas o 1º termo (verbo)** — o restante da frase é preservado (sem alterar sentido clínico).
- `tipo="acerto"` → infinitivo→passado (`-ar→-ou`, `-er→-eu`, `-ir→-iu` + irregulares `fazer→fez`, `medir→mediu`…). Itens já no passado são preservados (idempotente).
- `tipo="melhorar"` → passado→infinitivo (`-ou→-ar`, `-eu→-er`, `-iu→-ir` + irregulares). Itens já no infinitivo são preservados.
- **Reescritas específicas** (rótulos de rubrica que não começam com verbo simples): "Teste do Laço — Execução correta" → "Executar corretamente o teste do laço."; "Conduta — Hidratação, sem AINE, sinais de alarme" → "Orientar hidratação adequada, evitar AINE/AAS e explicar sinais de alarme com retorno imediato."
- Garante ponto final; não converte substantivos (só age em terminações verbais).

## Exemplos antes/depois (verificado por script)
**ACERTOS (passado):**
- "Investigar febre" → "Investigou febre." · "Solicitar hemograma" → "Solicitou hemograma." · "Realizar teste do laço" → "Realizou teste do laço." · "Mediu sinais vitais completos" → mantido.

**MELHORAR (infinitivo):**
| Antes | Depois |
|---|---|
| Solicitou NS1 e hemograma | **Solicitar** NS1 e hemograma. |
| Realizou teste do laço | **Realizar** teste do laço. |
| Explicou os sinais de alarme de forma clara | **Explicar** os sinais de alarme de forma clara. |
| Avaliou hidratação e perfusão | **Avaliar** hidratação e perfusão. |
| Mediu sinais vitais | **Medir** sinais vitais. |
| Orientou hidratação | **Orientar** hidratação. |
| Reconheceu dengue | **Reconhecer** dengue. |
| Prescreveu antibiótico | **Prescrever** antibiótico. |
| Teste do Laço — Execução correta | **Executar corretamente o teste do laço.** |
| Conduta — Hidratação, sem AINE, sinais de alarme | **Orientar hidratação adequada, evitar AINE/AAS e explicar sinais de alarme com retorno imediato.** |

Itens já no infinitivo ("Solicitar NS1 e hemograma") são preservados.

## Validação (caso Dengue e geral)
- ✅ Em **Acertos** ("O que foi reconhecido"), os verbos aparecem no **passado**.
- ✅ Em **Melhorar** ("O que faltou para fechar a pontuação"), os verbos aparecem no **infinitivo**.
- ✅ **Nenhum** item de "Melhorar" começa com `Solicitou / Realizou / Explicou / Avaliou / Mediu / Orientou / Reconheceu / Prescreveu` (confirmado por teste automatizado).
- ✅ `tsc --noEmit` limpo (fora dos erros pré-existentes do `ecgGenerator`).

## Onde aparece
Tela do feedback (ambos os blocos de render usam `competencia.acertos`/`melhorias`), PDF exportado e contexto do Professor IA — todos consomem o mesmo `feedback` já normalizado no view-builder.

## Títulos (Tarefa 5)
Os títulos exibidos foram **mantidos** ("O que foi reconhecido" / "O que faltou para fechar a pontuação" e "Acertos" / "Melhorar"), pois há mais de um bloco de render e a troca traria risco sem ganho essencial — a ambiguidade já foi resolvida pela padronização dos verbos (que era o obrigatório). A troca para "Você fez corretamente" / "Na próxima vez, faça também" pode ser feita depois, se desejado.

## Confirmação de não-impacto
Nenhuma alteração em nota, pesos, HealthBench scoring, rubrica clínica, lógica de correção, StudentTrace, Gold Standard, Professor IA, OSCE ou rotas. A normalização ocorre **somente na camada de texto** do view model, após o cálculo da pontuação.
