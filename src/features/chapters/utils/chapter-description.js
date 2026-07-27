const DESCRIPTIONS = {
  Thermodynamics:
    'Understand heat, work, energy transfer, and the laws that govern physical and chemical systems.',
  Electrochemistry:
    'Explore chemical reactions that produce electricity and the electrical energy that drives chemical change.',
  'Structure of Atom':
    'Build a clear picture of atomic models, electronic configuration, quantum numbers, and atomic spectra.',
  Hydrocarbons:
    'Study the structure, properties, preparation, and reactions of alkanes, alkenes, alkynes, and aromatics.',
  'Current Electricity':
    'Master electric current, resistance, circuits, Kirchhoff’s laws, and practical electrical measurements.',
  'Laws of Motion':
    'Apply Newton’s laws, friction, and force analysis to understand how objects move and interact.',
  'Relations and Functions':
    'Learn how quantities relate through mappings, domains, ranges, composition, and different function types.',
};

export function getChapterDescription(chapterName, subjectName) {
  return (
    DESCRIPTIONS[chapterName] ??
    `Build a strong understanding of ${chapterName} through ${subjectName} concepts, solved examples, previous-year questions, and focused practice.`
  );
}
