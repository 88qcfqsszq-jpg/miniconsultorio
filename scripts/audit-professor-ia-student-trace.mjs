// ============================================================================
// Auditoria de Regressão — StudentTrace / elogios falsos (Fase 22)
// ----------------------------------------------------------------------------
// Garante que o Professor IA NÃO elogia ação que o aluno não fez. Lê os 4
// fixtures de ProfessorLesson (cenários A/B/C/D) e faz asserções ESTRUTURAIS
// (determinísticas) sobre openingLine + acknowledge + studentBase. Opcional:
// também bate no endpoint /api/professor-ia e verifica o guardrail.
//
// Uso: node scripts/audit-professor-ia-student-trace.mjs   (AUDIT_PORT p/ endpoint)
// ============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEUTRAL = "Vamos revisar seu atendimento e corrigir o ponto mais importante com segurança.";
const AUSCULTA = /auscult|crepit|ouviu|escutou o pulm|examinou o t[óo]rax/i;
const RX = /solicitou (o )?rx|pediu (a )?radiograf|solicitou radiograf|solicitou radiografia/i;

function ler(nome) {
  return JSON.parse(fs.readFileSync(path.join(root, "scripts/fixtures", nome), "utf8"));
}

// Reúne TODO o texto que funciona como elogio na lição (opening + acknowledge + forças).
function textoDeElogio(lesson) {
  const ack = (lesson.lessonFlow?.steps ?? [])
    .filter((s) => s.type === "acknowledge_strength")
    .map((s) => `${s.title} ${s.goal} ${s.staticPreviewText || ""}`);
  return [lesson.openingLine?.texto || "", ...(lesson.studentBase?.confirmedStrengths ?? []), ...ack].join(" \n ");
}

const casos = [
  {
    nome: "A — sem ausculta (fez dx+conduta)", arquivo: "trace-A-sem-ausculta.json",
    checks: (l, elogio) => [
      ["NÃO elogia ausculta", !AUSCULTA.test(elogio)],
      ["forbiddenPraise inclui 'auscultou'", (l.studentBase?.forbiddenPraise ?? []).includes("auscultou")],
      ["tem alguma força real (dx/conduta)", (l.studentBase?.confirmedStrengths ?? []).length > 0],
    ],
  },
  {
    nome: "B — RX apenas (sem ausculta)", arquivo: "trace-B-rx-apenas.json",
    checks: (l, elogio) => [
      ["pode elogiar RX", RX.test(elogio)],
      ["NÃO elogia ausculta", !AUSCULTA.test(elogio)],
      ["forbiddenPraise inclui 'auscultou'", (l.studentBase?.forbiddenPraise ?? []).includes("auscultou")],
    ],
  },
  {
    nome: "C — ausculta comprovada", arquivo: "trace-C-com-ausculta.json",
    checks: (l, elogio) => [
      ["elogia ausculta (permitido, há evidência)", AUSCULTA.test(elogio)],
      ["forbiddenPraise NÃO inclui 'auscultou'", !(l.studentBase?.forbiddenPraise ?? []).includes("auscultou")],
    ],
  },
  {
    nome: "D — sem StudentTrace", arquivo: "trace-D-sem-trace.json",
    checks: (l, elogio) => [
      ["opening é NEUTRO", (l.openingLine?.texto || "") === NEUTRAL],
      ["sem elogio específico (nenhuma força)", (l.studentBase?.confirmedStrengths ?? []).length === 0],
      ["nenhum step acknowledge_strength", !(l.lessonFlow?.steps ?? []).some((s) => s.type === "acknowledge_strength")],
      ["NÃO elogia ausculta", !AUSCULTA.test(elogio)],
    ],
  },
];

const L = "─".repeat(72);
console.log(L);
console.log("AUDITORIA DE REGRESSÃO — StudentTrace (Fase 22): 'auscultou' sem evidência?");
console.log(L);

let totalChecks = 0, passados = 0;
const resultados = [];
for (const c of casos) {
  const lesson = ler(c.arquivo);
  const elogio = textoDeElogio(lesson);
  const checks = c.checks(lesson, elogio);
  console.log(`\n[${c.nome}]`);
  console.log(`   opening: "${(lesson.openingLine?.texto || "").slice(0, 72)}"`);
  console.log(`   forças : ${(lesson.studentBase?.confirmedStrengths ?? []).join(" | ") || "(nenhuma)"}`);
  for (const [label, ok] of checks) {
    totalChecks++; if (ok) passados++;
    console.log(`   ${ok ? "✅" : "❌"} ${label}`);
  }
  resultados.push({ cenario: c.nome, opening: lesson.openingLine?.texto, forcas: lesson.studentBase?.confirmedStrengths, falhas: checks.filter(([, ok]) => !ok).map(([l]) => l) });
}

console.log("\n" + L);
console.log(`RESULTADO ESTRUTURAL: ${passados}/${totalChecks} checagens ok`);
console.log(`CRITÉRIO CRÍTICO: "auscultou" só aparece com evidência real? ${resultados.every((r) => !r.falhas.some((f) => /ausculta/i.test(f))) ? "✅ SIM" : "❌ NÃO"}`);
console.log(L);

fs.writeFileSync(path.join(root, "docs/professor-ia-student-trace-audit.json"), JSON.stringify({ geradoEm: new Date().toISOString(), passados, totalChecks, resultados }, null, 2));
console.log("JSON salvo em docs/professor-ia-student-trace-audit.json");

// Opcional: verificar o guardrail do endpoint (se o servidor estiver de pé).
const PORT = process.env.AUDIT_PORT || "3000";
try {
  await fetch(`http://localhost:${PORT}/`, { method: "GET" });
  console.log(`\n── Guardrail no endpoint (:${PORT}) — cenário A, step de abertura ──`);
  const lessonA = ler("trace-A-sem-ausculta.json");
  const first = lessonA.lessonFlow?.firstStepId;
  const resp = await fetch(`http://localhost:${PORT}/api/professor-ia`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lesson: lessonA, currentStepId: first }) });
  const data = await resp.json();
  const contemAusculta = AUSCULTA.test(data.professorMessage || "");
  console.log(`   source=${data.source} | contém 'auscultou'? ${contemAusculta ? "❌ SIM (falha)" : "✅ NÃO"}`);
  console.log(`   → ${(data.professorMessage || "").replace(/\s+/g, " ").slice(0, 200)}`);
  if (data.debug?.motivo === "guardrail_elogio_proibido") console.log(`   (guardrail acionou: blockedBy=${data.debug.blockedBy})`);
} catch {
  console.log(`\n(Endpoint :${PORT} indisponível — verificação de guardrail pulada; asserções estruturais acima são suficientes.)`);
}

process.exit(passados === totalChecks ? 0 : 1);
