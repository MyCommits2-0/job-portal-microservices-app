import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  updateTokens,
  logout,
} from "./authStorage";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8080/auth";

// Deliberately a bare axios call, not createApiClient(): refreshing the access
// token must never itself go through the interceptor below, or a 401 on the
// refresh call would try to refresh itself forever.
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(`${AUTH_API_BASE_URL}/refresh-token`, {
    refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data;

  updateTokens(accessToken, newRefreshToken);

  return accessToken;
}

let pendingRefresh = null;

/**
 * Builds an axios instance that attaches the stored access token to every
 * request and, on a single 401, transparently refreshes it once and retries
 * the original request. If the refresh itself fails, the local session is
 * cleared so route guards (ProtectedRoute) send the user back to /login.
 */
export function createApiClient(baseURL) {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const shouldAttemptRefresh =
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retriedAfterRefresh &&
        Boolean(getRefreshToken());

      if (!shouldAttemptRefresh) {
        return Promise.reject(error);
      }

      originalRequest._retriedAfterRefresh = true;

      try {
        if (!pendingRefresh) {
          pendingRefresh = refreshAccessToken().finally(() => {
            pendingRefresh = null;
          });
        }

        const newAccessToken = await pendingRefresh;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return client(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
  );

  return client;
}
