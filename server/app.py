"""
app.py — Flask API Server for Life Insight Generator
Exposes: POST /api/analyze
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date

from prompt_builder import build_prompt, calculate_age, get_life_stage
from gemini_client import generate_life_insights

app = Flask(__name__)

# Allow requests from the local file:// and any localhost origin
CORS(app, resources={r"/api/*": {"origins": "*"}})


# ── Health Check ────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "gemini-1.5-flash"}), 200


# ── Main Analysis Endpoint ──────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True)

    # ── Input Validation ─────────────────────────────────────
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    name = (data.get("name") or "").strip()
    dob  = (data.get("dob")  or "").strip()

    if not name or len(name) < 2:
        return jsonify({"error": "Please provide a valid name (at least 2 characters)."}), 422

    if not dob:
        return jsonify({"error": "Please provide a date of birth (YYYY-MM-DD format)."}), 422

    try:
        birth_date = date.fromisoformat(dob)
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 422

    age = calculate_age(dob)
    if age < 5 or age > 110:
        return jsonify({"error": "Please provide a realistic date of birth."}), 422

    # ── Build Prompt & Call Gemini ────────────────────────────
    try:
        prompt   = build_prompt(name, dob)
        insights = generate_life_insights(prompt)
    except ValueError as ve:
        return jsonify({"error": "AI response parsing failed.", "detail": str(ve)}), 502
    except Exception as e:
        return jsonify({"error": "Failed to generate insights.", "detail": str(e)}), 500

    # ── Enrich with meta ──────────────────────────────────────
    response_payload = {
        "meta": {
            "name":       name,
            "dob":        dob,
            "age":        age,
            "life_stage": get_life_stage(age),
            "initials":   "".join(w[0].upper() for w in name.split())[:2],
        },
        "insights": insights,
    }

    return jsonify(response_payload), 200


# ── Entry Point ──────────────────────────────────────────────
if __name__ == "__main__":
    print("\n[*] Life Insight API running at http://localhost:5000\n")
    app.run(host="0.0.0.0", port=5000, debug=True)
