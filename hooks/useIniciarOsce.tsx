"use client";

// Porta ÚNICA para iniciar OSCE em qualquer aba (sidebar, faca-o-osce, guia,
// centro clínico, dashboard). Aplica as regras de free tier centralizadas:
// - logado: caso aleatório do tipo pedido (como antes);
// - não logado: 1 caso grátis FIXO por tipo (adulto/pediátrico); após usar,
//   abre login + planos. Sem duplicar lógica em cada página.

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { urlOSCEAleatorio, type TipoOSCE } from "@/lib/osce/iniciar-osce";
import AccessModal from "@/components/access/AccessModal";
import {
  FREE_CASES,
  isLoggedIn,
  hasUsedFreeAdultOsce,
  hasUsedFreePediatricOsce,
} from "@/lib/accessControl";

export function useIniciarOsce(onBeforeNavigate?: () => void) {
  const router = useRouter();
  const [accessOpen, setAccessOpen] = useState(false);

  const go = useCallback(
    (url: string) => {
      onBeforeNavigate?.();
      router.push(url);
    },
    [router, onBeforeNavigate]
  );

  const iniciarOSCE = useCallback(
    (tipo: TipoOSCE) => {
      // Logado → fluxo completo (aleatório).
      if (isLoggedIn()) {
        const url = urlOSCEAleatorio(tipo);
        if (!url) {
          alert(`Nenhum caso ${tipo} disponível no momento.`);
          return;
        }
        go(url);
        return;
      }
      // Não logado → 1 caso grátis FIXO por tipo. O caso só é "consumido" ao
      // FINALIZAR (feedback gerado); aqui apenas abrimos/reabrimos o caso grátis
      // enquanto ainda não foi concluído.
      if (tipo === "adulto") {
        if (hasUsedFreeAdultOsce()) {
          setAccessOpen(true);
          return;
        }
        go(`/caso/${FREE_CASES.adultOsce}?modo=osce&tipo=adulto`);
        return;
      }
      if (hasUsedFreePediatricOsce()) {
        setAccessOpen(true);
        return;
      }
      go(`/caso/${FREE_CASES.pediatricOsce}?modo=osce&tipo=pediatrico`);
    },
    [go]
  );

  const accessModal = (
    <AccessModal
      open={accessOpen}
      onClose={() => setAccessOpen(false)}
      onLoggedIn={() => setAccessOpen(false)}
      titulo="Você já usou seu caso gratuito"
      descricao="Faça login ou assine para acessar mais casos OSCE."
    />
  );

  return { iniciarOSCE, accessModal, setAccessOpen };
}
