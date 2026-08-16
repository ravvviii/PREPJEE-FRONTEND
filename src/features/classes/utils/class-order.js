// Backend order isn't guaranteed to match the natural progression students
// expect — pin the common tracks first, anything else keeps its incoming order after.
const CLASS_ORDER = ['class 11', 'class 12', 'dropper'];

export function sortClasses(classes) {
  return [...classes].sort((a, b) => {
    const rankA = CLASS_ORDER.indexOf(a.name.trim().toLowerCase());
    const rankB = CLASS_ORDER.indexOf(b.name.trim().toLowerCase());
    return (rankA === -1 ? CLASS_ORDER.length : rankA) - (rankB === -1 ? CLASS_ORDER.length : rankB);
  });
}

export function excludeDropper(classes) {
  return classes.filter((classItem) => classItem.name.trim().toLowerCase() !== 'dropper');
}
