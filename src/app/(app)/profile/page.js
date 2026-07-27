'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    track(ANALYTICS_EVENTS.PROFILE_VIEWED);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return <ProfileForm user={user} />;
}

// Only mounts once `user` is guaranteed available, so name/email can seed
// straight from it — no effect needed to sync state from a prop.
function ProfileForm({ user }) {
  const { updateUser } = useAuth();
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({ name, email: email || undefined });
      track(ANALYTICS_EVENTS.PROFILE_UPDATED);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Could not update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={user.phone ?? '—'} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
