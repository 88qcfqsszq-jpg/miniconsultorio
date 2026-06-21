# Validação: NIH Chest X-ray Dataset no Google Cloud

## Status Atual

⏳ **PENDENTE**: Validação com credenciais real do usuário

## Como Validar (Passo a Passo)

### Pré-requisitos

1. **Google Cloud SDK instalado**
   ```bash
   brew install google-cloud-sdk
   ```

2. **Autenticado com conta Google Cloud**
   ```bash
   export PATH=/opt/homebrew/share/google-cloud-sdk/bin:$PATH
   gcloud auth login
   ```

3. **Acesso a um projeto Google Cloud** com bigquery-public-data disponível

### Executar Script de Validação

```bash
bash scripts/validar-nih-dataset.sh
```

O script irá:
1. ✅ Verificar autenticação
2. ✅ Procurar dataset NIH em projetos públicos
3. ✅ Listar tabelas disponíveis
4. ✅ Inspecionar schema
5. ✅ Executar queries de teste (Pneumonia, Pneumothorax)
6. ✅ Retornar estrutura exata

## O Que Será Descoberto

### 1. Projeto Público Correto

Esperado: `bigquery-public-data`

Comando para listar:
```bash
bq ls --project_id=bigquery-public-data | grep -i nih
```

### 2. Dataset

Candidatos:
- `nlm_nih_chest_xray_dataset`
- `nlm_nih_chest_xray`
- `nih_chest_xray`
- Outro (será listado)

Comando para listar tabelas:
```bash
bq ls --project_id=bigquery-public-data DATASET_NAME
```

### 3. Tabela de Metadados

Candidatos:
- `metadata`
- `cxr_metadata`
- `images`
- `cxr_studies`
- Outro

Comando para inspecionar schema:
```bash
bq show --schema --format=json \
  bigquery-public-data:DATASET.TABLE | python3 -m json.tool
```

### 4. Campos Esperados

Campo NIH | Nome Esperado | Tipo
---|---|---
ID da Imagem | `image_id`, `dicom_id`, `SOPInstanceUID` | STRING
ID do Estudo | `study_id`, `StudyInstanceUID` | STRING
ID do Paciente | `patient_id` | STRING
Idade | `age`, `patient_age` | INT64
Sexo | `sex`, `patient_sex` | STRING
Rótulos/Patologias | `labels`, `findings`, `diagnosis` | ARRAY<STRING> ou STRING
Caminho GCS | `path`, `file_path`, `gcs_path` | STRING
Nome do Arquivo | `filename`, `file_name`, `fname` | STRING

### 5. Cloud Storage Público

Bucket Esperado:
```
gs://gcs-public-data-healthcare-nih-chest-xray/
```

Padrão de URL:
```
https://storage.googleapis.com/gcs-public-data-healthcare-nih-chest-xray/{path}
```

## Queries de Teste

### Query 1: Buscar Pneumonia

```sql
SELECT
  image_id,
  study_id,
  patient_id,
  age,
  sex,
  labels,
  path
FROM `bigquery-public-data.nlm_nih_chest_xray_dataset.metadata`
WHERE LOWER(ARRAY_TO_STRING(labels, ',')) LIKE '%pneumonia%'
LIMIT 3
```

### Query 2: Buscar Pneumothorax

```sql
SELECT
  image_id,
  study_id,
  patient_id,
  age,
  sex,
  labels,
  path
FROM `bigquery-public-data.nlm_nih_chest_xray_dataset.metadata`
WHERE LOWER(ARRAY_TO_STRING(labels, ',')) LIKE '%pneumothorax%'
LIMIT 3
```

## URLs Públicas Esperadas

### Formato 1: Direto da documentação NIH
```
https://storage.googleapis.com/gcs-public-data-healthcare-nih-chest-xray/images/{STUDY_ID}/{IMAGE_ID}.png
```

### Formato 2: Com path completo do campo
```
https://storage.googleapis.com/gcs-public-data-healthcare-nih-chest-xray/{PATH_DO_CAMPO}
```

