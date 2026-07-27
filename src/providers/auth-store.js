import { create } from 'zustand';

// Plain in-memory client state (no zustand `persist`) — the access token must
// never touch storage, and the refresh token's persistence is handled
// explicitly by AuthContext/axios.js via utils/storage.js instead, so this
// store stays a simple readable/writable source of truth for both React
// components and non-React modules (e.g. the axios interceptor) via
// useAuthStore.getState() / setState().
export const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  // 'idle' | 'authenticating' | 'authenticated' | 'guest'
  status: 'idle',

  setSession: ({ accessToken, refreshToken, user }) =>
    set({ accessToken, refreshToken, user, status: 'authenticated' }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  clearSession: () => set({ accessToken: null, refreshToken: null, user: null, status: 'guest' }),
}));
