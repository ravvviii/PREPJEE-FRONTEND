'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { getChapters } from '@/services/api/chapter.api';
import { getQuestions } from '@/services/api/question.api';
import { getBookmarks } from '@/services/api/bookmark.api';
import { getChapterAccuracy } from '@/services/api/attempt.api';

export function useChapterOverviewQuery({ chapterId, subjectId, classId }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CHAPTER_OVERVIEW, chapterId],
    queryFn: async () => {
      const [chapterPage, questionPage, accuracy, bookmarkPage] = await Promise.all([
        getChapters({ subjectId, classId, limit: 100 }),
        getQuestions({ chapterId, limit: 100 }),
        getChapterAccuracy(chapterId),
        getBookmarks({ limit: 100 }),
      ]);

      const chapter = chapterPage.items.find((item) => item.id === chapterId);
      if (!chapter) throw new Error('Chapter not found');

      const questions = questionPage.items;
      const questionIds = new Set(questions.map((question) => question.id));
      const bookmarkCount = bookmarkPage.items.filter((bookmark) =>
        questionIds.has(bookmark.questionId),
      ).length;

      return {
        chapter,
        questions,
        accuracy,
        bookmarkCount,
        pyqCount: questions.filter((question) => Boolean(question.yearId)).length,
      };
    },
    enabled: Boolean(chapterId && subjectId && classId),
  });
}
