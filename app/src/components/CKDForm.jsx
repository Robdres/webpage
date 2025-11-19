import { useState } from 'react'
import { predict, generatePDF } from '../services/apiClient.js'
import ResultsView from './ResultsView'
import './CKDForm.css'

function CKDForm({ onClose }) {
  const [showPreview, setShowPreview] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState(null)
  const [formData, setFormData] = useState({
      age_years: '30',
      alcohol_consumption: 'yes',
      family_history_diabetes: 'yes',
      family_history_thyroid: 'no',
      family_history_overweight_obesity: 'yes',
      other_family_history: 'no',
      bmi_category: 'normal',
      abdominal_perimeter: '85',
      female_specific_conditions: 'no',
      personal_history_hypothyroidism: 'no',
      personal_history_dyslipidemia: 'no',
      personal_history_hypertension: 'no',
      personal_history_cardiac_cerebrovascular: 'no',
      personal_history_chronic_kidney_disease: 'no',
      other_personal_history: 'no',
      fasting_glucose: '90',
      hba1c_elevated: 'no',
      hdl_cholesterol_pathological: 'no',
      ldl_cholesterol_pathological: 'no',
      microalbuminuria_category: 'no',
      prediabetes_diagnosis: 'no',
      diabetes_risk_10_years_findrisk: '1',
      metabolic_syndrome: 'no',
      hypothyroidism_diagnosis: 'no',
      hypothyroidism_treatment: 'no'
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
      const result = await predict(formData)
      if (!result || !result.prediction) {
        throw new Error('Invalid prediction result')
      }
      setPredictionResult(result.prediction)
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
      alcohol_consumption: 'Consumo de Alcohol',
      family_history_diabetes: 'Antecedente Familiar de Diabetes',
      family_history_thyroid: 'Antecedente Familiar de Tiroides',
      family_history_overweight_obesity: 'Antecedente Familiar de Sobrepeso/Obesidad',
      other_family_history: 'Otros Antecedentes Familiares',
      bmi_category: 'Categoría IMC',
      abdominal_perimeter: 'Perímetro Abdominal',
      female_specific_conditions: 'Condiciones Específicas Femeninas',
      personal_history_hypothyroidism: 'Antecedente Personal de Hipotiroidismo',
      personal_history_dyslipidemia: 'Antecedente Personal de Dislipidemia',
      personal_history_hypertension: 'Antecedente Personal de Hipertensión',
      personal_history_cardiac_cerebrovascular: 'Antecedente Personal Cardíaco/Cerebrovascular',
      personal_history_chronic_kidney_disease: 'Antecedente Personal de ERC',
      other_personal_history: 'Otros Antecedentes Personales',
      fasting_glucose: 'Glucosa en Ayunas',
      hba1c_elevated: 'HbA1c Elevado',
      hdl_cholesterol_pathological: 'HDL Patológico',
      ldl_cholesterol_pathological: 'LDL Patológico',
      microalbuminuria_category: 'Microalbuminuria',
      prediabetes_diagnosis: 'Diagnóstico de Prediabetes',
      diabetes_risk_10_years_findrisk: 'Riesgo de Diabetes a 10 años (FINDRISC)',
      metabolic_syndrome: 'Síndrome Metabólico',
      hypothyroidism_diagnosis: 'Diagnóstico de Hipotiroidismo',
      hypothyroidism_treatment: 'Tratamiento de Hipotiroidismo'
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
          {/* Demográficos */}
          <div className="preview-section">
            <h3>Demográficos</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.age_years}:</span>
                <span className="preview-value">{formData.age_years}</span>
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
                <span className="preview-label">{fieldLabels.alcohol_consumption}:</span>
                <span className="preview-value">{formData.alcohol_consumption}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.female_specific_conditions}:</span>
                <span className="preview-value">{formData.female_specific_conditions}</span>
              </div>
            </div>
          </div>
          {/* Antecedentes Familiares */}
          <div className="preview-section">
            <h3>Antecedentes Familiares</h3>
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
                <span className="preview-label">{fieldLabels.family_history_overweight_obesity}:</span>
                <span className="preview-value">{formData.family_history_overweight_obesity}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.other_family_history}:</span>
                <span className="preview-value">{formData.other_family_history}</span>
              </div>
            </div>
          </div>
          {/* Antecedentes Personales */}
          <div className="preview-section">
            <h3>Antecedentes Personales</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.personal_history_hypothyroidism}:</span>
                <span className="preview-value">{formData.personal_history_hypothyroidism}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.personal_history_dyslipidemia}:</span>
                <span className="preview-value">{formData.personal_history_dyslipidemia}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.personal_history_hypertension}:</span>
                <span className="preview-value">{formData.personal_history_hypertension}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.personal_history_cardiac_cerebrovascular}:</span>
                <span className="preview-value">{formData.personal_history_cardiac_cerebrovascular}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.personal_history_chronic_kidney_disease}:</span>
                <span className="preview-value">{formData.personal_history_chronic_kidney_disease}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.other_personal_history}:</span>
                <span className="preview-value">{formData.other_personal_history}</span>
              </div>
            </div>
          </div>
          {/* Bioquímicos */}
          <div className="preview-section">
            <h3>Bioquímicos</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.fasting_glucose}:</span>
                <span className="preview-value">{formData.fasting_glucose}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.hba1c_elevated}:</span>
                <span className="preview-value">{formData.hba1c_elevated}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.hdl_cholesterol_pathological}:</span>
                <span className="preview-value">{formData.hdl_cholesterol_pathological}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.ldl_cholesterol_pathological}:</span>
                <span className="preview-value">{formData.ldl_cholesterol_pathological}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.microalbuminuria_category}:</span>
                <span className="preview-value">{formData.microalbuminuria_category}</span>
              </div>
            </div>
          </div>
          {/* Diagnósticos y Síndromes */}
          <div className="preview-section">
            <h3>Diagnósticos y Síndromes</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.prediabetes_diagnosis}:</span>
                <span className="preview-value">{formData.prediabetes_diagnosis}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.diabetes_risk_10_years_findrisk}:</span>
                <span className="preview-value">{formData.diabetes_risk_10_years_findrisk}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.metabolic_syndrome}:</span>
                <span className="preview-value">{formData.metabolic_syndrome}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.hypothyroidism_diagnosis}:</span>
                <span className="preview-value">{formData.hypothyroidism_diagnosis}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{fieldLabels.hypothyroidism_treatment}:</span>
                <span className="preview-value">{formData.hypothyroidism_treatment}</span>
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
            <label htmlFor="alcohol_consumption">{fieldLabels.alcohol_consumption}:</label>

            <select
              id="alcohol_consumption"
              name="alcohol_consumption"
              value={formData.alcohol_consumption}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="female_specific_conditions">{fieldLabels.female_specific_conditions}:</label>

            <select
              id="female_specific_conditions"
              name="female_specific_conditions"
              value={formData.hypothyroidism_treatment}
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

      {/* Antecedentes Familiares */}
      <div className="form-section">
        <h3>Antecedentes Familiares</h3>
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
            <label htmlFor="other_family_history">{fieldLabels.other_family_history}:</label>
            <select
              id="other_family_history"
              name="other_family_history"
              value={formData.family_history_overweight_obesity}
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

      {/* Antecedentes Personales */}
      <div className="form-section">
        <h3>Antecedentes Personales</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="personal_history_hypothyroidism">{fieldLabels.personal_history_hypothyroidism}:</label>
            <select
              id="personal_history_hypothyroidism"
              name="personal_history_hypothyroidism"
              value={formData.personal_history_hypothyroidism}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
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
            <label htmlFor="personal_history_hypertension">{fieldLabels.personal_history_hypertension}:</label>
            <select
              id="personal_history_hypertension"
              name="personal_history_hypertension"
              value={formData.personal_history_hypertension}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="personal_history_cardiac_cerebrovascular">{fieldLabels.personal_history_cardiac_cerebrovascular}:</label>
            <select
              id="personal_history_cardiac_cerebrovascular"
              name="personal_history_cardiac_cerebrovascular"
              value={formData.personal_history_cardiac_cerebrovascular}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="personal_history_chronic_kidney_disease">{fieldLabels.personal_history_chronic_kidney_disease}:</label>
            <select
              id="personal_history_chronic_kidney_disease"
              name="personal_history_chronic_kidney_disease"
              value={formData.personal_history_chronic_kidney_disease}
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
              id="other_family_history"
              name="other_family_history"
              value={formData.family_history_overweight_obesity}
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

      {/* Bioquímicos */}
      <div className="form-section">
        <h3>Bioquímicos</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fasting_glucose">{fieldLabels.fasting_glucose}:</label>
            <input
              type="number"
              id="fasting_glucose"
              name="fasting_glucose"
              value={formData.fasting_glucose}
              onChange={handleInputChange}
              required
            />
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
            <label htmlFor="microalbuminuria_category">{fieldLabels.microalbuminuria_category}:</label>
            <select
              id="microalbuminuria_category"
              name="microalbuminuria_category"
              value={formData.ldl_cholesterol_pathological}
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

      {/* Diagnósticos y Síndromes */}
      <div className="form-section">
        <h3>Diagnósticos y Síndromes</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prediabetes_diagnosis">{fieldLabels.prediabetes_diagnosis}:</label>
            <select
              id="prediabetes_diagnosis"
              name="prediabetes_diagnosis"
              value={formData.prediabetes_diagnosis}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="diabetes_risk_10_years_findrisk">{fieldLabels.diabetes_risk_10_years_findrisk}:</label>
            <input
              type="number"
              id="diabetes_risk_10_years_findrisk"
              name="diabetes_risk_10_years_findrisk"
              value={formData.diabetes_risk_10_years_findrisk}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="metabolic_syndrome">{fieldLabels.metabolic_syndrome}:</label>
            <select
              id="metabolic_syndrome"
              name="metabolic_syndrome"
              value={formData.metabolic_syndrome}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="hypothyroidism_diagnosis">{fieldLabels.hypothyroidism_diagnosis}:</label>
            <select
              id="hypothyroidism_diagnosis"
              name="hypothyroidism_diagnosis"
              value={formData.hypothyroidism_diagnosis}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="hypothyroidism_treatment">{fieldLabels.hypothyroidism_treatment}:</label>
            <select
              id="hypothyroidism_treatment"
              name="hypothyroidism_treatment"
              value={formData.hypothyroidism_treatment}
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
