"""Typed, validated Pulse action dispatch for the persistent MEDIX session."""

import json
import math
from pathlib import Path
from typing import Any, Dict, Tuple


class ActionDispatchError(RuntimeError):
    """An action error with a stable runtime protocol code."""

    def __init__(self, code: str, message: str, details: Any = None) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.details = details


SUPPORTED_ACTIONS = frozenset(
    {"asthma_attack", "supplemental_oxygen", "albuterol_inhaler"}
)
CANCELLABLE_ACTIONS = frozenset({"asthma_attack", "supplemental_oxygen"})
OXYGEN_DEVICES = {
    "nasal_cannula": "NasalCannula",
    "simple_mask": "SimpleMask",
    "non_rebreather_mask": "NonRebreatherMask",
}

# Pulse 4.3.2 / build bb72983 is the only engine build this dispatcher's
# aerosolization preflight and inhaler adapter have been verified against
# (docs/RELATORIO-AUDITORIA-COMPLETA-PULSE-MEDIX.md, docs/PLANO-ETAPA-2B-ALBUTEROL-PULSE.md).
EXPECTED_PULSE_VERSION = "4.3.2"

# Length units the Pulse wrapper recognizes for SEScalarLength
# (src/python/pulse/cdm/scalars.py: LengthUnit.{m,cm,mm,um,in,ft}).
RECOGNIZED_LENGTH_UNITS = frozenset({"m", "cm", "mm", "um", "in", "ft"})


def _payload_object(payload: Any) -> Dict[str, Any]:
    if not isinstance(payload, dict):
        raise ActionDispatchError(
            "INVALID_ACTION_PAYLOAD", "Action payload must be an object."
        )
    return payload


def _finite_number(value: Any, code: str, message: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ActionDispatchError(code, message)
    result = float(value)
    if not math.isfinite(result):
        raise ActionDispatchError(code, message)
    return result


def _measurement(
    payload: Dict[str, Any],
    field: str,
    unit: str,
    code: str,
    minimum_exclusive: float,
    maximum: float,
) -> float:
    measurement = payload.get(field)
    if not isinstance(measurement, dict):
        raise ActionDispatchError(
            "INVALID_ACTION_PAYLOAD", f"{field} must contain value and unit."
        )
    if measurement.get("unit") != unit:
        raise ActionDispatchError(
            "INVALID_UNIT",
            f"{field} unit must be {unit}.",
            {"field": field, "supportedUnit": unit},
        )
    value = _finite_number(
        measurement.get("value"), code, f"{field} must be a finite number."
    )
    if value <= minimum_exclusive or value > maximum:
        raise ActionDispatchError(
            code,
            f"{field} must be greater than {minimum_exclusive} and no more than {maximum} {unit}.",
        )
    return value


def _action_name(payload: Dict[str, Any]) -> str:
    action = payload.get("action")
    if not isinstance(action, str) or not action:
        raise ActionDispatchError(
            "INVALID_ACTION_PAYLOAD", "action must be a non-empty string."
        )
    return action


def _process_high_level_action(engine: Any, action: Any) -> None:
    try:
        result = engine.process_action(action)
    except Exception as error:
        raise ActionDispatchError(
            "ACTION_APPLICATION_FAILED",
            "Pulse raised while applying the action.",
            {"type": type(error).__name__},
        ) from error
    if result is False:
        raise ActionDispatchError(
            "ACTION_APPLICATION_FAILED", "Pulse rejected the action."
        )


def _native_engine(engine: Any) -> Any:
    native = getattr(engine, "_PulseEngine__pulse", None)
    if native is None:
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND",
            "The installed Pulse wrapper does not expose its native action API.",
        )
    return native


