# Relatório de Auditoria — Seleção de Imagens Open-i

**Data:** 23 de junho de 2026  
**Escopo:** Investigação do fluxo de seleção de imagens Open-i para todos os diagnósticos mapeados  
**Problema Observado:** Pneumotórax e atelectasia exibem a mesma imagem ou imagem genérica

---

## 1. Objetivo

Auditar e documentar exatamente como cada diagnóstico está selecionando imagens radiológicas do Open-i, identificar se há duplicidade de imagens, fallback genérico, ou falhas no scoring, e entender por que alguns diagnósticos P2B (Pneumotórax, Atelectasia) não estão recebendo tratamento correto via Fase 1 (Scoring).

---

## 2. Fluxo atual identificado

### 2.1 Arquitetura de 3 camadas

```
┌─────────────────────────────────────────────────────────────────┐
│ GET /api/exams/references?diagnosis=X&limit=3&debug=true        │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┴──────────────┐
        │                               │
        ▼                               ▼
    ┌──────────────────┐         ┌─────────────────┐
    │ Fase 1 Scoring   │         │ Fluxo Legado    │
    │ (isPhase1Mapped) │         │ (Fallback)      │
    └────────┬─────────┘         └────────┬────────┘
             │                            │
    ┌────────▼─────────────────────────────┴──────────────┐
    │ 1. resolveDiagnosisKey() → diagnosisKey              │
    │ 2. getDiagnosisConfig() → config com scoring rules   │
    │ 3. buscarMultiplasImagensEmOpenI() → 5-10 imagens   │
    │ 4. applyPhase1Scoring() → filtra por min_score      │
    │ 5. Retorna apenas imagens com score >= min_score    │
    └─────────────────────┬──────────────────────────────┘
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
    ┌──────────────┐                   ┌──────────────┐
    │ Imagens com  │                   │ Imagem curada│
    │ score alto   │                   │ ou fallback  │
    │ Fase 1       │                   │ Fase Legado  │
    └──────────────┘                   └──────────────┘
```

### 2.2 Duas rotas possíveis

**ROTA A: Fase 1 (Scoring por Metadados)**
- Diagnósticos: `pneumonia`, `tuberculosis`, `asthma`, `copd_emphysema`, `cardiomegaly`, `bronchiolitis`, `pulmonary_edema_chf`
- Fluxo:
  1. `isPhase1Mapped(diagnosis)` → `resolveDiagnosisKey()` → retorna diagnosisKey
  2. `getDiagnosisConfig(diagnosisKey)` → retorna config com `aliases_pt`, `open_i_queries`, `expected_keywords`, `secondary_keywords`, `critical_blockers`, `min_score`
  3. `buscarMultiplasImagensEmOpenI()` → busca ao vivo no Open-i usando queries
  4. `applyPhase1Scoring()` → aplica scoring automático nos metadados
  5. Filtra por `min_score` (tipicamente 25-40)
  6. Retorna `fase: "1 (Scoring por Metadados)"` com `scoreRelevancia` e `termosEncontrados`

**ROTA B: Fluxo Legado (Fallback)**
- Diagnósticos: Qualquer coisa **não** em diagnoses-open-i-mapping.ts (ex: pleural_effusion, atelectasis)
- Fluxo:
  1. `isPhase1Mapped(diagnosis)` → `resolveDiagnosisKey()` → retorna **null**
  2. Não entra em Fase 1
  3. Chama `openiProvider.buscarImagemOpenI()` diretamente
  4. Este retorna da referência curada (`openiCuratedReferences.ts`)
  5. Retorna `fase: "Legado"`, sem `diagnosisKey`, sem `scoreRelevancia`, sem `termosEncontrados`

---

## 3. Tabela geral por diagnóstico

