#!/usr/bin/env python3
# =============================================================================
# Casos OSCE Dinâmicos — Beta · PULSE ASTHMA RUNNER (Fase 10)
# -----------------------------------------------------------------------------
# Script Python persistente para executar simulação de asma grave via PyPulse.
# Chamado como subprocess pelo wrapper TypeScript pulse-local-runner.ts.
#
# Uso:
#   python3.9 pulse_asthma_runner.py \
#     --severity 0.75 \
#     --duration 580 \
#     --output /tmp/pulse_medix_asthma_output.csv \
#     --engine-root /path/to/.reference-local/engine-stable
#
# Saída: JSON em stdout com campos ok, outputCsv, duration_s, severity, finalVitals
# Exit codes:
#   0 — sucesso
#   1 — engine root não encontrado
#   2 — PyPulse não importa
#   3 — módulos Pulse Python não importam
#   4 — initialize_engine() falhou
# =============================================================================

import sys
import os
import json
import argparse


def setup_pulse_path(engine_root: str) -> None:
    candidates = [
        os.path.join(engine_root, "build", "install", "lib"),
        os.path.join(engine_root, "build", "install", "python"),
        os.path.join(engine_root, "src", "python"),
    ]
    for p in candidates:
        if os.path.isdir(p) and p not in sys.path:
            sys.path.insert(0, p)


def fail(code: int, error: str, warnings: list = None) -> None:
    print(json.dumps({"ok": False, "error": error, "warnings": warnings or []}),
          flush=True)
    sys.exit(code)


def main() -> None:
    parser = argparse.ArgumentParser(description="Pulse Asthma Runner — Fase 10")
    parser.add_argument("--severity", type=float, default=0.75,
                        help="Severidade do ataque asmático (0.0–1.0)")
    parser.add_argument("--duration", type=float, default=580.0,
                        help="Duração da simulação em segundos")
    parser.add_argument("--output", type=str,
                        default="/tmp/pulse_medix_asthma_output.csv",
                        help="Path do CSV de saída")
    parser.add_argument("--engine-root", type=str, default=None,
                        help="Root do engine-stable (sobrescreve PULSE_ENGINE_ROOT)")
    args = parser.parse_args()

    # ---- Localizar engine root -----------------------------------------------
    engine_root = args.engine_root or os.environ.get("PULSE_ENGINE_ROOT")
    if not engine_root:
        # Fallback: inferir a partir da localização deste script
        # lib/dynamic-osce/pulse-local/ → sobe 4 níveis → project root
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(script_dir)))
        engine_root = os.path.join(project_root, ".reference-local", "engine-stable")

    if not os.path.isdir(engine_root):
        fail(1, f"Engine root não encontrado: {engine_root}",
             ["Verifique PULSE_ENGINE_ROOT ou passe --engine-root"])

    setup_pulse_path(engine_root)

    # ---- Importar PyPulse (C extension) -------------------------------------
    try:
        import PyPulse  # noqa: F401
    except ImportError as e:
        fail(2, f"PyPulse não pôde ser importado: {e}",
             ["Certifique-se de que o engine foi compilado (make -j4 no build/Innerbuild).",
              f"PYTHONPATH esperado: {engine_root}/build/install/lib"])

    # ---- Importar wrappers Python do Pulse ----------------------------------
    try:
        from pulse.engine.PulseEngine import PulseEngine
        from pulse.cdm.engine import SEDataRequestManager, SEDataRequest
        from pulse.cdm.patient import SEPatientConfiguration, eSex
        from pulse.cdm.patient_actions import SEAsthmaAttack
        from pulse.cdm.scalars import (
            MassUnit, LengthUnit, TimeUnit,
            FrequencyUnit, PressureUnit, VolumeUnit,
        )
    except ImportError as e:
        fail(3, f"Erro ao importar módulos Python do Pulse: {e}",
             [f"build/install/python deve estar no PYTHONPATH"])

    # ---- Configurar engine --------------------------------------------------
    log_file = args.output.replace(".csv", "_engine.log")
    eng = PulseEngine(data_root_dir=engine_root + "/")
    eng.set_log_filename(log_file)
    eng.log_to_console(False)

    pc = SEPatientConfiguration()
    pc.set_data_root_dir(engine_root + "/")
    patient = pc.get_patient()
    patient.set_name("AsthmaPatientFase10")
    patient.set_sex(eSex.Male)
    patient.get_age().set_value(44, TimeUnit.yr)
    patient.get_weight().set_value(77, MassUnit.kg)
    patient.get_height().set_value(177, LengthUnit.cm)

    requests = [
        SEDataRequest.create_physiology_request("HeartRate", unit=FrequencyUnit.Per_min),
        SEDataRequest.create_physiology_request("SystolicArterialPressure", unit=PressureUnit.mmHg),
        SEDataRequest.create_physiology_request("DiastolicArterialPressure", unit=PressureUnit.mmHg),
        SEDataRequest.create_physiology_request("RespirationRate", unit=FrequencyUnit.Per_min),
        SEDataRequest.create_physiology_request("OxygenSaturation"),
        SEDataRequest.create_physiology_request("TidalVolume", unit=VolumeUnit.mL),
        SEDataRequest.create_physiology_request("EndTidalCarbonDioxideFraction"),
    ]
    drm = SEDataRequestManager(requests)
    drm.set_results_filename(args.output)

    # ---- Inicializar ---------------------------------------------------------
    ok = eng.initialize_engine(pc, drm)
    if not ok:
        fail(4, "initialize_engine() retornou False — falha na estabilização do paciente.",
             [f"Verifique {log_file}"])

    # ---- Vitais basais -------------------------------------------------------
    data = eng.pull_data()
    baseline = {
        "HeartRate":                round(data[1], 3),
        "SystolicArterialPressure": round(data[2], 3),
        "DiastolicArterialPressure":round(data[3], 3),
        "RespirationRate":          round(data[4], 3),
        "OxygenSaturation":         round(data[5], 6),
        "TidalVolume":              round(data[6], 3),
    }

    # ---- Aplicar AsthmaAttack ------------------------------------------------
    asthma = SEAsthmaAttack()
    asthma.get_severity().set_value(args.severity)
    eng.process_action(asthma)

    # ---- Avançar tempo -------------------------------------------------------
    eng.advance_time_s(args.duration)

    # ---- Vitais finais -------------------------------------------------------
    data = eng.pull_data()
    final_vitals = {
        "HeartRate":                round(data[1], 3),
        "SystolicArterialPressure": round(data[2], 3),
        "DiastolicArterialPressure":round(data[3], 3),
        "RespirationRate":          round(data[4], 3),
        "OxygenSaturation":         round(data[5], 6),
        "TidalVolume":              round(data[6], 3),
    }

    result = {
        "ok": True,
        "outputCsv": args.output,
        "duration_s": args.duration,
        "severity": args.severity,
        "engineRoot": engine_root,
        "baselineVitals": baseline,
        "finalVitals": final_vitals,
    }
    print(json.dumps(result), flush=True)
    sys.exit(0)


if __name__ == "__main__":
    main()
