import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { createSecurityHeaders } from './security';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('novabank_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach cryptographic anti-replay & request signature headers
  const securityHeaders = createSecurityHeaders();
  config.headers['X-Timestamp'] = securityHeaders['X-Timestamp'];
  config.headers['X-Nonce'] = securityHeaders['X-Nonce'];
  config.headers['X-Tx-Signature'] = securityHeaders['X-Tx-Signature'];

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
