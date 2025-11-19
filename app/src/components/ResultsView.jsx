import { useState } from 'react'
import './ResultsView.css'

function ResultsView({ formData, predictionResult, onBack, onDownloadPDF }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfMessage, setPdfMessage] = useState(null)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    setPdfMessage(null)
    try {
      const result = await onDownloadPDF(formData, predictionResult)
      if (result && result.success) {
        setPdfMessage({ type: 'success', text: '¡Reporte PDF generado exitosamente!' })
      } else {
        setPdfMessage({ type: 'error', text: 'No se pudo generar el PDF. Intenta nuevamente.' })
      }
    } catch (error) {
      setPdfMessage({ type: 'error', text: 'Error al generar el PDF. Intenta nuevamente.' })
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
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
const bmiLabels = {
  0: 'Bajo peso',
  1: 'Normal',
  2: 'Sobrepeso',
  3: 'Obeso',
  underweight: 'Bajo peso',
  normal: 'Normal',
  overweight: 'Sobrepeso',
  obese: 'Obeso'
}

function showYesNo(val) {
  return val === 1 || val === "yes" ? "Sí" : "No"
}

  const getRiskLevel = (probability) => {
      probability = parseFloat(probability)
    if (probability >= 0.7) return { level: 'Alto', color: 'var(--main-red)', bgColor: 'var(--gray-light)' }
    if (probability >= 0.4) return { level: 'Moderado', color: 'var(--main-red-dark)', bgColor: 'var(--gray-light)' }
    return { level: 'Bajo', color: '#059669', bgColor: 'var(--gray-light)' }
  }

  const riskInfo = getRiskLevel(predictionResult)

return (
  <div className="results-overlay">
    <div className="results-container">
      <div className="results-header">
        <h2>Resultados de Predicción CKD</h2>
        <button className="close-button" onClick={onBack}>×</button>
      </div>

      <div className="results-content">
        {/* Prediction Result */}
        <div className="prediction-section">
          <h3>Predicción de Enfermedad Renal Crónica</h3>
          <div className="prediction-card" style={{ backgroundColor: riskInfo.bgColor }}>
            <div className="prediction-header">
              <span className="prediction-label">Probabilidad de CKD:</span>
              <span className="prediction-value" style={{ color: riskInfo.color }}>
                {(predictionResult * 100).toFixed(1)}%
              </span>
            </div>
            <div className="risk-level" style={{ color: riskInfo.color }}>
              Nivel de Riesgo: {riskInfo.level}
            </div>
            <div className="prediction-description">
              {predictionResult >= 0.7
                ? "Se recomienda consultar con un médico especialista para evaluación adicional."
                : predictionResult >= 0.4
                ? "Se recomienda monitoreo regular y consulta médica preventiva."
                : "Riesgo bajo. Mantener hábitos saludables y controles regulares."
              }
            </div>
          </div>
        </div>

        {/* Form Data Summary */}
        <div className="summary-section">
          <h3>Resumen de Datos Ingresados</h3>
          <div className="summary-grid">

            {/* Demográficos */}
            <div className="summary-group">
              <h4>Demográficos</h4>
              <div className="summary-item">
                <span>{fieldLabels.age_years}:</span>
                <span>{formData.age_years}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.bmi_category}:</span>
                <span>{bmiLabels[formData.bmi_category]}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.abdominal_perimeter}:</span>
                <span>{formData.abdominal_perimeter}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.alcohol_consumption}:</span>
                <span>{showYesNo(formData.alcohol_consumption)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.female_specific_conditions}:</span>
                <span>{showYesNo(formData.female_specific_conditions)}</span>
              </div>
            </div>

            {/* Antecedentes Familiares */}
            <div className="summary-group">
              <h4>Antecedentes Familiares</h4>
              <div className="summary-item">
                <span>{fieldLabels.family_history_diabetes}:</span>
                <span>{showYesNo(formData.family_history_diabetes)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.family_history_thyroid}:</span>
                <span>{showYesNo(formData.family_history_thyroid)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.family_history_overweight_obesity}:</span>
                <span>{showYesNo(formData.family_history_overweight_obesity)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.other_family_history}:</span>
                <span>{showYesNo(formData.other_family_history)}</span>
              </div>
            </div>

            {/* Antecedentes Personales */}
            <div className="summary-group">
              <h4>Antecedentes Personales</h4>
              <div className="summary-item">
                <span>{fieldLabels.personal_history_hypothyroidism}:</span>
                <span>{showYesNo(formData.personal_history_hypothyroidism)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.personal_history_dyslipidemia}:</span>
                <span>{showYesNo(formData.personal_history_dyslipidemia)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.personal_history_hypertension}:</span>
                <span>{showYesNo(formData.personal_history_hypertension)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.personal_history_cardiac_cerebrovascular}:</span>
                <span>{showYesNo(formData.personal_history_cardiac_cerebrovascular)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.personal_history_chronic_kidney_disease}:</span>
                <span>{showYesNo(formData.personal_history_chronic_kidney_disease)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.other_personal_history}:</span>
                <span>{showYesNo(formData.other_personal_history)}</span>
              </div>
            </div>

            {/* Bioquímicos */}
            <div className="summary-group">
              <h4>Bioquímicos</h4>
              <div className="summary-item">
                <span>{fieldLabels.fasting_glucose}:</span>
                <span>{formData.fasting_glucose}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.hba1c_elevated}:</span>
                <span>{showYesNo(formData.hba1c_elevated)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.hdl_cholesterol_pathological}:</span>
                <span>{showYesNo(formData.hdl_cholesterol_pathological)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.ldl_cholesterol_pathological}:</span>
                <span>{showYesNo(formData.ldl_cholesterol_pathological)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.microalbuminuria_category}:</span>
                <span>{showYesNo(formData.microalbuminuria_category)}</span>
              </div>
            </div>

            {/* Diagnósticos y Síndromes */}
            <div className="summary-group">
              <h4>Diagnósticos y Síndromes</h4>
              <div className="summary-item">
                <span>{fieldLabels.prediabetes_diagnosis}:</span>
                <span>{showYesNo(formData.prediabetes_diagnosis)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.diabetes_risk_10_years_findrisk}:</span>
                <span>{formData.diabetes_risk_10_years_findrisk}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.metabolic_syndrome}:</span>
                <span>{showYesNo(formData.metabolic_syndrome)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.hypothyroidism_diagnosis}:</span>
                <span>{showYesNo(formData.hypothyroidism_diagnosis)}</span>
              </div>
              <div className="summary-item">
                <span>{fieldLabels.hypothyroidism_treatment}:</span>
                <span>{showYesNo(formData.hypothyroidism_treatment)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pdf-download-section">
        <h3>📄 Generar Reporte PDF</h3>
        <p>Descarga un reporte profesional con todos los resultados para compartir con tu médico.</p>
        <button
          type="button"
          className="download-button prominent"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? '🔄 Generando PDF...' : '📥 Descargar PDF'}
        </button>
      </div>

      <div className="results-actions">
        <button type="button" className="back-button" onClick={onBack}>
          Volver al Formulario
        </button>
      </div>

      {pdfMessage && (
        <div className={`pdf-message ${pdfMessage.type}`}>
          {pdfMessage.text}
        </div>
      )}
    </div>
  </div>
)
}

export default ResultsView
