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

  const getRiskLevel = (probability) => {
    if (probability >= 0.7) return { level: 'Alto', color: 'var(--main-red)', bgColor: 'var(--gray-light)' }
    if (probability >= 0.4) return { level: 'Moderado', color: 'var(--main-red-dark)', bgColor: 'var(--gray-light)' }
    return { level: 'Bajo', color: '#059669', bgColor: 'var(--gray-light)' }
  }

  const riskInfo = getRiskLevel(predictionResult.probability)

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
                  {(predictionResult.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="risk-level" style={{ color: riskInfo.color }}>
                Nivel de Riesgo: {riskInfo.level}
              </div>
              <div className="prediction-description">
                {predictionResult.probability >= 0.7 
                  ? "Se recomienda consultar con un médico especialista para evaluación adicional."
                  : predictionResult.probability >= 0.4
                  ? "Se recomienda monitoreo regular y consulta médica preventiva."
                  : "Riesgo bajo. Mantener hábitos saludables y controles regulares."
                }
              </div>
            </div>
          </div>

          {/* Key Factors */}
          <div className="factors-section">
            <h3>Factores Clave Identificados</h3>
            <div className="factors-grid">
              {predictionResult.keyFactors.map((factor, index) => (
                <div key={index} className="factor-item">
                  <span className="factor-name">{factor.name}</span>
                  <span className="factor-value">{factor.value}</span>
                  <span className="factor-impact">{factor.impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Data Summary */}
          <div className="summary-section">
            <h3>Resumen de Datos Ingresados</h3>
            <div className="summary-grid">
              <div className="summary-group">
                <h4>Información Demográfica</h4>
                <div className="summary-item">
                  <span>Edad:</span>
                  <span>{formData.age} años</span>
                </div>
                <div className="summary-item">
                  <span>Género:</span>
                  <span>{formData.gender === 'male' ? 'Masculino' : 'Femenino'}</span>
                </div>
              </div>

              <div className="summary-group">
                <h4>Signos Vitales</h4>
                <div className="summary-item">
                  <span>Presión Arterial:</span>
                  <span>{formData.bloodPressure} mmHg</span>
                </div>
              </div>

              <div className="summary-group">
                <h4>Análisis de Sangre</h4>
                <div className="summary-item">
                  <span>Creatinina Sérica:</span>
                  <span>{formData.serumCreatinine} mg/dL</span>
                </div>
                <div className="summary-item">
                  <span>Glucosa:</span>
                  <span>{formData.bloodGlucose} mg/dL</span>
                </div>
              </div>

              <div className="summary-group">
                <h4>Condiciones Médicas</h4>
                <div className="summary-item">
                  <span>Hipertensión:</span>
                  <span>{formData.hypertension === 'yes' ? 'Sí' : 'No'}</span>
                </div>
                <div className="summary-item">
                  <span>Diabetes:</span>
                  <span>{formData.diabetesMellitus === 'yes' ? 'Sí' : 'No'}</span>
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