# Lote 3 — Rubricas Específicas Infectologia / Urgência Adulto

**Data:** 26 de junho de 2026
**Status:** ✅ Implementado e testado
**Objetivo:** Adicionar microcritérios específicos para 7 diagnósticos infecciosos/urgência adulto, com desambiguações seguras entre infecções que podem aparecer como causa umas das outras, mantendo fallback genérico, nota, classificação e layout, sem regressão nos lotes anteriores.

---

## 1. Diagnósticos do lote (7)

| Chave | Diagnóstico |
|---|---|
| `sepse_choque_septico` | Sepse / choque séptico |
| `itu_baixa_cistite` | ITU baixa / cistite |
| `pielonefrite` | Pielonefrite |
| `meningite` | Meningite |
| `tuberculose_pulmonar` | Tuberculose pulmonar |
| `endocardite_infecciosa` | Endocardite infecciosa |
| `celulite_erisipela` | Celulite / erisipela |

Cada um com microcritérios atômicos nos 6 cards (Comunicação, Anamnese, Exame físico, Exames complementares, Raciocínio diagnóstico, Conduta e Segurança).

---

## 2. Arquivos alterados (1)

| Arquivo | Mudança |
|---|---|
| `lib/healthbench/diagnosis-microcriteria.ts` | 7 rubricas + aliases; `DiagnosticoRubricaKey` ampliado; marcador de ITU alta; alias genérico `itu` |

> `rubric-adapter.ts`, `feedback-view-builder.ts`, `cards-config.ts`, `components/FeedbackOSCE.tsx`, `/api/corrigir`, ECG, Open-i, radiologia, exame físico visual e geração de imagens **não foram tocados** (a integração já estava pronta dos lotes anteriores).

---

## 3. Aliases adicionados

| Chave | Aliases |
|---|---|
| `sepse_choque_septico` | sepse, choque septico, sepse grave, sindrome septica, infeccao generalizada |
| `itu_baixa_cistite` | itu, itu baixa, infeccao urinaria, infeccao urinaria baixa, cistite, disuria, sindrome disurica, infeccao do trato urinario baixo |
| `pielonefrite` | pielonefrite, infeccao urinaria alta, itu alta, dor lombar febril, giordano positivo, punho percussao positiva |
| `meningite` | meningite, meningite bacteriana, meningite viral, meningoencefalite, rigidez de nuca, sindrome meningea, cefaleia febril com rigidez |
| `tuberculose_pulmonar` | tuberculose, tuberculose pulmonar, tb, tb pulmonar, tosse cronica, bacilifero |
| `endocardite_infecciosa` | endocardite, endocardite infecciosa, infeccao valvar, vegetacao valvar, febre com sopro |
| `celulite_erisipela` | celulite, erisipela, infeccao de pele, celulite infecciosa, placa eritematosa, pele vermelha dolorosa, membro inferior vermelho |

---

## 4. Desambiguações

| Cenário | Mecanismo | Exemplo |
|---|---|---|
| **ITU baixa × pielonefrite** | marcador de sinais altos (`pielonefrite \| itu alta \| infeccao urinaria alta \| dor lombar \| flanco \| giordano \| punho percussao`) promove cistite → pielonefrite | "ITU com febre alta e dor lombar" → `pielonefrite` |
| **Sepse × foco específico** | menor posição (diagnóstico principal vem primeiro) | "Sepse com Choque Séptico por Pielonefrite" → `sepse_choque_septico` |
| **Pielonefrite com sepse** | menor posição | → `pielonefrite` |
| **TB × DPOC (tosse crônica)** | menor posição | "DPOC exacerbado com tosse crônica" → `dpoc_exacerbado` |
| **Endocardite × sepse** | menor posição | "Endocardite infecciosa com sepse" → `endocardite_infecciosa` |
| **Celulite × sepse** | menor posição | "Celulite com sinais sistêmicos" → `celulite_erisipela` |

Proteções de aliases curtos:
- `tb` casa apenas isolado (word boundary), não dentro de palavras.
- `itu` validado sem falso positivo ("constituição federal" → `null`).
- `disuria`, `itu alta`, `itu baixa` — específicos.

A **menor posição no texto** (introduzida no Lote 2B) resolve 4 dos 5 cenários de "infecção como causa de outra"; apenas ITU baixa × pielonefrite usou marcador dedicado.

---

## 5. Regras mantidas

