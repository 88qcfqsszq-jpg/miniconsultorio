# 🧪 TESTE MANUAL VISUAL: Componente Simplificado com <img>

**Data**: 2026-06-21  
**Status**: Componente preparado para teste manual  
**Modificação**: PainelAnaliseImagem.tsx simplificado com `<img>` direto

---

## ✅ O Que Foi Feito

### 1️⃣ Componente Simplificado

O `PainelAnaliseImagem.tsx` foi modificado para:

- ✅ Renderizar uma tag `<img>` simples (sem RadiologyImageViewer)
- ✅ Mostrar a URL da imagem em texto
- ✅ Exibir diagnóstico, fonte e atribuição
- ✅ Logs ampliados no console para debug
- ✅ Debug info expandível no fallback

### 2️⃣ Logs Adicionados no Componente

```javascript
console.log("[PainelAnaliseImagem] COMPONENTE RENDERIZADO!");
console.log("[PainelAnaliseImagem] caso.id:", caso.id);
console.log("[PainelAnaliseImagem] caso.imagemRadiologica existe?", !!caso.imagemRadiologica);
console.log("[PainelAnaliseImagem] 🔍 Buscando imagens Open-i para diagnóstico:", diagnostico);
console.log("[PainelAnaliseImagem] 📡 URL chamada:", urlApiCall);
console.log("[PainelAnaliseImagem] 📊 Response status:", response.status);
console.log("[PainelAnaliseImagem] 📦 Response JSON completo:", dados);
console.log("[PainelAnaliseImagem] ✅ Imagem Open-i carregada:");
console.log("  - imageUrl:", imagem.imageUrl);
console.log("[PainelAnaliseImagem] 🖼️ Renderizando imagem com <img> simples para teste:");
console.log("  - Source:", imagemParaUsar.imageUrl);
console.log("[PainelAnaliseImagem] ✅ Imagem carregada com sucesso!");
console.log("[PainelAnaliseImagem] ❌ Erro ao carregar imagem:");
```

---

## 🧪 INSTRUÇÕES PARA TESTE MANUAL NO NAVEGADOR

### Passo 1: Abrir DevTools
```
F12 (Windows/Linux) ou Cmd+Option+I (Mac)
```

### Passo 2: Abrir Aba Console
```
DevTools → Console tab
```

### Passo 3: Abrir um Caso
```
Acesse: http://localhost:3002
Selecione qualquer caso clínico
```

### Passo 4: Clicar em "Exames de Imagem"
```
Procure aba "Exames de Imagem" 🖼️
Clique nela
```

### Passo 5: Observar Console

Você deve ver logs como:

```
[PainelAnaliseImagem] COMPONENTE RENDERIZADO!
[PainelAnaliseImagem] caso.id: ped-16
[PainelAnaliseImagem] caso.imagemRadiologica existe? false
[PainelAnaliseImagem] 🔍 Buscando imagens Open-i para diagnóstico: pneumonia
[PainelAnaliseImagem] 📡 URL chamada: /api/exams/references?diagnosis=pneumonia&limit=3
```

### Passo 6: Observar Página

Você deve ver:

1. **Se sucesso** (~2-3 segundos depois):
   - URL da imagem em texto
   - **UMA IMAGEM REAL DE RX DE TÓRAX** (tag `<img>` simples)
   - Diagnóstico radiológico abaixo
   - Fonte: Open-i / Indiana University
   - Atribuição: CC BY 3.0

2. **Se falha**:
   - "Imagem radiológica indisponível para este caso."
   - Seção "Debug Info" expandível com detalhes do erro

---

## ✅ Checklist de Validação

```
☐ Componente rendeu? (log "COMPONENTE RENDERIZADO!")
☐ Console mostra início de busca? (log "Buscando imagens")
☐ Response status 200? (log "Response status: 200")
☐ imageUrl foi recebido? (log com URL completa)
☐ Imagem RX aparece na página? (tag <img> com imagem real)
☐ URL e diagnóstico são exibidos? (texto abaixo da imagem)
☐ Atribuição CC BY 3.0 é visível? (no rodapé)
```

**Se TODOS marcados**: ✅ **INTEGRAÇÃO FUNCIONA!**

---

## 📌 Possíveis Resultados

### Cenário A: Imagem Aparece ✅

