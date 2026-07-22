#!/usr/bin/env python3
"""Persistent MEDIX Pulse runtime using JSON Lines over stdin/stdout."""

import logging
import os
from pathlib import Path
import sys
from typing import Any, Dict, Optional, Tuple

SCRIPT_DIRECTORY = Path(__file__).resolve().parent
if str(SCRIPT_DIRECTORY) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIRECTORY))

from logging_config import configure_logging
from protocol import (
    ProtocolError,
    encode_message,
    make_error,
    make_success,
    parse_request,
)
from pulse_session import SessionOperationError
from session_manager import SessionManager


def resolve_engine_root() -> Path:
    configured = os.environ.get("MEDIX_PULSE_ROOT")
    if configured:
        return Path(configured).expanduser().resolve()
    repository_root = SCRIPT_DIRECTORY.parents[3]
    return repository_root / ".reference-local" / "engine-stable"


def configure_pulse_paths(engine_root: Path) -> None:
    candidates = [
        engine_root / "build" / "install" / "lib",
        engine_root / "build" / "install" / "python",
        engine_root / "build" / "install" / "bin",
    ]
    existing = [str(path) for path in candidates if path.is_dir()]
    for path in reversed(existing):
        if path not in sys.path:
            sys.path.insert(0, path)


def load_pulse(engine_root: Path) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """Import PyPulse and its wrapper once during process bootstrap."""
    if os.environ.get("MEDIX_PULSE_FORCE_IMPORT_FAILURE") == "1":
        return None, "Pulse import disabled by test configuration."
    if not engine_root.is_dir():
        return None, f"Pulse root does not exist: {engine_root}"

    configure_pulse_paths(engine_root)
    try:
        import PyPulse
        from pulse.engine.PulseEngine import PulseEngine, hash as pulse_hash, version

        return {
            "engineFactory": PulseEngine,
            "version": version(),
            "buildHash": pulse_hash(),
            "moduleVersion": getattr(PyPulse, "__version__", None),
        }, None
    except Exception as error:
        return None, f"{type(error).__name__}: {error}"


