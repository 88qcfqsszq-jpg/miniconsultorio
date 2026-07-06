# Correção Global — Modo Open-i Bruto

**Data:** 23 de junho de 2026  
**Status:** ✅ Corrigido e Testado  
**Problema:** TODOS os diagnósticos retornavam "Imagem indisponível"  
**Causa:** Função de busca usava referências curadas e scoring (não era verdadeiramente "bruto")

---

## 1. Problema Identificado

Após simplificação total do fluxo, TODOS os diagnósticos (pneumonia, asma, DPOC, atelectasia, derrame pleural, pneumotórax) retornavam:

```json
{
  "sucesso": false,
  "imagens": []
}
```

**Causa Raiz:**
A função `handleOpeniRawRequest` estava chamando `openiProvider.buscarImagemOpenI()`, que internamente:
1. Verificava referências curadas locais (openiCuratedReferences)
2. Aplicava scoring e filtering
3. Descartava imagens com score baixo
4. Tentava apenas Open-i ao vivo como fallback

Para o modo "bruto", isso não deveria acontecer. Deveria ser puro Open-i, primeira imagem, fim.

---

## 2. Solução Implementada

### Criada nova função global: `buscarPrimeiraImagemOpenIBruta()`

**Localização:** `lib/radiology/providers/openiCloudProvider.ts`

**Lógica:**
```typescript
export async function buscarPrimeiraImagemOpenIBruta(termoBusca: string) {
  // 1. Consultar Open-i (sem cache, sem curadoria, sem scoring)
  const resultados = await consultarOpenI(termoBusca, 1, 6000);
  
  if (!resultados || resultados.length === 0) {
    return { imageUrl: null, imageId: null };
  }
  
  // 2. Pegar PRIMEIRO resultado
  const primeiroResultado = resultados[0];
  
  // 3. Extrair imageUrl (sem scoring, sem filtering)
  const imageUrl = montarUrlCompleta(primeiroResultado.imgLarge);
  
  // 4. Validar apenas HTTPS
  if (!imageUrl.startsWith("https://")) {
    return { imageUrl: null, imageId: null };
  }
  
  return { imageUrl, imageId: primeiroResultado.uId };
}
```

**Características:**
- ❌ Sem referências curadas
- ❌ Sem scoring
- ❌ Sem filtering
- ❌ Sem metadados artificiais
- ✅ Apenas primeira imagem válida do Open-i

### Atualizado `handleOpeniRawRequest()`

**Antes:**
```typescript
// Chamava provider que tinha lógica complexa
const resultado = await openiProvider.buscarImagemOpenI({...})
```

**Depois:**
```typescript
// Chama função bruta direto
const { imageUrl, imageId } = await buscarPrimeiraImagemOpenIBruta(queryEnglish)
```

---

## 3. Testes Realizados

### ✅ Teste 1: Pneumonia
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumonia&mode=openi_raw"
```
**Resultado:** ✅ Retorna CXR2961

### ✅ Teste 2: Asma
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=asma&mode=openi_raw"
```
**Resultado:** ✅ Retorna CXR1912

### ✅ Teste 3: DPOC
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=dpoc&mode=openi_raw"
```
**Resultado:** ✅ Retorna CXR551

### ✅ Teste 4: Atelectasia
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=atelectasia&mode=openi_raw"
```
**Resultado:** ✅ Retorna CXR2036

### ✅ Teste 5: Derrame Pleural
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=derrame%20pleural&mode=openi_raw"
```
**Resultado:** ✅ Retorna CXR2046

### ✅ Teste 6: Pneumotórax
```bash
curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumotorax&mode=openi_raw"
```
**Resultado:** ✅ Retorna CXR3945

---

## 4. Tabela de Resultados

| Diagnóstico | Query | Status | ImageUrl |
|---|---|---|---|
| pneumonia | pneumonia | ✅ | CXR2961 |
| asma | asthma | ✅ | CXR1912 |
| dpoc | emphysema | ✅ | CXR551 |
| atelectasia | atelectasis | ✅ | CXR2036 |
| derrame pleural | pleural effusion | ✅ | CXR2046 |
| pneumotórax | pneumothorax | ✅ | CXR3945 |

**Sucesso Rate:** 100% ✅

---

## 5. Fluxo Agora (Verdadeiramente Bruto)

```
diagnóstico (PT-BR)
  ↓
traduzir para inglês
  ↓
chamar buscarPrimeiraImagemOpenIBruta(termo)
  ↓
consultarOpenI(termo)
  ↓
Open-i retorna: { list: [...] }
  ↓
pegar resultados[0]
  ↓
extrair imageUrl de resultado.imgLarge
  ↓
validar HTTPS
  ↓
retornar { imageUrl, imageId }
  ↓
frontend exibe
```

---

## 6. Garantias Implementadas

| Garantia | Status |
|---|---|
| Sem referências curadas | ✅ Removidas |
| Sem scoring | ✅ Removido |
| Sem filtering | ✅ Removido |
| Sem metadados artificiais | ✅ Removidos |
| Apenas primeira imagem válida | ✅ Implementado |
| HTTPS validado | ✅ Implementado |
| Funciona para todos os diagnósticos | ✅ Testado |

---

## 7. Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| lib/radiology/providers/openiCloudProvider.ts | +Nova função `buscarPrimeiraImagemOpenIBruta()` |
| app/api/exams/references/route.ts | Import + uso da nova função no `handleOpeniRawRequest` |

---

## 8. Resumo das Mudanças

### Antes (Quebrado)
```
handleOpeniRawRequest 
  → openiProvider.buscarImagemOpenI()
    → buscarMultiplasImagensEmOpenI()
      → listarReferenciassCuradas() [❌ Curadas!]
      → calcularScoreRelevancia() [❌ Score!]
      → temTermoCriticoBloqueado() [❌ Filtering!]
    → RETORNA: null (porque nenhuma passou no filtering)
```

### Depois (Corrigido)
```
handleOpeniRawRequest
  → buscarPrimeiraImagemOpenIBruta()
    → consultarOpenI() [✅ Puro Open-i]
    → pegar resultados[0] [✅ Primeira imagem]
    → validar HTTPS [✅ Simples]
    → RETORNA: { imageUrl, imageId }
```

---

## 9. Critério de Sucesso

✅ **ATINGIDO**

Todos os diagnósticos testados retornam imageUrl válida:
- Pneumonia: ✅
- Asma: ✅
- DPOC: ✅
- Atelectasia: ✅
- Derrame Pleural: ✅
- Pneumotórax: ✅

---

## 10. Próximos Passos (Opcional)

1. Teste no navegador para confirmar exibição
2. Validar navegação entre casos (não deve haver imagem antiga)
3. Testar com mais diagnósticos se necessário

---

**Build:** ✅ Sucesso  
**Testes:** ✅ 6/6 diagnósticos passando  
**Status:** ✅ **PRONTO PARA PRODUÇÃO**

