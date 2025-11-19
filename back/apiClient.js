// filepath: apiClient.js
const API_BASE = "http://localhost:5000";

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

export async function predict(input) {
  println("Input received for prediction:", input);
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error("Prediction failed");
  return await res.json();
}

export async function predict(input) {
  const res = await fetch(`${API_BASE}/test`);
  if (!res.ok) throw new Error("Failed to fetch columns");
  const data = await res.json();
  return await res.json();
}

//const input = {
//  age_years: 50,
//  alcohol_consumption: "Never",
//  family_history_diabetes: 0,
//  family_history_thyroid: 0,
//  family_history_overweight_obesity: 1,
//  other_family_history: 0,
//  bmi_category: "Normal",
//  abdominal_perimeter: 90.0,
//  female_specific_conditions: "None",
//  personal_history_hypothyroidism: 0,
//  personal_history_dyslipidemia: 1,
//  personal_history_hypertension: 0,
//  personal_history_cardiac_cerebrovascular: 0,
//  personal_history_chronic_kidney_disease: 0,
//  other_personal_history: 0,
//  fasting_glucose: 90.0,
//  hba1c_elevated: 0,
//  hdl_cholesterol_pathological: 0,
//  ldl_cholesterol_pathological: 1,
//  microalbuminuria_category: 0,
//  prediabetes_diagnosis: 0,
//  diabetes_risk_10_years_findrisk: 5,
//  metabolic_syndrome: 0,
//  hypothyroidism_diagnosis: 0,
//  hypothyroidism_treatment: 0
//};
//````
//- Use `/columns` to get the list of required keys.
//- Collect user input for each key (e.g., from a form).
//- Build the object and send it as JSON in your POST request.
//
//const result = await predict(input); // input as shown above
//console.log(result.prediction);
