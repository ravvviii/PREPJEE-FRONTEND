import { ClassCard } from './class-card';

export function ClassGrid({ classes, selectedClassId, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <ClassCard
          key={classItem.id}
          classItem={classItem}
          isActive={selectedClassId === classItem.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
