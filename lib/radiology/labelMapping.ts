/**
 * Mapeamento definitivo de diagnósticos clínicos para rótulos NIH
 *
 * Este arquivo centraliza a correspondência entre diagnósticos do caso clínico
 * e rótulos do NIH Chest X-ray, permitindo fácil manutenção e extensão.
 *
 * Regras:
 * - A chave é o diagnóstico clínico normalizado (minúsculas, sem acentos)
 * - O valor é o rótulo NIH exato
 * - Cada diagnóstico tem nível de confiança associado
 */

import type { RadiologyLabelNIH } from "./types";

interface MapeamentoDiagnostico {
  labelNIH: RadiologyLabelNIH;
  confianca: "alta" | "media" | "baixa";
  sinonimos?: string[];
  justificativa?: string;
}

/**
 * Mapeamento completo de diagnósticos clínicos → rótulos NIH
 *
 * Confiança:
 * - alta: mapeamento direto, sem ambiguidade
 * - media: mapeamento válido mas com possíveis variações
 * - baixa: mapeamento genérico ou com múltiplas interpretações
 */
const MAPEAMENTO_DIAGNOSTICOS: Record<string, MapeamentoDiagnostico> = {
  // =========================================================================
  // ACHADOS PNEUMÔNICOS
  // =========================================================================

  pneumonia: {
    labelNIH: "Pneumonia",
    confianca: "alta",
    sinonimos: ["pneumonite", "infecção respiratória", "infiltrado pulmonar"],
    justificativa: "Diagnóstico clínico direto de inflamação/infecção pulmonar",
  },

  "pneumonia bacteriana": {
    labelNIH: "Pneumonia",
    confianca: "alta",
    justificativa: "Subtipo de pneumonia",
  },

  "pneumonia viral": {
    labelNIH: "Pneumonia",
    confianca: "media",
    justificativa: "Pneumonia viral pode ter padrão radiológico variável",
  },

  "pneumonia atípica": {
    labelNIH: "Pneumonia",
    confianca: "media",
    sinonimos: ["pneumonia por atipicos"],
    justificativa: "Pode ter padrão radiológico diferente",
  },

  // =========================================================================
  // ACHADOS PLEURAIS
  // =========================================================================

  "derrame pleural": {
    labelNIH: "Effusion",
    confianca: "alta",
    sinonimos: ["efusão pleural", "fluido pleural", "hidrotórax"],
    justificativa: "Acúmulo de líquido na pleura",
  },

  efusao: {
    labelNIH: "Effusion",
    confianca: "alta",
    sinonimos: ["efusão"],
    justificativa: "Acúmulo de líquido",
  },

  // =========================================================================
  // ACHADOS DE PNEUMOTÓRAX
  // =========================================================================

  pneumotorax: {
    labelNIH: "Pneumothorax",
    confianca: "alta",
    sinonimos: ["pneumotórax", "colapso pulmonar", "ar na pleura"],
    justificativa: "Ar no espaço pleural",
  },

  "pneumotórax espontâneo": {
    labelNIH: "Pneumothorax",
    confianca: "alta",
    justificativa: "Subtipo de pneumotórax",
  },

  "pneumotórax traumático": {
    labelNIH: "Pneumothorax",
    confianca: "alta",
    justificativa: "Pneumotórax por trauma",
  },

  // =========================================================================
  // ACHADOS CARDÍACOS
  // =========================================================================

  cardiomegalia: {
    labelNIH: "Cardiomegaly",
    confianca: "alta",
    sinonimos: ["coração aumentado", "aumento cardíaco", "dilatação cardíaca"],
    justificativa: "Aumento de volume do coração",
  },

  "insuficiência cardíaca": {
    labelNIH: "Cardiomegaly",
    confianca: "media",
    sinonimos: ["insuficiencia cardiaca", "falência cardíaca"],
    justificativa: "IC pode apresentar cardiomegalia, mas nem sempre",
  },

  "edema pulmonar": {
    labelNIH: "Edema",
    confianca: "alta",
    sinonimos: ["edema intersticial", "edema alveolar", "congestão pulmonar"],
    justificativa: "Acúmulo de líquido nos pulmões",
  },

  // =========================================================================
  // ACHADOS OBSTRUTIVOS / ENFISÉMA
  // =========================================================================

  enfisema: {
    labelNIH: "Emphysema",
    confianca: "alta",
    sinonimos: ["enfisema pulmonar", "doença obstrutiva", "DPOC"],
    justificativa: "Destruição irreversível do parênquima pulmonar",
  },

  dpoc: {
    labelNIH: "Emphysema",
    confianca: "media",
    sinonimos: ["doença obstrutiva cronica", "bronquite cronica"],
    justificativa: "DPOC pode apresentar padrão de enfisema",
  },

  asma: {
    labelNIH: "Emphysema",
    confianca: "baixa",
    justificativa: "Asma não é enfisema, mas pode ter hiperinsuflação",
  },

  // =========================================================================
  // ACHADOS FIBROSOS / INTERSTICIAIS
  // =========================================================================

  fibrose: {
    labelNIH: "Fibrosis",
    confianca: "alta",
    sinonimos: ["fibrose pulmonar", "fibrose intersticial", "cicatriz pulmonar"],
    justificativa: "Substituição do parênquima por tecido fibroso",
  },

  "fibrose pulmonar": {
    labelNIH: "Fibrosis",
    confianca: "alta",
    justificativa: "Fibrose no tecido pulmonar",
  },

  "doença intersticial": {
    labelNIH: "Fibrosis",
    confianca: "media",
    sinonimos: ["doenca intersticial pulmonar"],
    justificativa: "Pode apresentar padrão fibroso",
  },

  // =========================================================================
  // ACHADOS NODULARES / MASSAS
  // =========================================================================

  nodulo: {
    labelNIH: "Nodule",
    confianca: "alta",
    sinonimos: ["nódulo pulmonar", "nodulo", "pequena lesão nodular"],
    justificativa: "Lesão esférica pequena no pulmão",
  },

  "nódulo pulmonar": {
    labelNIH: "Nodule",
    confianca: "alta",
    justificativa: "Nódulo definido como lesão <3cm",
  },

  massa: {
    labelNIH: "Mass",
    confianca: "alta",
    sinonimos: ["massa pulmonar", "tumor", "lesão expansiva"],
    justificativa: "Lesão esférica grande (>3cm)",
  },

  "massa pulmonar": {
    labelNIH: "Mass",
    confianca: "alta",
    justificativa: "Massa no parênquima pulmonar",
  },

  tumor: {
    labelNIH: "Mass",
    confianca: "media",
    sinonimos: ["neoplasia", "câncer de pulmão"],
    justificativa: "Tumor pode se apresentar como massa",
  },

  // =========================================================================
  // ACHADOS DE CONSOLIDAÇÃO / INFILTRAÇÃO
  // =========================================================================

  consolidacao: {
    labelNIH: "Consolidation",
    confianca: "alta",
    sinonimos: ["consolidação", "infiltrado alveolar", "opacidade alveolar"],
    justificativa: "Preenchimento alveolar por líquido/pus/sangue",
  },

  infiltracao: {
    labelNIH: "Infiltration",
    confianca: "alta",
    sinonimos: ["infiltrado", "opacidade pulmonar"],
    justificativa: "Presença de material patológico no pulmão",
  },

  "infiltrado pulmonar": {
    labelNIH: "Infiltration",
    confianca: "alta",
    justificativa: "Infiltração pulmonar",
  },

  // =========================================================================
  // ACHADOS DE ATELECTASIA
  // =========================================================================

  atelectasia: {
    labelNIH: "Atelectasis",
    confianca: "alta",
    sinonimos: ["colapso pulmonar", "atelectasia", "colapso alveolar"],
    justificativa: "Deflação de alvéolos",
  },

  "colapso pulmonar": {
    labelNIH: "Atelectasis",
    confianca: "alta",
    justificativa: "Colapso = atelectasia",
  },

  // =========================================================================
  // ACHADOS PLEURAIS (Secundários)
  // =========================================================================

  "espessamento pleural": {
    labelNIH: "Pleural Thickening",
    confianca: "alta",
    sinonimos: ["pleural thickening", "espessamento de pleura"],
    justificativa: "Engrossamento da membrana pleural",
  },

  // =========================================================================
  // ACHADOS DIAFRAGMÁTICOS
  // =========================================================================

  hernia: {
    labelNIH: "Hernia",
    confianca: "media",
    sinonimos: ["hérnia diafragmática", "hérnia hiatal"],
    justificativa: "Protrusão através de defeito diafragmático",
  },

  "hérnia diafragmática": {
    labelNIH: "Hernia",
    confianca: "alta",
    justificativa: "Hérnia do diafragma",
  },

  // =========================================================================
  // RX NORMAL / SEM ALTERAÇÃO
  // =========================================================================

  normal: {
    labelNIH: "No Finding",
    confianca: "alta",
    sinonimos: ["sem alteração", "sem achado", "normal"],
    justificativa: "RX de tórax sem alterações",
  },

  "sem alteração": {
    labelNIH: "No Finding",
    confianca: "alta",
    sinonimos: ["sem achado", "normal"],
    justificativa: "Sem achados patológicos",
  },

  "sem achado": {
    labelNIH: "No Finding",
    confianca: "alta",
    justificativa: "Nenhum achado radiológico",
  },

  "sem achados": {
    labelNIH: "No Finding",
    confianca: "alta",
    justificativa: "Sem achados",
  },

  "rx normal": {
    labelNIH: "No Finding",
    confianca: "alta",
    justificativa: "RX normal",
  },
};

