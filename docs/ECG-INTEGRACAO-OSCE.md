# ✅ INTEGRAÇÃO: ECG SINTÉTICO AO FLUXO OSCE

**Data**: 2026-06-21  
**Status**: Implementado e pronto para uso  
**Arquivos criados/modificados**: 5  
**Compatibilidade**: Zero breaking changes com simulador isolado

---

## 📊 RESUMO EXECUTIVO

O ECG sintético didático (Etapa 1 + 2) foi integrado ao fluxo OSCE como exame complementar **coerente com o caso clínico**:

- ✅ Quando o aluno solicita ECG em um caso, o preset esperado é automaticamente sugerido
- ✅ O ECG gerado fica salvo no atendimento
- ✅ A solicitação/interpretação pode ser avaliada no feedback
- ✅ O simulador isolado continua funcionando normalmente

---

## 🔧 ARQUIVOS MODIFICADOS

| Arquivo | Mudanças | Impacto |
|---------|----------|--------|
| `lib/types.ts` | Expandir `EsperadoExame` com campos de ECG | Tipos para expectativas |
| `lib/ecg/ecg-case-mapping.ts` | **Novo**: Mapeamento tema → preset ECG | Lógica de seleção |
| `components/SimuladorECG.tsx` | Aceitar `caso` como prop + lógica de preset | Usa caso para preset |
| `app/caso/[id]/page.tsx` | Passar `caso` ao SimuladorECG | Conecta ao fluxo |
| `docs/ECG-INTEGRACAO-OSCE.md` | **Novo**: Documentação de integração | Guia de uso |

---

## 🎯 COMO FUNCIONA

### 1. Aluno Abre ECG em um Caso

```
Caso → Menu "ECG" → Clica "Solicitar ECG"
```

### 2. Sistema Detecta Expectativa

```typescript
// Em SimuladorECG.tsx:

const getInitialPreset = (): string => {
  // 1. Se caso tem expectativa explícita
  if (caso?.esperadosExames?.ecg?.presetId) {
    return caso.esperadosExames.ecg.presetId
  }

  // 2. Se caso tem tema, buscar por tema
  if (caso?.tema) {
    const expectativa = getECGExpectationForCaseTheme(caso.tema)
    if (expectativa?.presetId) return expectativa.presetId
  }

  // 3. Fallback por idade do paciente
  if (caso?.paciente?.idade) {
    if (edad < 1) return 'normal_neonato'
    if (edad < 3) return 'normal_lactente'
    // ...
  }

  // 4. Fallback final
  return 'normal_adulto'
}
```

### 3. Preset Apropriado é Carregado

```
Dropdown "Padrão ECG" → Pré-selecionado com preset do caso
```

### 4. Aluno Gera ECG

```
Colocar eletrodos → Clicar "Gerar ECG" → ECG gerado com preset esperado
```

### 5. ECG é Salvo no Atendimento

```typescript
const handleECGGerado = useCallback((ecgGeradoData: any) => {
  setEcgGerado(ecgGeradoData)
  setExamesSolicitados(prev => [...prev, {
    nome: ecgGeradoData.nome,
    resultado: JSON.stringify({
      interpretacao: ecgGeradoData.interpretacao,
      presetId: ecgGeradoData.presetId,
      selectedLeads: ecgGeradoData.selectedLeads,
    }),
    timestamp: new Date(),
  }])
}, [])
```

---

## 📋 MAPEAMENTO CASO → ECG ESPERADO

### Arquivo: `lib/ecg/ecg-case-mapping.ts`

Define qual preset é esperado para cada tipo de caso clínico:

```typescript
export const ECG_CASE_MAPPING: Record<string, EsperadoExame> = {
  'dor_toracica_sca': {
    indicado: true,
    prioridade: 'obrigatório',
    presetId: 'taquicardia_sinusal_adulto',
    interpretacaoEsperada: [...],
    justificativa: 'ECG é exame inicial...',
    pontosDeEnsino: [...],
  },
  
  'palpitacoes': {
    indicado: true,
    prioridade: 'obrigatório',
    presetId: 'taquicardia_supraventricular',
    // ...
  },
  
  'sincope': {
    indicado: true,
    prioridade: 'obrigatório',
    presetId: 'bradicardia_sinusal',
    // ...
  },
  
  // ... mais casos
}
```

### Casos Mapeados (Etapa Inicial)

| Tema Clínico | Prioridade | Preset | Observações |
|--------------|-----------|--------|-------------|
| Dor Torácica / SCA | Obrigatório | taquicardia_sinusal_adulto | Exame diagnóstico inicial |
| Palpitações | Obrigatório | taquicardia_supraventricular | Caracterizar ritmo |
| Síncope | Obrigatório | bradicardia_sinusal | Avaliar ritmo/condução |
| Dispneia | Recomendado | taquicardia_sinusal_adulto | Diferencia causa cardiaca/pulmonar |
| Febre Pediátrica | Não indicado | normal_lactente | Não priorário isoladamente |
| Hipertensão | Recomendado | normal_adulto | Avalia efeitos crônicos |
| Fibrilação Atrial | Obrigatório | fibrilacao_atrial | Diagnóstico + monitoramento |
| Sem queixa cardiaca | Não indicado | — | Triagem desnecessária |

