// ============================================================================
// physicalExamMapper — normaliza uma MANOBRA de exame físico realizada.
// Garante que TODA manobra executada seja registrada de forma compatível com o
// relatório, o evidence-mapper e o feedback (campos textDigitado/resposta/
// categoria), COM achado quando houver e "sem achado" quando não houver — sem
// transformar exames normais em patológicos.
// ============================================================================

export type CategoriaManobra =
  | "geral"
  | "cardiovascular"
  | "respiratorio"
  | "abdominal"
  | "membros";

/** Mapeia o sistema (ex.: pediátrico) para a categoria da ManobraRealizada. */
export function sistemaParaCategoria(sistema?: string): CategoriaManobra {
  const s = String(sistema ?? "").toLowerCase();
  if (s.includes("cardio")) return "cardiovascular";
  if (s.includes("respir") || s.includes("pulmon") || s.includes("torac")) return "respiratorio";
  if (s.includes("abdom")) return "abdominal";
  if (s.includes("membro") || s.includes("extrem")) return "membros";
  return "geral";
}

export interface ManobraNormalizadaInput {
  acaoId: string;
  titulo: string;
  sistema?: string;
  /** Achado específico do caso (já convertido) ou null/undefined se não houver. */
  achado?: any | null;
}

/**
 * Constrói o registro padronizado da manobra. Sempre retorna um objeto (nunca
 * null): se há achado → usa o achado; se não há → "exame realizado sem achado".
 */
export function montarManobraExameFisico({ acaoId, titulo, sistema, achado }: ManobraNormalizadaInput): any {
  const categoria = sistemaParaCategoria(sistema);
  const temAchado = !!achado;
  const descricao = temAchado
    ? (achado.descricao || achado.resposta || "Achado registrado.")
    : "Exame realizado — sem achado patológico relevante configurado para esta manobra.";
  // Achado explicitamente marcado como normal também conta como "sem alteração".
  const normal = temAchado ? achado.normal === true : true;

  return {
    // Campos existentes (compatibilidade com o fluxo pediátrico atual):
    id: temAchado ? achado.id ?? acaoId : `ped-sem-achado-${acaoId}`,
    titulo,
    descricao,
    acaoRealizada: titulo,
    regiao: temAchado ? achado.regiao ?? sistema : sistema,
    categoria,
    normal,
    // Campos padrão lidos pelo relatório / evidence-mapper / feedback:
    textDigitado: titulo,
    resposta: descricao,
    sistemaClinico: temAchado ? achado.sistemaClinico : undefined,
  };
}

export type EstadoExameFisico =
  | "nao_realizado"
  | "realizado_sem_achado"
  | "realizado_com_achado";

/**
 * Classifica o estado do exame físico a partir das manobras registradas
 * (apresentação/relatório — NÃO altera scoring). "Não interpretou o achado"
 * depende de cruzar com o SOAP/diagnóstico e fica como recomendação futura.
 */
export function classificarExameFisico(manobras?: any[]): EstadoExameFisico {
  if (!Array.isArray(manobras) || manobras.length === 0) return "nao_realizado";
  const temAchado = manobras.some((m) => m?.normal === false);
  return temAchado ? "realizado_com_achado" : "realizado_sem_achado";
}

export const ESTADO_EXAME_LABEL: Record<EstadoExameFisico, string> = {
  nao_realizado: "Exame físico não realizado.",
  realizado_sem_achado: "Exame físico realizado — sem achados patológicos relevantes.",
  realizado_com_achado: "Exame físico realizado — com achados relevantes.",
};