/**
 * Normaliza um diagnóstico clínico para procurar no mapeamento
 *
 * Aplica transformações:
 * - Minúsculas
 * - Remove acentos
 * - Remove espaços extras
 * - Remove caracteres especiais
 */
function normalizarParaBusca(diagnostico: string): string {
  return (
    diagnostico
      .toLowerCase()
      .trim()
      // Remove acentos
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      // Remove caracteres especiais mas mantém espaços e hífen
      .replace(/[^a-z0-9\s\-]/g, "")
      // Remove espaços extras
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Busca por sinônimos no mapeamento
 * Retorna a chave principal se encontrar um sinônimo
 */
function buscarPorSinonimo(diagnosticoNormalizado: string): string | null {
  for (const [chave, valor] of Object.entries(MAPEAMENTO_DIAGNOSTICOS)) {
    if (valor.sinonimos) {
      for (const sinonimo of valor.sinonimos) {
        if (normalizarParaBusca(sinonimo) === diagnosticoNormalizado) {
          return chave;
        }
      }
    }
  }
  return null;
}

/**
 * Normaliza um diagnóstico clínico para rótulo NIH
 *
 * Trata:
 * 1. Busca exata no mapeamento
 * 2. Busca por sinônimo
 * 3. Busca parcial (substring)
 * 4. Retorna "No Finding" como fallback
 *
 * @param diagnostico Diagnóstico clínico do caso
 * @returns Objeto com rótulo NIH, confiança e justificativa
 */
export function normalizarDiagnosticoParaNIH(diagnostico: string) {
  const diagnosticoNormalizado = normalizarParaBusca(diagnostico);

  // 1. Busca exata
  if (MAPEAMENTO_DIAGNOSTICOS[diagnosticoNormalizado]) {
    const resultado = MAPEAMENTO_DIAGNOSTICOS[diagnosticoNormalizado];
    return {
      labelNIH: resultado.labelNIH,
      confiancaMapeamento: resultado.confianca,
      justificativa: resultado.justificativa || "Mapeamento direto",
      diagnosticoOriginal: diagnostico,
    };
  }

  // 2. Busca por sinônimo
  const chavePorSinonimo = buscarPorSinonimo(diagnosticoNormalizado);
  if (chavePorSinonimo) {
    const resultado = MAPEAMENTO_DIAGNOSTICOS[chavePorSinonimo];
    return {
      labelNIH: resultado.labelNIH,
      confiancaMapeamento: resultado.confianca,
      justificativa: resultado.justificativa || "Mapeamento por sinônimo",
      diagnosticoOriginal: diagnostico,
    };
  }

  // 3. Busca parcial (substring)
  for (const [chave, valor] of Object.entries(MAPEAMENTO_DIAGNOSTICOS)) {
    if (
      diagnosticoNormalizado.includes(chave) ||
      chave.includes(diagnosticoNormalizado)
    ) {
      return {
        labelNIH: valor.labelNIH,
        confiancaMapeamento: "baixa" as const,
        justificativa: "Mapeamento parcial/aproximado",
        diagnosticoOriginal: diagnostico,
      };
    }
  }

  // 4. Fallback: RX normal (quando não consegue mapear)
  return {
    labelNIH: "No Finding" as const,
    confiancaMapeamento: "baixa" as const,
    justificativa:
      "Diagnóstico não encontrado no mapeamento. Usando 'No Finding' como fallback.",
    diagnosticoOriginal: diagnostico,
  };
}

/**
 * Retorna todos os rótulos NIH disponíveis
 */
export function obterRotulosNIHDisponiveis(): RadiologyLabelNIH[] {
  const rotulos = new Set<RadiologyLabelNIH>();
  for (const valor of Object.values(MAPEAMENTO_DIAGNOSTICOS)) {
    rotulos.add(valor.labelNIH);
  }
  return Array.from(rotulos);
}

/**
 * Retorna todos os diagnósticos mapeados
 */
export function obterDiagnosticosMapeados(): string[] {
  return Object.keys(MAPEAMENTO_DIAGNOSTICOS);
}

/**
 * Valida se um rótulo NIH existe no mapeamento
 */
export function validarRotuloNIH(rotulo: RadiologyLabelNIH): boolean {
  const rotulosValidos = obterRotulosNIHDisponiveis();
  return rotulosValidos.includes(rotulo);
}
