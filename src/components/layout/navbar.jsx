'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Lock, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { env } from '@/config/env';
import { NAVBAR_MODULES } from '@/features/home/constants/modules';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/use-theme-colors';

function initialsOf(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function NavbarModuleLink({ module, activePath, onSelect, className }) {
  const label = module.nav?.label ?? module.label;
  const isActive = module.href && (activePath === module.href || activePath.startsWith(`${module.href}/`));
  const Icon = module.icon

  const sharedClassName = cn(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors',
    ' hover:text-foreground',
    isActive && 'bg-muted text-foreground',
    !module.href && 'cursor-not-allowed opacity-60 hover:bg-transparent hover:text-muted-foreground',
    className
  );

  const content = (
    <>
      {Icon &&<Icon className="h-4 w-4" />}
      <span>{label}</span>
      {!module.href && <Lock className="h-3.5 w-3.5" aria-label="Coming soon" />}
    </>
  );

  if (!module.href) {
    return (
      <div className={sharedClassName} title="Coming soon" aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={module.href}
      className={sharedClassName}
      onClick={() => {
        track(ANALYTICS_EVENTS.MODULE_CARD_CLICKED, { module: module.key, source: 'navbar' });
        onSelect?.();
      }}
    >
      {content}
    </Link>
  );
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { bgColor } = useThemeColors();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    style={bgColor('HomeBG')}
     >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN} className="text-lg font-bold text-primary">
          {env.appName}
        </Link>

        {isAuthenticated && (
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
            {NAVBAR_MODULES.map((module) => (
              <NavbarModuleLink key={module.key} module={module} activePath={pathname} />
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? 'User'} />
                    <AvatarFallback>{initialsOf(user?.name)}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[10rem] truncate">{user?.name ?? user?.phone ?? 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={ROUTES.PROFILE}
                    onClick={() => track(ANALYTICS_EVENTS.PROFILE_VIEWED, { source: 'navbar' })}
                  >
                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    track(ANALYTICS_EVENTS.LOGOUT, { source: 'navbar' });
                    logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href={ROUTES.LOGIN}>Log in</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{env.appName}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4">
                {isAuthenticated ? (
                  <>
                    <nav className="flex flex-col gap-1" aria-label="Main navigation">
                      {NAVBAR_MODULES.map((module) => (
                        <NavbarModuleLink
                          key={module.key}
                          module={module}
                          activePath={pathname}
                          onSelect={() => setMobileOpen(false)}
                          className="justify-start"
                        />
                      ))}
                    </nav>
                    <div className="my-2 h-px bg-border" />
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href={ROUTES.PROFILE} onClick={() => setMobileOpen(false)}>
                        <UserIcon className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  </>
                ) : (
                  <Button asChild>
                    <Link href={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
