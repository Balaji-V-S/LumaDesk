// src/api/notificationService.js
import axios from 'axios';

// Create a dedicated API client for the notification service
const notificationApi = axios.create({
  baseURL: 'http://localhost:8080/api/notifications',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the JWT to every request
notificationApi.interceptors.request.use(
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
 * Gets all notifications for a user.
 * Matches: GET /api/notifications/user/{userId}
 * @param {string} userId - The user's ID, as a string.
 */
export const getNotificationsByUserId = (userId) => {
  return notificationApi.get(`/user/${userId}`);
};