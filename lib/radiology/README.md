# Módulo "Análise de Imagem" - Documentação Técnica

## 📋 Visão Geral

Módulo educacional definitivo para análise de imagens radiológicas (RX de tórax) integrado aos casos clínicos gerados pela OpenAI API.

**Importante**: Este é um módulo educacional. Não é diagnóstico clínico. Não envie exames reais de pacientes.

---

## 🏗️ Arquitetura

```
lib/radiology/
├── types.ts                    # Tipos definitivos
├── labelMapping.ts             # Diagnóstico clínico → rótulo NIH
├── radiologyImageService.ts    # Serviço orquestrador (FASE 2)
├── providers/
│   └── nihProvider.ts          # Provider NIH (FASE 2)
├── fixtures/
│   └── sampleImages.ts         # Dados de teste local (FASE 7)
└── README.md                   # Este arquivo

components/
├── RadiologyImageViewer.tsx    # Viewer simples (FASE 4)
└── PainelAnaliseImagem.tsx     # Painel principal (FASE 5)

app/api/radiology/
├── detectar/route.ts           # Detectar necessidade (FASE 3)
├── buscar-imagem/route.ts      # Buscar imagem (FASE 3)
├── validar-coerencia/route.ts  # Validar com OpenAI (FASE 3)
├── gerar-gabarito/route.ts     # Gerar gabarito (FASE 3)
└── corrigir-resposta/route.ts  # Corrigir resposta (FASE 3)
```

---

## 📦 Fases de Implementação

### FASE 1: Tipos e Mapeamento ✅

**Status**: COMPLETO

**Arquivos**:
- `lib/radiology/types.ts` - Tipos TypeScript completos
- `lib/radiology/labelMapping.ts` - Mapeamento diagnósticos → NIH

**O que foi feito**:
- Definição de todos os tipos do módulo
- Mapeamento centralizado de 30+ diagnósticos clínicos
- Funções de normalização e busca (exata, sinônimo, parcial)
- Fallback seguro para "No Finding"

**Próximo**: FASE 2

---

### FASE 2: Serviços e Provider (PENDENTE)

**Arquivos a criar**:
- `lib/radiology/radiologyImageService.ts`
- `lib/radiology/providers/nihProvider.ts`
- `lib/radiology/fixtures/sampleImages.ts`

**O que fazer**:
- Implementar serviço orquestrador
- Criar provider NIH com estrutura definitiva
- Implementar detecção de necessidade de imagem
- Criar estrutura de fixtures para testes locais

---

### FASE 3: Endpoints Backend (PENDENTE)

**Arquivos a criar**:
- `app/api/radiology/detectar/route.ts`
- `app/api/radiology/buscar-imagem/route.ts`
- `app/api/radiology/validar-coerencia/route.ts`
- `app/api/radiology/gerar-gabarito/route.ts`
- `app/api/radiology/corrigir-resposta/route.ts`

---

### FASE 4: Viewer (PENDENTE)

**Arquivo a criar**:
- `components/RadiologyImageViewer.tsx`

**Funcionalidades**:
- Exibir imagem PNG/JPG
- Zoom
- Brilho
- Contraste
- Reset
- Tela cheia (se simples)
- Tratamento de erro se não carregar

---

### FASE 5: Painel Principal (PENDENTE)

**Arquivo a criar**:
- `components/PainelAnaliseImagem.tsx`

**Layout**:
- Coluna esquerda: resumo do caso
- Centro: viewer RX
- Direita: campos de resposta

---

### FASE 6: Integração Visual (PENDENTE)

**Arquivos a modificar**:
- `lib/types.ts` - Adicionar campo `imagemRadiologica?`
- `app/caso/[id]/page.tsx` - Adicionar botão e renderização condicional

---

### FASE 7: Teste com Fixtures (PENDENTE)

**Validação**:
- Testar UI com fixtures locais
- Garantir que caso funciona sem imagem
- Validar error handling

---

## 🔌 Integração com NIH Chest X-ray

### Status Atual

**Provider NIH**: Estrutura preparada, integração real não configurada.

Quando `lib/radiology/providers/nihProvider.ts` estiver pronto:
- Retornará erro controlado se não configurado
- Nunca retornará imagem falsa como se fosse NIH real
- Documentará exatamente o que é necessário

### O que Falta

Para integração **real** com NIH Chest X-ray via Google Cloud:

1. **Google Cloud Project**
   - Project ID
   - Credenciais JSON

