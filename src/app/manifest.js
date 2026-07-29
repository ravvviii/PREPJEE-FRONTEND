import { env } from '@/config/env';
import { THEME_COLORS } from '@/config/theme';

export default function manifest() {
  return {
    name: `${env.appName} — JEE Exam Preparation`,
    short_name: env.appName,
    description: 'Practice JEE questions, PYQs, and track your progress.',
    start_url: '/home',
    display: 'standalone',
    background_color: THEME_COLORS.external.background,
    theme_color: THEME_COLORS.external.primary,
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/app-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  };
}
