# Estrutura Expandida de Casos Clínicos OSCE

## Visão Geral

O sistema foi preparado para receber um grande banco de casos clínicos. A estrutura foi expandida com novos campos enquanto mantém compatibilidade total com os 3 casos iniciais.

## Estrutura de Campos

### Identificação e Metadados
- **id**: string (único, ex: "1", "2", "pneumonia-001")
- **titulo**: string (título do caso)
- **sistema**: string (ex: "Cardiovascular", "Respiratório", "Gastrointestinal")
- **tema**: string (ex: "Dor Torácica", "Infecção Respiratória", "Dispneia Aguda")
- **nivel**: "iniciante" | "intermediario" | "avancado"
- **tipo_estacao**: "entrevista" | "exame_fisico" | "procedimento" | "integrada"
- **tempo_osce_minutos**: number (tempo estimado do atendimento)
- **objetivo_pedagogico**: string (objetivo de aprendizado)

### Dados Visíveis ao Estudante
Estrutura:
```typescript
dados_visiveis_ao_estudante: {
  nome_paciente: string;
  idade: number;
  sexo: string;
  queixa_principal: string;
  historia_breve: string;
}
```

### Dados Ocultos do Sistema
Informações que o sistema usa para avaliar:
```typescript
dados_ocultos_do_sistema: {
  diagnostico_principal: string;
  diagnosticos_diferenciais: string[];
  sindromes_associadas?: string[];
}
```

### Dados do Paciente
Informações detalhadas:
```typescript
paciente: {
  id: string;
  nome: string;
  idade: number;
  sexo: "M" | "F";
  queixaPrincipal: string;
  historicoDoenca: string;
  antecedentes: string[];
  profissao?: string;
  estado_civil?: string;
  alergias?: string[];
  medicamentos_em_uso?: string[];
}
```

### Respostas do Paciente Virtual
```typescript
respostas_do_paciente: {
  [chave: string]: string;  // Ex: "dor", "febre", "tosse"
}
```

### Sinais Vitais
```typescript
sinais_vitais: {
  corretos: SinaisVitais;
  variacoes?: {
    [chave: string]: SinaisVitais;  // Variações ao longo do tempo
  };
}
```

Estrutura de SinaisVitais:
```typescript
{
  pressaoArterial: string;       // Ex: "160/95 mmHg"
  frequenciaCardiaca: number;    // bpm
  frequenciaRespiratoria: number;// rpm
  temperatura: number;            // Celsius
  saturacaoOxigenio: number;      // % SpO2
  peso?: number;
  altura?: number;
  imc?: number;
}
```

### Exame Físico
```typescript
exame_fisico: {
  correto: ExameFisico;
  por_regiao?: {
    [regiao: string]: ExameFisico;
  };
}
```

Estrutura de ExameFisico:
```typescript
{
  inspecao: string;
  palpacao: string;
  ausculta: string;
  percussao: string;
  observacoes: string;
  regiao?: string;
  achados_positivos?: string[];
  achados_negativos?: string[];
}
```

### Exames Complementares Disponíveis
```typescript
exames_complementares_disponiveis: {
  nome: string;
  descricao?: string;
  resultado?: string;
  valor_referencia?: string;
  unidade?: string;
  interpretacao?: string;
}[]
```

### Hipóteses Diagnósticas Esperadas
```typescript
hipoteses_diagnosticas_esperadas: {
  diagnostico: string;
  probabilidade: number;        // 0-100
  criterios_minimos: string[];
}[]
```

### Diagnósticos Diferenciais
```typescript
diagnosticos_diferenciais: {
  diagnostico: string;
  criterios_exclusao: string[];
  achados_que_descartam: string[];
}[]
```

### Conduta Esperada
```typescript
conduta_esperada: {
  imediata: string[];
  curto_prazo: string[];
  longo_prazo?: string[];
  encaminhamentos?: string[];
}
```