2. **BigQuery Dataset**
   - Nome do dataset NIH Chest X-ray
   - Tabelas com metadados das imagens

3. **Cloud Storage Bucket**
   - Bucket com imagens PNG/JPG
   - URLs públicas ou com acesso controlado

4. **Variáveis de Ambiente**
   ```
   GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
   GOOGLE_CLOUD_CREDENTIALS_JSON=/path/to/credentials.json
   NIH_BIGQUERY_DATASET=projeto.dataset
   NIH_CLOUD_STORAGE_BUCKET=seu-bucket
   ```

### Como Conectar NIH Real

#### Passo 1: Configurar Google Cloud

```bash
# Criar projeto
gcloud projects create seu-projeto-id

# Habilitar APIs
gcloud services enable bigquery.googleapis.com
gcloud services enable storage.googleapis.com

# Criar service account
gcloud iam service-accounts create radiology-service \
  --project=seu-projeto-id

# Gerar chave JSON
gcloud iam service-accounts keys create ~/radiology-key.json \
  --iam-account=radiology-service@seu-projeto-id.iam.gserviceaccount.com
```

#### Passo 2: Acessar NIH Chest X-ray

O NIH oferece acesso ao dataset de duas formas:

1. **Via Google Cloud (recomendado)**
   - BigQuery dataset: `bigquery-public-data.nlm_chexpert.metadata`
   - Imagens em GCS: `nlm-datasets/nlm_chexpert/`
   - Acesso público (sem custos de armazenamento)

2. **Via API OpenData**
   - Mais lento e com limite de requisições
   - Não recomendado para produção

#### Passo 3: Implementar Provider NIH

No arquivo `lib/radiology/providers/nihProvider.ts`:

```typescript
import { BigQuery } from "@google-cloud/bigquery";
import { Storage } from "@google-cloud/storage";

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const credentials = JSON.parse(
  process.env.GOOGLE_CLOUD_CREDENTIALS_JSON || "{}"
);

const bigquery = new BigQuery({
  projectId,
  keyFilename: credentials,
});

// Função para buscar imagem por rótulo
async function buscarPorRotulo(rotulo: string) {
  const query = `
    SELECT image_path, labels
    FROM \`bigquery-public-data.nlm_chexpert.metadata\`
    WHERE ARRAY_CONTAINS(labels, '${rotulo}')
    LIMIT 10
  `;
  // ... executar query
}
```

#### Passo 4: Testar Localmente

```typescript
// Em radiologyImageService.ts
const imagem = await nihProvider.buscarImagemNIH(parametros);
if (!imagem.sucesso) {
  console.log("Provider diz:", imagem.motivo);
  // Se retornar erro, usar fixture para testes visuais
}
```

#### Passo 5: Deploy

- Adicionar variáveis ao `.env.production`
- Testar em staging primeiro
- Monitor de falhas de busca

---

## 🧪 Fixtures Educacionais

### ⚠️ BLOQUEIO EXPLÍCITO EM PRODUÇÃO

**Regra Crítica**: Fixtures são **COMPLETAMENTE BLOQUEADAS** em produção (NODE_ENV === "production").

Mesmo que `NIH_USE_FIXTURES_LOCALLY=true`, o código verifica:
```typescript
if (process.env.NODE_ENV === "production") {
  // ⛔ Fixtures bloqueadas — retorna erro controlado
  return { sucesso: false, motivo: "Imagem radiológica indisponível" }
}
```

### Quando Usar (Desenvolvimento Apenas)

Fixtures podem ser usadas **APENAS** em desenvolvimento local (`NODE_ENV !== "production"`) com:
- `NIH_USE_FIXTURES_LOCALLY=true` AND
- `NODE_ENV=development`

Ambas as condições devem ser verdadeiras.

### Como Identificar

- Campo `integracaoReal: false`
- Campo `fonte: "Fixture educacional local"`
- Arquivo: `lib/radiology/fixtures/sampleImages.ts`
- Badge em RadiologyImageViewer: "Fixture educacional local"

### Comportamento por Ambiente

| Ambiente | NIH Real | Fixture | Resultado |
|----------|----------|---------|-----------|
| **Produção** | ✅ Sim | ❌ Bloqueado | Imagem real ou erro |
| **Produção** | ❌ Não | ❌ Bloqueado | Erro controlado |
| **Dev** | ✅ Sim | ✅ Usado | Imagem real |
| **Dev** | ❌ Não | ✅ Usado | Fixture + aviso |

### Nunca Fazer

❌ Usar fixture em produção (tecnicamente impossível — bloqueado)
❌ Desabilitar bloqueio de fixture
❌ Colocar `NIH_USE_FIXTURES_LOCALLY=true` em arquivo commitado de produção
❌ Misturar fixture com dados reais
❌ Retornar fixture silenciosamente quando NIH falha em produção

---

## 🚫 Regras Obrigatórias

1. **Aviso educacional**
   - "Ferramenta educacional. Não usar para diagnóstico real. Não envie exames reais de pacientes."
   - Exibir em cada tela de análise

2. **Nunca bloquear o caso**
   - Se imagem não encontrada, mostrar mensagem discreta
   - Caso clínico continua funcionando normalmente

3. **Nunca usar mock como real**
   - Se usando fixture, `integracaoReal: false`
   - Nunca retornar fixture como se fosse do NIH

4. **Sempre atribuir fonte**
   - Campo `atribuicao` sempre preenchido
   - Ex: "NIH Chest X-ray Database | Domínio Público"

5. **Nunca expor chave da API**
   - OpenAI: apenas no backend
   - Google Cloud: variáveis de ambiente
   - Nunca em arquivo `.env` local commited

---

## 📊 Mapeamento de Diagnósticos

Ver `lib/radiology/labelMapping.ts` para lista completa.

### Exemplos

| Diagnóstico Clínico | Rótulo NIH | Confiança |
|---|---|---|
| Pneumonia | Pneumonia | Alta |
| Pneumotórax | Pneumothorax | Alta |
| Derrame pleural | Effusion | Alta |
| Insuficiência cardíaca | Cardiomegaly | Média |
| RX normal | No Finding | Alta |

### Adicionar Novo Mapeamento

1. Abrir `lib/radiology/labelMapping.ts`
2. Adicionar à const `MAPEAMENTO_DIAGNOSTICOS`:

```typescript
"seu-diagnostico": {
  labelNIH: "SeuRotuloNIH",
  confianca: "alta",
  sinonimos: ["sinônimo1", "sinônimo2"],
  justificativa: "Por quê?"
}
```

3. Testar com `normalizarDiagnosticoParaNIH("seu diagnóstico")`

---

## 🔍 Testes

### Teste de Mapeamento

```typescript
import { normalizarDiagnosticoParaNIH } from "@/lib/radiology/labelMapping";

