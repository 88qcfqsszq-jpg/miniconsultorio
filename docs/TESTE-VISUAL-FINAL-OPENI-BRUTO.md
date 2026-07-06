# Teste Visual Final — Modo Open-i Bruto

**Data:** 23 de junho de 2026  
**Objetivo:** Validar funcionamento completo do modo Open-i bruto no navegador

---

## 🧪 Instruções para Teste Visual

### Preparação

1. **Abrir DevTools (F12)**
   - Aba Console para logs
   - Aba Network para ver requisições
   - Aba Elements para inspecionar DOM

2. **Ter terminal aberto com:**
   ```bash
   tail -f /tmp/dev.log
   ```

3. **Para cada caso:**
   - Abrir URL no navegador
   - Aguardar carregamento (2-3s)
   - Coletar dados (veja abaixo)

---

## 📋 Casos para Testar

### Caso 1: Pneumonia (PAC)
**URL:** http://localhost:3000/caso/1

**Checklist:**
- [ ] Imagem aparece no painel
- [ ] Console mostra: `[Painel] 1: imageUrl ✅`
- [ ] DevTools Elements → procure `<img src="https://openi...">`
- [ ] Aviso amarelo "Sem curadoria radiológica" aparece
- [ ] Botão "Gabarito" funciona

**Copiar desta aba:**
```
imageUrl retornado pelo backend: [do DevTools Network]
src do <img> no DOM: [do DevTools Elements]
```

---

### Caso 2: Asma
**URL:** http://localhost:3000/caso/10

**Checklist:**
- [ ] Imagem aparece
- [ ] Aviso "Sem curadoria" aparece
- [ ] Console: `[Painel] 10: imageUrl ✅`

**Copiar:**
```
imageUrl: 
src no DOM:
```

---

### Caso 3: DPOC
**URL:** http://localhost:3000/caso/30

**Checklist:**
- [ ] Imagem aparece
- [ ] Aviso "Sem curadoria" aparece

**Copiar:**
```
imageUrl:
src no DOM:
```

---

### Caso 4: Atelectasia
**URL:** http://localhost:3000/caso/63

**Checklist:**
- [ ] Imagem aparece
- [ ] Aviso "Sem curadoria" aparece

**Copiar:**
```
imageUrl:
src no DOM:
```

---

### Caso 5: Derrame Pleural
**URL:** http://localhost:3000/caso/16

**Checklist:**
- [ ] Imagem aparece
- [ ] Aviso "Sem curadoria" aparece

**Copiar:**
```
imageUrl:
src no DOM:
```

---

### Caso 6: Pneumotórax
**URL:** http://localhost:3000/caso/62

**Checklist:**
- [ ] ❌ NÃO aparece imagem
- [ ] ✅ Mensagem "Imagem radiológica indisponível" aparece
- [ ] Console: `[Painel] 62: imageUrl ❌`

**Copiar:**
```
Menagem exibida: [copiar exatamente]
```

---

## 🔍 Como Extrair Dados do DevTools

### 1. ImageURL do Backend (Network Tab)

1. F12 → Network
2. Filtrar: "exams"
3. Clicar em: `references?diagnosis=...&mode=openi_raw`
4. Aba Response → copiar campo `imageUrl`

```json
{
  "sucesso": true,
  "imageUrl": "https://openi.nlm.nih.gov/imgs/512/...",
  ...
}
```

### 2. src no DOM (Elements Tab)

1. F12 → Elements
2. Procurar: `<img alt="Radiografia de tórax"`
3. Copiar o atributo `src` completo

```html
<img 
  src="https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png"
  alt="Radiografia de tórax"
/>
```

### 3. Console Logs

F12 → Console → procurar por:
```
[Painel] 1: imageUrl ✅
[Painel] 10: imageUrl ✅
...
```

---

## ✅ Teste de Navegação Entre Casos

### Procedure

1. Abrir Caso 1 (Pneumonia)
   - ✅ Vê imagem CXR2961
   - Anotar imageUrl

2. Clicar para Caso 62 (Pneumotórax)
   - ❌ Imagem CXR2961 DESAPARECE
   - ✅ Mensagem "indisponível" aparece
   - Verificar DOM: sem `<img src="CXR2961">`

3. Voltar para Caso 1
   - ✅ Imagem CXR2961 REAPARECE
   - Mesmo imageUrl de antes

**Status:** ✅ Esperado se imagem anterior desaparece ao trocar

---

## 📊 Tabela de Resultados

Preencher enquanto testa:

| Caso | Diagnóstico | ImageURL Backend | SRC DOM | Imagem? | Aviso? | Status |
|---|---|---|---|---|---|---|
| 1 | Pneumonia | CXR2961_IM-1355-... | CXR2961_IM-1355-... | ✅ | ✅ | ✅ |
| 10 | Asma | CXR1912_IM-0594-... | CXR1912_IM-0594-... | ✅ | ✅ | ✅ |
| 30 | DPOC | CXR551_IM-2154-... | CXR551_IM-2154-... | ✅ | ✅ | ✅ |
| 63 | Atelectasia | CXR2036_IM-0680-... | CXR2036_IM-0680-... | ✅ | ✅ | ✅ |
| 16 | Derrame | CXR2046_IM-0688-... | CXR2046_IM-0688-... | ✅ | ✅ | ✅ |
| 62 | Pneumotórax | null | (sem img) | ❌ | N/A | ✅ |

