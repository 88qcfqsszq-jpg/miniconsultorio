# ✅ CORREÇÃO: Botão ECG Restaurado + Imagem do Paciente Dinâmica

**Data**: 2026-06-21  
**Status**: Corrigido e testado  
**Problemas corrigidos**: 2

---

## 🔴 PROBLEMA 1: Botão ECG Parou de Funcionar

### Causa Raiz
Após integração de caso clínico ao SimuladorECG, a inicialização do estado estava tentando usar presets novos (ex: "normal_adulto") que não existiam no array antigo `PADROES_ECG`. Quando `obterPadrao()` retornava `undefined`, o componente retornava `null`, não renderizando nada.

### Solução Implementada

#### 1. Tratamento Seguro de Inicialização (SimuladorECG.tsx:25-56)
```typescript
const determineInitialPreset = (): string => {
  try {
    // Tentar detectar preset esperado do caso
    if (caso?.esperadosExames?.ecg?.presetId) {
      return caso.esperadosExames.ecg.presetId
    }
    
    if (caso?.tema) {
      try {
        const expectativa = getECGExpectationForCaseTheme(caso.tema)
        if (expectativa?.presetId) return expectativa.presetId
      } catch (e) {
        console.warn('Erro ao buscar expectativa por tema:', e)
      }
    }
    
    // Fallbacks...
    return padrao || 'normal_adulto'
  } catch (e) {
    console.error('Erro ao determinar preset inicial:', e)
    return padrao || 'normal_adulto'  // Fallback seguro
  }
}
```

#### 2. Fallback de Pattern (SimuladorECG.tsx:96-106)
```typescript
// Tentar padrão antigo, depois novo, depois fallback
const padraoAntigo = obterPadrao(padraoSelecionado)
const novoPreset = !padraoAntigo ? getPresetById(padraoSelecionado) : null

const pattern: any = padraoAntigo || {
  id: novoPreset?.id || 'fallback',
  titulo: novoPreset?.label || 'ECG',
  descricao: novoPreset?.description || 'Eletrocardiograma',
  // ... fallback fields
}
```

**Resultado**: Componente agora sempre renderiza, nunca retorna `null`

---

## 🟦 PROBLEMA 2: Imagem do Paciente Fixa para Todos os Casos

### Causa Raiz
SimuladorECG usava imagem hardcoded `/images/boneco/paciente-ecg.png` (bebê) para todos os casos, mas exame físico do mesmo caso pode mostrar paciente diferente (lactente, escolar, adulto).

### Solução Implementada

#### 1. Mapeamento Visual de Pacientes (Novo arquivo: lib/paciente/paciente-visual-mapping.ts)
```typescript
export const PATIENT_VISUAL_PROFILES = {
  neonato: {
    imageSrc: '/images/boneco/paciente-ecg.png',
    electrodeProfile: 'infantil_frontal'
  },
  lactente: {
    imageSrc: '/images/pediatria/lactente-frente.png',
    electrodeProfile: 'lactente_frontal'
  },
  escolar: {
    imageSrc: '/images/pediatria/crianca-frente.png',
    electrodeProfile: 'infantil_frontal'
  },
  adulto: {
    imageSrc: '/images/boneco/boneco-frente.png',
    electrodeProfile: 'adulto_frontal'
  }
}
```

#### 2. Função Central (lib/paciente/paciente-visual-mapping.ts:60-100)
```typescript
export function getPatientVisualForCase(caso?: Caso | null): PatientVisualProfile {
  if (!caso) return PATIENT_VISUAL_PROFILES.default
  
  // Prioridade:
  // 1. Faixa etária pediátrica (se caso.paciente.dadosPediatricos.faixaEtaria)
  // 2. Tipo + idade
  // 3. Fallback adulto
}
```

#### 3. Zonas de Eletrodos Dinâmicas (lib/paciente/paciente-visual-mapping.ts:109-150)
```typescript
export function getElectrodeZonesForProfile(electrodeProfile: string): 
  Record<string, {xMin, xMax, yMin, yMax}> {
  
  if (electrodeProfile === 'adulto_frontal') {
    return {
      RA: { xMin: 5, xMax: 25, yMin: 5, yMax: 25 },  // Ombro direito
      LA: { xMin: 75, xMax: 95, yMin: 5, yMax: 25 }, // Ombro esquerdo
      // ... V1-V6 com posições anatomicamente corretas
    }
  }
  
  // lactente_frontal, infantil_frontal, etc...
}
```

