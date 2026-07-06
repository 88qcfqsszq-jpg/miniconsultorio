# Feedback do Atendimento alimentado diretamente pelo HealthBench

**Data:** 24 de junho de 2026
**Status:** ✅ Implementado e testado · ⚠️ 2 decisões e 1 pendência para sua análise
**Objetivo:** Manter o frontend do "Feedback do Atendimento" visualmente idêntico e trocar a fonte avaliativa para usar diretamente `healthBenchResult` vindo de `/api/osce/finalizar`. Reconectar dados, não redesenhar interface.

---

## 1. Resumo executivo

A tela de "Feedback do Atendimento" continua **exatamente igual** (header azul, cards de competência, expansão dos cards, bloco "Estudo final do caso"). O que mudou é **de onde vêm os dados**: agora vêm do motor HealthBench (`/api/osce/finalizar` → `healthBenchResult`), e não mais do `/api/corrigir`.

- O `/api/corrigir` virou **fallback técnico silencioso** (só usado se o HealthBench falhar).
- O painel HealthBench paralelo (`HealthBenchFeedbackPanel`) foi **removido** da tela principal.
- Nenhum dado técnico (`axis:`, `score01`, `criteria_met`, `comparison`, `sourceOfTruth`, JSON) chega ao aluno.

---

## 2. Auditoria do frontend atual (Fase 1)

Componente: `components/FeedbackOSCE.tsx` (667 linhas). Acessa apenas estes campos do objeto `feedback`:

| Campo | Uso na tela |
|---|---|
| `feedback.nota` | Nota grande no header (escala 0–20) |
| `feedback.classificacao` | Rótulo (Excelente/Bom/Regular/Insuficiente) |
| `feedback.justificativaNota` | Caixa de resumo no header |
| `feedback.resumoCaso.diagnosticoEsperado` | "Diagnóstico esperado" |
| `feedback.rubricaAvaliacao[]` | Os 6 cards de competência |

Cada item de `rubricaAvaliacao` (tipo `CompetenciaAvaliacao`): `{ nome, pontosObtidos, pontosMaximos, acertos[], melhorias[], evidencias[] }`.

Descobertas relevantes:
- O percentual do header é **calculado pelo próprio componente** (`nota/20*100`) — basta alimentar `nota`.
- A sugestão "Como recuperar esses pontos" já existe no componente (`sugestaoRecuperarPontos(nome)`, determinística por competência).
- O "Estudo final do caso" é carregado à parte (`/api/estudo-final-caso`) usando `rubricaAvaliacao` + `resumoCaso` — continua funcionando.
- O componente usava `diagnosticoEsperado` **também** para o campo "Diagnóstico informado" (limitação do legado).

---

## 3. Solução: ViewModel a partir do HealthBench

Em vez de reescrever o componente (risco de redesenho), foi criado um **builder de ViewModel** que monta o mesmo formato que o `FeedbackOSCE` já consome, 100% a partir de `healthBenchResult`.

**Arquivo novo:** `lib/healthbench/feedback-view-builder.ts`
**Função:** `construirFeedbackViewDeHealthBench(hb, caso, ctx)`

### Mapeamentos
| Campo da UI | Fonte HealthBench |
|---|---|
| Nota do header | Soma dos pontos das 6 competências (ver Decisão A) |
| Percentual | `nota / 20 * 100` (calculado pelo componente) |
| Classificação | Derivada da nota (≥17 Excelente, ≥15 Bom, ≥12 Regular, senão Insuficiente) |
| Resumo no header | `healthBenchResult.professorFeedback` (sem a linha "Nota:" e sem disclaimer) |
| Diagnóstico esperado | `caso.dados_ocultos_do_sistema.diagnostico_principal` |
| Diagnóstico informado | `diagnosisAndPlan.hipotesePrincipal` |
| Cards (6 competências) | `healthBenchResult.grades` filtradas por `axis:*` + `competencyScores` |

### Mapeamento das 6 competências → tags → peso visual
| Card | Tag | Peso visual |
|---|---|---|
| Comunicação e postura médica | `axis:comunicacao` | 2 |
| Anamnese dirigida | `axis:anamnese` | 4 |
| Exame físico | `axis:exame_fisico` | 4 |
| Exames complementares | `axis:exames_complementares` | 2 |
| Raciocínio diagnóstico | `axis:raciocinio_clinico` | 5 |
| Conduta | `axis:conduta` | 3 |

