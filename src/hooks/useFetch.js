import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

/**
 * Custom hook for data fetching
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Object} { data, loading, error, refetch }
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to manually refetch data
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useFetch;
