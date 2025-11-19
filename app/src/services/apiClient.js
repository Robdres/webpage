// filepath: apiClient.js
const API_BASE = " http://127.0.0.1:5000";
const logoBase64 = "";

export async function getColumns() {
  const res = await fetch(`${API_BASE}/columns`);
  if (!res.ok) throw new Error("Failed to fetch columns");
  const data = await res.json();
  return data.columns;
}

export async function getMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error("Failed to fetch metrics");
  return await res.json();
}

function mapFormDataToNumeric(input) {
  return {
    age_years: Number(input.age_years),
    alcohol_consumption: input.alcohol_consumption === "yes" ? 1 : 0,
    family_history_diabetes: input.family_history_diabetes === "yes" ? 1 : 0,
    family_history_thyroid: input.family_history_thyroid === "yes" ? 1 : 0,
    family_history_overweight_obesity: input.family_history_overweight_obesity === "yes" ? 1 : 0,
    other_family_history: input.other_family_history === "yes" ? 1 : 0,
    bmi_category: (
      input.bmi_category === "underweight" ? 0 :
      input.bmi_category === "normal" ? 1 :
      input.bmi_category === "overweight" ? 2 :
      input.bmi_category === "obese" ? 3 : null
    ),
    abdominal_perimeter: Number(input.abdominal_perimeter),
    female_specific_conditions: input.female_specific_conditions === "yes" ? 1 : 0,
    personal_history_hypothyroidism: input.personal_history_hypothyroidism === "yes" ? 1 : 0,
    personal_history_dyslipidemia: input.personal_history_dyslipidemia === "yes" ? 1 : 0,
    personal_history_hypertension: input.personal_history_hypertension === "yes" ? 1 : 0,
    personal_history_cardiac_cerebrovascular: input.personal_history_cardiac_cerebrovascular === "yes" ? 1 : 0,
    personal_history_chronic_kidney_disease: input.personal_history_chronic_kidney_disease === "yes" ? 1 : 0,
    other_personal_history: input.other_personal_history === "yes" ? 1 : 0,
    fasting_glucose: Number(input.fasting_glucose),
    hba1c_elevated: input.hba1c_elevated === "yes" ? 1 : 0,
    hdl_cholesterol_pathological: input.hdl_cholesterol_pathological === "yes" ? 1 : 0,
    ldl_cholesterol_pathological: input.ldl_cholesterol_pathological === "yes" ? 1 : 0,
    microalbuminuria_category: input.microalbuminuria_category === "yes" ? 1 : 0,
    prediabetes_diagnosis: input.prediabetes_diagnosis === "yes" ? 1 : 0,
    diabetes_risk_10_years_findrisk: Number(input.diabetes_risk_10_years_findrisk),
    metabolic_syndrome: input.metabolic_syndrome === "yes" ? 1 : 0,
    hypothyroidism_diagnosis: input.hypothyroidism_diagnosis === "yes" ? 1 : 0,
    hypothyroidism_treatment: input.hypothyroidism_treatment === "yes" ? 1 : 0
  }
}

export async function predict(input) {
  const numericInput = mapFormDataToNumeric(input)
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(numericInput)
  });
  if (!res.ok) throw new Error("Prediction failed");
  return await res.json();
}

