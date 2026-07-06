// ============================================================================
// Gold Standard OSCE Validator — runner CLI (AUDITORIA, não altera produção)
// ----------------------------------------------------------------------------
// Para cada caso: extrai a rubrica interna, gera a consulta perfeita sintética,
// roda pelo builder real de cards e verifica se atinge 20/20 (>= 19.5).
// Saída: docs/gold-standard-osce-results.json (consumido pelo relatório .md).
//
// Uso:
//   npx tsx scripts/validate-gold-standard-osce.ts            # lote inicial
//   npx tsx scripts/validate-gold-standard-osce.ts --all      # todos os casos
// ============================================================================

import * as fs from "fs";
import * as path from "path";
import { casosOSCE } from "../data/casos-osce";
import { avaliarCasoGold, type ResultadoCaso } from "./gold-standard-osce-utils";

// Lote inicial (TAREFA 7) — por trecho do título/diagnóstico.
const LOTE_INICIAL = [
  /tuberculose/i,
  /insufici[êe]ncia card[íi]aca/i,
  /\basma\b/i,
  /pneumonia/i,
  /anemia/i,
  /dengue.*alarme|dengue grave/i,
  /coronarian|iamcsst|iamsst|sca|infarto/i,
  /dpoc/i,
  /tromboembolismo|tep/i,
  /pneumot[óo]rax/i,
];

function casoMatchLote(caso: any): boolean {
  const txt = `${caso?.titulo ?? ""} ${caso?.dados_ocultos_do_sistema?.diagnostico_principal ?? ""}`;
  return LOTE_INICIAL.some((re) => re.test(txt));
}

function main() {
  const rodarTodos = process.argv.includes("--all");
  const selecionados = rodarTodos ? casosOSCE : casosOSCE.filter(casoMatchLote);

  const resultados: ResultadoCaso[] = [];
  const erros: Array<{ casoId: string; erro: string }> = [];

  for (const caso of selecionados) {
    try {
      resultados.push(avaliarCasoGold(caso as any));
    } catch (e: any) {
      erros.push({ casoId: String((caso as any).id), erro: e?.message ?? String(e) });
    }
  }

  const total = resultados.length;
  const perfeitos = resultados.filter((r) => r.notaObtida >= 20).length;
  const quaseLa = resultados.filter((r) => r.notaObtida >= 19.5 && r.notaObtida < 20).length;
  const falhas = resultados.filter((r) => r.notaObtida < 19.5).length;

  // Agregação de causas (TAREFA 6)
  const causasGlobais: Record<string, number> = {};
  for (const r of resultados) {
    for (const c of r.cards) {
      if (c.possivelCausa && c.possivelCausa !== "ok" && c.possivelCausa !== "n/a") {
        const chave = c.possivelCausa.split(" ")[0];
        causasGlobais[chave] = (causasGlobais[chave] ?? 0) + 1;
      }
    }
  }

  const out = {
    geradoEm: new Date().toISOString(),
    modo: rodarTodos ? "todos" : "lote_inicial",
    totalCasosNoBanco: casosOSCE.length,
    totalTestados: total,
    perfeitos20: perfeitos,
    entre195e20: quaseLa,
    falhas: falhas,
    causasGlobais,
    errosExecucao: erros,
    resultados,
  };

  const docsDir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  const jsonPath = path.join(docsDir, "gold-standard-osce-results.json");
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2), "utf8");

  console.log("=== Gold Standard OSCE Validator ===");
  console.log("Modo:", out.modo, "| testados:", total, "/", casosOSCE.length);
  console.log("20/20:", perfeitos, "| 19.5–20:", quaseLa, "| <19.5 (falha):", falhas);
  console.log("Causas globais:", JSON.stringify(causasGlobais));
  if (erros.length) console.log("Erros de execução:", erros.length);
  console.log("JSON salvo em:", jsonPath);
  console.log("");
  for (const r of resultados) {
    const flag = r.notaObtida >= 20 ? "✅" : r.notaObtida >= 19.5 ? "🟡" : "❌";
    const perdidos = r.cards.filter((c) => c.pontosObtidos < c.peso);
    console.log(`${flag} [${r.casoId}] ${r.diagnosticoEsperado} → ${r.notaObtida}/20`);
    for (const c of perdidos) {
      console.log(`     · ${c.titulo}: ${c.pontosObtidos}/${c.peso} — ${c.possivelCausa}`);
    }
  }
}

main();
