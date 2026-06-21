# Estratégia: NIH Chest X-ray via Google Cloud Public Dataset

## Objetivo

Exibir imagens públicas do NIH Chest X-ray associadas às patologias dos casos, **sem baixar arquivos, sem armazenar localmente, sem credenciais específicas**.

## Contexto: 2 Caminhos Possíveis

### Caminho A: Via Projeto GCP Privado (`chc-nih-chest-xray`)
- ✅ Funciona se credenciais disponíveis
- ❌ Requer ADC ou JSON service account
- ❌ Dependência de autenticação

### Caminho B: Via Google Cloud Public Dataset ⭐ RECOMENDADO
- ✅ Sem credenciais necessárias
- ✅ Dados públicos, acesso direto
- ✅ URLs públicas das imagens
- ✅ Metadados via BigQuery público
- ✅ Escalável e resiliente

## Como Funciona (Caminho B)

### 1. Dataset Público no BigQuery

**Localização**:
```
Projeto: bigquery-public-data (ou google.com/bigquery-public-data)
Dataset: nlm_nih_chest_xray_dataset
Tabelas:
  - cxr_metadata: metadados das imagens
  - cxr_images: referências das imagens
```

**Acesso**:
- Via BigQuery Console (sem login com credenciais de serviço)
- Via `bq` CLI: `bq query --use_legacy_sql=false "SELECT ..."`
- Via BigQuery API REST (público, sem autenticação)
- Via biblioteca Node.js `@google-cloud/bigquery` (sem credenciais = público)

### 2. Cloud Storage Público

**Bucket**:
```
gs://gcs-public-data–healthcare-nih-chest-xray/
```

**Acesso**:
- URL pública direto: https://storage.googleapis.com/gcs-public-data–healthcare-nih-chest-xray/{path}
- Sem API key necessária
- Sem credenciais necessárias

### 3. Fluxo Completo

```
Caso Clínico (Pneumonia)
  ↓
  normalizarPatologia("pneumonia")
  → labels NIH: ["Pneumonia", "Infiltrate"]
  ↓
  BigQuery PUBLIC query:
  SELECT * FROM cxr_metadata
  WHERE labels LIKE '%Pneumonia%'
  ↓
  Resultado: { imageId, path, labels, ... }
  ↓
  Construir URL:
  https://storage.googleapis.com/gcs-public-data–healthcare-nih-chest-xray/{path}
  ↓
  RadiologyImageViewer exibe imagem
```

## Implementação

### Módulo Criado

**Arquivo**: `lib/radiology/providers/nihPublicDataset.ts`

**Funções**:

1. `normalizarPatologia(patologia)`:
   - Entrada: "Pneumonia", "pneumonia", "Pneumonia bacteriana"
   - Saída: `["Pneumonia", "Infiltrate"]` (labels NIH)

2. `buscarImagemNIHPublico(parametros)`:
   - Consulta BigQuery público
   - Constrói URL pública
   - Retorna metadados + URL

3. `construirUrlImagemNIH(imageId, path)`:
   - Padrão: `https://storage.googleapis.com/.../images/{imageId}/{imageId}.png`

### Mapeamento de Patologias

```typescript
pneumonia           → ["Pneumonia", "Infiltrate"]
pneumotórax         → ["Pneumothorax"]
derrame pleural     → ["Effusion", "Pleural Effusion"]
cardiomegalia       → ["Cardiomegaly"]
atelectasia         → ["Atelectasis"]
edema pulmonar      → ["Edema", "Pulmonary Edema"]
enfisema            → ["Emphysema"]
fibrose             → ["Fibrosis"]
nódulo pulmonar     → ["Nodule", "Pulmonary Nodule"]
massa pulmonar      → ["Mass"]
consolidação        → ["Consolidation"]
tuberculose         → ["Tuberculosis"]
hipertensão pulm.   → ["Pulmonary Hypertension"]
normal              → ["No Finding"]
```

## Vantagens do Caminho B

✅ **Sem Credenciais**
   - Funciona imediatamente, em qualquer ambiente
   - Nenhuma configuração `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Funciona em desenvolvimento, staging, produção

✅ **Sem Download de Arquivos**
   - Imagens nunca baixadas para disco
   - URLs públicas servidas direto do GCS
   - Economia de espaço e banda

✅ **Sem Cache Local**
   - Apenas cache de metadados (pequeno)
   - Imagens sempre do servidor público
   - Sempre a versão mais recente do dataset

✅ **Segurança**
   - Sem credenciais expostas
   - Sem API keys no frontend
   - URLs públicas = acessíveis legalmente

✅ **Escalabilidade**
   - Acesso público sem limite de quota
   - CDN do Google serve imagens
   - Sem carga no projeto GCP privado

## Próximos Passos

### Fase 1: Validar Acesso (Hoje)
- [ ] Confirmar estrutura exata do dataset no BigQuery
- [ ] Testar query de busca
- [ ] Validar URLs públicas de imagem
- [ ] Confirmar padrão de path no GCS

### Fase 2: Implementar Backend
- [ ] Usar `@google-cloud/bigquery` sem credenciais
- [ ] Ou usar `bq` CLI
- [ ] Integrar ao endpoint `/api/radiology/buscar-imagem`
- [ ] Testar com 3+ patologias

### Fase 3: Integrar Frontend
- [ ] PainelAnaliseImagem busca via endpoint
- [ ] RadiologyImageViewer exibe imagem pública
- [ ] Teste E2E com caso real

## Estrutura Esperada da Query

```sql
SELECT
  image_id,
  study_id,
  path,
  labels,
  patient_age,
  patient_sex
FROM `bigquery-public-data.nlm_nih_chest_xray_dataset.cxr_metadata`
WHERE LOWER(ARRAY_TO_STRING(labels, ',')) LIKE LOWER('%Pneumonia%')
ORDER BY RAND()
LIMIT 1
```

## Estrutura Esperada da URL

```
https://storage.googleapis.com/gcs-public-data–healthcare-nih-chest-xray/images/{study_id}/{image_id}.png
```

## Fallback (Se Dataset Não Acessível)

Se por algum motivo o dataset público não estiver acessível:

```json
{
  "sucesso": false,
  "motivo": "Imagem radiológica indisponível para este caso.",
  "requerConfiguracao": false
}
```

Mensagem clara, sem quebra de UI.

## Testes de Acesso Recomendados

### 1. Testar Query BigQuery

```bash
bq query --use_legacy_sql=false \
  'SELECT image_id, labels FROM `bigquery-public-data.nlm_nih_chest_xray_dataset.cxr_metadata` 
   WHERE ARRAY_CONTAINS(labels, "Pneumonia") LIMIT 1'
```

### 2. Testar URL Pública

```bash
curl -I https://storage.googleapis.com/gcs-public-data–healthcare-nih-chest-xray/images/{image_id}/{image_id}.png
# Esperado: 200 OK ou 302 Redirect
```

### 3. Testar Acesso Sem Credenciais

```bash
# Sem ~/.config/gcloud/application_default_credentials.json
# Deve ainda retornar metadados do dataset público
```

## Referências

- [NIH Chest X-ray Dataset](https://www.nih.gov/news-events/news-releases/nih-clinical-center-provides-one-largest-publicly-available-chest-x-ray-datasets-scientific-community)
- [BigQuery Public Datasets](https://cloud.google.com/bigquery/public-data)
- [Cloud Storage Public Data](https://cloud.google.com/storage/docs/public-datasets)

---

**Status**: ⏳ Implementação pendente de validação de acesso público

**Próximo**: Confirmar estrutura exata do dataset → Implementar query → Testar URLs
