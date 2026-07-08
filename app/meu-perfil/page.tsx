import ProfileForm from "@/components/profile/ProfileForm";

export const metadata = {
  title: "Meu Perfil — MEDIX",
};

export default function MeuPerfilPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Meu Perfil</h1>
          <p className="mt-1 text-sm text-slate-500">
            Seus dados aparecem na barra lateral e no painel — mantenha-os atualizados.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ProfileForm mode="full" />
        </div>
      </div>
    </div>
  );
}
