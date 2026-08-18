'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleSignInButton } from './google-sign-in-button';
import { PhoneOtpForm } from './phone-otp-form';
import { EmailPasswordForm } from './email-password-form';

export function LoginCard() {
  const { loginWithGoogle } = useAuth();
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleGoogleCredential = async (idToken) => {
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle(idToken);
      toast.success('Logged in with Google');
    } catch (error) {
      toast.error(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to continue your JEE prep</p>
      </div>

      <div className="flex justify-center">
        <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isGoogleSubmitting} />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="mt-4">
          <EmailPasswordForm />
        </TabsContent>
        <TabsContent value="phone" className="mt-4">
          <PhoneOtpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
