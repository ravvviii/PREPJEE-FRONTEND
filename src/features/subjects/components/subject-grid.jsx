import { SubjectCard } from './subject-card';

export function SubjectGrid({ subjects, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} onSelect={onSelect} />
      ))}
    </div>
  );
}