---

## 🔍 COMO ADICIONAR EXPECTATIVA DE ECG A UM CASO

### Opção 1: Via Tema (Automático)

```typescript
// Em casos-osce.ts:

{
  id: "1",
  titulo: "Dor Torácica - SCA",
  tema: "dor_toracica_sca",  // ← Match automático
  
  // Resto do caso...
}

// Resultado: Sistema detecta "dor_toracica_sca" 
// → Busca em ECG_CASE_MAPPING 
// → Usa 'taquicardia_sinusal_adulto'
```

### Opção 2: Via Campo Explícito

```typescript
// Em casos-osce.ts:

{
  id: "2",
  titulo: "Caso Customizado",
  
  esperadosExames: {
    ecg: {
      indicado: true,
      prioridade: 'obrigatório',
      presetId: 'bloqueio_av_mobitz_i',
      interpretacaoEsperada: [
        'PR progressivamente aumentado',
        'Onda P periódica não conduzida',
      ],
      justificativa: 'Paciente com síncope recorrente, investigar bloqueio AV',
      pontosDeEnsino: [
        'Fenômeno de Wenckebach',
        'PR alonga até haver falha de condução',
      ],
    }
  },
  
  // Resto do caso...
}
```

---

## 📊 ESTRUTURA DE DADOS

### Interface: `EsperadoExame` (em `lib/types.ts`)

```typescript
export interface EsperadoExame {
  indicado: boolean  // Se ECG é apropriado neste caso
  prioridade: 'obrigatório' | 'recomendado' | 'opcional' | 'não indicado'
  
  // Para ECG especificamente:
  presetId?: string  // ID do preset ECG esperado
  interpretacaoEsperada?: string[]  // Achados esperados
  achadoEsperado?: string  // Descrição geral
  justificativa?: string  // Por que ECG neste caso
  pontosDeEnsino?: string[]  // O que o aluno deve aprender
  observacoes?: string  // Notas adicionais
}
```

### Interface: `ECGGerado` (em `lib/types.ts`)

```typescript
export interface ECGGerado {
  tipo: "ECG"
  nome: string  // "Eletrocardiograma de 12 derivações"
  dataHora: string  // ISO timestamp
  presetId: string  // ID do preset usado
  padraoSelecionado: string
  selectedLeads: ECGLead[]
  
  resultado: RespostaGeracaoECG  // Dados brutos do gerador
  interpretacao: InterpretacaoECG  // Interpretação automática
  pontosEnsino: string[]  // Pontos educacionais
  aviso: string  // "Padrão sintético..."
  metadata?: MetadadosECG
}
```

---

## 💾 ONDE ECG É SALVO

### Estado do Atendimento

```typescript
// Em /app/caso/[id]/page.tsx:

const [ecgGerado, setEcgGerado] = useState<any>(null)
const [examesSolicitados, setExamesSolicitados] = useState<ExameSolicitado[]>([])

// Quando ECG é gerado:
const handleECGGerado = (ecgGeradoData) => {
  setEcgGerado(ecgGeradoData)  // ← Salvo aqui
  setExamesSolicitados([...prev, {
    nome: "Eletrocardiograma",
    resultado: JSON.stringify({...}),
    timestamp: new Date(),
  }])  // ← Também adicionado à lista de exames
}
```

### Acesso no Feedback

```typescript
// Em componente de Feedback:
// O ECG já realizado está disponível para avaliação

if (ecgGerado) {
  // Avaliar:
  // 1. Se era obrigatório e foi realizado → ✅
  // 2. Se interpretação está correta → ✅
  // 3. Se aluno consegue identificar achados → ✅
}
```

---

## 📈 VALIDAÇÃO VISUAL

### Verificação 1: Caso com Tema Mapeado

```
1. Abrir caso com tema "dor_toracica_sca"
2. Ir para aba ECG
3. Dropdown "Padrão ECG" deve exibir:
   ✅ Pré-selecionado: "Taquicardia Sinusal Adulto"
4. Gerar ECG
5. Resultado deve salvar com preset correto
```

### Verificação 2: Caso com Expectativa Explícita

```
1. Abrir caso com esperadosExames.ecg.presetId = "bradicardia_sinusal"
2. Ir para aba ECG
3. Dropdown deve exibir:
   ✅ Pré-selecionado: "Bradicardia Sinusal"
4. Gerar ECG
5. Resultado deve respeitar preset esperado
```

### Verificação 3: Simulador Isolado Continua Funcionando

