"""Version 1 JSON Lines protocol primitives for the Pulse runtime."""

import json
import re
from typing import Any, Dict, Optional


PROTOCOL_VERSION = "1"
UNKNOWN_REQUEST_ID = "unavailable"
OPERATIONS = frozenset(
    {
        "PING",
        "GET_ENGINE_INFO",
        "CREATE_SESSION",
        "APPLY_CONDITION",
        "APPLY_ACTION",
        "CANCEL_ACTION",
        "ADVANCE_TIME",
        "GET_SNAPSHOT",
        "GET_EVENTS",
        "TERMINATE_SESSION",
        "SHUTDOWN",
    }
)

_REQUEST_ID_PATTERN = re.compile(
    r'["\']requestId["\']\s*:\s*["\']([^"\'\\]{1,256})["\']'
)


class ProtocolError(Exception):
    """A request error that can be represented in the wire protocol."""

    def __init__(
        self,
        code: str,
        message: str,
        request_id: str = UNKNOWN_REQUEST_ID,
        details: Any = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.request_id = request_id
        self.details = details


def recover_request_id(line: str) -> str:
    """Recover a simple requestId from malformed JSON when possible."""
    match = _REQUEST_ID_PATTERN.search(line)
    return match.group(1) if match else UNKNOWN_REQUEST_ID


def parse_request(line: str) -> Dict[str, Any]:
    """Parse and validate the common request envelope."""
    try:
        request = json.loads(line)
    except json.JSONDecodeError as error:
        raise ProtocolError(
            "INVALID_JSON",
            "Request line is not valid JSON.",
            recover_request_id(line),
            {"line": error.lineno, "column": error.colno},
        ) from error

    if not isinstance(request, dict):
        raise ProtocolError(
            "INVALID_REQUEST",
            "Request must be a JSON object.",
        )

    request_id = request.get("requestId")
    if not isinstance(request_id, str) or not request_id.strip():
        raise ProtocolError(
            "INVALID_REQUEST",
            "requestId must be a non-empty string.",
        )
    if len(request_id) > 256:
        raise ProtocolError(
            "INVALID_REQUEST",
            "requestId exceeds the maximum length.",
            request_id[:256],
        )

    if request.get("protocolVersion") != PROTOCOL_VERSION:
        raise ProtocolError(
            "UNSUPPORTED_PROTOCOL_VERSION",
            "Only protocol version 1 is supported.",
            request_id,
            {"supported": [PROTOCOL_VERSION]},
        )

    operation = request.get("operation")
    if not isinstance(operation, str):
        raise ProtocolError(
            "INVALID_REQUEST",
            "operation must be a string.",
            request_id,
        )
    if operation not in OPERATIONS:
        raise ProtocolError(
            "UNKNOWN_OPERATION",
            "Operation is not supported.",
            request_id,
            {"operation": operation},
        )

    session_id = request.get("sessionId")
    if session_id is not None and (
        not isinstance(session_id, str) or not session_id.strip()
    ):
        raise ProtocolError(
            "INVALID_REQUEST",
            "sessionId must be a non-empty string when provided.",
            request_id,
        )

    payload = request.get("payload")
    if payload is not None and not isinstance(payload, dict):
        raise ProtocolError(
            "INVALID_REQUEST",
            "payload must be an object when provided.",
            request_id,
        )

    return request


def make_success(
    request_id: str,
    data: Any = None,
    session_id: Optional[str] = None,
    warnings: Optional[list] = None,
    engine_version: Optional[str] = None,
    simulation_time_seconds: Optional[float] = None,
) -> Dict[str, Any]:
    response: Dict[str, Any] = {
        "protocolVersion": PROTOCOL_VERSION,
        "requestId": request_id,
        "ok": True,
        "warnings": list(warnings or []),
    }
    if session_id is not None:
        response["sessionId"] = session_id
    if data is not None:
        response["data"] = data
    if engine_version is not None:
        response["engineVersion"] = engine_version
    if simulation_time_seconds is not None:
        response["simulationTimeSeconds"] = simulation_time_seconds
    return response


def make_error(
    request_id: str,
    code: str,
    message: str,
    details: Any = None,
    session_id: Optional[str] = None,
    warnings: Optional[list] = None,
) -> Dict[str, Any]:
    error: Dict[str, Any] = {"code": code, "message": message}
    if details is not None:
        error["details"] = details

    response: Dict[str, Any] = {
        "protocolVersion": PROTOCOL_VERSION,
        "requestId": request_id,
        "ok": False,
        "error": error,
        "warnings": list(warnings or []),
    }
    if session_id is not None:
        response["sessionId"] = session_id
    return response


def encode_message(message: Dict[str, Any]) -> str:
    """Encode one protocol message and reject NaN/Infinity."""
    return json.dumps(
        message,
        ensure_ascii=False,
        allow_nan=False,
        separators=(",", ":"),
    )