const resultado = normalizarDiagnosticoParaNIH("Pneumonia");
console.log(resultado.labelNIH); // "Pneumonia"
console.log(resultado.confiancaMapeamento); // "alta"
```

### Teste do Provider

```typescript
import { nihProvider } from "@/lib/radiology/providers/nihProvider";

const resultado = await nihProvider.buscarImagemNIH({
  labelNIH: "Pneumonia",
  modalidade: "RX",
  regiao: "torax",
});

if (!resultado.sucesso) {
  console.log("Erro:", resultado.motivo); // Esperado se não configurado
}
```

---

## 📝 Logs e Auditoria

Registrar em backend:

- `casoId`
- `diagnóstico solicitado`
- `label NIH mapeado`
- `provider usado`
- `sucesso/falha da busca`
- `resultado da validação`
- `se imagem foi exibida ou descartada`

**Nunca registrar**:
- Dados sensíveis de pacientes reais
- URLs de imagens com patient IDs

---

## ❓ FAQ

**P: Por que não usar mock?**
R: Mock disfarçado de integração real engana desenvolvedores. Melhor ter erro explícito.

**P: Posso usar fixture em produção?**
R: Não. Fixtures são **BLOQUEADAS EXPLICITAMENTE** em produção (NODE_ENV === "production"). O código retorna erro controlado se NIH real não estiver configurado. Não há fallback para fixture em produção, mesmo que `NIH_USE_FIXTURES_LOCALLY=true`.

**P: E se NIH não responder?**
R: Retorna erro controlado. Caso continua funcionando.

**P: Como remover fixture depois?**
R: Deletar arquivo `lib/radiology/fixtures/sampleImages.ts` e comentar import.

**P: Quanto custa usar NIH?**
R: Acesso ao dataset é gratuito. Custos: BigQuery queries (~$6.25/TB) e armazenamento (~$0.02/GB/mês).

---

## 🔌 Integração Real: NIH Chest X-ray via Google Cloud

### ⚠️ IMPORTANTE: NIH ≠ MIMIC

Este provider integra **NIH Chest X-ray** (`chc-nih-chest-xray`), não MIMIC-CXR.

- **NIH Chest X-ray**: Dataset oficial do NIH Clinical Center
- **MIMIC-CXR**: Dataset separado do MIT (não implementado aqui)

Se precisar de MIMIC-CXR no futuro, criar: `lib/radiology/providers/mimicProvider.ts`

### Pré-Requisitos

1. **Google Cloud Project** com acesso a:
   - BigQuery
   - Cloud Storage
   - NIH Chest X-ray Dataset (MIMIC-CXR ou similar)

2. **Credenciais de Service Account** com permissões:
   - BigQuery Data Viewer (ler queries)
   - Storage Object Viewer (ler imagens)

3. **Dataset configurado** no BigQuery com tabela de metadados

### Configuração

#### 1. Criar Google Cloud Project

```bash
# No console.cloud.google.com:
1. Criar novo projeto
2. Ativar BigQuery API
3. Ativar Cloud Storage API
4. Criar Service Account (IAM)
5. Atribuir roles (BigQuery Data Viewer, Storage Object Viewer)
6. Gerar JSON key
```

#### 2. Variáveis de Ambiente

Adicionar em `.env.local` (NUNCA commitar credencial):

```env
# Google Cloud (OBRIGATÓRIA para qualquer autenticação)
GOOGLE_CLOUD_PROJECT_ID=mini-consultorio

