import { AdminAuthProvider } from '@/features/admin/context/admin-auth-context';

export default function AdminLayout({ children }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
