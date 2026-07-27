'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Camera,
  Check,
  CreditCard,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Pencil,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { useClassesQuery } from '@/features/classes/hooks/use-classes-query';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

function initials(name) {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

export function ProfileHub() {
  const { user, isLoading, updateUser, uploadAvatar, logout } = useAuth();
  const { data: classes = [] } = useClassesQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [classId, setClassId] = useState(user?.classId ?? '');
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef('');

  useEffect(() => {
    track(ANALYTICS_EVENTS.PROFILE_VIEWED);
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const selectedClass = useMemo(
    () => classes.find((classItem) => classItem.id === (isEditing ? classId : user?.classId)),
    [classId, classes, isEditing, user?.classId],
  );

  if (isLoading || !user) return <ProfileSkeleton />;

  const subscriptionActive = user.subscription?.status === 'active';
  const hasChanges =
    name.trim() !== (user.name ?? '') ||
    email.trim() !== (user.email ?? '') ||
    Boolean(avatarFile) ||
    classId !== (user.classId ?? '');

  function resetForm() {
    setName(user.name ?? '');
    setEmail(user.email ?? '');
    setAvatarUrl(user.avatarUrl ?? '');
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = '';
    setAvatarPreview('');
    setAvatarFile(null);
    setClassId(user.classId ?? '');
  }

  function handleAvatarSelection(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Choose a JPEG, PNG, or WebP image');
      event.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Avatar must be smaller than 10MB');
      event.target.value = '';
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const preview = URL.createObjectURL(file);
    previewUrlRef.current = preview;
    setAvatarPreview(preview);
    setAvatarFile(file);
  }

  function cancelEditing() {
    resetForm();
    setIsEditing(false);
  }

  async function handleSave(event) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName) {
      toast.error('Please enter your name');
      return;
    }
    setIsSaving(true);
    try {
      let updated = await updateUser({
        name: cleanName,
        ...(cleanEmail ? { email: cleanEmail } : {}),
        ...(classId ? { classId } : {}),
      });
      if (avatarFile) {
        updated = await uploadAvatar(avatarFile);
        setAvatarUrl(updated.avatarUrl ?? '');
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = '';
        setAvatarPreview('');
        setAvatarFile(null);
      }
      track(ANALYTICS_EVENTS.PROFILE_UPDATED, {
        changedName: cleanName !== (user.name ?? ''),
        changedEmail: cleanEmail !== (user.email ?? ''),
        changedAvatar: Boolean(avatarFile),
        changedClass: classId !== (user.classId ?? ''),
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message ?? 'Could not update your profile');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/15 via-card to-card p-6 sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative w-fit">
            <Avatar className="size-24 shadow-lg ring-4 ring-background">
              <AvatarImage
                src={(isEditing ? avatarPreview || avatarUrl : user.avatarUrl) || undefined}
                alt={user.name ?? 'User'}
              />
              <AvatarFallback className="text-2xl font-semibold">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
              {isEditing ? <Camera className="size-4" /> : <Check className="size-4" />}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">{user.name ?? 'PrepJEE Student'}</h1>
              <Badge className={subscriptionActive ? 'bg-success/10 text-success' : ''} variant="secondary">
                {subscriptionActive ? 'Premium' : 'Free plan'}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {user.email ?? user.phone ?? 'Complete your account details'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {selectedClass && <Badge variant="outline">{selectedClass.name}</Badge>}
              <Badge variant="outline">{user.stats?.totalAttempts ?? 0} attempts</Badge>
              <Badge variant="outline">{user.stats?.accuracyPercent ?? 0}% accuracy</Badge>
            </div>
          </div>
          <Button
            variant={isEditing ? 'outline' : 'default'}
            onClick={() => (isEditing ? cancelEditing() : setIsEditing(true))}
          >
            {isEditing ? <RotateCcw /> : <Pencil />}
            {isEditing ? 'Cancel editing' : 'Edit profile'}
          </Button>
        </div>
      </motion.section>

      <Tabs defaultValue="profile">
        <TabsList className="h-10 w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="profile" className="px-4">
            <User /> Profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className="px-4">
            <CreditCard /> Subscription
          </TabsTrigger>
          <TabsTrigger value="account" className="px-4">
            <LockKeyhole /> Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Personal information</CardTitle>
                <CardDescription>Keep your profile and learning preferences up to date.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full name</Label>
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={!isEditing}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email address</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={!isEditing}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Label htmlFor="profile-avatar">Profile photo</Label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          JPEG, PNG up to 10MB.
                        </p>
                        {avatarFile && (
                          <p className="mt-2 text-xs font-medium text-primary">{avatarFile.name}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          id="profile-avatar"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleAvatarSelection}
                          disabled={!isEditing}
                          className="sr-only"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={!isEditing}
                        >
                          <Camera /> Choose image
                        </Button>
                        {avatarFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
                              previewUrlRef.current = '';
                              setAvatarPreview('');
                              setAvatarFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current class</Label>
                    <Select value={classId} onValueChange={setClassId} disabled={!isEditing}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((classItem) => (
                          <SelectItem key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isEditing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 border-t pt-5">
                      <Button type="submit" disabled={!hasChanges || isSaving}>
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        {isSaving ? 'Saving…' : 'Save changes'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={resetForm} disabled={!hasChanges || isSaving}>
                        Reset
                      </Button>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Your lifetime practice statistics.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="size-4 text-primary" /> Accuracy
                      </span>
                      <span className="font-semibold">{user.stats?.accuracyPercent ?? 0}%</span>
                    </div>
                    <Progress className="mt-2" value={user.stats?.accuracyPercent ?? 0} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xl font-bold">{user.stats?.totalAttempts ?? 0}</p>
                      <p className="text-xs text-muted-foreground">Total attempts</p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xl font-bold">{user.stats?.correctAttempts ?? 0}</p>
                      <p className="text-xs text-muted-foreground">Correct answers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Review your PrepJEE access and renewal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge className={subscriptionActive ? 'bg-success text-success-foreground' : ''}>
                      {subscriptionActive ? 'Active' : 'No active subscription'}
                    </Badge>
                    <h2 className="mt-3 text-xl font-semibold">
                      {subscriptionActive ? 'PrepJEE Premium' : 'PrepJEE Free'}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subscriptionActive && user.subscription.expiresAt
                        ? `Your access is active until ${formatDate(user.subscription.expiresAt)}.`
                        : 'You currently have access to the free learning experience.'}
                    </p>
                  </div>
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <CreditCard className="size-7" />
                  </div>
                </div>
                {!subscriptionActive && (
                  <Button className="mt-6" disabled>
                    Upgrade available in Phase 12
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account details</CardTitle>
                <CardDescription>Your login identity and account preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border p-4">
                  <Phone className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{user.phone ?? 'Google account'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border p-4">
                  <Mail className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email ?? 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border p-4">
                  <ShieldCheck className="size-5 text-success" />
                  <div>
                    <p className="text-sm font-medium">Account security</p>
                    <p className="text-sm text-muted-foreground">Authentication managed securely by PrepJEE.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Adjust how PrepJEE looks and manage this session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="text-sm font-medium">Appearance</p>
                    <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                  </div>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-destructive/20 p-4">
                  <div>
                    <p className="text-sm font-medium">Sign out</p>
                    <p className="text-xs text-muted-foreground">End your current PrepJEE session.</p>
                  </div>
                  <Button variant="destructive" onClick={() => setLogoutOpen(true)}>
                    <LogOut /> Log out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out of PrepJEE?"
        description="You’ll need to sign in again to continue your preparation."
        confirmLabel="Log out"
        destructive
        onConfirm={logout}
      />
    </div>
  );
}
