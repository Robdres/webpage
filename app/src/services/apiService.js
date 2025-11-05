// API Service for CKD Prediction
const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your Flask API URL

// Dummy prediction function (replace with actual API call later)
export const predictCKD = async (formData) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dummy prediction result
    const dummyResult = {
      probability: Math.random() * 0.8 + 0.1, // Random probability between 0.1 and 0.9
      keyFactors: [
        {
          name: 'Creatinina Sérica',
          value: `${formData.serumCreatinine} mg/dL`,
          impact: 'Alto Impacto'
        },
        {
          name: 'Presión Arterial',
          value: `${formData.bloodPressure} mmHg`,
          impact: 'Moderado Impacto'
        },
        {
          name: 'Edad',
          value: `${formData.age} años`,
          impact: 'Alto Impacto'
        },
        {
          name: 'Diabetes',
          value: formData.diabetesMellitus === 'yes' ? 'Sí' : 'No',
          impact: 'Alto Impacto'
        },
        {
          name: 'Hipertensión',
          value: formData.hypertension === 'yes' ? 'Sí' : 'No',
          impact: 'Moderado Impacto'
        }
      ],
      timestamp: new Date().toISOString(),
      modelVersion: '1.0.0'
    };
    
    return dummyResult;
    
    // Uncomment below for actual API call
    /*
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
    */
  } catch (error) {
    console.error('Error calling prediction API:', error);
    throw error;
  }
};

// PDF Generation Service - Using dummy data for now
export const generatePDF = async (formData, predictionResult) => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Add logo/header
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38); // Red color
    doc.text('Kidney Tool - Predicción CKD', 105, 20, { align: 'center' });
    
    // Add timestamp
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 35);
    doc.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`, 20, 40);
    
    // Prediction Results
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Resultados de Predicción', 20, 55);
    
    doc.setFontSize(12);
    const probability = (predictionResult.probability * 100).toFixed(1);
    doc.text(`Probabilidad de CKD: ${probability}%`, 20, 70);
    
    // Risk level
    let riskLevel = 'Bajo';
    let riskColor = [5, 150, 105]; // Green
    if (predictionResult.probability >= 0.7) {
      riskLevel = 'Alto';
      riskColor = [220, 38, 38]; // Red
    } else if (predictionResult.probability >= 0.4) {
      riskLevel = 'Moderado';
      riskColor = [245, 158, 11]; // Orange
    }
    
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(`Nivel de Riesgo: ${riskLevel}`, 20, 80);
    
    // Key Factors
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Factores Clave Identificados', 20, 100);
    
    doc.setFontSize(10);
    predictionResult.keyFactors.forEach((factor, index) => {
      const yPos = 110 + (index * 8);
      doc.text(`${factor.name}: ${factor.value} (${factor.impact})`, 25, yPos);
    });
    
    // Form Data Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Datos del Paciente', 20, 160);
    
    doc.setFontSize(10);
    const formSummary = [
      `Edad: ${formData.age} años`,
      `Género: ${formData.gender === 'male' ? 'Masculino' : 'Femenino'}`,
      `Presión Arterial: ${formData.bloodPressure} mmHg`,
      `Creatinina Sérica: ${formData.serumCreatinine} mg/dL`,
      `Glucosa en Sangre: ${formData.bloodGlucose} mg/dL`,
      `Urea en Sangre: ${formData.bloodUrea} mg/dL`,
      `Hemoglobina: ${formData.hemoglobin} g/dL`,
      `Hipertensión: ${formData.hypertension === 'yes' ? 'Sí' : 'No'}`,
      `Diabetes Mellitus: ${formData.diabetesMellitus === 'yes' ? 'Sí' : 'No'}`,
      `Tabaquismo: ${formData.smoking === 'never' ? 'Nunca' : formData.smoking === 'former' ? 'Ex-fumador' : 'Fumador actual'}`,
      `Obesidad: ${formData.obesity === 'yes' ? 'Sí' : 'No'}`,
      `Historia Familiar CKD: ${formData.familyHistoryCKD === 'yes' ? 'Sí' : 'No'}`
    ];
    
    formSummary.forEach((item, index) => {
      const yPos = 170 + (index * 6);
      doc.text(item, 25, yPos);
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Este reporte fue generado automáticamente por Kidney Tool', 105, 280, { align: 'center' });
    doc.text('Para consultas médicas, siempre consulte con un profesional de la salud', 105, 285, { align: 'center' });
    
    // Save the PDF
    const fileName = `CKD_Prediction_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName: fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error al generar el reporte PDF. Por favor, inténtalo de nuevo.');
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
}; 