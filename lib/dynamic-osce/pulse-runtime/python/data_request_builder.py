"""Pulse DataRequest definitions and protocol snapshot extraction."""

import math
from typing import Any, Dict, List, NamedTuple, Sequence, Tuple


class DataRequestSpec(NamedTuple):
    section: str
    field: str
    pulse_name: str


DATA_REQUEST_SPECS: Tuple[DataRequestSpec, ...] = (
    DataRequestSpec("vitals", "heartRate", "HeartRate"),
    DataRequestSpec("vitals", "systolicPressure", "SystolicArterialPressure"),
    DataRequestSpec("vitals", "diastolicPressure", "DiastolicArterialPressure"),
    DataRequestSpec("vitals", "meanArterialPressure", "MeanArterialPressure"),
    DataRequestSpec("vitals", "respiratoryRate", "RespirationRate"),
    DataRequestSpec("vitals", "spo2", "OxygenSaturation"),
    DataRequestSpec("vitals", "temperatureC", "CoreTemperature"),
    DataRequestSpec("respiratory", "tidalVolumeMl", "TidalVolume"),
    DataRequestSpec("respiratory", "minuteVentilationLMin", "TotalPulmonaryVentilation"),
    DataRequestSpec(
        "respiratory", "airwayResistance", "InspiratoryRespiratoryResistance"
    ),
    DataRequestSpec("respiratory", "pao2MmHg", "Aorta-Oxygen-PartialPressure"),
    DataRequestSpec(
        "respiratory", "paco2MmHg", "Aorta-CarbonDioxide-PartialPressure"
    ),
    DataRequestSpec("respiratory", "pH", "BloodPH"),
)


class SnapshotExtractionError(RuntimeError):
    """Raised when required snapshot envelope data cannot be extracted."""


def build_data_request_manager() -> Tuple[Any, Tuple[DataRequestSpec, ...]]:
    """Create the ordered Pulse DataRequests used by snapshot extraction."""
    from pulse.cdm.engine import SEDataRequest, SEDataRequestManager
    from pulse.cdm.scalars import (
        FrequencyUnit,
        PressureTimePerVolumeUnit,
        PressureUnit,
        TemperatureUnit,
        VolumePerTimeUnit,
        VolumeUnit,
    )

    requests = [
        SEDataRequest.create_physiology_request(
            "HeartRate", unit=FrequencyUnit.Per_min
        ),
        SEDataRequest.create_physiology_request(
            "SystolicArterialPressure", unit=PressureUnit.mmHg
        ),
        SEDataRequest.create_physiology_request(
            "DiastolicArterialPressure", unit=PressureUnit.mmHg
        ),
        SEDataRequest.create_physiology_request(
            "MeanArterialPressure", unit=PressureUnit.mmHg
        ),
        SEDataRequest.create_physiology_request(
            "RespirationRate", unit=FrequencyUnit.Per_min
        ),
        SEDataRequest.create_physiology_request("OxygenSaturation"),
        SEDataRequest.create_physiology_request(
            "CoreTemperature", unit=TemperatureUnit.C
        ),
        SEDataRequest.create_physiology_request("TidalVolume", unit=VolumeUnit.mL),
        SEDataRequest.create_physiology_request(
            "TotalPulmonaryVentilation", unit=VolumePerTimeUnit.L_Per_min
        ),
        SEDataRequest.create_physiology_request(
            "InspiratoryRespiratoryResistance",
            unit=PressureTimePerVolumeUnit.cmH2O_s_Per_L,
        ),
        SEDataRequest.create_liquid_compartment_substance_request(
            "Aorta", "Oxygen", "PartialPressure", unit=PressureUnit.mmHg
        ),
        SEDataRequest.create_liquid_compartment_substance_request(
            "Aorta", "CarbonDioxide", "PartialPressure", unit=PressureUnit.mmHg
        ),
        SEDataRequest.create_physiology_request("BloodPH"),
    ]
    return SEDataRequestManager(requests), DATA_REQUEST_SPECS


def _finite(value: Any) -> bool:
    try:
        return math.isfinite(float(value))
    except (TypeError, ValueError, OverflowError):
        return False


def _normalize_spo2(value: float, warnings: List[str]) -> float:
    if 0.0 <= value <= 1.0:
        return value * 100.0
    if 1.0 < value <= 100.0:
        warnings.append("OxygenSaturation was already expressed as percent.")
        return value
    raise ValueError("OxygenSaturation is outside the supported range.")


def extract_snapshot(
    session_id: str,
    values: Sequence[Any],
    specs: Sequence[DataRequestSpec] = DATA_REQUEST_SPECS,
) -> Dict[str, Any]:
    """Map an ordered Pulse result vector to a snapshot without fallbacks."""
    if values is None or len(values) == 0 or not _finite(values[0]):
        raise SnapshotExtractionError(
            "Pulse did not provide a finite simulation time."
        )

    warnings: List[str] = []
    unavailable: List[str] = []
    vitals: Dict[str, float] = {}
    respiratory: Dict[str, float] = {}

    for index, spec in enumerate(specs, start=1):
        protocol_path = f"{spec.section}.{spec.field}"
        if index >= len(values) or not _finite(values[index]):
            unavailable.append(protocol_path)
            continue

        value = float(values[index])
        if spec.field == "spo2":
            try:
                value = _normalize_spo2(value, warnings)
            except ValueError:
                unavailable.append(protocol_path)
                warnings.append(
                    "OxygenSaturation was omitted because its scale was invalid."
                )
                continue

        target = vitals if spec.section == "vitals" else respiratory
        target[spec.field] = value

    if unavailable:
        warnings.append(
            "Pulse did not provide finite values for: " + ", ".join(unavailable)
        )

    return {
        "sessionId": session_id,
        "simulationTimeSeconds": float(values[0]),
        "vitals": vitals,
        "respiratory": respiratory,
        "unavailableFields": unavailable,
        "warnings": warnings,
    }

