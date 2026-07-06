# Gold Standard OSCE Validator — Relatório de Auditoria Global

**Data:** 29 de junho de 2026
**Modo:** AUDITORIA (somente leitura de produção; nenhuma correção aplicada)
**Resultado:** Nenhum caso falha (<19.5). 65/77 atingem 20/20; 12/77 ficam em 19.8 por **dois micro-gaps sistêmicos** bem caracterizados.

---

## 0. O que este validador faz

Para cada caso clínico cadastrado, o validador:
1. **Extrai a rubrica interna** do caso (os mesmos critérios que viram os 6 cards do feedback), via `adaptarRubricaDoCaso` (produção, importada sem modificar).
2. **Gera uma "consulta perfeita" sintética**: um `HealthBenchEvaluationResult` em que **todos os critérios positivos** da rubrica do caso estão cumpridos e **nenhum negativo** ativado ("grader ideal"), mais um **contexto textual rico** que verbaliza os critérios + um léxico clínico amplo.
3. **Roda pelo builder real de cards** (`construirFeedbackViewDeHealthBench`, produção, importada sem modificar) — o mesmo que monta os cards do feedback do usuário.
4. **Mede a nota** (= soma dos cards) e, em cada card abaixo do peso, registra o subcritério não reconhecido e classifica a **causa provável**.

### Fronteira da auditoria (limitação honesta)
O **grader IA (OpenAI)** é deliberadamente **substituído por um grader ideal**. Portanto este validador **não testa o NLP do grader** (reconhecimento de linguagem natural pelo LLM, que é custoso e não-determinístico). Ele testa, de forma **determinística e reprodutível**, a camada **da montagem dos cards para frente**: partição por eixo, scoring, e os **recalibradores determinísticos das rubricas específicas** (PAC, SCA, etc.) que rodam sobre o contexto textual.

Consequência: os gaps aqui revelados são **estruturais/de regra** (teto inatingível, token não reconhecido), não falhas do LLM. Eles valem para **qualquer** consulta, inclusive uma real perfeita.

---

## 1. Números

| Métrica | Valor |
|---|---|
| Casos no banco | 77 |
| Casos testados | 77 (lote `--all`) |
| **20/20** | **65** |
| **19.5–20 (19.8)** | **12** |
| **< 19.5 (falha)** | **0** |
| Casos fora | 0 |

Lote inicial (TB, IC, asma, pneumonia, anemia, dengue grave, SCA/IAM, DPOC, TEP, pneumotórax): 26 casos casaram os filtros (incluindo variantes e pediátricos homônimos) — 18×20/20, 8×19.8, 0 falhas. O lote global foi executado em seguida e é a base deste relatório.

JSON completo: [docs/gold-standard-osce-results.json](gold-standard-osce-results.json).

---

## 2. Casos que NÃO fecharam 20/20 (12)

Todos perdem exatamente **0.2** num único subcritério.

| casoId | Diagnóstico (resumo) | Card | Subcritério não reconhecido |
|---|---|---|---|
| 1 | SCA – IAMCSST | Raciocínio | Justificar brevemente cada diferencial considerado. |
| 5 | Hipertensão (dor torácica) | Raciocínio | idem |
| 18 | IAM sem supra de ST | Raciocínio | idem |
| 19 | Angina Instável | Raciocínio | idem |
| 20 | IAMCSST parede anterior | Raciocínio | idem |
| 56 | (família dor torácica/SCA) | Raciocínio | idem |
| 2 | Pneumonia (PAC) | Exame físico | Auscultar tórax anterior e posterior. |
| 6 | Pneumonia atípica | Exame físico | idem |
| 57 | HIV + Pneumocystis (PCP) | Exame físico | idem |
| 58 | IAM + síndrome metabólica | Exame físico | idem |
| 61 | (família pneumonia) | Exame físico | idem |
| ped-13 | Pneumonia adquirida na comunidade | Exame físico | idem |

Casos que atingiram **20/20**: os outros 65 (lista completa no JSON), incluindo Asma (3, 31), IC (8, ped-05), DPOC (9, 33, 34), TEP (10), Tuberculose (11, ped-10), Derrame pleural (16), Anemia (17, 43, 44, ped-15), Dengue com alarme (39), Pneumotórax (62).

---

## 3. Causa provável — agrupada (TAREFA 5/6)

São **dois** gaps sistêmicos:

### GAP-1 — Raciocínio (SCA/dor torácica): teto inatingível → `scoring_bug` / `rubric_gap`
**6 casos.** Em [`lib/healthbench/rubricas-diagnosticos/sca.ts:310-322`](../lib/healthbench/rubricas-diagnosticos/sca.ts#L310-L322), o subitem **8.5 Diferenciais** está comentado como `(0.7/0.5/0.3)`, mas o código concede no máximo **0.5** (`nDif >= 2`). **Não existe branch que conceda 0.7.** O complemento `+0.2` dependeria de "justificar cada diferencial", para o qual **não há detector** — logo o teto do subitem (0.7) é **inatingível por qualquer consulta**. Resultado: o card Raciocínio dos casos SCA/IAM tem máximo prático **4.8/5**.

- **Classificação:** `scoring_bug` (teto documentado não atingível) com componente de `rubric_gap` (critério "justificar cada diferencial" sem detector).
- **Como se manifesta:** todo caso da família SCA/dor torácica fica em 19.8, nunca 20.

### GAP-2 — Exame físico (PAC/pneumonia): token "posterior" não reconhecido → `normalization_missing` (+ `event_missing` relevante)
**6 casos.** Em [`lib/healthbench/rubricas-diagnosticos/pac.ts:90-108`](../lib/healthbench/rubricas-diagnosticos/pac.ts#L90-L108), a ausculta vale **0.7 só se** `auscAnt && auscPost`. O detector `auscPost` exige tokens literais: `"ausculta posterior"`, `"auscultar torax posterior"`, `"torax posterior"`, `"campos posteriores"`, `"bases posteriores"`. Textos como "ausculta pulmonar anterior **e** posterior" **não** contêm nenhuma dessas substrings contíguas → cai em **0.5** ("Realizou ausculta pulmonar").

- **Classificação:** `normalization_missing` (variações de "ausculta anterior e posterior" não normalizadas para os tokens esperados).
- **Conexão com a Ausculta Pulmonar Interativa (relevante):** o registro gerado pelo painel é `"[Ausculta Pulmonar] RLA — Ausculta pulmonar"` — **não carrega** "anterior"/"posterior". Logo, um aluno que use a ausculta interativa do PAC dispara apenas `auscQualquer` (0.5), **nunca** `auscAnt && auscPost` (0.7). Isto é um `event_missing`/`normalization_missing` acionável: o texto do evento não preserva o eixo anterior/posterior que a ação de origem (`auscultar_anterior`/`auscultar_posterior`) já conhece.

> Observação: ambos os gaps são **limites de regra**, não bugs de partição de eixo nem de payload. Não foram observados `scoring=0`, `wrong_card_axis` reais, nem `pipeline_payload_missing` no escopo determinístico testado.

---

## 4. Tabela de erros globais

| Categoria | Ocorrências | Onde |
|---|---|---|
| alias_missing | 0 confirmados | — |
| normalization_missing | 6 | `pac.ts` (`auscPost` não casa "anterior e posterior") |
| event_missing | 6 (mesma origem do acima) | registro da ausculta interativa sem token anterior/posterior |
| wrong_card_axis | 0 | — |
| scoring_bug | 6 | `sca.ts` 8.5 (teto 0.7 inatingível) |
| critical_penalty_wrong | 0 | — |
| rubric_gap | 6 (mesma origem do scoring SCA) | `sca.ts` (critério sem detector) |
| pipeline_payload_missing | 0 (não testável sem o grader IA) | — |
| card_builder_issue | 0 | — |

---

## 5. Recomendações de correção (SEM implementação — TAREFA 6)

### Correção sugerida 1 — SCA diferenciais (GAP-1)
- **O quê:** alinhar teto e código do subitem 8.5. Ou (a) conceder 0.7 quando `nDif >= 2` (removendo a dependência do critério sem detector), ou (b) adicionar um detector de "justificativa por diferencial" para o +0.2, ou (c) ajustar o teto documentado para 0.5.
- **Arquivo provável:** `lib/healthbench/rubricas-diagnosticos/sca.ts` (linhas ~310-322).
- **Risco:** **baixo** (muda só o valor máximo de um subitem do Raciocínio da família SCA; eleva no máximo +0.2). **Atenção:** afeta a nota de produção dos casos SCA/IAM — discutir antes.
- **Não implementado nesta etapa.**

### Correção sugerida 2 — PAC ausculta anterior/posterior (GAP-2)
- **O quê (opção A, mais segura):** ampliar os aliases de `auscPost`/`auscAnt` em `pac.ts` para reconhecer "anterior e posterior", "campos anteriores e posteriores", e o texto do evento da ausculta interativa.
- **O quê (opção B):** fazer o registro da ausculta interativa preservar o eixo (anterior/posterior) no `textDigitado` — porém isso mexe em arquivo de ausculta (proibido nesta etapa e fora deste escopo de auditoria).
- **Arquivo provável:** `lib/healthbench/rubricas-diagnosticos/pac.ts` (linhas ~90-91) — leitura; correção depois.
- **Risco:** **baixo-médio** (ampliar regex pode reconhecer ausculta "anterior e posterior" em mais consultas, elevando notas de PAC em até +0.2; verificar falsos positivos).
- **Não implementado nesta etapa.**

---

## 6. Ordem de correção recomendada

1. **GAP-2 (PAC, opção A — aliases)** primeiro: baixo risco, alto número de casos (6), correção localizada num único `contemAlgum`, e destrava a sinergia com a ausculta pulmonar interativa recém-implementada.
2. **GAP-1 (SCA scoring)** em seguida: baixo risco técnico, mas **toca a nota** da família SCA/IAM (6 casos) — exige decisão pedagógica (o teto deve mesmo ser 0.7? a "justificativa por diferencial" deve ser exigida?).

**Módulos sensíveis (cautela máxima ao corrigir depois):** qualquer arquivo em `lib/healthbench/*` afeta diretamente a nota de produção e o feedback visível ao aluno. Toda alteração deve ser acompanhada de nova rodada deste validador + verificação de não-regressão dos 77 casos.

---

## 7. Como cada etapa foi feita (TAREFA 12 — itens 4/5/6)

- **Extração da rubrica:** `extrairRubricaDoCaso(caso)` chama `adaptarRubricaDoCaso` (produção) e agrupa os itens nos 6 cards por `axis:*`, separando **positivos** de **negativos/penalidades críticas**. (`scripts/gold-standard-osce-utils.ts`)
- **Consulta perfeita:** `gerarConsultaPerfeitaDoCaso` monta o `HealthBenchEvaluationResult` "grader ideal" (positivos cumpridos, negativos não) + `ctx` textual rico (critérios da rubrica + léxico clínico amplo + sinais vitais completos + diferenciais do caso).
- **Pipeline real:** `avaliarCasoGold` chama `construirFeedbackViewDeHealthBench` (produção) — o mesmo builder usado pelo feedback do usuário — e lê `fb.nota` e `fb.rubricaAvaliacao`.

---

## 8. Verificação de não alteração de produção (TAREFA 11)

`git diff --name-only` ao final é **idêntico ao baseline** registrado antes da auditoria (arquivos já modificados por trabalhos anteriores, não por esta tarefa).

**Arquivos novos criados por esta auditoria (somente):**
- `scripts/gold-standard-osce-utils.ts`
- `scripts/validate-gold-standard-osce.ts`
- `docs/GOLD-STANDARD-OSCE-VALIDATOR-RELATORIO.md` (este arquivo)
- `docs/gold-standard-osce-results.json`

**Arquivos de produção alterados por esta auditoria:** **nenhum.**

Confirmação: **não** foram alterados HealthBench (`lib/healthbench/*`), rubricas, normalizador, aliases, cards, pontuação, `components/FeedbackOSCE.tsx`, `app/api/osce/finalizar`, `/api/corrigir`, ECG, Open-i/radiologia, exame físico adulto/pediátrico, ausculta pulmonar, casos clínicos ou layout. Os arquivos de produção foram **apenas lidos/importados**, nunca modificados.

---

## 9. Como reproduzir

```bash
npx tsx scripts/validate-gold-standard-osce.ts          # lote inicial
npx tsx scripts/validate-gold-standard-osce.ts --all    # todos os 77 casos
# saída: docs/gold-standard-osce-results.json
```

---

## 10. TAREFA 9/10 — Tuberculose e consulta parcial

- **Tuberculose (caso 11 e ped-10):** a consulta perfeita atinge **20/20**. Com reconhecimento ideal dos critérios, todos os 6 cards fecham — não há gap estrutural específico de TB na camada de montagem. (O reconhecimento NLP real de termos como "TRM-TB", "febre vespertina", "RIPE" pelo grader IA **não** é coberto por esta auditoria determinística — ver Fronteira na seção 0; recomenda-se um teste futuro com o grader real para esses aliases.)
- **Consulta parcial real (PDF):** não reexecutada aqui (exigiria o grader IA real para ser fiel). Fica registrado como teste futuro: comparar uma consulta parcial de TB para confirmar que ela **perde** pontos por ausência de RIPE/máscara/notificação/RX/baciloscopia e **reconhece** TRM-TB/contato/febre noturna/perda de peso/tosse >3 semanas.

---

## 11. Conclusão

O sistema **usa os próprios critérios dos cards como gabarito interno** e, com reconhecimento perfeito, **65/77 casos fecham 20/20 e nenhum falha (<19.5)**. Os 12 casos em 19.8 expõem **dois limites de regra determinísticos** (teto 0.7 inatingível no diferencial SCA; token "posterior" não normalizado na ausculta PAC), ambos de **baixo risco** de correção e claramente localizados. **Nenhuma correção foi aplicada** — as duas sugestões aguardam decisão, uma a uma, com nova rodada de validação após cada mudança.
