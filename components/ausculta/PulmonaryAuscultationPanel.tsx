"use client";

import { useMemo, useRef, useState } from "react";
import {
  selecionarSomPulmonar,
  LUNG_SOUND_TYPE_LABEL,
  LOCATION_LABEL,
  LOCATION_LABEL_FRASE,
  LUNG_SILENT_TYPES,
  type LungAuscultationLocation,
  type LungSoundType,
  type LungSoundItem,
} from "@/lib/ausculta/pulmonar-sounds";
import { obterPadraoAuscultaPulmonarPorCaso } from "@/lib/ausculta/pulmonar-case-mapping";
import AuscultaSoundMeta from "@/components/ausculta/AuscultaSoundMeta";

export interface AchadoAusculta {
  location: LungAuscultationLocation;
  soundType: LungSoundType;
  soundLabel: string;
  audioId?: string;
  audioUrl?: string;
  textoRegistro: string;
  resposta: string;
}

interface Props {
  caso: any;
  sexoPaciente?: "M" | "F";
  onRegistrarAchado: (achado: AchadoAusculta) => void;
  onClose?: () => void;
}

const LUNG_POINTS: Array<{ id: LungAuscultationLocation; label: string; x: number; y: number }> = [
  { id: "RUA", label: "Superior direita", x: 40, y: 30 },
  { id: "LUA", label: "Superior esquerda", x: 60, y: 30 },
  { id: "RMA", label: "Média direita", x: 38, y: 48 },
  { id: "LMA", label: "Média esquerda", x: 62, y: 48 },
  { id: "RLA", label: "Inferior direita", x: 40, y: 66 },
  { id: "LLA", label: "Inferior esquerda", x: 60, y: 66 },
];

const OPCOES_RESPOSTA: Array<{ valor: LungSoundType; label: string }> = [
  { valor: "normal", label: "Murmúrio vesicular normal" },
  { valor: "wheezing", label: "Sibilos" },
  { valor: "rhonchi", label: "Roncos" },
  { valor: "fine_crackles", label: "Crepitações finas" },
  { valor: "coarse_crackles", label: "Crepitações grossas" },
  { valor: "pleural_rub", label: "Atrito pleural" },
  { valor: "mv_reduzido", label: "Murmúrio vesicular reduzido/abolido" },
];

