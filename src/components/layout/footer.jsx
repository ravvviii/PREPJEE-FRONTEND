import { env } from '@/config/env';

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <p>
        &copy; {new Date().getFullYear()} {env.appName}. Built for JEE aspirants.
      </p>
    </footer>
  );
}
