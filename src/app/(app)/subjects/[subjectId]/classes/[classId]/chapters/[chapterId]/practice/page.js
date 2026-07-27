import { QuestionEngine } from '@/features/questions/components/question-engine';

export default async function PracticePage({ params, searchParams }) {
  const { subjectId, classId, chapterId } = await params;
  const {
    subject: subjectName = '',
    class: className = '',
    chapter: chapterName = '',
    mode = 'practice',
  } = await searchParams;

  return (
    <QuestionEngine
      subjectId={subjectId}
      classId={classId}
      chapterId={chapterId}
      subjectName={subjectName}
      className={className}
      chapterName={chapterName}
      pyqOnly={mode === 'pyq'}
    />
  );
}
