// ============================================================================
// Persistência do PROGRESSO do atendimento em andamento (por caso), para o
// aluno retomar de onde parou ao voltar à página do caso — até finalizar.
// Usa localStorage. Ao finalizar (feedback), o progresso é limpo.
// ============================================================================

export interface AttendanceSnapshot {
  mensagens?: any[];
  manobras?: any[];
  exames?: any[];
  labs?: string[];
  sinaisVitaisSolicitados?: boolean;
  vitalsReavaliadoMin?: number | null;
  vitalsReavaliacao?: {
    minutos: number;
    exitVitals: Record<string, unknown>;
    therapeuticResponse: string;
    therapeuticResponseLabel: string;
    disposition?: string;
    stabilityLabel?: string;
  } | null;
  ecgGerado?: any;
  ecgSimuladorState?: any;
  soap?: any;
  diagnostico?: any;
  tempoInicio?: number;
  savedAt?: number;
}

const keyFor = (caseId: string) => `medix.attendance.${caseId}`;

function reviveTimestamps(arr?: any[]): any[] | undefined {
  if (!Array.isArray(arr)) return arr;
  return arr.map((m) =>
    m && typeof m.timestamp === "string" ? { ...m, timestamp: new Date(m.timestamp) } : m
  );
}

/**
 * Normaliza um `diagnostico` restaurado do localStorage. Snapshots salvos por
 * uma versão antiga do app podem ter a chave com o typo legado
 * `diagnosticosDisferenciais` (em vez de `diagnosticosDiferenciais`), ou não
 * ter `diagnosticosDiferenciais` como array algum — nesses casos, sempre
 * volta a ser `diagnosticosDiferenciais: []`, nunca `undefined`.
 */
function normalizarDiagnostico(bruto: unknown): unknown {
  if (!bruto || typeof bruto !== "object") return bruto;
  const objeto = bruto as Record<string, unknown>;
  const diagnosticosDiferenciais = Array.isArray(objeto.diagnosticosDiferenciais)
    ? objeto.diagnosticosDiferenciais
    : Array.isArray(objeto.diagnosticosDisferenciais) // compat: typo legado de versões antigas
    ? objeto.diagnosticosDisferenciais
    : [];
  return { ...objeto, diagnosticosDiferenciais };
}

export function getAttendanceProgress(caseId: string): AttendanceSnapshot | null {
  if (typeof window === "undefined" || !caseId) return null;
  try {
    const raw = window.localStorage.getItem(keyFor(caseId));
    if (!raw) return null;
    const snap = JSON.parse(raw) as AttendanceSnapshot;
    snap.mensagens = reviveTimestamps(snap.mensagens);
    snap.exames = reviveTimestamps(snap.exames);
    snap.diagnostico = normalizarDiagnostico(snap.diagnostico);
    return snap;
  } catch {
    return null;
  }
}

export function saveAttendanceProgress(caseId: string, snapshot: AttendanceSnapshot) {
  if (typeof window === "undefined" || !caseId) return;
  try {
    window.localStorage.setItem(keyFor(caseId), JSON.stringify({ ...snapshot, savedAt: Date.now() }));
  } catch {
    /* limite/indisponibilidade do storage — ignora */
  }
}

export function clearAttendanceProgress(caseId: string) {
  if (typeof window === "undefined" || !caseId) return;
  try {
    window.localStorage.removeItem(keyFor(caseId));
  } catch {
    /* noop */
  }
}
