"use client";

// ============================================================================
// SonsClinicosPage — "Biblioteca de Sons Clínicos" (/centro-clinico/sons).
// Usa EXCLUSIVAMENTE o catálogo canônico gerado dos CSVs reais
// (lib/clinical-sounds/soundsCatalog.ts). O tipo exibido é SEMPRE o do CSV —
// nenhuma correspondência é inventada. Modo Estudo / Treino + filtros por
// categoria, tipo, localização e gênero. Áudios reais de public/HLS-CMDS.
// ============================================================================

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useIniciarOsce } from "@/hooks/useIniciarOsce";
import { CLINICAL_SOUNDS, type ClinicalSound } from "@/lib/clinical-sounds/soundsCatalog";
import "./SonsClinicosPage.css";

// Descrição clínica por TIPO (o tipo vem do CSV; o texto é a descrição
// de livro daquele achado — não altera nem inventa a classificação).
const TYPE_INFO: Record<string, { exp: string; hip: string; prox: string }> = {
  // pulmonar
  "Normal": { exp: "Murmúrio vesicular fisiológico, sem ruídos adventícios.", hip: "Ausculta sem alterações.", prox: "Prosseguir conforme a queixa." },
  "Wheezing": { exp: "Som musical contínuo, predominante na expiração, por estreitamento das vias aéreas.", hip: "Broncoespasmo — asma, DPOC.", prox: "Avaliar gravidade e SatO₂; considerar broncodilatador." },
  "Rhonchi": { exp: "Ruído grave e contínuo, por secreção em vias aéreas maiores; muda com a tosse.", hip: "Secreção brônquica — bronquite, DPOC.", prox: "Higiene brônquica; reauscultar após a tosse." },
  "Fine Crackles": { exp: "Estalidos finos, tele-inspiratórios, tipo “velcro”.", hip: "Edema pulmonar, fibrose ou pneumonia.", prox: "Correlacionar com a clínica; considerar RX de tórax." },
  "Coarse Crackles": { exp: "Estalidos grosseiros, por secreção nas vias aéreas.", hip: "Pneumonia, bronquiectasia ou congestão.", prox: "RX de tórax; avaliar foco infeccioso." },
  "Pleural Rub": { exp: "Som áspero, em “couro”, na inspiração e na expiração, por inflamação pleural.", hip: "Pleurite, TEP ou infecção.", prox: "Investigar a causa; avaliar dor pleurítica." },
  // cardíaco
  "Late Diastolic Murmur": { exp: "Sopro no fim da diástole (pré-sistólico).", hip: "Estenose mitral.", prox: "Ecocardiograma." },
  "Mid Systolic Murmur": { exp: "Sopro mesossistólico, de ejeção, entre B1 e B2.", hip: "Estenose aórtica ou sopro funcional.", prox: "Descrever foco, intensidade e irradiação; considerar eco." },
  "Late Systolic Murmur": { exp: "Sopro no fim da sístole.", hip: "Prolapso/insuficiência mitral.", prox: "Ecocardiograma." },
  "Early Systolic Murmur": { exp: "Sopro no início da sístole.", hip: "Insuficiência mitral aguda ou CIV.", prox: "Ecocardiograma." },
  "Atrial Fibrillation": { exp: "Ritmo irregularmente irregular, sem onda P audível.", hip: "Fibrilação atrial.", prox: "ECG; avaliar FC, causa e anticoagulação." },
  "S3": { exp: "Terceiro som protodiastólico, de baixa frequência.", hip: "Sobrecarga de volume — insuficiência cardíaca.", prox: "Avaliar congestão; ECG e ecocardiograma." },
  "S4": { exp: "Quarto som pré-sistólico, por ventrículo pouco complacente.", hip: "Hipertrofia/isquemia — HAS, doença coronariana.", prox: "ECG; avaliar cardiopatia estrutural." },
  "Tachycardia": { exp: "Frequência cardíaca elevada.", hip: "Taquiarritmia ou resposta compensatória.", prox: "ECG; buscar a causa." },
  "AV Block": { exp: "Pausas ou bradicardia por distúrbio da condução AV.", hip: "Bloqueio atrioventricular.", prox: "ECG; avaliar sintomas e frequência." },
};

// Conceitos que NÃO existem na base HLS-CMDS (nunca misturados aos sons reais).
const SEM_AUDIO = [
  { nome: "Estridor", nota: "Não existe em LS.csv nem nos arquivos LS. Som inspiratório agudo por obstrução de via aérea superior — emergência." },
  { nome: "Atrito pericárdico", nota: "Não existe em HS.csv nem nos arquivos HS. Atenção: “Pleural Rub” na base é atrito PLEURAL (pulmonar), não pericárdico." },
];

