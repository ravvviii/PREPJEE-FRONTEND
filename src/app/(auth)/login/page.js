import { GraduationCap, Target, TrendingUp } from 'lucide-react';
import { LoginCard } from '@/features/auth/components/login-card';
import { LoginPageAnalytics } from '@/features/auth/components/login-page-analytics';
import { env } from '@/config/env';

export const metadata = {
  title: `Log in — ${env.appName}`,
};

const BENEFITS = [
  {
    icon: GraduationCap,
    title: 'Full JEE syllabus',
    description: 'Physics, Chemistry & Maths, chapter by chapter.',
  },
  {
    icon: Target,
    title: 'Real PYQs',
    description: "Practice with previous years' questions, not guesswork.",
  },
  {
    icon: TrendingUp,
    title: 'Track your progress',
    description: 'See accuracy, streaks, and weak chapters at a glance.',
  },
];

export default function LoginPage() {
  return (
    <>
      <LoginPageAnalytics />
      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="hidden flex-col gap-8 lg:flex">
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Built for JEE aspirants
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Prepare smarter for JEE with {env.appName}
            </h1>
            <p className="text-muted-foreground">
              Practice real questions, track your accuracy, and stay consistent — all in one place.
            </p>
          </div>
          <div className="space-y-5">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <LoginCard />
        </div>
      </div>
    </>
  );
}
