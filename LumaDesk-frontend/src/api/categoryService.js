// src/api/categoryService.js
import axios from 'axios';

// Create a dedicated API client for the issue category service
const categoryApi = axios.create({
  baseURL: 'http://localhost:8080/api/issue-categories',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the JWT to every request (same as our other services)
categoryApi.interceptors.request.use(
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
 * Gets all issue categories
 * Matches: GET /api/issue-categories/all
 */
export const getAllIssueCategories = () => {
  return categoryApi.get('/all');
};