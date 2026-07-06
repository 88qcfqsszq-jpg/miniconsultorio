// ============================================================================
// validate-ausculta-osce.mjs — validador da ausculta dos casos OSCE.
// Percorre todos os casos adultos, reproduz a decisão diagnóstico→som (pulmonar
// e cardíaca) e verifica, contra o catálogo canônico + arquivos reais, se o som
// existe / se é silêncio didático. Não altera nada. Uso: node scripts/validate-ausculta-osce.mjs
// ============================================================================

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// ---- catálogo canônico (fonte única) ----
const catTxt = fs.readFileSync(path.join(ROOT, "lib/clinical-sounds/soundsCatalog.ts"), "utf8");
const marker = "CLINICAL_SOUNDS: ClinicalSound[] = ";
const s0 = catTxt.indexOf("[", catTxt.indexOf(marker) + marker.length);
const s1 = catTxt.indexOf("];", s0) + 1;
const CATALOG = JSON.parse(catTxt.slice(s0, s1));
const LUNG = CATALOG.filter((s) => s.category === "lung");
const HEART = CATALOG.filter((s) => s.category === "heart");

const fileExists = (dir, file) => fs.existsSync(path.join(ROOT, "public/HLS-CMDS", dir, file));

// ---- casos ----
const src = fs.readFileSync(path.join(ROOT, "data/casos-osce.ts"), "utf8");
const grab = (re) => [...src.matchAll(re)].map((m) => m[1]);
const ids = grab(/^\s{4}id:\s*"([^"]+)"/gm);
const titulos = grab(/^\s{4}titulo:\s*"([^"]+)"/gm);
const diags = grab(/diagnosticoCorreto:\s*"([^"]+)"/gm);

const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

// ---- reproduz o mapeamento PULMONAR (dominante) ----
const LUNG_ORIG = { normal: "Normal", wheezing: "Wheezing", rhonchi: "Rhonchi", fine_crackles: "Fine Crackles", coarse_crackles: "Coarse Crackles", pleural_rub: "Pleural Rub" };
function padraoPulmonar(diag, tit) {
  const t = norm(`${diag} ${tit}`);
  const esq = /esquerd|lobo inferior esquerdo|hemitorax esquerdo/.test(t);
  if (/asma|asmatic|broncoespasmo|sibilancia/.test(t)) return { key: "asma", tipo: "wheezing", ponto: "RUA" };
  if (/dpoc|doenca pulmonar obstrutiva|enfisema|bronquite cronica/.test(t)) return { key: "dpoc", tipo: "wheezing", ponto: "RUA" };
  if (/insuficiencia cardiaca|edema pulmonar|congestao pulmonar|\bicc\b|\bic\b|feve/.test(t)) return { key: "edema_ic", tipo: "fine_crackles", ponto: "RLA" };
  if (/pneumonia|\bpac\b|consolidacao/.test(t)) return { key: "pneumonia", tipo: "coarse_crackles", ponto: esq ? "LLA" : "RLA" };
  if (/bronquite|secrecao|secrecoes|hipersecre|tosse produtiva/.test(t)) return { key: "bronquite", tipo: "rhonchi", ponto: "RMA" };
  if (/pleurite|pleuris|atrito pleural|dor pleuritic/.test(t)) return { key: "pleurite", tipo: "pleural_rub", ponto: esq ? "LLA" : "RLA" };
  if (/atelectasia|atelectas/.test(t)) return { key: "atelectasia", tipo: "fine_crackles", ponto: "RLA", proxy: true };
  if (/pneumotorax/.test(t)) return { key: "pneumotorax", tipo: "mv_abolido", ponto: esq ? "LUA" : "RUA", silence: true };
  if (/derrame pleural|efusao pleural|liquido pleural/.test(t)) return { key: "derrame", tipo: "mv_reduzido", ponto: esq ? "LLA" : "RLA", silence: true };
  if (/tuberculose|\btb\b/.test(t)) return { key: "tuberculose", tipo: "coarse_crackles", ponto: "RUA" };
  return { key: "normal", tipo: "normal", ponto: "RUA" };
}

