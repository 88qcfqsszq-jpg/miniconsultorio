# Relatório de Correspondência — Sons Clínicos HLS-CMDS

> Gerado a partir do catálogo canônico `lib/clinical-sounds/soundsCatalog.ts`
> (produzido por `scripts/gen-sounds-catalog.mjs` lendo `docs/LS.csv`, `docs/HS.csv`
> e verificando cada arquivo em `public/HLS-CMDS/LS|HS`). Data: 2026-07-02.

## 1) Contagem — CSVs e arquivos
| Fonte | Quantidade |
|---|---|
| Registros em LS.csv | 50 |
| Registros em HS.csv | 50 |
| Arquivos public/HLS-CMDS/LS/*.wav | 50 |
| Arquivos public/HLS-CMDS/HS/*.wav | 50 |
| **Total de sons catalogados** | **100** (50 pulmonares + 50 cardíacos) |
| Correspondência exata | 86 |
| Código traduzido (C/G→FC/CC) | 14 |

## 2) Sons pulmonares — CSV ID → arquivo .wav (50)
| CSV ID | Tipo (PT) | Gên. | Local | Arquivo .wav | Mapeamento |
|---|---|---|---|---|---|
| M_N_RUA | Normal (Normal (murmúrio vesicular)) | M | RUA | M_N_RUA.wav | exata |
| F_N_LUA | Normal (Normal (murmúrio vesicular)) | F | LUA | F_N_LUA.wav | exata |
| F_N_RMA | Normal (Normal (murmúrio vesicular)) | F | RMA | F_N_RMA.wav | exata |
| F_N_LMA | Normal (Normal (murmúrio vesicular)) | F | LMA | F_N_LMA.wav | exata |
| M_N_RLA | Normal (Normal (murmúrio vesicular)) | M | RLA | M_N_RLA.wav | exata |
| M_N_LLA | Normal (Normal (murmúrio vesicular)) | M | LLA | M_N_LLA.wav | exata |
| M_PR_RMA | Pleural Rub (Atrito pleural) | M | RMA | M_PR_RMA.wav | exata |
| M_PR_LUA | Pleural Rub (Atrito pleural) | M | LUA | M_PR_LUA.wav | exata |
| F_R_LUA | Rhonchi (Roncos) | F | LUA | F_R_LUA.wav | exata |
| M_W_LUA | Wheezing (Sibilos) | M | LUA | M_W_LUA.wav | exata |
| M_C_LUA | Fine Crackles (Crepitações finas) | M | LUA | M_FC_LUA.wav | C/G→FC/CC |
| M_N_LUA | Normal (Normal (murmúrio vesicular)) | M | LUA | M_N_LUA.wav | exata |
| M_G_LLA | Coarse Crackles (Crepitações grossas) | M | LLA | M_CC_LLA.wav | C/G→FC/CC |
| M_G_LUA | Coarse Crackles (Crepitações grossas) | M | LUA | M_CC_LUA.wav | C/G→FC/CC |
| F_C_LUA | Fine Crackles (Crepitações finas) | F | LUA | F_FC_LUA.wav | C/G→FC/CC |
| M_G_RLA | Coarse Crackles (Crepitações grossas) | M | RLA | M_CC_RLA.wav | C/G→FC/CC |
| F_R_RLA | Rhonchi (Roncos) | F | RLA | F_R_RLA.wav | exata |
| F_W_RUA | Wheezing (Sibilos) | F | RUA | F_W_RUA.wav | exata |
| M_PR_LLA | Pleural Rub (Atrito pleural) | M | LLA | M_PR_LLA.wav | exata |
| M_PR_LMA | Pleural Rub (Atrito pleural) | M | LMA | M_PR_LMA.wav | exata |
| M_R_RUA | Rhonchi (Roncos) | M | RUA | M_R_RUA.wav | exata |
| M_C_RUA | Fine Crackles (Crepitações finas) | M | RUA | M_FC_RUA.wav | C/G→FC/CC |
| M_R_LUA | Rhonchi (Roncos) | M | LUA | M_R_LUA.wav | exata |
| F_PR_LMA | Pleural Rub (Atrito pleural) | F | LMA | F_PR_LMA.wav | exata |
| F_G_LMA | Coarse Crackles (Crepitações grossas) | F | LMA | F_CC_LMA.wav | C/G→FC/CC |
| F_G_RLA | Coarse Crackles (Crepitações grossas) | F | RLA | F_CC_RLA.wav | C/G→FC/CC |
| M_C_RLA | Fine Crackles (Crepitações finas) | M | RLA | M_FC_RLA.wav | C/G→FC/CC |
| F_G_RMA | Coarse Crackles (Crepitações grossas) | F | RMA | F_CC_RMA.wav | C/G→FC/CC |
| M_W_RLA | Wheezing (Sibilos) | M | RLA | M_W_RLA.wav | exata |
| M_R_RLA | Rhonchi (Roncos) | M | RLA | M_R_RLA.wav | exata |
| F_C_RLA | Fine Crackles (Crepitações finas) | F | RLA | F_FC_RLA.wav | C/G→FC/CC |
| M_N_RMA | Normal (Normal (murmúrio vesicular)) | M | RMA | M_N_RMA.wav | exata |
| M_R_LMA | Rhonchi (Roncos) | M | LMA | M_R_LMA.wav | exata |
| F_G_LLA | Coarse Crackles (Crepitações grossas) | F | LLA | F_CC_LLA.wav | C/G→FC/CC |
| F_R_LMA | Rhonchi (Roncos) | F | LMA | F_R_LMA.wav | exata |
| F_N_LLA | Normal (Normal (murmúrio vesicular)) | F | LLA | F_N_LLA.wav | exata |
| M_W_RUA | Wheezing (Sibilos) | M | RUA | M_W_RUA.wav | exata |
| M_N_LMA | Normal (Normal (murmúrio vesicular)) | M | LMA | M_N_LMA.wav | exata |
| F_PR_LLA | Pleural Rub (Atrito pleural) | F | LLA | F_PR_LLA.wav | exata |
| M_W_RMA | Wheezing (Sibilos) | M | RMA | M_W_RMA.wav | exata |
| M_PR_RUA | Pleural Rub (Atrito pleural) | M | RUA | M_PR_RUA.wav | exata |
| M_W_LLA | Wheezing (Sibilos) | M | LLA | M_W_LLA.wav | exata |
| M_R_LLA | Rhonchi (Roncos) | M | LLA | M_R_LLA.wav | exata |
| F_N_RLA | Normal (Normal (murmúrio vesicular)) | F | RLA | F_N_RLA.wav | exata |
| M_G_LMA | Coarse Crackles (Crepitações grossas) | M | LMA | M_CC_LMA.wav | C/G→FC/CC |
| M_W_LMA | Wheezing (Sibilos) | M | LMA | M_W_LMA.wav | exata |
| F_N_RUA | Normal (Normal (murmúrio vesicular)) | F | RUA | F_N_RUA.wav | exata |
| M_PR_RLA | Pleural Rub (Atrito pleural) | M | RLA | M_PR_RLA.wav | exata |
| F_G_LUA | Coarse Crackles (Crepitações grossas) | F | LUA | F_CC_LUA.wav | C/G→FC/CC |
| F_PR_LUA | Pleural Rub (Atrito pleural) | F | LUA | F_PR_LUA.wav | exata |

## 3) Sons cardíacos — CSV ID → arquivo .wav (50)
| CSV ID | Tipo (PT) | Gên. | Local | Arquivo .wav | Mapeamento |
|---|---|---|---|---|---|
| F_N_RC | Normal (Normal (B1 e B2)) | F | RC | F_N_RC.wav | exata |
| F_N_LC | Normal (Normal (B1 e B2)) | F | LC | F_N_LC.wav | exata |
| M_N_RUSB | Normal (Normal (B1 e B2)) | M | RUSB | M_N_RUSB.wav | exata |
| F_N_LUSB | Normal (Normal (B1 e B2)) | F | LUSB | F_N_LUSB.wav | exata |
| F_N_LLSB | Normal (Normal (B1 e B2)) | F | LLSB | F_N_LLSB.wav | exata |
| F_N_A | Normal (Normal (B1 e B2)) | F | Apex | F_N_A.wav | exata |
| M_LDM_LC | Late Diastolic Murmur (Sopro diastólico tardio) | M | LC | M_LDM_LC.wav | exata |
| M_MSM_A | Mid Systolic Murmur (Sopro mesossistólico) | M | Apex | M_MSM_A.wav | exata |
| F_N_RUSB | Normal (Normal (B1 e B2)) | F | RUSB | F_N_RUSB.wav | exata |
| F_MSM_A | Mid Systolic Murmur (Sopro mesossistólico) | F | Apex | F_MSM_A.wav | exata |
| M_N_LC | Normal (Normal (B1 e B2)) | M | LC | M_N_LC.wav | exata |
| F_LSM_LUSB | Late Systolic Murmur (Sopro sistólico tardio) | F | LUSB | F_LSM_LUSB.wav | exata |
| M_LSM_RUSB | Late Systolic Murmur (Sopro sistólico tardio) | M | RUSB | M_LSM_RUSB.wav | exata |
| F_AF_A | Atrial Fibrillation (Fibrilação atrial) | F | Apex | F_AF_A.wav | exata |
| F_S4_RC | S4 (B4 (quarta bulha)) | F | RC | F_S4_RC.wav | exata |
| F_ESM_RUSB | Early Systolic Murmur (Sopro protossistólico) | F | RUSB | F_ESM_RUSB.wav | exata |
| F_LSM_A | Late Systolic Murmur (Sopro sistólico tardio) | F | Apex | F_LSM_A.wav | exata |
| M_MSM_LUSB | Mid Systolic Murmur (Sopro mesossistólico) | M | LUSB | M_MSM_LUSB.wav | exata |
| F_ESM_LUSB | Early Systolic Murmur (Sopro protossistólico) | F | LUSB | F_ESM_LUSB.wav | exata |
| M_MSM_RC | Mid Systolic Murmur (Sopro mesossistólico) | M | RC | M_MSM_RC.wav | exata |
| M_LDM_LUSB | Late Diastolic Murmur (Sopro diastólico tardio) | M | LUSB | M_LDM_LUSB.wav | exata |
| M_ESM_RUSB | Early Systolic Murmur (Sopro protossistólico) | M | RUSB | M_ESM_RUSB.wav | exata |
| M_S3_LUSB | S3 (B3 (terceira bulha)) | M | LUSB | M_S3_LUSB.wav | exata |
| F_LDM_A | Late Diastolic Murmur (Sopro diastólico tardio) | F | Apex | F_LDM_A.wav | exata |
| M_ESM_LUSB | Early Systolic Murmur (Sopro protossistólico) | M | LUSB | M_ESM_LUSB.wav | exata |
| F_S3_LLSB | S3 (B3 (terceira bulha)) | F | LLSB | F_S3_LLSB.wav | exata |
| M_LDM_LLSB | Late Diastolic Murmur (Sopro diastólico tardio) | M | LLSB | M_LDM_LLSB.wav | exata |
| F_AF_LUSB | Atrial Fibrillation (Fibrilação atrial) | F | LUSB | F_AF_LUSB.wav | exata |
| F_T_RC | Tachycardia (Taquicardia) | F | LC | F_T_RC.wav | exata |
| F_T_A | Tachycardia (Taquicardia) | F | Apex | F_T_A.wav | exata |
| F_LDM_LUSB | Late Diastolic Murmur (Sopro diastólico tardio) | F | LUSB | F_LDM_LUSB.wav | exata |
| F_S3_A | S3 (B3 (terceira bulha)) | F | Apex | F_S3_A.wav | exata |
| M_S4_LUSB | S4 (B4 (quarta bulha)) | M | LUSB | M_S4_LUSB.wav | exata |
| M_AVB_LLSB | AV Block (Bloqueio AV) | M | LLSB | M_AVB_LLSB.wav | exata |
| F_S3_LC | S3 (B3 (terceira bulha)) | F | LC | F_S3_LC.wav | exata |
| M_AVB_A | AV Block (Bloqueio AV) | M | Apex | M_AVB_A.wav | exata |
| M_T_LUSB | Tachycardia (Taquicardia) | M | LUSB | M_T_LUSB.wav | exata |
| M_AF_LC | Atrial Fibrillation (Fibrilação atrial) | M | LC | M_AF_LC.wav | exata |
| M_LSM_LUSB | Late Systolic Murmur (Sopro sistólico tardio) | M | LUSB | M_LSM_LUSB.wav | exata |
| F_LDM_LLSB | Late Diastolic Murmur (Sopro diastólico tardio) | F | LLSB | F_LDM_LLSB.wav | exata |
| F_MSM_LUSB | Mid Systolic Murmur (Sopro mesossistólico) | F | LUSB | F_MSM_LUSB.wav | exata |
| F_MSM_LLSB | Mid Systolic Murmur (Sopro mesossistólico) | F | LLSB | F_MSM_LLSB.wav | exata |
| M_AVB_RC | AV Block (Bloqueio AV) | M | RC | M_AVB_RC.wav | exata |
| M_N_LLSB | Normal (Normal (B1 e B2)) | M | LLSB | M_N_LLSB.wav | exata |
| M_MSM_RUSB | Mid Systolic Murmur (Sopro mesossistólico) | M | RUSB | M_MSM_RUSB.wav | exata |
| M_S3_LLSB | S3 (B3 (terceira bulha)) | M | LLSB | M_S3_LLSB.wav | exata |
| F_ESM_LLSB | Early Systolic Murmur (Sopro protossistólico) | F | LLSB | F_ESM_LLSB.wav | exata |
| F_LSM_LLSB | Late Systolic Murmur (Sopro sistólico tardio) | F | LLSB | F_LSM_LLSB.wav | exata |
| M_ESM_A | Early Systolic Murmur (Sopro protossistólico) | M | Apex | M_ESM_A.wav | exata |
| M_AF_RUSB | Atrial Fibrillation (Fibrilação atrial) | M | RUSB | M_AF_RUSB.wav | exata |

## 4) Mapeamentos de código traduzido C→FC e G→CC (14)
O CSV pulmonar codifica **Fine Crackles como `_C_`** e **Coarse Crackles como `_G_`**,
enquanto os arquivos reais usam **`_FC_`** e **`_CC_`**. Mesmo gênero e localização; muda só o código do tipo.
- `M_C_LUA` → `M_FC_LUA.wav` (Fine Crackles)
- `M_G_LLA` → `M_CC_LLA.wav` (Coarse Crackles)
- `M_G_LUA` → `M_CC_LUA.wav` (Coarse Crackles)
- `F_C_LUA` → `F_FC_LUA.wav` (Fine Crackles)
- `M_G_RLA` → `M_CC_RLA.wav` (Coarse Crackles)
- `M_C_RUA` → `M_FC_RUA.wav` (Fine Crackles)
- `F_G_LMA` → `F_CC_LMA.wav` (Coarse Crackles)
- `F_G_RLA` → `F_CC_RLA.wav` (Coarse Crackles)
- `M_C_RLA` → `M_FC_RLA.wav` (Fine Crackles)
- `F_G_RMA` → `F_CC_RMA.wav` (Coarse Crackles)
- `F_C_RLA` → `F_FC_RLA.wav` (Fine Crackles)
- `F_G_LLA` → `F_CC_LLA.wav` (Coarse Crackles)
- `M_G_LMA` → `M_CC_LMA.wav` (Coarse Crackles)
- `F_G_LUA` → `F_CC_LUA.wav` (Coarse Crackles)

## 5) Confirmação — nenhum som inventado
- O `translatedType` exibido deriva 1:1 do `originalType` do CSV; o gerador **aborta** se algum `.wav` não existir (nada de som aproximado).
- Todos os 100 itens têm `audioUrl` apontando para um arquivo **existente** em `public/HLS-CMDS`.
- Discrepância de nomenclatura (crepitações) resolvida **apenas** pelo mapa oficial C/G→FC/CC; o restante é correspondência exata.

## 6) Conceitos sem áudio nesta base (seção separada na UI)
- **Estridor:** não existe em LS.csv nem nos arquivos LS.
- **Atrito pericárdico:** não existe em HS.csv nem nos arquivos HS.
- **Atenção:** `Pleural Rub` na base é **atrito pleural** (pulmonar), **não** atrito pericárdico.
Esses conceitos aparecem em bloco próprio ("Conceitos sem áudio nesta base"), nunca misturados aos sons reais.

## 7) Validação HTTP (200 · audio/wav)
| Exemplo | Resultado |
|---|---|
| /HLS-CMDS/LS/M_N_RUA.wav | 200 · audio/wav |
| /HLS-CMDS/LS/M_FC_RLA.wav | 200 · audio/wav |
| /HLS-CMDS/LS/M_CC_LLA.wav | 200 · audio/wav |
| /HLS-CMDS/HS/M_N_RUSB.wav | 200 · audio/wav |
| /HLS-CMDS/HS/M_MSM_A.wav | 200 · audio/wav |
| /HLS-CMDS/HS/M_LDM_LLSB.wav | 200 · audio/wav |

## 8) Validação Playwright
- `/centro-clinico/sons` abre; item "Centro Clínico" ativo.
- **50 sons pulmonares** e **50 sons cardíacos** acessíveis (contador da UI confirma).
- Filtros funcionam: tipo Wheezing → 7; +gênero F → 1; foco Apex (cardíaco) → 10.
- Modo Treino oculta o tipo, mostra 4 perguntas e **revela o tipo correto do áudio** (ex.: `F_N_RC.wav` → "Normal (B1 e B2)").
- **Coerência áudio ↔ metadados:** o `src` do player termina exatamente com o `arquivo` e o `CSV ID` exibidos no card.
- Intactas: `/centro-clinico`, `/centro-clinico/imagens`, `/exames`, `/fluxos`, `/semiologia` e `/caso/1` (chat + 6 itens do menu interno).
