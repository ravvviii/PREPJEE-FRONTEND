'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  BookCopy,
  BookOpen,
  Boxes,
  CircleHelp,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '../context/admin-auth-context';

const NAV = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Subjects', '/admin/subjects', BookOpen],
  ['Classes', '/admin/classes', GraduationCap],
  ['Chapters', '/admin/chapters', BookCopy],
  ['Questions', '/admin/questions', CircleHelp],
  ['Options', '/admin/options', ListChecks],
  ['Solutions', '/admin/solutions', Boxes],
  ['Users', '/admin/users', Users],
  ['Subscription Plans', '/admin/subscription-plans', CreditCard],
  ['Analytics', '/admin/analytics', BarChart3],
];

function Navigation({ onNavigate }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {NAV.map(([label, href, Icon]) => {
        const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
        return (
          <Button
            key={href}
            variant={active ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start', active && 'text-primary')}
            asChild
          >
            <Link href={href} onClick={onNavigate}>
              <Icon /> {label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }) {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/admin/login');
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background p-4 lg:block">
        <Link href="/admin" className="mb-8 block px-2 text-xl font-bold text-primary">
          PrepJEE Admin
        </Link>
        <Navigation />
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>PrepJEE Admin</SheetTitle>
                </SheetHeader>
                <div className="px-4">
                  <Navigation />
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm font-medium">{admin?.name}</p>
              <p className="text-xs text-muted-foreground">{admin?.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Admin logout">
              <LogOut />
            </Button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
