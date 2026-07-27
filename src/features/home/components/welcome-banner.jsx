import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SUBSCRIPTION_BADGE } from '../constants/subscription-status';

function initialsOf(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function WelcomeBanner({ user }) {
  const badge = SUBSCRIPTION_BADGE[user?.subscription?.status ?? 'none'];

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? 'You'} />
          <AvatarFallback className="text-lg">{initialsOf(user?.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="text-2xl font-bold">{user?.name || user?.phone || 'Student'}</h1>
        </div>
      </div>
      <Badge className={badge.className}>{badge.label}</Badge>
    </div>
  );
}
