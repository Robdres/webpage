import { useState } from 'react'
import { predictCKD, generatePDF } from '../services/apiService'
import ResultsView from './ResultsView'
import './CKDForm.css'

function CKDForm({ onClose }) {
  const [showPreview, setShowPreview] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState(null)
  const [formData, setFormData] = useState({
    chronic_kidney_disease_diagnosis: '',
    age_years: '',
    gender: '',
    bmi_category: '',
    abdominal_perimeter: '',
    weight_kg: '',
    glomerular_filtration_rate: '',
    hdl_cholesterol_pathological: '',
    ldl_cholesterol_pathological: '',
    hba1c_elevated: '',
    gfr_proteinuria_relationship: '',
    personal_history_dyslipidemia: '',
    other_personal_history: '',
    smoking_status: '',
    alcohol_consumption: '',
    drug_consumption: '',
    exercise_30min_daily: '',
    diet_frequency: '',
    family_history_diabetes: '',
    family_history_thyroid: '',
    family_history_cardiac_hypertension: '',
    family_history_overweight_obesity: '',
    family_history_cancer: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowPreview(true)
  }

  const handleConfirmPrediction = async () => {
    setIsLoading(true)
    setShowPreview(false)
    try {
      const result = await predictCKD(formData)
      setPredictionResult(result)
      setShowResults(true)
    } catch (error) {
      console.error('Error during prediction:', error)
      alert('Error al procesar la predicción. Por favor, intente nuevamente.')
      setShowPreview(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToForm = () => {
    setShowPreview(false)
  }

  const handleBackFromResults = () => {
    setShowResults(false)
    setPredictionResult(null)
  }

  const handleDownloadPDF = async (formData, predictionResult) => {
    try {
      await generatePDF(formData, predictionResult)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar el PDF. Por favor, intente nuevamente.')
    }
  }

  const fieldLabels = {
    age_years: 'Edad (años)',
    gender: 'Género',
    bmi_category: 'Categoría IMC',
    abdominal_perimeter: 'Perímetro Abdominal',
    weight_kg: 'Peso (kg)',
    hdl_cholesterol_pathological: 'HDL Patológico',
    ldl_cholesterol_pathological: 'LDL Patológico',
    hba1c_elevated: 'HbA1c Elevado',
    personal_history_dyslipidemia: 'Antecedente de Dislipidemia',
    other_personal_history: 'Otros Antecedentes Personales',
    smoking_status: 'Estado de Tabaquismo',
    alcohol_consumption: 'Consumo de Alcohol',
    drug_consumption: 'Consumo de Drogas',
    exercise_30min_daily: 'Ejercicio Diario (30 min)',
    diet_frequency: 'Frecuencia de Dieta',
    family_history_diabetes: 'Antecedente Familiar de Diabetes',
    family_history_thyroid: 'Antecedente Familiar de Tiroides',
    family_history_cardiac_hypertension: 'Antecedente Familiar Cardíaco/Hipertensión',
    family_history_overweight_obesity: 'Antecedente Familiar de Sobrepeso/Obesidad',
    family_history_cancer: 'Antecedente Familiar de Cáncer'
  }

  // Loading overlay
  if (isLoading) {
    return (
      <div className="form-overlay">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Procesando Predicción...</h3>
          <p>Esto puede tomar unos segundos</p>
        </div>
      </div>
    )
  }

  // Results view
  if (showResults && predictionResult) {
    return (
      <ResultsView
        formData={formData}
        predictionResult={predictionResult}
        onBack={handleBackFromResults}
        onDownloadPDF={handleDownloadPDF}
      />
    )
  }

  // Preview modal
  if (showPreview) {
    return (
      <div className="form-overlay">
        <div className="form-container preview-container">
          <div className="preview-content">
            <div className="preview-section">
              <h3>Demográficos</h3>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.age_years}:</span>
                  <span className="preview-value">{formData.age_years}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.gender}:</span>
                  <span className="preview-value">{formData.gender}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.bmi_category}:</span>
                  <span className="preview-value">{formData.bmi_category}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.abdominal_perimeter}:</span>
                  <span className="preview-value">{formData.abdominal_perimeter}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.weight_kg}:</span>
                  <span className="preview-value">{formData.weight_kg}</span>
                </div>
              </div>
            </div>
            <div className="preview-section">
              <h3>Bioquímicos</h3>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.hdl_cholesterol_pathological}:</span>
                  <span className="preview-value">{formData.hdl_cholesterol_pathological}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.ldl_cholesterol_pathological}:</span>
                  <span className="preview-value">{formData.ldl_cholesterol_pathological}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.hba1c_elevated}:</span>
                  <span className="preview-value">{formData.hba1c_elevated}</span>
                </div>
              </div>
            </div>
            <div className="preview-section">
              <h3>Antecedentes personales</h3>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.personal_history_dyslipidemia}:</span>
                  <span className="preview-value">{formData.personal_history_dyslipidemia}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.other_personal_history}:</span>
                  <span className="preview-value">{formData.other_personal_history}</span>
                </div>
              </div>
            </div>
            <div className="preview-section">
              <h3>Hábitos y estilo de vida</h3>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.smoking_status}:</span>
                  <span className="preview-value">{formData.smoking_status}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.alcohol_consumption}:</span>
                  <span className="preview-value">{formData.alcohol_consumption}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.drug_consumption}:</span>
                  <span className="preview-value">{formData.drug_consumption}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.exercise_30min_daily}:</span>
                  <span className="preview-value">{formData.exercise_30min_daily}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.diet_frequency}:</span>
                  <span className="preview-value">{formData.diet_frequency}</span>
                </div>
              </div>
            </div>
            <div className="preview-section">
              <h3>Antecedentes familiares</h3>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.family_history_diabetes}:</span>
                  <span className="preview-value">{formData.family_history_diabetes}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.family_history_thyroid}:</span>
                  <span className="preview-value">{formData.family_history_thyroid}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.family_history_cardiac_hypertension}:</span>
                  <span className="preview-value">{formData.family_history_cardiac_hypertension}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.family_history_overweight_obesity}:</span>
                  <span className="preview-value">{formData.family_history_overweight_obesity}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">{fieldLabels.family_history_cancer}:</span>
                  <span className="preview-value">{formData.family_history_cancer}</span>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleBackToForm}>
                Volver al Formulario
              </button>
              <button type="button" className="submit-button" onClick={handleConfirmPrediction}>
                Confirmar Predicción
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Predicción de Enfermedad Renal Crónica (CKD)</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="ckd-form">
          <div className="form-section">
            <h3>Demográficos</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age_years">{fieldLabels.age_years}:</label>
                <input
                  type="number"
                  id="age_years"
                  name="age_years"
                  value={formData.age_years}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">{fieldLabels.gender}:</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="bmi_category">{fieldLabels.bmi_category}:</label>
                <select
                  id="bmi_category"
                  name="bmi_category"
                  value={formData.bmi_category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="underweight">Bajo peso</option>
                  <option value="normal">Normal</option>
                  <option value="overweight">Sobrepeso</option>
                  <option value="obese">Obeso</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="abdominal_perimeter">{fieldLabels.abdominal_perimeter}:</label>
                <input
                  type="number"
                  id="abdominal_perimeter"
                  name="abdominal_perimeter"
                  value={formData.abdominal_perimeter}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight_kg">{fieldLabels.weight_kg}:</label>
                <input
                  type="number"
                  id="weight_kg"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Bioquímicos</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hdl_cholesterol_pathological">{fieldLabels.hdl_cholesterol_pathological}:</label>
                <select
                  id="hdl_cholesterol_pathological"
                  name="hdl_cholesterol_pathological"
                  value={formData.hdl_cholesterol_pathological}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ldl_cholesterol_pathological">{fieldLabels.ldl_cholesterol_pathological}:</label>
                <select
                  id="ldl_cholesterol_pathological"
                  name="ldl_cholesterol_pathological"
                  value={formData.ldl_cholesterol_pathological}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="hba1c_elevated">{fieldLabels.hba1c_elevated}:</label>
                <select
                  id="hba1c_elevated"
                  name="hba1c_elevated"
                  value={formData.hba1c_elevated}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Antecedentes personales</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="personal_history_dyslipidemia">{fieldLabels.personal_history_dyslipidemia}:</label>
                <select
                  id="personal_history_dyslipidemia"
                  name="personal_history_dyslipidemia"
                  value={formData.personal_history_dyslipidemia}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="other_personal_history">{fieldLabels.other_personal_history}:</label>
                <select
                  id="personal_history_dyslipidemia"
                  name="personal_history_dyslipidemia"
                  value={formData.personal_history_dyslipidemia}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Hábitos y estilo de vida</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="smoking_status">{fieldLabels.smoking_status}:</label>
                <select
                  id="smoking_status"
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="never">Nunca</option>
                  <option value="former">Ex-fumador</option>
                  <option value="current">Fumador actual</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="alcohol_consumption">{fieldLabels.alcohol_consumption}:</label>
                <select
                  id="alcohol_consumption"
                  name="alcohol_consumption"
                  value={formData.alcohol_consumption}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="never">Nunca</option>
                  <option value="occasional">Ocasional</option>
                  <option value="moderate">Moderado</option>
                  <option value="heavy">Excesivo</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="drug_consumption">{fieldLabels.drug_consumption}:</label>
                <select
                  id="drug_consumption"
                  name="drug_consumption"
                  value={formData.drug_consumption}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="never">Nunca</option>
                  <option value="occasional">Ocasional</option>
                  <option value="frequent">Frecuente</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="exercise_30min_daily">{fieldLabels.exercise_30min_daily}:</label>
                <select
                  id="exercise_30min_daily"
                  name="exercise_30min_daily"
                  value={formData.exercise_30min_daily}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="diet_frequency">{fieldLabels.diet_frequency}:</label>
                <select
                  id="diet_frequency"
                  name="diet_frequency"
                  value={formData.diet_frequency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  <option value="rarely">Rara vez</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Antecedentes familiares</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="family_history_diabetes">{fieldLabels.family_history_diabetes}:</label>
                <select
                  id="family_history_diabetes"
                  name="family_history_diabetes"
                  value={formData.family_history_diabetes}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="family_history_thyroid">{fieldLabels.family_history_thyroid}:</label>
                <select
                  id="family_history_thyroid"
                  name="family_history_thyroid"
                  value={formData.family_history_thyroid}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="family_history_cardiac_hypertension">{fieldLabels.family_history_cardiac_hypertension}:</label>
                <select
                  id="family_history_cardiac_hypertension"
                  name="family_history_cardiac_hypertension"
                  value={formData.family_history_cardiac_hypertension}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="family_history_overweight_obesity">{fieldLabels.family_history_overweight_obesity}:</label>
                <select
                  id="family_history_overweight_obesity"
                  name="family_history_overweight_obesity"
                  value={formData.family_history_overweight_obesity}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="family_history_cancer">{fieldLabels.family_history_cancer}:</label>
                <select
                  id="family_history_cancer"
                  name="family_history_cancer"
                  value={formData.family_history_cancer}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Predecir CKD
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CKDForm
