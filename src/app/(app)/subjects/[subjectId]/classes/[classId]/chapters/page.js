import { ChapterBrowser } from '@/features/chapters/components/chapter-browser';

export default async function ChaptersPage({ params, searchParams }) {
  const { subjectId, classId } = await params;
  const { subject: subjectName = '', class: className = '' } = await searchParams;

  return (
    <ChapterBrowser
      subjectId={subjectId}
      classId={classId}
      subjectName={subjectName}
      className={className}
    />
  );
}