# Autenticação (escolha UMA):

# Opção A: JSON Service Account (quando liberado)
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}

# Opção B: Application Default Credentials (agora)
# Usar: gcloud auth application-default login

# NIH Chest X-ray (VALORES REAIS)
NIH_GCP_PROJECT_ID=chc-nih-chest-xray
NIH_BIGQUERY_DATASET=nih_chest_xray
NIH_BIGQUERY_TABLE=nih_chest_xray
NIH_BIGQUERY_LOCATION=us
NIH_IMAGE_ID_FIELD=SOPInstanceUID
NIH_STUDY_INSTANCE_FIELD=StudyInstanceUID
NIH_SERIES_INSTANCE_FIELD=SeriesInstanceUID
NIH_SOP_INSTANCE_FIELD=SOPInstanceUID
NIH_LABELS_FIELD=StudyDescription

# Desabilitar fixtures em produção
NIH_USE_FIXTURES_LOCALLY=false
```

#### 2.1 Autenticação Flexível

O provider suporta **duas formas de autenticação**:

**Prioridade 1: JSON Service Account**
- Se `GOOGLE_APPLICATION_CREDENTIALS_JSON` estiver definido
- Use quando a chave JSON for liberada
- Funciona imediatamente em produção

**Prioridade 2: Application Default Credentials (ADC)**
- Se JSON não estiver definido, usa ADC automaticamente
- Funciona com: `gcloud auth application-default login`
- Permite desenvolvimento local e testes no Cloud Shell
- Sem necessidade de arquivo JSON

**Sem autenticação**:
- Retorna erro controlado
- Não quebra a UI
- Mensagem clara sobre configuração faltante

#### 3. Validação de Configuração

**Requisitos Mínimos**:
- `GOOGLE_CLOUD_PROJECT_ID` (obrigatória)
- Uma das formas de autenticação:
  - `GOOGLE_APPLICATION_CREDENTIALS_JSON` OU
  - Application Default Credentials (via `gcloud auth application-default login`)

**Se algum requisito faltar**:
```json
{
  "sucesso": false,
  "motivo": "GOOGLE_CLOUD_PROJECT_ID não configurado",
  "requerConfiguracao": true,
  "proximosPassos": [
    "1. Configurar GOOGLE_CLOUD_PROJECT_ID=mini-consultorio",
    "2. Usar Application Default Credentials: gcloud auth application-default login",
    "3. Ou fornecer GOOGLE_APPLICATION_CREDENTIALS_JSON com JSON service account"
  ]
}
```

#### 4. Estrutura Real do NIH Chest X-ray

**Projeto**: `chc-nih-chest-xray`
**Dataset**: `nih_chest_xray`
**Tabela**: `nih_chest_xray`
**Total de registros**: 112.120

**Campos Principais**:
```sql
SOPInstanceUID       STRING    -- ID único da imagem
StudyInstanceUID     STRING    -- ID único do estudo
SeriesInstanceUID    STRING    -- ID único da série
StudyDescription     STRING    -- Descrição/achados do estudo
PatientID            STRING    -- ID anonimizado do paciente
PatientAge           INT64     -- Idade do paciente
PatientSex           STRING    -- Sexo (M/F)
Modality             STRING    -- Modalidade (RX, etc)
```

#### 5. Query Executada Automaticamente

O provider executa query parametrizada:

```sql
SELECT
  SOPInstanceUID as image_id,
  StudyInstanceUID as study_id,
  SeriesInstanceUID as series_id,
  StudyDescription as study_description
