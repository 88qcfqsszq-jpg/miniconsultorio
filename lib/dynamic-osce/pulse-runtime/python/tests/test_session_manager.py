from pathlib import Path
import sys
import unittest


RUNTIME_DIRECTORY = Path(__file__).resolve().parents[1]
if str(RUNTIME_DIRECTORY) not in sys.path:
    sys.path.insert(0, str(RUNTIME_DIRECTORY))

from pulse_session import SessionOperationError
from session_manager import SessionManager


class FakeSession:
    created = []

    def __init__(
        self,
        session_id,
        patient_profile,
        engine_factory,
        engine_root,
        runtime_directory,
    ) -> None:
        self.session_id = session_id
        self.patient_profile = patient_profile
        self.engine = object()
        self.active = True
        self.time = 0.0
        self.advance_calls = []
        self.condition_calls = []
        self.action_calls = []
        self.cancel_calls = []
        FakeSession.created.append(self)

    def _snapshot(self):
        return {
            "sessionId": self.session_id,
            "simulationTimeSeconds": self.time,
            "vitals": {"heartRate": 72.0},
            "respiratory": {},
            "unavailableFields": [],
            "warnings": [],
        }

    def get_snapshot(self):
        return self._snapshot()

    def advance_time(self, seconds):
        self.advance_calls.append(seconds)
        self.time += seconds
        return self._snapshot()

    def apply_condition(self, payload):
        self.condition_calls.append(payload)
        return {"condition": payload["condition"], "simulationTimeSeconds": self.time}

    def apply_action(self, payload):
        self.action_calls.append(payload)
        return {"action": payload["action"], "simulationTimeSeconds": self.time}

    def cancel_action(self, payload):
        self.cancel_calls.append(payload)
        return {"action": payload["action"], "simulationTimeSeconds": self.time}

    def get_events(self):
        return {
            "sessionId": self.session_id,
            "simulationTimeSeconds": self.time,
            "changes": [],
            "activeEvents": [],
            "ignoredHighFrequencyEventCount": 0,
        }

    def terminate(self):
        self.active = False
        self.engine = None


class SessionManagerTests(unittest.TestCase):
    def setUp(self) -> None:
        FakeSession.created.clear()
        self.manager = SessionManager(
            engine_factory=lambda **_: object(),
            engine_root="/fake/pulse",
            session_factory=FakeSession,
        )

    def test_creates_unique_sessions_with_default_patient_and_snapshot(self) -> None:
        first = self.manager.create_session(None)
        second = self.manager.create_session({})

        self.assertNotEqual(first.session_id, second.session_id)
        self.assertEqual(first.patient_profile["name"], "MEDIX Standard Adult")
        self.assertEqual(first.patient_profile["ageYears"], 44.0)
        self.assertEqual(first.get_snapshot()["simulationTimeSeconds"], 0.0)
        self.assertEqual(self.manager.active_session_count, 2)

    def test_two_advances_reuse_same_session_and_increase_time(self) -> None:
        session = self.manager.create_session(None)
        engine_identity = session.engine

        first = self.manager.advance_time(session.session_id, 10)
        second = self.manager.advance_time(session.session_id, 10)

        self.assertIs(session.engine, engine_identity)
        self.assertEqual(first["simulationTimeSeconds"], 10.0)
        self.assertEqual(second["simulationTimeSeconds"], 20.0)
        self.assertEqual(session.advance_calls, [10.0, 10.0])

    def test_new_operations_reuse_the_same_session_and_engine(self) -> None:
        session = self.manager.create_session(None)
        engine_identity = session.engine

        self.manager.apply_condition(session.session_id, {"condition": "unsupported"})
        self.manager.apply_action(
            session.session_id, {"action": "asthma_attack", "severity": 0.75}
        )
        self.manager.advance_time(session.session_id, 30)
        self.manager.apply_action(
            session.session_id,
            {
                "action": "supplemental_oxygen",
                "device": "nasal_cannula",
            },
        )
        events = self.manager.get_events(session.session_id)
        self.manager.cancel_action(
            session.session_id, {"action": "supplemental_oxygen"}
        )

        self.assertIs(session.engine, engine_identity)
        self.assertEqual(len(FakeSession.created), 1)
        self.assertEqual(events["sessionId"], session.session_id)
        self.assertEqual(events["simulationTimeSeconds"], 30.0)
        self.assertEqual(
            [call["action"] for call in session.action_calls],
            ["asthma_attack", "supplemental_oxygen"],
        )
        self.assertEqual(
            session.cancel_calls, [{"action": "supplemental_oxygen"}]
        )

    def test_terminate_prevents_further_access(self) -> None:
        session = self.manager.create_session(None)
        self.manager.terminate_session(session.session_id)

        self.assertFalse(session.active)
        self.assertEqual(self.manager.active_session_count, 0)
        with self.assertRaises(SessionOperationError) as raised:
            self.manager.advance_time(session.session_id, 10)
        self.assertEqual(raised.exception.code, "SESSION_ALREADY_TERMINATED")

    def test_validates_patient_and_advance_duration(self) -> None:
        with self.assertRaises(SessionOperationError) as patient_error:
            self.manager.create_session({"patient": {"ageYears": 12}})
        self.assertEqual(patient_error.exception.code, "INVALID_REQUEST")

        session = self.manager.create_session(None)
        for duration in (0, -1, float("inf"), "10", True, 3601):
            with self.subTest(duration=duration):
                with self.assertRaises(SessionOperationError) as advance_error:
                    self.manager.advance_time(session.session_id, duration)
                self.assertEqual(
                    advance_error.exception.code, "INVALID_ADVANCE_DURATION"
                )

    def test_shutdown_terminates_every_session_and_blocks_creation(self) -> None:
        sessions = [self.manager.create_session(None) for _ in range(2)]
        self.manager.shutdown()

        self.assertEqual(self.manager.active_session_count, 0)
        self.assertTrue(all(not session.active for session in sessions))
        with self.assertRaises(SessionOperationError) as raised:
            self.manager.create_session(None)
        self.assertEqual(raised.exception.code, "SHUTTING_DOWN")


if __name__ == "__main__":
    unittest.main()
