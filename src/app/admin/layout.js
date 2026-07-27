import { AdminAuthProvider } from '@/features/admin/context/admin-auth-context';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
