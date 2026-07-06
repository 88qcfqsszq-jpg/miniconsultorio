// ============================================================================
// LaboratoryEngine — MOTOR CENTRAL de exames laboratoriais
// ----------------------------------------------------------------------------
// generateLabs({ caso, requestedTests }) → gera apenas os exames pedidos, de
// forma determinística por caseId e coerente com a patologia (via tag clínica
// única). Preparado para receber novos módulos (líquor, sorologias, etc.) sem
// refatorar: basta registrar em LAB_TESTS. PURO: sem IA, sem rede.
// ============================================================================

import type { LabContext, LabPanelResult } from "@/src/lab/labTypes";
import { resolveClinicalTag, gravidadeDaTag, dadosPaciente } from "@/src/lab/labProfiles";
import { mulberry32, hashSeed } from "@/src/lab/labUtils";
import { generateHemogramaPanel } from "@/src/lab/modules/hemograma/generate";
import { generateRenal } from "@/src/lab/modules/renal/generate";
import { generateElectrolytes } from "@/src/lab/modules/electrolytes/generate";
import { generateInflammation } from "@/src/lab/modules/inflammation/generate";
import { generateGasometry } from "@/src/lab/modules/gasometry/generate";
import { generateCardiac } from "@/src/lab/modules/cardiac/generate";
import { generateHepatic } from "@/src/lab/modules/hepatic/generate";
import { generateCoagulation } from "@/src/lab/modules/coagulation/generate";
import { generateUrinalysis } from "@/src/lab/modules/urinalysis/generate";

export interface LabTestDef {
  id: string;
  label: string;
  icon: string;
  iconSrc: string;
  iconAlt: string;
  generate: (ctx: LabContext) => LabPanelResult;
}

/** Registro de exames disponíveis NESTA fase. Adicionar novos aqui (escalável). */
export const LAB_TESTS: LabTestDef[] = [
  { id: "hemograma", label: "Hemograma", icon: "🩸", iconSrc: "/assets/lab-icons/01_hemograma.png", iconAlt: "Ícone de hemograma", generate: generateHemogramaPanel },
  { id: "renal", label: "Função renal", icon: "💧", iconSrc: "/assets/lab-icons/02_funcao_renal.png", iconAlt: "Ícone de função renal", generate: generateRenal },
  { id: "electrolytes", label: "Eletrólitos", icon: "🧂", iconSrc: "/assets/lab-icons/03_eletrolitos.png", iconAlt: "Ícone de eletrólitos", generate: generateElectrolytes },
  { id: "inflammation", label: "Marcadores inflamatórios", icon: "🔥", iconSrc: "/assets/lab-icons/04_marcadores_inflamatorios.png", iconAlt: "Ícone de marcadores inflamatórios", generate: generateInflammation },
  { id: "gasometry", label: "Gasometria", icon: "🫁", iconSrc: "/assets/lab-icons/05_gasometria.png", iconAlt: "Ícone de gasometria", generate: generateGasometry },
  { id: "cardiac", label: "Marcadores cardíacos", icon: "❤️", iconSrc: "/assets/lab-icons/06_marcadores_cardiacos.png", iconAlt: "Ícone de marcadores cardíacos", generate: generateCardiac },
  { id: "hepatic", label: "Função hepática", icon: "🩺", iconSrc: "/assets/lab-icons/07_funcao_hepatica.png", iconAlt: "Ícone de função hepática", generate: generateHepatic },
  { id: "coagulation", label: "Coagulograma", icon: "🩸", iconSrc: "/assets/lab-icons/08_coagulograma.png", iconAlt: "Ícone de coagulograma", generate: generateCoagulation },
  { id: "urinalysis", label: "Urina tipo 1", icon: "🧫", iconSrc: "/assets/lab-icons/09_urina_tipo_1.png", iconAlt: "Ícone de urina tipo 1", generate: generateUrinalysis },
];

export interface GenerateLabsInput {
  caso: any;
  requestedTests?: string[];
}

/** Gera os laudos solicitados (ou todos). Determinístico e coerente por caso. */
export function generateLabs({ caso, requestedTests }: GenerateLabsInput): Record<string, LabPanelResult> {
  const tag = resolveClinicalTag(caso);
  const gravidade = gravidadeDaTag(tag);
  const paciente = dadosPaciente(caso);
  const caseId = String(caso?.id ?? caso?.paciente?.id ?? "caso");
  const ids = requestedTests ?? LAB_TESTS.map((t) => t.id);
  const out: Record<string, LabPanelResult> = {};
  for (const t of LAB_TESTS) {
    if (!ids.includes(t.id)) continue;
    const rnd = mulberry32(hashSeed(`${caseId}|${t.id}|${tag}`));
    const ctx: LabContext = { caso, caseId, idade: paciente.idade, sexo: paciente.sexo, tag, gravidade, rnd, paciente };
    out[t.id] = t.generate(ctx);
  }
  return out;
}
