/**
 * Acesso Público ao NIH Chest X-ray Dataset via Google Cloud BigQuery
 *
 * Este módulo acessa o NIH Chest X-ray como um Google Cloud Public Dataset
 * - Sem credenciais específicas requeridas
 * - Sem download de arquivos
 * - Sem cache local de imagens
 * - URLs públicas diretas
 *
 * Dataset Público:
 * - Projeto: bigquery-public-data (ou google.com/bigquery-public-data)
 * - Dataset: nlm_nih_chest_xray_dataset (ou similar)
 * - Bucket Público: gs://gcs-public-data–healthcare-nih-chest-xray/
 */

import type { ImagemRadiologica, ParametrosBuscaImagem } from "../types";

// ============================================================================
// TIPOS
// ============================================================================

interface ResultadoBuscaNIH {
  sucesso: boolean;
  imagem?: ImagemRadiologica;
  motivo?: string;
}

interface MetadadosImagemNIH {
  imageId: string;
  studyId: string;
  path: string;
  labels: string[];
  patientAge?: number;
  patientSex?: string;
}

// ============================================================================
// MAPEAMENTO PATOLOGIAS → LABELS NIH
// ============================================================================

const MAPEAMENTO_PATOLOGIAS: Record<string, string[]> = {
  pneumonia: ["Pneumonia", "Infiltrate"],
  "pneumonia bacteriana": ["Pneumonia"],
  "pneumonia viral": ["Pneumonia"],
  pneumotórax: ["Pneumothorax"],
  "pneumotórax espontâneo": ["Pneumothorax"],
  "derrame pleural": ["Effusion", "Pleural Effusion"],
  "derrame pericárdico": ["Pericardial Effusion"],
  cardiomegalia: ["Cardiomegaly"],
  atelectasia: ["Atelectasis"],
  "edema pulmonar": ["Edema", "Pulmonary Edema"],
  enfisema: ["Emphysema"],
  fibrose: ["Fibrosis"],
  "nódulo pulmonar": ["Nodule", "Pulmonary Nodule"],
  "massa pulmonar": ["Mass"],
  consolidação: ["Consolidation"],
  tuberculose: ["Tuberculosis"],
  "hipertensão pulmonar": ["Pulmonary Hypertension"],
  "normal": ["No Finding"],
  "sem achado": ["No Finding"],
  "rx normal": ["No Finding"],
};

// ============================================================================
// FUNÇÃO PRIVADA: NORMALIZAR PATOLOGIA
// ============================================================================

function normalizarPatologia(patologia: string): string[] {
  if (!patologia) return [];

  // Normalizar entrada
  const entrada = patologia
    .toLowerCase()
    .trim()
    .normalize("NFD") // Remove acentos
    .replace(/[̀-ͯ]/g, "");

  // Procurar mapeamento direto
  if (MAPEAMENTO_PATOLOGIAS[entrada]) {
    return MAPEAMENTO_PATOLOGIAS[entrada];
  }

  // Procurar substring (ex: "Pneumonia" dentro de "Pneumonia bacteriana comunitária")
  for (const [key, labels] of Object.entries(MAPEAMENTO_PATOLOGIAS)) {
    if (entrada.includes(key) || key.includes(entrada)) {
      return labels;
    }
  }

  // Fallback: retornar entrada como está
  return [entrada];
}

// ============================================================================
// FUNÇÃO PRIVADA: CONSTRUIR URL PÚBLICA
// ============================================================================

function construirUrlImagemNIH(imageId: string, path?: string): string {
  // Padrão esperado do NIH Dataset no Cloud Storage
  const bucket = "gcs-public-data-healthcare-nih-chest-xray";

  // Se temos path completo, usar
  if (path && path.trim()) {
    const caminhoLimpo = path.startsWith("/") ? path.slice(1) : path;
    return `https://storage.googleapis.com/${bucket}/${caminhoLimpo}`;
  }

  // Fallback: tentar construir com imageId
  // Padrão comum: png/{image_id}.png ou images/{image_id}/{image_id}.png
  return `https://storage.googleapis.com/${bucket}/images/${imageId}/${imageId}.png`;
}

// ============================================================================
// FUNÇÃO PRIVADA: BUSCAR EM BIGQUERY PÚBLICO
// ============================================================================

