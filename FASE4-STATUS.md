# FASE 4 - Status da Integração de Componentes

## ✅ Concluído Nesta Iteração

### 1. Props do Caso Passadas aos Componentes
- ✅ `PainelDiagnostico` - recebe `caso` como prop (2 locais)
- ✅ `FormularioSOAP` - recebe `caso` como prop (2 locais)
- ✅ `FeedbackOSCE` - já recebia `caso` como prop

### 2. Interfaces Atualizadas
- ✅ `PainelDiagnosticoProps` - adicionar `caso?: any`
- ✅ `FormularioSOAPProps` - adicionar `caso?: any`

### 3. Compilação
- ✅ JavaScript compila sem erros
- ✅ TypeScript - erro pré-existente em `leadTransform.ts` (não relacionado)

## 🔄 Próximas Etapas da FASE 4

### IMEDIATO (Priority 1)

#### 1. Integrar Mapeador de Exames Laboratoriais
**Arquivo**: `app/api/exames-complementares/route.ts`
**O que fazer**:
- Criar função `normalizarTexto()` para remover acentos e converter para minúsculas
- Criar mapa de sinônimos (hemograma, função renal, etc.)
- Implementar busca em `caso.exames.laboratoriais` por nome normalizado
- Retornar resultado com interpretação, valores de referência, prioridade

**Impacto**: Permite ao aluno solicitar exames por nome natural e receber resultados do caso

#### 2. Finalizar API de Exames Complementares
**Arquivo**: Mesma rota acima, função `processoFallback()`
**O que fazer**:
- Usar como referência `caso?.exames?.beiraLeito`, `caso?.exames?.imagem`, etc.
- Procurar campo no caso antes de retornar resposta genérica contextual
- Se encontrar em caso, retornar resultado estruturado do caso

**Impacto**: Exames raio-x, ECG, ecocardiograma vêm do caso

### SECUNDÁRIO (Priority 2)

#### 3. Adicionar Placeholder de Diagnóstico Esperado no PainelDiagnostico
**Arquivo**: `components/PainelDiagnostico.tsx`
**O que fazer**:
- Se `caso?.diagnostico` ou `caso?.diagnosticoCorreto` existir, exibir em card expandível
- Label: "Diagnóstico esperado (referência)"
- Não bloquear input do aluno, apenas mostrar para referência
- Renderizar de forma legível: se for objeto, mostrar campos principais

**Impacto**: Aluno pode consultar diagnóstico esperado durante atendimento

#### 4. Adicionar Referência de SOAP no FormularioSOAP
**Arquivo**: `components/FormularioSOAP.tsx`
**O que fazer**:
- Se `caso?.modeloSOAP` existir, exibir componentes obrigatórios de cada seção
- Card recolhível: "Componentes esperados no SOAP"
- Mostrar o que deve estar em S, O, A e P para o caso

**Impacto**: Aluno sabe o que espera-se em cada seção

### TERCIÁRIO (Priority 3)

#### 5. Integrar Exame Físico (se não estiver)
**Arquivo**: Componentes de exame físico
**O que fazer**:
- Garantir que `caso?.exameFisico` é a fonte
- Se região não tiver achado, mostrar mensagem padronizada

**Impacto**: Exame físico vem integralmente do caso

#### 6. Preservar Dados Pediátricos
**Arquivo**: Componentes responsáveis por exibir dados do caso
**O que fazer**:
- Se `caso?.tipoPaciente === "pediatrico"`, exibir em sidebar ou card:
  - Responsável
  - Peso
  - Faixa etária
  - Estado vacinal
- Não redesenhar, apenas garantir que dados apareçam em algum lugar

**Impacto**: Dados pediátricos não são perdidos

## 📋 Lista de Arquivos a Modificar

```
Priority 1:
  app/api/exames-complementares/route.ts — mapeador de exames

Priority 2:
  components/PainelDiagnostico.tsx — referência do diagnóstico
  components/FormularioSOAP.tsx — referência do SOAP

Priority 3:
  components/ExameFisicoAdultoVisual.tsx (ou equivalente)
  components/ExameFisicoPediatrico.tsx
  app/caso/[id]/page.tsx — exibir dados pediátricos
```

## 🧪 Testes Manuais Pendentes

Após implementar as mudanças, testar:

1. **Asma Aguda Grave adulto**
   - [ ] Aparece em OSCE Adulto
   - [ ] Sinais vitais exibem valores do caso
   - [ ] Exame físico respiratório vem do caso
   - [ ] Hemograma retorna resultado do caso
   - [ ] Gasometria retorna resultado do caso
   - [ ] Diagnóstico esperado aparece no PainelDiagnostico

2. **Febre em Criança de 4 anos**
   - [ ] Aparece em OSCE Pediátrico
   - [ ] Responsável aparece (exibido em algum lugar)
   - [ ] Peso aparece (exibido em algum lugar)
   - [ ] Sinais vitais vêm do caso
   - [ ] Hemograma/Urina retornam do caso
   - [ ] SOAP esperado aparece no FormularioSOAP

3. **Puericultura**
   - [ ] Antropometria exibida
   - [ ] Desenvolvimento exibido
   - [ ] Vacinação exibida

4. **Maus-tratos**
   - [ ] Dados de proteção infantil exibidos

## 📊 Estimativa Final

**Status Global FASE 4**: 20% concluído
- ✅ Props passadas
- 🔄 Mapeador de exames (próximo)
- ❌ Referências de diagnóstico/SOAP
- ❌ Dados pediátricos exibidos
- ❌ Testes manuais

**Tempo estimado para conclusão**: 2-3 horas de trabalho focado

## 🚀 Estratégia para Próxima Sessão

1. Começar pelo mapeador de exames (alto impacto)
2. Depois referenciais em formulários (melhoria UX)
3. Finalizar com dados pediátricos
4. Executar testes manuais

**Não redesenhar nada. Apenas conectar dados existentes.**
