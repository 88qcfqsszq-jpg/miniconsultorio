"use client";

// Formulário de perfil reutilizado por /onboarding (dados básicos) e
// /meu-perfil (completo). Lê/escreve na fonte única (useUserProfile).

import { useEffect, useRef, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getUserProfile, initials, type UserProfile } from "@/lib/userProfile";

const AREAS = ["OSCE", "Semiologia", "Exames", "Radiologia", "Casos clínicos"];
const PREFIXOS = ["Dr.", "Dra.", "Dr(a)."];

export default function ProfileForm({
  mode = "full",
  onSaved,
  submitLabel,
}: {
  mode?: "onboarding" | "full";
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const { save } = useUserProfile();
  const [form, setForm] = useState<UserProfile>(getUserProfile());
  const [salvo, setSalvo] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      setForm(getUserProfile());
      hydrated.current = true;
    }
  }, []);

  const set = (k: keyof UserProfile, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setSalvo(false);
  };

  const onFoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, avatarDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
    setSalvo(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save({ ...form, onboarded: true });
    setSalvo(true);
    onSaved?.();
  };

  const full = mode === "full";
  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60";
  const labelCls = "mb-1 block text-xs font-semibold text-slate-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {full && (
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-200 bg-blue-50 text-xl font-black text-blue-600">
            {form.avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatarDataUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              initials(form)
            )}
          </div>
          <label className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
            Alterar foto
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFoto(e.target.files?.[0])} />
          </label>
          {form.avatarDataUrl && (
            <button type="button" onClick={() => set("avatarDataUrl", "")} className="text-xs font-semibold text-slate-400 hover:text-slate-600">
              Remover
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Nome</label>
          <input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Ex: Marcela" />
        </div>
        <div>
          <label className={labelCls}>Sobrenome</label>
          <input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Ex: Freitas" />
        </div>
        <div>
          <label className={labelCls}>Tratamento</label>
          <select className={inputCls} value={form.titlePrefix} onChange={(e) => set("titlePrefix", e.target.value)}>
            {PREFIXOS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Data de nascimento</label>
          <input type="date" className={inputCls} value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Semestre atual</label>
          <input className={inputCls} value={form.semester} onChange={(e) => set("semester", e.target.value)} placeholder="Ex: 3º semestre" />
        </div>
        <div>
          <label className={labelCls}>Instituição de ensino</label>
          <input className={inputCls} value={form.institution} onChange={(e) => set("institution", e.target.value)} placeholder="Ex: UFXX" />
        </div>
        <div>
          <label className={labelCls}>Telefone</label>
          <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(00) 00000-0000" />
        </div>
        <div>
          <label className={labelCls}>E-mail</label>
          <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@email.com" />
        </div>

        {full && (
          <>
            <div>
              <label className={labelCls}>Cidade</label>
              <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Cidade" />
            </div>
            <div>
              <label className={labelCls}>UF</label>
              <input className={inputCls} value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="UF" maxLength={2} />
            </div>
            <div>
              <label className={labelCls}>Área de maior interesse</label>
              <select className={inputCls} value={form.interestArea} onChange={(e) => set("interestArea", e.target.value)}>
                <option value="">Selecione…</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Objetivo principal no app</label>
              <textarea className={inputCls} rows={2} value={form.goal} onChange={(e) => set("goal", e.target.value)} placeholder="Ex: melhorar desempenho em OSCE de semiologia" />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-105">
          {submitLabel || (full ? "Salvar alterações" : "Continuar")}
        </button>
        {salvo && full && <span className="text-sm font-semibold text-emerald-600">✓ Perfil salvo</span>}
      </div>
    </form>
  );
}
