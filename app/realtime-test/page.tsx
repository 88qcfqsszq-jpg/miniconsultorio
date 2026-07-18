/**
 * Página técnica isolada de prova de conexão Realtime (Etapa 4).
 *
 * Server Component: o valor da feature flag (`REALTIME_VOICE_ENABLED`) é lido e
 * comparado SOMENTE no servidor — nunca é exposto ao bundle do cliente (não é
 * NEXT_PUBLIC_*). Quando desligada (padrão), a página não renderiza o componente
 * de teste em lugar algum: fica inacessível mesmo que alguém acesse a rota.
 *
 * Defesa em profundidade: mesmo que este gate fosse contornado, o endpoint
 * /api/realtime/session (Etapa 3) também verifica a mesma flag no servidor e
 * responde 403 — a conexão nunca avançaria além da solicitação do segredo.
 */

import RealtimeConnectionTest from "@/components/realtime/RealtimeConnectionTest";

// Força renderização dinâmica: a flag deve ser reavaliada A CADA requisição,
// não congelada no valor do momento do build (evita exigir rebuild só para
// ligar/desligar o acesso à página quando a variável de ambiente mudar).
export const dynamic = "force-dynamic";

export default function RealtimeTestPage() {
  const habilitado = process.env.REALTIME_VOICE_ENABLED === "true";

  if (!habilitado) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center text-slate-500">
        <p>Recurso de voz não está habilitado neste ambiente.</p>
      </div>
    );
  }

  return <RealtimeConnectionTest />;
}
