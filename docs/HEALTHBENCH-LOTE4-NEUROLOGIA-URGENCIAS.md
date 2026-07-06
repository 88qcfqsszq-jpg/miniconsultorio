# Lote 4 — Rubricas Específicas Neurologia / Urgências Neurológicas

**Data:** 26 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Adicionar microcritérios específicos para 7 diagnósticos neurológicos/urgências, com desambiguações seguras (AVC isquêmico × hemorrágico × AIT; vertigem central × periférica; quadros como complicação uns dos outros), mantendo fallback genérico, nota, classificação e layout, sem regressão nos lotes anteriores.

---

## 1. Diagnósticos do lote (7)

| Chave | Diagnóstico |
|---|---|
| `avc_isquemico` | AVC isquêmico / AVC agudo |
| `ait` | AIT / ataque isquêmico transitório |
| `avc_hemorragico` | AVC hemorrágico / hemorragia intracraniana |
| `crise_convulsiva_epilepsia` | Crise convulsiva / epilepsia |
| `cefaleia_hsa` | Cefaleia grave / hemorragia subaracnoide |
| `vertigem_sindrome_vestibular` | Vertigem / síndrome vestibular |
| `rebaixamento_consciencia` | Rebaixamento do nível de consciência / coma |

Cada um com microcritérios atômicos nos 6 cards (Comunicação, Anamnese, Exame físico, Exames complementares, Raciocínio diagnóstico, Conduta e Segurança).

---

## 2. Arquivos alterados (1)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/diagnosis-microcriteria.ts` | 7 rubricas + aliases; `DiagnosticoRubricaKey` ampliado; marcadores AVC hemorrágico/AIT/vertigem central |

> `rubric-adapter.ts`, `feedback-view-builder.ts`, `cards-config.ts`, `components/FeedbackOSCE.tsx`, `/api/corrigir`, ECG, Open-i, radiologia, exame físico visual e geração de imagens **não foram tocados** (a integração já estava pronta dos lotes anteriores).

---

## 3. Aliases adicionados

| Chave | Aliases |
|---|---|
| `avc_isquemico` | avc isquemico, acidente vascular cerebral isquemico, avc agudo, derrame isquemico, deficit neurologico focal, afasia aguda, hemiparesia aguda |
| `ait` | ait, ataque isquemico transitorio, isquemia cerebral transitoria, deficit neurologico transitorio, sintomas neurologicos resolvidos |
| `avc_hemorragico` | avc hemorragico, acidente vascular cerebral hemorragico, hemorragia intracraniana, sangramento intracraniano, hemorragia cerebral, hematoma intracerebral, hematoma intraparenquimatoso |
| `crise_convulsiva_epilepsia` | crise convulsiva, convulsao, epilepsia, crise epileptica, estado de mal epileptico, pos ictal |
| `cefaleia_hsa` | cefaleia grave, cefaleia subita, pior dor da vida, hemorragia subaracnoide, hsa, sangramento subaracnoide, thunderclap headache, cefaleia em trovoada |
| `vertigem_sindrome_vestibular` | vertigem, tontura rotatoria, sindrome vestibular, labirintite, neuronite vestibular, vertigem posicional, vppb |
| `rebaixamento_consciencia` | rebaixamento do nivel de consciencia, rebaixamento de consciencia, coma, confusao mental aguda, delirium agudo, alteracao do nivel de consciencia, sonolencia importante |

---

## 4. Desambiguações

| Cenário | Mecanismo | Exemplo |
|---|---|---|
| **AVC isquêmico × hemorrágico** | marcador `hemorrag \| hematoma \| sangramento intracran` (só reclassifica o isquêmico genérico) | "Hemorragia intracraniana" → `avc_hemorragico` |
| **AVC × AIT** | marcador `\bait\b \| transitori \| sintomas neurologicos resolvid` | "AIT (ataque isquêmico transitório)" → `ait` |
| **AVC × rebaixamento** | menor posição (diagnóstico principal primeiro) | "AVC isquêmico com rebaixamento" → `avc_isquemico` |
| **Cefaleia/HSA × meningite** | menor posição | "Hemorragia subaracnoide com rigidez de nuca" → `cefaleia_hsa` |
| **Vertigem central × periférica** | marcador `vertigem central \| cerebelar \| \bavc\b \| circulacao posterior` | "Vertigem central por AVC cerebelar" → `avc_isquemico`; "VPPB / labirintite" → `vertigem` |
| **Crise × síncope/AVC/rebaixamento** | menor posição | diagnóstico principal antes de causas/complicações |

Proteção de aliases curtos: `ait`, `hsa`, `vppb`, `coma` casam apenas isolados (word boundary).

