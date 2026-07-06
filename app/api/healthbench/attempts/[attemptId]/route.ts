/**
 * GET /api/healthbench/attempts/[attemptId]
 * Recupera uma tentativa OSCE persistida (HealthBenchAttemptRecord).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAttempt } from "@/lib/healthbench/attempt-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params;

  if (!attemptId) {
    return NextResponse.json({ error: "attemptId é obrigatório." }, { status: 400 });
  }

  const record = await getAttempt(attemptId);
  if (!record) {
    return NextResponse.json(
      { error: `Tentativa ${attemptId} não encontrada.` },
      { status: 404 }
    );
  }

  return NextResponse.json(record);
}
