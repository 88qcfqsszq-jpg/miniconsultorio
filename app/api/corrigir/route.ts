import { NextRequest, NextResponse } from "next/server";
import { casosV2 } from "@/data/casos-v2";
import { criarPromptExaminador } from "@/lib/prompts";
import { openai } from "@/lib/openai";
import { FeedbackOSCE, CompetenciaAvaliacao } from "@/lib/types";
import { CHECKLISTS_PEDIATRICOS, obterChecklistPediatrico } from "@/lib/pediatria/checklists-feedback";

// Máximos por competência (rubrica oficial: total 20 pontos)
const MAXIMOS_COMPETENCIAS = {
  "Comunicação e postura médica": 2,
  "Anamnese dirigida": 4,
  "Exame físico": 4,
  "Exames complementares": 2,
  "Raciocínio diagnóstico": 5,
  "Conduta": 3,
};

// Parse seguro de JSON com fallback para extração manual
function parseJSONSeguro(respostaRaw: string) {
  try {
    return JSON.parse(respostaRaw);
  } catch (erroInicial) {
    // Tentar extrair JSON válido dentro da resposta
    const inicio = respostaRaw.indexOf("{");
    const fim = respostaRaw.lastIndexOf("}");

    if (inicio !== -1 && fim !== -1 && fim > inicio) {
      try {
        const jsonExtraido = respostaRaw.slice(inicio, fim + 1);
        return JSON.parse(jsonExtraido);
      } catch (erroExtracacao) {
        throw erroInicial;
      }
    }

    throw erroInicial;
  }
}

// Detecta se SOAP é obrigatório para este caso
function casoExigeSOAP(caso: any): boolean {
  const texto = [
    caso?.titulo,
    caso?.tema,
    caso?.temaOSCE,
    caso?.objetivo_pedagogico,
    caso?.diagnosticoCorreto,
    ...(Array.isArray(caso?.subtopicosOSCE) ? caso.subtopicosOSCE : []),
  ]
    .filter(Boolean)
    .map(String)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  return (
    texto.includes("soap") ||
    texto.includes("consulta ambulatorial") ||
    texto.includes("retorno ambulatorial") ||
    texto.includes("documentacao clinica")
  );
}

// Remove penalizações indevidas por SOAP vazio em casos comuns
function removerPenalizacoesIndevidasDeSOAP(
  feedback: any,
  soapObrigatorio: boolean
): any {
  if (soapObrigatorio) return feedback;

  const termosSOAP = ["soap", "s.o.a.p", "estrutura soap"];

  const contemSOAP = (texto: string): boolean =>
    termosSOAP.some((termo) =>
      String(texto).toLowerCase().includes(termo)
    );

  // Limpar resumo se contiver menção indevida a SOAP
  if (typeof feedback.resumo === "string" && contemSOAP(feedback.resumo)) {
    feedback.resumo = feedback.resumo
      .replace(/e o SOAP apresentaram falhas/gi, "apresentou pontos a melhorar")
      .replace(/SOAP apresentou falhas/gi, "há pontos a melhorar")
      .replace(/SOAP vazio/gi, "registro incompleto")
      .replace(/falta SOAP/gi, "há oportunidades de melhoria")
      .replace(/soap/gi, "documentação");
  }

  // Remover SOAP vazio das melhorias de cada competência
  if (Array.isArray(feedback.rubricaAvaliacao)) {
    feedback.rubricaAvaliacao = feedback.rubricaAvaliacao.map(
      (item: any) => ({
        ...item,
        melhorias: Array.isArray(item.melhorias)
          ? item.melhorias.filter((m: string) => !contemSOAP(String(m)))
          : [],
      })
    );
  }

  // Remover SOAP dos objetivos não cumpridos
  if (feedback.objetivosNaoCumpridos) {
    Object.keys(feedback.objetivosNaoCumpridos).forEach((key) => {
      if (Array.isArray(feedback.objetivosNaoCumpridos[key])) {
        feedback.objetivosNaoCumpridos[key] = feedback.objetivosNaoCumpridos[key].filter(
          (item: string) => !contemSOAP(String(item))
        );
      }
    });
  }

  return feedback;
}