def _apply_asthma(engine: Any, payload: Dict[str, Any]) -> Dict[str, Any]:
    severity = _finite_number(
        payload.get("severity"),
        "INVALID_SEVERITY",
        "severity must be a finite number from 0 (exclusive) to 1.",
    )
    if severity <= 0 or severity > 1:
        raise ActionDispatchError(
            "INVALID_SEVERITY",
            "severity must be greater than 0 and no more than 1.",
        )

    from pulse.cdm.patient_actions import SEAsthmaAttack

    action = SEAsthmaAttack()
    action.get_severity().set_value(severity)
    _process_high_level_action(engine, action)
    return {
        "action": "asthma_attack",
        "applied": True,
        "persistent": True,
        "details": {"severity": severity, "unit": None},
    }


def _oxygen_parameters(payload: Dict[str, Any]) -> Tuple[str, float, float]:
    device = payload.get("device")
    if device not in OXYGEN_DEVICES:
        raise ActionDispatchError(
            "INVALID_DEVICE",
            "Unsupported supplemental oxygen device.",
            {"supportedDevices": sorted(OXYGEN_DEVICES)},
        )
    flow = _measurement(payload, "flow", "L/min", "INVALID_FLOW", 0, 100)
    volume = _measurement(
        payload, "volume", "L", "INVALID_ACTION_PAYLOAD", 0, 100000
    )
    return str(device), flow, volume


def _apply_oxygen(engine: Any, payload: Dict[str, Any]) -> Dict[str, Any]:
    device, flow, volume = _oxygen_parameters(payload)
    from pulse.cdm.patient_actions import SESupplementalOxygen, eDevice
    from pulse.cdm.scalars import VolumePerTimeUnit, VolumeUnit

    action = SESupplementalOxygen()
    action.set_device(getattr(eDevice, OXYGEN_DEVICES[device]))
    action.get_flow().set_value(flow, VolumePerTimeUnit.L_Per_min)
    action.get_volume().set_value(volume, VolumeUnit.L)
    _process_high_level_action(engine, action)
    return {
        "action": "supplemental_oxygen",
        "applied": True,
        "persistent": True,
        "details": {
            "device": device,
            "flow": {"value": flow, "unit": "L/min"},
            "volume": {"value": volume, "unit": "L"},
        },
    }


def _scalar_wrapper_value(container: Any, wrapper_key: str) -> Any:
    """Read {wrapper_key: {"Value": x}} the way Pulse serializes 0..1/-1..1 scalars."""
    if not isinstance(container, dict):
        return None
    wrapper = container.get(wrapper_key)
    if not isinstance(wrapper, dict):
        return None
    return wrapper.get("Value")


def _bounded_scalar_field(
    aerosolization: Dict[str, Any],
    field: str,
    wrapper_key: str,
    minimum: float,
    maximum: float,
    missing_fields: list,
    invalid_fields: list,
) -> Any:
    raw_container = aerosolization.get(field)
    value = _scalar_wrapper_value(raw_container, wrapper_key)
    if raw_container is None or value is None:
        missing_fields.append(field)
        return None
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        invalid_fields.append(field)
        return None
    numeric = float(value)
    if not math.isfinite(numeric) or numeric < minimum or numeric > maximum:
        invalid_fields.append(field)
        return None
    return numeric