// ---- reproduz o mapeamento CARDÍACO ----
const HEART_ORIG = { normal: "Normal", mid_systolic_murmur: "Mid Systolic Murmur", late_diastolic_murmur: "Late Diastolic Murmur", s3: "S3", atrial_fibrillation: "Atrial Fibrillation" };
function padraoCardiaco(diag, tit) {
  const t = norm(`${diag} ${tit}`);
  if (/estenose aortica|estenose valvar aortica/.test(t)) return { key: "estenose_aortica", tipo: "mid_systolic_murmur", foco: "RUSB" };
  if (/insuficiencia mitral|regurgitacao mitral|insuf.* mitral/.test(t)) return { key: "insuficiencia_mitral", tipo: "mid_systolic_murmur", foco: "Apex" };
  if (/estenose mitral/.test(t)) return { key: "estenose_mitral", tipo: "late_diastolic_murmur", foco: "Apex" };
  if (/endocardite/.test(t)) return { key: "endocardite", tipo: "mid_systolic_murmur", foco: "Apex" };
  if (/fibrilacao atrial|\bfa\b/.test(t)) return { key: "fibrilacao_atrial", tipo: "atrial_fibrillation", foco: "Apex" };
  if (/insuficiencia cardiaca|\bicc\b|\bic\b|edema pulmonar|congestao/.test(t)) return { key: "insuficiencia_cardiaca", tipo: "s3", foco: "Apex" };
  if (/pericardite/.test(t)) return { key: "pericardite", tipo: "pericardial_rub", foco: "LLSB", silence: true };
  return { key: "normal", tipo: "normal", foco: "Apex" };
}

function resolveLung(p) {
  if (p.silence) return { silence: true, file: null, ok: true, motivo: "silêncio didático (sem áudio na base)" };
  const orig = LUNG_ORIG[p.tipo];
  const cand = LUNG.find((s) => s.originalType === orig && s.location === p.ponto) || LUNG.find((s) => s.originalType === orig);
  if (!cand) return { silence: false, file: null, ok: false, motivo: "tipo sem som no catálogo" };
  const exists = fileExists("LS", cand.audioFile);
  return { silence: false, file: cand.audioFile, ok: exists, motivo: exists ? "arquivo existe" : "ARQUIVO AUSENTE" };
}
function resolveHeart(p) {
  if (p.silence) return { silence: true, file: null, ok: true, motivo: "silêncio didático (sem áudio na base)" };
  const orig = HEART_ORIG[p.tipo];
  const cand = HEART.find((s) => s.originalType === orig && (s.location === p.foco || (p.foco === "Apex" && s.location === "A"))) || HEART.find((s) => s.originalType === orig);
  if (!cand) return { silence: false, file: null, ok: false, motivo: "tipo sem som no catálogo" };
  const exists = fileExists("HS", cand.audioFile);
  return { silence: false, file: cand.audioFile, ok: exists, motivo: exists ? "arquivo existe" : "ARQUIVO AUSENTE" };
}

const rows = [];
let okCount = 0, silenceLung = 0, silenceHeart = 0, proxy = 0, realLung = 0, realHeart = 0, fail = 0;
const n = ids.length;
for (let i = 0; i < n; i++) {
  const diag = diags[i] || titulos[i] || "?";
  const pl = padraoPulmonar(diags[i] || "", titulos[i] || "");
  const ca = padraoCardiaco(diags[i] || "", titulos[i] || "");
  const rl = resolveLung(pl);
  const rh = resolveHeart(ca);
  if (pl.proxy) proxy++;
  if (rl.silence) silenceLung++; else if (pl.key !== "normal" && rl.ok) realLung++;
  if (rh.silence) silenceHeart++; else if (ca.key !== "normal" && rh.ok) realHeart++;
  const ok = rl.ok && rh.ok;
  if (ok) okCount++; else fail++;
  rows.push({ id: ids[i], diag, lungKey: pl.key, lungFile: rl.file, lungOk: rl.ok, lungMot: rl.motivo, proxy: !!pl.proxy, heartKey: ca.key, heartFile: rh.file, heartOk: rh.ok, heartMot: rh.motivo, ok });
}

console.log(`Casos auditados: ${n}`);
console.log(`Resultado OK: ${okCount} | FALHAS: ${fail}`);
console.log(`Pulmonar: patológico com áudio real=${realLung} | silêncio didático=${silenceLung} | proxy=${proxy}`);
console.log(`Cardíaco: patológico com áudio real=${realHeart} | silêncio didático=${silenceHeart}`);
console.log("\n== Casos não-normais (pulmonar ou cardíaco) ==");
rows.filter((r) => r.lungKey !== "normal" || r.heartKey !== "normal").forEach((r) => {
  const l = r.lungKey !== "normal" ? `PULM ${r.lungKey}→${r.lungFile || "silêncio"}(${r.lungOk ? "OK" : "FALHA"})` : "";
  const h = r.heartKey !== "normal" ? `CARD ${r.heartKey}→${r.heartFile || "silêncio"}(${r.heartOk ? "OK" : "FALHA"})` : "";
  console.log(`  [${r.id}] ${r.diag} | ${[l, h].filter(Boolean).join(" | ")}`);
});
if (fail > 0) { console.error("\n❌ Há falhas de arquivo!"); process.exitCode = 1; }
else console.log("\n✅ Todos os casos resolvem para áudio real existente OU silêncio didático explícito.");

fs.writeFileSync("/tmp/ausculta-validation.json", JSON.stringify({ n, okCount, fail, realLung, silenceLung, proxy, realHeart, silenceHeart, rows }, null, 2));