A desambiguação de vertigem reflete a clínica: **vertigem central = AVC** (circulação posterior/cerebelo), **vertigem periférica = vestibular** (VPPB, neurite, labirintite).

---

## 5. Regras mantidas

- Microcritérios atômicos; específicos têm prioridade; genéricos completam a cobertura mínima.
- Deduplicação por texto normalizado.
- HealthBench (grader) decide se cada microcritério foi cumprido.
- Consistência: card com acertos não fica 0 sem penalidade crítica visível; senão `[FEEDBACK HB CONSISTENCY ERROR]` + piso mínimo.
- Menor posição no texto: diagnóstico principal antes de causas/complicações.

---

## 6. Testes — Lote 4 (identificação, 11/11 ✅)

AVC isquêmico; AVC isquêmico com rebaixamento → `avc_isquemico`; AIT → `ait`; AVC hemorrágico; hemorragia intracraniana → `avc_hemorragico`; crise convulsiva; cefaleia súbita por HSA; HSA com rigidez de nuca → `cefaleia_hsa`; VPPB → `vertigem`; **vertigem central por AVC cerebelar → `avc_isquemico`** (e por hemorragia cerebelar → `avc_hemorragico`); rebaixamento por hipoglicemia → `rebaixamento_consciencia`.

> O banco de casos não possui casos neurológicos (meningite pertence ao Lote 3). A geração de cards (consistência, nota = soma) usa a **mesma lógica** já validada E2E nos Lotes 1–3; cada microcritério do Lote 4 entra pelo mesmo pipeline.

---

## 7. Testes de não-regressão (Lotes 1, 2A, 2B e 3)

Identificação 11/11 correta:
- **Lote 1:** dengue grave, virose pediátrica, gastroenterite, amigdalite.
- **Lote 2A:** SCA/IAM, DPOC, pneumotórax.
- **Lote 2B:** dissecção de aorta, derrame pleural, fibrilação atrial.
- **Lote 3:** meningite, sepse por pielonefrite, tuberculose.

E2E confirmou pipeline intacto após o Lote 4: caso 1 → `sca_iam`, caso 11 → `tuberculose_pulmonar`, caso 16 → `derrame_pleural`; **0 consistency errors**. Diagnóstico não mapeado (HAS) → `null` (fallback).

---

## 8. Confirmações

| Item | Status |
|---|---|
| 7 rubricas do lote implementadas | ✅ |
| AVC hemorrágico não cai em isquêmico | ✅ |
| AIT não cai em AVC isquêmico | ✅ |
| AVC com rebaixamento não vira só rebaixamento | ✅ |
| Cefaleia/HSA não vira meningite por rigidez de nuca | ✅ |
| Vertigem central por AVC não vira vestibular | ✅ |
| Todos os 6 cards com critérios específicos | ✅ |
| Card com acertos não fica 0 | ✅ (0 consistency errors) |
| Critério negativo não acionado não vira acerto | ✅ |
| Evidência no card correto | ✅ |
| Nota = soma dos 6 cards | ✅ |
| Classificação textual usa nota visual | ✅ |
| Fallback genérico preservado | ✅ |
| Rubricas dos Lotes 1, 2A, 2B e 3 intactas | ✅ |
| Layout inalterado / sem 7º card | ✅ |
| ECG, Open-i, radiologia, exame físico visual, imagens, /api/corrigir | ✅ intactos |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

---

## 9. Cobertura acumulada de rubricas específicas

| Lote | Diagnósticos |
|---|---|
| Inicial | anemia hemolítica, asma |
| Lote 1 | virose pediátrica, dengue clássica, dengue grave, pneumonia pediátrica, gastroenterite, amigdalite/faringite |
| Lote 2A | SCA/IAM, IC descompensada, DPOC exacerbado, pneumonia adulto, TEP, pneumotórax |
| Lote 2B | IC crônica estável, fibrilação atrial, estenose aórtica/valvopatia, pericardite, dissecção de aorta, derrame pleural |
| Lote 3 | sepse, ITU baixa, pielonefrite, meningite, tuberculose, endocardite, celulite/erisipela |
| **Lote 4** | **AVC isquêmico, AIT, AVC hemorrágico, crise convulsiva, cefaleia/HSA, vertigem, rebaixamento de consciência** |

Total: **34 diagnósticos** com rubrica específica; demais seguem fallback genérico.

---

## 10. Próximos passos sugeridos (não implementados agora)

1. Abdome agudo, endócrino/metabólico (CAD, crise tireotóxica), ginecologia/obstetrícia, em lotes futuros.
2. Validação no navegador com atendimentos reais completos.
3. Eventual criação de casos OSCE neurológicos no banco para validação E2E direta do Lote 4.
