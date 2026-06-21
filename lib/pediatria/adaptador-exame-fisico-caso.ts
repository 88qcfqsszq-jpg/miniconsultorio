import { Caso } from "@/lib/types";

// ============================================================================
// TIPOS PARA O ADAPTADOR
// ============================================================================

export type OrigemAchadoCaso =
  | "interativo"
  | "correto"
  | "exameFisicoCorreto"
  | "achados_positivos"
  | "achados_negativos"
  | "checklist_oculto"
  | "modelo_soap";

export interface AchadoVisualDoCaso {
  id: string;
  casoId: string;
  regiaoId: string;
  acaoId: string;
  titulo: string;
  descricao: string;
  normal: boolean;
  origem: OrigemAchadoCaso;
  campo_original: string;
  sistemaClinico?: string;
  gravidade?: "normal" | "leve" | "moderada" | "grave";
}

export interface AcaoVisualDoCaso {
  id: string;
  label: string;
  metodo?: "inspecao" | "palpacao" | "percussao" | "ausculta" | "medida" | "avaliacao";
  achado: AchadoVisualDoCaso;
}

export interface RegiaoVisualDoCaso {
  id: string;
  label: string;
  sistemaClinico?: string;
  acoes: AcaoVisualDoCaso[];
}

export interface ExameFisicoVisualGeradoDoCaso {
  casoId: string;
  origem: "caso";
  regioes: RegiaoVisualDoCaso[];
}

// ============================================================================
// MAPEAMENTOS INTERNOS
// ============================================================================

// Mapeamento de campos exame_fisico_interativo para regionId
const MAPA_INTERATIVO_PARA_REGIAO: Record<string, string> = {
  // geral
  "geral.estado_geral": "estado_geral",
  "geral.consciencia": "estado_geral",
  "geral.hidratacao": "pele_mucosas",
  "geral.coloracao": "face_olhos",

  // respiratorio
  "respiratorio.padrao_respiratorio": "torax_respiratorio",
  "respiratorio.frequencia_respiratoria": "torax_respiratorio",
  "respiratorio.ausculta_pulmonar": "torax_respiratorio",
  "respiratorio.tiragens": "torax_respiratorio",
  "respiratorio.expansibilidade": "torax_respiratorio",

  // cardiovascular
  "cardiovascular.inspecao_precordial": "precordio",
  "cardiovascular.ausculta_cardiaca": "precordio",
  "cardiovascular.sopro": "precordio",
  "cardiovascular.ritmo_cardiaco": "precordio",
  "cardiovascular.frequencia_cardiaca": "precordio",
  "cardiovascular.pulsos": "membros_perfusao",
  "cardiovascular.perfusao": "membros_perfusao",
  "cardiovascular.turgencia_jugular": "pescoco_linfonodos",

  // abdomen
  "abdome.palpacao": "abdome",
  "abdome.inspecao": "abdome",
  "abdome.ausculta": "abdome",
  "abdome.figado": "figado",
  "abdome.baco": "baco",
  "abdome.hepatomegalia": "figado",
  "abdome.esplenomegalia": "baco",

  // neuro
  "neurologia.consciencia": "estado_geral",
  "neurologia.marcos_desenvolvimento": "desenvolvimento",
};

