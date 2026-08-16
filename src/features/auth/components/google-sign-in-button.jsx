'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { env } from '@/config/env';

// Renders Google's own hosted Sign-In button via the Google Identity
// Services SDK and forwards the resulting ID token — the frontend never
// touches Google credentials directly, it just relays the ID token to
// POST /auth/google for the backend to verify.
export function GoogleSignInButton({ onCredential, disabled }) {
  const buttonRef = useRef(null);
  const initialized = useRef(false);
  const [nativeGoogleAuth, setNativeGoogleAuth] = useState(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const capacitor = window.Capacitor;
      if (capacitor?.getPlatform?.() === 'android' && capacitor.Plugins?.NativeGoogleAuth) {
        setNativeGoogleAuth(capacitor.Plugins.NativeGoogleAuth);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleNativeSignIn = async () => {
    const { idToken } = await nativeGoogleAuth.signIn();
    await onCredential(idToken);
  };

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

  if (nativeGoogleAuth) {
    return (
      <button
        type="button"
        onClick={handleNativeSignIn}
        disabled={disabled}
        className="flex h-10 w-80 items-center justify-center gap-3 rounded border bg-white px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="text-lg font-semibold text-blue-600">G</span>
        Continue with Google
      </button>
    );
  }

  if (!env.googleClientId) {
    return (
      <p className="rounded-md border border-dashed p-3 text-center text-sm text-muted-foreground">
        Google Sign-In is not configured.
      </p>
    );
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={renderButton} />
      <div ref={buttonRef} className={disabled ? 'pointer-events-none opacity-50' : ''} />
    </>
  );
}
