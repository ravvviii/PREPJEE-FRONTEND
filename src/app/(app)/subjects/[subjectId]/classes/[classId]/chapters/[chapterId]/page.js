import { ChapterOverview } from '@/features/chapters/components/chapter-overview';

export default async function ChapterOverviewPage({ params, searchParams }) {
  const { subjectId, classId, chapterId } = await params;
  const {
    subject: subjectName = '',
    class: className = '',
    chapter: chapterName = '',
  } = await searchParams;

  return (
    <ChapterOverview
      subjectId={subjectId}
      classId={classId}
      chapterId={chapterId}
      subjectName={subjectName}
      className={className}
      chapterName={chapterName}
    />
  );
}
