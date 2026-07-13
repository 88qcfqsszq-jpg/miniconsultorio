import "server-only";
import { readFileSync } from "fs";
import { join } from "path";
import { parseMdTrail } from "./md-parser";
import { trilhaHipoxemia } from "./trilhas/hipoxemia";
import type { LearnTrailData } from "./types";

const CONTENT_DIR = join(process.cwd(), "content", "learn");

const SYSTEM_BADGES: Record<string, string> = {
  respiratorio: "Respiratório",
  cardiovascular: "Cardiovascular",
  infectologia: "Infectologia",
  neurologia: "Neurologia",
  "gastro-abdome": "Gastro/Abdome",
  "semiologia-geral": "Semiologia Geral",
  "raciocinio-clinico": "Raciocínio Clínico",
};

export function loadTrail(systemId: string, trailId: string): LearnTrailData {
  if (systemId === "respiratorio" && trailId === "hipoxemia") {
    return trilhaHipoxemia;
  }
  const filePath = join(CONTENT_DIR, systemId, `${trailId}.md`);
  const content = readFileSync(filePath, "utf-8");
  return parseMdTrail(content, systemId, trailId, SYSTEM_BADGES[systemId] ?? systemId);
}
