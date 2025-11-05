// src/api/authService.js
import axios from 'axios';

// Base instance for our API.
// Make sure your auth-service is running on port 8080
// or update this URL.
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor to add the JWT token to every request
 * after we've logged in.
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Logs in a user
 * @param {string} email - Corresponds to SignInRequest.email
 * @param {string} password - Corresponds to SignInRequest.password
 * @returns {Promise<axios.AxiosResponse<any>>} - The full response, data will be SignInResponse
 */
export const loginUser = (email, password) => {
  // Matches the SignInRequest DTO
  const signInRequest = { email, password };
  return apiClient.post('/login', signInRequest);
};

/**
 * Registers a new user
 * @param {object} signUpData - Matches the SignUpRequest DTO
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const registerUser = (signUpData) => {
  // signUpData should match the SignUpRequest DTO structure
  // { email, password, fullName, phoneNumber, address, area, pinCode }
  return apiClient.post('/register', signUpData);
};

/**
 * Resets a user's password.
 * Matches: POST /api/auth/reset-password
 * @param {object} passwordData - { email, oldPassword, newPassword }
 */
export const resetPassword = (passwordData) => {
  // Note: Your endpoint was 'localhost/', not 'localhost:8080/'.
  // I'll assume it's on the same apiClient as /login.
  // If not, we'll need to change the baseURL.
  return apiClient.post('/reset-password', passwordData);
};

export default apiClient;