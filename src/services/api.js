import axios from 'axios';
import { SERVER_URL } from '../config';
import { getFromStorage } from '../controllers/storageController';

// Create axios instance with default config
const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(async (config) => {
  const { user } = await getFromStorage('user');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
};

export const userAPI = {
  getMe: async () => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        chrome.storage.local.clear();
      }
      throw error;
    }
  },
};

export const translationAPI = {
  translate: async (text, { reverse = false, detectLang = false, fromLang, toLang }) => {
    try {
      const data = {
        text,
        targetLanguage: reverse ? toLang || 'English' : fromLang || 'French',
        sourceLanguage: reverse ? fromLang || 'French' : toLang || 'English',
      };

      if (detectLang) {
        data.sourceLanguage = null;
      }

      const response = await api.post('/translate', data);
      return response.data;
    } catch (error) {
      console.error('Translation error:', error);
      return error?.response?.data || null;
    }
  },
}; 