# 🎯 Modo Calibração Sequencial de Hotspots do Lactente

## Ativação

No arquivo `components/pediatria/PacientePediatricoVisualAjustado.tsx`, mude:

```typescript
const DEBUG_HOTSPOT_CALIBRATION = false;  // ❌ Desativado
const DEBUG_HOTSPOT_CALIBRATION = true;   // ✅ Ativado
```

Quando ativado, um **sistema guiado** aparecerá calibrando hotspots sequencialmente.

---

## Como Usar

### Passo 1: Abrir o Modal de Exame Físico
1. Acesse um caso pediátrico (lactente)
2. Clique no botão "Exame Físico Pediátrico Visual"
3. O modal abre com a imagem do lactente
4. O overlay de calibração ativa automaticamente

### Passo 2: Calibração Guiada (1 hotspot por vez)

Você verá:
- **Barra de progresso** no topo (ex: 1/10)
- **Card central** mostrando qual hotspot está sendo calibrado
- **Overlay transparente** sobre a imagem com cursor em crosshair
- **Bolinhas amarelas** marcando os cliques

**Procedimento para cada hotspot:**

1. **Primeiro clique**: clique no **canto SUPERIOR ESQUERDO** do box textual
   - Card mostra: "Clique no canto SUPERIOR ESQUERDO do box textual"
   - Uma bolinha amarela marca o ponto
   - Console: `🔵 [nome do hotspot] - Clique 1: x=XXX, y=YYY (px)`

2. **Segundo clique**: clique no **canto INFERIOR DIREITO** do mesmo box textual
   - Card mostra: "✓ Primeiro clique OK. Agora clique no canto INFERIOR DIREITO"
   - Outra bolinha amarela marca o segundo ponto
   - Um **retângulo amarelo** mostra a área sendo marcada
   - Sistema valida o tamanho automaticamente

3. **Validação automática**:
   - Se a área for muito grande (>40% largura ou >20% altura):
     - ⚠️ Card mostra: "Área muito grande! Clique apenas nos cantos do box textual."
     - Os cliques são descartados
     - Você pode tentar novamente
   - Se a área for válida:
     - ✅ Console mostra: `HOTSPOT CALIBRADO`
     - Retângulo fica **VERDE** (confirmado)
     - Sistema **avança automaticamente** para o próximo hotspot

### Passo 3: Navegar na Calibração

Durante a calibração, você tem três botões:

| Botão | Função |
|-------|--------|
| **↻ Refazer** | Limpa os cliques atuais, permite tentar novamente o hotspot atual |
| **⬅ Anterior** | Volta para o hotspot anterior (desfaz a última calibração) |
| **📋 Copiar Array** | Aparece ao final — copia o array completo para clipboard |

**Atalhos de teclado:**
- **ESC**: Limpa os cliques atuais (mesmo efeito de refazer)

---

## Sequência de Hotspots (10 no total)

O sistema calibra nesta ordem automática:

| # | ID | Label | Localização |
|---|----|----|---|
| 1 | `cabeca` | Cabeça / Perímetro Cefálico | Canto superior esquerdo |
| 2 | `olhos_face` | Olhos / Face | Canto superior direito |
| 3 | `orofaringe` | Orofaringe | Lateral esquerda (boca) |
| 4 | `pescoco_linfonodos` | Pescoço / Linfonodos | Lateral direita (pescoço) |
| 5 | `torax_respiratorio` | Tórax Respiratório | Meio esquerdo |
| 6 | `precordio` | Precórdio | Meio direito |
| 7 | `abdome` | Abdome | Abaixo do meio esquerdo |
| 8 | `figado` | Fígado / Hipocôndrio D | Inferior esquerdo |
| 9 | `baco` | Baço / Hipocôndrio E | Inferior direito |
| 10 | `membros_perfusao` | Membros / Perfusão / Pulsos / TEC | Canto inferior direito |

---

## Após a Calibração Completa

### 1️⃣ Copiar o Array

Quando todos os 10 hotspots forem calibrados:

- Card mostrará: **"🎉 Calibração Completa!"**
- Clique no botão **"📋 Copiar Array (Clipboard)"**
- O array inteiro é copiado automaticamente para seu clipboard

### 2️⃣ Atualizar o Código

Cole o array no arquivo:

```
components/pediatria/PacientePediatricoVisualAjustado.tsx
```

Localize a constante `LACTENTE_BOX_HOTSPOTS` e substitua pelo array completo:

```typescript
const LACTENTE_BOX_HOTSPOTS = [
  {
    id: 'cabeca',
    label: 'Cabeça / Perímetro Cefálico',
    left: 2.5,    // ← números sem %
    top: 8.5,     // ← números sem %
    width: 22.3,  // ← seus valores calibrados
    height: 9.7,  // ← seus valores calibrados
  },
  // ... mais 9 hotspots
];
```

