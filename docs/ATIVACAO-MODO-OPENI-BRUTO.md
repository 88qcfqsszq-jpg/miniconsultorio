# Ativação do Modo Open-i Bruto — Frontend

**Data:** 23 de junho de 2026  
**Status:** ✅ Implementado e Pronto para Teste

---

## 1. Mudanças Realizadas

### 1.1 Backend (`app/api/exams/references/route.ts`)
✅ Adicionado parâmetro `mode=openi_raw`  
✅ Implementada função `handleOpeniRawRequest()`  
✅ Fluxo simples: traduzir → buscar → validar → retornar

### 1.2 Frontend (`app/caso/[id]/page.tsx`)
✅ Adicionado `&mode=openi_raw` à chamada de API (linha 198)

```typescript
// ANTES:
/api/exams/references?diagnosis=${encodeURIComponent(diagnostico)}&limit=3

// DEPOIS:
/api/exams/references?diagnosis=${encodeURIComponent(diagnostico)}&limit=3&mode=openi_raw
```

### 1.3 Frontend (`components/PainelAnaliseImagem.tsx`)
✅ Adicionado aviso visível quando `curadoriaRadiologica: false`
✅ Melhorado aviso de "sem imagem disponível"

```tsx
// Novo aviso amarelo:
{imagemParaUsar?.curadoriaRadiologica === false && (
  <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
    <p className="text-xs text-yellow-900">
      ⚠️ <strong>Sem curadoria radiológica:</strong> Imagem retornada 
      automaticamente pelo Open-i a partir do termo pesquisado. 
      Não foi validada por especialista.
    </p>
  </div>
)}
```

---

## 2. Fluxo Completo Agora

```
Estudante abre caso
  ↓
Frontend carrega caso
  ↓
Chama: GET /api/exams/references?diagnosis=XXX&limit=3&mode=openi_raw
  ↓
Backend (modo bruto):
  1. Traduz "pneumotórax" → "pneumothorax"
  2. Consulta Open-i
  3. Pega primeira imagem com URL válida
  4. Retorna: { curadoriaRadiologica: false, aviso: "..." }
  ↓
Frontend (PainelAnaliseImagem):
  1. Renderiza imagem
  2. SE curadoriaRadiologica === false:
     Mostra aviso amarelo "Sem curadoria radiológica"
  3. SE sem imagem:
     Mostra "Imagem radiológica indisponível"
  ↓
Estudante vê:
  ✅ Imagem com aviso claro
  ou
  ⚠️ Mensagem de que não há imagem
```

---

## 3. Avisos Visuais Implementados

### 3.1 Quando há imagem (com aviso)
```
📌 Avisos visíveis:
┌─────────────────────────────────────────────────┐
│ ⓘ Aviso: Imagem de referência educacional...   │ (azul)
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ ⚠️ Sem curadoria radiológica: Imagem retornada  │ (amarelo)
│    automaticamente pelo Open-i...               │
└─────────────────────────────────────────────────┘
```

### 3.2 Quando não há imagem
```
📌 Mensagem clara:
┌─────────────────────────────────────────────────┐
│ Imagem radiológica indisponível                │
│ Nenhuma imagem radiológica foi encontrada...   │
│ Você pode consultar um atlas radiológico...    │
└─────────────────────────────────────────────────┘
```

---

## 4. Como Testar

### 4.1 URLs dos Casos de Teste

| Diagnóstico | Caso | URL | Esperado |
|---|---|---|---|
| Pneumonia | 1 | http://localhost:3000/caso/1 | ✅ Imagem + aviso |
| Derrame Pleural | 16 | http://localhost:3000/caso/16 | ✅ Imagem + aviso |
| Pneumotórax | 62 | http://localhost:3000/caso/62 | ❌ Sem imagem |
| Atelectasia | 63 | http://localhost:3000/caso/63 | ✅ Imagem + aviso |

### 4.2 Checklist de Teste

Para cada caso, verificar:

- [ ] **Pneumonia (Caso 1)**
  - [ ] Imagem carrega
  - [ ] Aviso azul aparece ("Imagem de referência educacional")
  - [ ] Aviso amarelo aparece ("Sem curadoria radiológica")
  - [ ] Botão "Gabarito" funciona
  - [ ] Ao clicar, mostra "Achado esperado"

- [ ] **Derrame Pleural (Caso 16)**
  - [ ] Imagem carrega
  - [ ] Avisos azul e amarelo aparecem
  - [ ] Gabarito funciona

- [ ] **Pneumotórax (Caso 62)**
  - [ ] Mensagem "Imagem radiológica indisponível" aparece (esperado)
  - [ ] Sugestão "atlas radiológico externo" é oferecida
  - [ ] Resto do caso funciona (chat, SOAP, etc.)

