# Teste Manual — Priority 2 Completo

## Setup
```bash
npm run dev
# Abrir http://localhost:3000
```

## Teste 1: PainelDiagnostico com Referência

### Caso: Asma Aguda Grave (ID: 32)
**URL**: `http://localhost:3000/caso/32`

**Steps**:
1. Abrir página do caso
2. Preencher anamnese (chat com paciente)
3. Descer para seção "Diagnóstico e Conduta"
4. ✅ **Verificar**: Seção "Referência esperada" aparece ANTES do botão submit

**Esperado na referência**:
```
Diagnóstico esperado:
"Crise Asmática Grave (Status Asthmaticus)"

Conduta esperada:
- Imediata: Encaminhar para emergência/UTI URGENTEMENTE, Oxigenioterapia agressiva...
- Curto prazo: Monitorização em UTI...
- Longo prazo: Controle de asma...

Critérios de gravidade:
- Grave: SpO2 <90%, Silêncio auscultório, Taquipneia >30

Erros críticos a evitar:
• Não reconhecer como emergência (penalidade: 3)
• Atrasar oxigenioterapia e encaminhamento para UTI (penalidade: 3)
```

**Validações**:
- [ ] Seção pode ser expandida/recolhida (clique no ▶)
- [ ] Conteúdo é legível
- [ ] Entrada do aluno não é bloqueada (pode digitar)
- [ ] Nenhum erro no console

---

## Teste 2: FormularioSOAP com Referência

### Caso: Febre em Criança (ID: ped-01 ou semelhante)
**URL**: `http://localhost:3000/caso/ped-01`

**Steps**:
1. Abrir página do caso pediátrico
2. Preencher anamnese e exame físico
3. Descer para seção "Avaliação Clínica" (SOAP)
4. ✅ **Verificar**: Seção "Referência esperada do SOAP" aparece

**Esperado na referência**:
```
S (Subjetivo) — Badge verde:
[Componentes esperados no SOAP Subjetivo do caso]

O (Objetivo) — Badge azul:
[Componentes esperados no SOAP Objetivo do caso]

A (Avaliação) — Badge laranja:
[Componentes esperados no SOAP Avaliação do caso]

P (Plano) — Badge rosa:
[Componentes esperados no SOAP Plano do caso]
```

**Validações**:
- [ ] 4 badges coloridas aparecem (S verde, O azul, A laranja, P rosa)
- [ ] Seção pode ser expandida/recolhida
- [ ] Cada seção mostra componentes esperados
- [ ] Entrada do aluno não é bloqueada
- [ ] Nenhum erro no console

---

## Teste 3: FeedbackOSCE com Escala Dinâmica

### Qualquer caso
**Steps**:
1. Completar atendimento (anamnese + exame + diagnóstico + SOAP)
2. Submeter (vai para feedback)
3. ✅ **Verificar**: Percentual é calculado corretamente

**Esperado**:
- Se caso tem `feedbackDetalhado.escala.total` = N:
  - Percentual = (nota / N) * 100
  - Exemplo: Se N = 30 e nota = 15: (15/30)*100 = 50%
  
- Se caso NÃO tem `feedbackDetalhado.escala.total`:
  - Percentual usa fallback: (nota / 20) * 100
  - Exemplo: nota = 10: (10/20)*100 = 50%

**Validações**:
- [ ] Percentual aparece corretamente
- [ ] Nota máxima vem do caso (se disponível)
- [ ] Fallback para 20 funciona
- [ ] Nenhum erro no console

---

## Teste 4: Backward Compatibility (Caso sem dados estruturados)

### Caso antigo (se existir)
**Steps**:
1. Tentar abrir um caso que não tem campos de referência
2. ✅ **Verificar**: Nenhum card de referência aparece

**Esperado**:
- [ ] Componentes funcionam normalmente
- [ ] Nenhum erro no console
- [ ] Layout não quebrado

---

## Verificação de Código

### PainelDiagnostico
```bash
cat components/PainelDiagnostico.tsx | grep -A 5 "referenciaAberta"
# Deve retornar: useState(false) e button com ▶
```

### FormularioSOAP
```bash
cat components/FormularioSOAP.tsx | grep -A 5 "Referência esperada do SOAP"
# Deve retornar: div com card expansível
```

### FeedbackOSCE
```bash
cat components/FeedbackOSCE.tsx | grep -A 2 "notaMaxima"
# Deve retornar: const notaMaxima = (caso as any)?.feedbackDetalhado?.escala?.total ?? 20;
```

---

## Git Commits

```bash
git log --oneline | head -5
# Deve mostrar:
# 6b7da8d Priority 2: Usar escala do caso no FeedbackOSCE
# f6e3f14 Priority 2: Adicionar referência SOAP ao FormularioSOAP
# ddc4e63 Priority 2: Adicionar referência clínica ao PainelDiagnostico
```

---

## Compilação

```bash
npm run build
# Esperado: TypeScript check PASSA (exceto erro pré-existente em leadTransform.ts)
```

---

## Checklist Final

- [ ] Teste 1: PainelDiagnostico referência funciona
- [ ] Teste 2: FormularioSOAP referência funciona
- [ ] Teste 3: FeedbackOSCE escala dinâmica funciona
- [ ] Teste 4: Casos antigos não quebram
- [ ] Código verifica com sucesso
- [ ] 3 commits presentes
- [ ] Compilação passa

---

## Notas

- Todos os 3 componentes já estão recebendo `caso` como prop (integração automática)
- Nenhuma tela foi redesenhada
- Apenas seções expansíveis foram adicionadas
- Zero breaking changes

---

**Data**: 5 de julho de 2026
**Status**: PRONTO PARA TESTE
**Próximo**: Priority 3 (Dados pediátricos)