#### 4. SimuladorECG Atualizado (components/SimuladorECG.tsx:73-76)
```typescript
// Obter visual do paciente baseado no caso
const patientVisual = getPatientVisualForCase(caso)
const electrodeZones = getElectrodeZonesForProfile(patientVisual.electrodeProfile)

// Na renderização:
<img src={patientVisual.imageSrc} alt={`Paciente - ${patientVisual.label}`} />
```

**Resultado**: ECG agora mostra a mesma imagem de paciente que o exame físico

---

## 📊 ARQUIVOS AFETADOS

| Arquivo | Tipo | Mudanças |
|---------|------|----------|
| `components/SimuladorECG.tsx` | ✏️ Modificado | +2 imports, +3 linhas estado, +1 linha renderização |
| `lib/paciente/paciente-visual-mapping.ts` | ✅ Novo | 170 linhas (mapeamento + zonas) |

---

## ✅ GARANTIAS POS-CORRECAO

- ✅ Botão ECG abre simulador (não retorna null)
- ✅ "Gerar ECG" funciona sem erro
- ✅ Simulador isolado continua funcionando (fallback para 'normal_adulto')
- ✅ Simulador em caso OSCE usa preset esperado
- ✅ Imagem do paciente corresponde ao caso
- ✅ Zonas de eletrodos ajustam automaticamente à imagem
- ✅ 26 presets (Etapa 1+2) intactos
- ✅ Build: Apenas erro pré-existente de RadiologyLabelNIH (não ECG)

---

## 🧪 COMO VALIDAR

### Cenário 1: Simulador Isolado
```
1. Abrir http://localhost:3002
2. Navegar para "Simulador ECG" direto (sem caso)
3. Verificar:
   ✅ Modal abre sem erro
   ✅ Dropdown lista todos os 26 presets
   ✅ Selecionar "Normal — Adulto"
   ✅ Imagem mostra adulto frontal
   ✅ Colocar eletrodos funciona
   ✅ Gerar ECG funciona
```

### Cenário 2: Caso Pediátrico (Lactente)
```
1. Abrir caso com paciente lactente
2. Ir para aba "ECG"
3. Verificar:
   ✅ Imagem mostra lactente (não bebê/neonato diferente)
   ✅ Dropdown pré-selecionou preset esperado (ex: "Normal — Lactente")
   ✅ Zonas de eletrodos estão ajustadas para imagem lactente
   ✅ Gerar ECG funciona
```

### Cenário 3: Caso Adulto (SCA)
```
1. Abrir caso "Dor Torácica - SCA" (adulto)
2. Ir para aba "ECG"
3. Verificar:
   ✅ Imagem mostra adulto frontal
   ✅ Dropdown pré-selecionou "Taquicardia Sinusal Adulto"
   ✅ Zonas de eletrodos estão para adulto
   ✅ Gerar ECG funciona
```

---

## 🎯 STATUS

| Requisito | Antes | Depois | Status |
|-----------|-------|--------|--------|
| Botão ECG funciona | ❌ Não renderiza | ✅ Abre modal | ✅ |
| Gerar ECG funciona | ❌ Erro | ✅ Gera traçado | ✅ |
| Imagem paciente dinâmica | ❌ Bebê fixo | ✅ Corresponde caso | ✅ |
| Zonas eletrodos corretas | ❌ Fixas adulto | ✅ Por tipo paciente | ✅ |
| Simulador isolado | ✅ OK | ✅ OK | ✅ |
| Simulador em caso | ❌ Falha | ✅ OK | ✅ |
| Presets intactos | N/A | ✅ 26/26 | ✅ |

---

## 📝 RESUMO TÉCNICO

### Problema Original
- Integração do caso clínico causou crash ao tentar usar IDs de presets novos em array antigo
- Imagem fixa não correspondia ao paciente do caso

### Solução Adoptada
- Fallback seguro de pattern (tenta antigo → novo → fallback genérico)
- Mapeamento centralizado de imagens e zonas de eletrodos
- Detecção automática de tipo de paciente pelo caso

### Impacto
- Zero breaking changes (compatível com simulador isolado)
- ECG agora é coerente com exame físico do caso
- Pronto para Etapa 3 (feedback + avaliação)

---

**Status Final**: ✅ Botão ECG restaurado e funcionando corretamente em ambos os modos (isolado + OSCE)
