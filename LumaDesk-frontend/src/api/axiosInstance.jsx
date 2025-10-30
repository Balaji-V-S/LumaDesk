import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* INTERCEPTOR (for later)
  When the user logs in, we'll get a token. We can store it 
  (e.g., in AuthContext or localStorage) and use an interceptor 
  to automatically add it to every future request.

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or get from context
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

export default axiosInstance;