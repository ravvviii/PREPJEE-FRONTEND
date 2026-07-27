import { RequireGuest } from '@/components/common/route-guard';

export default function AuthLayout({ children }) {
  return (
    <RequireGuest>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
        {children}
      </div>
    </RequireGuest>
  );
}