const QUESTOES = ["Que som você ouviu?", "Onde ele é melhor auscultado?", "Qual a hipótese clínica?", "Qual o próximo passo?"];

const uniq = (arr: string[]) => Array.from(new Set(arr));

export default function SonsClinicosPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"estudo" | "treino">("estudo");
  const [cat, setCat] = useState<"lung" | "heart">("lung");
  const [tipo, setTipo] = useState<string>("todos");
  const [local, setLocal] = useState<string>("todos");
  const [genero, setGenero] = useState<string>("todos");
  const [revelados, setRevelados] = useState<Record<string, boolean>>({});

  // opções de filtro derivadas do catálogo (só da categoria atual)
  const daCategoria = useMemo(() => CLINICAL_SOUNDS.filter((s) => s.category === cat), [cat]);
  const tipos = useMemo(() => uniq(daCategoria.map((s) => s.originalType)), [daCategoria]);
  const locais = useMemo(() => uniq(daCategoria.map((s) => s.location)), [daCategoria]);

  const lista = useMemo(
    () =>
      daCategoria.filter(
        (s) =>
          (tipo === "todos" || s.originalType === tipo) &&
          (local === "todos" || s.location === local) &&
          (genero === "todos" || s.gender === genero)
      ),
    [daCategoria, tipo, local, genero]
  );

  const trocarCategoria = (c: "lung" | "heart") => {
    setCat(c);
    setTipo("todos");
    setLocal("todos");
    setGenero("todos");
    setRevelados({});
  };
  const trocarModo = (m: "estudo" | "treino") => { setModo(m); setRevelados({}); };

  const { iniciarOSCE, accessModal } = useIniciarOsce();

  const icone = cat === "lung" ? "🫁" : "🫀";

  const mappingBadge = (s: ClinicalSound) =>
    s.mappingType === "exact" ? (
      <span className="snd-map is-exact">correspondência exata</span>
    ) : (
      <span className="snd-map is-tr">código traduzido C/G → FC/CC</span>
    );

  const metaChips = (s: ClinicalSound) => (
    <div className="snd-meta-chips">
      <span className="snd-chip">{s.genderLabel}</span>
      <span className="snd-chip"><b>{s.location}</b> · {s.locationLabel}</span>
      <span className="snd-chip">CSV: {s.csvId}</span>
      <span className="snd-chip">🎵 {s.audioFile}</span>
      {mappingBadge(s)}
    </div>
  );

  return (
    <div className="sons-page">
      {/* ===================== HERO ===================== */}
      <section className="snd-hero">
        <span className="snd-hero-badge"><i />BIBLIOTECA DE SONS</span>
        <h1>Biblioteca de Sons Clínicos</h1>
        <p className="snd-hero-sub">
          Ausculta pulmonar e cardíaca com <strong>áudios reais</strong> da base HLS-CMDS. Cada som
          mostra exatamente o tipo, a localização e o arquivo de origem — sem correspondência inventada.
        </p>
        <p className="snd-hero-src">Fonte: HLS-CMDS (Heart &amp; Lung Sounds) — {CLINICAL_SOUNDS.length} áudios catalogados.</p>
      </section>

      {/* ===================== CONTROLES ===================== */}
      <section>
        <div className="snd-section-head">
          <p className="snd-eyebrow">Interativo</p>
          <h2 className="snd-title">Ausculta guiada</h2>
          <p className="snd-sub">Filtre por categoria, tipo, localização e gênero; ouça direto em cada card.</p>
        </div>

        <div className="snd-controls">
          <div className="snd-modebar snd-glass" role="tablist" aria-label="Modo">
            <button type="button" role="tab" aria-selected={modo === "estudo"} className={`snd-seg${modo === "estudo" ? " is-active" : ""}`} onClick={() => trocarModo("estudo")}>Modo Estudo</button>
            <button type="button" role="tab" aria-selected={modo === "treino"} className={`snd-seg${modo === "treino" ? " is-active" : ""}`} onClick={() => trocarModo("treino")}>Modo Treino</button>
          </div>
          <div className="snd-filterbar snd-glass" role="tablist" aria-label="Categoria">
            <button type="button" role="tab" aria-selected={cat === "lung"} className={`snd-seg${cat === "lung" ? " is-active" : ""}`} onClick={() => trocarCategoria("lung")}>🫁 Pulmonar</button>
            <button type="button" role="tab" aria-selected={cat === "heart"} className={`snd-seg${cat === "heart" ? " is-active" : ""}`} onClick={() => trocarCategoria("heart")}>🫀 Cardíaco</button>
          </div>
        </div>

        <div className="snd-selects">
          <label className="snd-select">
            <span>Tipo</span>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="todos">Todos os tipos</option>
              {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="snd-select">
            <span>{cat === "lung" ? "Localização" : "Foco"}</span>
            <select value={local} onChange={(e) => setLocal(e.target.value)}>
              <option value="todos">Todas</option>
              {locais.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label className="snd-select">
            <span>Gênero</span>
            <select value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </label>
          <span className="snd-count">{lista.length} som(ns)</span>
        </div>

        {/* ===================== GRADE ===================== */}
        <div className="snd-grid">
          {lista.map((s) => {
            const info = TYPE_INFO[s.originalType];
            const player = (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio className="snd-audio" controls preload="none" src={s.audioUrl} />
            );

            if (modo === "estudo") {
              return (
                <article key={s.id} className="snd-card snd-glass">
                  <span className="snd-badge is-estudo">Estudo</span>
                  <div className="snd-card-head">
                    <span className="snd-card-ico" aria-hidden>{icone}</span>
                    <h3>{s.translatedType}</h3>
                  </div>
                  <p className="snd-origtype">{s.originalType} · {s.sourceCsv}</p>
                  {metaChips(s)}
                  {player}
                  {info && <p className="snd-explica">{info.exp}</p>}
                  {info && <div className="snd-meta"><strong>No OSCE:</strong> {info.hip} — {info.prox}</div>}
                </article>
              );
            }

            const revelado = !!revelados[s.id];
            return (
              <article key={s.id} className="snd-card snd-glass">
                <span className="snd-badge is-treino">Treino</span>
                <div className="snd-card-head">
                  <span className="snd-card-ico" aria-hidden>🎧</span>
                  <h3>Som para interpretação</h3>
                </div>
                {player}
                <ul className="snd-quiz">{QUESTOES.map((q) => <li key={q}>{q}</li>)}</ul>
                {!revelado ? (
                  <button type="button" className="snd-reveal-btn" onClick={() => setRevelados((r) => ({ ...r, [s.id]: true }))}>Revelar resposta</button>
                ) : (
                  <div className="snd-answer">
                    <h4>{s.translatedType}</h4>
                    <p className="snd-origtype">{s.originalType} · {s.sourceCsv}</p>
                    {metaChips(s)}
                    {info && <p className="snd-explica">{info.exp}</p>}
                    {info && <div className="snd-meta"><strong>Hipótese:</strong> {info.hip}<br /><strong>Próximo passo:</strong> {info.prox}</div>}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ===================== SEM ÁUDIO ===================== */}
      <section>
        <div className="snd-section-head">
          <p className="snd-eyebrow">Transparência</p>
          <h2 className="snd-title">Conceitos sem áudio nesta base</h2>
          <p className="snd-sub">Achados clinicamente importantes que <strong>não existem</strong> na biblioteca HLS-CMDS — por isso não são exibidos como som real.</p>
        </div>
        <div className="snd-noaudio-grid">
          {SEM_AUDIO.map((c) => (
            <div key={c.nome} className="snd-noaudio snd-glass">
              <div className="snd-noaudio-head"><span aria-hidden>🔇</span><h3>{c.nome}</h3></div>
              <p>{c.nota}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== DICA ===================== */}
      <section className="snd-tip snd-glass">
        <span className="snd-tip-ico" aria-hidden>🩺</span>
        <p><strong>Dica de ausculta:</strong> compare sempre os lados, ausculte em ambiente silencioso e relacione o achado com o foco e com o caso — no OSCE, nomeie o som e diga o que ele muda na conduta.</p>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="snd-cta snd-glass">
        <h2>Agora treine ausculta dentro de um caso</h2>
        <p>Entre em uma estação OSCE, realize o exame físico e interprete os achados no contexto do paciente.</p>
        <div className="snd-cta-actions">
          <button type="button" className="snd-btn snd-btn-primary" onClick={() => iniciarOSCE("adulto")}>Iniciar OSCE Adulto</button>
          <button type="button" className="snd-btn snd-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>Iniciar OSCE Pediátrico</button>
          <button type="button" className="snd-btn snd-btn-ghost" onClick={() => router.push("/centro-clinico")}>Voltar ao Centro Clínico</button>
        </div>
      </section>
      {accessModal}
    </div>
  );
}
