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
  const formCls = full ? "space-y-7" : "space-y-5";
  const inputCls = full
    ? "w-full rounded-2xl border border-[rgba(139,190,245,0.34)] bg-white/80 px-4 py-3 text-sm font-medium text-[#0b1f4d] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_20px_rgba(72,116,170,0.04)] transition placeholder:text-[#5c6d8a]/60 focus:border-blue-500/60 focus:bg-white/90 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
    : "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60";
  const labelCls = full
    ? "mb-2 block text-xs font-bold text-[#425c88]"
    : "mb-1 block text-xs font-semibold text-slate-500";
  const fieldCls = full ? "min-w-0" : "";
  const gridCls = full
    ? "grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2"
    : "grid grid-cols-1 gap-4 sm:grid-cols-2";

  return (
    <form onSubmit={handleSubmit} className={formCls}>
      {full && (
        <div className="flex flex-col gap-4 rounded-3xl border border-[rgba(139,190,245,0.28)] bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-200/80 bg-blue-50 text-2xl font-black text-blue-600 shadow-[0_12px_28px_rgba(72,116,170,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
              {form.avatarDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.avatarDataUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initials(form)
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <label className="cursor-pointer rounded-2xl border border-[rgba(139,190,245,0.34)] bg-white/80 px-4 py-2.5 text-xs font-extrabold text-[#315f9f] shadow-[0_8px_20px_rgba(72,116,170,0.06)] transition hover:bg-white">
              Alterar foto
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFoto(e.target.files?.[0])} />
            </label>
            {form.avatarDataUrl && (
              <button type="button" onClick={() => set("avatarDataUrl", "")} className="rounded-2xl px-2 py-2 text-xs font-bold text-[#5c6d8a] transition hover:text-[#0b1f4d]">
                Remover
              </button>
            )}
          </div>
        </div>
      )}

      <div className={gridCls}>
        <div className={fieldCls}>
          <label className={labelCls}>Nome</label>
          <input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Ex: Marcela" />
        </div>
        <div className={fieldCls}>
          <label className={labelCls}>Sobrenome</label>
          <input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Ex: Freitas" />
        </div>
        <div className={fieldCls}>
          <label className={labelCls}>Tratamento</label>
          <select className={inputCls} value={form.titlePrefix} onChange={(e) => set("titlePrefix", e.target.value)}>
            {PREFIXOS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className={fieldCls}>
          <label className={labelCls}>Data de nascimento</label>
          <input type="date" className={inputCls} value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
        </div>
        <div className={fieldCls}>
          <label className={labelCls}>Semestre atual</label>
          <input className={inputCls} value={form.semester} onChange={(e) => set("semester", e.target.value)} placeholder="Ex: 3º semestre" />
        </div>
        <div className={fieldCls}>
          <label className={labelCls}>Instituição de ensino</label>
          <input className={inputCls} value={form.institution} onChange={(e) => set("institution", e.target.value)} placeholder="Ex: UFXX" />
        </div>
        <div className={fieldCls}>
          <label className={labelCls}>Telefone</label>
          <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(00) 00000-0000" />
        </div>
        <div className={fieldCls}>
          <label className={labelCls}>E-mail</label>
          <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@email.com" />
        </div>

        {full && (
          <>
            <div className={fieldCls}>
              <label className={labelCls}>Cidade</label>
              <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Cidade" />
            </div>
            <div className={fieldCls}>
              <label className={labelCls}>UF</label>
              <input className={inputCls} value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="UF" maxLength={2} />
            </div>
            <div className={fieldCls}>
              <label className={labelCls}>Área de maior interesse</label>
              <select className={inputCls} value={form.interestArea} onChange={(e) => set("interestArea", e.target.value)}>
                <option value="">Selecione…</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0 md:col-span-2">
              <label className={labelCls}>Objetivo principal no app</label>
              <textarea className={`${inputCls} min-h-28 resize-y leading-6`} rows={2} value={form.goal} onChange={(e) => set("goal", e.target.value)} placeholder="Ex: melhorar desempenho em OSCE de semiologia" />
            </div>
          </>
        )}
      </div>

      <div className={full ? "flex flex-col gap-3 border-t border-[rgba(139,190,245,0.22)] pt-6 sm:flex-row sm:items-center sm:justify-end" : "flex items-center gap-3 pt-1"}>
        <button type="submit" className={full ? "rounded-2xl bg-gradient-to-br from-[#4aa3ff] to-[#1f7bff] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(31,123,255,0.24)] transition hover:brightness-105" : "rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-105"}>
          {submitLabel || (full ? "Salvar alterações" : "Continuar")}
        </button>
        {salvo && full && <span className="text-sm font-semibold text-emerald-600">✓ Perfil salvo</span>}
      </div>
    </form>
  );
}
