// src/api/feedbackService.js
import axios from 'axios';

// Create a dedicated API client for the feedback service
const feedbackApi = axios.create({
  baseURL: 'http://localhost:8080/api/feedback',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the JWT to every request
feedbackApi.interceptors.request.use(
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
 * Gets all open feedback requests for a user
 * Matches: GET /api/feedback/user/{userId}
 */
export const getFeedbackRequests = (userId) => {
  return feedbackApi.get(`/user/${userId}`);
};

/**
 * Submits a new feedback entry
 * Assumed Matches: POST /api/feedback/submit
 * @param {object} feedbackData - { ticketId, rating, comment }
 */
export const submitFeedback = (feedbackData) => {
  return feedbackApi.post('/submit', feedbackData);
};