async function buscarEmBigQueryPublico(
  labelNIH: string
): Promise<MetadadosImagemNIH | null> {
  try {
    // Usar BigQuery public dataset via REST API
    // Não requer autenticação para datasets públicos

    const query = `
      SELECT
        image_id,
        study_id,
        path,
        labels,
        patient_age,
        patient_sex
      FROM \`bigquery-public-data.nlm_nih_chest_xray_dataset.cxr_metadata\`
      WHERE LOWER(ARRAY_TO_STRING(labels, ','))
            LIKE LOWER('%${labelNIH.replace(/'/g, "''")}%')
      ORDER BY RAND()
      LIMIT 1
    `;

    // Usar bq CLI (já está instalado via gcloud)
    const cmd = `bq query --format=json --use_legacy_sql=false "${query}" 2>/dev/null`;

    // Na produção, preferir biblioteca @google-cloud/bigquery sem credenciais
    // Por enquanto, retornar null para indicar que precisa de implementação
    console.log(
      "[NIH Public] Query construída. Execução pendente de BigQuery público."
    );
    return null;
  } catch (erro) {
    console.error(
      "[NIH Public] Erro ao buscar:",
      erro instanceof Error ? erro.message : "Desconhecido"
    );
    return null;
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL: BUSCAR IMAGEM NIH
// ============================================================================

/**
 * Busca imagem pública do NIH Chest X-ray por patologia
 *
 * Fluxo:
 * 1. Normalizar patologia → labels NIH
 * 2. Buscar em BigQuery público
 * 3. Construir URL pública da imagem
 * 4. Retornar metadados + URL
 */
export async function buscarImagemNIHPublico(
  parametros: ParametrosBuscaImagem
): Promise<ResultadoBuscaNIH> {
  try {
    console.log("[NIH Public] Buscando imagem para:", parametros.labelNIH);

    // 1. Normalizar patologia
    const labelsNIH = normalizarPatologia(parametros.labelNIH || "");

    if (!labelsNIH || labelsNIH.length === 0) {
      return {
        sucesso: false,
        motivo: "Patologia não mapeada para NIH",
      };
    }

    console.log("[NIH Public] Labels NIH mapeados:", labelsNIH);

    // 2. Tentar primeiro label
    const primeiroLabel = labelsNIH[0];
    const resultado = await buscarEmBigQueryPublico(primeiroLabel);

    if (!resultado) {
      return {
        sucesso: false,
        motivo: `Nenhuma imagem pública encontrada para: ${primeiroLabel}`,
      };
    }

    // 3. Construir URL
    const imageUrl = construirUrlImagemNIH(resultado.imageId, resultado.path);

    // 4. Normalizar e retornar
    const imagem: ImagemRadiologica = {
      disponivel: true,
      modalidade: "RX",
      regiao: "torax",

      // Identificação
      imageId: resultado.imageId,
      imageUrl: imageUrl,
      labels: resultado.labels || [primeiroLabel],
      diagnosticoRadiologico: primeiroLabel,
      achadoPrincipal: primeiroLabel,

      // Fonte: NIH PÚBLICO
      fonte: "NIH Chest X-ray Dataset (Google Cloud Public Data)",
      atribuicao: "NIH Clinical Center | Domínio Público | Sem restrições de uso",

      // Integração PÚBLICA (não requer credenciais)
      integracaoReal: true,
      validadoPorIA: false,
      podeExibirAoAluno: true, // Público = pode exibir diretamente

      // Metadados
      metadadosOriginais: resultado,
      dataAssociacao: new Date().toISOString(),
    };

    console.log("[NIH Public] ✅ Imagem encontrada:", imagem.imageId);

    return {
      sucesso: true,
      imagem,
    };
  } catch (erro) {
    console.error(
      "[NIH Public] Erro ao buscar imagem:",
      erro instanceof Error ? erro.message : "Desconhecido"
    );

    return {
      sucesso: false,
      motivo: "Imagem radiológica indisponível para este caso.",
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const nihPublicDataset = {
  buscarImagemNIHPublico,
  normalizarPatologia,
};

export type NihPublicDataset = typeof nihPublicDataset;
