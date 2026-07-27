'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// True only after the client has hydrated — guards against hydration
// mismatches for anything that reads browser-only state (theme, storage).
// useSyncExternalStore (not useState+useEffect) so there's no setState call
// inside an effect body.
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
