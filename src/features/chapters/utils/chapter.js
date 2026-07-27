export function getChapterDifficulty(chapter) {
  const counts = chapter.difficultyCounts ?? {};
  const ranked = [
    ['hard', counts.hard ?? 0],
    ['medium', counts.medium ?? 0],
    ['easy', counts.easy ?? 0],
  ].sort((a, b) => b[1] - a[1]);

  return ranked[0][1] > 0 ? ranked[0][0] : null;
}

export const DIFFICULTY_STYLES = {
  easy: 'bg-success/10 text-success',
  medium: 'bg-warning/15 text-warning-foreground',
  hard: 'bg-destructive/10 text-destructive',
};
