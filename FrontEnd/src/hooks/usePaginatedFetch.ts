import { useEffect, useState } from "react";
import { errorMessage } from "../api/client";

/**
 * Fetches the full list with `fetcher(filters)` and paginates it client-side.
 * Refetches and returns to page 1 whenever `filters` change.
 * Returns the current page's rows, total count, loading/error state and page controls.
 */
export const usePaginatedFetch = <T, F>(fetcher: (filters: F) => Promise<T[]>, filters: F, pageSize: number) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Reload data (and reset to the first page) whenever the filters change.
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPage(1);
    fetcher(filters)
      .then(setData)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, JSON.stringify(filters)]);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  return { pageData, total, loading, error, page, totalPages, setPage, start };
};
