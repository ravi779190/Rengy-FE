import axios from 'axios';
import { getAccessToken, setAccessToken, triggerLogout } from './tokenStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  withCredentials: true, // send the httpOnly refresh cookie
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (!response || response.status !== 401 || config._retry || config.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true })
          .finally(() => {
            refreshPromise = null;
          });
      }
      const { data } = await refreshPromise;
      setAccessToken(data.accessToken);
      config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(config);
    } catch (refreshError) {
      triggerLogout();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
