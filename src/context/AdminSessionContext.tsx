import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  getActiveAdminEmail,
  getAdminEmails,
  isValidEmail,
  normalizeEmail,
  setActiveAdminEmail,
} from '@/lib/adminAccess';

export type AdminSignInResult = 'ok' | 'invalid' | 'not_added';

type AdminSessionValue = {
  isAdmin: boolean;
  adminEmail: string | null;
  signInAsAdmin: (email: string) => AdminSignInResult;
  signOutAdmin: () => void;
};

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(() => getActiveAdminEmail());

  const signInAsAdmin = (rawEmail: string): AdminSignInResult => {
    const email = normalizeEmail(rawEmail);
    if (!isValidEmail(email)) return 'invalid';
    if (!getAdminEmails().includes(email)) return 'not_added';
    setActiveAdminEmail(email);
    setAdminEmail(email);
    return 'ok';
  };

  const signOutAdmin = () => {
    setActiveAdminEmail(null);
    setAdminEmail(null);
  };

  const isAdmin = adminEmail !== null && getAdminEmails().includes(adminEmail);

  return (
    <AdminSessionContext.Provider value={{ isAdmin, adminEmail: isAdmin ? adminEmail : null, signInAsAdmin, signOutAdmin }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession(): AdminSessionValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error('useAdminSession must be used within AdminSessionProvider');
  return ctx;
}