Por competência:
- `pontosMaximos` = peso visual (mantém a escala 2/4/4/2/5/3 da UI atual)
- `pontosObtidos` = `competencyScores[axis] × peso`
- `acertos` = grades com `criteria_met=true && points>0` (texto do critério)
- `melhorias` = grades com `criteria_met=false && points>0`
- `evidencias` = `grade.explanation` (frases humanas; explicações heurísticas são filtradas)

---

## 4. Fluxo de finalização (Fase 2)

```
handleFinalizarAtendimento
  ↓
POST /api/osce/finalizar
  ↓
response.healthBenchResult  ──(existe)──►  construirFeedbackViewDeHealthBench(hb, caso)
  ↓                                              ↓
  (HB ausente / endpoint falha)            setFeedback(view) → FeedbackOSCE (tela idêntica)
  ↓
fallback: POST /api/corrigir → setFeedback(feedbackLegado)  [log: FEEDBACK HB FALLBACK]
```

Regra: **se `healthBenchResult` existir, ele é a única fonte visual.** `legacyCorrectionResult` é ignorado na UI.

---

## 5. Limpeza de duplicidades (Fase 4)

Removidos da tela principal:
- `HealthBenchFeedbackPanel` paralelo (import e render).
- Estado `healthBenchResult` e função `avaliarHealthBench()` (alimentavam o painel removido).
- Nenhuma exibição de `comparison`, `legacyCorrectionResult`, `sourceOfTruth`, `score01`, `criteria_met`, `axis:`, `theme:`.

---

## 6. Arquivos

### Criados (1)
- `lib/healthbench/feedback-view-builder.ts`

### Alterados (3)
| Arquivo | Mudança |
|---|---|
| `app/caso/[id]/page.tsx` | Conecta `/api/osce/finalizar` → ViewModel → `FeedbackOSCE`; remove painel paralelo, estado e função órfãos; fallback legado silencioso + logs |
| `components/FeedbackOSCE.tsx` | **1 linha**: binding do "Diagnóstico informado" (`diagnosticoInformado ?? diagnosticoEsperado`) |
| `lib/types.ts` | **1 campo opcional**: `resumoCaso.diagnosticoInformado?` |

> `/api/corrigir` **não foi alterado** (`git diff` vazio).

---

## 7. Logs adicionados

`[FEEDBACK HB DATA] healthBenchResult recebido`
`[FEEDBACK HB DATA] cards montados por competência`
`[FEEDBACK HB DATA] feedback principal usando HealthBench`
`[FEEDBACK HB FALLBACK] fallback legado acionado` (quando ocorre)

---

## 8. Testes executados (dados reais, caso 3 — Asma)

| Verificação | Resultado |
|---|---|
| Compilação do módulo | ✅ `✓ Compiled successfully` |
| Tipos nos arquivos tocados | ✅ 0 erros |
| `/api/osce/finalizar` retorna `healthBenchResult` | ✅ |
| ViewModel monta 6 cards | ✅ |
| Consistência header = soma cards = somatório | ✅ (ver Decisão A) |
| Sem vazamento técnico na UI | ✅ verificado |
| Card expandido com texto humano | ✅ (exemplo abaixo) |
| `/api/corrigir` preservado | ✅ git diff vazio |
| ECG/Open-i/radiologia não tocados | ✅ |

### Exemplo de card expandido (Conduta)
```
Peso na nota: 3 pontos | Pontos obtidos: 1.7/3 (56%)
O QUE FOI RECONHECIDO:
  • Terapia Broncodilatadora — Salbutamol apropriadamente prescrito
O QUE FALTOU PARA FECHAR A PONTUAÇÃO:
  • Corticosteroide Sistêmico — Prescrição apropriada
EVIDÊNCIAS USADAS PELA AVALIAÇÃO:
  • "O aluno prescreveu Salbutamol inalatório como parte da conduta, o que é apropriado..."
  • "O aluno prescreveu corticoide inalatório, mas não prescreveu um corticosteroide sistêmico..."
COMO RECUPERAR: sugestão determinística por competência (já no componente)
```

---

## 9. ⚠️ Decisões que precisam da sua análise

### Decisão A — Nota = soma dos 6 cards (não `notaFinal` literal)

**O que você pediu:** `nota = healthBenchResult.notaFinal`.

**O conflito:** o componente exibe a nota grande **e** "Somatório da rubrica: X/Y" (soma dos cards). Com pesos visuais fixos (2/4/4/2/5/3), é **matematicamente impossível** ter ao mesmo tempo:
1. pesos visuais fixos,
2. nota do header = `notaFinal`,
3. cards somando exatamente a nota,
4. percentual de cada card = score real do eixo.

