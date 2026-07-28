import { BookOpen, Dumbbell, Bookmark, LineChart, FileClock, User, CreditCard } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const HOME_MODULES = [
  { key: 'overview', label: 'Overview', href: ROUTES.HOME, nav: { show: true } },
  { key: 'subjects', label: 'Subjects', icon: BookOpen, href: ROUTES.SUBJECTS, nav: { show: true } },
  { key: 'mock-tests', label: 'Mock Tests', icon: FileClock, href: null, nav: { show: true, label: 'Mock Tests' } },
  { key: 'practice', label: 'Practice', icon: Dumbbell, href: null, nav: { show: true } },
  { key: 'progress', label: 'Progress', icon: LineChart, href: ROUTES.PROGRESS, nav: { show: true } },
];

export const NAVBAR_MODULES = HOME_MODULES.filter((module) => module.nav?.show);
