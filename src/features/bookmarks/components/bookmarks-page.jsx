'use client';

import { useMemo, useState } from 'react';
import { Bookmark, Search } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BookmarkCard } from './bookmark-card';
import { useBookmarksQuery } from '../hooks/use-bookmarks-query';
import { removeBookmark } from '@/services/api/bookmark.api';
import { QUERY_KEYS } from '@/constants/query-keys';

export function BookmarksPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const queryClient = useQueryClient();
  const { data: bookmarks = [], isLoading, isError, error, refetch } = useBookmarksQuery();
  const removeMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKMARKS });
      toast.success('Bookmark removed');
    },
    onError: (mutationError) => toast.error(mutationError.message ?? 'Could not remove bookmark'),
  });

  const visibleBookmarks = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase();
    return bookmarks.filter(
      (bookmark) =>
        (difficulty === 'all' || bookmark.difficulty === difficulty) &&
        (!normalized ||
          bookmark.questionText?.toLocaleLowerCase().includes(normalized) ||
          bookmark.chapterName?.toLocaleLowerCase().includes(normalized)),
    );
  }, [bookmarks, difficulty, search]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/12 via-card to-card p-6 sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bookmark className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Your bookmarks</h1>
        <p className="mt-2 text-muted-foreground">Keep important questions close for focused revision.</p>
      </div>

      <div className="sticky top-20 z-20 flex flex-col gap-3 rounded-2xl border bg-background/90 p-3 backdrop-blur sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions or chapters..."
            className="h-10 pl-9"
          />
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="h-10 sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState title="Couldn't load bookmarks" description={error?.message} onRetry={refetch} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Bookmark questions during practice and they’ll appear here."
        />
      ) : visibleBookmarks.length === 0 ? (
        <EmptyState title="No matching bookmarks" description="Try changing your search or difficulty filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.bookmarkId}
              bookmark={bookmark}
              onRemove={removeMutation.mutate}
              isRemoving={removeMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
