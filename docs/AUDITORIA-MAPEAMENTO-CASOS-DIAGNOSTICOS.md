# Auditoria — Mapeamento Casos ↔ Diagnósticos

**Data:** 23 de junho de 2026  
**Status:** ✅ PROBLEMAS IDENTIFICADOS

---

## 🔴 Problema Descoberto

Os IDs de casos usados no teste de imagens **NÃO correspondiam aos diagnósticos corretos**:

| ID Testado | Esperado | Real | Problema |
|---|---|---|---|
| 1 | Pneumonia | SCA | ❌ ERRADO |
| 10 | Asma | TEP | ❌ ERRADO |
| 16 | Derrame Pleural | Derrame Pleural | ✅ CERTO |
| 30 | DPOC | DAOP | ❌ ERRADO |
| 62 | Pneumotórax | Pneumotórax | ✅ CERTO |
| 63 | Atelectasia | Atelectasia | ✅ CERTO |

**Taxa de acerto:** 3/6 (50%) ❌

---

## 📊 Mapeamento Correto Completo

### Todos os 61 Casos

| ID | Título | Diagnóstico | Categoria |
|---|---|---|---|
| 1 | Dor Torácica - SCA | Síndrome Coronariana Aguda (SCA) - IAMCSST | SCA |
| 2 | Pneumonia Adquirida na Comunidade | Pneumonia Adquirida na Comunidade (PAC) | **Pneumonia** ✅ |
| 3 | Asma Aguda | Asma Aguda (Crise Asmática Moderada) | **Asma** ✅ |
| 4 | Dor Torácica - Angina | Angina Estável | SCA |
| 5 | Hipertensão Arterial | Hipertensão Arterial Sistêmica Estágio 1 | HAS |
| 6 | Pneumonia Atípica | Pneumonia Atípica (Mycoplasma pneumoniae) | **Pneumonia** ✅ |
| 7 | Pericardite Aguda | Pericardite Aguda | Pericardite |
| 8 | Insuficiência Cardíaca | Insuficiência Cardíaca Sistólica (FEVE reduzida) | IC |
| 9 | DPOC - Exacerbação | DPOC - Exacerbação Aguda | **DPOC** ✅ |
| 10 | Tromboembolismo Pulmonar | Tromboembolismo Pulmonar | TEP |
| 11 | Tuberculose Pulmonar | Tuberculose Pulmonar Ativa | Tuberculose |
| 12 | Dengue - Grupo A | Dengue Grupo A (clássica) | Dengue |
| ... | ... | ... | ... |
| 16 | Derrame Pleural | Derrame Pleural | **Derrame Pleural** ✅ |
| ... | ... | ... | ... |
| 62 | Pneumotórax espontâneo | Pneumotórax espontâneo primário | **Pneumotórax** ✅ |
| 63 | Atelectasia pós-operatória | Atelectasia pós-operatória basal | **Atelectasia** ✅ |
| 64 | Bronquiolite viral aguda | Bronquiolite viral aguda | **Bronquiolite** ✅ |

---

## ✅ Casos Corretos para Testar Imagens Pulmonares

### Diagnósticos com Exame de Imagem (RX Tórax)

| ID | Diagnóstico | Categoria | Status |
|---|---|---|---|
| **2** | Pneumonia Adquirida na Comunidade | Pneumonia | ✅ |
| **3** | Asma Aguda | Asma | ✅ |
| **6** | Pneumonia Atípica | Pneumonia | ✅ |
| **9** | DPOC - Exacerbação | DPOC | ✅ |
| **16** | Derrame Pleural | Derrame Pleural | ✅ |
| **62** | Pneumotórax espontâneo | Pneumotórax | ✅ |
| **63** | Atelectasia pós-operatória | Atelectasia | ✅ |
| **64** | Bronquiolite viral aguda | Bronquiolite | ✅ |

---

## 🎯 Casos Específicos do Teste ORIGINAL (Corrigidos)

### ❌ Caso 1: SCA (Síndrome Coronariana Aguda)

**URL:** http://localhost:3000/caso/1  
**Diagnóstico Real:** "Síndrome Coronariana Aguda (SCA) - IAMCSST"  
**Tem RX Tórax?** Sim, mas é de SCA, não pneumonia  
**Status:** ❌ **NÃO deve ser usado para teste de imagens pulmonares**

---

### ❌ Caso 10: TEP (Tromboembolismo Pulmonar)

**URL:** http://localhost:3000/caso/10  
**Diagnóstico Real:** "Tromboembolismo Pulmonar de Risco Intermediário"  
**Tem RX Tórax?** Sim, mas é de TEP, não asma  
**Status:** ❌ **NÃO deve ser usado para teste de imagens pulmonares**

---

### ✅ Caso 16: Derrame Pleural

