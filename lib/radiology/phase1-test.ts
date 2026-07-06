/**
 * Testes Manuais para Fase 1: TB + PAC
 *
 * Executar:
 * node -r ts-node/register lib/radiology/phase1-test.ts
 *
 * ou
 *
 * ts-node lib/radiology/phase1-test.ts
 */

import {
  resolveDiagnosisForPhase1,
  applyPhase1Scoring,
  isPhase1Mapped,
  listPhase1Diagnoses,
} from "./phase1-integration";
import { scoreOpenIImage } from "./open-i-score";
import { getDiagnosisConfig } from "./diagnoses-open-i-mapping";

// ============================================================================
// TESTE 1: Resolver diagnósticos
// ============================================================================
export function testResolveDiagnosis() {
  console.log("\n=== TESTE 1: Resolver Diagnósticos ===\n");

  const testCases = [
    "Pneumonia adquirida na comunidade",
    "PAC",
    "Pneumonia bacteriana",
    "Tuberculose pulmonar",
    "TB",
    "tuberculosis",
    "Asma", // Não mapeado em P0
    "DPOC", // Não mapeado em P0
  ];

  testCases.forEach((diagnosis) => {
    console.log(`Diagnóstico: "${diagnosis}"`);
    const result = resolveDiagnosisForPhase1(diagnosis);

    if ("error" in result) {
      console.log(`  ❌ Erro: ${result.error}`);
    } else {
      console.log(`  ✅ Mapeado para: ${result.diagnosisKey}`);
      console.log(`     Min Score: ${result.config.min_score}`);
    }
  });
}

// ============================================================================
// TESTE 2: Validar mapeamentos
// ============================================================================
export function testPhase1Mapped() {
  console.log("\n=== TESTE 2: Validar Mapeamentos ===\n");

  const diagnoses = [
    "Pneumonia adquirida na comunidade",
    "Tuberculose pulmonar",
    "Asma aguda",
    "DPOC",
  ];

  diagnoses.forEach((diag) => {
    const isMapped = isPhase1Mapped(diag);
    console.log(`"${diag}": ${isMapped ? "✅ Mapeado" : "❌ Não mapeado"}`);
  });
}

// ============================================================================
// TESTE 3: Listar diagnósticos P0
// ============================================================================
export function testListPhase1() {
  console.log("\n=== TESTE 3: Diagnósticos P0 Disponíveis ===\n");

  const diagnoses = listPhase1Diagnoses();
  diagnoses.forEach((diag) => {
    console.log(`📋 ${diag.diagnosisKey}`);
    console.log(`   PT-BR: ${diag.aliases_pt.slice(0, 2).join(", ")}`);
    console.log(`   EN: ${diag.aliases_en.slice(0, 2).join(", ")}`);
    console.log(`   Score Mín: ${diag.minScore}`);
  });
}

// ============================================================================
// TESTE 4: Scoring de imagens (PNEUMONIA)
// ============================================================================
export function testScoringPneumonia() {
  console.log(
    "\n=== TESTE 4: Scoring de Imagens - PNEUMONIA ===\n"
  );

  const config = getDiagnosisConfig("pneumonia");
  if (!config) {
    console.log("❌ Config não encontrada");
    return;
  }

  // Imagem BOA para pneumonia
  const imagemBoa = {
    id: "openi-good-pneumonia",
    impression: "Left lower lobe consolidation consistent with pneumonia.",
    findings:
      "There is consolidation in the left lower lobe with airspace opacity.",
    problems: ["pneumonia", "consolidation", "left lower lobe"],
    meshTerms: ["pneumonia", "radiography"],
    caption: "Patient with pneumonia",
    title: "CXR: Pneumonia",
  };

  console.log("Imagem BOA:");
  const scoreGood = scoreOpenIImage(imagemBoa, config);
  console.log(`  Score: ${scoreGood.totalScore}/${config.min_score}`);
  console.log(`  Termos Positivos: ${scoreGood.termsFound.strongPositive.length}`);
  console.log(`  Aprovada: ${!scoreGood.isRejected ? "✅ SIM" : "❌ NÃO"}`);

  // Imagem MÁ para pneumonia (normal)
  const imagemMa = {
    id: "openi-bad-pneumonia-normal",
    impression: "Normal chest radiograph. No acute findings.",
    findings: "No focal abnormalities. Clear lungs.",
    problems: [],
    meshTerms: ["normal"],
    caption: "Normal study",
    title: "Normal CXR",
  };

  console.log("\nImagem MÁ (RX Normal):");
  const scoreBad = scoreOpenIImage(imagemMa, config);
  console.log(`  Score: ${scoreBad.totalScore}/${config.min_score}`);
  console.log(`  Bloqueadores: ${scoreGood.termsFound.blockers.length}`);
  console.log(`  Aprovada: ${!scoreBad.isRejected ? "✅ SIM" : "❌ NÃO"}`);
}