// Palavras-chave para identificar região a partir de texto
const PALAVRAS_CHAVE_REGIAO: Record<string, string[]> = {
  face_olhos: [
    "mucosa",
    "mucosas",
    "hidratação",
    "desidratação",
    "palidez",
    "cianose",
    "coloração",
    "olhos",
    "conjuntiva",
    "córnea",
    "reflexo",
  ],
  orofaringe: ["garganta", "orofaringe", "amígdala", "amígdalas", "tímpano", "tímpanos", "faringe"],
  pescoco_linfonodos: ["linfonodo", "linfonodos", "cervical", "cervicais"],
  torax_respiratorio: [
    "murmúrio vesicular",
    "sibilo",
    "sibilos",
    "ronco",
    "roncos",
    "crepitação",
    "crepitações",
    "estertores",
    "tiragem",
    "tiragens",
    "taquipneia",
    "frequência respiratória",
    "padrão respiratório",
    "expansibilidade",
    "ausculta pulmonar",
    "pulmonar",
    "respiratório",
    "pulmão",
    "pulmões",
    "tosse",
    "dispneia",
    "desconforto respiratório",
  ],
  precordio: [
    "sopro",
    "bulha",
    "bulhas",
    "taquicardia",
    "ritmo",
    "cardiaco",
    "cardíaca",
    "precórdio",
    "coração",
    "cardíaco",
    "ausculta cardíaca",
    "focos cardíacos",
    "arritmia",
  ],
  abdome: [
    "abdome",
    "abdominal",
    "dor abdominal",
    "palpação abdominal",
    "inspecção abdominal",
    "ausculta abdominal",
  ],
  figado: ["fígado", "hepatomegalia", "hepatomegálico"],
  baco: ["baço", "esplenomegalia", "esplenomegálico"],
  membros_perfusao: [
    "pulso",
    "pulsos",
    "perfusão",
    "enchimento capilar",
    "tec",
    "extremidades",
    "membros",
    "perfusão periférica",
  ],
  pele_mucosas: [
    "pele",
    "exantema",
    "petéquias",
    "equimoses",
    "hematomas",
    "lesão",
    "lesões",
    "mucosa",
    "mucosas",
    "úmidas",
    "ressecadas",
  ],
  desenvolvimento: ["desenvolvimento", "marcos", "marcos do desenvolvimento", "desenvolvimento neuropsicomotor"],
};

// Palavras que indicam achado PATOLÓGICO (normal = false)
const PALAVRAS_PATOLOGICAS = [
  "palidez",
  "cianose",
  "taquipneia",
  "tiragem",
  "sibilo",
  "sibilos",
  "ronco",
  "roncos",
  "crepitação",
  "crepitações",
  "estertores",
  "sopro",
  "taquicardia",
  "hepatomegalia",
  "esplenomegalia",
  "exantema",
  "petéquias",
  "equimoses",
  "hematomas",
  "febril",
  "febre",
  "prostrada",
  "apática",
  "apatia",
  "letargia",
  "dor",
  "reduzido",
  "aumentado",
  "submacicez",
  "macicez",
  "alteração",
  "anormal",
  "comprometido",
  "afetado",
];

// Palavras que indicam achado NORMAL (normal = true)
const PALAVRAS_NORMAIS = [
  "normal",
  "sem alterações",
  "sem sinais",
  "presente bilateralmente sem",
  "mucosas úmidas",
  "sem roncos",
  "sem sibilos",
  "sem aumento",
  "sem aumento significativo",
  "adequado",
  "preservado",
  "mantido",
  "simétrico",
  "simétricos",
];

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function detectarNormalidade(texto: string): boolean {
  const textoLower = texto.toLowerCase();

  // Verificar palavras-chave normais com prioridade
  for (const palavra of PALAVRAS_NORMAIS) {
    if (textoLower.includes(palavra)) {
      return true;
    }
  }

  // Verificar palavras-chave patológicas
  for (const palavra of PALAVRAS_PATOLOGICAS) {
    if (textoLower.includes(palavra)) {
      return false;
    }
  }

  // Default: considerar normal se não houver indicador de patologia
  return true;
}

function detectarRegiaoDoTexto(texto: string): string | null {
  const textoLower = texto.toLowerCase();

  // Buscar na ordem de importância
  for (const [regiao, palavras] of Object.entries(PALAVRAS_CHAVE_REGIAO)) {
    for (const palavra of palavras) {
      if (textoLower.includes(palavra.toLowerCase())) {
        return regiao;
      }
    }
  }

  return null;
}

function gerarIdAchado(casoId: string, regiaoId: string, acaoId: string, origem: string): string {
  return `${casoId}-${regiaoId}-${acaoId}-${origem.substring(0, 3)}`;
}

function gerarIdAcao(regiaoId: string, acaoId: string): string {
  return `${regiaoId}-${acaoId}`;
}

