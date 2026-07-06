# Auditoria: Falso Positivo em Compatibilidade de Imagens

**Data:** 23 de junho de 2026  
**Achado Crítico:** Sistema criando compatibilidade artificial por referências curadas com metadados falsos

---

## 1. O Problema Identificado

### Duplicação de URL com ImageIds Artificiais

| Diagnóstico | imageId Artificial | imageUrl Real | Metadados Originais |
|---|---|---|---|
| PAC (Pneumonia) | `CXR2961` | `CXR2961_IM-1355-1001.png` | ✅ "Opacity/lung/base/left - Pneumonia" |
| Pneumotórax | `CXR2961_Ptx` | `CXR2961_IM-1355-1001.png` | ❌ Mesma imagem, sem pneumothorax |
| Derrame Pleural | `CXR2961_Eff` | `CXR2961_IM-1355-1001.png` | ❌ Mesma imagem, sem effusion |
| Atelectasia | `CXR2961_Atle` | `CXR2961_IM-1355-1001.png` | ❌ Mesma imagem, sem atelectasis |

### O que está acontecendo

```
lib/radiology/openiCuratedReferences.ts:

pneumothorax: {
  imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
  imageId: "CXR2961_Ptx",
  impression: "Pneumothorax pattern - Hyperinflation with absence of lung markings",  ← ARTIFICIAL
  expectedFindingPt: "Radiografia pode mostrar linha pleural visível...",             ← NOSSO TEXTO
}

atelectasis: {
  imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",  ← MESMA URL
  imageId: "CXR2961_Atle",
  impression: "Atelectasis pattern - Linear opacity with volume loss",               ← ARTIFICIAL
  expectedFindingPt: "Radiografia pode mostrar opacidade linear...",                 ← NOSSO TEXTO
}

pleural_effusion: {
  imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",  ← MESMA URL
  imageId: "CXR2961_Eff",
  impression: "Pleural effusion pattern - Blunting of costophrenic angles",         ← ARTIFICIAL
  expectedFindingPt: "Radiografia pode evidenciar velamento basal...",              ← NOSSO TEXTO
}
```

### Por que é um problema

Quando o sistema faz scoring, o fluxo é:

1. Usuário pede imagem para **"pneumotórax"**
2. Sistema busca no Open-i ao vivo com query "pneumothorax"
3. **Nenhuma imagem encontrada** (Open-i não retorna resultados)
4. Cai para **referência curada** em openiCuratedReferences.ts
5. Retorna CXR2961 com nossa "impression" artificial: "Pneumothorax pattern..."
6. Sistema faz scoring contra NOSSA impression, não a original
7. Encontra "pneumothorax" em NOSSA texto, não nos metadados REAIS da imagem
8. `termosEncontrados: ["pneumothorax"]` — mas de onde vem? De NOSSA impression!

### O Engano

```javascript
// O que PARECE estar acontecendo:
Imagem tem metadados reais de pneumothorax
→ termosEncontrados = ["pneumothorax"]
→ score = 100

// O que REALMENTE está acontecendo:
Imagem é CXR2961 = pneumonia (metadados originais do Open-i)
Nós criamos impression = "Pneumothorax pattern..."
Sistema faz scoring contra NOSSA impression artificial
termosEncontrados = ["pneumothorax"] ← vem do nosso texto, não da imagem
score = 100 ← falso!
```

---

## 2. Verificação de Fatos

### CXR2961 — Metadados Reais do Open-i

```
imageUrl: https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png
Impressão original (do Open-i): "Opacity/lung/base/left - Pneumonia"
Fonte: Indiana University Chest X-ray Collection
```

**Essa imagem é claramente de PNEUMONIA (infiltrado no pulmão esquerdo), NÃO de pneumotórax ou atelectasia.**

### Open-i Não Tem Imagens de Pneumotórax Públicas (ou não indexadas)

```bash
$ curl -s "http://localhost:3000/api/exams/references?diagnosis=pneumothorax&limit=5&debug=true"

Resposta:
{
  "sucesso": false,
  "motivo": "Nenhuma imagem encontrada no Open-i para este diagnóstico",
  "fase": "Legado"
}
```

**Conclusão:** Open-i não retorna imagens com "pneumothorax" nos metadados publicados.

### Sistema Cai para Referência Curada (Fallback)

Quando busca ao vivo falha, o código cai para `openiCuratedReferences.ts` e retorna nossa impression artificial.

---

## 3. Problemas de Segurança/Confiabilidade

### 🔴 Falsos Positivos Educacionais