export async function test(input) {
  const res = await fetch(`${API_BASE}/test`);
  if (!res.ok) throw new Error("Failed to fetch columns");
  const data = await res.json();
  return await res.json();
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

export const generatePDF = async (formData, predictionResult) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Draw image (logo) at top right
    // Make sure you have loaded the image as base64 or URL
    const logoImg = './assets/logo.png'; // Replace with your logo's base64 string
    const logoWidth = 30; // Adjust as needed
    const logoHeight = 30; // Adjust as needed
    const pageWidth = doc.internal.pageSize.getWidth();
    //doc.addImage(logoImg, 'PNG', pageWidth - logoWidth - 10, 10, logoWidth, logoHeight);
    doc.setFontSize(16); // Reduced font size
    doc.setTextColor(220, 38, 38); // Red color
    doc.text('Kidney Tool - Predicción CKD', 105, 18, { align: 'center' });

    // Add timestamp
    doc.setFontSize(8); // Reduced font size
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 28);
    doc.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`, 20, 33);

    // Prediction Results
    doc.setFontSize(12); // Reduced font size
    doc.setTextColor(0, 0, 0);
    doc.text('Resultados de Predicción', 20, 45);

    doc.setFontSize(8); // Reduced font size
    const probability = (predictionResult * 100).toFixed(1);
    doc.text(`Probabilidad de CKD: ${probability}%`, 20, 55);

    // Risk level
    let riskLevel = 'Bajo';
    let riskColor = [5, 150, 105]; // Green
    if (predictionResult >= 0.7) {
      riskLevel = 'Alto';
      riskColor = [220, 38, 38]; // Red
    } else if (predictionResult >= 0.4) {
      riskLevel = 'Moderado';
      riskColor = [245, 158, 11]; // Orange
    }

    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(`Nivel de Riesgo: ${riskLevel}`, 20, 62);

    // Form Data Summary - grouped
    doc.setFontSize(12); // Reduced font size
    doc.setTextColor(0, 0, 0);
    doc.text('Datos del Paciente', 20, 72);

    doc.setFontSize(8); // Reduced font size
    let yPos = 78;
    let col1X = 20;
    let col2X = 120;
    let colYStart = yPos;
    let colY = yPos;
    let colY2 = yPos;

    // Split fields into two columns for better distribution
    const col1Fields = [
      `${fieldLabels.age_years}: ${formData.age_years}`,
      `${fieldLabels.bmi_category}: ${bmiLabels[formData.bmi_category]}`,
      `${fieldLabels.abdominal_perimeter}: ${formData.abdominal_perimeter}`,
      `${fieldLabels.alcohol_consumption}: ${showYesNo(formData.alcohol_consumption)}`,
      `${fieldLabels.female_specific_conditions}: ${showYesNo(formData.female_specific_conditions)}`,
      `${fieldLabels.family_history_diabetes}: ${showYesNo(formData.family_history_diabetes)}`,
      `${fieldLabels.family_history_thyroid}: ${showYesNo(formData.family_history_thyroid)}`,
      `${fieldLabels.family_history_overweight_obesity}: ${showYesNo(formData.family_history_overweight_obesity)}`,
      `${fieldLabels.other_family_history}: ${showYesNo(formData.other_family_history)}`,
      `${fieldLabels.personal_history_hypothyroidism}: ${showYesNo(formData.personal_history_hypothyroidism)}`,
      `${fieldLabels.personal_history_dyslipidemia}: ${showYesNo(formData.personal_history_dyslipidemia)}`,
      `${fieldLabels.personal_history_hypertension}: ${showYesNo(formData.personal_history_hypertension)}`
    ];
    const col2Fields = [
      `${fieldLabels.personal_history_cardiac_cerebrovascular}: ${showYesNo(formData.personal_history_cardiac_cerebrovascular)}`,
      `${fieldLabels.personal_history_chronic_kidney_disease}: ${showYesNo(formData.personal_history_chronic_kidney_disease)}`,
      `${fieldLabels.other_personal_history}: ${showYesNo(formData.other_personal_history)}`,
      `${fieldLabels.fasting_glucose}: ${formData.fasting_glucose}`,
      `${fieldLabels.hba1c_elevated}: ${showYesNo(formData.hba1c_elevated)}`,
      `${fieldLabels.hdl_cholesterol_pathological}: ${showYesNo(formData.hdl_cholesterol_pathological)}`,
      `${fieldLabels.ldl_cholesterol_pathological}: ${showYesNo(formData.ldl_cholesterol_pathological)}`,
      `${fieldLabels.microalbuminuria_category}: ${showYesNo(formData.microalbuminuria_category)}`,
      `${fieldLabels.prediabetes_diagnosis}: ${showYesNo(formData.prediabetes_diagnosis)}`,
      `${fieldLabels.diabetes_risk_10_years_findrisk}: ${formData.diabetes_risk_10_years_findrisk}`,
      `${fieldLabels.metabolic_syndrome}: ${showYesNo(formData.metabolic_syndrome)}`,
      `${fieldLabels.hypothyroidism_diagnosis}: ${showYesNo(formData.hypothyroidism_diagnosis)}`,
      `${fieldLabels.hypothyroidism_treatment}: ${showYesNo(formData.hypothyroidism_treatment)}`
    ];

    col1Fields.forEach(item => {
      doc.text(item, col1X, colY);
      colY += 6;
    });

    col2Fields.forEach(item => {
      doc.text(item, col2X, colY2);
      colY2 += 6;
    });

    // Section titles for columns
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Footer
    doc.setFontSize(7); // Reduced font size
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
}


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

