from flask import Flask, request, jsonify
import pandas as pd
import joblib
import json
from pathlib import Path
from flask_cors import CORS # Import CORS extension

app = Flask(__name__)
CORS(app) # Enable CORS for all routes, or specify origins

# Load columns from txt file
with open("models/selected_features.txt") as f:
    columns_selected = [line.strip() for line in f if line.strip()]

# Load trained model pipeline
model = joblib.load("models/best_model.joblib")
COLUMNS_PATH = Path("models/columns_selected.txt")
METRICS_PATH = Path("models/metrics.json")
TEST_DATA_PATH = Path("models/test_data.csv")

@app.route("/predict", methods=["POST"])
def predict():
    # Get JSON data from request
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Ensure all required columns are present
    input_row = {col: data.get(col, None) for col in columns_selected}
    df = pd.DataFrame([input_row])

    # Make prediction
    try:
        prediction = model.predict(df)
        result = float(prediction[0])  # Assuming single row
        print(f"Prediction result: {result}")
        return jsonify({"prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/columns", methods=["GET"])
def get_columns():
    return jsonify({"columns": columns_selected})

@app.route("/metrics", methods=["GET"])
def get_metrics():
    if not METRICS_PATH.exists():
        return jsonify({"error": "metrics.json not found"}), 404
    with METRICS_PATH.open() as f:
        metrics = json.load(f)
    return jsonify(metrics)

@app.route("/test", methods=["GET"])
def test_predict():
    if not TEST_DATA_PATH.exists():
        return jsonify({"error": "test_data.csv not found"}), 404

    # Read test data
    df = pd.read_csv(TEST_DATA_PATH)
    # Ensure all required columns are present
    missing = [col for col in columns_selected if col not in df.columns]
    if missing:
        return jsonify({"error": f"Missing columns in test data: {missing}"}), 400

    # Select and order columns
    X_test = df[columns_selected]

    try:
        preds = model.predict(X_test)
        # Optionally, include input data and predictions
        results = []
        for i, row in X_test.iterrows():
            results.append({
                "input": row.to_dict(),
                "prediction": float(preds[i])
            })
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