function detectarSistemaClinico(regiaoId: string): string {
  const mapa: Record<string, string> = {
    estado_geral: "Geral",
    face_olhos: "Geral",
    orofaringe: "ORL",
    pescoco_linfonodos: "Geral",
    torax_respiratorio: "Respiratório",
    precordio: "Cardiovascular",
    abdome: "Abdominal",
    figado: "Abdominal",
    baco: "Abdominal",
    membros_perfusao: "Cardiovascular",
    pele_mucosas: "Geral",
    desenvolvimento: "Neurológico",
    cabeca_perimetro: "Geral",
  };
  return mapa[regiaoId] || "Geral";
}

// ============================================================================
// FUNÇÕES PRINCIPAIS
// ============================================================================

function extrairDoInterativo(
  caso: Caso,
  casoId: string
): Map<string, { titulo: string; descricao: string; normal: boolean; origem: OrigemAchadoCaso; campo_original: string; sistemaClinico: string }> {
  const achados = new Map<
    string,
    { titulo: string; descricao: string; normal: boolean; origem: OrigemAchadoCaso; campo_original: string; sistemaClinico: string }
  >();

  const interativo = (caso as any).exame_fisico_interativo;
  if (!interativo) return achados;

  // Iterar por cada seção e campo
  for (const [secao, campos] of Object.entries(interativo)) {
    if (typeof campos !== "object" || campos === null) continue;

    for (const [campo, valor] of Object.entries(campos as any)) {
      const descricaoRaw = typeof valor === "string" ? valor : JSON.stringify(valor);
      if (!descricaoRaw) continue;

      const chaveCompleta = `${secao}.${campo}`;
      const regiaoId = MAPA_INTERATIVO_PARA_REGIAO[chaveCompleta];

      if (regiaoId) {
        const acaoId = `${secao}-${campo}`;
        achados.set(
          `${regiaoId}::${acaoId}`,
          {
            titulo: campo.replace(/_/g, " ").toUpperCase(),
            descricao: descricaoRaw,
            normal: detectarNormalidade(descricaoRaw),
            origem: "interativo",
            campo_original: `exame_fisico_interativo.${chaveCompleta}`,
            sistemaClinico: detectarSistemaClinico(regiaoId),
          }
        );
      }
    }
  }

  return achados;
}

function extrairDoCorreto(
  caso: Caso,
  casoId: string
): Map<string, { titulo: string; descricao: string; normal: boolean; origem: OrigemAchadoCaso; campo_original: string; sistemaClinico: string }> {
  const achados = new Map<
    string,
    { titulo: string; descricao: string; normal: boolean; origem: OrigemAchadoCaso; campo_original: string; sistemaClinico: string }
  >();

  const exameCorreto = (caso as any).exame_fisico?.correto || (caso as any).exameFisicoCorreto;
  if (!exameCorreto || typeof exameCorreto !== "object") return achados;

  // Processar campos principais (inspecao, palpacao, ausculta, percussao, observacoes)
  for (const [campo, valor] of Object.entries(exameCorreto)) {
    if (typeof valor !== "string" || !valor.trim()) continue;

    // Skip arrays (achados_positivos, achados_negativos)
    if (Array.isArray(valor)) continue;

    const texto = valor.toLowerCase();
    const regiaoId = detectarRegiaoDoTexto(texto);

    if (regiaoId) {
      const acaoId = `${campo}-texto`;
      const chaveUnica = `${regiaoId}::${acaoId}`;

      if (!achados.has(chaveUnica)) {
        achados.set(chaveUnica, {
          titulo: campo.replace(/_/g, " ").toUpperCase(),
          descricao: valor,
          normal: detectarNormalidade(texto),
          origem: "correto",
          campo_original: `exame_fisico.correto.${campo}`,
          sistemaClinico: detectarSistemaClinico(regiaoId),
        });
      }
    }
  }

  return achados;
}