class RuntimeServer:
    def __init__(self) -> None:
        self.logger = logging.getLogger("medix.pulse_runtime.server")
        self.engine_root = resolve_engine_root()
        self.pulse, self.import_error = load_pulse(self.engine_root)
        self.runtime_directory = os.environ.get("MEDIX_PULSE_RUNTIME_DIR")
        self.manager: Optional[SessionManager] = None
        self.shutdown_requested = False

        if self.pulse is not None:
            self.manager = SessionManager(
                engine_factory=self.pulse["engineFactory"],
                engine_root=str(self.engine_root),
                runtime_directory=self.runtime_directory,
            )
            self.logger.info(
                "Pulse runtime ready (version=%s, hash=%s)",
                self.pulse.get("version"),
                self.pulse.get("buildHash"),
            )
        else:
            self.logger.error("Pulse import failed: %s", self.import_error)

    @property
    def engine_version(self) -> Optional[str]:
        if self.pulse is None:
            return None
        version = self.pulse.get("version")
        return str(version) if version is not None else None

    def engine_info(self) -> Dict[str, Any]:
        return {
            "version": self.pulse.get("version") if self.pulse else None,
            "buildHash": self.pulse.get("buildHash") if self.pulse else None,
            "pythonPath": sys.executable,
            "pulseRoot": str(self.engine_root),
            "importAvailable": self.pulse is not None,
            "importError": self.import_error,
            "supportedProtocolVersions": ["1"],
            "activeSessionCount": self.manager.active_session_count
            if self.manager
            else 0,
        }

    def require_manager(self) -> SessionManager:
        if self.manager is None:
            raise SessionOperationError(
                "ENGINE_IMPORT_FAILED",
                "PyPulse is not available in this runtime process.",
                {"reason": self.import_error},
            )
        return self.manager

    def handle(self, request: Dict[str, Any]) -> Dict[str, Any]:
        request_id = request["requestId"]
        operation = request["operation"]
        session_id = request.get("sessionId")
        payload = request.get("payload") or {}

        if operation == "PING":
            return make_success(
                request_id,
                {
                    "status": "ready",
                    "processId": os.getpid(),
                    "importAvailable": self.pulse is not None,
                },
                engine_version=self.engine_version,
            )

        if operation == "GET_ENGINE_INFO":
            return make_success(
                request_id,
                self.engine_info(),
                engine_version=self.engine_version,
            )

        if operation == "SHUTDOWN":
            self.shutdown_requested = True
            if self.manager is not None:
                self.manager.shutdown()
            return make_success(
                request_id,
                {"shuttingDown": True},
                engine_version=self.engine_version,
            )

        manager = self.require_manager()

        if operation == "CREATE_SESSION":
            session = manager.create_session(payload)
            snapshot = session.get_snapshot()
            return make_success(
                request_id,
                {
                    "sessionId": session.session_id,
                    "patient": session.patient_profile,
                    "snapshot": snapshot,
                },
                session_id=session.session_id,
                warnings=snapshot["warnings"],
                engine_version=self.engine_version,
                simulation_time_seconds=snapshot["simulationTimeSeconds"],
            )

        if operation == "ADVANCE_TIME":
            snapshot = manager.advance_time(session_id, payload.get("seconds"))
            return make_success(
                request_id,
                snapshot,
                session_id=session_id,
                warnings=snapshot["warnings"],
                engine_version=self.engine_version,
                simulation_time_seconds=snapshot["simulationTimeSeconds"],
            )

        if operation == "APPLY_CONDITION":
            result = manager.apply_condition(session_id, payload)
            return make_success(
                request_id,
                result,
                session_id=session_id,
                engine_version=self.engine_version,
                simulation_time_seconds=result["simulationTimeSeconds"],
            )

        if operation == "APPLY_ACTION":
            result = manager.apply_action(session_id, payload)
            return make_success(
                request_id,
                result,
                session_id=session_id,
                engine_version=self.engine_version,
                simulation_time_seconds=result["simulationTimeSeconds"],
            )

        if operation == "CANCEL_ACTION":
            result = manager.cancel_action(session_id, payload)
            return make_success(
                request_id,
                result,
                session_id=session_id,
                engine_version=self.engine_version,
                simulation_time_seconds=result["simulationTimeSeconds"],
            )

        if operation == "GET_SNAPSHOT":
            snapshot = manager.get_snapshot(session_id)
            return make_success(
                request_id,
                snapshot,
                session_id=session_id,
                warnings=snapshot["warnings"],
                engine_version=self.engine_version,
                simulation_time_seconds=snapshot["simulationTimeSeconds"],
            )

        if operation == "GET_EVENTS":
            events = manager.get_events(session_id)
            return make_success(
                request_id,
                events,
                session_id=session_id,
                engine_version=self.engine_version,
                simulation_time_seconds=events["simulationTimeSeconds"],
            )

        if operation == "TERMINATE_SESSION":
            manager.terminate_session(session_id)
            return make_success(
                request_id,
                {"terminated": True},
                session_id=session_id,
                engine_version=self.engine_version,
            )

        raise SessionOperationError(
            "UNKNOWN_OPERATION", "Operation is not supported."
        )


def emit(response: Dict[str, Any]) -> None:
    sys.stdout.write(encode_message(response) + "\n")
    sys.stdout.flush()


def main() -> int:
    configure_logging()
    logger = logging.getLogger("medix.pulse_runtime.main")
    server = RuntimeServer()

    for raw_line in sys.stdin:
        line = raw_line.rstrip("\r\n")
        if not line:
            continue
        request_id = "unavailable"
        session_id = None
        try:
            request = parse_request(line)
            request_id = request["requestId"]
            session_id = request.get("sessionId")
            response = server.handle(request)
        except ProtocolError as error:
            response = make_error(
                error.request_id,
                error.code,
                error.message,
                error.details,
            )
        except SessionOperationError as error:
            response = make_error(
                request_id,
                error.code,
                error.message,
                error.details,
                session_id=session_id,
            )
        except Exception as error:
            logger.exception("Unhandled runtime command failure")
            response = make_error(
                request_id,
                "INTERNAL_ERROR",
                "The Pulse runtime encountered an internal error.",
                {"type": type(error).__name__},
                session_id=session_id,
            )

        try:
            emit(response)
        except (BrokenPipeError, OSError):
            logger.error("Protocol stdout closed; terminating runtime")
            break

        if server.shutdown_requested:
            break

    if server.manager is not None and not server.manager.shutting_down:
        server.manager.shutdown()
    logger.info("Pulse runtime stopped")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
