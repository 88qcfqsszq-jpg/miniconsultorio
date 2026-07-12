// ============================================================================
// API Route experimental — POST /api/pulse/simulate (Fase 11)
// ----------------------------------------------------------------------------
// Executa o Pulse local como subprocess e retorna PatientState MEDIX.
// Apenas conditionId "asthma-severe-adult" suportado nesta fase.
// Se o Pulse local não estiver disponível, retorna fallback controlado.
// NÃO altera provider dos casos, NÃO altera OSCE principal.
// ============================================================================

import { NextResponse } from "next/server";
import { runPulseLocalAsthmaSimulation } from "@/lib/dynamic-osce/pulse-local";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET — health check da route
// ---------------------------------------------------------------------------

export async function GET(_request: Request) {
  return NextResponse.json({ ok: true, status: "pulse-local-route-ready" });
}

// ---------------------------------------------------------------------------
// POST — executar simulação
// ---------------------------------------------------------------------------

interface SimulateBody {
  conditionId?: unknown;
  severity?: unknown;
  duration_s?: unknown;
}

export async function POST(request: Request) {
  let body: SimulateBody;
  try {
    body = (await request.json()) as SimulateBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body JSON inválido", warnings: [] },
      { status: 400 }
    );
  }

  const { conditionId, severity, duration_s } = body;

  // Validar conditionId
  if (conditionId !== "asthma-severe-adult") {
    return NextResponse.json(
      {
        ok: false,
        provider: "pulse-local",
        fallbackRecommended: true,
        error: `conditionId '${String(conditionId ?? "")}' não suportado. Use 'asthma-severe-adult'.`,
        warnings: [],
      },
      { status: 400 }
    );
  }

  // Validar tipos opcionais
  const sev = typeof severity === "number" ? severity : 0.75;
  const dur = typeof duration_s === "number" ? duration_s : 580;

  const result = await runPulseLocalAsthmaSimulation({
    conditionId: "asthma-severe-adult",
    severity: sev,
    duration_s: dur,
    timeoutMs: 120_000,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        provider: result.provider,
        fallbackRecommended: result.fallbackRecommended,
        error: result.error,
        warnings: result.warnings,
      },
      { status: 503 }
    );
  }

  // Sucesso — omitir csvPath completo (path local sensível)
  return NextResponse.json({
    ok: true,
    provider: result.provider,
    patientState: result.patientState,
    normalized: result.normalized,
    warnings: result.warnings,
    duration_s: dur,
    severity: sev,
  });
}
