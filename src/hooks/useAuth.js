// useAuth.js
import { useState, useCallback, useEffect } from "react";
import { getToken as apiGetToken, TokenManager, verifyToken } from "../services/api";

export default function useAuth() {
  const [token, setTokenState] = useState(TokenManager.getToken());
  const [authenticated, setAuthenticated] = useState(!!TokenManager.getToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync token changes across tabs and other parts of the app
  useEffect(() => {
    function handleTokenEvent(e) {
      const nextToken = e?.detail || "";
      setTokenState(nextToken);
      setAuthenticated(!!nextToken);
    }
    window.addEventListener("auth:token", handleTokenEvent);
    return () => window.removeEventListener("auth:token", handleTokenEvent);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiGetToken(credentials); // POST /api/token/
      const newToken = response.data?.access || response.data?.token || "";
      if (newToken) {
        TokenManager.setToken(newToken);
        setTokenState(newToken);
        setAuthenticated(true);
        return { ok: true };
      }
      return { ok: false, message: "No token returned" };
    } catch (err) {
      const message = err.standardized?.message || err.response?.data || err.message;
      setError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    TokenManager.clearToken();
    setTokenState("");
    setAuthenticated(false);
  }, []);

  const check = useCallback(async () => {
    const current = TokenManager.getToken();
    if (!current) {
      setAuthenticated(false);
      return false;
    }
    try {
      await verifyToken(current);
      setAuthenticated(true);
      return true;
    } catch {
      TokenManager.clearToken();
      setAuthenticated(false);
      return false;
    }
  }, []);

  return {
    token,
    authenticated,
    loading,
    error,
    login,
    logout,
    check,
  };
}
