# 📋 INSTRUÇÃO: Validação Visual do PainelAnaliseImagem

**Data**: 2026-06-21  
**Componente**: PainelAnaliseImagem.tsx  
**Logs Adicionados**: Temporários para debug  

---

## 🎯 Objetivo

Confirmar visualmente no navegador que:
1. ✅ `/api/exams/references` é chamada
2. ✅ Status 200 é recebido
3. ✅ `response.imagens[0].imageUrl` existe
4. ✅ Imagem é renderizada no RadiologyImageViewer
5. ✅ Atribuição CC BY 3.0 é exibida

---

## 🚀 Passo-a-Passo para Teste Visual

### 1️⃣ Abrir DevTools

**Windows/Linux**: `F12` ou `Ctrl+Shift+I`  
**Mac**: `Cmd+Option+I`

Ou: Clique direito → **Inspecionar**

### 2️⃣ Ir para Aba Network

1. Abrir DevTools
2. Clique em aba **Network**
3. Deixe aberta (Network mostra requisições em tempo real)

### 3️⃣ Abrir Caso Clínico

1. Acesse: http://localhost:3002
2. Clique em um caso clínico
3. Espere carregar

### 4️⃣ Navegar para "Exames de Imagem"

1. Na página do caso, procure aba **"Exames de Imagem"**
2. Clique nela
3. **Observe o Network** simultaneamente

---

## 🔍 O Que Observar no Network

Você deve ver uma requisição GET para:
```
/api/exams/references?diagnosis=pneumonia&limit=3
```

(O diagnóstico pode variar conforme o caso)

**Status esperado**: `200 OK`

**Response esperado**:
```json
{
  "sucesso": true,
  "imagens": [
    {
      "imageId": "CXR2961",
      "imageUrl": "https://openi.nlm.nih.gov/imgs/512/...",
      "diagnosticoRadiologico": "...",
      "fonte": "Open-i / Indiana University Chest X-ray Collection",
      "atribuicao": "..."
    }
  ]
}
```

---

## 🖥️ O Que Observar no Console

Clique em aba **Console** (ao lado de Network)

Você deve ver logs assim:

```
[PainelAnaliseImagem] 🔍 Buscando imagens Open-i para diagnóstico: pneumonia
[PainelAnaliseImagem] 📡 URL chamada: /api/exams/references?diagnosis=pneumonia&limit=3
[PainelAnaliseImagem] 📊 Response status: 200
[PainelAnaliseImagem] 📦 Response JSON completo: {sucesso: true, imagens: Array(1), ...}
[PainelAnaliseImagem] ✅ Imagem Open-i carregada:
  - imageId: CXR2961
  - imageUrl: https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png
  - fonte: Open-i / Indiana University Chest X-ray Collection
  - atribuicao: Fonte: Open-i / Indiana University Chest X-ray Collection...
[PainelAnaliseImagem] 🖼️ Renderizando imagem:
  - Source: https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png
```

---

## 📸 O Que Observar Visualmente na Página

Após ~2-3 segundos:

1. ✅ **Imagem radiológica é exibida** (RX de tórax real)
2. ✅ **Diagnóstico está visível** (ex: "Pneumonia" ou impressão)
3. ✅ **Atribuição é mostrada** (CC BY 3.0, Indiana University)
4. ✅ **Campos de resposta aparecem** (Descrição, Achado Principal, etc.)

---

## ✅ Checklist de Validação

Marque cada item conforme confirmar:

```
Componente renderizado sem erro?
  ☐ SIM → ✅ OK

Network chamou /api/exams/references?
  ☐ SIM → ✅ OK
  ☐ NÃO → ❌ Investigar console

Status 200?
  ☐ SIM → ✅ OK
  ☐ NÃO → ❌ Erro na rota

response.sucesso = true?
  ☐ SIM → ✅ OK
  ☐ NÃO → ❌ Erro no Open-i

response.imagens[0].imageUrl existe?
  ☐ SIM → ✅ OK
  ☐ NÃO → ❌ Problema na conversão

Imagem visível na página?
  ☐ SIM → ✅ OK
  ☐ NÃO → ❌ Problema de renderização

Atribuição CC BY 3.0 visível?
  ☐ SIM → ✅ OK
  ☐ NÃO → ❌ Problema na UI

Campos de resposta funcionam?
  ☐ SIM → ✅ OK
  ☐ NÃO → ❌ Problema no formulário
```

