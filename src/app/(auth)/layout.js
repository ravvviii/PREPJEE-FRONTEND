import { RequireGuest } from '@/components/common/route-guard';

export default function AuthLayout({ children }) {
  return (
    <RequireGuest>
      <main id="main-content" tabIndex={-1} className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
        {children}
      </main>
    </RequireGuest>
  );
}
