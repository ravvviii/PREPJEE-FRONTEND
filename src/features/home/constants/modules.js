import { BookOpen, Dumbbell, Bookmark, LineChart, FileClock, User, CreditCard } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const HOME_MODULES = [
  { key: 'subjects', label: 'Subjects', icon: BookOpen, href: null },
  { key: 'practice', label: 'Practice', icon: Dumbbell, href: null },
  { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark, href: null },
  { key: 'progress', label: 'Progress', icon: LineChart, href: null },
  { key: 'mock-tests', label: 'Mock Tests', icon: FileClock, href: null },
  { key: 'profile', label: 'Profile', icon: User, href: ROUTES.PROFILE },
  { key: 'subscription', label: 'Subscription', icon: CreditCard, href: null },
];
