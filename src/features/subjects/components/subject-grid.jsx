import { cn } from '@/lib/utils';
import { SubjectCard } from './subject-card';

const COLUMN_CLASSES = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

export function SubjectGrid({ subjects, classes, onSelect }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2',
        COLUMN_CLASSES[subjects.length] ?? 'lg:grid-cols-3',
      )}
    >
      {classes.flatMap((classItem) =>
        subjects.map((subject) => (
          <SubjectCard
            key={`${subject.id}-${classItem.id}`}
            subject={subject}
            classItem={classItem}
            onSelect={onSelect}
          />
        )),
      )}
    </div>
  );
}
