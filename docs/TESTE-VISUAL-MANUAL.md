# ✅ TESTE VISUAL MANUAL — ETAPA 1

**Tempo estimado**: 10-15 minutos para testar todos os 13 presets

---

## 🚀 COMO FAZER O TESTE

### 1. Abrir a aplicação
```
http://localhost:3002
```

### 2. Navegação

**Opção A** - Via "Prova OSCE":
- Clicar em "Prova OSCE"
- Escolher qualquer caso
- No modal do caso, procurar por "Simulador ECG" ou "Exame Complementar"
- Clicar em botão "📊 Gerar ECG"

**Opção B** - Via "Treinamento":
- Clicar em "Treinamento"
- Escolher "Pediatria" ou similar
- Abrir um caso
- Procurar por "Simulador ECG"

### 3. Dentro do Simulador ECG

Quando o modal abrir:
1. **Encontrar o dropdown "Padrão ECG"**
   - Procure por um seletor que diz "Padrão ECG:" ou similar
   - Deve listar os 13 presets

2. **Para cada preset**:
   - Selecionar no dropdown
   - Colocar eletrodos (mínimo 8 dos 10):
     * Arrastar V1-V6 (precordiais) para o peito
     * Arrastar RA, LA, RL, LL (membros) para os braços/pernas
   - Clicar no botão verde "📊 Gerar ECG"
   - Validar os critérios abaixo

---

## ✅ CRITÉRIOS A VALIDAR PARA CADA PRESET

Marque ✅ ou ❌ para cada:

### Critério 1: Aparece no dropdown
- [ ] ✅ Sim — aparece com o nome correto
- [ ] ❌ Não — não encontrado

### Critério 2: Gera sem erro
- [ ] ✅ Sim — ECG gerado, sem tela vermelha
- [ ] ❌ Não — erro ao gerar

### Critério 3: 12 derivações visíveis
Procure na tela se aparecem estes rótulos:
- [ ] I  [ ] II  [ ] III
- [ ] aVR  [ ] aVL  [ ] aVF
- [ ] V1  [ ] V2  [ ] V3
- [ ] V4  [ ] V5  [ ] V6

(Se todos os 12 aparecem → ✅)

### Critério 4: Linha II Ritmo sem fundo preto ⚠️ CRÍTICO
- [ ] ✅ Fundo claro (rosa/branco)
- [ ] ❌ Fundo preto (FALHOU)

### Critério 5: Grid claro
- [ ] ✅ Grid visível com linhas quadriculadas
- [ ] ❌ Grid ausente ou preto

### Critério 6: QRS visível
- [ ] ✅ Picos claros (QRS se destaca)
- [ ] ❌ Traçado flat ou ilegível

### Critério 7: Traçado completo
- [ ] ✅ Não cortado nas laterais
- [ ] ❌ Traçado começando ou terminando cortado

### Critério 8: FC bate com esperado
Compare o número exibido (Frequência cardíaca em bpm) com o esperado:
- [ ] ✅ Dentro da faixa esperada
- [ ] ❌ Fora da faixa

### Critério 9: Interpretação diferente por preset
- [ ] ✅ Interpretação muda de um preset para outro
- [ ] ❌ Mesma interpretação sempre

### Critério 10: Pontos de ensino
- [ ] ✅ Seção verde com bullet points (5-7 itens)
- [ ] ❌ Não aparece

### Critério 11: Aviso educacional
- [ ] ✅ Caixa amarela: "Traçado sintético..."
- [ ] ❌ Não aparece

---

## 📋 PRESETS A TESTAR (13)

Copie esta tabela e preencha conforme testa:

