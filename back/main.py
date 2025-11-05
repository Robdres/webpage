import json
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

ARTIFACT_DIR = Path("models")
MODEL_PATH = ARTIFACT_DIR / "best_model.joblib"
METRICS_PATH = ARTIFACT_DIR / "metrics.json"
SCHEMA_PATH = ARTIFACT_DIR / "feature_schema.json"

app = Flask(__name__)
CORS(app)

model = joblib.load(MODEL_PATH)
with open(METRICS_PATH) as f:
    metrics = json.load(f)
with open(SCHEMA_PATH) as f:
    schema = json.load(f)

# Helper to coerce a single JSON sample into a DataFrame row
def json_to_frame(payload: dict) -> pd.DataFrame:
    # Ensure all expected columns exist (missing -> None)
    row = {}
    for col in schema["numeric"] + schema["categorical"]:
        row[col] = payload.get(col, None)
    return pd.DataFrame([row])

@app.get("/info")
def info():
    return jsonify({
        "model": metrics.get("best_model"),
        "scores": {
            "r2_best": metrics.get("r2_best"),
        },
        "features": {
            "numeric": schema["numeric"],
            "categorical": schema["categorical"],
        }
    })

@app.post("/predict")
def predict():
    """
    Expects JSON with keys matching feature names.
    Example:
    {
      "age_years": 57,
      "gender": "F",
      "bmi_category": "OVERWEIGHT",
      ...
    }
    """
    if not request.is_json:
        return jsonify(error="Content-Type must be application/json"), 415

    data = request.get_json()
    # Support single object or list of objects
    if isinstance(data, dict):
        df = json_to_frame(data)
    elif isinstance(data, list):
        rows = [json_to_frame(obj) for obj in data]
        df = pd.concat(rows, ignore_index=True)
    else:
        return jsonify(error="JSON must be an object or an array of objects"), 400

    try:
        preds = model.predict(df)
        # Ensure plain Python types for JSON
        preds = [float(x) for x in np.ravel(preds)]
        return jsonify(predictions=preds, n=len(preds))
    except Exception as e:
        return jsonify(error=f"inference_failed: {type(e).__name__}: {e}"), 500

if __name__ == "__main__":
    # Flask dev server
    app.run(host="0.0.0.0", port=8000, debug=False)

