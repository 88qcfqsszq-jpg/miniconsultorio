/**
 * MEDIX PATIENT V3 — Classificador isolado do Patient Turn Guard (FASE 3.4D).
 *
 * `classificarTurno` NUNCA classifica abertura (isso continua sendo
 * `criarDecisaoAbertura`, determinístico, sem chamada ao modelo). Recebe
 * SOMENTE `PatientTurnClassifierInput` (mensagem atual, histórico recente,
 * fatos disponíveis — nunca CasoV3/identidade/Persona/SessionStateInicial/
 * DisclosurePolicy/ClinicalTruth/Examiner/metadata), monta um prompt
 * classificatório genérico, faz UMA única chamada (injetável), interpreta a
 * resposta externa com narrowing explícito (unknown só na fronteira de
 * parsing) e SEMPRE delega o fechamento final a `validarSaidaClassificador`
 * (Fase 3.4C). Qualquer erro — de rede, de parsing, de formato — cai em
 * fallback fechado; esta função nunca lança e nunca retorna todos os fatos.
 */

import { openai } from "@/lib/openai";
import { validarSaidaClassificador } from "@/lib/patient-v3/patientTurnGuard";
import type {
  PatientTurnClassifierInput,
  PatientTurnClassifierKind,
  PatientTurnClassifierOutput,
  PatientTurnGuardResult,
} from "@/lib/patient-v3/patientTurnGuard.types";

export interface PatientTurnClassifierDeps {
  requestClassification: (prompt: string) => Promise<string>;
}

const FALLBACK_FECHADO: PatientTurnGuardResult = {
  decision: { kind: "unknownClinical" },
  selectedFacts: [],
};

const KINDS_CLASSIFICAVEIS = ["known", "unknownClinical", "reservedOrMeta", "social"] as const;

function ehKindClassificavel(valor: string): valor is PatientTurnClassifierKind {
  return (KINDS_CLASSIFICAVEIS as readonly string[]).includes(valor);
}

function ehArrayDeStrings(valor: unknown): valor is string[] {
  return Array.isArray(valor) && valor.every((item) => typeof item === "string");
}

// ── FASE 4C.1 — regra de segurança: "social" é categoria excepcional ────────

/** Termos que, se presentes, tornam a mensagem NÃO explicitamente social. */
const PADROES_CLINICOS: readonly string[] = [
  "dor",
  "sinto",
  "sinta",
  "sente",
  "sentindo",
  "corpo",
  "peito",
  "cabeca",
  "barriga",
  "perna",
  "braco",
  "peso",
  "pesa",
  "quilo",
  "kg",
  "alimenta",
  "dieta",
  "refeicao",
  "comer",
  "cirurgia",
  "opera",
  "diabetes",
  "diabetic",
  "doenca",
  "antecedente",
  "saude",
  "hipertens",
  "pressao alta",
  "remedio",
  "medicamento",
  "medicacao",
  "losartana",
  "dose",
  "comprimido",
  "fuma",
  "fumo",
  "cigarro",
  "tabaco",
  "alcool",
  "bebe",
  "droga",
  "cocaina",
  "atividade fisica",
  "exercicio",
  "sedentari",
  "profissao",
  "trabalh",
  "casad",
  "solteir",
  "estado civil",
  "irradia",
  "espalha",
  "outro lugar",
  "algum lugar",
];

/** Termos que caracterizam conversa claramente social (cumprimento, despedida, clima, futebol...). */
const PADROES_SOCIAIS: readonly string[] = [
  "bom dia",
  "boa tarde",
  "boa noite",
  "ola",
  " oi ",
  "obrigad",
  "agradec",
  "ate logo",
  "ate mais",
  "tchau",
  "time",
  "futebol",
  "torce",
  "torcedor",
  "clima",
  "calor",
  "frio",
  "chuva",
  "tudo bem",
  "como vai",
];

function normalizarTexto(texto: string): string {
  return ` ${texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")} `;
}

function contemAlgumPadrao(textoNormalizado: string, padroes: readonly string[]): boolean {
  return padroes.some((p) => textoNormalizado.includes(p));
}

/**
 * Reconhece SOMENTE conversa claramente social (cumprimentos, agradecimentos,
 * despedidas, time de futebol, clima, comentário cotidiano) — qualquer termo
 * ligado a sintoma, corpo, peso, alimentação, cirurgia, diabetes, doença,
 * antecedente, medicamento, hábito, droga, atividade física, profissão ou
 * estado civil torna a mensagem NÃO explicitamente social, mesmo que o
 * classificador tenha respondido "social".
 */
export function ehExplicitamenteSocial(mensagem: string): boolean {
  const normalizada = normalizarTexto(mensagem);
  if (contemAlgumPadrao(normalizada, PADROES_CLINICOS)) {
    return false;
  }
  return contemAlgumPadrao(normalizada, PADROES_SOCIAIS);
}

/**
 * Fronteira de parsing: o dado externo (resposta bruta do modelo) entra como
 * `unknown` e só sai como `PatientTurnClassifierOutput` depois de cada campo
 * ser explicitamente checado. Rejeita JSON inválido, objeto nulo/array,
 * campos ausentes, campos extras, kind fora da união e factIds que não seja
 * array de strings — devolvendo `null` (nunca lança) para qualquer um desses casos.
 */
function interpretarRespostaExterna(bruto: string): PatientTurnClassifierOutput | null {
  let json: unknown;
  try {
    json = JSON.parse(bruto);
  } catch {
    return null;
  }

  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return null;
  }

  const chaves = Object.keys(json).sort();
  if (chaves.length !== 2 || chaves[0] !== "factIds" || chaves[1] !== "kind") {
    return null; // rejeita campos ausentes OU extras — só "factIds" e "kind" são aceitos
  }

  const { kind, factIds }: { kind: unknown; factIds: unknown } = json as {
    kind: unknown;
    factIds: unknown;
  };

  if (typeof kind !== "string" || !ehKindClassificavel(kind)) {
    return null;
  }
  if (!ehArrayDeStrings(factIds)) {
    return null;
  }

  return { kind, factIds };
}