### Critérios de Gravidade
```typescript
criterios_de_gravidade: {
  severidade: "leve" | "moderada" | "grave";
  sinais: string[];
  descricao: string;
  recomendacao: string;
}[]
```

### Erros Críticos
```typescript
erros_criticos: {
  erro: string;
  descricao: string;
  penalidade: number;  // Pontos descontados (1-2.5)
  evitavel?: boolean;
}[]
```

### Checklist OSCE
```typescript
checklist_osce: {
  item: string;
  realizado: boolean;
  critico?: boolean;  // Erro crítico se não realizado
}[]
```

### Rúbrica de Correção
```typescript
rubrica_correcao: {
  criterio: string;
  peso: number;        // Peso relativo (%)
  descricao: string;
  pontuacao_maxima: number;
}[]
```

### Modelo SOAP Esperado
```typescript
modelo_soap: {
  subjetivo: {
    secao: "S";
    componentes_obrigatorios: string[];
    componentes_desejados?: string[];
  };
  objetivo: {
    secao: "O";
    componentes_obrigatorios: string[];
    componentes_desejados?: string[];
  };
  avaliacao: {
    secao: "A";
    componentes_obrigatorios: string[];
    componentes_desejados?: string[];
  };
  plano: {
    secao: "P";
    componentes_obrigatorios: string[];
    componentes_desejados?: string[];
  };
}
```

### Feedback Modelo
```typescript
feedback_modelo: {
  acertos_esperados: string[];
  erros_comuns: string[];
  orientacoes_pedagogicas: string[];
  recursos_complementares?: string[];
}
```

## Compatibilidade com Sistema Anterior

Os campos antigos foram mantidos para compatibilidade:
- `descricaoBreve` (string)
- `categoria` (string)
- `respostaPaciente` (objeto)
- `sinaisVitaisCorretos` (objeto)
- `exameFisicoCorreto` (objeto)
- `diagnosticoCorreto` (string)
- `examesIndicados` (array)
- `condutaCorreta` (string)
- `feedbackPadrao` (objeto)

## Como Adicionar um Novo Caso

1. Copie um dos 3 casos existentes como template
2. Atualize todos os campos de metadados (id, titulo, sistema, etc.)
3. Preencha os dados visíveis ao estudante
4. Defina os dados ocultos do sistema
5. Crie as respostas do paciente virtual
6. Defina sinais vitais corretos e variações
7. Descreva o exame físico completo
8. Liste todos os exames complementares com resultados
9. Especifique hipóteses diagnósticas e diferenciais
10. Defina conduta em fases (imediata, curto/longo prazo)
11. Documento critérios de gravidade e erros críticos
12. Crie checklist OSCE e rúbrica de correção
13. Modele SOAP esperado
14. Prepare feedback com orientações pedagógicas

## Estrutura de Arquivo

```
data/casos-osce.ts          # Casos clínicos (2.2 KB após expansão)
lib/types.ts                # Tipos TypeScript expandidos
lib/mockPaciente.ts         # Respostas do paciente virtual
components/                 # Componentes compatíveis com nova estrutura
```

## Próximos Passos Sugeridos

1. **Importar Dados de PDFs**: Desenvolver script para extrair informações dos PDFs de casos
2. **Validação de Casos**: Criar schema de validação (Zod/Yup) para garantir consistência
3. **Busca e Filtro**: Adicionar funcionalidade de busca por sistema, tema, nível
4. **Banco de Dados**: Quando houver >50 casos, migrar para banco de dados
5. **Versioning**: Implementar controle de versão para atualizações de casos
6. **Analytics**: Rastrear desempenho dos estudantes por caso

## Notas Importantes

✅ A estrutura é totalmente backward-compatible  
✅ Os 3 casos iniciais continuam funcionando sem modificações  
✅ Novos campos são opcionais ou têm valores padrão  
✅ O sistema usa ambos os campos antigos e novos internamente  
✅ Componentes se adaptam a qualquer combinação de campos presentes
