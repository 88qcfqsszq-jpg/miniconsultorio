# Correção da Avaliação de Insuficiência Cardíaca — Ictus Cordis + Classificação de Eixo

**Data:** 26 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Corrigir a subpontuação no caso de Insuficiência Cardíaca Sistólica (FEVE reduzida): ictus cordis não contabilizado, critérios reais no card errado, anamnese e conduta subavaliadas. Mantém nota, classificação, layout e demais lotes intactos.

---

## 1. Causa-raiz (auditoria)

O exame físico interativo **sempre foi enviado** ao HealthBench (`manobrasSolicitadas` → `physicalExamEvents` → transcript). O problema **não era payload faltando**.

A causa real eram **bugs de radical** na função `inferirAxisPrimario` (rubric-adapter), que classifica os critérios **reais do caso** (rubrica_correcao / checklist) em um dos 6 cards:

| Critério real | Classificava em | Motivo do bug |
|---|---|---|
| "Palpou: desvio de ictus" | Raciocínio (default) | regex `palpa` não casa "**palpou**"; "ictus" ausente |
| "Prescreveu diurético IV" | Raciocínio (default) | regex `prescri` não casa "**prescreveu**" |
| "Solicitou ecocardiograma" | Raciocínio (default) | "ecocardiograma" ausente no regex de exames |
| "Ausculta: buscou B3 e crepitações" | Raciocínio (default) | "auscultou/B3/crepita" não cobertos |

> Os microcritérios específicos/genéricos NÃO eram afetados (são taggeados diretamente com `card.axis`). O bug atingia só os critérios reais do caso, que passam por `inferirAxisPrimario` e caíam no default (Raciocínio) — subpontuando os cards corretos.

Além disso: microcritérios de anamnese de IC eram **compostos** ("edema, ganho de peso E tolerância"), provocando avaliação tudo-ou-nada; e a rubrica de IC não tinha critérios de **ictus** nem de **apresentação**.

---

## 2. Arquivos alterados (3)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/rubric-adapter.ts` | Radicais corrigidos + termos clínicos adicionados em `inferirAxisPrimario` |
| `lib/healthbench/diagnosis-microcriteria.ts` | Rubrica de IC: +ictus, +apresentação, anamnese atomizada, condutas reforçadas |
| `lib/healthbench/transcript-normalizer.ts` | Log `[OSCE PHYSICAL FINDINGS PAYLOAD]` |

> `feedback-view-builder.ts`, `cards-config.ts`, `components/FeedbackOSCE.tsx`, `/api/corrigir`, ECG, Open-i, radiologia, exame físico visual e geração de imagens **não foram tocados**.

---

## 3. Correção dos radicais (`inferirAxisPrimario`)

| Card | Antes | Depois |
|---|---|---|
| Exame físico | `palpa`, `ausculta`, … | `palpa\|palpou\|palpac`, `auscult`, **`ictus`**, `\bb3\b\|\bb4\b`, `estertor\|crepita`, `turgência jugular`, `frêmito` |
| Conduta | `prescri`, … | `prescr`, **`diurétic`**, **`descongest`** |
| Exames | … `ecg` | + `ecocardiograma\|ecocardio`, `\bbnp\b\|nt-probnp`, `angiotc`, `d-dímero` |

Validação (8/8): "Palpou: desvio de ictus" → Exame físico; "Prescreveu diurético IV" → Conduta; "Solicitou ecocardiograma" → Exames; "Ausculta: B3 e crepitações" → Exame físico.

---

## 4. Ajustes na rubrica de IC (`insuficiencia_cardiaca`)

### Comunicação
- **+** "Apresentou-se ao paciente ou identificou seu papel no atendimento."

### Anamnese (atomizada)
- "Investigou dispneia aos esforços ou redução da tolerância ao exercício."
- "Investigou ortopneia ou dispneia paroxística noturna."
- "Investigou edema de membros inferiores."
- "Investigou ganho de peso recente."
- "Investigou antecedente de infarto, doença coronariana ou outra cardiopatia."
- (+ adesão/dieta/sal, fatores precipitantes, sinais de gravidade)

