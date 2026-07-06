/**
 * Result Writer — persistência segura de tentativas (estilo _allresults).
 *
 * Sem banco de dados no projeto: usa armazenamento em memória (dev) + tentativa
 * de gravar arquivo JSON em /tmp apenas em ambiente de desenvolvimento.
 * NUNCA quebra produção — toda escrita é best-effort.
 */

import type { HealthBenchAttemptResult } from "./types";

// Buffer em memória (últimas tentativas desta instância do servidor)
const attemptsEmMemoria: HealthBenchAttemptResult[] = [];
const MAX_EM_MEMORIA = 200;

export function listarTentativasEmMemoria(): HealthBenchAttemptResult[] {
  return [...attemptsEmMemoria];
}

export async function salvarTentativa(
  attempt: HealthBenchAttemptResult
): Promise<{ persistido: boolean; destino: string }> {
  // 1. Memória (sempre)
  attemptsEmMemoria.push(attempt);
  if (attemptsEmMemoria.length > MAX_EM_MEMORIA) attemptsEmMemoria.shift();

  // 2. Arquivo local apenas em desenvolvimento (best-effort)
  if (process.env.NODE_ENV !== "production") {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const dir = path.join("/tmp", "healthbench-attempts");
      await fs.mkdir(dir, { recursive: true });
      const arquivo = path.join(dir, `${attempt.attemptId}.json`);
      await fs.writeFile(arquivo, JSON.stringify(attempt, null, 2), "utf-8");
      console.log("[HEALTHBENCH RESULT] Tentativa salva em", arquivo);
      return { persistido: true, destino: arquivo };
    } catch (e) {
      console.warn("[HEALTHBENCH RESULT] Não foi possível gravar arquivo:", e);
    }
  }

  return { persistido: false, destino: "memória" };
}
