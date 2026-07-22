from pathlib import Path
import sys
import unittest
from unittest.mock import patch


RUNTIME_DIRECTORY = Path(__file__).resolve().parents[1]
if str(RUNTIME_DIRECTORY) not in sys.path:
    sys.path.insert(0, str(RUNTIME_DIRECTORY))

from event_collector import PulseEventCollector


class FakeNativeEngine:
    def __init__(self) -> None:
        self.keep_changes = False

    def keep_event_changes(self, enabled):
        self.keep_changes = enabled


class FakeEngine:
    def __init__(self) -> None:
        self._PulseEngine__pulse = FakeNativeEngine()

    def pull_active_events(self):
        return {"Hypoxia": 12.5, "StartOfInhale": 0.1}


class EventCollectorTests(unittest.TestCase):
    def test_enables_native_collection_and_structures_active_events(self) -> None:
        engine = FakeEngine()
        collector = PulseEventCollector("session-1", engine)
        self.assertTrue(engine._PulseEngine__pulse.keep_changes)

        with patch.object(collector, "capture_changes"):
            result = collector.snapshot(30.0)

        self.assertEqual(len(result["activeEvents"]), 1)
        event = result["activeEvents"][0]
        self.assertEqual(event["pulseName"], "Hypoxia")
        self.assertEqual(event["source"], "pulse")
        self.assertEqual(event["simulationTimeSeconds"], 17.5)
        self.assertEqual(event["durationSeconds"], 12.5)

    def test_change_records_keep_pulse_origin_and_physiological_time(self) -> None:
        collector = PulseEventCollector("session-2", FakeEngine())
        event = collector._new_record("Tachypnea", True, 45.25)
        self.assertEqual(event["pulseName"], "Tachypnea")
        self.assertTrue(event["active"])
        self.assertEqual(event["simulationTimeSeconds"], 45.25)
        self.assertEqual(event["category"], "respiratory")
        self.assertEqual(event["source"], "pulse")


if __name__ == "__main__":
    unittest.main()
