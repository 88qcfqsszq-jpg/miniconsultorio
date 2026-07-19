/**
 * MEDIX PATIENT V3 — Patient Context Builder (FASE 1).
 *
 * Função PURA e determinística — sem rede, sem OpenAI, sem React, sem histórico,
 * sem estado dinâmico. Recebe SOMENTE a Zona do Paciente (PatientZoneInput) e
 * produz um PatientSafeContext reconstruído campo a campo (projeção por
 * whitelist), validando a integridade objetiva do conteúdo.
 *
 * Fronteira de segurança REAL = a projeção explícita por whitelist abaixo. Como
 * o TypeScript tem tipagem estrutural, um objeto com propriedades extras (ex.:
 * clinicalTruth/examiner injetados) ainda é atribuível a PatientZoneInput — por
 * isso o Builder NUNCA espalha (`...input`) nem serializa o objeto de entrada:
 * ele lê apenas os campos autorizados e descarta qualquer propriedade adicional.
 *
 * O Builder NÃO: consulta ClinicalTruth/Examiner; recebe histórico/mensagem;
 * interpreta ou classifica perguntas; detecta empatia/rapport; seleciona fatos
 * por turno; atualiza Session State; gera texto; chama OpenAI; importa casos;
 * conhece diagnósticos ou especialidades.
 */

import type {
  PatientZoneInput,
  PatientSafeContext,
  FatoPaciente,
  RegraRevelacao,
  DominioFato,
  PoliticaRevelacao,
  Interlocutor,
  Identidade,
  Persona,
  SessionStateInicial,
  PatientKnowledge,
} from "@/lib/patient-v3/casoV3.types";

const POLITICAS_VALIDAS: readonly PoliticaRevelacao[] = [
  "espontanea",
  "perguntaAberta",
  "perguntaDireta",
  "sensivel",
];

const DOMINIOS_VALIDOS: readonly DominioFato[] = [
  "historiaAtual",
  "sintoma",
  "antecedente",
  "medicamento",
  "alergia",
  "habito",
  "familia",
  "contextoSocial",
  "preocupacao",
  "objetivo",
];

const INTERLOCUTORES_VALIDOS: readonly Interlocutor[] = ["paciente", "responsavel"];

/** Erro determinístico comum (sem classe personalizada nesta fase). */
function falhar(mensagem: string): never {
  throw new Error(`[patient-v3] ${mensagem}`);
}

/** Valida número finito no intervalo [0, 10] (sem clamp, sem correção silenciosa). */
function validarNumero0a10(valor: unknown, campo: string): number {
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0 || valor > 10) {
    falhar(`Valor inválido em "${campo}": esperado número finito entre 0 e 10, recebido ${String(valor)}.`);
  }
  return valor;
}

/**
 * Projeta e valida a Zona do Paciente, devolvendo um PatientSafeContext novo.
 * Nenhuma referência do input é reaproveitada; o input não é mutado.
 */
export function construirPatientSafeContext(input: PatientZoneInput): PatientSafeContext {
  const pk = input.patientKnowledge;
  const dp = input.disclosurePolicy;
  const persona = input.persona;
  const sessionStateInicial = input.sessionStateInicial;

  // --- Fatos: id não vazio, id único, domínio válido; reconstrução individual ---
  const idsVistos = new Set<string>();
  const fatosProjetados: FatoPaciente[] = pk.fatos.map((f) => {
    if (typeof f.id !== "string" || f.id.trim().length === 0) {
      falhar(`FatoPaciente com id vazio ou ausente.`);
    }
    if (idsVistos.has(f.id)) {
      falhar(`FatoPaciente.id duplicado: "${f.id}".`);
    }
    idsVistos.add(f.id);
    if (!DOMINIOS_VALIDOS.includes(f.dominio)) {
      falhar(`DominioFato inválido no fato "${f.id}": "${String(f.dominio)}".`);
    }
    const projetado: FatoPaciente = { id: f.id, dominio: f.dominio, valor: f.valor };
    if (typeof f.incerto === "boolean") projetado.incerto = f.incerto;
    return projetado;
  });

  // --- Regras: factId existente, sem duas regras para o mesmo factId, política válida ---
  const factIdsComRegra = new Set<string>();
  const regrasProjetadas: RegraRevelacao[] = dp.regras.map((r) => {
    if (!idsVistos.has(r.factId)) {
      falhar(`RegraRevelacao referencia factId inexistente: "${r.factId}".`);
    }
    if (factIdsComRegra.has(r.factId)) {
      falhar(`Mais de uma RegraRevelacao para o mesmo factId: "${r.factId}".`);
    }
    factIdsComRegra.add(r.factId);
    if (!POLITICAS_VALIDAS.includes(r.politica)) {
      falhar(`PoliticaRevelacao inválida na regra do factId "${r.factId}": "${String(r.politica)}".`);
    }
    return { factId: r.factId, politica: r.politica };
  });

  // --- aberturaFactIds: existente e sem duplicatas; ordem preservada ---
  const aberturaVista = new Set<string>();
  const aberturaProjetada: string[] = dp.aberturaFactIds.map((fid) => {
    if (!idsVistos.has(fid)) {
      falhar(`aberturaFactIds referencia factId inexistente: "${fid}".`);
    }
    if (aberturaVista.has(fid)) {
      falhar(`aberturaFactIds contém id duplicado: "${fid}".`);
    }
    aberturaVista.add(fid);
    return fid;
  });

  // --- Persona: números finitos 0–10 ---
  const personaProjetada: Persona = {
    expansividade: validarNumero0a10(persona.expansividade, "persona.expansividade"),
    objetividade: validarNumero0a10(persona.objetividade, "persona.objetividade"),
    letramentoSaude: persona.letramentoSaude,
  };

  // --- SessionStateInicial: cinco dimensões, números finitos 0–10 ---
  const sessionProjetado: SessionStateInicial = {
    ansiedade: validarNumero0a10(sessionStateInicial.ansiedade, "sessionStateInicial.ansiedade"),
    medo: validarNumero0a10(sessionStateInicial.medo, "sessionStateInicial.medo"),
    confianca: validarNumero0a10(sessionStateInicial.confianca, "sessionStateInicial.confianca"),
    cooperacao: validarNumero0a10(sessionStateInicial.cooperacao, "sessionStateInicial.cooperacao"),
    frustracao: validarNumero0a10(sessionStateInicial.frustracao, "sessionStateInicial.frustracao"),
  };

  // --- Interlocutor e responsável ---
  if (!INTERLOCUTORES_VALIDOS.includes(pk.interlocutor)) {
    falhar(`Interlocutor inválido: "${String(pk.interlocutor)}".`);
  }
  if (pk.interlocutor === "responsavel" && !pk.responsavel) {
    falhar(`interlocutor "responsavel" exige o objeto responsavel.`);
  }

  const identidadeProjetada: Identidade = {
    nome: pk.identidade.nome,
    idade: pk.identidade.idade,
    sexo: pk.identidade.sexo,
  };

  const patientKnowledgeProjetado: PatientKnowledge = {
    identidade: identidadeProjetada,
    interlocutor: pk.interlocutor,
    fatos: fatosProjetados,
  };
  if (pk.responsavel) {
    patientKnowledgeProjetado.responsavel = {
      nome: pk.responsavel.nome,
      parentesco: pk.responsavel.parentesco,
    };
  }

  return {
    patientKnowledge: patientKnowledgeProjetado,
    disclosurePolicy: {
      aberturaFactIds: aberturaProjetada,
      regras: regrasProjetadas,
    },
    persona: personaProjetada,
    sessionStateInicial: sessionProjetado,
  };
}