function extrairAchadosPositivosNegativos(
  caso: Caso,
  casoId: string
): Map<string, { titulo: string; descricao: string; normal: boolean; origem: OrigemAchadoCaso; campo_original: string; sistemaClinico: string }> {
  const achados = new Map<
    string,
    { titulo: string; descricao: string; normal: boolean; origem: OrigemAchadoCaso; campo_original: string; sistemaClinico: string }
  >();

  const exameCorreto = (caso as any).exame_fisico?.correto;
  if (!exameCorreto || typeof exameCorreto !== "object") return achados;

  // Achados positivos (patológicos)
  if (Array.isArray(exameCorreto.achados_positivos)) {
    for (const achado of exameCorreto.achados_positivos) {
      if (typeof achado !== "string") continue;

      const regiaoId = detectarRegiaoDoTexto(achado);
      if (regiaoId) {
        const acaoId = `achado-positivo-${achado.replace(/\s+/g, "-").toLowerCase()}`;
        const chaveUnica = `${regiaoId}::${acaoId}`;

        if (!achados.has(chaveUnica)) {
          achados.set(chaveUnica, {
            titulo: achado,
            descricao: achado,
            normal: false,
            origem: "achados_positivos",
            campo_original: "exame_fisico.correto.achados_positivos",
            sistemaClinico: detectarSistemaClinico(regiaoId),
          });
        }
      }
    }
  }

  // Achados negativos (normais)
  if (Array.isArray(exameCorreto.achados_negativos)) {
    for (const achado of exameCorreto.achados_negativos) {
      if (typeof achado !== "string") continue;

      const regiaoId = detectarRegiaoDoTexto(achado);
      if (regiaoId) {
        const acaoId = `achado-negativo-${achado.replace(/\s+/g, "-").toLowerCase()}`;
        const chaveUnica = `${regiaoId}::${acaoId}`;

        if (!achados.has(chaveUnica)) {
          achados.set(chaveUnica, {
            titulo: `Ausência de ${achado.toLowerCase()}`,
            descricao: `Sem ${achado.toLowerCase()}`,
            normal: true,
            origem: "achados_negativos",
            campo_original: "exame_fisico.correto.achados_negativos",
            sistemaClinico: detectarSistemaClinico(regiaoId),
          });
        }
      }
    }
  }

  return achados;
}

// ============================================================================
// FUNÇÃO PRINCIPAL EXPORTADA
// ============================================================================

export function gerarExameFisicoVisualAPartirDoCaso(caso: Caso): ExameFisicoVisualGeradoDoCaso | null {
  // Validar se é caso pediátrico
  if ((caso as any).tipoPaciente !== "pediatrico") {
    return null;
  }

  const casoId = caso.id || "unknown";

  // Extrair de múltiplas fontes em ordem de prioridade
  const achadosInterativo = extrairDoInterativo(caso, casoId);
  const achadosCorreto = extrairDoCorreto(caso, casoId);
  const achadosPositivosNegativos = extrairAchadosPositivosNegativos(caso, casoId);

  // Consolidar todos em um único mapa (prioridade: interativo > correto > positivos/negativos)
  const achadosConsolidados = new Map([
    ...achadosPositivosNegativos,
    ...achadosCorreto,
    ...achadosInterativo,
  ]);

  // Agrupar por regiaoId
  const regioesPorId = new Map<string, AcaoVisualDoCaso[]>();

  for (const [chaveUnica, achadoDados] of achadosConsolidados) {
    const [regiaoId, acaoId] = chaveUnica.split("::");

    const achado: AchadoVisualDoCaso = {
      id: gerarIdAchado(casoId, regiaoId, acaoId, achadoDados.origem),
      casoId,
      regiaoId,
      acaoId,
      titulo: achadoDados.titulo,
      descricao: achadoDados.descricao,
      normal: achadoDados.normal,
      origem: achadoDados.origem,
      campo_original: achadoDados.campo_original,
      sistemaClinico: achadoDados.sistemaClinico,
    };

    const acao: AcaoVisualDoCaso = {
      id: gerarIdAcao(regiaoId, acaoId),
      label: achadoDados.titulo,
      achado,
    };

    if (!regioesPorId.has(regiaoId)) {
      regioesPorId.set(regiaoId, []);
    }

    regioesPorId.get(regiaoId)!.push(acao);
  }

  // Construir array de regiões
  const regioes: RegiaoVisualDoCaso[] = [];

  for (const [regiaoId, acoes] of regioesPorId) {
    if (acoes.length === 0) continue; // Skip regiões vazias

    const label = regiaoId
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const sistemaClinico = detectarSistemaClinico(regiaoId);

    regioes.push({
      id: regiaoId,
      label,
      sistemaClinico,
      acoes,
    });
  }

  return {
    casoId,
    origem: "caso",
    regioes,
  };
}
