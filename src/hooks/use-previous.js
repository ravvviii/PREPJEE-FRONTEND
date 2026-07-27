'use client';

import { useRef } from 'react';

// React's own documented pattern for "storing information from previous
// renders" — mutating a ref during render is safe here because it's
// idempotent within a single render pass, but the React Compiler's stricter
// `react-hooks/refs` rule can't tell that apart from an unsafe ref read, so
// it's disabled for just this hook rather than dropping the pattern.
/* eslint-disable react-hooks/refs */
export function usePrevious(value) {
  const currentRef = useRef(value);
  const previousRef = useRef(undefined);

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}
/* eslint-enable react-hooks/refs */
