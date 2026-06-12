# 🎯 Modo Calibração de Hotspots do Lactente

## Ativação

No arquivo `components/pediatria/PacientePediatricoVisualAjustado.tsx`, mude:

```typescript
const DEBUG_HOTSPOT_CALIBRATION = false;  // ❌ Desativado
const DEBUG_HOTSPOT_CALIBRATION = true;   // ✅ Ativado
```

Quando ativado, um overlay aparecerá sobre a imagem do lactente no modal de exame físico.

---

## Como Usar

### Passo 1: Abrir o Modal de Exame Físico
1. Acesse um caso pediátrico (lactente)
2. Clique no botão "Exame Físico Pediátrico Visual"
3. O modal abre com a imagem do lactente

### Passo 2: Calibrar um Hotspot
Quando o modo calibração está ativo, você verá:
- **Overlay transparente** sobre a imagem
- **Instruções** no canto superior esquerdo
- **Cursor em crosshair** (cruz)

**Procedimento:**
1. **Primeiro clique**: clique no **canto superior esquerdo** do box textual que você quer mapear
   - Uma bolinha amarela aparecerá marcando o ponto
   - Console mostrará: `🔵 Clique 1: x=XXX, y=YYY (px)`

2. **Segundo clique**: clique no **canto inferior direito** do mesmo box textual
   - Outra bolinha amarela aparecerá
   - Um **retângulo verde** será desenhado automaticamente cobrindo a área
   - Console mostrará: `✅ HOTSPOT CALIBRADO` com o JSON formatado

### Passo 3: Copiar as Coordenadas
O console mostrará algo assim:

```json
{
  "id": "PREENCHER_ID",
  "label": "PREENCHER_LABEL",
  "left": "25.3%",
  "top": "15.2%",
  "width": "22.5%",
  "height": "8.7%"
}
```

**Copie esse JSON** e anote em um arquivo.

### Passo 4: Limpar a Calibração
Pressione **ESC** ou clique no botão "Limpar (ESC)" para resetar e calibrar o próximo hotspot.

---

## IDs a Calibrar (10 hotspots)

Calibre nesta ordem para cobrir toda a imagem do lactente (esquerda → direita, de cima para baixo):

### Coluna Esquerda
1. **`cabeca_perimetro`**  
   Label: "Cabeça / Perímetro Cefálico"  
   Localização: Box superior esquerdo

2. **`orofaringe`**  
   Label: "Orofaringe"  
   Localização: Box intermediário esquerdo

3. **`torax_respiratorio`**  
   Label: "Tórax Respiratório"  
   Localização: Box do meio esquerdo

4. **`abdome`**  
   Label: "Abdome"  
   Localização: Box abaixo do tórax, esquerdo

5. **`figado`**  
   Label: "Fígado / Hipocôndrio D"  
   Localização: Box inferior esquerdo

### Coluna Direita
6. **`face_olhos`**  
   Label: "Olhos / Face"  
   Localização: Box superior direito

7. **`pescoco_linfonodos`**  
   Label: "Pescoço / Linfonodos"  
   Localização: Box intermediário direito

8. **`precordio`**  
   Label: "Precórdio"  
   Localização: Box do meio direito

9. **`baco`**  
   Label: "Baço / Hipocôndrio E"  
   Localização: Box direito abaixo do precórdio

10. **`membros_perfusao`**  
    Label: "Membros / Perfusão / Pulsos / TEC"  
    Localização: Box inferior direito

---

## Onde Colar as Coordenadas

Após calibrar os 10 hotspots, você terá 10 JSONs.  
Atualize o array `LACTENTE_BOX_HOTSPOTS` no arquivo:

```
components/pediatria/PacientePediatricoVisualAjustado.tsx
```

Substitua o array existente com as coordenadas calibradas:

```typescript
const LACTENTE_BOX_HOTSPOTS = [
  {
    id: 'cabeca_perimetro',
    label: 'Cabeça / Perímetro Cefálico',
    left: '25.3%',    // ← seu valor calibrado
    top: '15.2%',     // ← seu valor calibrado
    width: '22.5%',   // ← seu valor calibrado
    height: '8.7%',   // ← seu valor calibrado
  },
  // ... mais 9 hotspots
];
```

---

## Validação Visual

Após atualizar as coordenadas:

1. **Mantenha `DEBUG_HOTSPOT_CALIBRATION = true`** — os retângulos calibrados continuam visíveis
2. **Mude `DEBUG_HOTSPOTS_PEDIATRIA = true`** — os hotspots ficam vermelhos
3. **Recarregue a página** (Cmd+R / Ctrl+R)
4. **Verifique se os retângulos vermelhos cobrem exatamente os boxes textuais**

Se os retângulos não ficarem alinhados:
- Os boxes podem ter sido deslocados pela imagem (responsividade)
- A imagem pode estar em um tamanho diferente do esperado
- **Recalibre** aquele hotspot específico

---

## Próximos Passos

Após validar visualmente que todos os hotspots estão corretos:

1. **Desative o modo calibração:**
   ```typescript
   const DEBUG_HOTSPOT_CALIBRATION = false;
   ```

2. **Desative o modo debug dos hotspots:**
   ```typescript
   const DEBUG_HOTSPOTS_PEDIATRIA = false;
   ```

3. **Teste o clique nos hotspots:**
   - Clique em cada canto de box
   - Verifique se a região correta é selecionada no painel lateral
   - Teste em desktop e mobile

4. **Faça o build final:**
   ```bash
   npm run build
   ```

---

## Troubleshooting

### "O overlay não aparece"
- Verifique se `DEBUG_HOTSPOT_CALIBRATION = true`
- A imagem está carregando? Aguarde alguns segundos
- Abra o DevTools (F12) → Console para ver mensagens

### "Os cliques não são capturados"
- Verifique se está clicando **sobre a imagem** (não nas margens)
- A imagem tem `object-fit: contain` e pode ter padding ao redor

### "As coordenadas estão muito diferentes"
- Isso é normal! A imagem atual pode estar em escala diferente
- Calibre mesmo assim — o sistema recalcula percentualmente

### "Preciso recalibrar tudo"
- Não há problema, pressione ESC para limpar e comece novamente
- Cada calibração é independente

---

## Debug Console

Exemplos de saídas esperadas:

```javascript
// Primeiro clique
🔵 Clique 1: x=145.5, y=89.3 (px)

// Segundo clique
🔵 Clique 2: x=267.8, y=156.2 (px)

// Resultado
✅ HOTSPOT CALIBRADO
{
  "id": "PREENCHER_ID",
  "label": "PREENCHER_LABEL",
  "left": "25.3%",
  "top": "15.2%",
  "width": "22.5%",
  "height": "8.7%"
}

// Limpeza
🔄 Calibração limpa.
```

---

## Notas Técnicas

- **Responsividade:** As coordenadas percentuais funcionam em qualquer resolução
- **Sem object-fit: cover:** A imagem usa `object-fit: contain` para não distorcer
- **getBoundingClientRect():** Captura o tamanho real da imagem renderizada na tela
- **Position absolute:** Os hotspots ficam dentro do mesmo wrapper da imagem

---

Boa calibração! 🎯
