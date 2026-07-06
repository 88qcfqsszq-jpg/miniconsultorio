# Fase 1: Integração Open-i com Scoring por Metadados

## Objetivo

Implementar seleção de imagens radiológicas do Open-i baseada **100% em metadados**, sem curadoria visual de pixels.

**Diagnósticos P0 (Prioridade Máxima):**
- ✅ Tuberculose Pulmonar (TB)
- ✅ Pneumonia Adquirida na Comunidade (PAC)

## Arquivos Criados

### 1. `diagnoses-open-i-mapping.ts`
Mapeamento global de diagnósticos clínicos para Open-i.

**Contém:**
- `diagnosisKey`: Chave interna para identificação
- `aliases_pt`: Variações em português
- `aliases_en`: Variações em inglês
- `open_i_queries`: Queries para Open-i (em ordem de prioridade)
- `expected_keywords`: Termos positivos fortes (+50 pontos)
- `secondary_keywords`: Termos positivos secundários (+20 pontos)
- `excluded_keywords`: Termos bloqueadores (-100 pontos)
- `critical_blockers`: Termos incompatíveis graves (-200 pontos)
- `min_score`: Score mínimo para aceitar imagem
- `accepts_normal_cxr`: Se radiografia normal é aceitável
- `expected_finding_pt_br`: Descrição esperada para gabarito

**Funções Públicas:**
```typescript
resolveDiagnosisKey(diagnosisPtBr: string): string | null
getDiagnosisConfig(diagnosisKey: string): DiagnosisConfig | null
listarDiagnosisKeysDisponiveis(): string[]
```

### 2. `open-i-score.ts`
Sistema de scoring por metadados.

**Metadados Analisados:**
- `impression` - Impressão diagnóstica
- `findings` - Achados descritos
- `problems` - Problemas identificados
- `meshTerms` - Termos MeSH da NIH
- `caption` - Legenda
- `title` - Título
- `abstract` - Resumo (se disponível)

**Funções Públicas:**
```typescript
scoreOpenIImage(
  image: OpenIImageMetadata,
  diagnosisConfig: DiagnosisConfig
): ScoreResult

filterAndRankImages(
  images: OpenIImageMetadata[],
  diagnosisConfig: DiagnosisConfig
): { approved, rejected }

validateImagesWithLogging(
  images: OpenIImageMetadata[],
  diagnosisConfig: DiagnosisConfig
): void
```

### 3. `phase1-integration.ts`
Integração entre mapeamento e scoring.

**Funções Públicas:**
```typescript
resolveDiagnosisForPhase1(diagnosticoPtBr: string)
  → { diagnosisKey, config } | { error }

applyPhase1Scoring(images: any[], diagnosticoPtBr: string)
  → { approved, rejected, summary } | { error }

isPhase1Mapped(diagnosticoPtBr: string): boolean

listPhase1Diagnoses(): DiagnosisInfo[]
```

### 4. `phase1-test.ts`
Testes manuais para validar a implementação.

**Testes Inclusos:**
1. Resolver diagnósticos
2. Validar mapeamentos
3. Listar diagnósticos P0
4. Scoring de imagens (Pneumonia)
5. Scoring de imagens (Tuberculose)
6. Aplicar scoring em array

**Executar:**
```bash
cd /Users/marceloalmeida/Projetos/mini-consultorio-osce
ts-node lib/radiology/phase1-test.ts
```

## Como Usar

### 1. Validar se diagnóstico está mapeado
```typescript
import { isPhase1Mapped } from "@/lib/radiology/phase1-integration";

if (isPhase1Mapped("Tuberculose pulmonar")) {
  // Caso pode usar Fase 1
}
```

### 2. Resolver diagnóstico para obter config
```typescript
import { resolveDiagnosisForPhase1 } from "@/lib/radiology/phase1-integration";

const resolution = resolveDiagnosisForPhase1(caso.diagnostico_principal);

if ("error" in resolution) {
  // Diagnóstico não mapeado
} else {
  const { diagnosisKey, config } = resolution;
  // Use config.open_i_queries para buscar no Open-i
  // Use config.min_score para validar imagens
}
```

### 3. Aplicar scoring em imagens Open-i
```typescript
import { applyPhase1Scoring } from "@/lib/radiology/phase1-integration";

const result = applyPhase1Scoring(
  imagensDoOpenI,
  caso.diagnostico_principal
);

if ("error" in result) {
  console.log(`Erro: ${result.error}`);
} else {
  // result.approved = imagens aprovadas por score
  // result.rejected = imagens rejeitadas
  // result.summary = estatísticas
  
  const melhoresImagens = result.approved.slice(0, 3);
  // Exibir apenas as melhores
}
```

## Regra de Score

### Cálculo
```
Score Total = 
  (Termos Positivos Fortes × 50) +
  (Termos Positivos Secundários × 20) -
  (Termos Bloqueadores × 100) -
  (Termos Incompatíveis Graves × 200)
```