```
| # | Preset | Dropdown | Gera ECG | 12 Deriv | II Ritmo | FC OK | Status |
|---|--------|----------|----------|----------|----------|-------|--------|
| 01| Normal — Neonato | | | | | | |
| 02| Normal — Lactente | | | | | | |
| 03| Normal — Pré-escolar | | | | | | |
| 04| Normal — Escolar | | | | | | |
| 05| Normal — Adolescente | | | | | | |
| 06| Normal — Adulto | | | | | | |
| 07| Taquicardia Sinusal Ped | | | | | | |
| 08| Taquicardia Sinusal Adulto | | | | | | |
| 09| Bradicardia Sinusal | | | | | | |
| 10| Arritmia Sinusal Resp | | | | | | |
| 11| Artefato Leve | | | | | | |
| 12| Artefato Intenso | | | | | | |
| 13| Troca RA/LA | | | | | | |
```

Preencha com ✅ ou ❌

---

## 🔍 CRITÉRIOS ESPECÍFICOS

### ECG Normal — Lactente
```
✅ FC entre 110-130 bpm (esperado 120)
✅ DII claramente POSITIVO (acima da linha)
✅ aVR claramente NEGATIVO (abaixo da linha)
✅ V1 com R visível (maior que em adulto)
```

### ECG Normal — Adulto
```
✅ FC entre 60-90 bpm (esperado 75)
✅ aVR negativo
✅ V1: R pequena, S grande
✅ V5/V6: R bem maior que S
```

### Taquicardia Sinusal Pediátrica
```
✅ FC próxima de 150 bpm
✅ QRS muito próximos (batimentos rápidos)
✅ P visível antes de cada QRS
```

### Bradicardia Sinusal
```
✅ FC próxima de 55 bpm
✅ RR bem espaçado (batimentos afastados)
✅ P visível e normal
```

### Artefato Movimento Intenso
```
✅ Traçado com muito ruído (oscilações)
✅ Aviso menciona "artefato" ou "repetir ECG"
✅ QRS difícil de ver (mascarado pelo ruído)
```

### Troca de Eletrodos RA/LA
```
✅ DI INVERTIDO (negativo, abaixo da linha)
✅ aVR POSITIVO (acima da linha — ANORMAL!)
✅ Aviso técnico mencionando "troca" ou "eletrodos"
```

---

## 📌 CHECKLIST FINAL

Após testar todos os 13:

- [ ] Todos os 13 aparecem no dropdown?
- [ ] Todos geram ECG sem erro?
- [ ] Todos mostram 12 derivações?
- [ ] Nenhum tem linha II Ritmo com fundo preto?
- [ ] As frequências batem com esperado?
- [ ] Os avisos educacionais aparecem?
- [ ] Nenhuma tela vermelha de erro?

---

## ✅ RESULTADO

Se marcar ✅ em todos acima:
```
🎉 ETAPA 1 APROVADA VISUALMENTE

Próximo: ETAPA 2 (13 novos presets)
```

Se marcar ❌ em algum:
```
❌ ETAPA 1 FALHOU

Qual preset falhou? _____________
Qual critério? _________________
Descrição do erro: _____________
```

---

## 💡 DICAS

1. **Se o dropdown não aparecer**: 
   - Verifique se está dentro de um caso OSCE
   - Procure por um botão "Simulador ECG" ou "Eletrocardiografia"

2. **Se ECG não gera**:
   - Colocar pelo menos 8 eletrodos
   - Clicar em "Gerar ECG" (botão verde)

3. **Se a linha II Ritmo tiver fundo preto**:
   - Nota-se claramente que é diferente das outras
   - ISSO É UM BUG — precisa corrigir antes da Etapa 2

4. **Para comparar FC de um preset para outro**:
   - Mude o dropdown
   - Gere de novo
   - Compare o número exibido em "Frequência cardíaca"

5. **Screenshot útil**:
   - Se encontrar erro, tirar print da tela
   - Pode ajudar a diagnosticar

---

## 🕐 TEMPO ESTIMADO

- Configuração inicial: 1-2 min
- Teste de cada preset: ~1 min (dropdown + colocar eletrodos + gerar)
- 13 presets × 1 min = 13 min
- **Total: ~15 minutos**

---

## 📞 Quando terminar

Reportar:
- ✅ Todos os 13 passaram? → Etapa 1 aprovada
- ❌ Algum falhou? → Descrever qual e o erro

---

**Sucesso! 🚀**
