'use client';

import { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/providers/auth-store';
import * as authApi from '@/services/api/auth.api';
import * as userApi from '@/services/api/user.api';
import { getStoredItem, setStoredItem, removeStoredItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { ROUTES } from '@/constants/routes';
import { QUERY_KEYS } from '@/constants/query-keys';
import { track, identify, reset as resetAnalytics } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

const AuthContext = createContext(null);

// Thin Context adapter over the Zustand auth store (providers/auth-store.js).
// The store itself stays the single source of truth so non-React modules
// (services/api/axios.js) can read/write it too — this layer only adds the
// session-restore-on-mount effect and the login/logout/update actions.
export function AuthProvider({ children }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const restoreAttempted = useRef(false);

  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const setSession = useAuthStore((s) => s.setSession);
  const setUserInStore = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const clearSession = useAuthStore((s) => s.clearSession);

  // The Zustand store and the ['users','me'] query cache both hold a copy of
  // the profile (useMeQuery seeds itself from the store but doesn't refetch
  // just because the store changes) — every profile write must go through
  // here so the two never drift, e.g. a payment updating subscription status
  // in the store while `useIsPremium`'s query cache still shows the old one.
  const setUser = useCallback(
    (profile) => {
      setUserInStore(profile);
      queryClient.setQueryData(QUERY_KEYS.ME, profile);
    },
    [setUserInStore, queryClient],
  );

  const identifyUser = useCallback((profile) => {
    identify(profile.id, { subscriptionStatus: profile.subscription?.status ?? 'none' });
    track(ANALYTICS_EVENTS.USER_IDENTIFIED, { userId: profile.id });
  }, []);

  // Shared by both login methods: store tokens, then fetch the full profile
  // so `user` always holds the same shape regardless of entry point (the
  // OTP/Google auth responses only return {id, phone, name, email}).
  const applySession = useCallback(
    async ({ accessToken, refreshToken }) => {
      setSession({ accessToken, refreshToken, user: null });
      setStoredItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      const profile = await userApi.getMe();
      setUser(profile);
      identifyUser(profile);
      return profile;
    },
    [setSession, setUser, identifyUser],
  );

  const loginWithGoogle = useCallback(
    async (idToken) => {
      track(ANALYTICS_EVENTS.GOOGLE_LOGIN_STARTED);
      try {
        const result = await authApi.loginWithGoogle(idToken);
        const profile = await applySession(result);
        track(ANALYTICS_EVENTS.GOOGLE_LOGIN_SUCCESS);
        track(ANALYTICS_EVENTS.LOGIN_SUCCESS, { method: 'google' });
        return profile;
      } catch (error) {
        track(ANALYTICS_EVENTS.GOOGLE_LOGIN_FAILED, { code: error.code });
        track(ANALYTICS_EVENTS.LOGIN_FAILED, { method: 'google', code: error.code });
        throw error;
      }
    },
    [applySession],
  );

  const registerWithEmail = useCallback(
    async ({ email, password, name }) => {
      try {
        const result = await authApi.registerWithEmail({ email, password, name });
        const profile = await applySession(result);
        track(ANALYTICS_EVENTS.LOGIN_SUCCESS, { method: 'email_register' });
        return profile;
      } catch (error) {
        track(ANALYTICS_EVENTS.LOGIN_FAILED, { method: 'email_register', code: error.code });
        throw error;
      }
    },
    [applySession],
  );

  const loginWithEmail = useCallback(
    async (email, password) => {
      try {
        const result = await authApi.loginWithEmail(email, password);
        const profile = await applySession(result);
        track(ANALYTICS_EVENTS.LOGIN_SUCCESS, { method: 'email' });
        return profile;
      } catch (error) {
        track(ANALYTICS_EVENTS.LOGIN_FAILED, { method: 'email', code: error.code });
        throw error;
      }
    },
    [applySession],
  );

  const sendOtp = useCallback(async (phone) => {
    try {
      const result = await authApi.sendOtp(phone);
      track(ANALYTICS_EVENTS.OTP_SENT);
      return result;
    } catch (error) {
      track(ANALYTICS_EVENTS.OTP_SEND_FAILED, { code: error.code });
      throw error;
    }
  }, []);

  const verifyOtp = useCallback(
    async (phone, otp) => {
      try {
        const result = await authApi.verifyOtp(phone, otp);
        track(ANALYTICS_EVENTS.OTP_VERIFIED);
        const profile = await applySession(result);
        track(ANALYTICS_EVENTS.LOGIN_SUCCESS, { method: 'otp' });
        return profile;
      } catch (error) {
        track(ANALYTICS_EVENTS.LOGIN_FAILED, { method: 'otp', code: error.code });
        throw error;
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    const refreshToken = useAuthStore.getState().refreshToken ?? getStoredItem(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Best-effort revoke on the server — clear the local session regardless.
    }
    removeStoredItem(STORAGE_KEYS.REFRESH_TOKEN);
    clearSession();
    resetAnalytics();
    track(ANALYTICS_EVENTS.LOGOUT);
    router.push(ROUTES.LOGIN);
  }, [clearSession, router]);

  const updateUser = useCallback(
    async (fields) => {
      const updated = await userApi.updateProfile(fields);
      setUser(updated);
      return updated;
    },
    [setUser],
  );

  const refreshUser = useCallback(async () => {
    const profile = await userApi.getMe();
    setUser(profile);
    return profile;
  }, [setUser]);

  const uploadAvatar = useCallback(
    async (file) => {
      const profile = await userApi.uploadAvatar(file);
      setUser(profile);
      return profile;
    },
    [setUser],
  );

  // Session restore: on first mount, trade a stored refresh token for a
  // fresh access token + profile so a page reload doesn't force re-login.
  useEffect(() => {
    if (restoreAttempted.current) return;
    restoreAttempted.current = true;

    const storedRefreshToken = getStoredItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!storedRefreshToken) {
      setStatus('guest');
      return;
    }

    setStatus('authenticating');
    authApi
      .refreshSession(storedRefreshToken)
      .then(async ({ accessToken, refreshToken }) => {
        setSession({ accessToken, refreshToken, user: null });
        setStoredItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        const profile = await userApi.getMe();
        setUser(profile);
        identifyUser(profile);
      })
      .catch(() => {
        removeStoredItem(STORAGE_KEYS.REFRESH_TOKEN);
        clearSession();
      });
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    accessToken,
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'idle' || status === 'authenticating',
    loginWithGoogle,
    registerWithEmail,
    loginWithEmail,
    sendOtp,
    verifyOtp,
    logout,
    updateUser,
    refreshUser,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