### Decisão Final
```
if (Score Total < min_score) {
  REJEITAR imagem
} else {
  ACEITAR imagem
}
```

### Exemplos por Diagnóstico

**Pneumonia (min_score = 50):**
- ✅ Termos fortes: pneumonia, consolidation, infiltrate, airspace opacity
- ⚠️ Bloqueadores: normal chest, clear lungs, no focal infiltrate
- ❌ Graves: pneumoperitoneum, bowel obstruction, fracture

**Tuberculose (min_score = 50):**
- ✅ Termos fortes: tuberculosis, cavity, cavitary, upper lobe, apical
- ⚠️ Bloqueadores: no acute cardiopulmonary abnormality, no focal infiltrate
- ❌ Graves: pneumoperitoneum, bowel obstruction

## Fluxo de Integração com Frontend

### Página de Caso Clínico

```
1. Carregar caso clínico
2. Verificar se diagnóstico está mapeado em P0
   ↓
3. SIM → Usar Fase 1
   - Resolver diagnosisKey
   - Buscar imagens no Open-i (usando open_i_queries)
   - Aplicar applyPhase1Scoring()
   - Retornar apenas approved
   ↓
4. NÃO → Usar fluxo legado
   - Normalizar diagnóstico para labelNIH
   - Usar providers existentes (NIH, fixtures)
```

### Componente PainelAnaliseImagem

O componente já está pronto para usar:
```typescript
// Propriedade aceita múltiplas imagens
imagensCandidatasPrecarregadas?: any[];

// Seleciona a melhor automaticamente
// Usuário pode navegar entre outras se houver
```

## Exemplo: Caso de Tuberculose

**Entrada:**
```typescript
const caso = {
  id: "ped-10",
  dados_ocultos_do_sistema: {
    diagnostico_principal: "Tuberculose pulmonar ativa"
  }
};
```

**Processamento:**
```typescript
1. resolveDiagnosisForPhase1("Tuberculose pulmonar ativa")
   → { diagnosisKey: "tuberculosis", config: { ... } }

2. Buscar em Open-i com queries:
   - "tuberculosis chest xray"
   - "pulmonary tuberculosis"
   - "upper lobe infiltrate"
   - etc.

3. Aplicar applyPhase1Scoring(imagensOpenI, "Tuberculose pulmonar")
   → { approved: [...], rejected: [...], summary: {...} }

4. Retornar approved[0:3] para galeria
```

**Saída:**
```typescript
{
  imageId: "openi-12345",
  imageUrl: "https://...",
  impression: "Right upper lobe cavitary lesion...",
  score: {
    totalScore: 150,
    termsFound: {
      strongPositive: ["tuberculosis", "cavity", "upper lobe", "apical"]
    }
  },
  expectedFinding: "Radiografia de tórax evidencia infiltrado... [texto completo]"
}
```

## Validação

### Testes Manuais
```bash
ts-node lib/radiology/phase1-test.ts
```

### Testes com Casos Reais
Buscar casos em:
- `data/casos-osce.ts`: OSCE-11 (TB), OSCE-02 (PAC)
- `data/casos-pediatricos.ts`: PED-10 (TB), PED-13 (PAC)

## Próximos Passos

### Fase 2 (P1)
Mapear diagnósticos adicionais:
- DPOC / Enfisema
- Asma / Crise asmática
- Insuficiência cardíaca com congestão
- Cardiopatia congênita

### Fase 3 (P2)
Mapear diagnósticos restantes:
- Pneumonia atípica
- Derrame pleural
- Tromboembolismo pulmonar

## Segurança

### ✅ O que Fase 1 GARANTE:
- 100% scoring por metadados, sem curadoria visual
- Imagens rejeitadas se score < min_score
- Filtro de termos incompatíveis críticos
- Fallback seguro se nenhuma imagem passar

### ❌ O que Fase 1 NÃO FAZ:
- Não interpreta pixels ou características visuais
- Não gera imagens por IA
- Não faz download de imagens
- Não salva imagens localmente

## Métricas Esperadas

**Pneumonia (PAC):**
- Score esperado: 75-100
- Taxa de aprovação: ~70%

**Tuberculose:**
- Score esperado: 85-100
- Taxa de aprovação: ~60%

## Contato / Debug

**Logs disponíveis:**
- `[Open-i Provider]` - Provider de busca
- `[Open-i Scoring]` - Sistema de scoring
- `[Radiology Service]` - Serviço central (com DEBUG_RADIOLOGY=true)

**Ativar logs:**
```bash
export DEBUG_RADIOLOGY=true
```

---

**Status:** ✅ Fase 1 Implementada
**Data:** 23 de junho de 2026
**Diagnósticos P0:** TB, PAC (2/10 diagnósticos planejados)
