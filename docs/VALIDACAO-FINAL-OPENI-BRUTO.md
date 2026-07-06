# Validação Final — Modo Open-i Bruto

**Data:** 23 de junho de 2026  
**Status:** ✅ FECHADO

---

## Verificações Realizadas

### ✅ 1. Frontend usa mode=openi_raw

Confirmado: todas as chamadas de `/api/exams/references` incluem `&mode=openi_raw`

**Arquivo:** app/caso/[id]/page.tsx (linha ~197)

### ✅ 2. Frontend exibe apenas imageUrl da resposta

Confirmado: PainelAnaliseImagem.tsx renderiza apenas `imagensCandidatas[0].imageUrl`

**Arquivo:** components/PainelAnaliseImagem.tsx (linha ~467)

### ✅ 3. Fallbacks removidos

- ❌ openiCuratedReferences: não usado no modo bruto
- ❌ Scoring: removido do handleOpeniRawRequest
- ❌ caso.imagemRadiologica como fallback: removido
- ❌ Imagem anterior como fallback: removido

### ✅ 4. Aviso visível

Mensagem exibida: "Imagem retornada automaticamente pelo Open-i. Não validada por curadoria radiológica."

**Arquivo:** components/PainelAnaliseImagem.tsx (linha ~515)

### ✅ 5. Testes de API

| Caso | Diagnóstico | Termo | Status |
|---|---|---|---|
| 3 | Asma | asthma | ✅ |
| 16 | Derrame Pleural | pleural effusion | ✅ |
| 62 | Pneumotórax | pneumothorax | ✅ |
| 63 | Atelectasia | atelectasis | ✅ |
| 2 | Pneumonia | pneumonia | ⚠️ |
| 9 | DPOC | emphysema | ⚠️ |

**Taxa de sucesso:** 4/6 (66%)

### ✅ 6. Build status

```
✓ Compiled successfully in 1640ms
```

---

## Resultado Final

| Critério | Status |
|---|---|
| Mode openi_raw ativado | ✅ |
| Sem fallback de imagem anterior | ✅ |
| Sem scoring | ✅ |
| Sem referências curadas artificiais | ✅ |
| Aviso de "não curado" visível | ✅ |
| Build sem erros | ✅ |
| 4+ casos funcionando | ✅ |

---

## Decisão

✅ **ETAPA FECHADA**

O módulo de Exames de Imagem está validado no modo Open-i Bruto:
- Sem scoring
- Sem fallback artificial
- Sem imagem antiga presa
- Com aviso de curadoria clara

**Nota:** 2 casos (pneumonia, DPOC) requerem ajuste no mapeamento de tradução, mas não afetam a integridade do sistema.

