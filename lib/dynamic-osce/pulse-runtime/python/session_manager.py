"""In-process registry for persistent Pulse sessions."""

import math
import time
import uuid
from typing import Any, Callable, Dict, Optional

try:
    from .patient_builder import PatientValidationError, validate_patient_payload
    from .pulse_session import PulseSession, SessionOperationError
except ImportError:  # Direct script/test execution.
    from patient_builder import (  # type: ignore
        PatientValidationError,
        validate_patient_payload,
    )
    from pulse_session import PulseSession, SessionOperationError  # type: ignore


class SessionManager:
    """Manage many logical sessions inside one persistent Python process."""

    MAX_TERMINATED_IDS = 2048

    def __init__(
        self,
        engine_factory: Callable[..., Any],
        engine_root: str,
        runtime_directory: Optional[str] = None,
        session_factory: Callable[..., Any] = PulseSession,
    ) -> None:
        self._engine_factory = engine_factory
        self._engine_root = engine_root
        self._runtime_directory = runtime_directory
        self._session_factory = session_factory
        self._sessions: Dict[str, Any] = {}
        self._terminated: Dict[str, float] = {}
        self._shutting_down = False

    @property
    def active_session_count(self) -> int:
        return len(self._sessions)

    @property
    def shutting_down(self) -> bool:
        return self._shutting_down

    def _require_running(self) -> None:
        if self._shutting_down:
            raise SessionOperationError(
                "SHUTTING_DOWN", "The Pulse runtime is shutting down."
            )

    def _new_session_id(self) -> str:
        while True:
            session_id = str(uuid.uuid4())
            if session_id not in self._sessions and session_id not in self._terminated:
                return session_id

    def create_session(self, payload: Optional[Dict[str, Any]]) -> Any:
        self._require_running()
        try:
            patient_profile = validate_patient_payload(payload)
        except PatientValidationError as error:
            raise SessionOperationError("INVALID_REQUEST", str(error)) from error

        session_id = self._new_session_id()
        session = self._session_factory(
            session_id=session_id,
            patient_profile=patient_profile,
            engine_factory=self._engine_factory,
            engine_root=self._engine_root,
            runtime_directory=self._runtime_directory,
        )
        self._sessions[session_id] = session
        return session

    def get_session(self, session_id: Optional[str]) -> Any:
        self._require_running()
        if not isinstance(session_id, str) or not session_id:
            raise SessionOperationError(
                "INVALID_REQUEST", "A sessionId is required for this operation."
            )
        session = self._sessions.get(session_id)
        if session is not None:
            return session
        if session_id in self._terminated:
            raise SessionOperationError(
                "SESSION_ALREADY_TERMINATED", "Session is already terminated."
            )
        raise SessionOperationError("SESSION_NOT_FOUND", "Session was not found.")

    def advance_time(self, session_id: Optional[str], seconds: Any) -> Dict[str, Any]:
        if isinstance(seconds, bool) or not isinstance(seconds, (int, float)):
            raise SessionOperationError(
                "INVALID_ADVANCE_DURATION", "seconds must be a finite positive number."
            )
        duration = float(seconds)
        if not math.isfinite(duration) or duration <= 0 or duration > 3600:
            raise SessionOperationError(
                "INVALID_ADVANCE_DURATION",
                "seconds must be greater than 0 and no more than 3600.",
            )
        return self.get_session(session_id).advance_time(duration)

    def get_snapshot(self, session_id: Optional[str]) -> Dict[str, Any]:
        return self.get_session(session_id).get_snapshot()

    def apply_condition(
        self, session_id: Optional[str], payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        return self.get_session(session_id).apply_condition(payload)

    def apply_action(
        self, session_id: Optional[str], payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        return self.get_session(session_id).apply_action(payload)

    def cancel_action(
        self, session_id: Optional[str], payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        return self.get_session(session_id).cancel_action(payload)

    def get_events(self, session_id: Optional[str]) -> Dict[str, Any]:
        return self.get_session(session_id).get_events()

    def terminate_session(self, session_id: Optional[str]) -> None:
        session = self.get_session(session_id)
        session.terminate()
        assert session_id is not None
        del self._sessions[session_id]
        self._terminated[session_id] = time.time()
        while len(self._terminated) > self.MAX_TERMINATED_IDS:
            oldest = next(iter(self._terminated))
            del self._terminated[oldest]

    def shutdown(self) -> None:
        if self._shutting_down:
            return
        self._shutting_down = True
        sessions = list(self._sessions.items())
        self._sessions.clear()
        for session_id, session in sessions:
            session.terminate()
            self._terminated[session_id] = time.time()
