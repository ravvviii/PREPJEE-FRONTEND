'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import { addBookmark, getBookmarks, removeBookmark } from '@/services/api/bookmark.api';

export function useQuestionBookmarks() {
  const queryClient = useQueryClient();
  const bookmarksQuery = useQuery({
    queryKey: QUERY_KEYS.BOOKMARKS,
    queryFn: () => getBookmarks({ limit: 100 }),
  });

  const mutation = useMutation({
    mutationFn: ({ questionId, bookmarked }) =>
      bookmarked ? removeBookmark(questionId) : addBookmark(questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKMARKS });
      toast.success(variables.bookmarked ? 'Bookmark removed' : 'Question bookmarked');
    },
    onError: (error) => toast.error(error.message ?? 'Could not update bookmark'),
  });

  const bookmarkedIds = new Set(
    bookmarksQuery.data?.items.map((bookmark) => bookmark.questionId) ?? [],
  );

  return {
    bookmarkedIds,
    toggleBookmark: (questionId) =>
      mutation.mutate({ questionId, bookmarked: bookmarkedIds.has(questionId) }),
    isUpdating: mutation.isPending,
  };
}
