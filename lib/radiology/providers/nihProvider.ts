/**
 * Provider NIH Chest X-ray
 *
 * Integração REAL com Google Cloud BigQuery (chc-nih-chest-xray).
 *
 * Autenticação Flexível:
 * 1. GOOGLE_APPLICATION_CREDENTIALS_JSON (se fornecido) → JSON service account
 * 2. Application Default Credentials (ADC) → `gcloud auth application-default login`
 * 3. Nenhuma credencial → erro controlado
 *
 * Dados Reais NIH:
 * - Projeto: chc-nih-chest-xray
 * - Dataset: nih_chest_xray
 * - Tabela: nih_chest_xray
 * - Total: 112.120 registros
 *
 * NUNCA retorna dados falsos como se fossem NIH reais.
 */

import type {
  ParametrosBuscaImagem,
  ResultadoBuscaImagem,
  ImagemRadiologica,
  ErroProviderNIH,
} from "../types";

import { BigQuery } from "@google-cloud/bigquery";

// ============================================================================
// CONFIGURAÇÃO NIH REAL
// ============================================================================

const CONFIG_NIH_REAL = {
  nihGcpProject: process.env.NIH_GCP_PROJECT_ID || "chc-nih-chest-xray",
  dataset: process.env.NIH_BIGQUERY_DATASET || "nih_chest_xray",
  tabela: process.env.NIH_BIGQUERY_TABLE || "nih_chest_xray",
  campos: {
    id: process.env.NIH_IMAGE_ID_FIELD || "SOPInstanceUID",
    estudo: process.env.NIH_STUDY_INSTANCE_FIELD || "StudyInstanceUID",
    serie: process.env.NIH_SERIES_INSTANCE_FIELD || "SeriesInstanceUID",
    sop: process.env.NIH_SOP_INSTANCE_FIELD || "SOPInstanceUID",
    descricao: process.env.NIH_LABELS_FIELD || "StudyDescription",
  },
};

// ============================================================================
// AUTENTICAÇÃO FLEXÍVEL
// ============================================================================

/**
 * Cria cliente BigQuery com autenticação flexível:
 * 1. Se GOOGLE_APPLICATION_CREDENTIALS_JSON → usar JSON
 * 2. Se não → tentar Application Default Credentials
 * 3. Se falhar → retorna null
 */
function criarClienteBigQuery(): BigQuery | null {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (!projectId) {
      console.error("[NIH Provider] GOOGLE_CLOUD_PROJECT_ID não configurado");
      return null;
    }

    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (credentialsJson) {
      // Modo 1: JSON service account (produção futura)
      try {
        const credentials = JSON.parse(credentialsJson);
        const client = new BigQuery({
          projectId,
          credentials,
        });
        console.log("[NIH Provider] BigQuery: usando JSON service account");
        return client;
      } catch (parseErr) {
        console.error("[NIH Provider] JSON credenciais inválido");
        return null;
      }
    } else {
      // Modo 2: Application Default Credentials (desenvolvimento local)
      const client = new BigQuery({
        projectId,
      });
      console.log("[NIH Provider] BigQuery: usando Application Default Credentials");
      return client;
    }
  } catch (erro) {
    console.error(
      "[NIH Provider] Erro ao criar BigQuery:",
      erro instanceof Error ? erro.message : "Desconhecido"
    );
    return null;
  }
}

// ============================================================================
// VERIFICAÇÃO DE CONFIGURAÇÃO
// ============================================================================

/**
 * Verifica se configuração NIH está completa
 */
function verificarConfiguracaoNIH(): {
  valido: boolean;
  motivo?: string;
} {
  // Verificar variáveis obrigatórias
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

  if (!projectId) {
    return {
      valido: false,
      motivo: "GOOGLE_CLOUD_PROJECT_ID não configurado",
    };
  }

  // Variáveis NIH têm padrões sensatos
  if (!CONFIG_NIH_REAL.dataset || !CONFIG_NIH_REAL.tabela) {
    return {
      valido: false,
      motivo: "NIH_BIGQUERY_DATASET ou NIH_BIGQUERY_TABLE não configurados",
    };
  }

  return { valido: true };
}

/**
 * Status de configuração para logs
 */
export function obterStatusConfiguracao(): string {
  const config = verificarConfiguracaoNIH();

  if (config.valido) {
    const credSource =
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ?
        "JSON service account"
      : "Application Default Credentials";

    return `✅ NIH Chest X-ray pronto (${credSource})`;
  }

  return `❌ NIH Chest X-ray não configurado: ${config.motivo}`;
}

// ============================================================================
// INTEGRAÇÃO BIGQUERY NIH REAL
// ============================================================================

/**
 * Busca imagem no NIH Chest X-ray via BigQuery real
 *
 * Fluxo:
 * 1. Validar configuração
 * 2. Criar cliente BigQuery
 * 3. Montar query parametrizada
 * 4. Executar query
 * 5. Normalizar resultado
 */
