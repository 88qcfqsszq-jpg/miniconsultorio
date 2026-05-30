import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { Caso } from "@/lib/types";

interface RequestBody {
  sistema: string;
  dificuldade: "fácil" | "intermediário" | "difícil";
  foco: string;
  modo: "treino" | "prova";
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { sistema, dificuldade, foco, modo } = body;

    if (!sistema || !dificuldade || !foco) {
      return NextResponse.json(
        { erro: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const prompt = `Você é um professor de medicina criando um novo caso clínico OSCE para estudantes do 3º semestre.

REQUISITOS DO CASO:
- Sistema: ${sistema}
- Dificuldade: ${dificuldade}
- Foco: ${foco}
- Modo: ${modo === "prova" ? "Avaliação real" : "Treinamento"}

IMPORTANTE: Gere um caso NOVO e ORIGINAL, não copie casos conhecidos.

Retorne em JSON VÁLIDO (sem markdown) com EXATAMENTE esta estrutura:

{
  "id": "gerado_TIMESTAMP",
  "titulo": "Título descritivo do caso",
  "sistema": "${sistema}",
  "tema": "Tema específico",
  "nivel": "${dificuldade === "fácil" ? "iniciante" : dificuldade === "intermediário" ? "intermediario" : "avancado"}",
  "tipo_estacao": "integrada",
  "tempo_osce_minutos": ${dificuldade === "fácil" ? 10 : dificuldade === "intermediário" ? 15 : 20},
  "objetivo_pedagogico": "Objetivo pedagógico claro",
  "descricaoBreve": "Descrição breve do caso",
  "categoria": "Categoria clínica",
  "paciente": {
    "id": "pac_gerado",
    "nome": "Nome do paciente",
    "idade": 45,
    "sexo": "M",
    "queixaPrincipal": "Queixa principal do paciente",
    "historicoDoenca": "Histórico conciso da doença",
    "antecedentes": ["Antecedente 1", "Antecedente 2"],
    "profissao": "Profissão (opcional)",
    "estado_civil": "Estado civil (opcional)",
    "alergias": [],
    "medicamentos_em_uso": ["Medicação 1"]
  },
  "dados_visiveis_ao_estudante": {
    "nome_paciente": "Nome",
    "idade": 45,
    "sexo": "Masculino",
    "queixa_principal": "Queixa",
    "historia_breve": "Breve"
  },
  "dados_ocultos_do_sistema": {
    "diagnostico_principal": "Diagnóstico esperado",
    "diagnosticos_diferenciais": ["Diferencial 1", "Diferencial 2", "Diferencial 3"],
    "sindromes_associadas": ["Síndrome 1"]
  },
  "respostas_do_paciente": {
    "inicial": "Resposta inicial",
    "sintoma1": "Resposta sobre sintoma",
    "historico": "Resposta sobre histórico",
    "duracao": "Resposta sobre duração",
    "medicacoes": "Resposta sobre medicações"
  },
  "sinais_vitais": {
    "corretos": {
      "pressaoArterial": "120/80 mmHg",
      "frequenciaCardiaca": 75,
      "frequenciaRespiratoria": 16,
      "temperatura": 36.8,
      "saturacaoOxigenio": 98
    }
  },
  "sinaisVitaisCorretos": {
    "pressaoArterial": "120/80 mmHg",
    "frequenciaCardiaca": 75,
    "frequenciaRespiratoria": 16,
    "temperatura": 36.8,
    "saturacaoOxigenio": 98
  },
  "exame_fisico": {
    "correto": {
      "inspecao": "Descrição da inspeção",
      "palpacao": "Descrição da palpação",
      "ausculta": "Descrição da ausculta",
      "percussao": "Descrição da percussão",
      "observacoes": "Observações relevantes"
    }
  },
  "exameFisicoCorreto": {
    "inspecao": "Descrição",
    "palpacao": "Descrição",
    "ausculta": "Descrição",
    "percussao": "Descrição",
    "observacoes": "Descrição"
  },
  "exames_complementares_disponiveis": [
    {
      "nome": "Exame 1",
      "descricao": "Descrição",
      "resultado": "Resultado esperado"
    },
    {
      "nome": "Exame 2",
      "descricao": "Descrição",
      "resultado": "Resultado esperado"
    }
  ],
  "hipoteses_diagnosticas_esperadas": [
    {
      "diagnostico": "Diagnóstico principal",
      "probabilidade": 90,
      "criterios_minimos": ["Critério 1", "Critério 2"]
    }
  ],
  "diagnosticos_diferenciais": [
    {
      "diagnostico": "Diferencial 1",
      "criterios_exclusao": ["Critério 1"],
      "achados_que_descartam": ["Achado 1"]
    }
  ],
  "examesIndicados": ["Exame 1", "Exame 2"],
  "conduta_esperada": {
    "imediata": ["Ação 1", "Ação 2"],
    "curto_prazo": ["Ação 1"],
    "longo_prazo": ["Ação 1"],
    "encaminhamentos": ["Especialidade 1"]
  },
  "condutaCorreta": "Descrição da conduta",
  "criterios_de_gravidade": [
    {
      "severidade": "grave",
      "sinais": ["Sinal 1"],
      "descricao": "Descrição",
      "recomendacao": "Recomendação"
    }
  ],
  "erros_criticos": [
    {
      "erro": "Erro crítico",
      "descricao": "Descrição do erro",
      "penalidade": 20,
      "evitavel": true
    }
  ],
  "checklist_osce": [
    {
      "item": "Item do checklist",
      "realizado": false,
      "critico": true
    }
  ],
  "rubrica_correcao": [
    {
      "criterio": "Anamnese",
      "peso": 2,
      "descricao": "Descrição",
      "pontuacao_maxima": 10
    }
  ],
  "modelo_soap": {
    "subjetivo": {
      "secao": "S",
      "componentes_obrigatorios": ["Componente 1"]
    },
    "objetivo": {
      "secao": "O",
      "componentes_obrigatorios": ["Componente 1"]
    },
    "avaliacao": {
      "secao": "A",
      "componentes_obrigatorios": ["Componente 1"]
    },
    "plano": {
      "secao": "P",
      "componentes_obrigatorios": ["Componente 1"]
    }
  },
  "feedback_modelo": {
    "acertos_esperados": ["Acerto 1"],
    "erros_comuns": ["Erro comum 1"],
    "orientacoes_pedagogicas": ["Orientação 1"]
  },
  "diagnosticoCorreto": "Diagnóstico esperado",
  "checklist_oculto_examinador": {
    "oQueProfessorQuer": "O que o professor quer neste caso",
    "comunicacao": ["Item 1"],
    "anamnese": ["Item 1"],
    "exame_fisico": ["Item 1"],
    "exames_complementares": ["Item 1"],
    "raciocinio": ["Item 1"],
    "conduta": ["Item 1"],
    "soap": ["Item 1"]
  }
}

REGRAS CRÍTICAS:
1. Gere um caso ORIGINAL, não copiado
2. O diagnóstico deve ser apropriado para ${dificuldade}
3. Todos os campos devem ser preenchidos
4. Diagnósticos diferenciais devem ser clinicamente relevantes
5. Erros críticos devem ser realistas
6. JSON DEVE SER VÁLIDO - teste antes de retornar
7. Mantenha consistência entre todos os campos
8. Sinais vitais devem ser consistentes com o diagnóstico
9. Achados físicos devem suportar o diagnóstico
10. O checklist deve refletir o que é importante para este caso específico

Retorne APENAS o JSON, sem explicações ou markdown.`;

    let casoGerado: Caso | null = null;

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em OSCE gerando casos clínicos. Retorne APENAS JSON válido, sem markdown.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 3000,
        });

        const resposta = response.choices[0]?.message?.content || null;
        if (resposta) {
          try {
            casoGerado = JSON.parse(resposta);
          } catch (e) {
            console.error("Erro ao parsear caso gerado:", e);
            return NextResponse.json(
              {
                erro: "Erro ao gerar caso. A IA retornou JSON inválido.",
              },
              { status: 500 }
            );
          }
        }
      } catch (error) {
        console.error("Erro ao chamar OpenAI:", error);
        return NextResponse.json(
          {
            erro: "Erro ao gerar caso com IA. Tente novamente.",
          },
          { status: 500 }
        );
      }
    }

    if (!casoGerado) {
      return NextResponse.json(
        {
          erro: "Não foi possível gerar o caso. Configure OPENAI_API_KEY.",
        },
        { status: 500 }
      );
    }

    // Validações básicas
    if (
      !casoGerado.id ||
      !casoGerado.titulo ||
      !casoGerado.paciente ||
      !casoGerado.dados_ocultos_do_sistema
    ) {
      return NextResponse.json(
        {
          erro: "Caso gerado incompleto. Campos obrigatórios faltando.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ caso: casoGerado });
  } catch (error) {
    console.error("Erro na API gerar-caso:", error);
    return NextResponse.json(
      {
        erro: "Erro ao processar a requisição",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
