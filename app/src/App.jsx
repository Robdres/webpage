import { useState } from 'react'
import reactLogo from './assets/logo.png'
import CKDForm from './components/CKDForm'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(false)

  const handleButtonClick = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={reactLogo} className="logo" alt="Kidney Tool Logo" />
            <h1>Kidney Tool</h1>
          </div>
          <p className="header-subtitle">Predicción Inteligente de Enfermedad Renal Crónica</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h2>Predicción Avanzada de CKD</h2>
            <p className="hero-description">
              Utiliza inteligencia artificial para evaluar el riesgo de Enfermedad Renal Crónica 
              basándose en múltiples factores clínicos y de estilo de vida.
            </p>
            <button className="cta-button" onClick={handleButtonClick}>
              <span className="button-icon">🔬</span>
              PREDECIR CKD
            </button>
          </div>
          <div className="hero-visual">
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Análisis Completo</h3>
                <p>Evaluación de más de 40 factores de riesgo</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>IA Avanzada</h3>
                <p>Modelo de machine learning entrenado con datos clínicos</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <h3>Reporte Detallado</h3>
                <p>Generación automática de reportes en PDF</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>Acerca de la Herramienta</h2>
            <p>Una solución integral para la detección temprana de CKD</p>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <h3>¿Qué es Kidney Tool?</h3>
              <p>
                Kidney Tool es una aplicación web desarrollada para la predicción temprana de 
                Enfermedad Renal Crónica (CKD) utilizando técnicas avanzadas de inteligencia artificial. 
                La herramienta analiza múltiples parámetros clínicos, factores de riesgo y datos demográficos 
                para proporcionar una evaluación precisa del riesgo de desarrollar CKD.
              </p>
              
              <h3>Características Principales</h3>
              <ul className="features-list">
                <li><strong>Evaluación Integral:</strong> Análisis de más de 40 factores de riesgo incluyendo parámetros clínicos, laboratorio, estilo de vida y condiciones médicas</li>
                <li><strong>Algoritmo Avanzado:</strong> Modelo de machine learning entrenado con datos clínicos reales</li>
                <li><strong>Interfaz Intuitiva:</strong> Formulario fácil de usar con valores predeterminados</li>
                <li><strong>Reportes Profesionales:</strong> Generación automática de reportes en PDF con resultados detallados</li>
                <li><strong>Precisión Clínica:</strong> Validado con datos médicos reales y literatura científica</li>
              </ul>

              <h3>Factores Evaluados</h3>
              <div className="factors-grid">
                <div className="factor-category">
                  <h4>🏥 Parámetros Clínicos</h4>
                  <ul>
                    <li>Presión arterial</li>
                    <li>Edad y género</li>
                    <li>Historia médica familiar</li>
                    <li>Condiciones preexistentes</li>
                  </ul>
                </div>
                <div className="factor-category">
                  <h4>🔬 Análisis de Laboratorio</h4>
                  <ul>
                    <li>Creatinina sérica</li>
                    <li>Glucosa en sangre</li>
                    <li>Hemoglobina</li>
                    <li>Análisis de orina</li>
                  </ul>
                </div>
                <div className="factor-category">
                  <h4>💊 Factores de Riesgo</h4>
                  <ul>
                    <li>Diabetes mellitus</li>
                    <li>Hipertensión</li>
                    <li>Enfermedades cardiovasculares</li>
                    <li>Exposición a medicamentos</li>
                  </ul>
                </div>
                <div className="factor-category">
                  <h4>🌱 Estilo de Vida</h4>
                  <ul>
                    <li>Tabaquismo</li>
                    <li>Consumo de alcohol</li>
                    <li>Actividad física</li>
                    <li>Hábitos alimenticios</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="section-header">
            <h2>¿Cómo Funciona?</h2>
            <p>Proceso simple y efectivo para obtener tu predicción</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Completa el Formulario</h3>
                <p>Llena los datos clínicos y de estilo de vida. Todos los campos tienen valores predeterminados para facilitar el proceso.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Revisa tus Respuestas</h3>
                <p>Confirma que toda la información sea correcta antes de proceder con la predicción.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Obtén tu Predicción</h3>
                <p>Recibe una evaluación detallada del riesgo de CKD con probabilidades y factores clave.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Descarga tu Reporte</h3>
                <p>Genera un reporte profesional en PDF con todos los resultados para compartir con tu médico.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>¿Listo para Evaluar tu Riesgo?</h2>
            <p>
              Obtén una evaluación profesional del riesgo de Enfermedad Renal Crónica 
              en menos de 5 minutos. Es rápido, preciso y completamente gratuito.
            </p>
            <button className="cta-button large" onClick={handleButtonClick}>
              <span className="button-icon">🚀</span>
              COMENZAR EVALUACIÓN
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Form Modal */}
      {showForm && <CKDForm onClose={handleCloseForm} />}
    </div>
  )
}

export default App