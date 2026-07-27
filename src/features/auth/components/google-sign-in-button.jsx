'use client';

import { useCallback, useRef } from 'react';
import Script from 'next/script';
import { env } from '@/config/env';

// Renders Google's own hosted Sign-In button via the Google Identity
// Services SDK and forwards the resulting ID token — the frontend never
// touches Google credentials directly, it just relays the ID token to
// POST /auth/google for the backend to verify.
export function GoogleSignInButton({ onCredential, disabled }) {
  const buttonRef = useRef(null);
  const initialized = useRef(false);

  const renderButton = useCallback(() => {
    if (initialized.current || typeof window === 'undefined' || !window.google || !buttonRef.current) {
      return;
    }
    if (!env.googleClientId) return;
    initialized.current = true;
    window.google.accounts.id.initialize({
      client_id: env.googleClientId,
      callback: (response) => onCredential(response.credential),
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'continue_with',
    });
  }, [onCredential]);

  if (!env.googleClientId) {
    return (
      <p className="rounded-md border border-dashed p-3 text-center text-sm text-muted-foreground">
        Google Sign-In is not configured.
      </p>
    );
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={renderButton} />
      <div ref={buttonRef} className={disabled ? 'pointer-events-none opacity-50' : ''} />
    </>
  );
}
