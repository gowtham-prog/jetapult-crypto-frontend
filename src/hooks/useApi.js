import { useState, useCallback, useEffect } from "react";

const useApi = (apiFn, immediate = false, ...initialArgs) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setData(null); // Reset data state for each new call
      try {
        const response = await apiFn(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        console.error("API error:", err);
        const standardized = err.standardized || {
          message: err.response?.data?.message || err.message,
          status: err.response?.status ?? 0,
          data: err.response?.data ?? null,
        };
        setError(standardized);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFn]
  );

  useEffect(() => {
    if (immediate) {
      execute(...initialArgs);
    }
  }, [immediate, ...initialArgs]);

  return { data, loading, error, execute, setData };
};

export default useApi;