async function buscarEmBigQuery(
  parametros: ParametrosBuscaImagem
): Promise<ImagemRadiologica | null> {
  try {
    // 1. Validar
    const configValida = verificarConfiguracaoNIH();
    if (!configValida.valido) {
      console.error("[NIH Provider]", configValida.motivo);
      return null;
    }

    // 2. Criar cliente
    const client = criarClienteBigQuery();
    if (!client) {
      console.error("[NIH Provider] Não foi possível criar cliente BigQuery");
      return null;
    }

    // 3. Montar query
    // Buscar por descrição do estudo que contenha o label
    const labelSeguro = (parametros.labelNIH || "").replace(/'/g, "''");

    const query = `
      SELECT
        ${CONFIG_NIH_REAL.campos.id} as image_id,
        ${CONFIG_NIH_REAL.campos.estudo} as study_id,
        ${CONFIG_NIH_REAL.campos.serie} as series_id,
        ${CONFIG_NIH_REAL.campos.descricao} as study_description
      FROM \`${CONFIG_NIH_REAL.nihGcpProject}.${CONFIG_NIH_REAL.dataset}.${CONFIG_NIH_REAL.tabela}\`
      WHERE LOWER(${CONFIG_NIH_REAL.campos.descricao}) LIKE LOWER('%${labelSeguro}%')
        OR LOWER(${CONFIG_NIH_REAL.campos.descricao}) LIKE LOWER('%finding%')
      ORDER BY RAND()
      LIMIT 10
    `;

    console.log(
      "[NIH Provider] Buscando imagens para label:",
      parametros.labelNIH
    );

    // 4. Executar query
    const [rows] = await client.query({
      query,
      location: "us",
    });

    if (!rows || rows.length === 0) {
      console.log(
        "[NIH Provider] Nenhuma imagem encontrada para:",
        parametros.labelNIH
      );
      return null;
    }

    // 5. Normalizar primeiro resultado
    const resultado = rows[0] as any;

    const imagem: ImagemRadiologica = {
      disponivel: true,
      modalidade: "RX",
      regiao: "torax",

      // Identificação
      imageId: resultado.image_id || resultado.study_id,
      imageUrl: "", // URL será preenchida por camada superior
      labels: [resultado.study_description || "RX de tórax"],
      diagnosticoRadiologico: resultado.study_description || "Estudo radiológico",
      achadoPrincipal: resultado.study_description || "Achado não especificado",

      // Fonte: NIH REAL
      fonte: "NIH Chest X-ray",
      atribuicao: "NIH Clinical Center | NIH Chest X-ray Dataset | Domínio Público",

      // Integração real confirmada
      integracaoReal: true,
      validadoPorIA: false,
      podeExibirAoAluno: false,

      // Metadados
      metadadosOriginais: resultado,
      dataAssociacao: new Date().toISOString(),
    };

    console.log("[NIH Provider] ✅ Imagem NIH encontrada:", imagem.imageId);

    return imagem;
  } catch (erro) {
    console.error(
      "[NIH Provider] Erro ao buscar em BigQuery:",
      erro instanceof Error ? erro.message : "Desconhecido"
    );
    return null;
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

/**
 * Busca imagem no NIH Chest X-ray com autenticação flexível
 *
 * Autenticação:
 * - JSON service account se GOOGLE_APPLICATION_CREDENTIALS_JSON definido
 * - Application Default Credentials caso contrário
 * - Erro controlado se nenhuma funcionar
 */
export async function buscarImagemNIH(
  parametros: ParametrosBuscaImagem
): Promise<ResultadoBuscaImagem | ErroProviderNIH> {
  // Validar configuração
  const configValida = verificarConfiguracaoNIH();

  if (!configValida.valido) {
    return {
      sucesso: false,
      motivo: `NIH Chest X-ray não configurado: ${configValida.motivo}`,
      requerConfiguracao: true,
      proximosPassos: [
        "1. Configurar GOOGLE_CLOUD_PROJECT_ID em .env.local",
        "2. Usar Application Default Credentials: gcloud auth application-default login",
        "3. Ou fornecer GOOGLE_APPLICATION_CREDENTIALS_JSON com JSON service account",
      ],
    };
  }

  try {
    // Buscar em BigQuery NIH real
    const imagemRadiologica = await buscarEmBigQuery(parametros);

    if (!imagemRadiologica) {
      return {
        sucesso: false,
        motivo: `Nenhuma imagem NIH encontrada para: ${parametros.labelNIH}`,
      };
    }

    return {
      sucesso: true,
      imagem: imagemRadiologica,
    };
  } catch (erro) {
    console.error(
      "[NIH Provider] Erro ao buscar imagem:",
      erro instanceof Error ? erro.message : "Desconhecido"
    );

    return {
      sucesso: false,
      motivo: "Imagem radiológica indisponível para este caso.",
    };
  }
}

// ============================================================================
// INTERFACE PÚBLICA
// ============================================================================

export const nihProvider = {
  buscarImagemNIH,
  estaConfigurado: () => verificarConfiguracaoNIH().valido,
  obterStatusConfiguracao,
};

export type NihProvider = typeof nihProvider;
