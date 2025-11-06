// src/api/slaService.js
import axios from 'axios';

// Create a client for the SLA controller
const slaApi = axios.create({
  baseURL: 'http://localhost:8080/api/sla',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the JWT interceptor
slaApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Matches: GET /api/sla/all
 */
export const getAllSlas = () => {
  return slaApi.get('/all');
};

/**
 * Matches: POST /api/sla/create
 * @param {object} slaData - { severity, priority, timeLimitHour }
 */
export const createSla = (slaData) => {
  return slaApi.post('/create', slaData);
};

/**
 * Matches: PUT /api/sla/update
 * @param {object} slaData - { slaId, severity, priority, timeLimitHour }
 */
export const updateSla = (slaData) => {
  return slaApi.put('/update', slaData);
};

/**
 * Matches: DELETE /api/sla/delete/{slaId}
 * @param {number} slaId
 */
export const deleteSla = (slaId) => {
  return slaApi.delete(`/delete/${slaId}`);
};