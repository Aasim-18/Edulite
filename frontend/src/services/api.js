import axios from 'axios';
import { endRequest, startRequest } from './requestProgress';

export const apiClient = axios.create({
  baseURL: '/api',
});

// axios sets Content-Type automatically: application/json for JSON bodies,
// multipart/form-data (with boundary) for FormData uploads like study material.

apiClient.interceptors.request.use((config) => {
  startRequest();
  const token = localStorage.getItem('eduflow_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Wait before returning the retried request so a first-load blip can settle.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

apiClient.interceptors.response.use(
  (response) => {
    endRequest();
    return response;
  },
  async (error) => {
    const original = error.config;

    // A request with no HTTP response (backend briefly unreachable, connection
    // reset, etc.) can fail once on the first call and succeed on a retry.
    // Retry only once and only safe, idempotent GET requests — never retry a
    // POST, otherwise a payment or fee could be recorded twice.
    const isNetworkError = !error.response;
    const isRetryable = original && original.method === 'get' && !original._retried;

    if (isNetworkError && isRetryable) {
      original._retried = true;
      endRequest();
      await wait(700);
      return apiClient(original);
    }

    endRequest();

    if (error.response?.status === 401) {
      localStorage.removeItem('eduflow_token');
      localStorage.removeItem('eduflow_user');

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);