### Teste de URL

Para cada imagem encontrada:

```bash
# Testar se URL é acessível
curl -I "https://storage.googleapis.com/gcs-public-data-healthcare-nih-chest-xray/images/{image_id}/{image_id}.png"

# Esperado: 200 OK ou 302 Found
```

## Resultados Esperados Após Validação

### Estrutura Real (Exemplo)

```
✅ Projeto:    bigquery-public-data
✅ Dataset:    nlm_nih_chest_xray_dataset
✅ Tabela:     metadata
✅ Campos:
   - image_id (STRING)
   - study_id (STRING)
   - patient_id (STRING)
   - age (INT64)
   - sex (STRING)
   - labels (ARRAY<STRING>)
   - path (STRING)
✅ Bucket:     gs://gcs-public-data-healthcare-nih-chest-xray/
✅ URL Exemplo: https://storage.googleapis.com/gcs-public-data-healthcare-nih-chest-xray/images/p00/p000001/p000001_s00001/p000001_s00001_i00001.png
```

## Ajustes Necessários no Código

Após validação, atualizar `lib/radiology/providers/nihPublicDataset.ts`:

```typescript
const CONFIG_BIGQUERY_PUBLICO = {
  projeto: 'bigquery-public-data',      // ← VALIDADO
  dataset: 'nlm_nih_chest_xray_dataset', // ← VALIDADO
  tabela: 'metadata',                   // ← VALIDADO
  campos: {
    id: 'image_id',                     // ← VALIDADO
    estudoId: 'study_id',               // ← VALIDADO
    pacienteId: 'patient_id',           // ← VALIDADO
    idade: 'age',                       // ← VALIDADO
    sexo: 'sex',                        // ← VALIDADO
    rotulos: 'labels',                  // ← VALIDADO
    caminho: 'path',                    // ← VALIDADO
  },
  bucket: 'gcs-public-data-healthcare-nih-chest-xray', // ← VALIDADO
  urlTemplate: 'https://storage.googleapis.com/{bucket}/images/{study_id}/{image_id}.png',
};
```

## Checklist de Validação

- [ ] Script de validação executado com sucesso
- [ ] Projeto público identificado
- [ ] Dataset encontrado
- [ ] Tabela de metadados confirmada
- [ ] Schema inspecionado
- [ ] Query Pneumonia retornou resultados
- [ ] Query Pneumothorax retornou resultados
- [ ] URLs públicas montadas e testadas
- [ ] URLs acessíveis via curl/navegador
- [ ] `lib/radiology/providers/nihPublicDataset.ts` atualizado
- [ ] Build passa sem erros

## Possíveis Variações Encontradas

### Se estrutura for diferente:

1. **Nomes de campos diferentes**
   - Solução: Mapear encontrados para variáveis de ambiente
   - Arquivo: `.env.local`

2. **Labels em STRING em vez de ARRAY**
   - Solução: Ajustar query com `LIKE` em vez de `ARRAY_CONTAINS`

3. **Path diferente do bucket**
   - Solução: Usar template configurável

4. **Bucket privado (não público)**
   - Problema: Requer autenticação
   - Solução: Reverter para provider NIH privado

## Próximas Etapas Após Validação

1. **Completar implementação** de `buscarEmBigQueryPublico()`
2. **Integrar ao endpoint** `/api/radiology/buscar-imagem`
3. **Testar com casos reais** de Pneumonia, Pneumotórax, Efusão
4. **Validar URLs** no frontend (RadiologyImageViewer)
5. **Teste E2E** completo

## Contato / Dúvidas

Se durante validação encontrar:
- Dataset não encontrado
- Estrutura muito diferente
- URLs não funcionam
- Problema de acesso

Ajustes no código serão feitos para:
- Tratar múltiplas variações de nomes
- Implementar fallback seguro
- Documentar a estrutura real encontrada

---

**Status**: Aguardando validação com credenciais reais do usuário

**Próximo**: Executar `bash scripts/validar-nih-dataset.sh` com suas credenciais Google Cloud