**Nota:** O array copiado vem sem o `%`, apenas números decimais. Se preferir com `%`, use no template string.

---

## Validação Visual (Pós-Calibração)

Após atualizar o array `LACTENTE_BOX_HOTSPOTS`:

1. **Mantenha `DEBUG_HOTSPOT_CALIBRATION = true`** — continua mostrando os retângulos
2. **Mude `DEBUG_HOTSPOTS_PEDIATRIA = true`** — os hotspots ficarão com borda vermelha
3. **Recarregue a página** (Cmd+R / Ctrl+R)
4. **Verifique se os retângulos vermelhos cobrem EXATAMENTE os boxes textuais**

### Se algo estiver desalinhado:
- Clique em "⬅ Anterior" para voltar e recalibrar aquele hotspot
- Ou use "↻ Refazer" para tentar novamente
- Os retângulos verdes já calibrados permanecerão visíveis como referência

---

## Finalização

Quando todos os hotspots estiverem corretos (borda vermelha == box textual):

1. **Desative o modo calibração:**
   ```typescript
   const DEBUG_HOTSPOT_CALIBRATION = false;
   ```

2. **Desative o modo debug dos hotspots:**
   ```typescript
   const DEBUG_HOTSPOTS_PEDIATRIA = false;
   ```

3. **Faça o build:**
   ```bash
   npm run build
   ```

4. **Teste o clique nos hotspots:**
   - Clique em cada box textual
   - Verifique se a região correta é selecionada no painel
   - Teste em desktop e mobile
   - Os retângulos não devem aparecer mais (invisible hotspots)

---

## Troubleshooting

### "A calibração salta hotspots automaticamente"
- ✅ Isso é normal! O sistema avança assim que um hotspot é calibrado com sucesso
- Se você quiser tentar novamente, use o botão **"⬅ Anterior"**

### "Meus cliques não aparecem (sem bolinhas amarelas)"
- Verifique se está clicando **sobre a imagem renderizada** (não nas margens brancas)
- A imagem usa `object-fit: contain`, então pode ter padding ao redor

### "Aparece ⚠️ 'Área muito grande!'"
- Isso significa você clicou muito longe (provavelmente perto das pontas opostas da imagem)
- **Clique apenas nos cantos do box textual correspondente**, não na imagem inteira
- Use **"↻ Refazer"** para tentar novamente

### "Um hotspot foi calibrado errado"
- Use **"⬅ Anterior"** para voltar
- Recalibre apenas aquele hotspot
- Os anteriores permanecerão salvos

### "Quero recomeçar tudo do zero"
- Recarregue a página (Cmd+R / Ctrl+R)
- Todos os progressos serão resetados

### "O array copiado tem números sem %"
- ✅ Isso é esperado. O array vem em formato número puro (ex: `left: 2.5`)
- Quando você renderizar com estilo, use: `style={{ left: '${result.left}%' }}`

---

## Console (DevTools F12)

Exemplos de saídas esperadas durante a calibração:

```javascript
// Primeiro clique
🔵 Cabeça / Perímetro Cefálico - Clique 1: x=45.3, y=125.7 (px)

// Segundo clique
🔵 Cabeça / Perímetro Cefálico - Clique 2: x=167.2, y=198.4 (px)

// Resultado (auto-avança para próximo)
✅ HOTSPOT CALIBRADO
{
  "id": "cabeca",
  "label": "Cabeça / Perímetro Cefálico",
  "left": 2.5,
  "top": 8.5,
  "width": 22.3,
  "height": 9.7
}

// Se a área for muito grande
❌ Área rejeitada: W=85.2% H=92.1% (máx: 40% x 20%)

// Array final (ao clicar "Copiar Array")
📋 Array copiado para clipboard!
const lactenteHotspots = [
  { id: "cabeca", label: "Cabeça / Perímetro Cefálico", left: 2.5, top: 8.5, width: 22.3, height: 9.7 },
  { id: "olhos_face", label: "Olhos / Face", left: 74.1, top: 13.2, width: 24.5, height: 8.3 },
  ...
];
```
```

---

## Notas Técnicas

- **Responsividade:** As coordenadas percentuais funcionam em qualquer resolução
- **Sem object-fit: cover:** A imagem usa `object-fit: contain` para não distorcer
- **getBoundingClientRect():** Captura o tamanho real da imagem renderizada na tela
- **Position absolute:** Os hotspots ficam dentro do mesmo wrapper da imagem

---

Boa calibração! 🎯
