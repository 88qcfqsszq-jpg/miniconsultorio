# Relatório — Unificação da Ausculta do OSCE (ETAPA 6)

_Data: 2026-07-02. Refatoração arquitetural: soundsCatalog.ts como ÚNICA fonte de verdade._

## Resumo
- **Casos auditados:** 61 (adultos). Validador: **61 OK / 0 falhas**.
- **soundsCatalog.ts é a única fonte de verdade** para os 100 sons. `pulmonar-sounds.ts` e `cardiaco-sounds.ts` viraram **adaptadores** (projeções do catálogo) — sem catálogo próprio, sem RAW_IDS, sem `.wav` hardcoded.
- **Fluxo oficial:** Caso → achado semiológico → tipo oficial → soundsCatalog → arquivo .wav.

## Contagens
| Métrica | Valor |
|---|---|
| Casos auditados | 61 |
| Casos com padrão pulmonar não-normal | 14 |
| Casos com padrão cardíaco não-normal | 8 |
| Pulmonar — áudio real patológico | 12 |
| Pulmonar — silêncio didático | 2 (pneumotórax, derrame) |
| Pulmonar — proxy identificado | 1 (atelectasia) |
| Cardíaco — áudio real patológico | 7 |
| Cardíaco — silêncio didático | 1 (pericardite) |
| Falhas de arquivo | 0 |

## Duplicidade de fonte
- **Eliminada.** Antes existiam dois catálogos dos mesmos 50 .wav pulmonares (`pulmonar-sounds.ts` RAW_IDS × `soundsCatalog.ts`). Agora `pulmonar-sounds.ts` e `cardiaco-sounds.ts` derivam de `CLINICAL_SOUNDS`. **Existe apenas UM catálogo real.**

## Confirmação
✅ **soundsCatalog.ts tornou-se a única fonte de verdade** para todos os sons clínicos (Centro Clínico + OSCE pulmonar + OSCE cardíaco).

## Tabela — casos com ausculta PULMONAR não-normal (14)
| Caso | Diagnóstico | Padrão | Arquivo | Áudio real? | Resultado |
|---|---|---|---|---|---|
| 2 | Pneumonia Adquirida na Comunidade | pneumonia | M_CC_RLA.wav | sim | OK |
| 3 | Asma Aguda | asma | F_W_RUA.wav | sim | OK |
| 6 | Pneumonia Atípica | pneumonia | M_CC_RLA.wav | sim | OK |
| 8 | Insuficiência Cardíaca Sistólica | edema_ic | M_FC_RLA.wav | sim | OK |
| 9 | DPOC em Exacerbação | dpoc | F_W_RUA.wav | sim | OK |
| 11 | Tuberculose Pulmonar Ativa | tuberculose | M_CC_LLA.wav | sim | OK |
| 16 | Derrame Pleural | derrame | — | silêncio | OK |
| 31 | Asma Aguda Leve-Moderada | asma | F_W_RUA.wav | sim | OK |
| 32 | Crise Asmática Grave (Status Asthmaticus) | asma | F_W_RUA.wav | sim | OK |
| 33 | DPOC Estável | dpoc | F_W_RUA.wav | sim | OK |
| 34 | Exacerbação Aguda de DPOC | dpoc | F_W_RUA.wav | sim | OK |
| 57 | HIV/AIDS com Pneumonia por Pneumocystis jirovecii | pneumonia | M_CC_RLA.wav | sim | OK |
| 62 | Pneumotórax | pneumotorax | — | silêncio | OK |
| 63 | Atelectasia | atelectasia | M_FC_RLA.wav | sim | OK (proxy) |

## Tabela — casos com ausculta CARDÍACA não-normal (8)
| Caso | Diagnóstico | Padrão | Arquivo | Áudio real? | Resultado |
|---|---|---|---|---|---|
| 7 | Pericardite Aguda | pericardite | — | silêncio | OK |
| 8 | Insuficiência Cardíaca Sistólica | insuficiencia_cardiaca | F_S3_A.wav | sim | OK |
| 13 | Endocardite Infecciosa | endocardite | M_MSM_A.wav | sim | OK |
| 14 | Estenose Mitral | estenose_mitral | F_LDM_A.wav | sim | OK |
| 21 | Fibrilação Atrial Paroxística | fibrilacao_atrial | F_AF_A.wav | sim | OK |
| 23 | Insuficiência Mitral Crônica | insuficiencia_mitral | M_MSM_A.wav | sim | OK |
| 24 | Estenose Aórtica Grave | estenose_aortica | M_MSM_RUSB.wav | sim | OK |
| 26 | Estenose Mitral com Fibrilação Atrial | estenose_mitral | F_LDM_A.wav | sim | OK |

## Correções aplicadas (FASE 4)
- **Pneumotórax [62]:** deixou de tocar MV normal → **silêncio didático** "Murmúrio vesicular abolido. A biblioteca HLS-CMDS não possui este som." no hemitórax acometido.
- **Derrame pleural [16]:** mesmo tratamento (MV reduzido em base, sem áudio).
- **Atelectasia [63]:** mantém crepitações finas como **proxy**, agora rotulado "Áudio utilizado como aproximação."
- **Pericardite [7]:** atrito pericárdico **não existe** na base → silêncio didático "Atrito pericárdico não disponível nesta biblioteca."

## FASE 5 — metadados no player
Ao responder, o card mostra (treino do aluno, não ao paciente): **Tipo · Local · Arquivo · Origem · Correspondência** (validada / código traduzido / sem áudio).

## FASE 7 — validação
- **type-check:** limpo nos arquivos da ausculta (persistem só os erros PRÉ-EXISTENTES em `src/services/ecgGenerator/*`).
- **build:** `✓ Compiled successfully`.
- **validador (`scripts/validate-ausculta-osce.mjs`):** 61/61 casos OK.
- **Playwright:** páginas intactas (dashboard, centro-clínico + 5 subrotas, guia, sons=50); no fluxo real do caso — PAC toca `F_CC_RLA.wav`, Estenose Mitral toca `F_LDM_A.wav` (foco mitral), Pericardite = silêncio.

## Arquivos
**Novos:** `lib/ausculta/cardiaco-sounds.ts`, `lib/ausculta/cardiaco-case-mapping.ts`, `components/ausculta/CardiacAuscultationPanel.tsx`, `components/ausculta/AuscultaSoundMeta.tsx`, `scripts/validate-ausculta-osce.mjs`.
**Alterados:** `lib/ausculta/pulmonar-sounds.ts` (adaptador), `lib/ausculta/pulmonar-case-mapping.ts` (silêncio/proxy), `components/ausculta/PulmonaryAuscultationPanel.tsx` (silêncio+metadados), `components/ExameFisicoAdultoVisual.tsx` (painel cardíaco wired).
**Intactos:** HealthBench, feedback, ECG, Centro Clínico, rubricas.
