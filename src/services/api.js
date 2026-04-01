const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: isFormData
      ? options.headers
      : {
          'Content-Type': 'application/json',
          ...options.headers,
        },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path}`);
  }

  return response.json();
}

export function uploadLeafImage(formData) {
  return request('/predict', {
    method: 'POST',
    body: formData,
    headers: {},
  });
}

export function fetchReports() {
  return request('/reports');
}

export function fetchClientOverview() {
  return request('/client-overview');
}

export function generateReport(payload) {
  return request('/reports/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { API_BASE_URL };
