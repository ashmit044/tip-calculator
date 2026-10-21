"""Command-line entry-point smoke tests."""

import subprocess
import sys
from pathlib import Path

APP_PATH = Path(__file__).resolve().parents[1] / "app.py"


def run_cli(*arguments, input_text=None):
    return subprocess.run(
        [sys.executable, str(APP_PATH), *arguments],
        input=input_text,
        capture_output=True,
        text=True,
        cwd=APP_PATH.parent,
        timeout=15,
        check=False,
    )


def test_command_line_arguments_run_the_calculator():
    result = run_cli("--bill", "100", "--tip", "10", "--tax", "0", "--people", "2")

    assert result.returncode == 0
    assert "Total Bill: $110.00" in result.stdout
    assert "Person 1: $55.00" in result.stdout


def test_interactive_cli_reports_non_numeric_input_without_traceback():
    result = run_cli(input_text="not-a-number\n")

    assert result.returncode == 0
    assert "Error:" in result.stdout
    assert "Traceback" not in result.stderr
