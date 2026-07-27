'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import { addBookmark, getBookmarks, removeBookmark } from '@/services/api/bookmark.api';
import { FEATURES } from '@/features/paywall/config/entitlement-policy';
import { usePaywall } from '@/features/paywall/providers/paywall-provider';

export function useQuestionBookmarks() {
  const queryClient = useQueryClient();
  const { canAccess, triggerPaywall } = usePaywall();
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

  const toggleBookmark = (questionId) => {
    const bookmarked = bookmarkedIds.has(questionId);

    // Existing bookmarks can always be removed. Adding a new bookmark follows
    // the centralized entitlement policy and resumes automatically after payment.
    if (!bookmarked && !canAccess(FEATURES.BOOKMARKS).allowed) {
      triggerPaywall({
        feature: FEATURES.BOOKMARKS,
        source: 'question_bookmark',
        metadata: { questionId },
        onSuccess: () => mutation.mutate({ questionId, bookmarked: false }),
      });
      return;
    }

    mutation.mutate({ questionId, bookmarked });
  };

  return {
    bookmarkedIds,
    toggleBookmark,
    isUpdating: mutation.isPending,
  };
}
