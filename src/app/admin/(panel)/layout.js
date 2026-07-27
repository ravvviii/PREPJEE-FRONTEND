import { AdminGuard } from '@/features/admin/components/admin-guard';
import { AdminShell } from '@/features/admin/components/admin-shell';

export default function AdminPanelLayout({ children }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
