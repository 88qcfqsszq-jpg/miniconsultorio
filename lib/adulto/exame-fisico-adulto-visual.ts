// ============================================================================
// Exame Físico Adulto Visual — dados e banco de achados estruturado
// ----------------------------------------------------------------------------
// Espelha a estrutura do exame físico pediátrico visual (regiões → ações →
// achado → registro), mas com dados clínicos ADULTOS. As regiões/coordenadas
// e ações reaproveitam `data/regioesBoneco`; os achados são lidos de forma
// estruturada do próprio caso (`exame_fisico.correto` / `exameFisicoCorreto`),
// mapeados pelo verbo da manobra. Determinístico, sem chamada de API.
// ============================================================================

import { regioesBoneco, type Regiao as RegiaoBoneco } from "@/data/regioesBoneco";

export type VistaAdulta = "frente" | "costas";

export type CategoriaExameAdulto =
  | "geral"
  | "cardiovascular"
  | "respiratorio"
  | "abdominal"
  | "membros";

export interface AcaoAdultaVisual {
  id: string; // = textoAPI da manobra (estável)
  label: string;
  descricao: string;
  textoAPI: string;
  categoria: CategoriaExameAdulto;
}

export interface RegiaoAdultaVisual {
  id: string;
  label: string;
  descricao: string;
  vista: VistaAdulta;
  // hotspot (% do container) — reaproveitado do boneco
  x: number;
  y: number;
  w: number;
  h: number;
  acoes: AcaoAdultaVisual[];
}

export interface AchadoAdultoVisual {
  id: string;
  titulo: string;
  descricao: string;
  categoria: "exame_fisico_visual";
  acaoRealizada: string;
  regiaoId: string;
  sistema: CategoriaExameAdulto;
  normal: boolean;
}

const TEXTO_NORMALIDADE = "Sem alterações dignas de nota.";

// Centro do hotspot (ponto discreto), derivado do retângulo da região.
export function centroHotspot(r: RegiaoAdultaVisual): { x: number; y: number } {
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

// ---------------------------------------------------------------------------
// Categorização da manobra (mesma lógica do PainelExameFisico, centralizada)
// ---------------------------------------------------------------------------
export function categorizarManobraAdulta(texto: string): CategoriaExameAdulto {
  const t = (texto || "").toLowerCase();

  if (
    /pulmonar|pulmonares|campos pulmonares|[áa]pice|base|t[óo]rax posterior|expansibilidade|fr[êe]mito toracovocal|padr[ãa]o respirat[óo]rio|murm[úu]rio vesicular|crepita[çc]|estertor|sibilo|ronco|atrito pleural|percutir.*pulmonar/.test(
      t
    )
  )
    return "respiratorio";

  if (
    /precordio|prec[óo]rdio|ictus|foco a[óo]rtico|foco tric[úu]spide|foco mitral|foco pulmonar|bulhas|sopro|fr[êe]mitos? precordia|turg[êe]ncia jugular|car[óo]tid/.test(
      t
    )
  )
    return "cardiovascular";

  if (
    /abdome|abdominal|blumberg|murphy|hidroa[ée]reo|ru[íi]dos|punho percuss|renal|f[íi]gado|hepat|ba[çc]o|espl[êe]n/.test(
      t
    )
  )
    return "abdominal";

  if (
    /edema|cacifo|panturrilha|homans|empastamento|perfus[ãa]o|membros inferiores|pulsos perif|baqueteamento|cianose perif|janeway|osler|subungue/.test(
      t
    )
  )
    return "membros";

  return "geral";
}

// ---------------------------------------------------------------------------
// Regiões adultas (derivadas do boneco, no formato visual)
// ---------------------------------------------------------------------------
function descreverRegiao(nome: string, vista: VistaAdulta): string {
  return `Avaliação — ${nome}${vista === "costas" ? " (posterior)" : ""}`;
}

export const REGIOES_ADULTAS_VISUAL: RegiaoAdultaVisual[] = (
  regioesBoneco as RegiaoBoneco[]
).map((r) => ({
  id: r.id,
  label: r.nome,
  descricao: descreverRegiao(r.nome, r.vista),
  vista: r.vista,
  x: r.x,
  y: r.y,
  w: r.w,
  h: r.h,
  acoes: r.manobras.map((m) => {
    const categoria = categorizarManobraAdulta(m.textoAPI);
    return {
      id: m.textoAPI,
      label: m.nome,
      descricao: m.nome,
      textoAPI: m.textoAPI,
      categoria,
    };
  }),
}));

export function obterRegioesAdultasPorVista(
  vista: VistaAdulta
): RegiaoAdultaVisual[] {
  return REGIOES_ADULTAS_VISUAL.filter((r) => r.vista === vista);
}

// ---------------------------------------------------------------------------
// Banco de achados estruturado — lê do próprio caso, por verbo da manobra
// ---------------------------------------------------------------------------
interface ExameFisicoCorretoLike {
  inspecao?: string;
  palpacao?: string;
  ausculta?: string;
  percussao?: string;
  observacoes?: string;
  achados_positivos?: string[];
}

function obterExameFisicoCorreto(caso: any): ExameFisicoCorretoLike {
  return (
    caso?.exame_fisico?.correto ||
    caso?.exameFisicoCorreto ||
    caso?.exame_fisico ||
    {}
  );
}

function campoPorVerbo(
  ef: ExameFisicoCorretoLike,
  textoAPI: string
): string | undefined {
  const t = (textoAPI || "").toLowerCase();
  if (/auscult/.test(t)) return ef.ausculta;
  if (/percut/.test(t)) return ef.percussao;
  if (/palpa|palpar/.test(t)) return ef.palpacao;
  if (/inspec/.test(t)) return ef.inspecao;
  return ef.observacoes || ef.inspecao;
}

/**
 * Retorna o achado estruturado para uma ação adulta, lido do caso.
 * Sempre retorna um achado (fallback de normalidade), espelhando o
 * comportamento "com fallback" do pediátrico.
 */
export function obterAchadoAdultoVisual(
  caso: any,
  regiao: RegiaoAdultaVisual,
  acao: AcaoAdultaVisual
): AchadoAdultoVisual {
  const ef = obterExameFisicoCorreto(caso);
  const campo = campoPorVerbo(ef, acao.textoAPI);
  const descricao =
    (campo && campo.trim()) ||
    (ef.observacoes && ef.observacoes.trim()) ||
    TEXTO_NORMALIDADE;

  const descLower = descricao.toLowerCase();
  const normal =
    descricao === TEXTO_NORMALIDADE ||
    /\bnormal\b|sem altera|sem anormalidade|fisiol[óo]gic|preservad|sim[ée]tric/.test(
      descLower
    );

  return {
    id: `adulto-visual-${regiao.id}-${acao.id}`.replace(/\s+/g, "-"),
    titulo: acao.label,
    descricao,
    categoria: "exame_fisico_visual",
    acaoRealizada: acao.label,
    regiaoId: regiao.id,
    sistema: acao.categoria,
    normal,
  };
}
