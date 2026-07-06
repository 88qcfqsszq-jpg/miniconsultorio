"use client";

import { useMemo, useRef, useState } from "react";
import {
  selecionarSomCardiaco,
  HEART_SOUND_TYPE_LABEL,
  FOCUS_LABEL,
  HEART_SILENT_TYPES,
  type HeartFocus,
  type HeartSoundType,
  type HeartSoundItem,
} from "@/lib/ausculta/cardiaco-sounds";
import { obterPadraoAuscultaCardiacaPorCaso } from "@/lib/ausculta/cardiaco-case-mapping";
import AuscultaSoundMeta from "@/components/ausculta/AuscultaSoundMeta";

export interface AchadoAuscultaCardiaca {
  focus: HeartFocus;
  soundType: HeartSoundType;
  soundLabel: string;
  audioId?: string;
  audioUrl?: string;
  textoRegistro: string;
  resposta: string;
}

interface Props {
  caso: any;
  sexoPaciente?: "M" | "F";
  onRegistrarAchado: (achado: AchadoAuscultaCardiaca) => void;
  onClose?: () => void;
}

// 4 focos clássicos sobre a imagem do tórax (%).
const HEART_POINTS: Array<{ id: HeartFocus; label: string; x: number; y: number }> = [
  { id: "RUSB", label: "Foco aórtico", x: 44, y: 33 },
  { id: "LUSB", label: "Foco pulmonar", x: 57, y: 33 },
  { id: "LLSB", label: "Foco tricúspide", x: 52, y: 48 },
  { id: "Apex", label: "Foco mitral", x: 60, y: 55 },
];

// Opções (grupos clínicos) que o aluno escolhe.
type HeartAnswer =
  | "normal"
  | "sopro_sistolico"
  | "sopro_diastolico"
  | "s3"
  | "s4"
  | "atrial_fibrillation"
  | "tachycardia"
  | "av_block"
  | "pericardial_rub";

const OPCOES: Array<{ valor: HeartAnswer; label: string }> = [
  { valor: "normal", label: "Bulhas normais (B1/B2)" },
  { valor: "sopro_sistolico", label: "Sopro sistólico" },
  { valor: "sopro_diastolico", label: "Sopro diastólico" },
  { valor: "s3", label: "B3 (terceira bulha)" },
  { valor: "s4", label: "B4 (quarta bulha)" },
  { valor: "atrial_fibrillation", label: "Fibrilação atrial" },
  { valor: "tachycardia", label: "Taquicardia" },
  { valor: "av_block", label: "Bloqueio AV" },
  { valor: "pericardial_rub", label: "Atrito pericárdico" },
];

function grupoDoTipo(t: HeartSoundType): HeartAnswer {
  if (t === "mid_systolic_murmur" || t === "early_systolic_murmur" || t === "late_systolic_murmur")
    return "sopro_sistolico";
  if (t === "late_diastolic_murmur") return "sopro_diastolico";
  return t as HeartAnswer;
}

