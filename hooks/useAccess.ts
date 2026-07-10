"use client";

// Hook reativo sobre lib/accessControl: re-renderiza quando login/uso-free mudam.

import { useCallback, useEffect, useState } from "react";
import {
  ACCESS_EVENT,
  isLoggedIn,
  hasUsedFreeAdultOsce,
  hasUsedFreePediatricOsce,
} from "@/lib/accessControl";

interface AccessState {
  loggedIn: boolean;
  usedFreeAdult: boolean;
  usedFreePediatric: boolean;
}

function snapshot(): AccessState {
  return {
    loggedIn: isLoggedIn(),
    usedFreeAdult: hasUsedFreeAdultOsce(),
    usedFreePediatric: hasUsedFreePediatricOsce(),
  };
}

export function useAccess() {
  // Estado inicial "não logado" (igual ao servidor) → hidrata no cliente.
  const [state, setState] = useState<AccessState>({
    loggedIn: false,
    usedFreeAdult: false,
    usedFreePediatric: false,
  });

  const sync = useCallback(() => setState(snapshot()), []);

  useEffect(() => {
    sync();
    window.addEventListener(ACCESS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ACCESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return state;
}