- Pneumotórax mostra imagem de **pneumonia**
- Atelectasia mostra imagem de **pneumonia**
- Derrame Pleural mostra imagem de **pneumonia**

Um aluno pode **aprender padrão errado** porque a "compatibilidade" é artificial.

### 🔴 Termos Encontrados Enganosos

```
diagnosisKey = "pneumothorax"
diagnosis = "pneumotórax"
queryUsada = "pneumothorax"
impression = "Pneumothorax pattern..." ← NOSSA, não da imagem
termosEncontrados = ["pneumothorax"] ← encontrado onde? Na NOSSA impression!
```

**A audit trail mostra:**
```
Score: 100, Termos: ["pneumothorax"]
```

**Mas o auditor descobre:**
```
Imagem original = CXR2961 (pneumonia, não pneumothorax)
Metadados originais = "Opacity/lung - Pneumonia"
Impression artificial = "Pneumothorax pattern..." ← NOSSO TEXTO
```

---

## 4. Solução Recomendada

### Opção A: Usar Apenas Imagens Reais (Recomendado)

1. **Para pneumotórax:**
   - Remover referência curada com URL falsa
   - OU deixar "Sem imagem compatível disponível no Open-i"
   - OU buscar outra coleção com pneumotórax (ex: RSNA)

2. **Para atelectasia:**
   - Remover referência curada com URL falsa
   - OU deixar "Sem imagem compatível"

3. **Para derrame pleural:**
   - Remover referência curada com URL falsa
   - OU deixar "Sem imagem compatível"

### Opção B: Manter Referência Curada MAS Ser Honesto

Se manter, fazer assim:

```typescript
pneumothorax: {
  diagnosisKey: "pneumothorax",
  references: [
    {
      imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
      imageId: "CXR2961_Ptx",
      
      // ORIGINAL — do Open-i
      impressionOriginalOpenI: "Opacity/lung/base/left - Pneumonia",
      
      // EDUCACIONAL — para ensino
      impressionCuradaEducacional: "Exemplo educacional de pneumotórax apical",
      expectedFindingPt: "Linha pleural visível, colapso pulmonar...",
      
      // FLAGS
      isEducationalExample: true,  // ← MARCA que não é imagem real
      usarParaScoringOriginal: false,  // ← NÃO usar metadados originais
      
      fonte: "Open-i / Adaptado para fins educacionais"
    }
  ]
}
```

**E no scoring:**

```typescript
// NÃO fazer:
termosEncontrados = buscarTermosEm(impressionCurada)  // ERRADO

// Fazer:
termosEncontrados = []  // Vazio, porque não é imagem real
scoreRelevancia = 0  // Sem score para imagem educacional
status = "Imagem educacional, não validada por metadados reais"
```

---

## 5. Mapa de Imagenscompartilhadas (Todas as duplicações)

| URL Real | Diagnósticos | Problema |
|---|---|---|
| `CXR2961_IM-1355-1001.png` | PAC, Pneumotórax, Derrame, Atelectasia | ❌ 3 diagnósticos usando imagem de pneumonia |
| `CXR3177_IM-1497-1001.png` | Asma, Bronquiolite, ICC | ⚠️ 3 diagnósticos compartilhando (verificar se apropriado) |
| `CXR2373_IM-0934-1001.png` | DPOC, Cardiomegalia | ⚠️ 2 diagnósticos compartilhando (verificar se apropriado) |

---

## 6. Recomendação Final

**Implementar a Opção A (Usar apenas imagens reais):**

1. Remover referências curadas falsas de `openiCuratedReferences.ts`:
   - `pneumothorax` (se metadados originais não confirmam)
   - `atelectasis` (se metadados originais não confirmam)
   - `pleural_effusion` (se metadados originais não confirmam)

2. Deixar o frontend mostrar:
   ```
   ⚠️ Imagem não disponível no Open-i para este diagnóstico.
      Considere usar um atlas externo para complementar aprendizado.
   ```

3. OU buscar outras fontes públicas com esses diagnósticos:
   - RSNA (Radiological Society of North America)
   - CheXpert
   - Eurorad

4. **Atualizar relatório de auditoria** para deixar claro:
   - Quais imagens são REAIS (com metadados originais)
   - Quais são EDUCACIONAIS (nossa curação, sem metadados reais)
   - O que foi VALIDADO vs o que foi ASSUMIDO

---

**Status:** 🔴 **CRÍTICO** — Remover falsos positivos antes de produção

**Impacto de não corrigir:** Alunos aprendem padrões errados porque a "compatibilidade" é artificial.