---

## 🎯 Critérios de Sucesso

### ✅ Para casos COM imagem (1, 10, 30, 63, 16)

- [ ] Backend retorna `sucesso: true`
- [ ] Backend retorna `imageUrl: "https://openi..."`
- [ ] Frontend recebe imageUrl
- [ ] DOM tem `<img src="...">`
- [ ] `src` do DOM == `imageUrl` backend
- [ ] Aviso "Sem curadoria radiológica" visível
- [ ] Botão Gabarito funciona
- [ ] Chat, SOAP, sinais vitais intactos

### ✅ Para caso SEM imagem (62)

- [ ] Backend retorna `sucesso: false`
- [ ] Backend retorna `imageUrl: null`
- [ ] Frontend não cria `<img>`
- [ ] Mensagem "Imagem radiológica indisponível" visível

### ✅ Para navegação entre casos

- [ ] Ao ir de caso COM imagem para SEM imagem:
  - Imagem anterior desaparece
  - Mensagem "indisponível" aparece
- [ ] Ao voltar para caso COM imagem:
  - Imagem reaparece (não fica em branco)

---

## 🔧 Troubleshooting

### Problema: Imagem não aparece

1. Verificar console: há erro?
   - Procurar por `[Painel]` logs
   - Procurar por `[Imagem]` logs

2. Verificar Network:
   - A requisição foi feita?
   - Retornou `sucesso: true`?
   - Retornou `imageUrl`?

3. Verificar DOM:
   - `<img>` existe?
   - Tem `src`?
   - URL é válida (começa com `https://`)?

4. Verificar cache:
   - Pressionar Ctrl+Shift+R (hard refresh)

### Problema: Imagem anterior não desaparece

1. Verificar se `imagensCandidatasPrecarregadas` foi resetada
2. Ver console para logs de reset
3. Hard refresh (Ctrl+Shift+R)

---

## 📝 Template para Anotar Resultados

```
=== TESTE VISUAL FINAL ===

CASO 1 - PNEUMONIA:
- Backend imageUrl: [COLAR]
- DOM src: [COLAR]
- Imagem aparece? [SIM/NÃO]
- Aviso aparece? [SIM/NÃO]
- Status: [✅/❌]

CASO 10 - ASMA:
- Backend imageUrl: [COLAR]
- DOM src: [COLAR]
- Imagem aparece? [SIM/NÃO]
- Aviso aparece? [SIM/NÃO]
- Status: [✅/❌]

[... continuar para outros casos ...]

CASO 62 - PNEUMOTÓRAX:
- Backend retorna imageUrl? [SIM/NÃO]
- Backend retorna null? [SIM/NÃO]
- Mensagem "indisponível" aparece? [SIM/NÃO]
- Status: [✅/❌]

TESTE DE NAVEGAÇÃO (1 → 62 → 1):
- Imagem 1 aparece? [SIM]
- Imagem desaparece ao ir para 62? [SIM]
- Mensagem "indisponível" aparece em 62? [SIM]
- Imagem reaparece ao voltar para 1? [SIM]
- Status: [✅/❌]

RESUMO:
- Total de casos: 6
- Passaram: [X]/6
- Status final: [PRONTO PARA PRODUÇÃO/AJUSTES NECESSÁRIOS]
```

---

## 📍 Locais-chave para Inspecionar

### No Backend (DevTools Network)

Procurar pela requisição:
```
GET /api/exams/references?diagnosis=...&mode=openi_raw
```

Response esperada:
```json
{
  "sucesso": true,
  "mode": "openi_raw",
  "diagnosis": "pneumonia",
  "queryUsada": "pneumonia",
  "imageUrl": "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
  "imagens": [
    {
      "imageUrl": "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
      "imageId": "CXR2961",
      "fonte": "Open-i",
      "curadoriaRadiologica": false
    }
  ]
}
```

### No Frontend (DevTools Elements)

Procurar por:
```html
<img 
  alt="Radiografia de tórax"
  src="https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png"
  style="..."
/>
```

Deve ter exatamente o mesmo `src` da resposta backend.

### No Console (DevTools Console)

Procurar por logs:
```
[Painel] 1: imageUrl ✅
[Imagem] Pneumonia: ✅
[Raw] ✅ Encontrou para "pneumonia"
```

---

## 🏁 Quando Terminar

1. Preencher a tabela acima com resultados
2. Confirmar todos os critérios de sucesso
3. Anotar qualquer problema encontrado
4. Reportar status final

---

**Data do teste:** _____________  
**Testado por:** _____________  
**Status final:** ✅ PRONTO / ❌ AJUSTES NECESSÁRIOS

