/**
 * Custom Hook: usePagination
 * Handles pagination with infinite scroll
 */

import { useState, useCallback, useEffect } from 'react';

interface UsePaginationOptions<T> {
  fetchFn: (page: number) => Promise<T[]>;
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const usePagination = <T,>({
  fetchFn,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions<T>): UsePaginationResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newData = await fetchFn(page);

      if (newData.length < pageSize) {
        setHasMore(false);
      }

      setData((prev) => (page === initialPage ? newData : [...prev, ...newData]));
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFn, pageSize, initialPage]);

  const refresh = useCallback(async () => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    await loadMore();
  }, [initialPage, loadMore]);

  useEffect(() => {
    loadMore();
  }, []); // Only run on mount

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};


