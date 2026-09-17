import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yieldrent_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle unauthenticated sessions gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear localStorage
      if (localStorage.getItem('yieldrent_token')) {
        localStorage.removeItem('yieldrent_token');
        localStorage.removeItem('yieldrent_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
