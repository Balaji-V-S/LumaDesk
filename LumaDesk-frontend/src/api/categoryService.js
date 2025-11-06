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

/**
 * --- NEW ---
 * Creates a new issue category
 * Matches: POST /api/issue-categories/create
 * @param {object} categoryData - { categoryName }
 */
export const createIssueCategory = (categoryData) => {
  return categoryApi.post('/create', categoryData);
};

/**
 * --- NEW ---
 * Updates an existing issue category
 * Matches: PUT /api/issue-categories/update
 * @param {object} categoryData - { categoryId, categoryName }
 */
export const updateIssueCategory = (categoryData) => {
  return categoryApi.put('/update', categoryData);
};

/**
 * --- NEW ---
 * Deletes an issue category
 * Matches: DELETE /api/issue-categories/delete?categoryId=123
 * @param {number} categoryId
 */
export const deleteIssueCategory = (categoryId) => {
  // Your endpoint uses @RequestParam, so we pass it as params
  return categoryApi.delete('/delete', {
    params: { categoryId },
  });
};

export default categoryApi;