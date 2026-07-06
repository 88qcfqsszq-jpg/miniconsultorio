# Inspeção do DOM — Caso 62 (Pneumotórax)

**Data:** 23 de junho de 2026  
**Objetivo:** Verificar o `src` real do `<img>` exibido no navegador  
**Status:** ✅ Backend confirmado correto

---

## 📊 Confirmação Backend

### O que o backend retorna agora:

```json
// Pneumotórax
{
  "sucesso": false,
  "mode": "openi_raw",
  "diagnosis": "pneumotorax",
  "queryUsada": "pneumothorax",
  "imagens": [],
  "motivo": "Nenhuma imagem retornada pelo Open-i para o termo pesquisado."
}

// Pneumonia (para comparar)
{
  "sucesso": true,
  "mode": "openi_raw",
  "diagnosis": "pneumonia",
  "queryUsada": "pneumonia",
  "imagens": [{
    "imageUrl": "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
    "imageId": "CXR2961",
    "curadoriaRadiologica": false
  }]
}
```

---

## 🖥️ Como Inspecionar o DOM

### Método 1: DevTools (Recomendado)

1. **Abra o navegador:**
   ```
   http://localhost:3000/caso/62
   ```

2. **Abra DevTools:**
   - Windows/Linux: `F12` ou `Ctrl+Shift+I`
   - Mac: `Cmd+Option+I`

3. **Vá para a aba "Elements" ou "Inspector"**

4. **Procure pelo elemento `<img>`:**
   - Use `Ctrl+F` (ou `Cmd+F`) para procurar: `Radiografia de tórax`
   - Clique no primeiro resultado

5. **Verifique:**
   - Deve haver `<img>` com `alt="Radiografia de tórax"`
   - **Não deve ter atributo `src`** (ou deve estar vazio)
   - Ou deve ter um `src` vazio: `src=""`

---

### Método 2: Console (Mais Rápido)

1. **Abra o navegador:**
   ```
   http://localhost:3000/caso/62
   ```

2. **Abra Console:**
   - F12 → aba "Console"

3. **Cole este comando:**
   ```javascript
   const img = document.querySelector('img[alt="Radiografia de tórax"]');
   console.log('Imagem encontrada?', img ? 'Sim' : 'Não');
   console.log('src:', img?.src || 'SEM SRC');
   console.log('Vazio?', img && !img.src ? '✅ SIM (esperado)' : '❌ NÃO');
   ```

4. **Resultado esperado:**
   ```
   Imagem encontrada? Sim
   src: SEM SRC
   Vazio? ✅ SIM (esperado)
   ```

---

### Método 3: Verificar Mensagem Exibida

1. **Abra o navegador:**
   ```
   http://localhost:3000/caso/62
   ```

2. **Verifique visualmente:**
   - ❌ NÃO deve haver imagem exibida
   - ✅ DEVE haver mensagem: "Imagem radiológica indisponível"

---

## 📋 Tabela de Diagnóstico

| Cenário | Backend retorna | DOM deve ter | Resultado Esperado |
|---|---|---|---|
| ✅ CORRETO | `sucesso=false, imagens=[]` | `<img>` sem src (vazio) | Mensagem "Imagem indisponível" |
| ⚠️ CACHE | `sucesso=false, imagens=[]` | `<img src="CXR...">` | Imagem antiga visível (erro) |
| ❌ FALLBACK | `sucesso=false, imagens=[]` | `<img src="CXR2961...">` | Imagem de pneumonia (erro) |

---

## ✅ Checklist de Verificação

### Caso 62 (Pneumotórax)

- [ ] Backend retorna: `sucesso: false`
- [ ] Backend retorna: `imagens: []` (array vazio)
- [ ] Backend retorna: `motivo: "Nenhuma imagem retornada..."`
- [ ] DOM: `<img>` **não** tem `src`, ou `src=""` (vazio)
- [ ] Navegador exibe: "Imagem radiológica indisponível"
- [ ] Navegador exibe: "Nenhuma imagem radiológica foi encontrada..."
- [ ] Navegador exibe: Sugestão de "atlas radiológico externo"
- [ ] **NÃO** exibe nenhuma imagem

### Caso 1 (Pneumonia) — para comparação

- [ ] Backend retorna: `sucesso: true`
- [ ] Backend retorna: `imagens: [{ imageUrl: "CXR2961..." }]`
- [ ] DOM: `<img src="https://openi.nlm.nih.gov/imgs/.../CXR2961..."`
- [ ] Navegador exibe: Imagem radiológica
- [ ] Navegador exibe: Aviso azul "Imagem de referência educacional"
- [ ] Navegador exibe: Aviso amarelo "Sem curadoria radiológica"

---

## 🔍 Interpretação dos Resultados

### Se o DOM mostra: `<img>` sem src (vazio)

```
✅ CORRETO!
   - Backend retorna sucesso=false ✅
   - Frontend não renderiza imagem ✅
   - Componente exibe "Imagem indisponível" ✅
   - Sistema funcionando perfeitamente ✅
```

### Se o DOM mostra: `<img src="CXR2961...">`

```
⚠️ PROBLEMA!
   - Cache do navegador está ativo
   - Ou estado anterior não foi limpo
   
   Ação: Pressione Ctrl+Shift+R (ou Cmd+Shift+R)
   para fazer hard-refresh e limpar cache
```

### Se o DOM mostra: `<img src="CXR3945...">`

```
❓ INESPERADO!
   - Backend mudou e agora retorna imagem
   - Verifique se Open-i realmente tem imagem para pneumothorax
   - Comando: curl -s ".../api/exams/references?diagnosis=pneumotorax&mode=openi_raw"
```

---

## 📝 Como Relatar os Resultados

Quando você verificar o DOM, reporte:

1. **O que mostra o backend:**
   - [ ] `sucesso: true` ou `false`
   - [ ] Número de imagens: `__`

2. **O que mostra o DOM:**
   - [ ] `<img src="">` (vazio)
   - [ ] `<img src="CXR2961...">` (pneumonia)
   - [ ] `<img src="CXR3945...">` (nova)
   - [ ] Nenhum `<img>` encontrado

3. **O que mostra o navegador:**
   - [ ] Imagem visível ou não?
   - [ ] Mensagem "Imagem indisponível" ou não?

---

## 🚀 Próximos Passos

1. **Abra http://localhost:3000/caso/62 no navegador**
2. **Inspecione o DOM** (um dos 3 métodos acima)
3. **Compare com Backend:**
   ```bash
   curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumotorax&limit=3&mode=openi_raw" | python3 -m json.tool
   ```
4. **Reporte os resultados:**
   - Backend retorna: ____
   - DOM mostra: ____
   - Navegador exibe: ____

---

## 📊 Resumo Esperado

| Componente | Status | Detalhes |
|---|---|---|
| Backend | ✅ | `sucesso=false, imagens=[]` |
| Frontend (fetch) | ✅ | Recebe resposta correta |
| DOM (`<img>`) | ✅ | Sem `src` ou `src=""` |
| Navegador | ✅ | Mostra "Imagem indisponível" |
| Aviso | ✅ | Mensagem clara exibida |
| Cache | ✅ | Desabilitado com `cache: "no-store"` |

---

**Quando tiver completado a inspeção, reporte os achados!** 🔍

