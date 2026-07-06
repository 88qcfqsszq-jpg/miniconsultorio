/**
 * Attempt Store — camada de persistência ÚNICA para HealthBenchAttemptRecord (Fase 2).
 *
 * Hoje: memória + arquivo JSON em /tmp (apenas dev). Interface pronta para banco real.
 * NÃO substitui o result-writer (que persiste o registro técnico de avaliação);
 * esta é a camada de PRODUTO da tentativa OSCE completa.
 */

import type { HealthBenchAttemptRecord } from "./attempt-schema";

// Map global por attemptId (sobrevive entre requests na mesma instância do servidor)
const store = new Map<string, HealthBenchAttemptRecord>();
const MAX_EM_MEMORIA = 500;

const DIR_ATTEMPTS = "/tmp/healthbench-osce-attempts";

async function gravarArquivo(record: HealthBenchAttemptRecord): Promise<string | null> {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    await fs.mkdir(DIR_ATTEMPTS, { recursive: true });
    const arquivo = path.join(DIR_ATTEMPTS, `${record.attemptId}.json`);
    await fs.writeFile(arquivo, JSON.stringify(record, null, 2), "utf-8");
    return arquivo;
  } catch (e) {
    console.warn("[HEALTHBENCH ATTEMPT STORE] Falha ao gravar arquivo:", e);
    return null;
  }
}

async function lerArquivo(attemptId: string): Promise<HealthBenchAttemptRecord | null> {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const arquivo = path.join(DIR_ATTEMPTS, `${attemptId}.json`);
    const conteudo = await fs.readFile(arquivo, "utf-8");
    return JSON.parse(conteudo) as HealthBenchAttemptRecord;
  } catch {
    return null;
  }
}

export async function saveAttempt(
  record: HealthBenchAttemptRecord
): Promise<{ persistido: boolean; destino: string }> {
  store.set(record.attemptId, record);
  if (store.size > MAX_EM_MEMORIA) {
    const primeiro = store.keys().next().value;
    if (primeiro) store.delete(primeiro);
  }

  const arquivo = await gravarArquivo(record);
  console.log("[HEALTHBENCH ATTEMPT STORE] saveAttempt", {
    attemptId: record.attemptId,
    casoId: record.casoId,
    destino: arquivo ?? "memória",
  });
  return { persistido: !!arquivo, destino: arquivo ?? "memória" };
}

export async function getAttempt(
  attemptId: string
): Promise<HealthBenchAttemptRecord | null> {
  const emMemoria = store.get(attemptId);
  if (emMemoria) return emMemoria;
  const doArquivo = await lerArquivo(attemptId);
  if (doArquivo) store.set(attemptId, doArquivo);
  console.log("[HEALTHBENCH ATTEMPT STORE] getAttempt", {
    attemptId,
    encontrado: !!doArquivo,
  });
  return doArquivo;
}

export function listAttemptsByCase(casoId: number | string): HealthBenchAttemptRecord[] {
  const alvo = Number(casoId);
  return [...store.values()].filter((r) => r.casoId === alvo);
}

export function listAttemptsByStudent(alunoId: string): HealthBenchAttemptRecord[] {
  return [...store.values()].filter((r) => r.alunoId === alunoId);
}

export function listAllAttempts(): HealthBenchAttemptRecord[] {
  return [...store.values()];
}

export async function updateAttempt(
  attemptId: string,
  patch: Partial<HealthBenchAttemptRecord>
): Promise<HealthBenchAttemptRecord | null> {
  const atual = await getAttempt(attemptId);
  if (!atual) {
    console.warn("[HEALTHBENCH ATTEMPT STORE] updateAttempt: não encontrado", attemptId);
    return null;
  }
  const atualizado: HealthBenchAttemptRecord = {
    ...atual,
    ...patch,
    attemptId: atual.attemptId, // imutável
    updatedAt: new Date().toISOString(),
  };
  await saveAttempt(atualizado);
  return atualizado;
}
