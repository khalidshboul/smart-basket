/**
 * Smart Basket - API Client
 * Axios instance with base configuration
 */

import axios from 'axios';

// For local testing, use your Mac's local IP (same WiFi as iPhone)
// Backend is running on port 9090
const API_BASE_URL = 'https://aleah-nonoperational-cordia.ngrok-free.dev/smart-basket/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
