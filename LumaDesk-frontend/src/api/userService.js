// src/api/userService.js
import axios from 'axios';

// Create a client for the user service
// (I'll assume it's also on 8080, but update if it's different)
const userApi = axios.create({
  baseURL: 'http://localhost:8080/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Re-use the same interceptor logic to add the JWT
userApi.interceptors.request.use(
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
 * Changes the user's address.
 * Matches: POST /api/users/change-address
 * @param {object} addressData - { userId, address, area, pinCode }
 */
export const changeAddress = (addressData) => {
  return userApi.put('/change-address', addressData);
};

/**
 * Gets a user's full profile.
 * Matches: GET /api/users/get-profile/{userId}
 * @param {number} userId
 */
export const getUserProfile = (userId) => {
  return userApi.get(`/get-profile/${userId}`);
};

export default userApi;