```
Console mostra:
[PainelAnaliseImagem] ✅ Imagem Open-i carregada:
  - imageUrl: https://openi.nlm.nih.gov/imgs/512/...

Página mostra:
[TESTE] Renderizando com <img> simples:
https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png

[Uma radiografia real é exibida]

Diagnóstico: Opacity/lung/base/left - Pneumonia
Fonte: Open-i / Indiana University Chest X-ray Collection
Atribuição: Fonte: Open-i / Indiana University Chest X-ray Collection...
```

**Conclusão**: Integração funciona! Problema não está no Open-i nem na busca.

---

### Cenário B: Fallback Aparece ❌

```
Console mostra:
[PainelAnaliseImagem] Mostrando fallback: sem imagem disponível
[PainelAnaliseImagem] imagemOpenI: null
[PainelAnaliseImagem] estadoVisual: sem-imagem
[PainelAnaliseImagem] caso.imagemRadiologica: NONE
```

**Conclusão**: Problema na busca do Open-i. Expandir "Debug Info" para detalhes.

---

### Cenário C: Erro de Imagem ❌

```
Console mostra:
[PainelAnaliseImagem] ✅ Imagem Open-i carregada:
  - imageUrl: https://openi.nlm.nih.gov/imgs/...

[PainelAnaliseImagem] ❌ Erro ao carregar imagem: ...
```

**Conclusão**: Imagem retornada mas URL quebrada ou CORS bloqueando.

---

## 📝 O Que Significa Cada Log

| Log | Significa |
|-----|-----------|
| `COMPONENTE RENDERIZADO!` | PainelAnaliseImagem foi renderizado |
| `Buscando imagens Open-i` | useEffect iniciou busca |
| `URL chamada: /api/exams/references...` | Fetch foi executado |
| `Response status: 200` | API respondeu com sucesso |
| `Response JSON completo: {...}` | Dados foram recebidos |
| `Imagem Open-i carregada` | setImagemOpenI() foi chamado |
| `Renderizando imagem com <img>` | Componente vai renderizar imagem |
| `Imagem carregada com sucesso!` | `<img>` onLoad dispara |
| `Erro ao carregar imagem` | `<img>` onError dispara (URL ruim ou CORS) |

---

## 🔍 Se Falhar: Debug Step-by-Step

### Se log "COMPONENTE RENDERIZADO!" não aparece:
- ✅ Componente não está sendo renderizado
- ✅ Aba "Exames de Imagem" não está ativa
- ✅ Verificar se `menuAtivo === "imagemRadiologica"` em app/caso/[id]/page.tsx

### Se logs de busca não aparecem:
- ✅ Ou caso já tem `imagemRadiologica` definida
- ✅ Ou useEffect não rodou

### Se "Response status: 404" aparece:
- ✅ Rota `/api/exams/references` não existe
- ✅ Servidor rodando em porta errada
- ✅ Usar http://localhost:3002

### Se "Response status: 200" mas imagens vazias:
- ✅ Open-i não encontrou resultado para diagnóstico
- ✅ Tentar outro diagnóstico

### Se imagem não aparece (fallback):
- ✅ Expandir "Debug Info" para ver estado completo
- ✅ Verificar se response foi parseado

### Se imagem aparece mas está quebrada:
- ✅ Problema de CORS (Open-i bloqueando requisição)
- ✅ URL retornada é inválida
- ✅ Verificar log "[PainelAnaliseImagem] ❌ Erro ao carregar imagem"

---

## 🎯 Próximos Passos

1. **Teste manual em http://localhost:3002**
2. **Abra DevTools e clique em "Exames de Imagem"**
3. **Verifique console para logs**
4. **Anote resultado (Cenário A, B ou C)**
5. **Envie captura de tela do console + mensagem de resultado**

---

## 📝 Depois do Teste

Se imagem aparecer com `<img>` simples:
- ✅ Problema estava em RadiologyImageViewer
- ✅ Reintegrar ao RadiologyImageViewer com cuidado

Se continuar no fallback:
- ✅ Problema está na busca Open-i
- ✅ Debug info expandível mostrará detalhes

---

**Componente**: Pronto para teste manual  
**Rota Backend**: Já validada (funciona)  
**Renderização**: Usando `<img>` simples para máxima clareza  
**Logs**: Detalhados para debug fácil

**Status**: ✅ PRONTO PARA TESTE NO NAVEGADOR