export default function CardiacAuscultationPanel({
  caso,
  sexoPaciente,
  onRegistrarAchado,
  onClose,
}: Props) {
  const padrao = useMemo(
    () =>
      obterPadraoAuscultaCardiacaPorCaso({
        diagnostico: caso?.dados_ocultos_do_sistema?.diagnostico_principal,
        casoTitulo: caso?.titulo,
        casoId: caso?.id ? String(caso.id) : undefined,
      }),
    [caso]
  );

  const sexo: "M" | "F" = useMemo(() => {
    const s = (sexoPaciente || caso?.sexo || caso?.paciente?.sexo || "").toString().toLowerCase();
    return s.startsWith("f") ? "F" : "M";
  }, [sexoPaciente, caso]);

  const [focoAtivo, setFocoAtivo] = useState<HeartFocus | null>(null);
  const [somAtual, setSomAtual] = useState<HeartSoundItem | null>(null);
  const [resposta, setResposta] = useState<HeartAnswer | null>(null);
  const [registrados, setRegistrados] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // No foco-alvo do caso toca o achado; nos demais, bulhas normais.
  const tipoNoFoco: HeartSoundType | null = focoAtivo
    ? focoAtivo === padrao.foco
      ? padrao.tipo
      : "normal"
    : null;
  const isSilencio = !!tipoNoFoco && HEART_SILENT_TYPES.has(tipoNoFoco) && focoAtivo === padrao.foco;

  function selecionarFoco(foco: HeartFocus) {
    const tipo = foco === padrao.foco ? padrao.tipo : "normal";
    const som = selecionarSomCardiaco({ tipo, foco, sexoPreferido: sexo });
    setFocoAtivo(foco);
    setSomAtual(som);
    setResposta(null);
    console.log("[AUSCULTA CARDÍACA] caso:", caso?.id, "| padrao:", padrao.key, "| foco:", foco, "| tipo:", tipo, "| audio:", som?.id ?? "(silêncio didático)");
    setTimeout(() => tocar(som), 0);
  }

  function tocar(som: HeartSoundItem | null = somAtual) {
    if (!som || !audioRef.current) return;
    audioRef.current.src = som.audioUrl;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function registrar() {
    if (!focoAtivo || !resposta || !tipoNoFoco) return;
    const foco = focoAtivo;
    const labelEsperado = HEART_SOUND_TYPE_LABEL[tipoNoFoco];
    const labelAluno = OPCOES.find((o) => o.valor === resposta)?.label ?? String(resposta);
    const focoLabel = FOCUS_LABEL[foco];
    const correct = grupoDoTipo(tipoNoFoco) === resposta;

    const textoRegistro = `[Ausculta Cardíaca] ${foco} — Ausculta cardíaca`;
    const respostaTxt =
      `[Ausculta Cardíaca] Foco: ${focoLabel} (${foco}). ` +
      `Som esperado: ${labelEsperado}. Resposta do aluno: ${labelAluno}. ` +
      `Áudio: ${somAtual ? somAtual.audioFile : "sem áudio (silêncio didático)"}. ` +
      `Reconhecimento correto: ${correct ? "sim" : "não"}.`;

    onRegistrarAchado({
      focus: foco,
      soundType: tipoNoFoco,
      soundLabel: labelEsperado,
      audioId: somAtual?.id,
      audioUrl: somAtual?.audioUrl,
      textoRegistro,
      resposta: respostaTxt,
    });

    setRegistrados((prev) => new Set(prev).add(foco));
    setFocoAtivo(null);
    setSomAtual(null);
    setResposta(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ausculta cardíaca</h4>
        {onClose && (
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700">voltar</button>
        )}
      </div>

      <div className="relative w-full rounded-xl border border-slate-200/60 bg-white/50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/boneco/ausculta_fundo_transparente.png"
          alt="Tórax para ausculta cardíaca"
          className="w-full max-h-64 object-contain mx-auto select-none pointer-events-none"
          draggable={false}
        />
        {HEART_POINTS.map((p) => {
          const ativo = focoAtivo === p.id;
          const feito = registrados.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => selecionarFoco(p.id)}
              title={p.label}
              aria-label={`Auscultar ${p.label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: 28, height: 28 }}
            >
              <span
                className={`rounded-full border-2 border-white shadow transition-all ${
                  ativo ? "bg-rose-600 ring-4 ring-rose-300/50" : feito ? "bg-emerald-500" : "bg-rose-500/80 hover:scale-110"
                }`}
                style={{ width: 16, height: 16 }}
              />
            </button>
          );
        })}
      </div>

      {!focoAtivo && <p className="text-xs text-slate-500 text-center">Clique em um foco para auscultar.</p>}

      <audio ref={audioRef} preload="none" />

      {focoAtivo && (
        <div className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-3 space-y-2">
          <p className="text-xs font-semibold text-rose-900">
            {HEART_POINTS.find((p) => p.id === focoAtivo)?.label} ({focoAtivo})
          </p>

          {isSilencio ? (
            <div className="rounded-md border border-amber-300/70 bg-amber-50 px-2.5 py-2">
              <p className="text-xs font-semibold text-amber-800">Atrito pericárdico</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                {padrao.avisoSemAudio ?? "Atrito pericárdico não disponível nesta biblioteca."}
              </p>
            </div>
          ) : (
            <button onClick={() => tocar()} className="text-xs font-semibold text-rose-700 hover:text-rose-900">
              ▶ Ouvir novamente
            </button>
          )}

          <p className="text-xs text-slate-700 pt-1">O que você auscultou?</p>
          <div className="grid grid-cols-1 gap-1">
            {OPCOES.map((o) => (
              <button
                key={o.valor}
                onClick={() => setResposta(o.valor)}
                className={`text-left text-xs px-2 py-1.5 rounded-md border transition-all ${
                  resposta === o.valor
                    ? "bg-rose-100 border-rose-400 text-rose-900 font-semibold"
                    : "bg-white/70 border-slate-200 text-slate-700 hover:bg-rose-50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {resposta && (
            <AuscultaSoundMeta
              tipo={HEART_SOUND_TYPE_LABEL[tipoNoFoco!]}
              local={FOCUS_LABEL[focoAtivo]}
              arquivo={somAtual?.audioFile ?? null}
              origem={somAtual?.sourceCsv ?? "HLS-CMDS"}
              correspondencia={
                somAtual
                  ? somAtual.mappingType === "exact"
                    ? "Correspondência validada"
                    : "Código traduzido"
                  : "Sem áudio (silêncio didático)"
              }
            />
          )}

          <button
            onClick={registrar}
            disabled={!resposta}
            className="w-full mt-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all bg-green-500 hover:bg-green-600 disabled:bg-slate-300"
          >
            ✓ Registrar achado
          </button>
        </div>
      )}
    </div>
  );
}
