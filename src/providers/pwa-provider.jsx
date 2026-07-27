'use client';

import { useEffect } from 'react';

export function PwaProvider() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // The application remains fully usable when service workers are unavailable.
      });
    };

    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