A razão: `notaFinal = score01_global × 20` é ponderada pelos *points reais* de TODOS os critérios (incluindo `axis:seguranca`, checklist e erros, que não estão nos 6 cards). A média ponderada dos 6 eixos com pesos fixos dá outro número.

**Exemplo real (caso 3):** `notaFinal = 11,4` mas a soma das 6 competências = `6,7`. Mostrar 11,4 no header e 6,7 no somatório seria incoerente para o aluno.

**Decisão tomada:** nota do header = **soma das 6 competências** (auto-consistente com cards e somatório). É legítima porque os 6 cards SÃO a rubrica OSCE de 20 pontos.

**Se preferir o contrário:** posso usar `notaFinal` literal no header e aceitar que o "Somatório da rubrica" mostre um valor diferente — basta avisar. (Também é possível ocultar o "Somatório da rubrica", mas isso mexeria no componente.)

### Decisão B — Diagnóstico informado (toque mínimo no componente)

Para mostrar o diagnóstico informado pelo aluno (você pediu `= hipotesePrincipal`), foi necessária **1 linha** no `FeedbackOSCE.tsx` (o legado mostrava o esperado nos dois campos). É reconexão de dado, não redesenho. Se preferir zero toque no componente, reverto e o campo volta a espelhar o esperado.

---

## 10. ⚠️ Pendência de qualidade (fora do escopo desta tarefa)

**Cobertura de eixos baixa em alguns casos.** No caso 3, "Comunicação" e "Exames complementares" aparecem **0%** porque o `rubric-adapter` (Fase 1) **não gera critérios** com essas tags para esse caso.

Distribuição real das 12 grades do caso 3:
| Tag | Nº de critérios |
|---|---|
| `axis:seguranca` | 10 |
| `axis:raciocinio_clinico` | 4 |
| `axis:conduta` | 2 |
| `axis:anamnese` | 1 |
| `axis:exame_fisico` | 1 |
| `axis:comunicacao` | 0 |
| `axis:exames_complementares` | 0 |

Problemas observados:
- `axis:seguranca` é aplicada em quase tudo (10/12), mas **não é um dos 6 cards** → esses pontos "somem" da visão por competência.
- Itens de anamnese (ex.: "Investigou histórico de asma") são classificados como `raciocinio_clinico`.
- "Comunicação" e "Exames" ficam sem critérios → cards 0%, parecendo reprovação injusta.

**Causa:** heurística de inferência de tags em `lib/healthbench/rubric-adapter.ts`. **Não é** do builder de view (que está fiel aos dados).

**Recomendação para a próxima tarefa:** melhorar a inferência de `axis:` no `rubric-adapter` para:
- distribuir melhor os critérios pelos 6 eixos;
- mapear `axis:seguranca` para uma das 6 competências visíveis (ex.: Conduta ou Raciocínio) ou adicionar um 7º card;
- reduzir o excesso de `seguranca` em todos os itens críticos.

---

## 11. Confirmações finais

- ✅ Layout **não** redesenhado (componente intocado, exceto 1 binding de dado).
- ✅ Feedback principal alimentado **diretamente** por `healthBenchResult`.
- ✅ Painel HealthBench paralelo **removido** da tela principal.
- ✅ `/api/corrigir` permanece **apenas como fallback** (não alimenta a tela quando HB existe).
- ✅ Sem dados técnicos visíveis ao aluno.
- ✅ ECG, Open-i e radiologia **não tocados** (marcas `M` nesses arquivos são pré-existentes).
- ⚠️ `npm run build` completo segue bloqueado pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e o dev server funciona.

---

## 12. Como testar em localhost

```bash
npm run dev
# 1. Abrir um caso (ex.: /caso/3) e finalizar um atendimento.
# 2. A tela de feedback aparece IDÊNTICA, mas os dados vêm do HealthBench.
# 3. No console do navegador devem aparecer:
#    [FEEDBACK HB DATA] healthBenchResult recebido
#    [FEEDBACK HB DATA] feedback principal usando HealthBench
# 4. Clicar num card (ex.: Conduta) e conferir verso: reconhecido / faltou / evidências / como recuperar.
# 5. Conferir que NÃO há painel HealthBench separado abaixo, nem duas notas, nem textos técnicos.
```

---

## 13. Próximos passos sugeridos

1. **Decidir A e B** acima (nota = soma vs `notaFinal`; manter ou reverter o binding do diagnóstico informado).
2. **Melhorar o `rubric-adapter`** (cobertura/qualidade das tags `axis:`) — maior impacto na justiça da nota.
3. Avaliar mostrar o eixo `axis:seguranca` em algum card (hoje fica fora dos 6).
4. Persistência real das tentativas (já há interface no `attempt-store`).