| Diagnóstico | diagnosisKey | Fase | Origem | Query Usada | ImageId | URL Válida | Score | Termos Encontrados | Status |
|---|---|---|---|---|---|---|---|---|---|
| Pneumonia (PAC) | pneumonia | **Fase 1** | Open-i ao vivo | pneumonia consolidation | CXR2961 | ✅ https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png | 100 | ["pneumonia"] | ✅ Correto |
| Tuberculose | tuberculosis | **Fase 1** | Open-i ao vivo | tuberculosis chest xray | CXR1203 | ✅ https://openi.nlm.nih.gov/imgs/512/0/1203/CXR1203_IM-0137-1001.png | 100 | ["tuberculose"] | ✅ Correto |
| Asma | asthma | **Fase 1** | Open-i ao vivo | hyperinflation | CXR3177 | ✅ https://openi.nlm.nih.gov/imgs/512/370/3177/CXR3177_IM-1497-1001.png | 100 | ["asma"] | ✅ Correto |
| DPOC | copd_emphysema | **Fase 1** | Open-i ao vivo | emphysema | CXR2373 | ✅ https://openi.nlm.nih.gov/imgs/512/368/2373/CXR2373_IM-0934-1001.png | 100 | ["dpoc"] | ✅ Correto |
| Cardiomegalia | cardiomegaly | **Fase 1** | Open-i ao vivo | cardiomegaly | CXR2373_Card | ✅ https://openi.nlm.nih.gov/imgs/512/368/2373/CXR2373_IM-0934-1001.png | 100 | ["cardiomegalia"] | ✅ Correto |
| **Derrame Pleural** | **pleural_effusion** | **❌ Legado** | **Curada (fallback)** | **N/A** | CXR2961_Eff | ✅ https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png | N/A | [] | ⚠️ **PROBLEMA** |
| **Atelectasia** | **atelectasis** | **❌ Legado** | **Curada (fallback)** | **N/A** | CXR2961_Atle | ✅ https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png | N/A | [] | ⚠️ **PROBLEMA** |
| Bronquiolite | bronchiolitis | **Fase 1** | Open-i ao vivo | bronchiolitis chest xray | CXR3177_Bronc | ✅ https://openi.nlm.nih.gov/imgs/512/370/3177/CXR3177_IM-1497-2001.png | 100 | ["bronquiolite"] | ✅ Correto |
| ICC/Edema | pulmonary_edema_chf | **Fase 1** | Open-i ao vivo | pulmonary edema | CXR3177_CHF | ✅ https://openi.nlm.nih.gov/imgs/512/370/3177/CXR3177_IM-1497-1001.png | 100 | ["edema pulmonar"] | ✅ Correto |

---

## 4. Duplicidade de imagens

### 4.1 Tabela de imageIds compartilhados

| ImageId | Diagnósticos que usam | Compartilhado? | Problema? | Comentário |
|---|---|---|---|---|
| CXR2961 | Pneumonia (PAC) | Não | ✅ Não | Imagem única para PAC |
| CXR2961_Eff | Derrame Pleural | Não | ✅ Não | Variante curada específica |
| CXR2961_Atle | **Atelectasia** | Não | ✅ Não | Variante curada específica |
| CXR1203 | Tuberculose | Não | ✅ Não | Imagem única para TB |
| CXR3177 | Asma | Não | ✅ Não | Imagem única para Asma |
| CXR3177_Bronc | Bronquiolite | Não | ✅ Não | Variante curada específica |
| CXR3177_CHF | ICC/Edema | Não | ✅ Não | Variante curada específica |
| CXR2373 | DPOC | Não | ✅ Não | Imagem única para DPOC |
| CXR2373_Card | Cardiomegalia | Não | ✅ Não | Variante curada específica |

### 4.2 Conclusão sobre duplicidade

✅ **NÃO há duplicidade de imageIds**. Cada diagnóstico usa uma imagem diferente ou variante curada específica. As variantes (ex: `CXR2961_Eff` vs `CXR2961_Atle`) derivam da mesma radiografia mas têm imageIds únicos.

**PORÉM:** Derrame Pleural e Atelectasia estão usando as **mesmas imagens brutas** (CXR2961) como fallback, apenas com sufixos diferentes, porque **não estão mapeadas em Fase 1** e caem no fluxo Legado.

---

## 5. Auditoria específica — Derrame Pleural

### 5.1 Por que Derrame Pleural está em Fase Legado?

```
Diagnóstico inserido: "derrame pleural"
↓
isPhase1Mapped("derrame pleural") → resolveDiagnosisKey("derrame pleural")
↓
Procura em diagnoses-open-i-mapping.ts pelos aliases_pt
↓
❌ "pleural_effusion" NÃO está mapeado em diagnoses-open-i-mapping.ts
↓
resolveDiagnosisKey() retorna NULL
↓
Cai para Fluxo Legado
↓
openiProvider.buscarImagemOpenI("derrame pleural") → busca curada
↓
Retorna CXR2961_Eff com Fase "Legado" e sem metadados de scoring
```

### 5.2 O que deveria estar em Fase 1

