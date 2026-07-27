import axios from 'axios';
import { env } from '@/config/env';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { useAuthStore } from '@/providers/auth-store';
import { getStoredItem, setStoredItem, removeStoredItem } from '@/utils/storage';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';
import { toApiError } from './api-error';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

export function unwrap(response) {
  return response.data.data;
}

apiClient.interceptors.request.use((config) => {
  // The instance defaults to JSON, but browser FormData must set its own
  // multipart Content-Type including the generated boundary. Keeping the
  // JSON header here makes Fastify report "the request is not multipart".
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }

  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Coalesces concurrent 401s onto a single in-flight refresh call instead of
// firing one refresh request per failed request.
let refreshPromise = null;

function refreshSession() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = useAuthStore.getState().refreshToken ?? getStoredItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) {
    return Promise.reject(new Error('No refresh token available'));
  }

  refreshPromise = axios
    .post(`${env.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, { refreshToken })
    .then(({ data }) => {
      const { accessToken, refreshToken: nextRefreshToken } = data.data;
      useAuthStore.getState().setSession({
        accessToken,
        refreshToken: nextRefreshToken,
        user: useAuthStore.getState().user,
      });
      setStoredItem(STORAGE_KEYS.REFRESH_TOKEN, nextRefreshToken);
      track(ANALYTICS_EVENTS.TOKEN_REFRESHED);
      return accessToken;
    })
    .catch((error) => {
      track(ANALYTICS_EVENTS.TOKEN_REFRESH_FAILED);
      useAuthStore.getState().clearSession();
      removeStoredItem(STORAGE_KEYS.REFRESH_TOKEN);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => {
    track(ANALYTICS_EVENTS.API_SUCCESS, { url: response.config.url, method: response.config.method });
    return response;
  },
  async (error) => {
    const { config, response } = error;
    const isRefreshCall = config?.url?.includes(API_ENDPOINTS.AUTH.REFRESH);

    if (response?.status === 401 && config && !config._retry && !isRefreshCall) {
      config._retry = true;
      try {
        const accessToken = await refreshSession();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(config);
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(toApiError(error));
      }
    }

    track(ANALYTICS_EVENTS.API_FAILURE, {
      url: config?.url,
      method: config?.method,
      status: response?.status,
      code: response?.data?.error?.code,
    });

    return Promise.reject(toApiError(error));
  },
);

export default apiClient;
