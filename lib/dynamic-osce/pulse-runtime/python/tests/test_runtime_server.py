import json
import os
from pathlib import Path
import subprocess
import sys
import unittest


SERVER = Path(__file__).resolve().parents[1] / "pulse_runtime_server.py"


class RuntimeServerTests(unittest.TestCase):
    def test_ping_info_invalid_json_and_shutdown_keep_streams_separate(self) -> None:
        requests = [
            {
                "protocolVersion": "1",
                "requestId": "ping",
                "operation": "PING",
            },
            {
                "protocolVersion": "1",
                "requestId": "info",
                "operation": "GET_ENGINE_INFO",
            },
        ]
        stdin = "\n".join(json.dumps(request) for request in requests)
        stdin += '\n{"requestId":"bad-json",\n'
        stdin += json.dumps(
            {
                "protocolVersion": "1",
                "requestId": "shutdown",
                "operation": "SHUTDOWN",
            }
        )
        stdin += "\n"

        environment = {
            **os.environ,
            "PYTHONDONTWRITEBYTECODE": "1",
            "MEDIX_PULSE_FORCE_IMPORT_FAILURE": "1",
        }
        completed = subprocess.run(
            [sys.executable, "-u", str(SERVER)],
            input=stdin,
            text=True,
            capture_output=True,
            env=environment,
            timeout=10,
            check=False,
        )

        self.assertEqual(completed.returncode, 0, completed.stderr)
        lines = completed.stdout.splitlines()
        self.assertEqual(len(lines), 4, completed.stdout)
        responses = [json.loads(line) for line in lines]
        self.assertTrue(responses[0]["ok"])
        self.assertEqual(responses[0]["data"]["status"], "ready")
        self.assertFalse(responses[1]["data"]["importAvailable"])
        self.assertEqual(responses[2]["requestId"], "bad-json")
        self.assertEqual(responses[2]["error"]["code"], "INVALID_JSON")
        self.assertTrue(responses[3]["data"]["shuttingDown"])
        self.assertIn("Pulse import failed", completed.stderr)
        self.assertNotIn("Pulse import failed", completed.stdout)


if __name__ == "__main__":
    unittest.main()
