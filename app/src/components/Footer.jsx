import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Kidney Tool</h3>
          <p>
            Herramienta de predicción de Enfermedad Renal Crónica desarrollada con 
            inteligencia artificial para la detección temprana y prevención.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" title="GitHub">
              <span>📚</span>
            </a>
            <a href="#" className="social-link" title="LinkedIn">
              <span>🔗</span>
            </a>
            <a href="#" className="social-link" title="Email">
              <span>✉️</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Documentación</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                📊 Base de Datos
              </a>
              <span className="link-description">Estructura y esquema de la base de datos</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                📋 API Documentation
              </a>
              <span className="link-description">Endpoints y especificaciones técnicas</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                🤖 Modelo de IA
              </a>
              <span className="link-description">Arquitectura y entrenamiento del modelo</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                📈 Metodología
              </a>
              <span className="link-description">Proceso de desarrollo y validación</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Investigación</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                📖 Tesis Completa
              </a>
              <span className="link-description">Documento completo de la investigación</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                📊 Resultados
              </a>
              <span className="link-description">Análisis de resultados y validación</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                📚 Referencias
              </a>
              <span className="link-description">Bibliografía y fuentes consultadas</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                🔬 Metodología
              </a>
              <span className="link-description">Enfoque científico y técnicas utilizadas</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Recursos</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                🏥 Información CKD
              </a>
              <span className="link-description">Educación sobre enfermedad renal</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                📋 Guías Clínicas
              </a>
              <span className="link-description">Protocolos médicos actualizados</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                📞 Contacto
              </a>
              <span className="link-description">Información de contacto y soporte</span>
            </li>
            <li>
              <a href="#" className="footer-link">
                ❓ FAQ
              </a>
              <span className="link-description">Preguntas frecuentes</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-info">
            <p>&copy; {currentYear} Kidney Tool. Todos los derechos reservados.</p>
            <p>
              Desarrollado como parte de una tesis de investigación en 
              <strong>Para la obtención de la Maestría en Inteligencia Artificial Aplicada</strong>
            </p>
          </div>
          <div className="footer-legal">
            <a href="#" className="legal-link">Términos de Uso</a>
            <a href="#" className="legal-link">Política de Privacidad</a>
            <a href="#" className="legal-link">Aviso Legal</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 