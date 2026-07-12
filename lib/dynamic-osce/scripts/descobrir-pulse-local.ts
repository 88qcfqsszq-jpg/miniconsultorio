#!/usr/bin/env tsx
// ============================================================================
// Casos OSCE Dinâmicos — Beta · DESCOBRIR PULSE LOCAL (Fase 7)
// ----------------------------------------------------------------------------
// Inspeciona .reference-local/engine-stable e imprime diagnóstico completo.
// NÃO executa o Pulse. NÃO conecta à rede. READ-ONLY.
//
// Exit 0 → root encontrado E pelo menos 1 cenário de asma encontrado.
// Exit 1 → root não encontrado OU nenhum cenário de asma.
// ============================================================================

import { discoverLocalPulseInstallation } from "../pulse/pulse-local-discovery";

console.log("=".repeat(70));
console.log("DESCOBRIR PULSE LOCAL — Fase 7");
console.log("=".repeat(70));

const result = discoverLocalPulseInstallation();

// ---------------------------------------------------------------------------
// Root e Python API
// ---------------------------------------------------------------------------
console.log("\n── Status da instalação " + "─".repeat(46));
console.log(`  Pulse encontrado: ${result.found ? "✅ SIM" : "❌ NÃO"}`);
if (result.rootPath) {
  console.log(`  Root:             ${result.rootPath}`);
}
if (result.pythonApiPath) {
  console.log(`  Python API:       ${result.pythonApiPath}`);
}

// ---------------------------------------------------------------------------
// Executáveis candidatos
// ---------------------------------------------------------------------------
console.log("\n── Executáveis / scripts de entrada " + "─".repeat(34));
if (result.executableCandidates.length === 0) {
  console.log("  (nenhum encontrado)");
} else {
  result.executableCandidates.slice(0, 10).forEach((e) => console.log(`  • ${e}`));
  if (result.executableCandidates.length > 10) {
    console.log(`  ... e mais ${result.executableCandidates.length - 10} arquivo(s)`);
  }
}

// ---------------------------------------------------------------------------
// HowTo files
// ---------------------------------------------------------------------------
console.log("\n── HowTo files " + "─".repeat(55));
if (result.howtoFiles.length === 0) {
  console.log("  (nenhum encontrado)");
} else {
  result.howtoFiles.slice(0, 10).forEach((h) => console.log(`  • ${h}`));
}

// ---------------------------------------------------------------------------
// Cenários de asma (prioridade máxima)
// ---------------------------------------------------------------------------
console.log("\n── Cenários de asma encontrados " + "─".repeat(38));
if (result.asthmaScenarioCandidates.length === 0) {
  console.log("  ❌ Nenhum cenário de asma encontrado.");
} else {
  result.asthmaScenarioCandidates.forEach((s) => console.log(`  ✅ ${s}`));
}

// ---------------------------------------------------------------------------
// Cenários totais (sumário)
// ---------------------------------------------------------------------------
console.log("\n── Cenários totais " + "─".repeat(51));
console.log(`  Total de cenários JSON: ${result.scenarioCandidates.length}`);
if (result.scenarioCandidates.length <= 20) {
  result.scenarioCandidates.forEach((s) => console.log(`  • ${s}`));
} else {
  result.scenarioCandidates.slice(0, 10).forEach((s) => console.log(`  • ${s}`));
  console.log(`  ... e mais ${result.scenarioCandidates.length - 10} cenário(s)`);
}

// ---------------------------------------------------------------------------
// State files
// ---------------------------------------------------------------------------
console.log("\n── Arquivos de estado inicial (.json states) " + "─".repeat(26));
if (result.stateFiles.length === 0) {
  console.log("  (nenhum encontrado)");
} else {
  result.stateFiles.slice(0, 5).forEach((s) => console.log(`  • ${s}`));
  if (result.stateFiles.length > 5) {
    console.log(`  ... e mais ${result.stateFiles.length - 5}`);
  }
}

// ---------------------------------------------------------------------------
// Notas
// ---------------------------------------------------------------------------
if (result.notes.length > 0) {
  console.log("\n── Notas " + "─".repeat(61));
  result.notes.forEach((n) => console.log(`  ℹ  ${n}`));
}

// ---------------------------------------------------------------------------
// Warnings
// ---------------------------------------------------------------------------
if (result.warnings.length > 0) {
  console.log("\n── Avisos " + "─".repeat(60));
  result.warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
}

// ---------------------------------------------------------------------------
// Resumo e critério de saída
// ---------------------------------------------------------------------------
const ok = result.found && result.asthmaScenarioCandidates.length > 0;

console.log("\n" + "=".repeat(70));
if (ok) {
  console.log(
    `RESUMO: ✅ Pulse encontrado. ` +
      `${result.asthmaScenarioCandidates.length} cenário(s) de asma disponíveis.`
  );
  console.log("Pronto para Fase 8 (execução real) assim que PyPulse for compilado.");
} else if (!result.found) {
  console.error("RESUMO: ❌ Pulse NÃO encontrado. Verificar .reference-local/engine-stable.");
} else {
  console.error(
    "RESUMO: ❌ Pulse encontrado mas SEM cenários de asma. Verificar data/human/adult/scenarios/."
  );
}
console.log("=".repeat(70));

process.exit(ok ? 0 : 1);
