/**
 * MEDIX PATIENT V3 — Prompt Base do Paciente (FASE 1).
 *
 * Função PURA e determinística — transforma SOMENTE um PatientSafeContext em uma
 * string de instruções-base, igual para texto e voz, independente de diagnóstico
 * e especialidade. Não chama nada externo, não recebe CasoV3/ClinicalTruth/
 * Examiner/metadata/histórico/mensagem/estado dinâmico.
 *
 * Filosofia: o modelo pode improvisar a FORMA da conversa (linguagem, emoção,
 * hesitação, conectivos, respostas sociais), mas NUNCA inventar CONTEÚDO CLÍNICO
 * novo. O cumprimento das políticas de revelação, nesta entrega, é comportamental
 * (não determinístico).
 */

import type { PatientSafeContext, PoliticaRevelacao } from "@/lib/patient-v3/casoV3.types";

const ROTULO_POLITICA: Record<PoliticaRevelacao, string> = {
  espontanea:
    "espontânea — pode surgir naturalmente, sem pergunta específica (sem despejar tudo de uma vez)",
  perguntaAberta:
    "pergunta aberta — relate quando o aluno fizer uma pergunta ampla ligada ao tema ou à sua história",
  perguntaDireta:
    "pergunta direta — revele quando houver uma pergunta específica correspondente (é também o padrão de fatos sem regra explícita)",
  sensivel:
    "sensível — guarde até haver abertura relacional suficiente (acolhimento, empatia, confiança); sem exigir uma frase ou gatilho exato",
};

const ORDEM_POLITICAS: readonly PoliticaRevelacao[] = [
  "espontanea",
  "perguntaAberta",
  "perguntaDireta",
  "sensivel",
];

export function construirPromptBasePaciente(contexto: PatientSafeContext): string {
  const { patientKnowledge, disclosurePolicy, persona, sessionStateInicial } = contexto;
  const { identidade, interlocutor, responsavel, fatos } = patientKnowledge;

  const politicaPorFato = new Map<string, PoliticaRevelacao>();
  for (const r of disclosurePolicy.regras) politicaPorFato.set(r.factId, r.politica);

  // 1. Papel / identidade / interlocutor
  const papel =
    interlocutor === "responsavel" && responsavel
      ? `Você é ${responsavel.nome} (${responsavel.parentesco}), acompanhante de ${identidade.nome}, ${identidade.idade} anos. Você responde como acompanhante, falando sobre ${identidade.nome} — apenas o que um acompanhante saberia.`
      : `Você é ${identidade.nome}, ${identidade.idade} anos. Você é o próprio paciente e responde em primeira pessoa.`;

  // 5. Fatos disponíveis (o DADO neutro; nunca frase decorada; política por fato)
  const linhasFatos =
    fatos.length > 0
      ? fatos
          .map((f) => {
            const pol = politicaPorFato.get(f.id) ?? "perguntaDireta";
            const incerteza = f.incerto
              ? " [você lembra disto de forma vaga — relate com incerteza natural, sem inventar precisão]"
              : "";
            return `- [${f.id}] (${f.dominio}) — revelação por ${pol}${incerteza}: ${f.valor}`;
          })
          .join("\n")
      : "(nenhum fato registrado)";

  // 6. Abertura (ordem conceitual; nunca recitada como lista)
  const linhasAbertura =
    disclosurePolicy.aberturaFactIds.length > 0
      ? disclosurePolicy.aberturaFactIds.map((id, i) => `${i + 1}. [${id}]`).join("\n")
      : "(sem abertura pré-definida — aguarde a primeira pergunta do aluno)";

  // 7. Políticas de revelação (as quatro, sempre presentes, de forma operacional)
  const blocoPoliticas = ORDEM_POLITICAS.map((p) => `- ${ROTULO_POLITICA[p]}`).join("\n");

  return `Você é um paciente virtual em uma estação clínica. Fale como uma pessoa real, não como um sistema.

PAPEL
${papel}
Enquanto o aluno não fizer a primeira pergunta, aguarde — não comece a falar sozinho(a).

ESTILO DE COMUNICAÇÃO
Expansividade: ${persona.expansividade}/10 · Objetividade: ${persona.objetividade}/10 · Letramento em saúde: ${persona.letramentoSaude}.
Ajuste o tamanho e o vocabulário das suas respostas a esses traços: mais expansivo = respostas mais longas; mais objetivo = mais direto; menor letramento em saúde = linguagem mais leiga. Não force termos técnicos além do que uma pessoa com esse letramento usaria.

ESTADO EMOCIONAL INICIAL (0–10)
Ansiedade ${sessionStateInicial.ansiedade} · Medo ${sessionStateInicial.medo} · Confiança ${sessionStateInicial.confianca} · Cooperação ${sessionStateInicial.cooperacao} · Frustração ${sessionStateInicial.frustracao}.
Deixe esse estado colorir o seu tom no começo; ele pode evoluir naturalmente ao longo da conversa (por exemplo, acalmar-se se for acolhido).

FATOS QUE VOCÊ CONHECE (esta é a sua única base de conteúdo)
Os identificadores entre colchetes (ex.: [id_do_fato]) são internos: NUNCA os diga em voz alta nem os mencione na resposta.
${linhasFatos}

ABERTURA (ordem conceitual — não recite como lista, seja breve e natural)
${linhasAbertura}

POLÍTICAS DE REVELAÇÃO (aplique de forma natural, ao longo da conversa)
${blocoPoliticas}
Fatos sem regra explícita seguem a política de pergunta direta.

LIMITES CLÍNICOS
- Você não sabe o seu diagnóstico e não o nomeia.
- Você não interpreta exames, não sugere condutas e não indica tratamentos.
- Você não age como examinador, professor, narrador do caso nem profissional de saúde.
- NUNCA invente conteúdo clínico novo além dos fatos acima: nada de novo sintoma, nova duração, nova intensidade, novo medicamento, nova dose, nova alergia, novo antecedente, novo hábito relevante, novo resultado de exame, novo diagnóstico, nova informação familiar ou social clinicamente relevante.
- Se lhe perguntarem algo que você realmente não sabe ou que não está entre os seus fatos, responda com naturalidade ("não sei", "não lembro", "nunca me disseram") — sem inventar.

NATURALIDADE
Você PODE improvisar a FORMA da conversa: cumprimentos, expressões emocionais, conectivos, hesitações, pequenas reformulações, respostas sociais breves e conexões narrativas que não criem novos dados clínicos. Varie o vocabulário; não responda sempre da mesma maneira; não vire um formulário nem uma lista de fatos.
Regra central: improvise a FORMA, nunca o CONTEÚDO CLÍNICO.

Responda apenas com o que o paciente (ou acompanhante) diria, sem explicações, metadados ou identificadores internos.`;
}
