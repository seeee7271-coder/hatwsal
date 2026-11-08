import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useAdminSession } from '@/context/AdminSessionContext';

const SIGN_IN_ERRORS = {
  invalid: 'يرجى كتابة بريد إلكتروني صحيح',
  not_added: 'هذا البريد غير مضاف كمدير في التطبيق',
} as const;

export function AdminGmailLogin({ onSuccess }: { onSuccess: () => void }) {
  const { signInAsAdmin } = useAdminSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = signInAsAdmin(email);
    if (result === 'ok') {
      onSuccess();
      return;
    }
    setError(SIGN_IN_ERRORS[result]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white p-4 animate-slide-up">
      <TextField
        label="بريد المدير (Gmail)"
        dir="ltr"
        type="email"
        inputMode="email"
        placeholder="name@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="rounded-lg bg-error-50 p-2.5 text-sm text-error-600">{error}</p>}
      <Button type="submit" variant="primary" size="md" fullWidth disabled={email.trim() === ''}>
        <span className="flex items-center justify-center gap-1">
          <Mail size={18} /> دخول
        </span>
      </Button>
    </form>
  );
}
