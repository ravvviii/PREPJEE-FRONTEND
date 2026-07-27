import { NextResponse } from 'next/server';

// This app's tokens live in memory + localStorage, not a cookie, so Proxy
// (Next.js 16's renamed Middleware) has no visibility into auth state and
// cannot do real route protection here — that happens client-side in
// components/common/route-guard.jsx via AuthContext. This stays a
// pass-through so the file conventions/pipeline are still in place if a
// cookie-based optimistic check is ever added later.
export function proxy() {
  return NextResponse.next();
}