def _particulate_size_distribution_field(
    aerosolization: Dict[str, Any],
    missing_fields: list,
    invalid_fields: list,
) -> None:
    psd = aerosolization.get("ParticulateSizeDistribution")
    wrapper = psd.get("HistogramFractionVsLength") if isinstance(psd, dict) else None
    histogram = wrapper.get("Histogram") if isinstance(wrapper, dict) else None
    if not isinstance(histogram, dict):
        missing_fields.append("ParticulateSizeDistribution")
        return

    boundaries = histogram.get("Independent")
    fractions = histogram.get("Dependent")
    unit = histogram.get("IndependentUnit")

    if not isinstance(boundaries, list) or not isinstance(fractions, list):
        invalid_fields.append("ParticulateSizeDistribution")
        return
    if unit not in RECOGNIZED_LENGTH_UNITS:
        invalid_fields.append("ParticulateSizeDistribution")
        return
    # SEHistogram::IsValid(): non-empty, bins + 1 == boundaries.
    if len(fractions) == 0 or len(boundaries) != len(fractions) + 1:
        invalid_fields.append("ParticulateSizeDistribution")
        return
    try:
        boundary_values = [float(value) for value in boundaries]
        fraction_values = [float(value) for value in fractions]
    except (TypeError, ValueError):
        invalid_fields.append("ParticulateSizeDistribution")
        return
    all_values = boundary_values + fraction_values
    if any(isinstance(value, bool) for value in boundaries + fractions):
        invalid_fields.append("ParticulateSizeDistribution")
        return
    if any(not math.isfinite(value) for value in all_values):
        invalid_fields.append("ParticulateSizeDistribution")
        return
    if any(fraction < 0 for fraction in fraction_values):
        invalid_fields.append("ParticulateSizeDistribution")
        return
    if any(
        boundary_values[index] >= boundary_values[index + 1]
        for index in range(len(boundary_values) - 1)
    ):
        invalid_fields.append("ParticulateSizeDistribution")
        return
    # SEHistogramFractionVsLength::IsVaild(): bins must sum to exactly 1.
    if abs(sum(fraction_values) - 1.0) > 1e-6:
        invalid_fields.append("ParticulateSizeDistribution")
        return


def _validate_aerosolization_resource(substance: Dict[str, Any]) -> None:
    """Preflight substances/Albuterol.json against SESubstanceAerosolization::IsValid().

    Mirrors, field by field, what src/cpp/cdm/substance/SESubstanceAerosolization.cpp
    and src/cpp/cdm/properties/SEHistogram*.cpp require before the native
    SEInhaler gate (`HasAerosolization()`) would accept the resource. Never fills
    in a missing/invalid field: it only reports precisely what is absent or out
    of range so the resource can be replaced with an official, compatible one.
    """
    name = substance.get("Name")
    if name != "Albuterol":
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND",
            "Pulse substance resource does not identify itself as Albuterol.",
            {"resource": "Albuterol", "foundName": name},
        )

    aerosolization = substance.get("Aerosolization")
    if not isinstance(aerosolization, dict):
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND",
            "Pulse Albuterol resource has no aerosolization data required by the inhaler model.",
            {"resource": "Albuterol", "missingSection": "Aerosolization"},
        )

    missing_fields: list = []
    invalid_fields: list = []
    _bounded_scalar_field(
        aerosolization,
        "BronchioleModifier",
        "ScalarNegative1To1",
        -1.0,
        1.0,
        missing_fields,
        invalid_fields,
    )
    _bounded_scalar_field(
        aerosolization,
        "InflammationCoefficient",
        "Scalar0To1",
        0.0,
        1.0,
        missing_fields,
        invalid_fields,
    )
    _particulate_size_distribution_field(aerosolization, missing_fields, invalid_fields)

    if missing_fields or invalid_fields:
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND",
            "Pulse Albuterol resource has incomplete or invalid aerosolization data "
            "required by the inhaler model.",
            {
                "resource": "Albuterol",
                "missingFields": missing_fields,
                "invalidFields": invalid_fields,
            },
        )


def _check_pulse_version_compatibility() -> None:
    """Gate the inhaler adapter to the exact Pulse build it was verified against."""
    try:
        from pulse.engine.PulseEngine import version as pulse_version
    except Exception as error:
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND",
            "Unable to confirm the running Pulse engine version for the "
            "Albuterol aerosolization gate.",
            {"type": type(error).__name__},
        ) from error
    running_version = pulse_version()
    if running_version != EXPECTED_PULSE_VERSION:
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND",
            "Running Pulse engine version does not match the version this "
            "Albuterol aerosolization preflight was verified against.",
            {
                "expectedVersion": EXPECTED_PULSE_VERSION,
                "runningVersion": running_version,
            },
        )


