import { env } from '@/config/env';

export default function manifest() {
  return {
    name: `${env.appName} — JEE Exam Preparation`,
    short_name: env.appName,
    description: 'Practice JEE questions, PYQs, and track your progress.',
    start_url: '/home',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#6366f1',
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
