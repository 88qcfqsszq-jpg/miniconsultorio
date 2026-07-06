// ============================================================================
// gen-sounds-catalog.mjs — gera o catálogo canônico de sons clínicos a partir
// dos CSVs REAIS (docs/LS.csv, docs/HS.csv) e verifica cada .wav em
// public/HLS-CMDS/LS|HS. Aplica o mapa de código C→FC / G→CC (crepitações)
// exatamente como consta na base. NÃO inventa correspondência: se um arquivo
// não existir, aborta com erro (nenhum som "aproximado").
//
// Saída: lib/clinical-sounds/soundsCatalog.ts
// Uso: node scripts/gen-sounds-catalog.mjs
// ============================================================================

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "lib/clinical-sounds/soundsCatalog.ts");

// ---- tradução PT-BR dos tipos (o originalType do CSV é preservado sempre) ----
const LUNG_PT = {
  "Normal": "Normal (murmúrio vesicular)",
  "Wheezing": "Sibilos",
  "Rhonchi": "Roncos",
  "Fine Crackles": "Crepitações finas",
  "Coarse Crackles": "Crepitações grossas",
  "Pleural Rub": "Atrito pleural",
};
const HEART_PT = {
  "Normal": "Normal (B1 e B2)",
  "Late Diastolic Murmur": "Sopro diastólico tardio",
  "Mid Systolic Murmur": "Sopro mesossistólico",
  "Late Systolic Murmur": "Sopro sistólico tardio",
  "Early Systolic Murmur": "Sopro protossistólico",
  "Atrial Fibrillation": "Fibrilação atrial",
  "S3": "B3 (terceira bulha)",
  "S4": "B4 (quarta bulha)",
  "Tachycardia": "Taquicardia",
  "AV Block": "Bloqueio AV",
};

const GENDER_PT = { M: "Masculino", F: "Feminino" };

function lungLocationLabel(code) {
  const side = code[0] === "R" ? "direito" : code[0] === "L" ? "esquerdo" : "";
  const level = code[1] === "U" ? "superior" : code[1] === "M" ? "médio" : code[1] === "L" ? "inferior" : "";
  if (!side || !level) return code;
  return `Terço ${level} ${side} (anterior)`;
}
const HEART_LOC = {
  RUSB: "Foco aórtico (BED superior)",
  LUSB: "Foco pulmonar (BEE superior)",
  LLSB: "Foco tricúspide (BEE inferior)",
  Apex: "Foco mitral (ápice)",
  A: "Foco mitral (ápice)",
  RC: "Carótida direita",
  LC: "Carótida esquerda",
};

function parseCsv(file) {
  const raw = fs.readFileSync(file, "utf8");
  return raw
    .split(/\r?\n/)
    .slice(1) // remove header
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((c) => c.trim());
      return { gender: parts[0], type: parts[1], location: parts[2], id: parts[3] };
    });
}

// Traduz o csvId (crepitações) para o nome real do arquivo.
function resolveAudioFile(category, type, csvId) {
  if (category === "lung") {
    if (type === "Fine Crackles") return { file: csvId.replace("_C_", "_FC_"), mapping: "translated-code" };
    if (type === "Coarse Crackles") return { file: csvId.replace("_G_", "_CC_"), mapping: "translated-code" };
  }
  return { file: csvId, mapping: "exact" };
}

function build(category, csvFile, dir, ptMap) {
  const rows = parseCsv(csvFile);
  const problemas = [];
  const entries = rows.map((r) => {
    const csvId = r.id.replace(/\s+/g, ""); // trim de espaços internos, ex.: " M_W_LMA"
    const { file, mapping } = resolveAudioFile(category, r.type, csvId);
    const abs = path.join(ROOT, "public/HLS-CMDS", dir, `${file}.wav`);
    if (!fs.existsSync(abs)) problemas.push({ csvId, file, type: r.type });
    const translatedType = ptMap[r.type] || r.type;
    const locationLabel = category === "lung" ? lungLocationLabel(r.location) : (HEART_LOC[r.location] || r.location);
    return {
      id: `${category}-${csvId}`,
      category,
      gender: r.gender,
      genderLabel: GENDER_PT[r.gender] || r.gender,
      originalType: r.type,
      translatedType,
      location: r.location,
      locationLabel,
      csvId,
      audioFile: `${file}.wav`,
      audioUrl: `/HLS-CMDS/${dir}/${file}.wav`,
      mappingType: mapping,
      sourceCsv: category === "lung" ? "LS.csv" : "HS.csv",
    };
  });
  return { entries, problemas };
}

const lung = build("lung", path.join(ROOT, "docs/LS.csv"), "LS", LUNG_PT);
const heart = build("heart", path.join(ROOT, "docs/HS.csv"), "HS", HEART_PT);

const problemas = [...lung.problemas, ...heart.problemas];
if (problemas.length) {
  console.error("❌ Arquivos .wav faltando (correspondência NÃO segura):");
  for (const p of problemas) console.error(`  ${p.csvId} (${p.type}) -> ${p.file}.wav`);
  process.exit(1);
}

const all = [...lung.entries, ...heart.entries];
const traduzidos = all.filter((e) => e.mappingType === "translated-code").length;

const header = `// ============================================================================
// soundsCatalog.ts — CATÁLOGO CANÔNICO de sons clínicos (HLS-CMDS).
// GERADO automaticamente por scripts/gen-sounds-catalog.mjs a partir de
// docs/LS.csv, docs/HS.csv e dos arquivos reais em public/HLS-CMDS/LS|HS.
// NÃO EDITAR À MÃO. Nenhuma correspondência é inventada: o tipo é sempre o do
// CSV; crepitações usam o mapa de código C→FC e G→CC (arquivos reais).
//
// Total: ${all.length} sons (${lung.entries.length} pulmonares + ${heart.entries.length} cardíacos).
// Correspondência exata: ${all.length - traduzidos} | código traduzido (C/G→FC/CC): ${traduzidos}.
// ============================================================================

export type ClinicalSoundCategory = "lung" | "heart";
export type ClinicalSoundMapping = "exact" | "translated-code";

export interface ClinicalSound {
  id: string;
  category: ClinicalSoundCategory;
  gender: "M" | "F";
  genderLabel: string;
  originalType: string;
  translatedType: string;
  location: string;
  locationLabel: string;
  csvId: string;
  audioFile: string;
  audioUrl: string;
  mappingType: ClinicalSoundMapping;
  sourceCsv: "LS.csv" | "HS.csv";
}

export const CLINICAL_SOUNDS: ClinicalSound[] = ${JSON.stringify(all, null, 2)};

export const LUNG_SOUNDS = CLINICAL_SOUNDS.filter((s) => s.category === "lung");
export const HEART_SOUNDS = CLINICAL_SOUNDS.filter((s) => s.category === "heart");
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header, "utf8");

console.log(`✅ Catálogo gerado: ${path.relative(ROOT, OUT)}`);
console.log(`   Pulmonares: ${lung.entries.length} | Cardíacos: ${heart.entries.length} | Total: ${all.length}`);
console.log(`   Exatos: ${all.length - traduzidos} | Traduzidos (C/G→FC/CC): ${traduzidos}`);
