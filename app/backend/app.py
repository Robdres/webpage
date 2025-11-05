from flask import Flask, request, jsonify
from flask_cors import CORS
import xgboost as xgb
import numpy as np
import pandas as pd
import pickle
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load the trained XGBoost model
MODEL_PATH = 'model/ckd_xgboost_model.pkl'

def load_model():
    """Load the trained XGBoost model"""
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        logger.info("Model loaded successfully")
        return model
    except FileNotFoundError:
        logger.error(f"Model file not found at {MODEL_PATH}")
        return None
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return None

def preprocess_data(data):
    """Preprocess the input data to match model expectations"""
    try:
        # Create a DataFrame with the expected features
        features = {
            'age': float(data.get('age', 0)),
            'gender': 1 if data.get('gender') == 'male' else 0,
            'systolic_bp': float(data.get('systolicBP', 0)),
            'diastolic_bp': float(data.get('diastolicBP', 0)),
            'creatinine': float(data.get('creatinine', 0)),
            'glucose': float(data.get('glucose', 0)),
            'hemoglobin': float(data.get('hemoglobin', 0)),
            'albumin': float(data.get('albumin', 0)),
            'sodium': float(data.get('sodium', 0)),
            'potassium': float(data.get('potassium', 0)),
            'bicarbonate': float(data.get('bicarbonate', 0)),
            'bun': float(data.get('bun', 0)),
            'calcium': float(data.get('calcium', 0)),
            'phosphorus': float(data.get('phosphorus', 0)),
            'wbc': float(data.get('wbc', 0)),
            'rbc': float(data.get('rbc', 0)),
            'platelets': float(data.get('platelets', 0)),
            'urine_albumin': float(data.get('urineAlbumin', 0)),
            'urine_glucose': float(data.get('urineGlucose', 0)),
            'urine_ketones': float(data.get('urineKetones', 0)),
            'urine_blood': float(data.get('urineBlood', 0)),
            'urine_leukocytes': float(data.get('urineLeukocytes', 0)),
            'urine_nitrites': float(data.get('urineNitrites', 0)),
            'urine_protein': float(data.get('urineProtein', 0)),
            'urine_ph': float(data.get('urinePH', 0)),
            'urine_specific_gravity': float(data.get('urineSpecificGravity', 0)),
            'diabetes': 1 if data.get('diabetes') == 'yes' else 0,
            'hypertension': 1 if data.get('hypertension') == 'yes' else 0,
            'cardiovascular_disease': 1 if data.get('cardiovascularDisease') == 'yes' else 0,
            'obesity': 1 if data.get('obesity') == 'yes' else 0,
            'smoking': 1 if data.get('smoking') == 'yes' else 0,
            'alcohol_consumption': 1 if data.get('alcoholConsumption') == 'yes' else 0,
            'family_history': 1 if data.get('familyHistory') == 'yes' else 0,
            'medication_use': 1 if data.get('medicationUse') == 'yes' else 0,
            'exposure_toxins': 1 if data.get('exposureToxins') == 'yes' else 0,
            'physical_activity': 1 if data.get('physicalActivity') == 'yes' else 0,
            'diet_high_salt': 1 if data.get('dietHighSalt') == 'yes' else 0,
            'diet_high_protein': 1 if data.get('dietHighProtein') == 'yes' else 0,
            'sleep_apnea': 1 if data.get('sleepApnea') == 'yes' else 0,
            'autoimmune_disease': 1 if data.get('autoimmuneDisease') == 'yes' else 0,
            'kidney_stones': 1 if data.get('kidneyStones') == 'yes' else 0,
            'uti_history': 1 if data.get('utiHistory') == 'yes' else 0,
            'pregnancy_complications': 1 if data.get('pregnancyComplications') == 'yes' else 0,
            'occupational_hazards': 1 if data.get('occupationalHazards') == 'yes' else 0,
            'stress_level': int(data.get('stressLevel', 1)),
            'bmi': float(data.get('bmi', 0)),
            'waist_circumference': float(data.get('waistCircumference', 0)),
            'heart_rate': float(data.get('heartRate', 0)),
            'temperature': float(data.get('temperature', 0)),
            'respiratory_rate': float(data.get('respiratoryRate', 0)),
            'oxygen_saturation': float(data.get('oxygenSaturation', 0))
        }
        
        # Convert to DataFrame
        df = pd.DataFrame([features])
        
        # Handle missing values
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        df[numeric_columns] = df[numeric_columns].fillna(df[numeric_columns].mean())
        
        logger.info(f"Data preprocessed successfully. Shape: {df.shape}")
        return df
        
    except Exception as e:
        logger.error(f"Error preprocessing data: {str(e)}")
        raise