// ============================================================================
// TESTE 5: Scoring de imagens (TUBERCULOSE)
// ============================================================================
export function testScoringTuberculosis() {
  console.log("\n=== TESTE 5: Scoring de Imagens - TUBERCULOSE ===\n");

  const config = getDiagnosisConfig("tuberculosis");
  if (!config) {
    console.log("❌ Config não encontrada");
    return;
  }

  // Imagem BOA para TB
  const imagemBoa = {
    id: "openi-good-tb",
    impression:
      "Right upper lobe cavitary lesion consistent with tuberculosis. Apical infiltrate.",
    findings:
      "There is cavitation in the right upper lobe with opacity and consolidation.",
    problems: ["tuberculosis", "cavitary", "upper lobe", "apical infiltrate"],
    meshTerms: ["tuberculosis", "cavitation"],
    caption: "Patient with pulmonary tuberculosis",
    title: "CXR: TB",
  };

  console.log("Imagem BOA:");
  const scoreGood = scoreOpenIImage(imagemBoa, config);
  console.log(`  Score: ${scoreGood.totalScore}/${config.min_score}`);
  console.log(
    `  Termos Fortes: ${scoreGood.termsFound.strongPositive.join(", ").substring(0, 50)}...`
  );
  console.log(`  Aprovada: ${!scoreGood.isRejected ? "✅ SIM" : "❌ NÃO"}`);

  // Imagem MÁ para TB (normal)
  const imagemMa = {
    id: "openi-bad-tb-normal",
    impression: "Normal chest radiograph.",
    findings: "No focal abnormalities.",
    problems: [],
    meshTerms: ["normal"],
    caption: "Normal study",
    title: "Normal CXR",
  };

  console.log("\nImagem MÁ (RX Normal):");
  const scoreBad = scoreOpenIImage(imagemMa, config);
  console.log(`  Score: ${scoreBad.totalScore}/${config.min_score}`);
  console.log(`  Bloqueadores: ${scoreBad.termsFound.blockers.join(", ")}`);
  console.log(`  Aprovada: ${!scoreBad.isRejected ? "✅ SIM" : "❌ NÃO"}`);
}

// ============================================================================
// TESTE 6: Aplicar Scoring em Array de Imagens
// ============================================================================
export function testApplyPhase1Scoring() {
  console.log("\n=== TESTE 6: Aplicar Scoring em Array (PAC) ===\n");

  const images = [
    {
      id: "1",
      impression: "Left lower lobe consolidation. Pneumonia.",
      findings: "Consolidation with airspace opacity",
      problems: ["pneumonia", "consolidation"],
      meshTerms: ["pneumonia"],
      caption: "Pneumonia",
      title: "CXR: Pneumonia",
      imageUrl: "https://example.com/1.jpg",
    },
    {
      id: "2",
      impression: "Normal chest radiograph.",
      findings: "No abnormalities",
      problems: [],
      meshTerms: ["normal"],
      caption: "Normal",
      title: "Normal CXR",
      imageUrl: "https://example.com/2.jpg",
    },
    {
      id: "3",
      impression: "Right lower lobe infiltrate with consolidation.",
      findings: "Airspace opacity, right lower lobe",
      problems: ["infiltrate", "consolidation"],
      meshTerms: ["pneumonia"],
      caption: "Pneumonia RLL",
      title: "CXR: RLL Pneumonia",
      imageUrl: "https://example.com/3.jpg",
    },
  ];

  const result = applyPhase1Scoring(images, "Pneumonia adquirida na comunidade");

  if ("error" in result) {
    console.log(`❌ Erro: ${result.error}`);
  } else {
    console.log(
      `Diagnóstico: ${result.summary.diagnosisKey}`
    );
    console.log(
      `Total: ${result.summary.totalImages} | Aprovadas: ${result.summary.approvedCount} | Rejeitadas: ${result.summary.rejectedCount}`
    );
    console.log(
      `\n✅ Aprovadas:`
    );
    result.approved.forEach((item) => {
      console.log(
        `  ${item.image.id}: Score ${item.score.totalScore}`
      );
    });
    console.log(
      `\n❌ Rejeitadas:`
    );
    result.rejected.forEach((item) => {
      console.log(
        `  ${item.image.id}: ${item.reason}`
      );
    });
  }
}

// ============================================================================
// EXECUTAR TODOS OS TESTES
// ============================================================================
export function runAllTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════╗");
  console.log("║   TESTES FASE 1: TB + PAC             ║");
  console.log("╚════════════════════════════════════════╝");

  try {
    testResolveDiagnosis();
    testPhase1Mapped();
    testListPhase1();
    testScoringPneumonia();
    testScoringTuberculosis();
    testApplyPhase1Scoring();

    console.log("\n");
    console.log("✅ TODOS OS TESTES CONCLUÍDOS");
    console.log("\n");
  } catch (erro) {
    console.error("\n❌ ERRO NOS TESTES:", erro);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests();
}
