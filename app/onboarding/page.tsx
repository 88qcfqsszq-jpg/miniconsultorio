"use client";

import { useRouter } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Bem-vindo(a) ao MEDIX</h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete seus dados para personalizar sua experiência. Você pode editá-los depois em “Meu Perfil”.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ProfileForm
            mode="onboarding"
            submitLabel="Começar"
            onSaved={() => router.replace("/dashboard-landing")}
          />
        </div>
      </div>
    </div>
  );
}