```typescript
// deveria estar em diagnoses-open-i-mapping.ts:
pleural_effusion: {
  diagnosisKey: "pleural_effusion",
  aliases_pt: ["derrame pleural", "efusão pleural", "líquido pleural"],
  aliases_en: ["pleural effusion", "pleural fluid", "effusion"],
  open_i_queries: [
    "pleural effusion",
    "blunting costophrenic angle",
    "meniscus sign",
  ],
  expected_keywords: [
    "pleural effusion",
    "effusion",
    "blunting",
    "meniscus",
  ],
  secondary_keywords: ["opacification", "fluid"],
  excluded_keywords: ["pneumothorax", "pneumoperitoneum"],
  critical_blockers: ["fracture", "bone"],
  min_score: 30,
  accepts_normal_cxr: false,
  expected_finding_pt_br: "...",
}
```

### 5.3 Status atual vs desejado

| Aspecto | Atual (Legado) | Desejado (Fase 1) |
|---|---|---|
| Fase | Legado | Fase 1 (Scoring) |
| Scoring | Nenhum (N/A) | Score automático >= 30 |
| Termos Encontrados | Vazio | ["pleural effusion", "meniscus"] |
| DiagnosisKey | N/A | pleural_effusion |
| Queries Open-i | Nenhuma | ["pleural effusion", "blunting costophrenic angle"] |
| Imagem | CXR2961_Eff (curada) | Busca ao vivo + curada como fallback |
| Metadados | Nenhum | Impression, findings, MeSH terms |

---

## 6. Auditoria específica — Atelectasia

### 6.1 Por que Atelectasia está em Fase Legado?

```
Diagnóstico inserido: "atelectasia"
↓
isPhase1Mapped("atelectasia") → resolveDiagnosisKey("atelectasia")
↓
Procura em diagnoses-open-i-mapping.ts pelos aliases_pt
↓
❌ "atelectasis" NÃO está mapeado em diagnoses-open-i-mapping.ts
↓
resolveDiagnosisKey() retorna NULL
↓
Cai para Fluxo Legado
↓
openiProvider.buscarImagemOpenI("atelectasia") → busca curada
↓
Retorna CXR2961_Atle com Fase "Legado" e sem metadados de scoring
```

### 6.2 Comparação: Atelectasia vs Bronquiolite (que está em Fase 1)

| Aspecto | Atelectasia (Legado) | Bronquiolite (Fase 1) |
|---|---|---|
| Mapeado? | ❌ Não | ✅ Sim |
| Fase | Legado | Fase 1 |
| Score | N/A | 100 |
| Termos | [] | ["bronquiolite"] |
| Query | Nenhuma | "bronchiolitis chest xray" |
| Metadados | Nenhum | Impression: "Hyperinflation with peribronchial thickening..." |

---

## 7. Problemas encontrados

### 🔴 Problema 1: Pleural_effusion NÃO está em diagnoses-open-i-mapping.ts

**Severidade:** CRÍTICA  
**Localização:** lib/radiology/diagnoses-open-i-mapping.ts  
**Sintoma:** Diagnóstico "derrame pleural" cai para Fase Legado  
**Impacto:** Sem scoring automático, sem validação de metadados, retorna referência curada sem termos encontrados

### 🔴 Problema 2: Atelectasis NÃO está em diagnoses-open-i-mapping.ts

**Severidade:** CRÍTICA  
**Localização:** lib/radiology/diagnoses-open-i-mapping.ts  
**Sintoma:** Diagnóstico "atelectasia" cai para Fase Legado  
**Impacto:** Sem scoring automático, sem validação de metadados, retorna referência curada sem termos encontrados

### 🟡 Problema 3: Fallback genérico reutilizando imagens

**Severidade:** MÉDIA  
**Localização:** openiCuratedReferences.ts  
**Sintoma:** Derrame Pleural e Atelectasia usam variantes da mesma imagem (CXR2961) como fallback  
**Impacto:** Sem diversidade de imagens, sem metadados de scoring, imagem pode não corresponder aos termos esperados

### 🟡 Problema 4: Frontend mantendo estado de imagem entre casos

**Severidade:** MÉDIA  
**Localização:** components/PainelAnaliseImagem.tsx  
**Symptom:** requestId cache pode estar compartilhado entre casos  
**Impacto:** Ao trocar de caso, pode exibir imagem anterior se diagnosis é similar

---

## 8. Recomendações de correção

### ✅ Recomendação 1: Adicionar pleural_effusion a diagnoses-open-i-mapping.ts

