"""One persistent PulseEngine instance and patient per runtime session."""

import copy
import os
import time
from typing import Any, Callable, Dict, Optional

try:
    from .action_dispatcher import ActionDispatchError, PulseActionDispatcher
    from .data_request_builder import (
        SnapshotExtractionError,
        build_data_request_manager,
        extract_snapshot,
    )
    from .patient_builder import build_patient_configuration
    from .event_collector import EventCollectionError, PulseEventCollector
except ImportError:  # Direct script/test execution.
    from action_dispatcher import (  # type: ignore
        ActionDispatchError,
        PulseActionDispatcher,
    )
    from data_request_builder import (  # type: ignore
        SnapshotExtractionError,
        build_data_request_manager,
        extract_snapshot,
    )
    from patient_builder import build_patient_configuration  # type: ignore
    from event_collector import (  # type: ignore
        EventCollectionError,
        PulseEventCollector,
    )


class SessionOperationError(RuntimeError):
    """A session failure with a stable protocol error code."""

    def __init__(self, code: str, message: str, details: Any = None) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.details = details


class PulseSession:
    """Own exactly one PulseEngine for the lifetime of one session."""

    def __init__(
        self,
        session_id: str,
        patient_profile: Dict[str, Any],
        engine_factory: Callable[..., Any],
        engine_root: str,
        runtime_directory: Optional[str] = None,
    ) -> None:
        self.session_id = session_id
        self.patient_profile = dict(patient_profile)
        self.engine_root = engine_root
        self.created_at = time.time()
        self.updated_at = self.created_at
        self.active = False
        self.simulation_time_seconds = 0.0
        self.last_snapshot: Optional[Dict[str, Any]] = None
        self.data_request_mapping = None
        self.engine: Any = None
        self.action_dispatcher: Optional[PulseActionDispatcher] = None
        self.event_collector: Optional[PulseEventCollector] = None

        try:
            self.engine = engine_factory(
                data_root_dir=engine_root.rstrip("/") + "/"
            )
            self.engine.log_to_console(False)
            log_target = os.devnull
            if runtime_directory:
                os.makedirs(runtime_directory, exist_ok=True)
                log_target = os.path.join(
                    runtime_directory, f"pulse-{session_id}.log"
                )
            self.engine.set_log_filename(log_target)

            patient_configuration = build_patient_configuration(
                self.patient_profile, engine_root
            )
            request_manager, self.data_request_mapping = (
                build_data_request_manager()
            )
            if not self.engine.initialize_engine(
                patient_configuration, request_manager
            ):
                raise SessionOperationError(
                    "ENGINE_INITIALIZATION_FAILED",
                    "Pulse failed to initialize the patient.",
                )

            self.action_dispatcher = PulseActionDispatcher(
                self.engine, self.engine_root
            )
            self.event_collector = PulseEventCollector(
                self.session_id, self.engine
            )
            self.active = True
            self._refresh_snapshot()
        except SessionOperationError:
            self.terminate()
            raise
        except SnapshotExtractionError as error:
            self.terminate()
            raise SessionOperationError(
                "SNAPSHOT_FAILED", str(error)
            ) from error
        except Exception as error:
            self.terminate()
            raise SessionOperationError(
                "ENGINE_INITIALIZATION_FAILED",
                "Pulse patient initialization raised an exception.",
                {"type": type(error).__name__},
            ) from error

    def _require_active(self) -> None:
        if not self.active or self.engine is None:
            raise SessionOperationError(
                "SESSION_ALREADY_TERMINATED", "Session is already terminated."
            )

    def _refresh_snapshot(self) -> Dict[str, Any]:
        self._require_active()
        try:
            snapshot = extract_snapshot(
                self.session_id,
                self.engine.pull_data(),
                self.data_request_mapping,
            )
        except SnapshotExtractionError as error:
            raise SessionOperationError("SNAPSHOT_FAILED", str(error)) from error
        except Exception as error:
            raise SessionOperationError(
                "SNAPSHOT_FAILED",
                "Pulse snapshot extraction failed.",
                {"type": type(error).__name__},
            ) from error

        self.simulation_time_seconds = snapshot["simulationTimeSeconds"]
        self.last_snapshot = snapshot
        self.updated_at = time.time()
        return copy.deepcopy(snapshot)

    def get_snapshot(self) -> Dict[str, Any]:
        self._require_active()
        if self.last_snapshot is None:
            return self._refresh_snapshot()
        return copy.deepcopy(self.last_snapshot)

    def advance_time(self, seconds: float) -> Dict[str, Any]:
        self._require_active()
        try:
            advanced = self.engine.advance_time_s(seconds)
        except Exception as error:
            raise SessionOperationError(
                "ADVANCE_FAILED",
                "Pulse raised while advancing simulation time.",
                {"type": type(error).__name__},
            ) from error
        if not advanced:
            raise SessionOperationError(
                "ADVANCE_FAILED", "Pulse failed to advance simulation time."
            )
        self._capture_events()
        return self._refresh_snapshot()

    def _require_dispatcher(self) -> PulseActionDispatcher:
        self._require_active()
        if self.action_dispatcher is None:
            raise SessionOperationError(
                "ACTION_APPLICATION_FAILED", "Pulse action dispatcher is unavailable."
            )
        return self.action_dispatcher

    def _capture_events(self) -> None:
        if self.event_collector is None:
            raise SessionOperationError(
                "EVENT_COLLECTION_FAILED", "Pulse event collector is unavailable."
            )
        try:
            self.event_collector.capture_changes()
        except EventCollectionError as error:
            raise SessionOperationError(
                "EVENT_COLLECTION_FAILED", str(error)
            ) from error

    def _dispatch(self, method: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        dispatcher = self._require_dispatcher()
        try:
            result = getattr(dispatcher, method)(payload)
        except ActionDispatchError as error:
            raise SessionOperationError(
                error.code, error.message, error.details
            ) from error
        result["simulationTimeSeconds"] = self.simulation_time_seconds
        self.updated_at = time.time()
        return copy.deepcopy(result)

    def apply_condition(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return self._dispatch("apply_condition", payload)

    def apply_action(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return self._dispatch("apply_action", payload)

    def cancel_action(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return self._dispatch("cancel_action", payload)

    def get_events(self) -> Dict[str, Any]:
        self._require_active()
        if self.event_collector is None:
            raise SessionOperationError(
                "EVENT_COLLECTION_FAILED", "Pulse event collector is unavailable."
            )
        try:
            events = self.event_collector.snapshot(self.simulation_time_seconds)
        except EventCollectionError as error:
            raise SessionOperationError(
                "EVENT_COLLECTION_FAILED", str(error)
            ) from error
        return copy.deepcopy(events)

    def terminate(self) -> None:
        engine = self.engine
        self.engine = None
        self.action_dispatcher = None
        self.event_collector = None
        self.active = False
        self.updated_at = time.time()
        if engine is not None:
            try:
                engine.clear()
            except Exception:
                # Native cleanup is best effort during termination.
                pass
