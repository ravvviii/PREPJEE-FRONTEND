import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';
import { env } from '@/config/env';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: `${env.appName} — JEE Exam Preparation`,
  description: 'Practice questions, track progress, and prepare for JEE with PrepJEE.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
