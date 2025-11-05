# Kidney Tool Backend

Flask backend for CKD prediction using XGBoost machine learning model.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the model:**
   ```bash
   python train_model.py
   ```
   This will generate sample data and train an XGBoost model, saving it to `model/ckd_xgboost_model.pkl`.

3. **Run the Flask server:**
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/predict
Predicts CKD risk based on patient data.

**Request Body:**
```json
{
  "age": 65,
  "gender": "male",
  "systolicBP": 140,
  "diastolicBP": 90,
  "creatinine": 1.2,
  "glucose": 120,
  "hemoglobin": 13,
  "albumin": 4.0,
  "sodium": 140,
  "potassium": 4.0,
  "bicarbonate": 24,
  "bun": 15,
  "calcium": 9.5,
  "phosphorus": 3.5,
  "wbc": 7.0,
  "rbc": 4.5,
  "platelets": 250,
  "urineAlbumin": 30,
  "urineGlucose": 0,
  "urineKetones": 0,
  "urineBlood": 0,
  "urineLeukocytes": 0,
  "urineNitrites": 0,
  "urineProtein": 0,
  "urinePH": 6.0,
  "urineSpecificGravity": 1.020,
  "diabetes": "yes",
  "hypertension": "yes",
  "cardiovascularDisease": "no",
  "obesity": "no",
  "smoking": "no",
  "alcoholConsumption": "no",
  "familyHistory": "no",
  "medicationUse": "yes",
  "exposureToxins": "no",
  "physicalActivity": "yes",
  "dietHighSalt": "no",
  "dietHighProtein": "no",
  "sleepApnea": "no",
  "autoimmuneDisease": "no",
  "kidneyStones": "no",
  "utiHistory": "no",
  "pregnancyComplications": "no",
  "occupationalHazards": "no",
  "stressLevel": 2,
  "bmi": 27,
  "waistCircumference": 90,
  "heartRate": 75,
  "temperature": 37,
  "respiratoryRate": 16,
  "oxygenSaturation": 98
}
```

**Response:**
```json
{
  "prediction": "CKD",
  "probability": 75.5,
  "risk_level": "Alto",
  "key_factors": [
    "Diabetes mellitus",
    "Hipertensión arterial",
    "Edad avanzada (65 años)",
    "Creatinina elevada (1.2 mg/dL)"
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recommendations": [
    "Consulta médica urgente recomendada",
    "Monitoreo frecuente de función renal",
    "Control estricto de presión arterial",
    "Modificación de dieta baja en proteínas"
  ]
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/generate-pdf
Generate PDF report (placeholder endpoint).

## Model Information

- **Algorithm:** XGBoost
- **Features:** 50+ clinical and lifestyle factors
- **Training Data:** Synthetic data with realistic distributions
- **Performance:** ~85% accuracy on test set

## Development

To modify the model or add new features:

1. Update `train_model.py` to include new features
2. Retrain the model: `python train_model.py`
3. Update `app.py` preprocessing function if needed
4. Test with the frontend

## Production Deployment

For production deployment:

1. Use Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. Set environment variables:
   ```bash
   export FLASK_ENV=production
   export FLASK_DEBUG=0
   ```

3. Use a reverse proxy (nginx) for SSL termination and load balancing.

## File Structure

```
backend/
├── app.py              # Flask application
├── train_model.py      # Model training script
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── model/             # Trained models
    ├── ckd_xgboost_model.pkl
    └── ckd_scaler.pkl
``` 