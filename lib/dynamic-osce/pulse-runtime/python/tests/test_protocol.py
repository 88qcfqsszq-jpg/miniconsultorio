import json
import math
from pathlib import Path
import sys
import unittest


RUNTIME_DIRECTORY = Path(__file__).resolve().parents[1]
if str(RUNTIME_DIRECTORY) not in sys.path:
    sys.path.insert(0, str(RUNTIME_DIRECTORY))

from protocol import ProtocolError, encode_message, parse_request


class ProtocolTests(unittest.TestCase):
    def test_parses_valid_json_request(self) -> None:
        request = parse_request(
            json.dumps(
                {
                    "protocolVersion": "1",
                    "requestId": "request-1",
                    "operation": "PING",
                }
            )
        )
        self.assertEqual(request["requestId"], "request-1")
        self.assertEqual(request["operation"], "PING")

    def test_invalid_json_recovers_request_id(self) -> None:
        with self.assertRaises(ProtocolError) as raised:
            parse_request('{"requestId":"recover-me",')
        self.assertEqual(raised.exception.code, "INVALID_JSON")
        self.assertEqual(raised.exception.request_id, "recover-me")

    def test_rejects_unsupported_version_and_unknown_operation(self) -> None:
        with self.assertRaises(ProtocolError) as version_error:
            parse_request(
                '{"protocolVersion":"2","requestId":"v","operation":"PING"}'
            )
        self.assertEqual(
            version_error.exception.code, "UNSUPPORTED_PROTOCOL_VERSION"
        )

        with self.assertRaises(ProtocolError) as operation_error:
            parse_request(
                '{"protocolVersion":"1","requestId":"o","operation":"NOPE"}'
            )
        self.assertEqual(operation_error.exception.code, "UNKNOWN_OPERATION")

    def test_encoder_never_emits_non_standard_nan(self) -> None:
        with self.assertRaises(ValueError):
            encode_message({"value": math.nan})


if __name__ == "__main__":
    unittest.main()

