"use client";

// Conteúdo da rota /meu-perfil: login/primeiro acesso quando não logado;
// edição do perfil quando logado. Consome a mesma fonte de acesso/perfil.

import { useAccess } from "@/hooks/useAccess";
import LoginPlanos from "@/components/access/LoginPlanos";
import ProfileForm from "@/components/profile/ProfileForm";

export default function MeuPerfilClient() {
  const { loggedIn } = useAccess();
  const cardClass =
    "rounded-[26px] border border-[rgba(120,170,230,0.24)] bg-white/75 p-5 shadow-[0_18px_55px_rgba(72,116,170,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl sm:p-7 lg:p-8";

  if (!loggedIn) {
    return (
      <div className={cardClass}>
        <LoginPlanos />
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <ProfileForm mode="full" />
    </div>
  );
}
