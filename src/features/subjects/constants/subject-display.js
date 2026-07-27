import { Atom, Beaker, BookOpen, Calculator, Dna, FlaskConical, Languages, Sigma } from 'lucide-react';

const SUBJECT_DISPLAY = {
  physics: {
    icon: Atom,
    description: 'Explore mechanics, electricity, optics, and more.',
    accent: 'from-blue-500/20 to-cyan-500/5 text-blue-600 dark:text-blue-400',
  },
  chemistry: {
    icon: FlaskConical,
    description: 'Master physical, organic, and inorganic chemistry.',
    accent: 'from-emerald-500/20 to-teal-500/5 text-emerald-600 dark:text-emerald-400',
  },
  mathematics: {
    icon: Sigma,
    description: 'Practice algebra, calculus, geometry, and more.',
    accent: 'from-violet-500/20 to-fuchsia-500/5 text-violet-600 dark:text-violet-400',
  },
  maths: {
    icon: Calculator,
    description: 'Practice algebra, calculus, geometry, and more.',
    accent: 'from-violet-500/20 to-fuchsia-500/5 text-violet-600 dark:text-violet-400',
  },
  biology: {
    icon: Dna,
    description: 'Study living systems from cells to ecosystems.',
    accent: 'from-lime-500/20 to-green-500/5 text-green-600 dark:text-green-400',
  },
  english: {
    icon: Languages,
    description: 'Strengthen language, comprehension, and communication.',
    accent: 'from-amber-500/20 to-orange-500/5 text-amber-600 dark:text-amber-400',
  },
  science: {
    icon: Beaker,
    description: 'Build strong scientific concepts through practice.',
    accent: 'from-cyan-500/20 to-sky-500/5 text-cyan-600 dark:text-cyan-400',
  },
};

const FALLBACK = {
  icon: BookOpen,
  description: 'Explore concepts and sharpen your problem-solving skills.',
  accent: 'from-primary/20 to-primary/5 text-primary',
};

export function getSubjectDisplay(name = '') {
  return SUBJECT_DISPLAY[name.trim().toLowerCase()] ?? FALLBACK;
}
