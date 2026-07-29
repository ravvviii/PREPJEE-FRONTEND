export const progress = {
  questionsSolved: 0,
  accuracy: null,
  chaptersCovered: 0,
  totalChapters: 90,
  mocksAttempted: 0,
  totalMocks: 24,
  locked: true,
  subjects: [
    { subject: 'Physics', color: 'blue', completed: 0, total: 29 },
    { subject: 'Chemistry', color: 'green', completed: 0, total: 31 },
    { subject: 'Mathematics', color: 'orange', completed: 0, total: 30 },
  ],
  weeklyActivity: [false, false, false, false, false, false, false],
};

export const subjectsOverview = {
  locked: true,
  subjects: [
    {
      id: 'physics',
      name: 'Physics',
      color: 'blue',
      totalChapters: 29,
      totalQuestions: 4120,
      chaptersCovered: 0,
      previewChapters: [
        { name: 'Kinematics', questions: 210 },
        { name: 'Laws of Motion', questions: 185 },
        { name: 'Rotational Motion', questions: 240 },
      ],
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      color: 'green',
      totalChapters: 31,
      totalQuestions: 4380,
      chaptersCovered: 0,
      previewChapters: [
        { name: 'Some Basic Concepts', questions: 128 },
        { name: 'Atomic Structure', questions: 140 },
        { name: 'Chemical Bonding', questions: 225 },
      ],
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      color: 'orange',
      totalChapters: 30,
      totalQuestions: 3900,
      chaptersCovered: 0,
      previewChapters: [
        { name: 'Quadratic Equations', questions: 190 },
        { name: 'Sequences & Series', questions: 175 },
        { name: 'Straight Lines', questions: 205 },
      ],
    },
  ],
};