### Exame físico
- **+** "Avaliou o ictus cordis, sua localização ou desvio do ictus quando aplicável."

### Conduta e Segurança
- "Indicou diurético quando havia congestão ou edema."
- **+** "Propôs terapia descongestiva."
- **+** "Indicou internação, observação ou encaminhamento se havia sinais de descompensação."
- **+** "Planejou organizar ou ajustar as medicações em uso conforme estabilidade."
- **+** "Avaliou ou planejou avaliar sinais vitais antes de encaminhar."
- (+ oxigênio, restrição de sal/adesão/alarme, reavaliação)

---

## 5. Confirmação do payload (Parte 1)

Log adicionado no `transcript-normalizer`:
```
[OSCE PHYSICAL FINDINGS PAYLOAD] achados enviados ao HealthBench: ["palpar ictus cordis: Ictus desviado lateralmente", ...]
```
Confirma que os achados do exame físico interativo (ictus, ausculta, B3, turgência, edema) chegam ao grader.

---

## 6. Teste com a conversa real (caso 8) — antes → depois

| Card | Antes | Depois |
|---|---|---|
| Comunicação | 0/4 | **1/4** (apresentação ✓) |
| Anamnese | 1/4 | **4/4** |
| Exame físico | 0/4 | **1/4 — ictus ✓ no card correto** |
| Exames | 1/3 | 1/3 |
| Raciocínio | 1/5 | 2/4 (limpo: ictus/diurético/eco saíram daqui) |
| Conduta e Segurança | 4/5 | **4/5** (diurético, terapia descongestiva, internação) |
| **Nota final** | ~3/20 | **7.9/20** |

- Ictus cordis reconhecido no card **Exame físico** (não mais em Melhorar/Raciocínio).
- Conduta e Segurança **não fica próxima de zero**.
- Nenhum card com acertos positivos fica 0.
- Nota = soma dos 6 cards (header == distribuição).

---

## 7. Não-regressão

A identificação de diagnóstico (`identificarDiagnosticoRubrica`) **não usa** `inferirAxisPrimario`, então as rubricas dos lotes anteriores permanecem corretas:

| Caso/diagnóstico | Resultado |
|---|---|
| Caso 1 — SCA/IAMCSST | `sca_iam` ✅ |
| Caso 11 — Tuberculose | `tuberculose_pulmonar` ✅ |
| (identificação) IC descompensada, IC crônica, DPOC, pneumonia adulto/ped, TEP, pneumotórax, derrame, sepse, endocardite, dengue, virose, anemia, asma | corretos ✅ |

**0 consistency errors** em todos os testes. Nota = soma dos cards mantida.

> A correção dos radicais **beneficia todos os casos**: qualquer critério real com verbo no pretérito (palpou, prescreveu, auscultou) ou termo antes ausente (ictus, ecocardiograma, diurético) agora vai para o card correto, em vez de cair no default (Raciocínio).

---

## 8. Confirmações

| Item | Status |
|---|---|
| Ictus cordis contabilizado no card Exame físico | ✅ |
| Exame físico interativo no payload (log) | ✅ |
| Anamnese de IC não fica 0/4 | ✅ (4/4 no teste) |
| Conduta de IC não fica próxima de zero | ✅ (4/5 no teste) |
| Critérios reais no card correto | ✅ |
| Nota = soma dos 6 cards | ✅ |
| Classificação textual usa nota visual | ✅ |
| Layout inalterado | ✅ |
| Não-regressão dos lotes 1–4 | ✅ |
| ECG, Open-i, radiologia, exame físico visual, imagens, /api/corrigir | ✅ intactos |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

---

## 9. Observações

- O grader (IA) ainda pode marcar um item como não cumprido por interpretação; a correção reduz a subpontuação **estrutural** (classificação de eixo e critérios compostos), não substitui o julgamento do grader.
- O caso 8 mantém lacunas reais penalizadas corretamente (ex.: não mediu sinais vitais, não auscultou B3/crepitações, não solicitou ecocardiograma) — o aluno perde pontos por essas lacunas, não por falha de integração.
