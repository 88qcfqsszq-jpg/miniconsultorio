// ============================================================================
// Fonte ÚNICA de dados do usuário (perfil local, sem back-end/auth).
// Sidebar, top bar do Dashboard e a página /meu-perfil consomem daqui, para
// exibirem exatamente as mesmas informações. Persiste em localStorage.
// ============================================================================

export interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO (yyyy-mm-dd)
  semester: string;
  institution: string;
  phone: string;
  email: string;
  city: string;
  state: string; // UF
  goal: string; // objetivo principal no app
  interestArea: string; // OSCE, semiologia, exames, radiologia, casos clínicos...
  titlePrefix: string; // "Dr.", "Dra." ou "Dr(a)."
  avatarDataUrl?: string; // foto (base64/URL) — opcional
  createdAt?: string;
  updatedAt?: string;
  onboarded?: boolean;
}

const STORAGE_KEY = "medix.userProfile.v1";
export const USER_PROFILE_EVENT = "medix:userProfile:changed";

export const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  birthDate: "",
  semester: "",
  institution: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  goal: "",
  interestArea: "",
  titlePrefix: "Dr(a).",
  avatarDataUrl: undefined,
  onboarded: false,
};

/** Lê o perfil salvo (com defaults). Seguro em SSR (retorna o default). */
export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

/** Salva (merge) e notifica os consumidores. Retorna o perfil resultante. */
export function saveUserProfile(patch: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const now = new Date().toISOString();
  const next: UserProfile = {
    ...current,
    ...patch,
    createdAt: current.createdAt || now,
    updatedAt: now,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignora limite/indisponibilidade do storage */
    }
    window.dispatchEvent(new CustomEvent(USER_PROFILE_EVENT));
  }
  return next;
}

// ---------- Derivados (uma só regra para todo o app) ----------

/** Nome completo (nome + sobrenome). */
export function fullName(p: UserProfile): string {
  return [p.firstName, p.lastName].map((s) => (s || "").trim()).filter(Boolean).join(" ");
}

/** Nome exibido: "Dr(a). Nome Sobrenome" ou fallback "Dr(a). Usuário". */
export function displayName(p: UserProfile): string {
  const nome = fullName(p);
  const prefix = (p.titlePrefix || "Dr(a).").trim();
  return nome ? `${prefix} ${nome}` : "Dr(a). Usuário";
}

/** Iniciais para o avatar (fallback "U"). */
export function initials(p: UserProfile): string {
  const nome = fullName(p);
  const parts = nome.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts.slice(0, 2).map((s) => s[0]?.toUpperCase() || "").join("") || "U";
}
