"use client";

// Hook React sobre a fonte única (lib/userProfile). Mantém sidebar, top bar e
// /meu-perfil sincronizados: qualquer save dispara re-render em todos.

import { useEffect, useState, useCallback } from "react";
import {
  getUserProfile,
  saveUserProfile,
  USER_PROFILE_EVENT,
  DEFAULT_PROFILE,
  type UserProfile,
} from "@/lib/userProfile";

export function useUserProfile() {
  // Inicia com o default (igual no servidor) para evitar mismatch de hidratação;
  // lê o localStorage após montar.
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(getUserProfile());
    const sync = () => setProfile(getUserProfile());
    window.addEventListener(USER_PROFILE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(USER_PROFILE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((patch: Partial<UserProfile>) => {
    setProfile(saveUserProfile(patch));
  }, []);

  return { profile, save };
}
