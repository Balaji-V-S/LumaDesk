// src/api/logService.js
import axios from 'axios';

const logApi = axios.create({
  baseURL: 'http://localhost:8080/api/logs',
  headers: { 'Content-Type': 'application/json' },
});

logApi.interceptors.request.use(
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

export const getActionLogs = (ticketId) => {
  return logApi.get(`/action/${ticketId}`);
};

export const getAssignmentLogs = (ticketId) => {
  return logApi.get(`/assignment/${ticketId}`);
};