export default function PulmonaryAuscultationPanel({
  caso,
  sexoPaciente,
  onRegistrarAchado,
  onClose,
}: Props) {
  const padrao = useMemo(
    () =>
      obterPadraoAuscultaPulmonarPorCaso({
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

  const [pontoAtivo, setPontoAtivo] = useState<LungAuscultationLocation | null>(null);
  const [somAtual, setSomAtual] = useState<LungSoundItem | null>(null);
  const [respostaAluno, setRespostaAluno] = useState<LungSoundType | null>(null);
  const [registrados, setRegistrados] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tipoEsperado: LungSoundType | null = pontoAtivo ? padrao.sonsPorPonto[pontoAtivo] : null;
  const isSilencio = tipoEsperado ? LUNG_SILENT_TYPES.has(tipoEsperado) : false;

  function selecionarPonto(loc: LungAuscultationLocation) {
    const tipo = padrao.sonsPorPonto[loc];
    const som = selecionarSomPulmonar({ tipo, localizacao: loc, sexoPreferido: sexo });
    setPontoAtivo(loc);
    setSomAtual(som);
    setRespostaAluno(null);
    console.log("[AUSCULTA PULMONAR] caso:", caso?.id, "| padrao:", padrao.key, "| ponto:", loc, "| tipo:", tipo, "| audio:", som?.id ?? "(silêncio didático)");
    setTimeout(() => tocar(som), 0);
  }

  function tocar(som: LungSoundItem | null = somAtual) {
    if (!som || !audioRef.current) return; // silêncio didático: não toca nada
    audioRef.current.src = som.audioUrl;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function registrar() {
    if (!pontoAtivo || !respostaAluno || !tipoEsperado) return;
    const loc = pontoAtivo;
    const labelEsperado = LUNG_SOUND_TYPE_LABEL[tipoEsperado];
    const labelAluno =
      OPCOES_RESPOSTA.find((o) => o.valor === respostaAluno)?.label ?? String(respostaAluno);
    const localLabel = LOCATION_LABEL[loc];
    const localFrase = LOCATION_LABEL_FRASE[loc];
    const aceitas = padrao.interpretacoesAceitas ?? [tipoEsperado];
    // A opção única "reduzido/abolido" cobre tanto mv_reduzido quanto mv_abolido.
    const respEquivalentes = respostaAluno === "mv_reduzido" ? ["mv_reduzido", "mv_abolido"] : [respostaAluno];
    const correct = respEquivalentes.some((r) => aceitas.includes(r));

    const achadoClinico = `${labelEsperado} em ${localFrase}.`;
    const resposta =
      `[Ausculta Pulmonar] Local: ${localLabel} (${loc}). ` +
      `Som esperado: ${labelEsperado}. Resposta do aluno: ${labelAluno}. ` +
      `Áudio: ${somAtual ? somAtual.audioFile : "sem áudio (silêncio didático)"}. Achado: ${achadoClinico} ` +
      `Reconhecimento correto: ${correct ? "sim" : "não"}.`;
    const textoRegistro = `[Ausculta Pulmonar] ${loc} — Ausculta pulmonar`;

    onRegistrarAchado({
      location: loc,
      soundType: tipoEsperado,
      soundLabel: labelEsperado,
      audioId: somAtual?.id,
      audioUrl: somAtual?.audioUrl,
      textoRegistro,
      resposta,
    });

    setRegistrados((prev) => new Set(prev).add(loc));
    setPontoAtivo(null);
    setSomAtual(null);
    setRespostaAluno(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ausculta pulmonar</h4>
        {onClose && (
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700">voltar</button>
        )}
      </div>

      <div className="relative w-full rounded-xl border border-slate-200/60 bg-white/50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/boneco/ausculta_fundo_transparente.png"
          alt="Tórax para ausculta pulmonar"
          className="w-full max-h-64 object-contain mx-auto select-none pointer-events-none"
          draggable={false}
        />
        {LUNG_POINTS.map((p) => {
          const ativo = pontoAtivo === p.id;
          const feito = registrados.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => selecionarPonto(p.id)}
              title={p.label}
              aria-label={`Auscultar ${p.label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: 28, height: 28 }}
            >
              <span
                className={`rounded-full border-2 border-white shadow transition-all ${
                  ativo ? "bg-blue-600 ring-4 ring-blue-300/50" : feito ? "bg-emerald-500" : "bg-blue-500/80 hover:scale-110"
                }`}
                style={{ width: 16, height: 16 }}
              />
            </button>
          );
        })}
      </div>

      {!pontoAtivo && <p className="text-xs text-slate-500 text-center">Clique em um ponto para auscultar.</p>}

      <audio ref={audioRef} preload="none" />

      {pontoAtivo && (
        <div className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-3 space-y-2">
          <p className="text-xs font-semibold text-blue-900">
            {LUNG_POINTS.find((p) => p.id === pontoAtivo)?.label} ({pontoAtivo})
          </p>

          {isSilencio ? (
            <div className="rounded-md border border-amber-300/70 bg-amber-50 px-2.5 py-2">
              <p className="text-xs font-semibold text-amber-800">
                {tipoEsperado === "mv_abolido" ? "Murmúrio vesicular abolido." : "Murmúrio vesicular reduzido."}
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">A biblioteca HLS-CMDS não possui este som.</p>
            </div>
          ) : (
            <button onClick={() => tocar()} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
              ▶ Ouvir novamente
            </button>
          )}

          <p className="text-xs text-slate-700 pt-1">O que você auscultou?</p>
          <div className="grid grid-cols-1 gap-1">
            {OPCOES_RESPOSTA.map((o) => (
              <button
                key={o.valor}
                onClick={() => setRespostaAluno(o.valor)}
                className={`text-left text-xs px-2 py-1.5 rounded-md border transition-all ${
                  respostaAluno === o.valor
                    ? "bg-blue-100 border-blue-400 text-blue-900 font-semibold"
                    : "bg-white/70 border-slate-200 text-slate-700 hover:bg-blue-50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* FASE 5 — metadados de treino, revelados após responder */}
          {respostaAluno && (
            <AuscultaSoundMeta
              tipo={LUNG_SOUND_TYPE_LABEL[tipoEsperado!]}
              local={LOCATION_LABEL[pontoAtivo]}
              arquivo={somAtual?.audioFile ?? null}
              origem={somAtual?.sourceCsv ?? "HLS-CMDS"}
              correspondencia={
                somAtual
                  ? somAtual.mappingType === "exact"
                    ? "Correspondência validada"
                    : "Código traduzido C/G → FC/CC"
                  : "Sem áudio (silêncio didático)"
              }
              avisoProxy={padrao.avisoProxy}
            />
          )}

          <button
            onClick={registrar}
            disabled={!respostaAluno}
            className="w-full mt-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all bg-green-500 hover:bg-green-600 disabled:bg-slate-300"
          >
            ✓ Registrar achado
          </button>
        </div>
      )}
    </div>
  );
}