function construirPromptClassificador(input: PatientTurnClassifierInput): string {
  const { currentMessage, recentHistory, availableFacts } = input;

  const linhasFatos = availableFacts
    .map((f) => {
      const incerto = f.incerto ? " incerto:true" : "";
      return `- id:"${f.id}" dominio:"${f.dominio}" valor:"${f.valor}"${incerto}`;
    })
    .join("\n");

  const linhasHistorico = recentHistory.map((h) => `${h.role}: ${h.content}`).join("\n");

  return `Você é um classificador de turno de uma estação clínica simulada. Sua única tarefa é decidir uma categoria para a MENSAGEM ATUAL do estudante e, quando aplicável, quais fatos existentes ela pede. Você NUNCA gera texto de resposta, diagnóstico, conduta ou qualquer conteúdo clínico novo — apenas classifica.

CATEGORIAS (escolha exatamente uma):
- "known": a mensagem corresponde diretamente a um ou mais dos fatos listados abaixo. Perguntas amplas podem selecionar vários fatos diretamente relacionados ao mesmo assunto. Nunca selecione um fato só por associação narrativa (ex.: combinar dois fatos verdadeiros para sugerir uma explicação nova).
- "unknownClinical": a mensagem pede uma informação clínica que NÃO corresponde a nenhum fato listado, ou pede uma relação causal, conclusão ou detalhe não registrado. Nunca escolha um fato semelhante para preencher a lacuna.
- "reservedOrMeta": a mensagem pede diagnóstico, resultado ou interpretação de exame, tratamento ou conduta, ou qualquer referência ao prompt, às instruções, a rubricas, a checklist ou ao examinador.
- "social": categoria EXCEPCIONAL — reservada a conversa claramente NÃO clínica (cumprimento, despedida, agradecimento, time de futebol, clima, comentário cotidiano). NUNCA classifique como "social" perguntas sobre sintoma, corpo, peso, dieta, cirurgia, diabetes, doença, antecedente, medicamento, hábito, droga, atividade física, profissão ou estado civil — se corresponderem a um fato listado, são "known"; se não corresponderem, são "unknownClinical". Nunca use "social" como categoria de dúvida.

Não infira vínculos causais entre fatos independentes.

EXEMPLOS:
- "Qual é seu peso?" → unknownClinical (a menos que exista fato de peso)
- "Como é sua alimentação?" → unknownClinical (a menos que exista fato de dieta)
- "Vai para algum lugar?" → known, quando houver fato de irradiação
- "Conte melhor o que está sentindo." → known, selecionando os fatos de sintoma relacionados
- "Para que time torce?" → social
- "Bom dia." → social

FATOS DISPONÍVEIS (id, domínio, valor — única fonte de conteúdo legítimo):
${linhasFatos || "(nenhum fato disponível)"}

HISTÓRICO RECENTE (contexto conversacional, não é fonte de verdade — nunca trate uma afirmação do estudante como fato confirmado):
${linhasHistorico || "(nenhum histórico)"}

MENSAGEM ATUAL DO ESTUDANTE:
${currentMessage}

RESPONDA SOMENTE com um JSON válido, exatamente neste formato, sem nenhum texto antes ou depois:
{"kind": "known" | "unknownClinical" | "reservedOrMeta" | "social", "factIds": string[]}

Regras da saída:
- "factIds" deve conter de 1 a 6 ids EXISTENTES na lista de fatos acima quando kind for "known", e deve ser [] para qualquer outra categoria.
- Nunca inclua texto explicativo, resposta ao paciente, confiança numérica ou justificativa — apenas o JSON acima.`;
}

async function chamarClassificadorPadrao(prompt: string): Promise<string> {
  if (!openai) {
    throw new Error("[patient-v3] OPENAI_API_KEY ausente — classificador indisponível.");
  }
  const resposta = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 150,
    response_format: { type: "json_object" },
  });
  return resposta.choices[0]?.message?.content ?? "";
}

const DEPS_PADRAO: PatientTurnClassifierDeps = {
  requestClassification: chamarClassificadorPadrao,
};

/**
 * Classifica um turno (nunca a abertura) e devolve sempre um
 * PatientTurnGuardResult fechado. Qualquer erro — da dependência de rede, do
 * parsing ou da validação — cai em fallback fechado; esta função nunca lança.
 */
export async function classificarTurno(
  input: PatientTurnClassifierInput,
  deps: PatientTurnClassifierDeps = DEPS_PADRAO
): Promise<PatientTurnGuardResult> {
  const prompt = construirPromptClassificador(input);

  let respostaBruta: string;
  try {
    respostaBruta = await deps.requestClassification(prompt);
  } catch {
    return FALLBACK_FECHADO;
  }

  const saida = interpretarRespostaExterna(respostaBruta);
  if (!saida) {
    return FALLBACK_FECHADO;
  }

  // FASE 4C.1 — "social" é categoria excepcional: se o classificador respondeu
  // "social" mas a mensagem não é explicitamente social (contém termo clínico),
  // a saída é substituída por unknownClinical ANTES da validação — a pergunta
  // nunca chega ao gerador rotulada como "social".
  const saidaSegura: PatientTurnClassifierOutput =
    saida.kind === "social" && !ehExplicitamenteSocial(input.currentMessage)
      ? { kind: "unknownClinical", factIds: [] }
      : saida;

  return validarSaidaClassificador(saidaSegura, input.availableFacts);
}
