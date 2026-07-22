"""Adult patient validation and Pulse patient configuration builder."""

import math
from typing import Any, Dict, Optional


DEFAULT_PATIENT: Dict[str, Any] = {
    "name": "MEDIX Standard Adult",
    "sex": "male",
    "ageYears": 44.0,
    "weightKg": 77.0,
    "heightCm": 177.0,
}


class PatientValidationError(ValueError):
    """Raised when CREATE_SESSION contains an invalid adult profile."""


def _finite_number(
    value: Any, field: str, minimum: float, maximum: float
) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise PatientValidationError(f"{field} must be a number.")
    number = float(value)
    if not math.isfinite(number) or number < minimum or number > maximum:
        raise PatientValidationError(
            f"{field} must be between {minimum:g} and {maximum:g}."
        )
    return number


def validate_patient_payload(payload: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Apply defaults and basic operational validation for an adult profile."""
    if payload is None:
        payload = {}
    if not isinstance(payload, dict):
        raise PatientValidationError("CREATE_SESSION payload must be an object.")

    patient = payload.get("patient", {})
    if patient is None:
        patient = {}
    if not isinstance(patient, dict):
        raise PatientValidationError("patient must be an object.")

    profile = dict(DEFAULT_PATIENT)
    profile.update(patient)

    name = profile.get("name")
    if not isinstance(name, str) or not name.strip():
        raise PatientValidationError("patient.name must be a non-empty string.")
    name = name.strip()
    if len(name) > 120:
        raise PatientValidationError("patient.name exceeds 120 characters.")

    sex = profile.get("sex")
    if sex not in ("male", "female"):
        raise PatientValidationError("patient.sex must be 'male' or 'female'.")

    return {
        "name": name,
        "sex": sex,
        "ageYears": _finite_number(profile.get("ageYears"), "patient.ageYears", 18, 100),
        "weightKg": _finite_number(profile.get("weightKg"), "patient.weightKg", 30, 250),
        "heightCm": _finite_number(profile.get("heightCm"), "patient.heightCm", 120, 230),
    }


def build_patient_configuration(
    profile: Dict[str, Any], engine_root: str
) -> Any:
    """Create a Pulse SEPatientConfiguration from a validated profile."""
    from pulse.cdm.patient import SEPatientConfiguration, eSex
    from pulse.cdm.scalars import LengthUnit, MassUnit, TimeUnit

    configuration = SEPatientConfiguration()
    configuration.set_data_root_dir(engine_root.rstrip("/") + "/")
    patient = configuration.get_patient()
    patient.set_name(profile["name"])
    patient.set_sex(eSex.Male if profile["sex"] == "male" else eSex.Female)
    patient.get_age().set_value(profile["ageYears"], TimeUnit.yr)
    patient.get_weight().set_value(profile["weightKg"], MassUnit.kg)
    patient.get_height().set_value(profile["heightCm"], LengthUnit.cm)
    return configuration

