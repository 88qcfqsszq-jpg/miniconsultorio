#!/usr/bin/env python3
"""Small JSON Lines fixture used to test the Node process manager."""

import json
import os
import sys
import time
import uuid


MODE = os.environ.get("FAKE_PULSE_MODE", "normal")
TARGET_OPERATION = os.environ.get("FAKE_PULSE_TARGET_OPERATION", "GET_ENGINE_INFO")
sessions = {}
terminated = set()


def response(request, ok=True, data=None, error=None, session_id=None):
    message = {
        "protocolVersion": "1",
        "requestId": request.get("requestId", "unavailable"),
        "ok": ok,
        "warnings": [],
    }
    if data is not None:
        message["data"] = data
    if error is not None:
        message["error"] = error
    if session_id is not None:
        message["sessionId"] = session_id
    return message


def snapshot(session_id):
    current = sessions[session_id]
    return {
        "sessionId": session_id,
        "simulationTimeSeconds": current["time"],
        "vitals": {"heartRate": 72.0, "spo2": 98.0},
        "respiratory": {"tidalVolumeMl": 500.0},
        "unavailableFields": ["vitals.temperatureC"],
        "warnings": ["fake fixture omits temperature"],
    }


def emit(message):
    print(json.dumps(message, separators=(",", ":")), flush=True)


print("fake Pulse runtime started", file=sys.stderr, flush=True)

for line in sys.stdin:
    if not line.strip():
        continue
    request = json.loads(line)
    operation = request.get("operation")

    if operation == TARGET_OPERATION and MODE == "invalid_stdout":
        print("this is not json", flush=True)
        continue
    if operation == TARGET_OPERATION and MODE == "exit":
        os._exit(9)
    if operation == TARGET_OPERATION and MODE == "hang":
        time.sleep(30)
        continue

    if operation == "PING":
        emit(response(request, data={
            "status": "ready",
            "processId": os.getpid(),
            "importAvailable": True,
        }))
    elif operation == "GET_ENGINE_INFO":
        emit(response(request, data={
            "version": "fake-1",
            "buildHash": "fake-hash",
            "pythonPath": sys.executable,
            "pulseRoot": "/fake",
            "importAvailable": True,
            "importError": None,
            "supportedProtocolVersions": ["1"],
            "activeSessionCount": len(sessions),
        }))
    elif operation == "CREATE_SESSION":
        session_id = str(uuid.uuid4())
        patient = {
            "name": "MEDIX Standard Adult",
            "sex": "male",
            "ageYears": 44,
            "weightKg": 77,
            "heightCm": 177,
        }
        patient.update((request.get("payload") or {}).get("patient") or {})
        sessions[session_id] = {
            "time": 0.0,
            "patient": patient,
            "actions": [],
            "events": [],
        }
        initial = snapshot(session_id)
        emit(response(request, data={
            "sessionId": session_id,
            "patient": patient,
            "snapshot": initial,
        }, session_id=session_id))
    elif operation in (
        "GET_SNAPSHOT",
        "GET_EVENTS",
        "APPLY_CONDITION",
        "APPLY_ACTION",
        "CANCEL_ACTION",
        "ADVANCE_TIME",
        "TERMINATE_SESSION",
    ):
        session_id = request.get("sessionId")
        if session_id in terminated:
            emit(response(request, ok=False, error={
                "code": "SESSION_ALREADY_TERMINATED",
                "message": "Session is already terminated.",
            }, session_id=session_id))
            continue
        if session_id not in sessions:
            emit(response(request, ok=False, error={
                "code": "SESSION_NOT_FOUND",
                "message": "Session was not found.",
            }, session_id=session_id))
            continue
        if operation == "GET_SNAPSHOT":
            emit(response(request, data=snapshot(session_id), session_id=session_id))
        elif operation == "GET_EVENTS":
            emit(response(request, data={
                "sessionId": session_id,
                "simulationTimeSeconds": sessions[session_id]["time"],
                "changes": sessions[session_id]["events"],
                "activeEvents": [],
                "ignoredHighFrequencyEventCount": 0,
            }, session_id=session_id))
        elif operation == "APPLY_CONDITION":
            emit(response(request, ok=False, error={
                "code": "UNSUPPORTED_CONDITION",
                "message": "No post-initialization condition is supported.",
            }, session_id=session_id))
        elif operation == "APPLY_ACTION":
            action = request["payload"]["action"]
            sessions[session_id]["actions"].append(action)
            emit(response(request, data={
                "action": action,
                "applied": True,
                "persistent": action != "albuterol_inhaler",
                "simulationTimeSeconds": sessions[session_id]["time"],
                "details": {},
            }, session_id=session_id))
        elif operation == "CANCEL_ACTION":
            action = request["payload"]["action"]
            emit(response(request, data={
                "action": action,
                "cancelled": True,
                "simulationTimeSeconds": sessions[session_id]["time"],
                "details": {},
            }, session_id=session_id))
        elif operation == "ADVANCE_TIME":
            sessions[session_id]["time"] += request["payload"]["seconds"]
            emit(response(request, data=snapshot(session_id), session_id=session_id))
        else:
            del sessions[session_id]
            terminated.add(session_id)
            emit(response(request, data={"terminated": True}, session_id=session_id))
    elif operation == "SHUTDOWN":
        sessions.clear()
        emit(response(request, data={"shuttingDown": True}))
        break
    else:
        emit(response(request, ok=False, error={
            "code": "UNKNOWN_OPERATION",
            "message": "Unknown operation.",
        }))

print("fake Pulse runtime stopped", file=sys.stderr, flush=True)
