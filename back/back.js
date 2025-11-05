const API_BASE = "http://localhost:8000"; // change if deployed elsewhere

// ---------- Core helper ----------
async function apiRequest(endpoint, method = "GET", body = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, opts);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API ${endpoint} failed (${res.status}): ${errText}`);
  }
  return await res.json();
}

// ---------- Endpoints ----------
export async function getInfo() {
  // Returns metadata: best model, r2 score, feature schema
  return await apiRequest("/info");
}

export async function predictOne(sample) {
  // sample: JS object with your input data
  // e.g. { age_years: 60, gender: "M", bmi_category: "OVERWEIGHT", ... }
  return await apiRequest("/predict", "POST", sample);
}

export async function predictBatch(samples) {
  // samples: array of objects with same structure
  return await apiRequest("/predict", "POST", samples);
}

