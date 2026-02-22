import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// BASE URL (Production)
const API_URL = 'http://188.166.176.16:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Add Token to Requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error attaching token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR: Handle 401 (Logout)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('userToken');
      // Ideally, we'd trigger a logout action here (via Event or Context)
    }
    return Promise.reject(error);
  }
);

export default api;
