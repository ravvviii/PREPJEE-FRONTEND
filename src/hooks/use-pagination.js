'use client';

import { useCallback, useMemo, useState } from 'react';

// Simple page-index pagination for offset-based lists (e.g. admin tables).
// Cursor-paginated feature lists use TanStack Query's useInfiniteQuery
// directly instead — this hook is for classic "page N of M" UIs.
export function usePagination({ initialPage = 1, pageSize = 20, totalItems = 0 } = {}) {
  const [page, setPage] = useState(initialPage);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);

  const nextPage = useCallback(() => setPage((p) => Math.min(p + 1, totalPages)), [totalPages]);
  const previousPage = useCallback(() => setPage((p) => Math.max(p - 1, 1)), []);
  const goToPage = useCallback((target) => setPage(Math.min(Math.max(target, 1), totalPages)), [totalPages]);
  const reset = useCallback(() => setPage(initialPage), [initialPage]);

  return {
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPage,
    previousPage,
    goToPage,
    reset,
  };
}
