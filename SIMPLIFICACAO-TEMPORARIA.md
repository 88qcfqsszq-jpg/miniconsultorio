# ⏸️ SIMPLIFICAÇÃO TEMPORÁRIA: Restaurar Comportamento Visual

**Data**: 2026-06-21  
**Status**: ✅ Compilado e pronto para teste visual  
**Objetivo**: Fazer imagem Open-i aparecer novamente (antes de mover curadoria para backend)

---

## 🎯 Estratégia

Removemos toda a curadoria complexa do frontend. A lógica agora é:

```
1. Buscar: /api/exams/references?diagnosis=pneumonia&limit=3
   (FIXO em "pneumonia" por enquanto)

2. Proteção: Bloquear apenas termos CRÍTICOS não-relacionados
   ❌ pneumoperitoneum
   ❌ free intraperitoneal air
   ❌ bowel obstruction

3. Renderizar: Primeira imagem que passou na proteção
   (Sem filtro de relevância)

4. Visual: <img> simples, sem mensagens de teste
```

---

## 📋 Mudanças Feitas

### Remoção
- ❌ `isPneumoniaDiagnosis()` → Mapeamento expandido
- ❌ `isImageRelevantForDiagnosis()` → Filtro complexo
- ❌ Logs `[DEBUG]` → Todos removidos
- ❌ Busca dinâmica por diagnóstico do caso
- ❌ Priorização de termos positivos
- ❌ Fallback controlado com lógica

### Mantido
- ✅ `hasCriticalBlockTerm()` → Bloqueia apenas críticos
- ✅ Renderização simples `<img>`
- ✅ Atribuição obrigatória
- ✅ Fallback "Imagem indisponível"
- ✅ Build compila

---

## 🧪 Teste Visual Rápido

```
1. Abra http://localhost:3002
2. Qualquer caso clínico
3. Clique "Exames de Imagem"
4. Verifique: Radiografia aparece? (SIM/NÃO)
```

**Esperado**: ✅ Radiografia de RX aparece (sem aviso de teste)

---

## 📊 Fluxo Simplificado

```
Clica "Exames de Imagem"
    ↓
useEffect executa
    ↓
Busca: /api/exams/references?diagnosis=pneumonia&limit=3
    ↓
API retorna: { sucesso: true, imagens: [...] }
    ↓
Para cada imagem:
    ├─ Tem pneumoperitoneum? ❌ PULA
    ├─ Tem free air? ❌ PULA
    ├─ Tem bowel obstruction? ❌ PULA
    └─ SEM bloqueio? ✅ USA ESTA
    ↓
setImagemOpenI(imagemSelecionada)
    ↓
Renderiza: <img src={imageUrl} />
```

---

## ⚠️ Limitações Temporárias

```
❌ Busca fixada em "pneumonia"
   → Não usa diagnóstico dinâmico do caso
   → Próximas funcionalidades virão depois

❌ Sem curadoria de relevância
   → Pode retornar imagem não-ideal se tiver muitos resultados
   → Apenas bloqueia termos críticos

❌ Sem logs informativos
   → Para testes visuais, apenas resultado final

✅ Bloqueio de termos críticos
   → Nunca retorna pneumoperitoneum/free air/bowel obstruction
```

---

## 🎯 Próximo Passo (Não fazer agora)

Quando imagem aparecer novamente:

```
1. Mover curadoria complexa para backend (openiProvider.ts)
2. Deixar frontend apenas renderizar imagem recebida
3. Backend cuida de:
   - Mapeamento de diagnósticos
   - Priorização de termos positivos
   - Filtragem avançada
   - Logs de debug
```

---

## ✅ Status

```
✅ Build: Compilado
✅ Proteção crítica: Mantida
✅ Renderização: Simples <img>
✅ Busca: Fixa em "pneumonia"
✅ Frontend: Sem curadoria
```

**Pronto para validação visual!** 👀

Abra um caso e clique "Exames de Imagem" para confirmar que a radiografia aparece.