```
1. Abrir http://localhost:3002
2. Ir para "Simulador ECG" direto (sem caso)
3. Dropdown deve listar todos os 26 presets
4. Poder selecionar qualquer preset
5. Gerar ECG deve funcionar normalmente
```

---

## 🎓 INTEGRAÇÃO COM FEEDBACK

### Critérios de Avaliação (Futura Etapa 3)

Para cada caso com ECG esperado:

```
Se prioridade === 'obrigatório':
  ✅ Aluno solicitou ECG → ponto positivo
  ❌ Aluno não solicitou → registrar falha importante
  
Se prioridade === 'recomendado':
  ✅ Aluno solicitou → ponto positivo leve
  ✓ Aluno não solicitou → sem penalizar
  
Se prioridade === 'não indicado':
  ✅ Aluno não solicitou → correto
  ⚠️ Aluno solicitou → feedback educativo (não era prioridade)
```

### Comparação de Interpretação (Futura)

```typescript
// Comparar resposta do aluno com esperado:

const interpretacaoAluno = "Taquicardia sinusal, FC 110, sem alterações ST"
const interpretacaoEsperada = [
  "Taquicardia sinusal",
  "FC elevada",
  "Sem alterações ST"
]

// Validação simples por keywords
const acertos = interpretacaoEsperada.filter(achado => 
  interpretacaoAluno.toLowerCase().includes(achado.toLowerCase())
)

// Resultado: 3/3 = 100%
```

---

## 🚀 PRÓXIMOS PASSOS

### Fase 1: Adicionar Casos (Recomendado)

1. Identificar 5-10 casos principais em `casos-osce.ts`
2. Adicionar campo `tema` ou `esperadosExames.ecg` a cada um
3. Testar no navegador se preset é detectado corretamente

### Fase 2: Feedback (Etapa 3)

1. Implementar avaliação de ECG no feedback final
2. Comparar solicitação vs expectativa
3. Avaliar qualidade da interpretação do aluno

### Fase 3: Interpretação do Aluno (Etapa 4)

1. Adicionar campo de resposta: "Sua interpretação do ECG"
2. Aluno escreve interpretação
3. Sistema compara com esperado
4. Feedback automático ou manual

---

## 📋 CHECKLIST TÉCNICO

- ✅ Interface `EsperadoExame` expandida com campos ECG
- ✅ Arquivo `ecg-case-mapping.ts` criado com 8 temas clínicos
- ✅ SimuladorECG atualizado para aceitar `caso` prop
- ✅ Lógica de seleção de preset implementada (4 níveis de fallback)
- ✅ App chamada de SimuladorECG passa `caso`
- ✅ Build compila sem erros ECG-relacionados
- ✅ Simulador isolado continua funcionando
- ✅ Zero breaking changes com presets Etapa 1/2

---

## 🎯 CONFIRMAÇÕES FINAIS

✅ **Simulador isolado**: Funciona normalmente (todos os 26 presets)  
✅ **Integração OSCE**: ECG agora usa preset apropriado do caso  
✅ **Salvamento**: ECG é armazenado no atendimento  
✅ **Compatibilidade**: Zero mudanças em Etapa 1/2  
✅ **Tipos**: Estrutura pronta para feedback futuro  
✅ **Documentação**: Guia completo para adicionar casos  

---

## 📌 EXEMPLO PRÁTICO: ADICIONAR CASO COM ECG

### Antes (Caso sem ECG esperado)

```typescript
{
  id: "novo-caso",
  titulo: "Dor Torácica",
  // ... resto do caso
  // Sem campo esperadosExames
}

// Resultado: ECG carregará "normal_adulto" por padrão
```

### Depois (Caso com ECG esperado)

```typescript
{
  id: "novo-caso",
  titulo: "Dor Torácica",
  tema: "dor_toracica_sca",  // ← Basta adicionar isso!
  
  // OU

  esperadosExames: {
    ecg: {
      indicado: true,
      prioridade: 'obrigatório',
      presetId: 'taquicardia_sinusal_adulto',
      justificativa: 'SCA requer ECG nos primeiros 10 min',
      interpretacaoEsperada: [
        'Taquicardia',
        'QRS estreito',
        'Sem supradesnivelamento'
      ],
      pontosDeEnsino: [
        'ECG é diagnóstico inicial em dor torácica',
        'Procurar alterações de ST-T',
        'Comparar com ECG anterior se disponível'
      ]
    }
  },
  
  // ... resto do caso
}

// Resultado: ECG carregará 'taquicardia_sinusal_adulto' 
// e exibirá justificativa + pontos de ensino
```

---

**Status**: ✅ PRONTO PARA USO

O ECG sintético está totalmente integrado ao fluxo OSCE. Próximos casos criados ou atualizados podem usar o sistema automaticamente.

Recomendação: Adicionar casos gradualmente começando pelos mais críticos (SCA, Palpitações, Síncope).