def get_key_factors(data, prediction_probability):
    """Identify key factors contributing to the prediction"""
    key_factors = []
    
    # High-risk factors
    if data.get('age', 0) > 65:
        key_factors.append(f"Edad avanzada ({data.get('age')} años)")
    
    if data.get('diabetes') == 'yes':
        key_factors.append("Diabetes mellitus")
    
    if data.get('hypertension') == 'yes':
        key_factors.append("Hipertensión arterial")
    
    if data.get('creatinine', 0) > 1.2:
        key_factors.append(f"Creatinina elevada ({data.get('creatinine')} mg/dL)")
    
    if data.get('glucose', 0) > 126:
        key_factors.append(f"Glucosa elevada ({data.get('glucose')} mg/dL)")
    
    if data.get('systolicBP', 0) > 140:
        key_factors.append(f"Presión sistólica elevada ({data.get('systolicBP')} mmHg)")
    
    if data.get('diastolicBP', 0) > 90:
        key_factors.append(f"Presión diastólica elevada ({data.get('diastolicBP')} mmHg)")
    
    if data.get('bmi', 0) > 30:
        key_factors.append(f"Obesidad (IMC: {data.get('bmi')})")
    
    if data.get('smoking') == 'yes':
        key_factors.append("Tabaquismo")
    
    if data.get('familyHistory') == 'yes':
        key_factors.append("Historia familiar de enfermedad renal")
    
    if data.get('cardiovascularDisease') == 'yes':
        key_factors.append("Enfermedad cardiovascular")
    
    # If no specific factors found, add general ones based on probability
    if not key_factors:
        if prediction_probability > 0.7:
            key_factors.append("Múltiples factores de riesgo combinados")
        elif prediction_probability > 0.5:
            key_factors.append("Factores de riesgo moderados")
        else:
            key_factors.append("Evaluación de rutina recomendada")
    
    return key_factors[:5]  # Return top 5 factors

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint for CKD prediction"""
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        logger.info(f"Received prediction request with {len(data)} fields")
        
        # Load model
        model = load_model()
        if model is None:
            return jsonify({'error': 'Model not available'}), 500
        
        # Preprocess data
        processed_data = preprocess_data(data)
        
        # Make prediction
        prediction_proba = model.predict_proba(processed_data)[0]
        prediction = 1 if prediction_proba[1] > 0.5 else 0
        probability = prediction_proba[1] if prediction == 1 else prediction_proba[0]
        
        # Get key factors
        key_factors = get_key_factors(data, probability)
        
        # Prepare response
        response = {
            'prediction': 'CKD' if prediction == 1 else 'No CKD',
            'probability': round(probability * 100, 2),
            'risk_level': 'Alto' if probability > 0.7 else 'Moderado' if probability > 0.4 else 'Bajo',
            'key_factors': key_factors,
            'timestamp': datetime.now().isoformat(),
            'recommendations': get_recommendations(probability, key_factors)
        }
        
        logger.info(f"Prediction completed: {response['prediction']} ({response['probability']}%)")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def get_recommendations(probability, key_factors):
    """Generate recommendations based on prediction results"""
    recommendations = []
    
    if probability > 0.7:
        recommendations.extend([
            "Consulta médica urgente recomendada",
            "Monitoreo frecuente de función renal",
            "Control estricto de presión arterial",
            "Modificación de dieta baja en proteínas"
        ])
    elif probability > 0.4:
        recommendations.extend([
            "Consulta médica en las próximas semanas",
            "Monitoreo regular de función renal",
            "Control de factores de riesgo modificables",
            "Estilo de vida saludable"
        ])
    else:
        recommendations.extend([
            "Consulta médica de rutina",
            "Mantener estilo de vida saludable",
            "Monitoreo anual de función renal",
            "Control de factores de riesgo"
        ])
    
    return recommendations

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': load_model() is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    """Endpoint for PDF report generation"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # For now, return a success response
        # In a real implementation, you would generate the PDF here
        response = {
            'success': True,
            'message': 'PDF report generated successfully',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create model directory if it doesn't exist
    os.makedirs('model', exist_ok=True)
    
    # Check if model exists
    if not os.path.exists(MODEL_PATH):
        logger.warning(f"Model file not found at {MODEL_PATH}. Please train and save the model first.")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 