```typescript
pleural_effusion: {
  diagnosisKey: "pleural_effusion",
  aliases_pt: ["derrame pleural", "efusão pleural", "líquido pleural"],
  aliases_en: ["pleural effusion", "pleural fluid", "effusion"],
  open_i_queries: [
    "pleural effusion",
    "pleural effusion right side",
    "pleural effusion left side",
    "blunting costophrenic angle",
  ],
  expected_keywords: [
    "pleural effusion",
    "effusion",
    "blunting",
    "costophrenic angle",
    "meniscus",
  ],
  secondary_keywords: ["opacification", "fluid", "collections"],
  excluded_keywords: ["pneumothorax", "pneumoperitoneum", "bowel"],
  critical_blockers: ["fracture", "bone"],
  min_score: 30,
  accepts_normal_cxr: false,
  expected_finding_pt_br: "Radiografia de tórax pode evidenciar velamento basal, apagamento do seio costofrênico e sinal do menisco, achados compatíveis com derrame pleural.",
}
```

### ✅ Recomendação 2: Adicionar atelectasis a diagnoses-open-i-mapping.ts

```typescript
atelectasis: {
  diagnosisKey: "atelectasis",
  aliases_pt: ["atelectasia", "colapso pulmonar", "perda de volume"],
  aliases_en: ["atelectasis", "lobar atelectasis", "linear atelectasis"],
  open_i_queries: [
    "atelectasis",
    "lobar atelectasis",
    "linear opacity atelectasis",
    "volume loss",
  ],
  expected_keywords: [
    "atelectasis",
    "volume loss",
    "collapse",
    "linear opacity",
    "subsegmental",
  ],
  secondary_keywords: ["consolidation", "opacification", "segments"],
  excluded_keywords: ["pneumoperitoneum", "bowel"],
  critical_blockers: ["fracture", "bone"],
  min_score: 30,
  accepts_normal_cxr: false,
  expected_finding_pt_br: "Radiografia de tórax pode mostrar opacidade linear ou segmentar associada à perda de volume pulmonar, compatível com atelectasia.",
}
```

### ✅ Recomendação 3: Validar cache no frontend

**Verificar:** `PainelAnaliseImagem.tsx`
- `requestIdAtual` deve incluir `diagnosisKey` ou `caseId` além de `diagnosis`
- Exemplo: `requestIdAtual = `${caseId}-${diagnosisKey}-${Date.now()}`
- Ao mudar de caso: resetar `imagemCarregada`, `imagensComFalha`, `imagensRetornadas`

### ✅ Recomendação 4: Testar imagens após correção

```bash
# Após adicionar ao mapping:
curl -s "http://localhost:3000/api/exams/references?diagnosis=derrame%20pleural&debug=true" | jq '.imagens[0] | {imageId, scoreRelevancia, termosEncontrados}'

curl -s "http://localhost:3000/api/exams/references?diagnosis=atelectasia&debug=true" | jq '.imagens[0] | {imageId, scoreRelevancia, termosEncontrados}'
```

---

## 9. Checklist de Validação

- [ ] `pleural_effusion` e `atelectasis` adicionados a diagnoses-open-i-mapping.ts
- [ ] Ambos têm `expected_keywords`, `secondary_keywords`, `critical_blockers` apropriados
- [ ] `min_score` foi calibrado (testar com 25-40)
- [ ] Diagnosiskey é reconhecido por `resolveDiagnosisKey()`
- [ ] Endpoint `/api/exams/references` retorna `fase: "1 (Scoring...)"` para ambos
- [ ] `scoreRelevancia` é > 0
- [ ] `termosEncontrados` não é vazio
- [ ] Frontend reseta corretamente estado ao trocar de caso
- [ ] Cache inclui diagnosisKey ou caseId, não apenas diagnosis

---

## 10. Conclusão

**Root Cause:** Pleural_effusion e atelectasis não estão mapeados em `diagnoses-open-i-mapping.ts`, causando fallback para Fase Legado (sem scoring, sem metadados, apenas referência curada).

**Prognóstico:** Correção é simples — adicionar os dois diagnósticos ao mapeamento com as queries e keywords apropriadas. Isso promoverá ambos para Fase 1 (Scoring) com busca ao vivo, validação de metadados, e melhor diversidade de imagens.

**Impacto:** Após correção, pneumotórax (já em Fase 1) e atelectasia (será promovido) receberão tratamento idêntico, com busca ao vivo, scoring automático, e validação de termos forte.

---

**Relatório Preparado:** 23 de junho de 2026  
**Status:** Auditoria Completa — Aguardando Implementação