- [ ] **Atelectasia (Caso 63)**
  - [ ] Imagem carrega
  - [ ] Avisos azul e amarelo aparecem
  - [ ] Gabarito funciona

### 4.3 Verificações Gerais

- [ ] Chat continua funcionando normalmente
- [ ] SOAP continua funcionando normalmente
- [ ] Sinais vitais continuam funcionando
- [ ] Exame físico continua funcionando
- [ ] ECG continua funcionando
- [ ] Diagnóstico/conduta não foram alterados

---

## 5. API Response (Novo Formato)

### Sucesso (com imagem)
```json
{
  "sucesso": true,
  "mode": "openi_raw",
  "diagnosis": "pneumonia",
  "queryUsada": "pneumonia",
  "imagens": [{
    "imageUrl": "https://openi.nlm.nih.gov/imgs/512/...",
    "imageId": "CXR2961",
    "fonte": "Open-i / Indiana University Chest X-ray Collection",
    "curadoriaRadiologica": false,
    "aviso": "Imagem retornada automaticamente pelo Open-i a partir do termo pesquisado. Não validada por curadoria radiológica."
  }],
  "mensagem": "1 imagem retornada (sem curadoria)"
}
```

### Falha (sem imagem)
```json
{
  "sucesso": false,
  "mode": "openi_raw",
  "diagnosis": "pneumotórax",
  "queryUsada": "pneumothorax",
  "imagens": [],
  "motivo": "Nenhuma imagem retornada pelo Open-i para o termo pesquisado."
}
```

---

## 6. Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---|---|---|
| **Curadoria** | ❌ Artificial/Falsa | ✅ Honesta |
| **Aviso** | ❌ Não existia | ✅ Exibido em amarelo |
| **Pneumotórax** | ❌ Falso positivo (imagem de pneumonia) | ✅ Sem imagem + mensagem clara |
| **Score** | ❌ Artificial (100) | ✅ Sem scoring |
| **Metadados** | ❌ Metadados falsos | ✅ Apenas do Open-i |
| **Confiabilidade** | ❌ Aluno enganado | ✅ Aluno informado |

---

## 7. Detalhes Técnicos

### Fluxo no Frontend

```typescript
// 1. Chamada ao endpoint com modo bruto
const response = await fetch(
  `/api/exams/references?diagnosis=${diagnosis}&limit=3&mode=openi_raw`
);

// 2. Componente PainelAnaliseImagem recebe dados
const dados = await response.json();

// 3. Se curadoriaRadiologica === false, exibe aviso
{imagemParaUsar?.curadoriaRadiologica === false && (
  <div>⚠️ Sem curadoria radiológica: ...</div>
)}

// 4. Se sucesso === false, exibe mensagem
{!imagemParaUsar && (
  <div>Imagem radiológica indisponível</div>
)}
```

### Nenhuma Alteração Em

✅ Chat (ChatPaciente.tsx)  
✅ SOAP (FormularioSOAP.tsx)  
✅ Sinais Vitais (PainelSinaisVitais.tsx)  
✅ Exame Físico (PainelExameFisico.tsx)  
✅ ECG (SimuladorECG.tsx)  
✅ Diagnóstico/Conduta (PainelDiagnostico.tsx)

---

## 8. Status de Implementação

### ✅ Implementado
- [x] Backend com modo openi_raw
- [x] Frontend chamando com mode=openi_raw
- [x] Aviso de "Sem curadoria radiológica"
- [x] Mensagem melhorada para "sem imagem"
- [x] Build passou com sucesso

### 🧪 Pronto para Testar
- [ ] Caso 1 (Pneumonia)
- [ ] Caso 16 (Derrame Pleural)
- [ ] Caso 62 (Pneumotórax)
- [ ] Caso 63 (Atelectasia)

### 📝 Próximos Passos (Opcional)
- Coletar feedback de alunos
- Considerar buscar imagens de outras fontes para diagnósticos sem imagem
- Documentar na wiki/manual do app

---

## 9. Resumo

**O Modo Open-i Bruto está totalmente ativado no frontend.**

Agora:
- ✅ Toda busca de imagem usa `mode=openi_raw`
- ✅ Avisos claros indicam "sem curadoria"
- ✅ Sem falsos positivos educacionais
- ✅ Aluno sempre informado
- ✅ Sistema honesto e simples

**Pronto para teste no navegador!** 🚀

---

**Arquivos modificados:**
- app/caso/[id]/page.tsx (linha 198)
- components/PainelAnaliseImagem.tsx (linhas 507-520, 630-637)

**Build status:** ✅ Sucesso  
**Teste status:** ⏳ Aguardando validação no navegador
