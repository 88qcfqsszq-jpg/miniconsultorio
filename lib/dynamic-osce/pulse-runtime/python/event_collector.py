"""Collect native Pulse event changes and active events without inventing events."""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple


class EventCollectionError(RuntimeError):
    pass


IGNORED_HIGH_FREQUENCY_EVENTS = frozenset(
    {"StartOfCardiacCycle", "StartOfInhale", "StartOfExhale"}
)

EVENT_METADATA: Dict[str, Tuple[str, str]] = {
    "Bradypnea": ("respiratory", "high"),
    "BrainOxygenDeficit": ("neurologic", "high"),
    "CardiacArrest": ("cardiovascular", "critical"),
    "CardiovascularCollapse": ("cardiovascular", "critical"),
    "CriticalBrainOxygenDeficit": ("neurologic", "critical"),
    "Fatigue": ("systemic", "moderate"),
    "Hypercapnia": ("respiratory", "high"),
    "Hypoxia": ("respiratory", "high"),
    "IrreversibleState": ("systemic", "critical"),
    "MaximumPulmonaryVentilationRate": ("respiratory", "high"),
    "ModerateHyperoxemia": ("respiratory", "moderate"),
    "ModerateHypocapnia": ("respiratory", "moderate"),
    "RespiratoryAcidosis": ("respiratory", "high"),
    "RespiratoryAlkalosis": ("respiratory", "moderate"),
    "SevereHyperoxemia": ("respiratory", "high"),
    "SevereHypocapnia": ("respiratory", "high"),
    "SupplementalOxygenBottleExhausted": ("equipment", "high"),
    "NonRebreatherMaskOxygenBagEmpty": ("equipment", "high"),
    "Tachycardia": ("cardiovascular", "moderate"),
    "Tachypnea": ("respiratory", "moderate"),
}


def _recorded_at() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _native_engine(engine: Any) -> Any:
    native = getattr(engine, "_PulseEngine__pulse", None)
    if native is None:
        raise EventCollectionError(
            "The installed Pulse wrapper does not expose native event collection."
        )
    return native


def _metadata(name: str) -> Tuple[str, str]:
    return EVENT_METADATA.get(name, ("other", "informational"))


class PulseEventCollector:
    MAX_HISTORY = 4096

    def __init__(self, session_id: str, engine: Any) -> None:
        self.session_id = session_id
        self.engine = engine
        self.history: List[Dict[str, Any]] = []
        self._sequence = 0
        self.ignored_high_frequency_count = 0
        try:
            _native_engine(engine).keep_event_changes(True)
        except Exception as error:
            raise EventCollectionError(
                "Pulse event change collection could not be enabled."
            ) from error

    def _new_record(
        self, name: str, active: bool, simulation_time_seconds: float
    ) -> Dict[str, Any]:
        self._sequence += 1
        category, severity = _metadata(name)
        return {
            "id": (
                f"{self.session_id}:{name}:"
                f"{'start' if active else 'end'}:{simulation_time_seconds:.6f}:{self._sequence}"
            ),
            "pulseName": name,
            "active": active,
            "simulationTimeSeconds": simulation_time_seconds,
            "category": category,
            "severity": severity,
            "source": "pulse",
            "recordedAt": _recorded_at(),
        }

    def capture_changes(self) -> None:
        try:
            import PyPulse
            from google.protobuf import json_format
            from pulse.cdm.bind.Events_pb2 import EventChangeListData
            from pulse.cdm.engine import eEvent

            raw = _native_engine(self.engine).pull_events(
                PyPulse.serialization_format.json
            )
            if not raw:
                return
            changes = EventChangeListData()
            json_format.Parse(raw, changes)
            for change in changes.Change:
                name = eEvent(change.Event).name
                if name in IGNORED_HIGH_FREQUENCY_EVENTS:
                    self.ignored_high_frequency_count += 1
                    continue
                simulation_time = float(change.SimTime.ScalarTime.Value)
                self.history.append(
                    self._new_record(name, bool(change.Active), simulation_time)
                )
            if len(self.history) > self.MAX_HISTORY:
                self.history = self.history[-self.MAX_HISTORY :]
        except Exception as error:
            raise EventCollectionError(
                "Pulse event changes could not be collected."
            ) from error

    def _active_records(
        self, simulation_time_seconds: float
    ) -> List[Dict[str, Any]]:
        try:
            active = self.engine.pull_active_events() or {}
        except Exception as error:
            raise EventCollectionError(
                "Pulse active events could not be collected."
            ) from error
        records = []
        for name, raw_duration in sorted(active.items()):
            if name in IGNORED_HIGH_FREQUENCY_EVENTS:
                continue
            duration = max(0.0, float(raw_duration))
            category, severity = _metadata(name)
            started_at = max(0.0, simulation_time_seconds - duration)
            records.append(
                {
                    "id": f"{self.session_id}:{name}:active:{started_at:.6f}",
                    "pulseName": name,
                    "active": True,
                    "simulationTimeSeconds": started_at,
                    "durationSeconds": duration,
                    "category": category,
                    "severity": severity,
                    "source": "pulse",
                    "recordedAt": _recorded_at(),
                }
            )
        return records

    def snapshot(self, simulation_time_seconds: float) -> Dict[str, Any]:
        self.capture_changes()
        return {
            "sessionId": self.session_id,
            "simulationTimeSeconds": simulation_time_seconds,
            "changes": [dict(event) for event in self.history],
            "activeEvents": self._active_records(simulation_time_seconds),
            "ignoredHighFrequencyEventCount": self.ignored_high_frequency_count,
        }
