function readEnv(key, fallback = '') {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
}

export const env = {
  apiUrl: readEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000/api/v1'),
  googleClientId: readEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
  amplitudeKey: readEnv('NEXT_PUBLIC_AMPLITUDE_KEY'),
  razorpayKey: readEnv('NEXT_PUBLIC_RAZORPAY_KEY'),
  appName: readEnv('NEXT_PUBLIC_APP_NAME', 'PrepJEE'),
};
