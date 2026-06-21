# 🔍 Descoberta: Estrutura Real do NIH Chest X-ray no Google Cloud

## Objetivo

Mapear a estrutura exata do NIH Chest X-ray no projeto Google Cloud `chc-nih-chest-xray`:

- ✅ Datasets disponíveis
- ✅ Tabelas dentro de cada dataset
- ✅ Schema/campos de cada tabela
- ✅ Nomes reais de campos (ID, path, labels, view)
- ✅ Validar acesso ao bucket público
- ✅ Gerar valores reais para variáveis de ambiente

## Pré-Requisitos

1. **Google Cloud Project com acesso ao NIH Chest X-ray**
   - Projeto: `chc-nih-chest-xray` (ou equivalente)
   - Acesso a BigQuery (leitura)
   - Acesso a Cloud Storage (leitura)

2. **Credenciais configuradas**
   ```bash
   # Em .env.local
   GOOGLE_CLOUD_PROJECT_ID=chc-nih-chest-xray
   GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
   ```

3. **Dependências instaladas**
   ```bash
   npm install
   # ou npm install @google-cloud/bigquery (já feito)
   ```

## Como Executar

```bash
node scripts/descobrir-nih-estrutura.js
```

### Saída Esperada

```
╔════════════════════════════════════════════════════════════════╗
║   DESCOBERTA: Estrutura Real do NIH Chest X-ray               ║
║   Projeto: chc-nih-chest-xray                                 ║
╚════════════════════════════════════════════════════════════════╝

✅ Credenciais parseadas com sucesso

🔍 Conectando ao BigQuery...

📊 Listando datasets...
✅ Encontrados 1 dataset(s):

   📁 mimic_cxr
      └─ 2 tabela(s):
         ├─ cxr_studies
         │  └─ Campos (25):
         │     ├─ study_id (STRING)
         │     ├─ image_id (STRING)
         │     ├─ path (STRING)
         │     ├─ labels (ARRAY)
         │     └─ ...

🌐 Testando acesso URL pública:
   https://storage.googleapis.com/gcs-public-data–healthcare-nih-chest-xray/README.txt
   ✅ URL acessível (status: 200)

════════════════════════════════════════════════════════════════

📋 RELATÓRIO FINAL

✅ Encontrados 1 dataset(s) com tabela(s)

📊 Estrutura descoberta:
   1. Dataset: mimic_cxr
      Tabela: cxr_studies
      Campos: 25

🔧 Variáveis sugeridas para .env.local:

```env
NIH_BIGQUERY_DATASET=mimic_cxr
NIH_BIGQUERY_TABLE=cxr_studies
NIH_IMAGE_ID_FIELD=image_id
NIH_IMAGE_PATH_FIELD=path
NIH_LABELS_FIELD=labels
NIH_CLOUD_STORAGE_BUCKET=gcs-public-data–healthcare-nih-chest-xray
```

🌐 Teste de Bucket Público:
   Oficial (com hífen Unicode): ✅ 200
   Alternativo (hífen normal): ❌ 403

📄 JSON para integração:
{
  "projeto": "chc-nih-chest-xray",
  ...
}
```

## O Que o Script Faz

1. **Validação de Credenciais**
   - Verifica se `GOOGLE_APPLICATION_CREDENTIALS_JSON` está definido
   - Parse de JSON
   - Nunca loga a credencial

2. **Descoberta BigQuery**
   - Lista todos os datasets no projeto
   - Para cada dataset: lista tabelas
   - Para cada tabela: inspeciona schema
   - Filtra campos relevantes (id, image, path, file, label, finding, view)

3. **Teste de Bucket Público**
   - Testa acesso HTTPS aos buckets oficiais
   - Tenta variações (hífen Unicode vs normal)
   - Retorna status HTTP

4. **Geração de Sugestões**
   - Mapeia campos descobertos para variáveis
   - Heurística: procura por padrões de nome
   - Sugere valores para `NIH_*` variáveis

5. **Relatório JSON**
   - Estrutura completa descoberta
   - Sugestões de variáveis
   - Resultados de teste de acesso
   - Pode ser salvo para referência

## Possíveis Erros e Soluções

### ❌ "GOOGLE_APPLICATION_CREDENTIALS_JSON não configurada"
**Solução**: Defina em `.env.local` com JSON válido da service account

### ❌ "GOOGLE_APPLICATION_CREDENTIALS_JSON não é JSON válido"
**Solução**: Verifique se o JSON está escapado corretamente (use `JSON.stringify()`)

### ❌ "Nenhum dataset encontrado no projeto"
**Solução**: Credenciais podem não ter permissão de leitura, ou projeto está vazio

### ❌ "Erro ao inspecionar tabela"
**Solução**: Credenciais podem não ter permissão específica. Verifique `roles/bigquery.dataViewer`

### ❌ "URL não acessível"
**Solução**: Bucket pode estar privado ou hífen pode estar em encoding diferente

## Próximos Passos Após Descoberta

1. **Copiar valores sugeridos** para `.env.local`
2. **Validar campos** manualmente no BigQuery Console
3. **Atualizar `lib/radiology/README.md`** com valores reais
4. **Atualizar `lib/radiology/providers/nihProvider.ts`** se necessário
5. **Testar integração** com endpoint `/api/radiology/buscar-imagem`

## Segurança

⚠️ **O script NUNCA**:
- Loga credenciais
- Expõe `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- Faz operações destrutivas
- Altera dados do NIH

✅ **O script**:
- Apenas lê metadados
- Testa acesso público (HTTPS)
- Gera relatório de descoberta
- Valida estrutura

## Referência

- [BigQuery Node.js Client](https://googleapis.dev/nodejs/bigquery/latest/)
- [NIH Chest X-ray Dataset](https://www.nih.gov/news-events/news-releases/nih-clinical-center-provides-one-largest-publicly-available-chest-x-ray-datasets-scientific-community)
- [Cloud Storage Public Data](https://cloud.google.com/storage/docs/public-datasets)

---

**Última atualização**: 2026-06-20 (FASE DE DESCOBERTA)

