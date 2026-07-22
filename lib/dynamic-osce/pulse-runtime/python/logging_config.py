"""Logging configuration that keeps the JSON Lines stdout channel clean."""

import logging
import sys


def configure_logging(level: int = logging.INFO) -> logging.Logger:
    """Configure runtime logs to use stderr exclusively."""
    root = logging.getLogger()
    root.handlers.clear()

    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(
        logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")
    )
    root.addHandler(handler)
    root.setLevel(level)
    return logging.getLogger("medix.pulse_runtime")

