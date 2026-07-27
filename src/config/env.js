// Next.js only inlines NEXT_PUBLIC_* vars into the browser bundle where it
// sees a literal `process.env.NEXT_PUBLIC_X` member expression it can
// statically replace at build time — `process.env[dynamicKey]` is invisible
// to that step and resolves to undefined client-side, so each var is read
// as its own literal reference here rather than through a generic helper.
function withFallback(value, fallback = '') {
  return value === undefined || value === '' ? fallback : value;
}

export const env = {
  apiUrl: withFallback(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:4000/api/v1'),
  googleClientId: withFallback(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
  amplitudeKey: withFallback(process.env.NEXT_PUBLIC_AMPLITUDE_KEY),
  razorpayKey: withFallback(process.env.NEXT_PUBLIC_RAZORPAY_KEY),
  appName: withFallback(process.env.NEXT_PUBLIC_APP_NAME, 'PrepJEE'),
};
