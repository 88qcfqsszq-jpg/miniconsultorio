import json
import types
from pathlib import Path
import sys
import unittest
from unittest.mock import patch


RUNTIME_DIRECTORY = Path(__file__).resolve().parents[1]
if str(RUNTIME_DIRECTORY) not in sys.path:
    sys.path.insert(0, str(RUNTIME_DIRECTORY))

from action_dispatcher import ActionDispatchError, PulseActionDispatcher


# Values taken verbatim from Pulse's own official, shipped test source
# (.reference-local/engine-stable/src/cpp/engine/human_adult/whole_body/test/AerosolTest.cpp,
# "NormalDistribution" suite). They are official Pulse constants used only to prove
# the preflight *accepts* a schema-complete resource; the substance is deliberately
# NOT named "Albuterol" because these numbers are a generic engine test fixture, not
# real Albuterol pharmacology (see docs/PLANO-ETAPA-2B-ALBUTEROL-PULSE.md section 3.4).
OFFICIAL_TEST_AEROSOLIZATION = {
    "BronchioleModifier": {"ScalarNegative1To1": {"Value": 0}},
    "InflammationCoefficient": {"Scalar0To1": {"Value": 0.5}},
    "ParticulateSizeDistribution": {
        "HistogramFractionVsLength": {
            "Histogram": {
                "Independent": [1.0e-4, 1.0e-3, 1.0e-2, 1.0e-1, 1.0, 1.0e1, 1.0e2],
                "IndependentUnit": "um",
                "Dependent": [0.015, 0.035, 0.9, 0.035, 0.015, 0.0],
            }
        }
    },
}


def _write_albuterol_resource(directory: str, substance: dict) -> None:
    substances = Path(directory) / "substances"
    substances.mkdir(exist_ok=True)
    (substances / "Albuterol.json").write_text(
        json.dumps(substance), encoding="utf-8"
    )


class ActionDispatcherTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = object()
        self.dispatcher = PulseActionDispatcher(self.engine, "/fake/pulse")

    def test_asthma_is_dispatched_as_action_not_condition(self) -> None:
        with self.assertRaises(ActionDispatchError) as condition_error:
            self.dispatcher.apply_condition({"condition": "asthma_attack"})
        self.assertEqual(condition_error.exception.code, "UNSUPPORTED_CONDITION")

        expected = {"action": "asthma_attack", "applied": True}
        with patch("action_dispatcher._apply_asthma", return_value=expected) as apply:
            result = self.dispatcher.apply_action(
                {"action": "asthma_attack", "severity": 0.75}
            )
        self.assertEqual(result, expected)
        apply.assert_called_once_with(
            self.engine, {"action": "asthma_attack", "severity": 0.75}
        )

    def test_rejects_invalid_action_and_severity(self) -> None:
        with self.assertRaises(ActionDispatchError) as unsupported:
            self.dispatcher.apply_action({"action": "invented"})
        self.assertEqual(unsupported.exception.code, "UNSUPPORTED_ACTION")

        for severity in (-0.1, 0, 1.1, float("inf"), "0.75", True):
            with self.subTest(severity=severity):
                with self.assertRaises(ActionDispatchError) as invalid:
                    self.dispatcher.apply_action(
                        {"action": "asthma_attack", "severity": severity}
                    )
                self.assertEqual(invalid.exception.code, "INVALID_SEVERITY")

    def test_validates_oxygen_device_flow_and_units_before_pulse(self) -> None:
        base = {
            "action": "supplemental_oxygen",
            "device": "non_rebreather_mask",
            "flow": {"value": 10, "unit": "L/min"},
            "volume": {"value": 1000, "unit": "L"},
        }
        with patch("action_dispatcher._apply_oxygen", return_value={"applied": True}):
            self.dispatcher.apply_action(base)

        invalid_device = dict(base, device="venturi")
        from action_dispatcher import _oxygen_parameters

        with self.assertRaises(ActionDispatchError) as device_error:
            _oxygen_parameters(invalid_device)
        self.assertEqual(device_error.exception.code, "INVALID_DEVICE")

        invalid_unit = {**base, "flow": {"value": 10, "unit": "mL/s"}}
        with self.assertRaises(ActionDispatchError) as unit_error:
            _oxygen_parameters(invalid_unit)
        self.assertEqual(unit_error.exception.code, "INVALID_UNIT")

        invalid_flow = {**base, "flow": {"value": 0, "unit": "L/min"}}
        with self.assertRaises(ActionDispatchError) as flow_error:
            _oxygen_parameters(invalid_flow)
        self.assertEqual(flow_error.exception.code, "INVALID_FLOW")

    def test_validates_albuterol_resource_dose_and_unit(self) -> None:
        from action_dispatcher import _albuterol_parameters

        valid = {
            "dose": {"value": 90, "unit": "ug"},
            "actuations": 1,
            "nozzleLossFraction": 0.04,
            "spacerVolume": {"value": 500, "unit": "mL"},
        }

        with self.assertRaises(ActionDispatchError) as missing:
            _albuterol_parameters(valid, "/missing/pulse")
        self.assertEqual(missing.exception.code, "RESOURCE_NOT_FOUND")

        with self.subTest("existing resource without aerosolization"):
            import tempfile

            with tempfile.TemporaryDirectory() as directory:
                substances = Path(directory) / "substances"
                substances.mkdir()
                (substances / "Albuterol.json").write_text(
                    '{"Name":"Albuterol","State":"Liquid"}', encoding="utf-8"
                )
                with self.assertRaises(ActionDispatchError) as incomplete:
                    _albuterol_parameters(
                        {
                            "dose": {"value": 90, "unit": "ug"},
                            "spacerVolume": {"value": 500, "unit": "mL"},
                        },
                        directory,
                    )
                self.assertEqual(incomplete.exception.code, "RESOURCE_NOT_FOUND")
                self.assertEqual(
                    incomplete.exception.details["missingSection"], "Aerosolization"
                )

        with self.subTest("payload validation precedes resource use"):
            invalid_payloads = (
                ({**valid, "dose": {"value": 0, "unit": "ug"}}, "INVALID_DOSE"),
                ({**valid, "dose": {"value": 90, "unit": "mg"}}, "INVALID_UNIT"),
                ({**valid, "actuations": 0}, "INVALID_DOSE"),
                ({**valid, "nozzleLossFraction": 1}, "INVALID_ACTION_PAYLOAD"),
                ({**valid, "spacerVolume": {"value": 500, "unit": "L"}}, "INVALID_UNIT"),
            )
            for payload, code in invalid_payloads:
                with self.subTest(code=code, payload=payload):
                    with self.assertRaises(ActionDispatchError) as invalid:
                        _albuterol_parameters(payload, "/missing/pulse")
                    self.assertEqual(invalid.exception.code, code)

    def test_preflight_rejects_wrong_substance_name(self) -> None:
        from action_dispatcher import _albuterol_parameters

        import tempfile

        with tempfile.TemporaryDirectory() as directory:
            _write_albuterol_resource(
                directory,
                {"Name": "NotAlbuterol", "Aerosolization": OFFICIAL_TEST_AEROSOLIZATION},
            )
            with self.assertRaises(ActionDispatchError) as wrong_name:
                _albuterol_parameters(
                    {
                        "dose": {"value": 90, "unit": "ug"},
                        "spacerVolume": {"value": 500, "unit": "mL"},
                    },
                    directory,
                )
            self.assertEqual(wrong_name.exception.code, "RESOURCE_NOT_FOUND")
            self.assertEqual(
                wrong_name.exception.details["foundName"], "NotAlbuterol"
            )

    def test_preflight_reports_each_missing_aerosolization_field(self) -> None:
        from action_dispatcher import _albuterol_parameters

        import tempfile

        with tempfile.TemporaryDirectory() as directory:
            _write_albuterol_resource(
                directory,
                {
                    "Name": "Albuterol",
                    "Aerosolization": {
                        "InflammationCoefficient": {"Scalar0To1": {"Value": 0.5}}
                        # BronchioleModifier and ParticulateSizeDistribution absent.
                    },
                },
            )
            with self.assertRaises(ActionDispatchError) as incomplete:
                _albuterol_parameters(
                    {
                        "dose": {"value": 90, "unit": "ug"},
                        "spacerVolume": {"value": 500, "unit": "mL"},
                    },
                    directory,
                )
            self.assertEqual(incomplete.exception.code, "RESOURCE_NOT_FOUND")
            missing = incomplete.exception.details["missingFields"]
            self.assertIn("BronchioleModifier", missing)
            self.assertIn("ParticulateSizeDistribution", missing)
            self.assertNotIn("InflammationCoefficient", missing)

    def test_preflight_rejects_out_of_range_and_malformed_values(self) -> None:
        from action_dispatcher import _albuterol_parameters

        import tempfile

        cases = {
            "BronchioleModifier out of range": {
                **OFFICIAL_TEST_AEROSOLIZATION,
                "BronchioleModifier": {"ScalarNegative1To1": {"Value": 1.5}},
            },
            "InflammationCoefficient NaN": {
                **OFFICIAL_TEST_AEROSOLIZATION,
                "InflammationCoefficient": {"Scalar0To1": {"Value": float("nan")}},
            },
            "histogram fractions do not sum to 1": {
                **OFFICIAL_TEST_AEROSOLIZATION,
                "ParticulateSizeDistribution": {
                    "HistogramFractionVsLength": {
                        "Histogram": {
                            "Independent": [0.0, 1.0, 2.0],
                            "IndependentUnit": "um",
                            "Dependent": [0.1, 0.1],
                        }
                    }
                },
            },
            "histogram unrecognized unit": {
                **OFFICIAL_TEST_AEROSOLIZATION,
                "ParticulateSizeDistribution": {
                    "HistogramFractionVsLength": {
                        "Histogram": {
                            "Independent": [0.0, 1.0],
                            "IndependentUnit": "furlong",
                            "Dependent": [1.0],
                        }
                    }
                },
            },
            "histogram boundaries not increasing": {
                **OFFICIAL_TEST_AEROSOLIZATION,
                "ParticulateSizeDistribution": {
                    "HistogramFractionVsLength": {
                        "Histogram": {
                            "Independent": [1.0, 1.0, 2.0],
                            "IndependentUnit": "um",
                            "Dependent": [0.5, 0.5],
                        }
                    }
                },
            },
        }
        for label, aerosolization in cases.items():
            with self.subTest(label=label):
                with tempfile.TemporaryDirectory() as directory:
                    _write_albuterol_resource(
                        directory,
                        {"Name": "Albuterol", "Aerosolization": aerosolization},
                    )
                    with self.assertRaises(ActionDispatchError) as invalid:
                        _albuterol_parameters(
                            {
                                "dose": {"value": 90, "unit": "ug"},
                                "spacerVolume": {"value": 500, "unit": "mL"},
                            },
                            directory,
                        )
                    self.assertEqual(invalid.exception.code, "RESOURCE_NOT_FOUND")
                    self.assertTrue(invalid.exception.details["invalidFields"])

    def test_preflight_accepts_schema_complete_resource(self) -> None:
        """Positive path: a resource with all three Aerosolization fields well-formed
        must clear the preflight (dose/actuations/spacer are still returned)."""
        from action_dispatcher import _albuterol_parameters

        import tempfile

        with tempfile.TemporaryDirectory() as directory:
            _write_albuterol_resource(
                directory,
                {"Name": "Albuterol", "Aerosolization": OFFICIAL_TEST_AEROSOLIZATION},
            )
            dose, actuations, nozzle_loss, spacer = _albuterol_parameters(
                {
                    "dose": {"value": 90, "unit": "ug"},
                    "actuations": 2,
                    "nozzleLossFraction": 0.04,
                    "spacerVolume": {"value": 500, "unit": "mL"},
                },
                directory,
            )
            self.assertEqual((dose, actuations, nozzle_loss, spacer), (90.0, 2, 0.04, 500.0))

    def test_version_compatibility_gate_blocks_mismatched_engine(self) -> None:
        from action_dispatcher import _check_pulse_version_compatibility

        fake_module = types.SimpleNamespace(version=lambda: "9.9.9")
        with patch.dict(
            sys.modules, {"pulse.engine.PulseEngine": fake_module}
        ):
            with self.assertRaises(ActionDispatchError) as mismatch:
                _check_pulse_version_compatibility()
            self.assertEqual(mismatch.exception.code, "RESOURCE_NOT_FOUND")
            self.assertEqual(mismatch.exception.details["runningVersion"], "9.9.9")

        matching_module = types.SimpleNamespace(version=lambda: "4.3.2")
        with patch.dict(
            sys.modules, {"pulse.engine.PulseEngine": matching_module}
        ):
            _check_pulse_version_compatibility()  # Must not raise.

    def test_only_real_persistent_actions_can_be_cancelled(self) -> None:
        with self.assertRaises(ActionDispatchError) as error:
            self.dispatcher.cancel_action({"action": "albuterol_inhaler"})
        self.assertEqual(error.exception.code, "ACTION_CANCELLATION_FAILED")


if __name__ == "__main__":
    unittest.main()
