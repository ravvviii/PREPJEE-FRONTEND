'use client';

export function ChapterPreviewList({ chapters }) {
  return (
    <div className="flex-1">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground">
        START WITH
      </p>

      <ul className="mt-3 divide-y divide-border">
        {chapters.map((chapter) => (
          <li
            key={chapter.name}
            className="flex items-center justify-between py-3 text-sm"
          >
            <span className="font-medium">{chapter.name}</span>
            <span className="text-muted-foreground">{chapter.questions} Q</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
