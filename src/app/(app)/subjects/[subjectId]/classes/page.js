import { ClassBrowser } from '@/features/classes/components/class-browser';

export default async function ClassesPage({ params, searchParams }) {
  const { subjectId } = await params;
  const { subject: subjectName = '' } = await searchParams;

  return <ClassBrowser subjectId={subjectId} subjectName={subjectName} />;
}
