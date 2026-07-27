import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center px-6"
    >
      <section className="max-w-md text-center" aria-labelledby="offline-title">
        <WifiOff className="mx-auto size-12 text-muted-foreground" aria-hidden="true" />
        <h1 id="offline-title" className="mt-5 text-3xl font-bold">
          You&apos;re offline
        </h1>
        <p className="mt-3 text-muted-foreground">
          Reconnect to continue practising and syncing your progress.
        </p>
        <Button asChild className="mt-6">
          <Link href="/home">Try again</Link>
        </Button>
      </section>
    </main>
  );
}
