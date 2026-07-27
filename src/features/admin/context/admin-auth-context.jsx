'use client';

import { createContext, useContext, useState } from 'react';
import { adminLogin, clearAdminSession, getStoredAdmin } from '../services/admin-api';
import { useMounted } from '@/hooks/use-mounted';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const mounted = useMounted();
  const resolvedAdmin = admin ?? (mounted ? getStoredAdmin() : null);

  async function login(email, password) {
    const profile = await adminLogin(email, password);
    setAdmin(profile);
    return profile;
  }

  function logout() {
    clearAdminSession();
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin: resolvedAdmin, ready: mounted, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return value;
}
