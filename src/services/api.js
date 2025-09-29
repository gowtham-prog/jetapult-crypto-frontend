import axios from "axios";

const TOKEN_KEY = "access_token";

// Centralized token manager used by both API and auth hook
export const TokenManager = {
  getToken() {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(TOKEN_KEY) || "";
    } catch {
      return "";
    }
  },
  setToken(token) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      // Notify listeners
      window.dispatchEvent(new CustomEvent("auth:token", { detail: token }));
    } catch {}
  },
  clearToken() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent("auth:token", { detail: "" }));
    } catch {}
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
  }
});

// Attach Authorization header from TokenManager
api.interceptors.request.use((config) => {
  const token = TokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const standardized = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status ?? 0,
      data: error.response?.data ?? null,
    };
    error.standardized = standardized;
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = (data) => api.post("/apis/v1/register/", data);
export const getToken = (data) => api.post("/api/token/", data);
export const verifyToken = (token) => api.post("/api/token/verify/", { token });

// Business endpoints
export const getCoins = () => api.get("/apis/v1/coins/top");
export const getCoinHistory = (coinId) =>
  api.get(`/apis/v1/coins/${coinId}/history/?_=${new Date().getTime()}`);

export const chatQuery = (query) =>
  api.post("/apis/v1/qa/", { query });

export const postFavorite = (coinId) =>
  api.post("/apis/v1/favorites/", { coin: coinId });

export const getFavorites = () => api.get("/apis/v1/favorites/");
export const deleteFavorite = (favoriteId) =>
  api.delete(`/apis/v1/favorites/${favoriteId}/`);

export default api;