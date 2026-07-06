// ============================================================================
// labCaseData — HELPER de acesso aos exames V2 do caso
// ============================================================================
// Funções simples para priorizar dados reais do caso V2 sobre templates
// antigos em todos os módulos laboratoriais.
// ============================================================================

export function getExameLaboratorialV2(caso: any, campo: string) {
  return (
    caso?.exames?.laboratoriais?.[campo] ||
    caso?.exames_laboratoriais_detalhados?.[campo] ||
    null
  );
}

export function temValoresV2(exame: any) {
  return !!exame?.valores && Object.keys(exame.valores).length > 0;
}

export function getValorCampo(
  valores: Record<string, any>,
  ...keys: string[]
) {
  for (const key of keys) {
    const valor = valores?.[key];
    if (valor !== undefined && valor !== null && valor !== "") {
      return valor;
    }
  }
  return undefined;
}

export function textoIndicaAlteracao(texto?: string) {
  if (!texto) return false;

  const t = String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

  return [
    "alter",
    "elevad",
    "baixo",
    "baixa",
    "reduz",
    "aument",
    "compat",
    "hemolise",
    "hemoglobinuria",
    "hipoxemia",
    "acidose",
    "alcalose",
    "infecc",
    "grave",
    "positivo",
    "positiva",
    "anemia",
    "reticulocitose",
    "leucocitose",
    "plaquetopenia",
    "bilirrubina",
    "ictericia",
    "hemorragia",
    "coagulopatia",
  ].some((termo) => t.includes(termo));
}

export function nivelPorExameV2(
  exame: any,
  fallback: "normal" | "leve" | "moderado" | "grave" = "normal"
) {
  if (!exame) return fallback;

  if (
    exame.prioridade === "obrigatorio" ||
    exame.prioridade === "importante"
  ) {
    return "grave";
  }

  if (textoIndicaAlteracao(exame.interpretacao)) {
    return "grave";
  }

  return fallback;
}

export function normalizarNomeCampo(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[\s\-_]/g, "");
}

export function obterSinonimo(
  valores: Record<string, any>,
  sinonimos: string[]
) {
  for (const sin of sinonimos) {
    const normalizado = normalizarNomeCampo(sin);
    for (const [chave, valor] of Object.entries(valores)) {
      if (normalizarNomeCampo(chave) === normalizado) {
        return valor;
      }
    }
  }
  return undefined;
}
