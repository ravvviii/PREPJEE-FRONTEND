import './globals.css';
import { Providers } from '@/providers/providers';
import { env } from '@/config/env';

export const metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: `${env.appName} — JEE Exam Preparation`,
    template: `%s | ${env.appName}`,
  },
  description: 'Practice JEE questions and PYQs, track accuracy, build streaks, and improve weak chapters.',
  applicationName: env.appName,
  keywords: ['JEE preparation', 'JEE Main', 'JEE Advanced', 'JEE PYQs', 'exam practice'],
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: env.appName,
    title: `${env.appName} — JEE Exam Preparation`,
    description: 'Practice questions, track progress, and prepare smarter for JEE.',
  },
  twitter: {
    card: 'summary',
    title: `${env.appName} — JEE Exam Preparation`,
    description: 'Practice questions, track progress, and prepare smarter for JEE.',
  },
  appleWebApp: { capable: true, title: env.appName, statusBarStyle: 'default' },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="fixed top-2 left-2 z-[100] -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
