#!/bin/bash

###############################################################################
#
# Script: Validação da Estrutura Real do NIH Chest X-ray Dataset
#
# Objetivo: Descobrir estrutura exata (projeto, dataset, tabela, campos)
#
# Uso: bash scripts/validar-nih-dataset.sh
#
# Requer: gcloud + bq CLI configurado com autenticação
#
###############################################################################

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔍 VALIDAÇÃO: NIH Chest X-ray Dataset no Google Cloud        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}\n"

# Verificar se bq está instalado
if ! command -v bq &> /dev/null; then
    echo -e "${RED}❌ Erro: bq CLI não encontrado${NC}"
    echo -e "Instale com: brew install google-cloud-sdk"
    exit 1
fi

# Verificar autenticação
echo -e "${YELLOW}1️⃣  Verificando autenticação...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${RED}❌ Erro: Nenhuma conta ativa${NC}"
    echo -e "Execute: gcloud auth login"
    exit 1
fi
ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
echo -e "${GREEN}✅ Autenticado como: $ACCOUNT${NC}\n"

# Candidatos para projeto/dataset
declare -a PROJECTS=("bigquery-public-data" "google.com:bigquery-public-data")
declare -a DATASETS=("nlm_nih_chest_xray_dataset" "nlm_nih_chest_xray" "nih_chest_xray")

# Tentar encontrar dataset
echo -e "${YELLOW}2️⃣  Procurando dataset NIH...${NC}"
FOUND=false

for PROJECT in "${PROJECTS[@]}"; do
    echo "   Verificando projeto: $PROJECT"

    for DATASET in "${DATASETS[@]}"; do
        if bq ls --project_id="$PROJECT" --format=json 2>/dev/null | grep -q "\"dataset_id\": \"$DATASET\""; then
            echo -e "${GREEN}✅ Dataset encontrado: $DATASET${NC}"
            FOUND_PROJECT="$PROJECT"
            FOUND_DATASET="$DATASET"
            FOUND=true
            break
        fi
    done

    if [ "$FOUND" = true ]; then
        break
    fi
done

if [ "$FOUND" = false ]; then
    echo -e "${RED}❌ Dataset NIH não encontrado nos projetos padrão${NC}"
    echo -e "${YELLOW}Listando todos os datasets do bigquery-public-data:${NC}"
    bq ls --project_id=bigquery-public-data --max_results=50 2>/dev/null || echo "Erro ao listar datasets"
    exit 1
fi

echo -e "\n${YELLOW}3️⃣  Listando tabelas do dataset: $FOUND_DATASET${NC}"
bq ls --project_id="$FOUND_PROJECT" "$FOUND_DATASET" --format=json 2>/dev/null | python3 -m json.tool | head -50

echo -e "\n${YELLOW}4️⃣  Inspecionando schema da tabela principal...${NC}"
# Tentar encontrar tabela de metadados
for TABLE in metadata cxr_metadata images cxr_studies nih_chest_xray; do
    if bq ls --project_id="$FOUND_PROJECT" "$FOUND_DATASET" --format=json 2>/dev/null | grep -q "\"table_id\": \"$TABLE\""; then
        echo -e "${GREEN}✅ Tabela encontrada: $TABLE${NC}"
        FOUND_TABLE="$TABLE"
        break
    fi
done

if [ -z "$FOUND_TABLE" ]; then
    echo -e "${YELLOW}Tabelas encontradas:${NC}"
    bq ls --project_id="$FOUND_PROJECT" "$FOUND_DATASET" --format=json 2>/dev/null | python3 -c "
import json, sys
data = json.load(sys.stdin)
if 'tables' in data:
    for table in data['tables']:
        print(f\"  - {table['tableReference']['tableId']}\")
" | head -10
    echo -e "${YELLOW}Qual é a tabela de metadados? Digite o nome:${NC}"
    read FOUND_TABLE
fi

echo -e "\n${YELLOW}Schema da tabela: $FOUND_TABLE${NC}"
bq show --schema --format=json "$FOUND_PROJECT:$FOUND_DATASET.$FOUND_TABLE" 2>/dev/null | python3 -m json.tool

echo -e "\n${YELLOW}5️⃣  Executando query teste para Pneumonia...${NC}"
QUERY="SELECT * FROM \`$FOUND_PROJECT.$FOUND_DATASET.$FOUND_TABLE\` WHERE LOWER(CAST(labels AS STRING)) LIKE '%pneumonia%' LIMIT 3"
echo -e "${BLUE}Query: $QUERY${NC}\n"
bq query --use_legacy_sql=false --format=pretty --nouse_cache "$QUERY" 2>/dev/null || echo "Erro ao executar query"

echo -e "\n${YELLOW}6️⃣  Executando query teste para Pneumothorax...${NC}"
QUERY="SELECT * FROM \`$FOUND_PROJECT.$FOUND_DATASET.$FOUND_TABLE\` WHERE LOWER(CAST(labels AS STRING)) LIKE '%pneumothorax%' LIMIT 3"
echo -e "${BLUE}Query: $QUERY${NC}\n"
bq query --use_legacy_sql=false --format=pretty --nouse_cache "$QUERY" 2>/dev/null || echo "Erro ao executar query"

echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Informações encontradas:${NC}"
echo -e "  Projeto: ${BLUE}$FOUND_PROJECT${NC}"
echo -e "  Dataset: ${BLUE}$FOUND_DATASET${NC}"
echo -e "  Tabela:  ${BLUE}$FOUND_TABLE${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"

echo -e "\n✅ Validação concluída! Atualize lib/radiology/providers/nihPublicDataset.ts com os dados encontrados."
