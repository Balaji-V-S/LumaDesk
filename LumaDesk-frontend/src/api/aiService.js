// src/api/aiService.js
import axios from 'axios';

const aiApi = axios.create({
  baseURL: 'http://localhost:8080/api/ai-agent',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the JWT to every request
aiApi.interceptors.request.use(
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
 * Checks the health of the AI model
 * Matches: GET /api/ai-agent/health
 */
export const getAiHealth = () => {
  return aiApi.get('/health');
};

/**
 * Sends a chat message to the AI
 * Matches: POST /api/ai-agent/
 * @param {object} chatData - { role, previousContext, query }
 */
export const aiChat = (chatData) => {
  // We post to the root '/' because the baseURL is already /api/ai-agent
  return aiApi.post('/', chatData);
};