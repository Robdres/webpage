import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import pickle
import os

def generate_sample_data(n_samples=1000):
    """Generate sample data for CKD prediction"""
    np.random.seed(42)
    
    # Generate realistic sample data
    data = {
        'age': np.random.normal(60, 15, n_samples).clip(18, 95),
        'gender': np.random.choice([0, 1], n_samples),
        'systolic_bp': np.random.normal(140, 20, n_samples).clip(90, 200),
        'diastolic_bp': np.random.normal(85, 10, n_samples).clip(60, 120),
        'creatinine': np.random.normal(1.2, 0.5, n_samples).clip(0.5, 3.0),
        'glucose': np.random.normal(120, 30, n_samples).clip(70, 300),
        'hemoglobin': np.random.normal(13, 2, n_samples).clip(8, 18),
        'albumin': np.random.normal(4.0, 0.5, n_samples).clip(2.5, 5.5),
        'sodium': np.random.normal(140, 5, n_samples).clip(130, 150),
        'potassium': np.random.normal(4.0, 0.5, n_samples).clip(3.0, 6.0),
        'bicarbonate': np.random.normal(24, 3, n_samples).clip(18, 30),
        'bun': np.random.normal(15, 5, n_samples).clip(7, 30),
        'calcium': np.random.normal(9.5, 0.5, n_samples).clip(8.5, 10.5),
        'phosphorus': np.random.normal(3.5, 0.8, n_samples).clip(2.5, 5.0),
        'wbc': np.random.normal(7.0, 2.0, n_samples).clip(4.0, 12.0),
        'rbc': np.random.normal(4.5, 0.5, n_samples).clip(3.5, 5.5),
        'platelets': np.random.normal(250, 50, n_samples).clip(150, 400),
        'urine_albumin': np.random.normal(30, 20, n_samples).clip(0, 100),
        'urine_glucose': np.random.choice([0, 1, 2, 3], n_samples, p=[0.7, 0.1, 0.1, 0.1]),
        'urine_ketones': np.random.choice([0, 1, 2, 3], n_samples, p=[0.8, 0.1, 0.05, 0.05]),
        'urine_blood': np.random.choice([0, 1, 2, 3], n_samples, p=[0.7, 0.2, 0.05, 0.05]),
        'urine_leukocytes': np.random.choice([0, 1, 2, 3], n_samples, p=[0.6, 0.3, 0.05, 0.05]),
        'urine_nitrites': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'urine_protein': np.random.choice([0, 1, 2, 3], n_samples, p=[0.6, 0.3, 0.05, 0.05]),
        'urine_ph': np.random.normal(6.0, 1.0, n_samples).clip(4.5, 8.0),
        'urine_specific_gravity': np.random.normal(1.020, 0.010, n_samples).clip(1.005, 1.035),
        'diabetes': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'hypertension': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'cardiovascular_disease': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'obesity': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'smoking': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'alcohol_consumption': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'family_history': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'medication_use': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'exposure_toxins': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
        'physical_activity': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'diet_high_salt': np.random.choice([0, 1], n_samples, p=[0.5, 0.5]),
        'diet_high_protein': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'sleep_apnea': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'autoimmune_disease': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
        'kidney_stones': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'uti_history': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'pregnancy_complications': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
        'occupational_hazards': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'stress_level': np.random.choice([1, 2, 3, 4, 5], n_samples, p=[0.2, 0.3, 0.3, 0.15, 0.05]),
        'bmi': np.random.normal(27, 5, n_samples).clip(18, 45),
        'waist_circumference': np.random.normal(90, 10, n_samples).clip(60, 130),
        'heart_rate': np.random.normal(75, 10, n_samples).clip(50, 100),
        'temperature': np.random.normal(37, 0.5, n_samples).clip(36, 38.5),
        'respiratory_rate': np.random.normal(16, 2, n_samples).clip(12, 20),
        'oxygen_saturation': np.random.normal(98, 1, n_samples).clip(95, 100)
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable based on risk factors
    # CKD risk increases with age, diabetes, hypertension, high creatinine, etc.
    risk_score = (
        df['age'] * 0.02 +
        df['diabetes'] * 0.3 +
        df['hypertension'] * 0.25 +
        df['creatinine'] * 0.4 +
        df['glucose'] * 0.001 +
        df['systolic_bp'] * 0.002 +
        df['bmi'] * 0.01 +
        df['smoking'] * 0.15 +
        df['family_history'] * 0.2 +
        df['obesity'] * 0.1
    )
    
    # Add some randomness
    risk_score += np.random.normal(0, 0.1, n_samples)
    
    # Create binary target (CKD = 1, No CKD = 0)
    df['ckd'] = (risk_score > np.percentile(risk_score, 70)).astype(int)
    
    return df

def train_xgboost_model():
    """Train XGBoost model for CKD prediction"""
    print("Generating sample data...")
    df = generate_sample_data(2000)
    
    # Separate features and target
    feature_columns = [col for col in df.columns if col != 'ckd']
    X = df[feature_columns]
    y = df['ckd']
    
    print(f"Dataset shape: {df.shape}")
    print(f"Features: {len(feature_columns)}")
    print(f"CKD cases: {y.sum()} ({y.sum()/len(y)*100:.1f}%)")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train XGBoost model
    print("Training XGBoost model...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss',
        use_label_encoder=False
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    # Evaluate model
    print("\nModel Performance:")
    print("=" * 50)
    print(classification_report(y_test, y_pred))
    print(f"ROC AUC Score: {roc_auc_score(y_test, y_pred_proba):.3f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print("=" * 50)
    print(feature_importance.head(10))
    
    # Save model and scaler
    model_dir = 'model'
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, 'ckd_xgboost_model.pkl')
    scaler_path = os.path.join(model_dir, 'ckd_scaler.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    
    print(f"\nModel saved to: {model_path}")
    print(f"Scaler saved to: {scaler_path}")
    
    return model, scaler, feature_importance

if __name__ == "__main__":
    train_xgboost_model() 