/**
 * Testes determinísticos do gate manual reversível do Realtime (FASE 4D.1) —
 * sem LLM, sem rede, sem WebRTC. `decidirSessaoRealtime` é uma função pura:
 * só decide "disabled"/"manual" e computa instructions/turnDetection.
 *
 * Runner: npx tsx --test lib/voice/__tests__/realtimeTurnGuardConfig.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { decidirSessaoRealtime, isRealtimeTurnGuardEnabled } from "@/lib/voice/realtimeTurnGuardConfig";
import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";

const CASO_ID_CANONICO_LEGADO = "18";

function comFlag(valor: string | undefined, fn: () => void) {
  const original = process.env.PATIENT_V3_REALTIME_TURN_GUARD;
  if (valor === undefined) delete process.env.PATIENT_V3_REALTIME_TURN_GUARD;
  else process.env.PATIENT_V3_REALTIME_TURN_GUARD = valor;
  try {
    fn();
  } finally {
    if (original === undefined) delete process.env.PATIENT_V3_REALTIME_TURN_GUARD;
    else process.env.PATIENT_V3_REALTIME_TURN_GUARD = original;
  }
}

// ── Feature flag ─────────────────────────────────────────────────────────

test("1. flag ausente/qualquer valor != 'true' mantém desabilitada", () => {
  comFlag(undefined, () => assert.equal(isRealtimeTurnGuardEnabled(), false));
  comFlag("false", () => assert.equal(isRealtimeTurnGuardEnabled(), false));
  comFlag("1", () => assert.equal(isRealtimeTurnGuardEnabled(), false));
});

test("2. flag 'true' habilita", () => {
  comFlag("true", () => assert.equal(isRealtimeTurnGuardEnabled(), true));
});

// ── Decisão da sessão ────────────────────────────────────────────────────

test("3. flag desligada → sempre 'disabled', mesmo para o Caso Ouro", () => {
  comFlag(undefined, () => {
    const decisao = decidirSessaoRealtime("1");
    assert.deepEqual(decisao, { turnGuardMode: "disabled" });
  });
});

test("4. Caso Ouro com flag ligada retorna turnGuardMode:'manual'", () => {
  comFlag("true", () => {
    const decisao = decidirSessaoRealtime("1");
    assert.equal(decisao.turnGuardMode, "manual");
  });
});

test("5. create_response:false na sessão protegida", () => {
  comFlag("true", () => {
    const decisao = decidirSessaoRealtime("1");
    assert.equal(decisao.turnGuardMode, "manual");
    if (decisao.turnGuardMode === "manual") {
      assert.equal(decisao.turnDetection.createResponse, false);
    }
  });
});

test("6. interrupt_response:false na sessão protegida", () => {
  comFlag("true", () => {
    const decisao = decidirSessaoRealtime("1");
    assert.equal(decisao.turnGuardMode, "manual");
    if (decisao.turnGuardMode === "manual") {
      assert.equal(decisao.turnDetection.interruptResponse, false);
    }
  });
});

test("7. somente fatos da abertura entram nas instructions reduzidas", () => {
  comFlag("true", () => {
    const decisao = decidirSessaoRealtime("1");
    assert.equal(decisao.turnGuardMode, "manual");
    if (decisao.turnGuardMode === "manual") {
      const fatoAbertura = casoSCAOuroV3.patientKnowledge.fatos.find((f) => f.id === "f_queixa_dor");
      assert.ok(fatoAbertura);
      assert.ok(decisao.instructionsAbertura.includes(fatoAbertura!.valor));
    }
  });
});

test("8. outros fatos (fora da abertura) ficam ausentes das instructions reduzidas", () => {
  comFlag("true", () => {
    const decisao = decidirSessaoRealtime("1");
    assert.equal(decisao.turnGuardMode, "manual");
    if (decisao.turnGuardMode === "manual") {
      for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
        if (fato.id === "f_queixa_dor") continue;
        assert.ok(
          !decisao.instructionsAbertura.includes(fato.valor),
          `fato "${fato.id}" não deveria aparecer nas instructions reduzidas da sessão protegida`
        );
      }
    }
  });
});

test("9. ClinicalTruth e Examiner ficam ausentes das instructions reduzidas", () => {
  comFlag("true", () => {
    const decisao = decidirSessaoRealtime("1");
    assert.equal(decisao.turnGuardMode, "manual");
    if (decisao.turnGuardMode === "manual") {
      assert.ok(!decisao.instructionsAbertura.includes("Síndrome Coronariana Aguda (SCA) - IAMCSST"));
      assert.ok(!decisao.instructionsAbertura.includes("Aspirina 500mg VO"));
      assert.ok(!decisao.instructionsAbertura.includes("Nota mínima de 17 em 20 pontos."));
    }
  });
});

test("caso legado (fora de casos-v3) sempre 'disabled', mesmo com a flag ligada", () => {
  comFlag("true", () => {
    const decisao = decidirSessaoRealtime(CASO_ID_CANONICO_LEGADO);
    assert.deepEqual(decisao, { turnGuardMode: "disabled" });
  });
});

// ── Estrutural: nenhuma tool, nenhum response.create, nenhum classificador ─

const CODIGO_FONTE = readFileSync(
  new URL("../realtimeTurnGuardConfig.ts", import.meta.url),
  "utf8"
);

test("10. módulo não declara nenhuma tool", () => {
  assert.ok(!CODIGO_FONTE.includes('"tools"'));
  assert.ok(!CODIGO_FONTE.toLowerCase().includes("tool_choice"));
});

test("11. módulo nunca envia response.create", () => {
  assert.ok(!CODIGO_FONTE.includes("response.create"));
  assert.ok(!CODIGO_FONTE.includes("response_create"));
});

test("12. módulo nunca importa nem chama classificarTurno", () => {
  // A prosa dos comentários MENCIONA "classificarTurno" (documentando que ele
  // NUNCA é chamado aqui) — a garantia real é a ausência de qualquer import
  // desse símbolo a partir de patientTurnClassifier.ts.
  assert.ok(!CODIGO_FONTE.includes('from "@/lib/patient-v3/patientTurnClassifier"'));
  const chamadasReais = CODIGO_FONTE.match(/\bclassificarTurno\s*\(/g);
  assert.equal(chamadasReais, null, "não deveria haver nenhuma invocação classificarTurno(...)");
});

// ── Determinismo / pureza ──────────────────────────────────────────────────

test("mesma entrada produz a mesma decisão (determinístico)", () => {
  comFlag("true", () => {
    const a = decidirSessaoRealtime("1");
    const b = decidirSessaoRealtime("1");
    assert.deepEqual(a, b);
  });
});