---

## 🐛 Troubleshooting

### Problema: "Imagem radiológica indisponível"

**Logs esperados**:
```
[PainelAnaliseImagem] 📊 Response status: 200
[PainelAnaliseImagem] ⚠️ Nenhuma imagem encontrada para: ...
```

**Causa provável**: O Open-i não encontrou imagens para o diagnóstico

**Solução**: Tentar com diagnósticos mais genéricos (pneumonia, normal)

---

### Problema: Nenhuma chamada de rede

**Logs esperados**:
```
[PainelAnaliseImagem] Caso já tem imagemRadiologica, pulando busca Open-i
```

**Causa provável**: O caso já tem uma imagem definida

**Solução**: Usar um caso que não tenha `imagemRadiologica` configurada

---

### Problema: erro 404 em /api/exams/references

**Logs esperados**:
```
[PainelAnaliseImagem] 📊 Response status: 404
[PainelAnaliseImagem] ❌ Resposta da API não OK: 404
```

**Causa provável**: Servidor rodando em porta diferente

**Solução**: Confirmar servidor em http://localhost:3002

---

### Problema: Erro de CORS

**Console mostra**: "Access to XMLHttpRequest blocked by CORS"

**Causa provável**: API endpoint não está respondendo com headers CORS corretos

**Solução**: Verificar se NextResponse.json() está sendo usado corretamente em route.ts

---

## 📝 Logs Adicionados (Temporários)

Os seguintes logs foram adicionados para debug:

### Início de busca
```typescript
console.log("[PainelAnaliseImagem] 🔍 Buscando imagens Open-i para diagnóstico:", diagnostico);
console.log("[PainelAnaliseImagem] 📡 URL chamada:", urlApiCall);
```

### Resposta recebida
```typescript
console.log("[PainelAnaliseImagem] 📊 Response status:", response.status);
console.log("[PainelAnaliseImagem] 📦 Response JSON completo:", dados);
```

### Imagem carregada
```typescript
console.log("[PainelAnaliseImagem] ✅ Imagem Open-i carregada:");
console.log("  - imageId:", imagem.imageId);
console.log("  - imageUrl:", imagem.imageUrl);
console.log("  - fonte:", imagem.fonte);
console.log("  - atribuicao:", imagem.atribuicao);
```

### Renderização
```typescript
console.log("[PainelAnaliseImagem] 🖼️ Renderizando imagem:");
console.log("  - Source:", imagemParaUsar.imageUrl);
```

### Sem imagem (fallback)
```typescript
console.log("[PainelAnaliseImagem] Mostrando fallback: sem imagem disponível");
```

---

## ✨ Após Validação Bem-Sucedida

Quando confirmar que tudo funciona:

1. **Remover os logs temporários** do componente
2. **Commitar a mudança**
3. **Documentar na PR** que validação visual foi feita

---

## 📊 Resultado Esperado

Se tudo funcionar:

```
✅ Network mostra GET /api/exams/references (status 200)
✅ Console mostra logs de sucesso (imageUrl válida)
✅ Página exibe radiografia real do Open-i
✅ Atribuição CC BY 3.0 é visível
✅ Aluno pode interagir com campos de resposta
```

**Conclusão**: Integração frontend-backend está funcionando corretamente! 🎉

---

## 🗑️ Remover Logs

Quando validação estiver completa, executar:

```bash
# Remover logs do componente (haverá instruções após testes)
# Confirmar no network que requisição continua funcionando
# Fazer commit final
```

---

**Instruções criadas em**: 2026-06-21  
**Status**: Pronto para teste visual manual  
**Tempo estimado para teste**: 3-5 minutos