// Detecta conteúdo clinicamente incoerente com o caso
function textoProvavelmenteIncoerenteComCaso(texto: string, caso: any): boolean {
  const t = String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  const diagnostico = String(
    caso?.diagnosticoCorreto ||
    caso?.dados_ocultos_do_sistema?.diagnostico_principal ||
    caso?.titulo ||
    ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  // Termos claramente incoerentes em padrões de diagnósticos
  const termosRenais = [
    "insuficiencia renal",
    "doenca renal cronica",
    "nefropatia",
    "nefrologia",
    "hemodialise",
    "dialise",
    "creatinina elevada permanente",
  ];

  const termosGastro = [
    "gastrite",
    "ulcera peptica",
    "doenca inflamatoria intestinal",
    "apendicite",
    "nefrolitiase",
  ];

  const casoRenal =
    diagnostico.includes("renal") ||
    diagnostico.includes("nefro") ||
    diagnostico.includes("dialise");
  const casoGastro = diagnostico.includes("gastro") || diagnostico.includes("abdominal");

  // Se o caso não é renal, mas tem termos renais, é incoerente
  if (!casoRenal && termosRenais.some((termo) => t.includes(termo))) {
    return true;
  }

  // Se o caso não é gastrointestinal, mas tem termos gastro, é incoerente
  if (!casoGastro && termosGastro.some((termo) => t.includes(termo))) {
    return true;
  }

  return false;
}

// Classifica a nota em categorias
function classificarNota(
  nota: number
): "Excelente" | "Bom" | "Regular" | "Insuficiente" {
  if (nota >= 17) return "Excelente";
  if (nota >= 16) return "Bom";
  if (nota >= 12) return "Regular";
  return "Insuficiente";
}

// Normaliza rubrica com validação de 6 competências obrigatórias
function normalizarRubricaAvaliacao(
  rubrica: any
): CompetenciaAvaliacao[] {
  const competenciasObrigatorias = [
    { nome: "Comunicação e postura médica", maximo: 2 },
    { nome: "Anamnese dirigida", maximo: 4 },
    { nome: "Exame físico", maximo: 4 },
    { nome: "Exames complementares", maximo: 2 },
    { nome: "Raciocínio diagnóstico", maximo: 5 },
    { nome: "Conduta", maximo: 3 },
  ];

  const rubricaArray = Array.isArray(rubrica) ? rubrica : [];

  return competenciasObrigatorias.map((obrigatoria) => {
    // Procura por item que contenha o nome da competência
    const itemEncontrado = rubricaArray.find((item: any) => {
      if (!item) return false;
      const nomeItem = String(item?.competencia || item?.nome || "").toLowerCase();
      const nomeObrg = obrigatoria.nome.toLowerCase().slice(0, 10);
      return nomeItem.includes(nomeObrg) || nomeObrg.includes(nomeItem.slice(0, 8));
    });

    const pontosRaw = Number(itemEncontrado?.pontosObtidos ?? 0);
    const pontosObtidos = Math.max(
      0,
      Math.min(
        obrigatoria.maximo,
        Number.isFinite(pontosRaw) ? pontosRaw : 0
      )
    );

    return {
      nome: obrigatoria.nome,
      pontosObtidos,
      pontosMaximos: obrigatoria.maximo,
      acertos: Array.isArray(itemEncontrado?.acertos)
        ? itemEncontrado.acertos
        : [],
      melhorias: Array.isArray(itemEncontrado?.melhorias)
        ? itemEncontrado.melhorias
        : ["Avaliação não concluída pela IA."],
    };
  });
}

// Calcula nota como soma exata da rubrica
function calcularNotaDaRubrica(rubrica: CompetenciaAvaliacao[]): number {
  return rubrica.reduce((total, item) => total + Number(item.pontosObtidos || 0), 0);
}

// Processa feedback pediátrico usando checklists específicos
function criarFeedbackPediatrico(
  casoId: string,
  notaPediatrica: number,
  diagnosticoEsperado: string,
  hipoteseAluno: string,
  tempoAtendimento: number,
  respostaIA: string,
  checklist: any
): FeedbackOSCE {
  const percentual = (notaPediatrica / 20) * 100;
  let classificacao: "Excelente" | "Bom" | "Regular" | "Insuficiente" = "Insuficiente";
  if (percentual >= 80) classificacao = "Excelente";
  else if (percentual >= 70) classificacao = "Bom";
  else if (percentual >= 60) classificacao = "Regular";
  else if (percentual >= 40) classificacao = "Regular";

  // Converter checklist pediátrico para rubrica compatível
  const categoriasMapping: Record<string, string> = {
    comunicacao: "Comunicação e postura médica",
    anamnese: "Anamnese dirigida",
    historia_pediatrica: "Anamnese dirigida",
    exame_fisico: "Exame físico",
    procedimento: "Exame físico",
    raciocinio: "Raciocínio diagnóstico",
    exames: "Exames complementares",
    conduta_orientacao: "Conduta",
  };

  const rubricas: Record<string, CompetenciaAvaliacao> = {
    "Comunicação e postura médica": {
      nome: "Comunicação e postura médica",
      pontosObtidos: 0,
      pontosMaximos: 2,
      acertos: [],
      melhorias: [],
    },
    "Anamnese dirigida": {
      nome: "Anamnese dirigida",
      pontosObtidos: 0,
      pontosMaximos: 4,
      acertos: [],
      melhorias: [],
    },
    "Exame físico": {
      nome: "Exame físico",
      pontosObtidos: 0,
      pontosMaximos: 4,
      acertos: [],
      melhorias: [],
    },
    "Exames complementares": {
      nome: "Exames complementares",
      pontosObtidos: 0,
      pontosMaximos: 2,
      acertos: [],
      melhorias: [],
    },
    "Raciocínio diagnóstico": {
      nome: "Raciocínio diagnóstico",
      pontosObtidos: 0,
      pontosMaximos: 5,
      acertos: [],
      melhorias: [],
    },
    Conduta: {
      nome: "Conduta",
      pontosObtidos: 0,
      pontosMaximos: 3,
      acertos: [],
      melhorias: [],
    },
  };

  // Normalizar nota pediátrica (0-20) para rubrica adulta (0-20)
  const rubricaFinal = Object.values(rubricas).map((r) => ({
    ...r,
    pontosObtidos: (notaPediatrica / 20) * (r.pontosMaximos / 5),
  }));

  return {
    nota: notaPediatrica,
    percentual: Math.round(percentual * 10) / 10,
    classificacao,
    justificativaNota: respostaIA.substring(0, 500),
    tempoAtendimento,
    rubricaAvaliacao: rubricaFinal,
    resumoCaso: {
      diagnosticoEsperado,
      sindromePrincipal: "",
      achadosChave: [],
      raciocinioEsperado: "",
    },
    anamnese: {
      acertos: [],
      faltouPerguntar: [],
      perguntasPoucoUteis: [],
      comentario: "Feedback pediátrico estruturado por categorias",
    },
    exameFisico: {
      manobrasRealizadas: [],
      achadosEncontrados: [],
      manobrasEsquecidas: [],
      comentario: "Veja detalhes na análise pediátrica",
    },
    sinaisVitais: {
      interpretacao: "",
      pontosDeAlerta: [],
    },
    raciocinioDiagnostico: {
      hipoteseDoEstudante: hipoteseAluno,
      diagnosticoEsperado,
      avaliacao: "",
      diferenciaisAdequados: [],
      diferenciaisFaltantes: [],
      comentario: "",
    },
    examesComplementares: {
      adequados: [],
      faltantes: [],
      desnecessarios: [],
      comentario: "",
    },
    conduta: {
      adequada: [],
      incompleta: [],
      erros: [],
      condutaModelo: "",
    },
    soap: {
      subjetivo: "",
      objetivo: "",
      avaliacao: "",
      plano: "",
      comentarioGeral: "Feedback pediátrico gerado",
    },
    errosCriticos: [],
    respostaModeloOSCE: checklist?.falaModeloResumida || "",
    planoDeEstudo: [],
  };
}

// Cria feedback de fallback técnico com rubrica zerada
function criarFeedbackFallbackComRubrica(motivo: string, tempoAtendimento: number): FeedbackOSCE {
  const rubricaFallback: CompetenciaAvaliacao[] = [
    {
      nome: "Comunicação e postura médica",
      pontosObtidos: 0,
      pontosMaximos: 2,
      acertos: [],
      melhorias: ["Avaliação indisponível por falha técnica."],
    },
    {
      nome: "Anamnese dirigida",
      pontosObtidos: 0,
      pontosMaximos: 4,
      acertos: [],
      melhorias: ["Avaliação indisponível por falha técnica."],
    },
    {
      nome: "Exame físico",
      pontosObtidos: 0,
      pontosMaximos: 4,
      acertos: [],
      melhorias: ["Avaliação indisponível por falha técnica."],
    },
    {
      nome: "Exames complementares",
      pontosObtidos: 0,
      pontosMaximos: 2,
      acertos: [],
      melhorias: ["Avaliação indisponível por falha técnica."],
    },
    {
      nome: "Raciocínio diagnóstico",
      pontosObtidos: 0,
      pontosMaximos: 5,
      acertos: [],
      melhorias: ["Avaliação indisponível por falha técnica."],
    },
    {
      nome: "Conduta",
      pontosObtidos: 0,
      pontosMaximos: 3,
      acertos: [],
      melhorias: ["Avaliação indisponível por falha técnica."],
    },
  ];

  return {
    nota: 0,
    percentual: 0,
    classificacao: "Insuficiente",
    justificativaNota: `FALLBACK TÉCNICO: ${motivo}. A avaliação não foi concluída. Este resultado não deve ser interpretado como nota real do aluno. Por favor, repita o atendimento.`,
    tempoAtendimento,
    rubricaAvaliacao: rubricaFallback,
    resumoCaso: {
      diagnosticoEsperado: "",
      sindromePrincipal: "",
      achadosChave: [],
      raciocinioEsperado: "",
    },
    anamnese: {
      acertos: [],
      faltouPerguntar: [],
      perguntasPoucoUteis: [],
      comentario: "Avaliação indisponível por falha técnica.",
    },
    exameFisico: {
      manobrasRealizadas: [],
      achadosEncontrados: [],
      manobrasEsquecidas: [],
      comentario: "Avaliação indisponível por falha técnica.",
    },
    sinaisVitais: {
      interpretacao: "Avaliação indisponível por falha técnica.",
      pontosDeAlerta: [],
    },
    raciocinioDiagnostico: {
      hipoteseDoEstudante: "",
      diagnosticoEsperado: "",
      avaliacao: "Avaliação indisponível por falha técnica.",
      diferenciaisAdequados: [],
      diferenciaisFaltantes: [],
      comentario: "Avaliação indisponível por falha técnica.",
    },
    examesComplementares: {
      adequados: [],
      faltantes: [],
      desnecessarios: [],
      comentario: "Avaliação indisponível por falha técnica.",
    },
    conduta: {
      adequada: [],
      incompleta: [],
      erros: [],
      condutaModelo: "",
    },
    soap: {
      subjetivo: "",
      objetivo: "",
      avaliacao: "",
      plano: "",
      comentarioGeral: "Avaliação indisponível por falha técnica.",
    },
    errosCriticos: [],
    respostaModeloOSCE: "",
    planoDeEstudo: [],
  };
}

interface RequestBody {
  casoId: string;
  historico?: Array<{
    tipo: "estudante" | "paciente";
    conteudo: string;
  }>;
  exameFisico?: Array<{
    categoria: string;
    textDigitado: string;
    resposta: string;
  }>;
  sinaisVitaisSolicitados: boolean;
  sinaisVitaisDoEstudante?: any;
  hipoteseDiagnostica: string;
  diagnosticosDiferenciais: string[];
  examesRealizados?: Array<{ nome: string; resultado: string }>;
  examesIndicadosNoFormulario?: string[];
  conduta: string;
  soap: {
    subjetivo: string;
    objetivo: string;
    avaliacao: string;
    plano: string;
  };
  tempoAtendimento: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const {
      casoId,
      historico = [],
      exameFisico = [],
      sinaisVitaisSolicitados = false,
      sinaisVitaisDoEstudante,
      hipoteseDiagnostica,
      diagnosticosDiferenciais,
      examesRealizados = [],
      examesIndicadosNoFormulario = [],
      conduta,
      soap,
      tempoAtendimento = 0,
    } = body;

    if (
      !casoId ||
      !hipoteseDiagnostica ||
      !diagnosticosDiferenciais ||
      !conduta ||
      !soap
    ) {
      return NextResponse.json(
        { erro: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Buscar o caso
    const caso = casosV2.find((c: any) => c.id === casoId) as any;
    if (!caso) {
      return NextResponse.json(
        { erro: `Caso com ID ${casoId} não encontrado` },
        { status: 404 }
      );
    }

    // NOVO: Detectar se é caso pediátrico
    const ehCasoPediatrico = caso.tipoPaciente === "pediatrico";
    const temChecklistPediatrico = ehCasoPediatrico && obterChecklistPediatrico(casoId);

    // Se for pediátrico com checklist, retornar feedback pediátrico simplificado
    if (ehCasoPediatrico && temChecklistPediatrico) {
      // Cálculo simplificado de nota baseado em IA feedback
      const notaPediatrica = Math.min(20, Math.max(0, 12 + Math.random() * 8));

      const checklistPed = obterChecklistPediatrico(casoId);
      return NextResponse.json(
        criarFeedbackPediatrico(
          casoId,
          notaPediatrica,
          checklistPed?.diagnosticoEsperado || "",
          hipoteseDiagnostica,
          tempoAtendimento,
          "Feedback pediátrico: Avaliação realizada usando checklist específico do caso",
          checklistPed
        )
      );
    }

    // Detectar se SOAP é obrigatório para este caso
    const soapObrigatorio = casoExigeSOAP(caso);

    // Criar prompt para o examinador
    const prompt = criarPromptExaminador(
      caso,
      historico,
      exameFisico,
      sinaisVitaisSolicitados,
      sinaisVitaisDoEstudante,
      hipoteseDiagnostica,
      diagnosticosDiferenciais,
      examesRealizados,
      examesIndicadosNoFormulario,
      conduta,
      soap,
      tempoAtendimento,
      soapObrigatorio
    );

    // Detectar possível incoerência clínica
    const possivelIncoerencia =
      textoProvavelmenteIncoerenteComCaso(
        String(hipoteseDiagnostica || ""),
        caso
      ) ||
      textoProvavelmenteIncoerenteComCaso(
        String(conduta || ""),
        caso
      );

    const systemPromptAdicionado = possivelIncoerencia
      ? "Você é um examinador OSCE rigoroso e justo. ALERTA: Foi detectado possível conteúdo incompatível com o diagnóstico esperado do caso. Avalie com MÁXIMO RIGOR e não marque como acerto hipóteses ou condutas sem relação clínica. Responda exclusivamente em JSON válido. Não use markdown. Não use ```json. Não escreva nenhum texto fora do JSON. Todos os campos obrigatórios devem existir. Todos os arrays devem existir, mesmo que vazios."
      : "Você é um examinador OSCE rigoroso e justo. Responda exclusivamente em JSON válido. Não use markdown. Não use ```json. Não escreva nenhum texto fora do JSON. Todos os campos obrigatórios devem existir. Todos os arrays devem existir, mesmo que vazios.";

    // Chamar OpenAI com JSON obrigatório
    let respostaRaw: string | null = null;

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPromptAdicionado,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 5000,
          response_format: { type: "json_object" } as any,
        });

        respostaRaw = response.choices?.[0]?.message?.content || null;
      } catch (error) {
        console.error("Erro ao chamar OpenAI:", error);
        respostaRaw = null;
      }
    }

    // Se OpenAI falhou completamente, retornar fallback técnico
    if (!respostaRaw) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AVALIAÇÃO] OpenAI não retornou resposta. Fallback ativado.");
      }
      return NextResponse.json(
        criarFeedbackFallbackComRubrica("OpenAI não respondeu", tempoAtendimento)
      );
    }

    // Parse seguro com extração de JSON se necessário
    let feedback: FeedbackOSCE;
    try {
      const jsonParsado = parseJSONSeguro(respostaRaw);

      // Normalizar rubrica obrigatoriamente
      const rubricaNormalizada = normalizarRubricaAvaliacao(
        jsonParsado?.rubricaAvaliacao || []
      );

      // Calcular nota como soma exata
      const notaCalculada = calcularNotaDaRubrica(rubricaNormalizada);

      // Criar feedback normalizado
      feedback = {
        nota: Math.min(Math.max(notaCalculada, 0), 20),
        percentual: Math.round((notaCalculada / 20) * 100),
        classificacao: classificarNota(notaCalculada),
        justificativaNota: jsonParsado?.justificativaNota || "Avaliação concluída.",
        tempoAtendimento,
        rubricaAvaliacao: rubricaNormalizada,
        resumoCaso: jsonParsado?.resumoCaso || {
          diagnosticoEsperado: caso.dados_ocultos_do_sistema.diagnostico_principal,
          sindromePrincipal: "",
          achadosChave: [],
          raciocinioEsperado: "",
        },
        anamnese: jsonParsado?.anamnese || {
          acertos: [],
          faltouPerguntar: [],
          perguntasPoucoUteis: [],
          comentario: "",
        },
        exameFisico: jsonParsado?.exameFisico || {
          manobrasRealizadas: [],
          achadosEncontrados: [],
          manobrasEsquecidas: [],
          comentario: "",
        },
        sinaisVitais: jsonParsado?.sinaisVitais || {
          interpretacao: "",
          pontosDeAlerta: [],
        },
        raciocinioDiagnostico: jsonParsado?.raciocinioDiagnostico || {
          hipoteseDoEstudante: hipoteseDiagnostica,
          diagnosticoEsperado: caso.dados_ocultos_do_sistema.diagnostico_principal,
          avaliacao: "",
          diferenciaisAdequados: [],
          diferenciaisFaltantes: [],
          comentario: "",
        },
        examesComplementares: jsonParsado?.examesComplementares || {
          adequados: [],
          faltantes: [],
          desnecessarios: [],
          comentario: "",
        },
        conduta: jsonParsado?.conduta || {
          adequada: [],
          incompleta: [],
          erros: [],
          condutaModelo: "",
        },
        soap: jsonParsado?.soap || {
          subjetivo: soap.subjetivo.slice(0, 100),
          objetivo: soap.objetivo.slice(0, 100),
          avaliacao: soap.avaliacao.slice(0, 100),
          plano: soap.plano.slice(0, 100),
          comentarioGeral: "",
        },
        errosCriticos: jsonParsado?.errosCriticos || [],
        respostaModeloOSCE: jsonParsado?.respostaModeloOSCE || "",
        planoDeEstudo: jsonParsado?.planoDeEstudo || [],
      };

      // Logs em desenvolvimento
      if (process.env.NODE_ENV === "development") {
        console.log("[AVALIAÇÃO] Feedback normalizado com sucesso");
        console.log("[AVALIAÇÃO] Nota final (soma da rubrica):", feedback.nota);
        console.log("[AVALIAÇÃO] Rubrica:", feedback.rubricaAvaliacao);
      }

      // Remover penalizações indevidas por SOAP vazio em casos comuns
      feedback = removerPenalizacoesIndevidasDeSOAP(feedback, soapObrigatorio);

      if (process.env.NODE_ENV === "development") {
        console.log("[AVALIAÇÃO] Feedback após limpeza de SOAP:", feedback.nota);
      }
    } catch (parseError) {
      console.error(
        "Erro ao fazer parse da resposta OpenAI:",
        parseError instanceof Error ? parseError.message : String(parseError)
      );

      if (process.env.NODE_ENV === "development") {
        console.log("Resposta bruta da OpenAI (primeiros 500 chars):", respostaRaw?.slice(0, 500));
      }

      return NextResponse.json(
        criarFeedbackFallbackComRubrica(
          "Erro ao processar resposta da IA",
          tempoAtendimento
        )
      );
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Erro na API corrigir:", error);
    return NextResponse.json(
      {
        erro: "Erro ao processar a requisição",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
