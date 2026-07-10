// ============================================================================
// Controle de acesso / free tier (centralizado). Sem back-end: usa localStorage.
// - 1 caso clínico grátis (aba Casos): SCA / Dor Torácica.
// - 1 OSCE adulto grátis FIXO + 1 OSCE pediátrico grátis FIXO (não aleatórios).
// - "Gerar caso com IA" e o restante ficam bloqueados para não logado/free.
// Login é simulado (localStorage) enquanto não há autenticação real.
// ============================================================================

export const FREE_CASES = {
  clinicalCase: "1", // "Dor Torácica — Síndrome Coronariana Aguda"
  adultOsce: "1", // OSCE adulto grátis (fixo)
  pediatricOsce: "ped-01", // OSCE pediátrico grátis (fixo)
} as const;

const KEY_LOGGED = "medix.access.loggedIn";
const KEY_FREE_ADULT = "medix.access.freeAdultOsceUsed";
const KEY_FREE_PED = "medix.access.freePediatricOsceUsed";
export const ACCESS_EVENT = "medix:access:changed";

function readFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
function writeFlag(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent(ACCESS_EVENT));
}

// ---------- Login (simulado) ----------
export function isLoggedIn(): boolean {
  return readFlag(KEY_LOGGED);
}
export function setLoggedIn(value: boolean) {
  writeFlag(KEY_LOGGED, value);
}

// ---------- Casos gratuitos (fixos) ----------
export function isClinicalCaseFree(caseId: string): boolean {
  return String(caseId) === FREE_CASES.clinicalCase;
}
export function isAdultOsceFree(caseId: string): boolean {
  return String(caseId) === FREE_CASES.adultOsce;
}
export function isPediatricOsceFree(caseId: string): boolean {
  return String(caseId) === FREE_CASES.pediatricOsce;
}

// ---------- Uso do free tier (OSCE) ----------
export function hasUsedFreeAdultOsce(): boolean {
  return readFlag(KEY_FREE_ADULT);
}
export function markFreeAdultOsceUsed() {
  writeFlag(KEY_FREE_ADULT, true);
}
export function hasUsedFreePediatricOsce(): boolean {
  return readFlag(KEY_FREE_PED);
}
export function markFreePediatricOsceUsed() {
  writeFlag(KEY_FREE_PED, true);
}

// ---------- Regras de acesso de alto nível ----------
/** Caso clínico (aba Casos): livre = logado OU o caso grátis. */
export function canAccessClinicalCase(caseId: string): boolean {
  return isLoggedIn() || isClinicalCaseFree(caseId);
}
/** Pode iniciar um OSCE adulto? Logado sempre; free só se ainda não usou. */
export function canStartAdultOsce(): boolean {
  return isLoggedIn() || !hasUsedFreeAdultOsce();
}
export function canStartPediatricOsce(): boolean {
  return isLoggedIn() || !hasUsedFreePediatricOsce();
}
/** Gerar caso com IA é recurso pago/logado. */
export function canGenerateWithAI(): boolean {
  return isLoggedIn();
}

/**
 * Marca o caso gratuito como CONSUMIDO — chamar SOMENTE ao finalizar a atividade
 * (feedback gerado). Só tem efeito para usuário não logado e para o caso grátis
 * correspondente. Enquanto não finalizar, o caso pode ser reaberto livremente.
 */
export function markFreeOsceUsedOnFinish(caseId: string) {
  if (isLoggedIn()) return;
  if (isAdultOsceFree(caseId)) markFreeAdultOsceUsed();
  else if (isPediatricOsceFree(caseId)) markFreePediatricOsceUsed();
}