FROM `chc-nih-chest-xray.nih_chest_xray.nih_chest_xray`
WHERE LOWER(StudyDescription) LIKE LOWER('%Pneumonia%')
  OR LOWER(StudyDescription) LIKE LOWER('%finding%')
ORDER BY RAND()
LIMIT 10
```

**Resultado**:
- ID da imagem: `SOPInstanceUID`
- Estudo: `StudyInstanceUID`
- Série: `SeriesInstanceUID`
- Descrição/Labels: `StudyDescription`

Imagens devem estar em storage acessível (público ou credenciado).

### Comportamento em Produção

| Cenário | Behavior |
|---------|----------|
| **Google Cloud configurado** | ✅ Busca real no NIH |
| **Google Cloud faltando** | ❌ Erro controlado, nunca fixture |
| **Imagem não encontrada** | ❌ Erro: "Indisponível para este caso" |
| **BigQuery erro** | ❌ Log seguro (sem credenciais) |

### Segurança

✅ **Credenciais**:
- Nunca logadas
- Nunca enviadas ao frontend
- Apenas backend acessa Google Cloud
- JSON parseado em try/catch

✅ **Logs**:
- ✓ Label solicitado
- ✓ Image ID encontrado
- ✓ Motivo de falha (genérico)
- ✗ Credenciais
- ✗ URL assinada sensível
- ✗ JSON inteiro

### Testes

#### Testar Configuração

```typescript
import { nihProvider } from "@/lib/radiology/providers/nihProvider";

// Verificar status
console.log(nihProvider.obterStatusConfiguracao());

// Testar busca
const resultado = await nihProvider.buscarImagemNIH({
  labelNIH: "Pneumonia",
  modalidade: "RX",
  regiao: "torax"
});

console.log(resultado);
```

#### Testar Endpoint

```bash
curl -X POST http://localhost:3000/api/radiology/buscar-imagem \
  -H "Content-Type: application/json" \
  -d '{
    "casoClinico": {
      "id": "caso-123",
      "paciente": { "idade": 45, "sexo": "M" },
      "dados_ocultos_do_sistema": { "diagnostico_principal": "Pneumonia" }
    },
    "labelNIH": "Pneumonia"
  }'
```

Resposta esperada:

```json
{
  "sucesso": true,
  "dados": {
    "imagem": {
      "disponivel": true,
      "imageId": "p00p000001",
      "imageUrl": "https://storage.googleapis.com/mimic-cxr-public/p00/p000001/...",
      "labels": ["Pneumonia", "Infiltrate"],
      "fonte": "NIH Chest X-ray",
      "integracaoReal": true,
      "podeExibirAoAluno": false
    }
  }
}
```

### Troubleshooting

**"NIH Chest X-ray não configurado"**
- Verificar GOOGLE_CLOUD_PROJECT_ID
- Verificar GOOGLE_APPLICATION_CREDENTIALS_JSON (JSON válido)
- Verificar credenciais têm permissões necessárias

**"Nenhuma imagem encontrada"**
- Label NIH pode estar errado
- Dataset/tabela pode não ter dados para esse label
- Verificar NIH_BIGQUERY_DATASET e NIH_BIGQUERY_TABLE

**"Erro ao buscar em BigQuery"**
- BigQuery pode estar com quota excedida
- Credenciais podem ter expirado
- Verificar conectividade Google Cloud

---

## 📚 Referências

- [NIH Chest X-ray Dataset](https://www.nih.gov/news-events/news-releases/nih-clinical-center-provides-one-largest-publicly-available-chest-x-ray-datasets-scientific-community)
- [Google Cloud BigQuery](https://cloud.google.com/bigquery)
- [Google Cloud Storage](https://cloud.google.com/storage)
- [CheXpert Dataset Paper](https://arxiv.org/abs/1901.07031)

---

**Última atualização**: FASE 1 completa - 2026-06-20