**URL:** http://localhost:3000/caso/16  
**Diagnóstico Real:** "Derrame Pleural (provável insuficiência cardíaca)"  
**Tem RX Tórax?** ✅ SIM  
**Status:** ✅ **CORRETO para teste**

---

### ❌ Caso 30: DAOP (Doença Arterial Oclusiva Periférica)

**URL:** http://localhost:3000/caso/30  
**Diagnóstico Real:** "DAOP com Claudicação Intermitente"  
**Tem RX Tórax?** Não, é doença vascular  
**Status:** ❌ **NÃO deve ser usado para teste de imagens pulmonares**

---

### ✅ Caso 62: Pneumotórax

**URL:** http://localhost:3000/caso/62  
**Diagnóstico Real:** "Pneumotórax espontâneo primário à direita"  
**Tem RX Tórax?** ✅ SIM  
**Status:** ✅ **CORRETO para teste**

---

### ✅ Caso 63: Atelectasia

**URL:** http://localhost:3000/caso/63  
**Diagnóstico Real:** "Atelectasia pós-operatória basal"  
**Tem RX Tórax?** ✅ SIM  
**Status:** ✅ **CORRETO para teste**

---

## 📝 Recomendação para Novo Teste de Imagens

### Use ESTES casos (confirmados corretos):

| ID | Diagnóstico | URL |
|---|---|---|
| 2 | Pneumonia | http://localhost:3000/caso/2 |
| 3 | Asma | http://localhost:3000/caso/3 |
| 6 | Pneumonia Atípica | http://localhost:3000/caso/6 |
| 9 | DPOC | http://localhost:3000/caso/9 |
| 16 | Derrame Pleural | http://localhost:3000/caso/16 |
| 62 | Pneumotórax | http://localhost:3000/caso/62 |
| 63 | Atelectasia | http://localhost:3000/caso/63 |
| 64 | Bronquiolite | http://localhost:3000/caso/64 |

---

## 🔍 Teste de API para Cada Caso

### Caso 2 (Pneumonia)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumonia&mode=openi_raw" | python3 -m json.tool
```

**Esperado:** `sucesso: true, imageUrl: "https://openi..."`

---

### Caso 3 (Asma)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=asma&mode=openi_raw" | python3 -m json.tool
```

**Esperado:** `sucesso: true, imageUrl: "https://openi..."`

---

### Caso 9 (DPOC)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=dpoc&mode=openi_raw" | python3 -m json.tool
```

**Esperado:** `sucesso: true, imageUrl: "https://openi..."`

---

### Caso 16 (Derrame Pleural)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=derrame%20pleural&mode=openi_raw" | python3 -m json.tool
```

**Esperado:** `sucesso: true, imageUrl: "https://openi..."`

---

### Caso 62 (Pneumotórax)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumotorax&mode=openi_raw" | python3 -m json.tool
```

**Esperado:** `sucesso: true, imageUrl: "https://openi..."`

---

### Caso 63 (Atelectasia)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=atelectasia&mode=openi_raw" | python3 -m json.tool
```

**Esperado:** `sucesso: true, imageUrl: "https://openi..."`

---

### Caso 64 (Bronquiolite)

```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=bronquiolite&mode=openi_raw" | python3 -m json.tool
```

**Esperado:** `sucesso: true, imageUrl: "https://openi..."`

---

## 📌 Resumo de Achados

### Problemas

1. ❌ Caso 1 é SCA, não pneumonia
2. ❌ Caso 10 é TEP, não asma
3. ❌ Caso 30 é DAOP, não DPOC (nem tem RX tórax)

### Acertos

1. ✅ Caso 16 é realmente Derrame Pleural
2. ✅ Caso 62 é realmente Pneumotórax
3. ✅ Caso 63 é realmente Atelectasia

### Casos Alternativos Disponíveis

1. ✅ Caso 2: Pneumonia (melhor do que caso 1)
2. ✅ Caso 3: Asma (melhor do que caso 10)
3. ✅ Caso 6: Pneumonia Atípica
4. ✅ Caso 9: DPOC (melhor do que caso 30)
5. ✅ Caso 64: Bronquiolite (novo)

---

## ✅ Recomendação

**Parar testes de imagem com os IDs antigos e usar ESTES:**

```
Novo Teste de Imagens:
- Caso 2 (Pneumonia) em vez de Caso 1
- Caso 3 (Asma) em vez de Caso 10
- Caso 9 (DPOC) em vez de Caso 30
- Caso 16 (Derrame Pleural) ✅ mantém
- Caso 62 (Pneumotórax) ✅ mantém
- Caso 63 (Atelectasia) ✅ mantém
- Caso 64 (Bronquiolite) como bônus
```

---

**Status:** ✅ **AUDITORIA COMPLETA**  
**Próximo passo:** Usar os casos corretos para novo teste visual