def _albuterol_parameters(
    payload: Dict[str, Any], engine_root: str
) -> Tuple[float, int, float, float]:
    dose = _measurement(payload, "dose", "ug", "INVALID_DOSE", 0, 1000)
    actuations = payload.get("actuations", 1)
    if isinstance(actuations, bool) or not isinstance(actuations, int):
        raise ActionDispatchError(
            "INVALID_DOSE", "actuations must be an integer from 1 to 4."
        )
    if actuations < 1 or actuations > 4:
        raise ActionDispatchError(
            "INVALID_DOSE", "actuations must be an integer from 1 to 4."
        )
    nozzle_loss = _finite_number(
        payload.get("nozzleLossFraction", 0.04),
        "INVALID_ACTION_PAYLOAD",
        "nozzleLossFraction must be a finite number from 0 to less than 1.",
    )
    if nozzle_loss < 0 or nozzle_loss >= 1:
        raise ActionDispatchError(
            "INVALID_ACTION_PAYLOAD",
            "nozzleLossFraction must be from 0 to less than 1.",
        )
    spacer = _measurement(
        payload,
        "spacerVolume",
        "mL",
        "INVALID_ACTION_PAYLOAD",
        0,
        2000,
    )

    resource = Path(engine_root) / "substances" / "Albuterol.json"
    if not resource.is_file():
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND", "Pulse Albuterol substance resource was not found."
        )
    try:
        with resource.open("r", encoding="utf-8") as stream:
            substance = json.load(stream)
    except (OSError, ValueError) as error:
        raise ActionDispatchError(
            "RESOURCE_NOT_FOUND",
            "Pulse Albuterol substance resource could not be read.",
            {"type": type(error).__name__},
        ) from error
    _validate_aerosolization_resource(substance)
    return dose, actuations, nozzle_loss, spacer


def _scalar_time(target: Any, value: float) -> None:
    target.ScalarTime.Value = value
    target.ScalarTime.Unit = "s"


def _build_albuterol_action_json(
    dose_ug: float,
    actuations: int,
    nozzle_loss: float,
    spacer_ml: float,
) -> str:
    from google.protobuf import json_format
    from pulse.cdm.bind.Engine_pb2 import ActionListData

    action_list = ActionListData()
    configuration = (
        action_list.AnyAction.add().EquipmentAction.InhalerConfiguration.Configuration
    )
    configuration.Substance = "Albuterol"
    configuration.MeteredDose.ScalarMass.Value = dose_ug
    configuration.MeteredDose.ScalarMass.Unit = "ug"
    configuration.NozzleLoss.Scalar0To1.Value = nozzle_loss
    configuration.SpacerVolume.ScalarVolume.Value = spacer_ml
    configuration.SpacerVolume.ScalarVolume.Unit = "mL"

    respiration = action_list.AnyAction.add().PatientAction.ConsciousRespiration
    respiration.StartImmediately = True
    for _ in range(actuations):
        exhale = respiration.Command.add().ForcedExhale
        exhale.ExpiratoryReserveVolumeFraction.Scalar0To1.Value = 1.0
        _scalar_time(exhale.ExhalePeriod, 3.0)

        respiration.Command.add().UseInhaler.SetInParent()

        inhale = respiration.Command.add().ForcedInhale
        inhale.InspiratoryCapacityFraction.Scalar0To1.Value = 1.0
        _scalar_time(inhale.InhalePeriod, 12.0)
        _scalar_time(inhale.HoldPeriod, 3.0)
        _scalar_time(inhale.ReleasePeriod, 5.0)

    return json_format.MessageToJson(
        action_list, preserving_proto_field_name=True
    )


