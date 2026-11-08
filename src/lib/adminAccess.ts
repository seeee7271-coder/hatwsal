const ADMIN_EMAILS_KEY = 'yanegm.adminEmails';
const ACTIVE_ADMIN_KEY = 'yanegm.activeAdminEmail';

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getAdminEmails(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(ADMIN_EMAILS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function saveAdminEmails(emails: string[]): void {
  localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(emails));
}

export function addAdminEmail(email: string): void {
  const emails = getAdminEmails();
  if (emails.includes(email)) return;
  saveAdminEmails([...emails, email]);
}

export function removeAdminEmail(email: string): void {
  saveAdminEmails(getAdminEmails().filter((item) => item !== email));
}

export function getActiveAdminEmail(): string | null {
  return localStorage.getItem(ACTIVE_ADMIN_KEY);
}

export function setActiveAdminEmail(email: string | null): void {
  if (email === null) localStorage.removeItem(ACTIVE_ADMIN_KEY);
  else localStorage.setItem(ACTIVE_ADMIN_KEY, email);
}
