"use client";

import { useEffect } from "react";

// Marca o <body> enquanto a página de atendimento MEDIX está montada,
// permitindo ocultar a Navbar global apenas nesta rota via CSS escopado.
// NÃO altera a Navbar global nem outras rotas.
export function ConsultorioMedixBodyClass() {
  useEffect(() => {
    document.body.classList.add("is-consultorio-medix-page");
    return () => {
      document.body.classList.remove("is-consultorio-medix-page");
    };
  }, []);

  return null;
}
