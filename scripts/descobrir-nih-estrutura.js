#!/usr/bin/env node

/**
 * Script de Descoberta: Estrutura Real do NIH Chest X-ray no Google Cloud
 *
 * Objetivo: Mapear datasets, tabelas, campos e validar acesso ao bucket público
 *
 * Uso: node scripts/descobrir-nih-estrutura.js
 *
 * Requer:
 * - GOOGLE_CLOUD_PROJECT_ID (chc-nih-chest-xray ou similar)
 * - GOOGLE_APPLICATION_CREDENTIALS_JSON (credenciais service account)
 *
 * Saída: Relatório JSON com descobertas ou erro detalhado
 */

const { BigQuery } = require("@google-cloud/bigquery");
const https = require("https");

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || "chc-nih-chest-xray";
const CREDENTIALS_JSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

const BUCKET_OFICIAL = "gcs-public-data–healthcare-nih-chest-xray"; // com hífen em Unicode
const BUCKET_ALTERNATIVO = "gcs-public-data-healthcare-nih-chest-xray"; // com hífen normal

// ============================================================================
// VALIDAÇÃO INICIAL
// ============================================================================

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║   DESCOBERTA: Estrutura Real do NIH Chest X-ray               ║");
console.log("║   Projeto: " + PROJECT_ID.padEnd(52) + "║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

if (!CREDENTIALS_JSON) {
  console.error("❌ ERRO: Variável GOOGLE_APPLICATION_CREDENTIALS_JSON não configurada");
  console.error("   Configure em .env.local ou variável de ambiente");
  process.exit(1);
}

let credentials;
try {
  credentials = JSON.parse(CREDENTIALS_JSON);
  console.log("✅ Credenciais parseadas com sucesso\n");
} catch (e) {
  console.error("❌ ERRO: GOOGLE_APPLICATION_CREDENTIALS_JSON não é JSON válido");
  console.error("   Erro:", e.message);
  process.exit(1);
}

// ============================================================================
// DESCOBERTA BIGQUERY
// ============================================================================

async function descobrirEstruturaNIH() {
  const descoberta = {
    projeto: PROJECT_ID,
    timestamp: new Date().toISOString(),
    datasets: [],
    erro: null,
    bucketTeste: null,
    sugestoesVariaveis: null,
  };

  try {
    console.log("🔍 Conectando ao BigQuery...");
    const bigquery = new BigQuery({
      projectId: PROJECT_ID,
      credentials,
    });

    // 1. Listar datasets
    console.log("\n📊 Listando datasets...");
    const [datasets] = await bigquery.getDatasets();

    if (!datasets || datasets.length === 0) {
      descoberta.erro = "Nenhum dataset encontrado no projeto";
      console.warn("⚠️  " + descoberta.erro);
      return descoberta;
    }

    console.log(`✅ Encontrados ${datasets.length} dataset(s):\n`);

    for (const dataset of datasets) {
      const datasetId = dataset.id;
      console.log(`   📁 ${datasetId}`);

      try {
        // 2. Listar tabelas
        const [tables] = await dataset.getTables();

        if (tables && tables.length > 0) {
          console.log(`      └─ ${tables.length} tabela(s):`);

          for (const table of tables) {
            const tableId = table.id;
            console.log(`         ├─ ${tableId}`);

            try {
              // 3. Inspecionar schema
              const metadata = await table.getMetadata();
              const schema = metadata[0].schema;

              if (schema && schema.fields) {
                console.log(`         │  └─ Campos (${schema.fields.length}):`);

                // Campos relevantes
                const camposRelevantes = schema.fields
                  .filter(
                    (f) =>
                      f.name.toLowerCase().includes("id") ||
                      f.name.toLowerCase().includes("image") ||
                      f.name.toLowerCase().includes("path") ||
                      f.name.toLowerCase().includes("file") ||
                      f.name.toLowerCase().includes("label") ||
                      f.name.toLowerCase().includes("finding") ||
                      f.name.toLowerCase().includes("view")
                  )
                  .slice(0, 10);

                if (camposRelevantes.length > 0) {
                  camposRelevantes.forEach((field, idx) => {
                    const isLast = idx === camposRelevantes.length - 1;
                    console.log(
                      `         │     ${isLast ? "└─" : "├─"} ${field.name} (${field.type})`
                    );
                  });
                } else {
                  console.log(`         │     └─ (nenhum campo relevante identificado)`);
                }

                // Todos os campos (para referência)
                if (schema.fields.length > 10) {
                  console.log(`         │     [+ ${schema.fields.length - 10} campo(s) adicional(is)]`);
                }

                // Registrar descoberta
                descoberta.datasets.push({
                  dataset: datasetId,
                  tabela: tableId,
                  campos: schema.fields.map((f) => ({
                    nome: f.name,
                    tipo: f.type,
                  })),
                });
              }
            } catch (tableErr) {
              console.log(`         │  ❌ Erro ao inspecionar: ${tableErr.message}`);
            }
          }
        } else {
          console.log(`      └─ (nenhuma tabela)`);
        }
      } catch (datasetErr) {
        console.log(`      ❌ Erro ao listar tabelas: ${datasetErr.message}`);
      }
    }
  } catch (err) {
    descoberta.erro = `Erro BigQuery: ${err.message}`;
    console.error("\n❌ " + descoberta.erro);
  }

  return descoberta;
}

// ============================================================================
// TESTE DE BUCKET PÚBLICO
// ============================================================================

function testarUrlPublica(bucket, arquivo = "README.txt") {
  return new Promise((resolve) => {
    const url = `https://storage.googleapis.com/${bucket}/${arquivo}`;

    console.log(`\n🌐 Testando acesso URL pública:`);
    console.log(`   ${url}`);

    const req = https.head(url, { timeout: 5000 }, (res) => {
      if (res.statusCode === 200) {
        console.log(`   ✅ URL acessível (status: ${res.statusCode})`);
        resolve({ acessivel: true, statusCode: res.statusCode, url });
      } else if (res.statusCode === 404) {
        console.log(
          `   ⚠️  Arquivo não encontrado (status: 404) — bucket pode estar ok`
        );
        resolve({
          acessivel: true,
          statusCode: res.statusCode,
          url,
          nota: "Arquivo não existe, mas bucket é acessível",
        });
      } else {
        console.log(`   ❌ Erro HTTP ${res.statusCode}`);
        resolve({ acessivel: false, statusCode: res.statusCode, url });
      }
    });

    req.on("error", (err) => {
      console.log(`   ❌ Erro de conexão: ${err.message}`);
      resolve({ acessivel: false, erro: err.message, url });
    });

    req.end();
  });
}

// ============================================================================
// SUGESTÕES DE VARIÁVEIS
// ============================================================================

function gerarSugestoesVariaveis(descoberta) {
  if (descoberta.datasets.length === 0) {
    return null;
  }

  const primeiro = descoberta.datasets[0];

  // Heurística: procurar campos por padrão de nome
  const campos = primeiro.campos || [];

  const sugestoes = {
    NIH_BIGQUERY_DATASET: primeiro.dataset,
    NIH_BIGQUERY_TABLE: primeiro.tabela,
    NIH_IMAGE_ID_FIELD: campos.find((c) => c.nome.includes("id"))?.nome || "DESCONHECIDO",
    NIH_IMAGE_PATH_FIELD: campos.find((c) => c.nome.includes("path"))?.nome ||
                          campos.find((c) => c.nome.includes("file"))?.nome || "DESCONHECIDO",
    NIH_LABELS_FIELD: campos.find((c) => c.nome.includes("label"))?.nome ||
                      campos.find((c) => c.nome.includes("finding"))?.nome || "DESCONHECIDO",
    NIH_CLOUD_STORAGE_BUCKET: BUCKET_OFICIAL,
  };

  return sugestoes;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  // 1. Descobrir estrutura BigQuery
  const descoberta = await descobrirEstruturaNIH();

  // 2. Testar buckets públicos
  console.log("\n════════════════════════════════════════════════════════════════\n");
  const testeBucket1 = await testarUrlPublica(BUCKET_OFICIAL);
  const testeBucket2 = await testarUrlPublica(BUCKET_ALTERNATIVO);

  descoberta.bucketTeste = {
    oficial: testeBucket1,
    alternativo: testeBucket2,
  };

  // 3. Gerar sugestões
  descoberta.sugestoesVariaveis = gerarSugestoesVariaveis(descoberta);

  // 4. Relatório final
  console.log("\n════════════════════════════════════════════════════════════════");
  console.log("\n📋 RELATÓRIO FINAL\n");

  if (descoberta.erro) {
    console.log(`❌ Erro: ${descoberta.erro}\n`);
  }

  if (descoberta.datasets.length > 0) {
    console.log(`✅ Encontrados ${descoberta.datasets.length} dataset(s) com tabela(s)\n`);

    console.log("📊 Estrutura descoberta:");
    descoberta.datasets.forEach((ds, idx) => {
      console.log(`   ${idx + 1}. Dataset: ${ds.dataset}`);
      console.log(`      Tabela: ${ds.tabela}`);
      console.log(`      Campos: ${ds.campos.length}`);
    });
  }

  if (descoberta.sugestoesVariaveis) {
    console.log("\n🔧 Variáveis sugeridas para .env.local:\n");
    console.log("```env");
    Object.entries(descoberta.sugestoesVariaveis).forEach(([chave, valor]) => {
      console.log(`${chave}=${valor}`);
    });
    console.log("```");
  }

  console.log("\n🌐 Teste de Bucket Público:");
  console.log(
    `   Oficial (com hífen Unicode): ${testeBucket1.acessivel ? "✅" : "❌"} ${
      testeBucket1.statusCode || testeBucket1.erro
    }`
  );
  console.log(
    `   Alternativo (hífen normal): ${testeBucket2.acessivel ? "✅" : "❌"} ${
      testeBucket2.statusCode || testeBucket2.erro
    }`
  );

  // 5. JSON para integração
  console.log("\n📄 JSON para integração (copiar para README ou referência):");
  console.log(JSON.stringify(descoberta, null, 2));
}

main().catch((err) => {
  console.error("❌ Erro não tratado:", err);
  process.exit(1);
});