def _apply_albuterol(
    engine: Any, payload: Dict[str, Any], engine_root: str
) -> Dict[str, Any]:
    dose, actuations, nozzle_loss, spacer = _albuterol_parameters(
        payload, engine_root
    )
    _check_pulse_version_compatibility()
    action_json = _build_albuterol_action_json(
        dose, actuations, nozzle_loss, spacer
    )
    try:
        import PyPulse

        result = _native_engine(engine).process_actions(
            action_json, PyPulse.serialization_format.json
        )
    except ActionDispatchError:
        raise
    except Exception as error:
        raise ActionDispatchError(
            "ACTION_APPLICATION_FAILED",
            "Pulse raised while applying the albuterol inhaler actions.",
            {"type": type(error).__name__},
        ) from error
    if result is False:
        raise ActionDispatchError(
            "ACTION_APPLICATION_FAILED",
            "Pulse rejected the albuterol inhaler actions.",
        )
    return {
        "action": "albuterol_inhaler",
        "applied": True,
        "persistent": False,
        "details": {
            "substance": "Albuterol",
            "dosePerActuation": {"value": dose, "unit": "ug"},
            "actuations": actuations,
            "nozzleLossFraction": nozzle_loss,
            "spacerVolume": {"value": spacer, "unit": "mL"},
            "administration": "metered-dose inhaler with conscious respiration",
        },
    }


class PulseActionDispatcher:
    """Apply only the Pulse actions explicitly supported by this runtime."""

    def __init__(self, engine: Any, engine_root: str) -> None:
        self.engine = engine
        self.engine_root = engine_root

    def apply_condition(self, payload: Any) -> Dict[str, Any]:
        request = _payload_object(payload)
        condition = request.get("condition")
        if not isinstance(condition, str) or not condition:
            raise ActionDispatchError(
                "INVALID_ACTION_PAYLOAD",
                "condition must be a non-empty string.",
            )
        raise ActionDispatchError(
            "UNSUPPORTED_CONDITION",
            "No post-initialization Pulse condition is supported by this case.",
            {
                "condition": condition,
                "note": "SEAsthmaAttack is a Pulse patient action and must use APPLY_ACTION.",
            },
        )

    def apply_action(self, payload: Any) -> Dict[str, Any]:
        request = _payload_object(payload)
        action = _action_name(request)
        if action not in SUPPORTED_ACTIONS:
            raise ActionDispatchError(
                "UNSUPPORTED_ACTION",
                "Action is not supported by this runtime.",
                {"action": action, "supportedActions": sorted(SUPPORTED_ACTIONS)},
            )
        if action == "asthma_attack":
            return _apply_asthma(self.engine, request)
        if action == "supplemental_oxygen":
            return _apply_oxygen(self.engine, request)
        return _apply_albuterol(self.engine, request, self.engine_root)

    def cancel_action(self, payload: Any) -> Dict[str, Any]:
        request = _payload_object(payload)
        action_name = _action_name(request)
        if action_name not in CANCELLABLE_ACTIONS:
            raise ActionDispatchError(
                "ACTION_CANCELLATION_FAILED",
                "Action has no real cancellation supported by Pulse.",
                {
                    "action": action_name,
                    "cancellableActions": sorted(CANCELLABLE_ACTIONS),
                },
            )
        try:
            if action_name == "asthma_attack":
                from pulse.cdm.patient_actions import SEAsthmaAttack

                action = SEAsthmaAttack()
                action.get_severity().set_value(0.0)
            else:
                from pulse.cdm.patient_actions import SESupplementalOxygen, eDevice
                from pulse.cdm.scalars import VolumePerTimeUnit, VolumeUnit

                action = SESupplementalOxygen()
                action.set_device(eDevice.NullDevice)
                action.get_flow().set_value(0.0, VolumePerTimeUnit.L_Per_min)
                action.get_volume().set_value(0.0, VolumeUnit.L)
            _process_high_level_action(self.engine, action)
        except ActionDispatchError as error:
            if error.code == "ACTION_APPLICATION_FAILED":
                raise ActionDispatchError(
                    "ACTION_CANCELLATION_FAILED",
                    "Pulse failed to cancel the action.",
                    error.details,
                ) from error
            raise
        except Exception as error:
            raise ActionDispatchError(
                "ACTION_CANCELLATION_FAILED",
                "Pulse raised while cancelling the action.",
                {"type": type(error).__name__},
            ) from error
        return {
            "action": action_name,
            "cancelled": True,
            "details": {
                "pulseMechanism": "severity_zero"
                if action_name == "asthma_attack"
                else "device_none"
            },
        }
