import { NextRequest, NextResponse } from "next/server";
import { casosV2 } from "@/data/casos-v2";
import { criarPromptAgentExames } from "@/lib/prompts";
import { openai } from "@/lib/openai";

interface RequestBody {
  casoId: string;
  exameSolicitado: string;
  historico: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { casoId, exameSolicitado, historico } = body;

    if (!casoId || !exameSolicitado) {
      return NextResponse.json(
        { erro: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const caso = casosV2.find((c) => c.id === casoId);
    if (!caso) {
      return NextResponse.json(
        { erro: `Caso com ID ${casoId} não encontrado` },
        { status: 404 }
      );
    }

    // Tentar nova estrutura primeiro, depois fallback para a antiga
    const examesComplementares = (caso as any).exames_complementares_disponiveis ||
      (caso as any).exames?.complementaresOriginais || [];

    const examesDisponiveisTexto = Array.isArray(examesComplementares)
      ? examesComplementares
          .map((e: any) => `- ${e.nome}: ${e.descricao || "N/A"}`)
          .join("\n")
      : "";

    // PRIORIDADE 1: Buscar no caso V2 estruturado ANTES de qualquer IA.
    // Assim, exames encontrados e exames reconhecidos-mas-indisponíveis (ex.: ECG
    // de um contexto não cadastrado) nunca acionam o gpt-4o-mini.
    const resultadoV2 = buscarExameNoCasoV2(caso, exameSolicitado);
    if (resultadoV2.encontrado) {
      return NextResponse.json(resultadoV2);
    }
    // Exame reconhecido, porém o contexto solicitado não existe no caso:
    // resposta DEFINITIVA (sem IA, sem substituir por outro contexto).
    if ((resultadoV2 as any).indisponivel) {
      return NextResponse.json(resultadoV2);
    }

    // Exame não localizado no caso estruturado: só agora tentar a IA.
    let resposta: string | null = null;

    if (openai) {
      try {
        const prompt = criarPromptAgentExames(
          caso as any,
          exameSolicitado,
          historico,
          examesDisponiveisTexto
        );

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é um agente que interpreta solicitações de exames complementares em OSCE. Retorne apenas a resposta do exame, sem explicações extras.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        });

        resposta = response.choices[0]?.message?.content || null;
      } catch (error) {
        console.error("Erro ao chamar OpenAI:", error);
        resposta = null;
      }
    }

    // Fallback se API falhar
    if (!resposta) {
      const resultado = processoFallback(
        exameSolicitado,
        caso,
        examesDisponiveisTexto
      );
      return NextResponse.json({ resultado });
    }

    return NextResponse.json({ resultado: resposta });
  } catch (error) {
    console.error("Erro na API exames-complementares:", error);
    return NextResponse.json(
      {
        erro: "Erro ao processar a requisição",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// ===== NOVO MAPEADOR DE EXAMES V2 =====

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Reconhecimento canônico de solicitação/laudo de ECG.
// Distingue ECG de ecocardiograma e preserva o contexto repouso × esforço.
type ContextoECG = "repouso" | "esforco" | "generico";
interface CanonECG {
  isECG: boolean;
  contexto: ContextoECG;
}

/**
 * Classifica um texto normalizado (solicitação do usuário OU nome do item)
 * como ECG e determina o contexto. NÃO trata ecocardiograma como ECG e não
 * usa substring ampla ("eco"): exige as formas próprias do eletrocardiograma.
 */
function canonizarECG(textoNorm: string): CanonECG {
  const ehEco = /ecocardiograma|ecocardiografia|\beco\b/.test(textoNorm);
  const ehECG =
    !ehEco &&
    (/\becg\b/.test(textoNorm) ||
      /eletrocardiograma/.test(textoNorm) ||
      /ergometri/.test(textoNorm) || // teste ergométrico / ergometria
      /teste de esforco/.test(textoNorm));
  if (!ehECG) return { isECG: false, contexto: "generico" };

  let contexto: ContextoECG = "generico";
  if (/esforco|ergometri|estresse/.test(textoNorm)) contexto = "esforco";
  else if (/repouso|basal/.test(textoNorm)) contexto = "repouso";
  return { isECG: true, contexto };
}

function gerarResultadoFormatado(campo: string, exame: any): string {
  // resultado é o achado clínico registrado no caso (ex.: laudo de ECG, valor laboratorial).
  // interpretacao é anotação educacional — aparece como fallback quando resultado ausente.
  if (exame?.resultado) {
    return exame.resultado;
  }
  if (exame?.interpretacao) {
    return exame.interpretacao;
  }

  // Se tem valores, formata uma string descritiva
  if (exame?.valores && typeof exame.valores === "object") {
    const linhas: string[] = [];

    // Adicionar valores principais de forma legível
    Object.entries(exame.valores).forEach(([chave, valor]: any) => {
      if (valor) {
        linhas.push(`${chave}: ${valor}`);
      }
    });

    if (linhas.length > 0) {
      return linhas.join("; ");
    }
  }

  // Fallback simples
  return `Exame ${campo} realizado. Verificar detalhes no laudo completo.`;
}

const mapaExamesLaboratoriais: { [key: string]: string[] } = {
  hemograma: ["hemograma", "hemograma completo", "serie vermelha", "serie branca", "plaquetas"],
  funcaoRenal: ["funcao renal", "função renal", "ureia", "creatinina"],
  eletrolitos: ["eletrolitos", "eletrólitos", "ionograma", "sodio", "sódio", "potassio", "potássio", "magnesio", "magnésio", "calcio", "cálcio"],
  marcadoresInflamatorios: ["pcr", "vhs", "procalcitonina", "marcadores inflamatorios", "marcadores inflamatórios"],
  gasometria: ["gasometria", "gasometria arterial", "gasometria venosa", "lactato"],
  marcadoresCardiacos: ["troponina", "ckmb", "ck-mb", "bnp", "nt-probnp", "marcadores cardiacos", "marcadores cardíacos"],
  funcaoHepatica: ["funcao hepatica", "função hepática", "tgo", "ast", "tgp", "alt", "bilirrubina", "bilirrubinas"],
  coagulograma: ["coagulograma", "tp", "inr", "ttpa", "tap", "fibrinogenio", "fibrinogênio", "d-dimero", "dímero"],
  urinaTipo1: ["urina", "urina tipo 1", "eas", "sumario de urina", "sumário de urina"],
  urocultura: ["urocultura", "cultura de urina"],
  perfilFerro: ["perfil ferro", "perfil do ferro", "ferritina", "ferro", "ferro serico", "ferro sérico", "transferrina"],
  perfilHemolise: ["perfil hemolise", "perfil hemólise", "ldh", "haptoglobina", "reticulocitos", "reticulócitos"],
  coombsDireto: ["coombs", "coombs direto", "teste de antiglobulina"],
  esfregacoPeriferico: ["esfregaco", "esfregaço", "lamina periferica", "lâmina periférica"],
  culturas: ["cultura", "culturas"],
  hemoculturas: ["hemocultura", "hemoculturas"],
  baciloscopiaEscarro: ["baar", "baciloscopia", "baciloscopia de escarro", "escarro"],
  vitaminas: ["vitamina b12", "b12", "acido folico", "ácido fólico", "folato"],
  mielograma: ["mielograma", "imunofenotipagem"],
  eletroforeseHemoglobina: ["eletroforese de hemoglobina", "eletroforese hb"],
  controleGlicemico: ["glicemia", "hemoglobina glicada", "hba1c", "cetonemia", "cetonuria"],
  autoimunidade: ["fan", "anti-dna", "complemento", "c3", "c4"]
};

const mapaExamesComplementares: { [key: string]: { grupo: string; sinonimos: string[] } } = {
  oximetria: { grupo: "beiraLeito", sinonimos: ["oximetria", "saturacao", "saturação", "spo2", "saturacao de oxigenio", "saturação de oxigênio"] },
  picoFluxo: { grupo: "beiraLeito", sinonimos: ["pico de fluxo", "peak flow", "pfe", "pef"] },
  radiografiaTorax: { grupo: "imagem", sinonimos: ["raio x de torax", "raio-x de torax", "rx torax", "rx de torax", "radiografia de torax", "radiografia torax"] },
  ecg: { grupo: "cardiologicos", sinonimos: ["ecg", "eletrocardiograma"] },
  ecocardiograma: { grupo: "cardiologicos", sinonimos: ["ecocardiograma", "eco", "ecocardiografia"] },
  espirometria: { grupo: "funcaoPulmonar", sinonimos: ["espirometria", "prova de funcao pulmonar", "prova de função pulmonar"] },
  baciloscopia: { grupo: "microbiologia", sinonimos: ["baciloscopia", "baar", "escarro"] },
  avaliacaoDesenvolvimento: { grupo: "desenvolvimento", sinonimos: ["avaliacao do desenvolvimento", "avaliação do desenvolvimento", "marcos do desenvolvimento", "denver"] }
};

function buscarExameNoCasoV2(caso: any, exameSolicitado: string) {
  const termo = normalizarTexto(exameSolicitado);

  // 1. Buscar nos laboratoriais
  const laboratoriais = caso?.exames?.laboratoriais;

  for (const [campo, sinonimos] of Object.entries(mapaExamesLaboratoriais)) {
    const sinonimosNormalizados = sinonimos.map(normalizarTexto);
    const encontrou = sinonimosNormalizados.some((sinonimo) => termo.includes(sinonimo) || sinonimo.includes(termo));

    if (encontrou && laboratoriais?.[campo]) {
      const exame = laboratoriais[campo];

      // Gerar string de resultado formatada
      const resultadoFormatado = gerarResultadoFormatado(campo, exame);

      return {
        encontrado: true,
        tipo: "laboratorial",
        grupo: "laboratoriais",
        campo,
        resultado: resultadoFormatado,
        valores: exame?.valores,
        interpretacao: exame?.interpretacao,
        prioridade: exame?.prioridade,
        observacao: exame?.observacao,
        valoresReferenciaPediatricos: exame?.valoresReferenciaPediatricos,
        exameCompleto: exame,
      };
    }
  }

  // 2. Buscar nos complementares estruturados
  for (const [campo, config] of Object.entries(mapaExamesComplementares)) {
    const sinonimosNormalizados = config.sinonimos.map(normalizarTexto);
    const encontrou = sinonimosNormalizados.some((sinonimo) => termo.includes(sinonimo) || sinonimo.includes(termo));

    const grupo = config.grupo;
    const exame = caso?.exames?.[grupo]?.[campo];

    if (encontrou && exame) {
      const resultadoFormatado = gerarResultadoFormatado(campo, exame);

      return {
        encontrado: true,
        tipo: "complementar",
        grupo,
        campo,
        resultado: resultadoFormatado,
        valores: exame?.valores,
        interpretacao: exame?.interpretacao,
        prioridade: exame?.prioridade,
        observacao: exame?.observacao,
        valoresReferenciaPediatricos: exame?.valoresReferenciaPediatricos,
        exameCompleto: exame,
      };
    }
  }

  // 3. Buscar em complementaresOriginais (nome antigo) ou
  //    complementaresDisponiveisOriginais (nome atual nos casos V2)
  const usouCampoAntigo = caso?.exames?.complementaresOriginais != null;
  const originais = usouCampoAntigo
    ? caso?.exames?.complementaresOriginais
    : caso?.exames?.complementaresDisponiveisOriginais;
  const grupoOrigem = usouCampoAntigo
    ? "complementaresOriginais"
    : "complementaresDisponiveisOriginais";

  const montarRetornoOriginal = (item: any) => ({
    encontrado: true,
    tipo: "complementarOriginal",
    grupo: grupoOrigem,
    campo: item?.nome || "exame",
    resultado: gerarResultadoFormatado(item?.nome || "exame", item),
    valores: item?.valores,
    interpretacao: item?.interpretacao,
    prioridade: item?.prioridade,
    observacao: item?.observacao,
    valoresReferenciaPediatricos: item?.valoresReferenciaPediatricos,
    exameCompleto: item,
  });

  if (Array.isArray(originais)) {
    // 3a. ECG por contexto (repouso × esforço), com sinônimos canônicos.
    // Evita cair na IA quando o caso possui o laudo estruturado do ECG.
    const solicitacaoECG = canonizarECG(termo);
    if (solicitacaoECG.isECG) {
      const itensECG = originais
        .map((item: any) => ({ item, canon: canonizarECG(normalizarTexto(item?.nome || item?.exame || item?.titulo || item?.tipo || "")) }))
        .filter((x: any) => x.canon.isECG);

      if (itensECG.length > 0) {
        // Contexto explícito NÃO admite substituição pelo outro contexto:
        // se o item pedido não existir, retorna estado DEFINITIVO (reconhecido +
        // indisponível). O POST reconhece esse estado e NÃO aciona a IA.
        if (solicitacaoECG.contexto === "esforco") {
          const e = itensECG.find((x: any) => x.canon.contexto === "esforco");
          if (e) return montarRetornoOriginal(e.item);
          const mensagem = "ECG sob esforço não disponível neste caso.";
          // resultado espelha a mensagem: a interface exibe apenas data.resultado.
          return {
            encontrado: false,
            indisponivel: true,
            reconhecido: true,
            campo: "ECG sob esforço",
            campoSolicitado: "ECG sob esforço",
            resultado: mensagem,
            mensagem,
          };
        }
        if (solicitacaoECG.contexto === "repouso") {
          const r = itensECG.find((x: any) => x.canon.contexto === "repouso");
          if (r) return montarRetornoOriginal(r.item);
          const mensagem = "ECG em repouso não disponível neste caso.";
          // resultado espelha a mensagem: a interface exibe apenas data.resultado.
          return {
            encontrado: false,
            indisponivel: true,
            reconhecido: true,
            campo: "ECG em repouso",
            campoSolicitado: "ECG em repouso",
            resultado: mensagem,
            mensagem,
          };
        }
        // Genérico: preferir repouso; na ausência, usar o primeiro ECG disponível.
        const g = itensECG.find((x: any) => x.canon.contexto === "repouso") ?? itensECG[0];
        return montarRetornoOriginal(g.item);
      }
      // Nenhum item de ECG neste caso: segue para o fluxo genérico abaixo
      // (o laudo pode estar cadastrado sob outro nome de exame).
    }

    // 3b. Correspondência genérica por nome (demais exames).
    for (const item of originais) {
      const nome = normalizarTexto(item?.nome || item?.exame || item?.titulo || item?.tipo || "");
      if (nome && (termo.includes(nome) || nome.includes(termo))) {
        return montarRetornoOriginal(item);
      }
    }
  }

  return {
    encontrado: false,
    mensagem: "Exame não disponível neste caso.",
  };
}

// ===== FIM MAPEADOR V2 =====

function processoFallback(
  exameSolicitado: string,
  caso: any,
  examesTexto: string
): string {
  const lower = exameSolicitado.toLowerCase();
  const diagnostico = caso.dados_ocultos_do_sistema?.diagnostico_principal?.toLowerCase() || "";

  // Mapeamento contextual: palavras-chave → funções que geram resposta baseada no diagnóstico
  // Permite qualquer exame, mas adaptando a resposta ao caso
  const mapeamentoContextual: { [key: string]: (diagnostico: string) => string } = {
    "ecg|eletrocardiograma": (diag) => {
      if (diag.includes("infarto") || diag.includes("iam") || diag.includes("agudo do miocárdio"))
        return "Ok, eletrocardiograma solicitado: ritmo sinusal regular, frequência cardíaca 98 bpm, elevação de segmento ST em DII/DIII/aVF com inversão de onda T, compatível com síndrome coronária aguda inferior.";
      if (diag.includes("arritmia") || diag.includes("fibrilação"))
        return "Ok, eletrocardiograma solicitado: ritmo irregular, frequência cardíaca 115 bpm, com complexos QRS estreitos, compatível com fibrilação atrial.";
      if (diag.includes("pulmonar") || diag.includes("trombo"))
        return "Ok, eletrocardiograma solicitado: taquicardia sinusal, padrão S1Q3T3 inconstante, sem alterações isquêmicas agudas.";
      return "Ok, eletrocardiograma solicitado: achados compatíveis com o caso clínico.";
    },
    "radiografia|raio|tórax": (diag) => {
      if (diag.includes("pneumonia"))
        return "Ok, radiografia de tórax solicitada: opacidade em região de base direita, consolidação lobar inferior com broncograma aéreo, compatível com pneumonia.";
      if (diag.includes("tuberculose") || diag.includes("tb"))
        return "Ok, radiografia de tórax solicitada: infiltração em região apical-posterior direita com possível escavação, compatível com TB pulmonar ativa.";
      if (diag.includes("asma") || diag.includes("dpoc") || diag.includes("obstrução"))
        return "Ok, radiografia de tórax solicitada: hiperinsuflação pulmonar, tórax em tonel, seios costofrênicos angulados, compatível com doença obstrutiva crônica.";
      if (diag.includes("insuficiência cardíaca"))
        return "Ok, radiografia de tórax solicitada: cardiomegalia, edema pulmonar intersticial bilateral, possível derrame pleural mínimo.";
      if (diag.includes("derrame") || diag.includes("pneumotórax"))
        return "Ok, radiografia de tórax solicitada: presença de derrame pleural direito volumoso, ou colapso pulmonar compatível com pneumotórax.";
      return "Ok, radiografia de tórax solicitada: achados compatíveis com o processo clínico em investigação.";
    },
    "hemograma": (diag) => {
      if (diag.includes("infecção") || diag.includes("pneumonia") || diag.includes("sepse"))
        return "Ok, hemograma solicitado: leucocitose moderada (12.800/μL) com desvio à esquerda, hemoglobina 13.5 g/dL, plaquetas normais.";
      if (diag.includes("anemia"))
        return "Ok, hemograma solicitado: hemoglobina 7.8 g/dL, hematócrito 23%, VCM 75 fL, compatível com anemia microcítica.";
      return "Ok, hemograma solicitado: valores dentro dos limites normais ou compatíveis com o quadro clínico.";
    },
    "troponina|troponina i|troponina t": (diag) => {
      if (diag.includes("infarto") || diag.includes("iam") || diag.includes("síndrome coronária"))
        return "Ok, troponina I solicitada: elevada em 1.8 ng/mL (limite <0.04), compatível com necrose miocárdica.";
      if (diag.includes("miocardite") || diag.includes("pericardite"))
        return "Ok, troponina I solicitada: discretamente elevada em 0.12 ng/mL, compatível com lesão miocárdica.";
      return "Ok, troponina solicitada: dentro dos limites da normalidade (<0.04 ng/mL).";
    },
    "bnp|proBNP": (diag) => {
      if (diag.includes("insuficiência cardíaca"))
        return "Ok, BNP solicitado: elevado em 480 pg/mL (limite <100), compatível com descompensação cardíaca aguda.";
      if (diag.includes("dispneia"))
        return "Ok, BNP solicitado: compatível com o diagnóstico em investigação, resultado dentro do esperado.";
      return "Ok, BNP solicitado: dentro dos limites normais.";
    },
    "gasometria|gas|arterial": (diag) => {
      if (diag.includes("asma") || diag.includes("dpoc"))
        return "Ok, gasometria arterial solicitada: pH 7.32, PaCO₂ 58 mmHg, PaO₂ 62 mmHg, HCO₃⁻ 29, compatível com acidose respiratória.";
      if (diag.includes("pneumonia") || diag.includes("sepse"))
        return "Ok, gasometria arterial solicitada: pH 7.40, PaCO₂ 35 mmHg, PaO₂ 78 mmHg, HCO₃⁻ 22, compatível com hipoxemia leve.";
      if (diag.includes("insuficiência cardíaca"))
        return "Ok, gasometria arterial solicitada: pH 7.44, PaCO₂ 32 mmHg, PaO₂ 85 mmHg, HCO₃⁻ 23, compatível com quadro pulmonar.";
      return "Ok, gasometria arterial solicitada: valores compatíveis com o caso clínico.";
    },
    "ecocardiograma|eco": (diag) => {
      if (diag.includes("insuficiência cardíaca"))
        return "Ok, ecocardiograma solicitado: ventrículo esquerdo dilatado (FEVE 38%), hipocinesia difusa, insuficiência mitral funcional, pressão sistólica do VD elevada.";
      if (diag.includes("endocardite"))
        return "Ok, ecocardiograma solicitado: vegetação em válvula mitral com regurgitação importante, sugestivo de endocardite infecciosa.";
      if (diag.includes("pericardite"))
        return "Ok, ecocardiograma solicitado: derrame pericárdio pequeno a moderado, sem sinais de tamponamento.";
      if (diag.includes("infarto"))
        return "Ok, ecocardiograma solicitado: acinesia de parede inferior, compatível com sequela de infarto do miocárdio.";
      return "Ok, ecocardiograma solicitado: achados compatíveis com o diagnóstico em investigação.";
    },
    "baciloscopia|tb|tuberculose|baar": (diag) => {
      if (diag.includes("tuberculose") || diag.includes("tb"))
        return "Ok, baciloscopia solicitada: POSITIVA para BAAR (1+), confirmando TB pulmonar ativa.";
      return "Ok, baciloscopia solicitada: resultado conforme o caso clínico.";
    },
    "pcr|proteína c reativa": (diag) => {
      if (diag.includes("infecção") || diag.includes("pneumonia") || diag.includes("inflamação"))
        return "Ok, PCR solicitada: elevada em 9.2 mg/dL (limite <0.5), compatível com inflamação/infecção ativa.";
      if (diag.includes("sepse"))
        return "Ok, PCR solicitada: muito elevada em 18.5 mg/dL, compatível com resposta inflamatória sistêmica.";
      return "Ok, PCR solicitada: normal ou compatível com o quadro.";
    },
    "função renal|creatinina|ureia": (diag) => {
      if (diag.includes("insuficiência renal"))
        return "Ok, função renal solicitada: creatinina 2.8 mg/dL, ureia 92 mg/dL, compatível com insuficiência renal aguda.";
      return "Ok, função renal solicitada: creatinina 1.0 mg/dL, ureia 38 mg/dL, dentro dos limites normais.";
    },
    "eletrólitos|sódio|potássio": (diag) => {
      if (diag.includes("insuficiência renal") || diag.includes("desidratação"))
        return "Ok, eletrólitos solicitados: sódio 132 mEq/L (hiponatremia), potássio 5.8 mEq/L (hiperkalemia), compatível com disfunção renal.";
      return "Ok, eletrólitos solicitados: sódio 138 mEq/L, potássio 4.0 mEq/L, dentro dos limites normais.";
    },
    "d-dímero": (diag) => {
      if (diag.includes("trombo") || diag.includes("embolia") || diag.includes("pulmonar"))
        return "Ok, D-dímero solicitado: elevado em 850 ng/mL (limite <250), compatível com ativação da cascata de coagulação.";
      return "Ok, D-dímero solicitado: compatível com o caso clínico.";
    },
  };

  for (const [palavras, gerador] of Object.entries(mapeamentoContextual)) {
    const regex = new RegExp(palavras, "i");
    if (regex.test(lower)) {
      return gerador(diagnostico);
    }
  }

  return "Ok, este exame foi solicitado. Resultado: achados compatíveis com o caso clínico em investigação.";
}
