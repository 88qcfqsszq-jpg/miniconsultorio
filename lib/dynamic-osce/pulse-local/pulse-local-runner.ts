// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE LOCAL RUNNER (Fase 10)
// ----------------------------------------------------------------------------
// Wrapper TypeScript que executa o script Python como subprocess e converte
// o CSV resultante em PatientState MEDIX via a pipeline existente.
// NÃO altera UI, providers, OSCE principal ou rotas de API.
// ============================================================================

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

import type { PatientState } from "../types";
import type { PulseRawOutput, PulseNormalizedVitals } from "../pulse/pulse-output-normalizer";
import { readPulseOutputFileAsRawOutput } from "../pulse/pulse-real-output-reader";
import { normalizePulseOutputs } from "../pulse/pulse-output-normalizer";
import { pulseVitalsToPatientState } from "../pulse/pulse-medix-bridge";
import { pilotoAsmaGraveAdulto } from "../cases/piloto-asma-grave-adulto";

// ---------------------------------------------------------------------------
// Tipos públicos
// ---------------------------------------------------------------------------

/** Parâmetros para a simulação local. Por enquanto apenas asma. */
export interface PulseLocalRunParams {
  conditionId: "asthma-severe-adult";
  severity?: number;
  duration_s?: number;
  timeoutMs?: number;
}

export interface PulseLocalRunSuccess {
  ok: true;
  provider: "pulse-local";
  csvPath: string;
  raw: PulseRawOutput;
  normalized: PulseNormalizedVitals;
  patientState: PatientState;
  warnings: string[];
}

export interface PulseLocalRunFailure {
  ok: false;
  provider: "pulse-local";
  fallbackRecommended: true;
  error: string;
  warnings: string[];
}

export type PulseLocalRunResult = PulseLocalRunSuccess | PulseLocalRunFailure;

// ---------------------------------------------------------------------------
// Paths e configuração
// ---------------------------------------------------------------------------

const CWD = process.cwd();
const ENGINE_ROOT = path.join(CWD, ".reference-local", "engine-stable");

const DEFAULT_PYTHON_BIN =
  "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/bin/python3.9";

// Permite override via env para facilitar CI/outros ambientes
const PYTHON_BIN = process.env.PULSE_PYTHON_BIN ?? DEFAULT_PYTHON_BIN;

// O script Python está no mesmo diretório que este arquivo TS
// Como tsconfig usa moduleResolution:bundler (Next.js), usamos CWD + caminho fixo
const PYTHON_SCRIPT = path.join(
  CWD,
  "lib",
  "dynamic-osce",
  "pulse-local",
  "pulse_asthma_runner.py"
);

// PYTHONPATH para o Python subprocess localizar PyPulse e a API Python do Pulse
const PULSE_PYTHONPATH = [
  path.join(ENGINE_ROOT, "build", "install", "lib"),
  path.join(ENGINE_ROOT, "build", "install", "python"),
  path.join(ENGINE_ROOT, "src", "python"),
].join(path.delimiter);

const DEFAULT_TIMEOUT_MS = 45_000;

// ---------------------------------------------------------------------------
// Função principal
// ---------------------------------------------------------------------------

/**
 * Executa uma simulação do Pulse localmente via subprocess Python.
 * Retorna PatientState MEDIX derivado dos vitais finais, ou erro controlado
 * com `fallbackRecommended: true` se o Pulse não estiver disponível.
 */
