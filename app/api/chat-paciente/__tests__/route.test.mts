/**
 * Testes do endpoint app/api/chat-paciente/route.ts (FASE 4B).
 *
 * Testa o handler exportado (`handleChatPaciente`) diretamente, via
 * NextRequest construído em memória — sem subir servidor Next.js. A chamada
 * real à OpenAI é sempre SUBSTITUÍDA por injeção de dependência
 * (`deps.obterRespostaOpenAI`) e a preparação do turno também pode ser
 * substituída (`deps.prepararTurno`) — nenhum teste depende de rede real.
 *
 * GUARD GLOBAL: um `globalThis.fetch` interceptado falha qualquer teste que
 * tente uma chamada de rede real.
 *
 * Runner: npx tsx --test app/api/chat-paciente/__tests__/route.test.mts
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

import { handleChatPaciente } from "@/app/api/chat-paciente/route";
import type { PatientTextTurnResult } from "@/lib/patient-v3/patientTurnText";

// ── Guard global de rede ─────────────────────────────────────────────────
let fetchOriginal: typeof globalThis.fetch;
let fetchFoiChamado = false;
before(() => {
  fetchOriginal = globalThis.fetch;
  globalThis.fetch = async (..._args: Parameters<typeof fetch>): ReturnType<typeof fetch> => {
    fetchFoiChamado = true;
    throw new Error("[GUARD] chamada de rede real detectada durante os testes do endpoint chat-paciente");
  };
});
after(() => {
  globalThis.fetch = fetchOriginal;
  assert.equal(fetchFoiChamado, false, "ao menos uma chamada de rede real foi tentada durante a suíte");
});

function requisicao(bodyObj: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/chat-paciente", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof bodyObj === "string" ? bodyObj : JSON.stringify(bodyObj),
  });
}

// ── 1. Resposta direta não chama OpenAI ─────────────────────────────────────
test("1. resultado 'direct' retorna a resposta sem chamar a OpenAI", async () => {
  let chamadasOpenAI = 0;
  const prepararTurno = async (): Promise<PatientTextTurnResult> => ({
    kind: "direct",
    response: "Não sei dizer isso com certeza.",
    decision: { kind: "unknownClinical" },
  });
  const obterRespostaOpenAI = async () => {
    chamadasOpenAI++;
    return "não deveria ser chamado";
  };

  const res = await handleChatPaciente(
    requisicao({ casoId: "1", mensagem: "Tem diabetes?", historico: [] }),
    { prepararTurno, obterRespostaOpenAI }
  );
  const json = await res.json();

  assert.equal(chamadasOpenAI, 0);
  assert.deepEqual(Object.keys(json), ["resposta"]);
  assert.equal(json.resposta, "Não sei dizer isso com certeza.");
});

// ── 2. generate chama a OpenAI exatamente uma vez ───────────────────────────
test("2. resultado 'generate' chama a OpenAI exatamente uma vez, com o prompt preparado", async () => {
  let chamadasOpenAI = 0;
  let promptRecebido: string | null = null;
  const prepararTurno = async (): Promise<PatientTextTurnResult> => ({
    kind: "generate",
    prompt: "PROMPT_DE_TESTE_XYZ",
  });
  const obterRespostaOpenAI = async (prompt: string) => {
    chamadasOpenAI++;
    promptRecebido = prompt;
    return "Estou com dor no peito, doutor.";
  };

  const res = await handleChatPaciente(
    requisicao({ casoId: "1", mensagem: "Como é essa dor?", historico: [] }),
    { prepararTurno, obterRespostaOpenAI }
  );
  const json = await res.json();

  assert.equal(chamadasOpenAI, 1);
  assert.equal(promptRecebido, "PROMPT_DE_TESTE_XYZ");
  assert.deepEqual(Object.keys(json), ["resposta"]);
  assert.equal(json.resposta, "Estou com dor no peito, doutor.");
});

// ── 3. Formato { resposta } permanece igual em ambos os caminhos ───────────
test("3. formato de resposta é sempre { resposta: string }, em 'direct' e em 'generate'", async () => {
  const casosDeTeste: PatientTextTurnResult[] = [
    { kind: "direct", response: "x", decision: { kind: "reservedOrMeta" } },
    { kind: "generate", prompt: "y" },
  ];
  for (const resultado of casosDeTeste) {
    const res = await handleChatPaciente(requisicao({ casoId: "1", mensagem: "m", historico: [] }), {
      prepararTurno: async () => resultado,
      obterRespostaOpenAI: async () => "resposta do modelo",
    });
    const json = await res.json();
    assert.deepEqual(Object.keys(json).sort(), ["resposta"]);
    assert.equal(typeof json.resposta, "string");
  }
});

// ── 4. Caso legado permanece funcional (prepararTurno real, sem Turn Guard) ─
test("4. caso legado (id não registrado em data/casos-v3) permanece funcional de ponta a ponta", async () => {
  let chamadasOpenAI = 0;
  const obterRespostaOpenAI = async () => {
    chamadasOpenAI++;
    return "Bom dia, doutor.";
  };

  // Sem injetar prepararTurno: usa o prepararTurnoPacienteTexto REAL, que por
  // sua vez usa o caminho legado (criarPromptPaciente) para o Caso 18 — a
  // única dependência de rede substituída é obterRespostaOpenAI.
  const res = await handleChatPaciente(
    requisicao({ casoId: "18", mensagem: "O que trouxe o senhor aqui?", historico: [] }),
    { obterRespostaOpenAI }
  );
  const json = await res.json();

  assert.equal(chamadasOpenAI, 1);
  assert.equal(json.resposta, "Bom dia, doutor.");
});

// ── 5. Validações preexistentes continuam intactas ──────────────────────────
test("5. mensagem ausente continua retornando 400", async () => {
  const res = await handleChatPaciente(requisicao({ casoId: "1", historico: [] }), {
    prepararTurno: async () => ({ kind: "generate", prompt: "x" }),
    obterRespostaOpenAI: async () => "y",
  });
  assert.equal(res.status, 400);
});

test("6. caso não encontrado continua retornando mensagem padrão", async () => {
  const res = await handleChatPaciente(
    requisicao({ casoId: "id-que-nao-existe-em-lugar-nenhum", mensagem: "oi", historico: [] }),
    { prepararTurno: async () => ({ kind: "generate", prompt: "x" }), obterRespostaOpenAI: async () => "y" }
  );
  const json = await res.json();
  assert.equal(json.resposta, "Desculpe, não encontrei o caso solicitado.");
});

test("7. erro inesperado (corpo malformado) continua caindo no tratamento de erro existente", async () => {
  const res = await handleChatPaciente(requisicao("isto não é json"), {
    prepararTurno: async () => ({ kind: "generate", prompt: "x" }),
    obterRespostaOpenAI: async () => "y",
  });
  const json = await res.json();
  assert.equal(json.resposta, "Desculpe, estou um pouco cansado. Pode repetir?");
});
