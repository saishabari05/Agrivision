const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const storedUser = window.localStorage.getItem('agrivision_user');
  const token = storedUser ? JSON.parse(storedUser)?.token : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: isFormData
      ? options.headers
      : {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed for ${path}`);
  }

  return response.json();
}

export function uploadLeafImage(formData) {
  return request('/api/analyze', {
    method: 'POST',
    body: formData,
    headers: {},
  });
}

export function sendChatMessage(payload) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchReports() {
  return request('/api/reports');
}

export function fetchClientOverview() {
  return request('/api/client-overview');
}

export function fetchDashboard() {
  return request('/api/dashboard');
}

export function fetchUploads() {
  return request('/api/uploads');
}

export function fetchFarms() {
  return request('/api/farms');
}

export function createFarm(payload) {
  return request('/api/farms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateFarm(farmId, payload) {
  return request(`/api/farms/${farmId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteFarm(farmId) {
  return request(`/api/farms/${farmId}`, {
    method: 'DELETE',
  });
}

export function generateReport(payload) {
  return request('/api/reports/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteReport(reportId) {
  return request(`/api/reports/${reportId}`, {
    method: 'DELETE',
  });
}

export function fetchProfile() {
  return request('/api/profile');
}

export function updateProfile(payload) {
  return request('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function loginWithEmailApi(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerWithEmailApi(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { API_BASE_URL };
