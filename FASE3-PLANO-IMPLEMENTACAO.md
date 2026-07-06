# FASE 3 - Plano de Implementação

## Status Atual

A aplicação está estruturada assim:

```
app/caso/[id]/page.tsx
├── Carrega caso de casosV2 ✅
├── Passa caso ao estado interno (caso) ✅
└── Renderiza componentes:
    ├── ChatPaciente (anamnese)
    ├── ExameFisicoAdultoVisual (exame físico adulto)
    ├── ExameFisicoPediatrico (exame físico pediátrico)
    ├── PainelExamesComplementares (exames)
    ├── FormularioSOAP (SOAP do aluno)
    ├── PainelDiagnostico (diagnóstico e conduta)
    ├── FeedbackOSCE (feedback final)
    └── Outros componentes
```

## Componentes a Modificar por Etapa

### ETAPA 6 - Sinais Vitais de Entrada
- **Componentes-alvo**: Procurar onde SpO2, PA, FC são exibidas
- **Props esperadas**: `caso` já está passado em varios componentes
- **Mudança**: Usar `caso?.sinaisVitais?.entrada` em vez de `caso?.sinaisVitaisCorretos`

### ETAPA 7 - Sinais Vitais de Evolução
- **Componentes-alvo**: `VitalsReassessment` (já importado)
- **Lógica**: Quando feedback é gerado, mostrar evolução do caso

### ETAPA 8 - Exame Físico
- **Componentes-alvo**: 
  - `ExameFisicoAdultoVisual`
  - `ExameFisicoPediatrico`
- **Mudança**: Ler achados de `caso?.exameFisico` em vez de `caso?.exameFisicoCorreto`

### ETAPA 9 - Exames Laboratoriais
- **Componentes-alvo**: `PainelExamesComplementares`, `LaboratoryPanel`
- **Mudança**: Ler de `caso?.exames?.laboratoriais` em vez de `exames_complementares_disponiveis`

### ETAPA 10 - Exames Complementares
- **Componentes-alvo**: `PainelExamesComplementares`
- **Mudança**: Ler de `caso?.exames?.beiraLeito`, `caso?.exames?.imagem`, etc.

### ETAPA 11 - Diagnóstico e Conduta
- **Componentes-alvo**: `PainelDiagnostico`
- **Mudança**: Usar `caso?.diagnostico`, `caso?.condutaEsperada`, etc.

### ETAPA 12 - Feedback
- **Componentes-alvo**: `FeedbackOSCE`
- **Mudança**: Usar `caso?.feedbackDetalhado` em vez de `rubrica_correcao`

### ETAPA 13 - SOAP
- **Componentes-alvo**: `FormularioSOAP`
- **Mudança**: Usar `caso?.modeloSOAP` para validação

### ETAPA 14 - Pediatria
- **Componentes-alvo**: Todos os anteriores
- **Mudança**: Garantir que dados pediátricos estejam disponíveis

## Prioridade de Implementação

1. **Alta prioridade** (impacto visual imediato):
   - ETAPA 9 (exames laboratoriais) - usuário clica e vê resultado
   - ETAPA 8 (exame físico) - usuário clica e vê achado
   - ETAPA 11 (diagnóstico) - usuário formula diagnóstico

2. **Média prioridade** (feedback):
   - ETAPA 12 (feedback) - user vê nota
   - ETAPA 13 (SOAP) - user vê validação do SOAP
   - ETAPA 6 (sinais vitais entrada) - exibição inicial

3. **Baixa prioridade** (refinamento):
   - ETAPA 7 (evolução) - evoluçãoapós conduta
   - ETAPA 10 (complementares) - ECG, imagens
   - ETAPA 14 (pediatria) - dados específicos

## Próximas Ações

1. Examinar `PainelExamesComplementares` para entender como exames são solicitados
2. Examinar `PainelDiagnostico` para entender fluxo de diagnóstico
3. Modificar `lib/prompts.ts` para usar nova fonte
4. Começar implementação pelo `PainelExamesComplementares`
