/**
 * Custom Hook: useApi
 * Fetches data from an API with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useApi = <T,>(
  url: string,
  options?: RequestInit
): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      await fetchData();
      if (cancelled) return;
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};


