"""
Flask API for the Multi-Agent Stock Market AI Autonomity simulation.

Endpoints:
    POST /api/init       – initialise simulation with ticker/period/interval
    POST /api/step       – advance one simulation step
    POST /api/auto-step  – advance N steps at once
    GET  /api/state      – return current simulation snapshot
"""

import sys
import os

# Ensure the backend directory is on the Python path so relative imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS
from simulation.simulation import Simulation

app = Flask(__name__)
CORS(app)  # allow React frontend requests

# Global in-memory simulation instance
simulation = Simulation()


# ------------------------------------------------------------------ #
# POST /api/init
# ------------------------------------------------------------------ #
@app.route("/api/init", methods=["POST"])
def init_simulation():
    """
    Initialize (or re-initialize) the simulation.

    Request body (JSON):
        {
            "ticker":   "AAPL",   (default "AAPL")
            "period":   "5d",      (default "5d")
            "interval": "5m"       (default "5m")
        }
    """
    data = request.get_json(force=True, silent=True) or {}
    ticker = data.get("ticker", "AAPL")
    period = data.get("period", "5d")
    interval = data.get("interval", "5m")

    try:
        snapshot = simulation.init_simulation(ticker, period, interval)
        return jsonify(snapshot)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


# ------------------------------------------------------------------ #
# POST /api/step
# ------------------------------------------------------------------ #
@app.route("/api/step", methods=["POST"])
def step_simulation():
    """Advance simulation by one bar / step."""
    try:
        snapshot = simulation.step_simulation()
        if "error" in snapshot:
            return jsonify(snapshot), 400
        return jsonify(snapshot)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------------------ #
# POST /api/auto-step
# ------------------------------------------------------------------ #
@app.route("/api/auto-step", methods=["POST"])
def auto_step_simulation():
    """
    Run N simulation steps in one call.

    Request body (JSON):
        { "steps": 10 }      (default 10)
    """
    data = request.get_json(force=True, silent=True) or {}
    n = data.get("steps", 10)
    n = min(int(n), 100)  # cap at 100 to avoid long blocking calls

    try:
        snapshot = None
        for _ in range(n):
            snapshot = simulation.step_simulation()
            if snapshot.get("finished") or "error" in snapshot:
                break
        if snapshot is None:
            return jsonify({"error": "No steps executed."}), 400
        return jsonify(snapshot)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------------------ #
# GET /api/state
# ------------------------------------------------------------------ #
@app.route("/api/state", methods=["GET"])
def get_state():
    """Return the current simulation snapshot."""
    try:
        snapshot = simulation.get_snapshot()
        if "error" in snapshot:
            return jsonify(snapshot), 400
        return jsonify(snapshot)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------------------ #
# Run
# ------------------------------------------------------------------ #
if __name__ == "__main__":
    print("Starting Multi-Agent Stock Market AI server on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
