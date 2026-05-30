import { ExameFisicoInterativo } from "./types";

interface ResultadoInterpretacao {
  sucesso: boolean;
  resposta: string;
}

function removerAcentos(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const MAPEAMENTO_PALAVRAS_CHAVE: Record<
  string,
  Record<string, string[]>
> = {
  geral: {
    estado_geral: [
      "estado geral",
      "ectoscopia",
      "inspecionar paciente",
      "ver paciente",
      "aspecto geral",
    ],
    consciencia: [
      "consciência",
      "nível de consciência",
      "orientação",
      "lúcido",
      "alerta",
    ],
    hidratacao: ["hidratação", "mucosas", "turgor"],
    coloracao: [
      "coloração",
      "palidez",
      "pálido",
      "cianose",
      "icterícia",
      "rubor",
    ],
    facies: ["fácies", "rosto", "expressão facial"],
    postura: ["postura", "decúbito", "posição"],
    marcha: ["marcha", "andar", "mobilidade geral"],
  },
  cardiovascular: {
    inspecao_precordial: ["inspecção precordial", "inspeção precordial"],
    ictus: [
      "ictus",
      "choque de ponta",
      "palpar ictus",
      "avaliar ictus",
      "palpação do ictus",
    ],
    fremitos: ["frêmitos", "fremitos", "pesquisar frêmitos"],
    ausculta_cardiaca: [
      "auscultar coração",
      "auscultar focos",
      "ausculta cardíaca",
      "ausculta do coração",
      "bulhas",
      "sopro",
      "murmúrio",
      "focos cardíacos",
    ],
    pulsos: [
      "pulsos",
      "pulso radial",
      "pulso periférico",
      "pulsos periféricos",
      "amplitude do pulso",
    ],
    perfusao: [
      "enchimento capilar",
      "perfusão",
      "tempo de enchimento",
      "capilar",
    ],
    turgencia_jugular: [
      "turgência jugular",
      "jugular",
      "estase jugular",
      "ingurgitamento jugular",
    ],
    refluxo_hepatojugular: [
      "refluxo hepatojugular",
      "hígado",
      "hepatojugular",
    ],
    edema: ["edema", "edema de membros inferiores", "inchaço"],
  },
  respiratorio: {
    inspecao_torax: [
      "inspecionar tórax",
      "inspeção do tórax",
      "ver tórax",
      "padrão respiratório",
      "tiragem",
      "musculatura acessória",
      "inspiração",
      "expiração",
    ],
    padrao_respiratorio: [
      "padrão respiratório",
      "frequência respiratória",
      "ritmo respiratório",
    ],
    expansibilidade: [
      "expansibilidade",
      "avaliar expansibilidade",
      "simetria torácica",
      "movimento do tórax",
    ],
    fremito_toracovocal: [
      "frêmito",
      "ftv",
      "frêmito toracovocal",
      "fremito toracovocal",
    ],
    percussao_respiratorio: [
      "percutir",
      "percussão",
      "percutir tórax",
      "macicez",
      "timpanismo",
      "submacicez",
    ],
    ausculta_pulmonar: [
      "auscultar pulmões",
      "ausculta pulmonar",
      "murmúrio vesicular",
      "sibilos",
      "estertores",
      "crepitações",
      "roncos",
    ],
    broncofonia: ["broncofonia"],
    egofonia: ["egofonia"],
    musculatura_acessoria: [
      "musculatura acessória",
      "músculos acessórios",
      "uso de acessória",
    ],
  },
  abdominal: {
    inspecao_abd: [
      "inspeção abdominal",
      "inspecionar abdome",
      "ver abdome",
      "aspecto abdominal",
    ],
    ausculta_abd: [
      "auscultar abdome",
      "ausculta abdominal",
      "ruídos hidroaéreos",
    ],
    percussao_abd: [
      "percutir abdome",
      "percussão abdominal",
      "timpanismo",
      "macicez",
    ],
    palpacao_superficial: [
      "palpação superficial",
      "palpar abdome superficialmente",
    ],
    palpacao_profunda: [
      "palpação profunda",
      "palpar abdome profundamente",
      "órgãos",
    ],
    dor_palpacao: ["dor", "defesa", "descompressão", "sinal de guarding"],
    visceromegalias: [
      "hepatomegalia",
      "esplenomegalia",
      "fígado",
      "baço",
      "rins",
      "visceromegalias",
    ],
    defesa: ["defesa muscular", "rigidez", "defesa involuntária"],
  },
  membros: {
    edema_mbr: ["edema", "inchaço", "edema em membros", "tornozelos"],
    pulsos_mbr: [
      "pulsos",
      "pulsos periféricos",
      "pedioso",
      "tibial posterior",
      "femoral",
      "poplíteo",
    ],
    perfusao_mbr: [
      "perfusão",
      "enchimento capilar",
      "temperatura",
      "extremidades",
    ],
    cianose: ["cianose", "cianótico"],
    varizes: ["varizes", "varicoso"],
    panturrilha: ["panturrilha", "gêmeo", "sinal de homan"],
    temperatura: ["temperatura", "mão quente", "pé frio"],
    mobilidade: ["mobilidade", "movimento", "força muscular"],
  },
};

const CONFIRMACOES_POR_CHAVE: Record<string, string> = {
  estado_geral: "Ok, você realiza a ectoscopia:",
  consciencia: "Ok, você avalia o nível de consciência:",
  hidratacao: "Ok, você avalia a hidratação:",
  coloracao: "Ok, você inspeciona a coloração da pele e mucosas:",
  facies: "Ok, você observa a fácies:",
  postura: "Ok, você avalia a postura:",
  marcha: "Ok, você observa a marcha:",
  inspecao_precordial: "Ok, você realiza inspeção precordial:",
  ictus: "Ok, você palpa o ictus cordis:",
  fremitos: "Ok, você pesquisa frêmitos:",
  ausculta_cardiaca: "Ok, você ausculta os focos cardíacos:",
  pulsos: "Ok, você avalia os pulsos:",
  perfusao: "Ok, você avalia a perfusão periférica:",
  turgencia_jugular: "Ok, você avalia a turgência jugular a 45°:",
  refluxo_hepatojugular: "Ok, você pesquisa o refluxo hepatojugular:",
  edema: "Ok, você pesquisa edema:",
  inspecao_torax: "Ok, você inspeciona o tórax:",
  padrao_respiratorio: "Ok, você avalia o padrão respiratório:",
  expansibilidade: "Ok, você avalia a expansibilidade torácica:",
  fremito_toracovocal: "Ok, você pesquisa o frêmito toracovocal:",
  percussao_respiratorio: "Ok, você realiza a percussão pulmonar:",
  ausculta_pulmonar: "Ok, você ausculta os pulmões:",
  broncofonia: "Ok, você pesquisa broncofonia:",
  egofonia: "Ok, você pesquisa egofonia:",
  musculatura_acessoria: "Ok, você observa o uso de musculatura acessória:",
  inspecao_abd: "Ok, você inspeciona o abdome:",
  ausculta_abd: "Ok, você ausculta o abdome:",
  percussao_abd: "Ok, você percute o abdome:",
  palpacao_superficial: "Ok, você realiza palpação abdominal superficial:",
  palpacao_profunda: "Ok, você realiza palpação abdominal profunda:",
  dor_palpacao: "Ok, você avalia dor e defesa abdominal:",
  visceromegalias: "Ok, você pesquisa visceromegalias:",
  defesa: "Ok, você avalia a defesa muscular abdominal:",
  edema_mbr: "Ok, você avalia edema em membros:",
  pulsos_mbr: "Ok, você avalia os pulsos dos membros:",
  perfusao_mbr: "Ok, você avalia a perfusão dos membros:",
  cianose: "Ok, você pesquisa cianose:",
  varizes: "Ok, você pesquisa varizes:",
  panturrilha: "Ok, você avalia a panturrilha:",
  temperatura: "Ok, você avalia a temperatura das extremidades:",
  mobilidade: "Ok, você avalia a mobilidade dos membros:",
};

export function interpretarManobraExameFisico(
  caso: any,
  categoria: "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros",
  textoDigitado: string
): ResultadoInterpretacao {
  const textoNormalizado = removerAcentos(textoDigitado);
  const categoriaDados =
    caso.exame_fisico_interativo?.[categoria] || {};

  const mapeamentoCategorias = MAPEAMENTO_PALAVRAS_CHAVE[categoria] || {};

  for (const [chave, palavrasChave] of Object.entries(mapeamentoCategorias)) {
    const palavrasNormalizadas = (palavrasChave as string[]).map(p =>
      removerAcentos(p)
    );

    const encontrou = palavrasNormalizadas.some(palavra =>
      textoNormalizado.includes(palavra)
    );

    if (encontrou) {
      let achado = "";
      let chaveAchado = chave;

      if (
        chave === "inspecao_abd" &&
        categoriaDados["inspecao"]
      ) {
        achado = categoriaDados["inspecao"];
      } else if (
        chave === "ausculta_abd" &&
        categoriaDados["ausculta"]
      ) {
        achado = categoriaDados["ausculta"];
      } else if (
        chave === "percussao_abd" &&
        categoriaDados["percussao"]
      ) {
        achado = categoriaDados["percussao"];
      } else if (
        chave === "percussao_respiratorio" &&
        categoriaDados["percussao"]
      ) {
        achado = categoriaDados["percussao"];
      } else if (
        chave === "edema_mbr" &&
        categoriaDados["edema"]
      ) {
        achado = categoriaDados["edema"];
      } else if (
        chave === "pulsos_mbr" &&
        categoriaDados["pulsos"]
      ) {
        achado = categoriaDados["pulsos"];
      } else if (
        chave === "perfusao_mbr" &&
        categoriaDados["perfusao"]
      ) {
        achado = categoriaDados["perfusao"];
      } else if (categoriaDados[chave]) {
        achado = categoriaDados[chave];
      }

      if (achado) {
        const confirmacao = CONFIRMACOES_POR_CHAVE[chave] || "Ok, você realiza:";
        const resposta = `${confirmacao} ${achado}`;

        return {
          sucesso: true,
          resposta,
        };
      }
    }
  }

  return {
    sucesso: false,
    resposta: `Não consegui identificar essa manobra em ${categoria}. Tente ser mais específico.`,
  };
}