export async function runPulseLocalAsthmaSimulation(
  params: PulseLocalRunParams
): Promise<PulseLocalRunResult> {
  const {
    conditionId,
    severity = 0.75,
    duration_s = 580,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = params;

  const warnings: string[] = [];

  // ---- Validar conditionId ------------------------------------------------
  if (conditionId !== "asthma-severe-adult") {
    return failure(
      `conditionId '${conditionId}' não suportado nesta fase. Único suportado: 'asthma-severe-adult'.`,
      []
    );
  }

  // ---- Validar pré-requisitos locais --------------------------------------
  if (!fs.existsSync(PYTHON_BIN)) {
    return failure(
      `Python não encontrado: ${PYTHON_BIN}. Defina a variável PULSE_PYTHON_BIN.`,
      [`Testado: ${PYTHON_BIN}`]
    );
  }
  if (!fs.existsSync(PYTHON_SCRIPT)) {
    return failure(
      `Script Python não encontrado: ${PYTHON_SCRIPT}`,
      ["Verifique se lib/dynamic-osce/pulse-local/pulse_asthma_runner.py existe."]
    );
  }
  if (!fs.existsSync(ENGINE_ROOT)) {
    return failure(
      `Engine root não encontrado: ${ENGINE_ROOT}`,
      [".reference-local/engine-stable deve existir e estar compilado (Fase 9)."]
    );
  }

  // ---- Path único para o CSV de saída -------------------------------------
  const csvPath = path.join(os.tmpdir(), `pulse_medix_asthma_${Date.now()}.csv`);

  // ---- Executar subprocess Python -----------------------------------------
  let stdoutData = "";
  let stderrData = "";

  try {
    const exitCode = await spawnPython(
      PYTHON_BIN,
      [
        PYTHON_SCRIPT,
        "--severity", String(severity),
        "--duration", String(duration_s),
        "--output", csvPath,
        "--engine-root", ENGINE_ROOT,
      ],
      {
        env: {
          ...process.env,
          PYTHONPATH: PULSE_PYTHONPATH,
          PULSE_ENGINE_ROOT: ENGINE_ROOT,
        },
        timeoutMs,
        onStdout: (chunk) => { stdoutData += chunk; },
        onStderr: (chunk) => { stderrData += chunk; },
      }
    );

    if (exitCode !== 0) {
      let pythonError = `Python runner retornou exit code ${exitCode}`;
      try {
        const parsed = JSON.parse(stdoutData.trim()) as Record<string, unknown>;
        if (typeof parsed.error === "string") pythonError = parsed.error;
        if (Array.isArray(parsed.warnings)) warnings.push(...(parsed.warnings as string[]));
      } catch {
        // stdout não era JSON — usar mensagem genérica
      }
      if (stderrData) warnings.push(`stderr: ${stderrData.slice(0, 800)}`);
      return failure(pythonError, warnings);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (stderrData) warnings.push(`stderr: ${stderrData.slice(0, 400)}`);
    return failure(msg, warnings);
  }

  // ---- Parsear JSON retornado pelo Python ----------------------------------
  let pythonResult: Record<string, unknown>;
  try {
    pythonResult = JSON.parse(stdoutData.trim()) as Record<string, unknown>;
  } catch {
    return failure(
      `Não foi possível parsear JSON do runner Python. stdout: ${stdoutData.slice(0, 300)}`,
      warnings
    );
  }

  if (!pythonResult.ok) {
    const err = typeof pythonResult.error === "string"
      ? pythonResult.error
      : "Erro desconhecido no Python runner";
    if (Array.isArray(pythonResult.warnings)) warnings.push(...(pythonResult.warnings as string[]));
    return failure(err, warnings);
  }

  // Preferir o caminho retornado pelo Python (pode diferir do csvPath gerado aqui)
  const actualCsvPath = typeof pythonResult.outputCsv === "string"
    ? pythonResult.outputCsv
    : csvPath;

  // ---- Ler CSV e rodar pipeline MEDIX -------------------------------------
  let raw: PulseRawOutput;
  try {
    const { raw: r, warnings: rw } = readPulseOutputFileAsRawOutput(actualCsvPath);
    raw = r;
    warnings.push(...rw);
  } catch (err) {
    return failure(
      `Erro ao ler CSV de output: ${err instanceof Error ? err.message : String(err)}`,
      warnings
    );
  }

  const { normalized, warnings: nw } = normalizePulseOutputs(raw);
  warnings.push(...nw);

  const estadoInicial = pilotoAsmaGraveAdulto.fisiologia.estadoInicial;
  const { patientState, warnings: bw } = pulseVitalsToPatientState({
    currentState: estadoInicial,
    normalized,
  });
  warnings.push(...bw);

  return {
    ok: true,
    provider: "pulse-local",
    csvPath: actualCsvPath,
    raw,
    normalized,
    patientState,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function failure(error: string, warnings: string[]): PulseLocalRunFailure {
  return { ok: false, provider: "pulse-local", fallbackRecommended: true, error, warnings };
}

function spawnPython(
  bin: string,
  args: string[],
  opts: {
    env: NodeJS.ProcessEnv;
    timeoutMs: number;
    onStdout: (chunk: string) => void;
    onStderr: (chunk: string) => void;
  }
): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, {
      env: opts.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    proc.stdout.on("data", (chunk: Buffer) => opts.onStdout(chunk.toString("utf8")));
    proc.stderr.on("data", (chunk: Buffer) => opts.onStderr(chunk.toString("utf8")));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error(`Timeout: Python runner não respondeu em ${opts.timeoutMs}ms`));
    }, opts.timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve(code ?? -1);
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
