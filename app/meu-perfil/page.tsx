import MeuPerfilClient from "@/components/profile/MeuPerfilClient";

export const metadata = {
  title: "Meu Perfil — MEDIX",
};

export default function MeuPerfilPage() {
  return (
    <div
      className="min-h-screen px-4 pb-10 pt-20 text-[#0b1f4d] sm:px-6 sm:py-10 lg:px-10 lg:py-12"
      style={{
        background:
          "radial-gradient(1200px 600px at 82% -10%, rgba(192, 222, 255, 0.5), transparent 60%), radial-gradient(900px 500px at -6% 112%, rgba(214, 235, 255, 0.5), transparent 60%), #f3f8ff",
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <header className="mb-7 max-w-3xl px-1 sm:mb-8">
          <h1 className="text-2xl font-extrabold text-[#0b1f4d] sm:text-3xl">
            Meu Perfil
          </h1>
          <p className="mt-2 text-sm font-medium leading-6 text-[#5c6d8a]">
            Seus dados aparecem na barra lateral e no painel — mantenha-os atualizados.
          </p>
        </header>

        <MeuPerfilClient />
      </div>
    </div>
  );
}
