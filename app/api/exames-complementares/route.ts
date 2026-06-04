import { NextRequest, NextResponse } from "next/server";
import { casosOSCE } from "@/data/casos-osce";
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

    const caso = casosOSCE.find((c) => c.id === casoId);
    if (!caso) {
      return NextResponse.json(
        { erro: `Caso com ID ${casoId} não encontrado` },
        { status: 404 }
      );
    }

    const examesDisponiveisTexto = caso.exames_complementares_disponiveis
      .map((e) => `- ${e.nome}: ${e.descricao || "N/A"}`)
      .join("\n");

    const prompt = criarPromptAgentExames(
      caso,
      exameSolicitado,
      historico,
      examesDisponiveisTexto
    );

    let resposta: string | null = null;

    if (openai) {
      try {
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