- Microcritérios atômicos; específicos têm prioridade; genéricos completam a cobertura mínima.
- Deduplicação por texto normalizado.
- HealthBench (grader) decide se cada microcritério foi cumprido.
- Consistência: card com acertos não fica 0 sem penalidade crítica visível; senão `[FEEDBACK HB CONSISTENCY ERROR]` + piso mínimo.

---

## 6. Testes — Lote 3

### Casos reais (E2E)
| Caso | Diagnóstico | Rubrica aplicada | Consistência | Nota = soma |
|---|---|---|---|---|
| 11 | Tuberculose Pulmonar Ativa | `tuberculose_pulmonar` | ✅ | ✅ |
| 13 | Endocardite Infecciosa Subaguda | `endocardite_infecciosa` | ✅ | ✅ |
| 59 | Sepse com Choque Séptico por Pielonefrite | `sepse_choque_septico` (não pielonefrite) | ✅ | ✅ |

### Identificação por alias (cistite, ITU baixa/alta, pielonefrite, meningite, celulite, sepse de foco)
Todos corretos, incluindo as desambiguações da seção 4.

Exemplo de especificidade (TB — Exames complementares): teste rápido molecular para tuberculose; baciloscopia ou cultura de escarro; radiografia de tórax.

---

## 7. Testes de não-regressão (Lotes 1, 2A e 2B)

Identificação 16/16 correta:
- **Lote 1:** dengue grave, virose pediátrica, gastroenterite, amigdalite.
- **Lote 2A:** SCA/IAM, IC descompensada, DPOC, TEP, pneumotórax (+ pneumonia adulto/pediátrica separadas).
- **Lote 2B:** IC crônica estável, fibrilação atrial, estenose aórtica, pericardite, dissecção de aorta, derrame pleural.

E2E confirmou caso 16 → `derrame_pleural` e caso 1 → `sca_iam`. Diagnóstico não mapeado (HAS) → `null` (fallback).

---

## 8. Confirmações

| Item | Status |
|---|---|
| 7 rubricas do lote implementadas | ✅ |
| ITU baixa não captura pielonefrite (e vice-versa) | ✅ |
| Sepse de foco não vira apenas o foco | ✅ |
| TB não captura DPOC com tosse crônica | ✅ |
| Endocardite com sepse não vira sepse | ✅ |
| Todos os 6 cards com critérios específicos | ✅ |
| Card com acertos não fica 0 | ✅ (0 consistency errors) |
| Critério negativo não acionado não vira acerto | ✅ |
| Evidência no card correto | ✅ |
| Nota = soma dos 6 cards | ✅ |
| Classificação textual usa nota visual | ✅ |
| Fallback genérico preservado | ✅ |
| Rubricas dos Lotes 1, 2A e 2B intactas | ✅ |
| Layout inalterado / sem 7º card | ✅ |
| ECG, Open-i, radiologia, exame físico visual, imagens, /api/corrigir | ✅ intactos |

`lib/healthbench` sem erros de tipo. `npm run build` segue bloqueado apenas pelo erro **pré-existente de ECG** (`leadTransform.ts:286`); o app compila e roda em dev.

> As notas dos testes são baixas porque o atendimento de teste é sintético/genérico (o grader marca critérios como não cumpridos) — não é bug.

---

## 9. Cobertura acumulada de rubricas específicas

| Lote | Diagnósticos |
|---|---|
| Inicial | anemia hemolítica, asma |
| Lote 1 | virose pediátrica, dengue clássica, dengue grave, pneumonia pediátrica, gastroenterite, amigdalite/faringite |
| Lote 2A | SCA/IAM, IC descompensada, DPOC exacerbado, pneumonia adulto, TEP, pneumotórax |
| Lote 2B | IC crônica estável, fibrilação atrial, estenose aórtica/valvopatia, pericardite, dissecção de aorta, derrame pleural |
| **Lote 3** | **sepse, ITU baixa, pielonefrite, meningite, tuberculose, endocardite, celulite/erisipela** |

Total: **27 diagnósticos** com rubrica específica; demais seguem fallback genérico.

---

## 10. Próximos passos sugeridos (não implementados agora)

1. Neurologia (AVC, cefaleia, crise convulsiva), abdome agudo, endócrino/metabólico (CAD, crise tireotóxica), em lotes futuros.
2. Validação no navegador com atendimentos reais completos.
