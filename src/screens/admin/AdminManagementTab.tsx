import { useState, type FormEvent } from 'react';
import { Mail, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useAdminSession } from '@/context/AdminSessionContext';
import { addAdminEmail, getAdminEmails, isValidEmail, normalizeEmail, removeAdminEmail } from '@/lib/adminAccess';

export function AdminManagementTab() {
  const { adminEmail } = useAdminSession();
  const [admins, setAdmins] = useState<string[]>(() => getAdminEmails());
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [listError, setListError] = useState('');

  const refresh = () => setAdmins(getAdminEmails());

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setFormError('يرجى كتابة بريد إلكتروني صحيح');
      return;
    }
    if (admins.includes(normalized)) {
      setFormError('هذا البريد مضاف كمدير بالفعل');
      return;
    }
    addAdminEmail(normalized);
    setEmail('');
    setFormError('');
    refresh();
  };

  const handleRemove = (adminAddress: string) => {
    if (adminAddress === adminEmail) {
      setListError('لا يمكنك حذف بريدك وأنت مسجل به');
      return;
    }
    const confirmed = window.confirm(`إلغاء صلاحية ${adminAddress}؟ لن يتمكن من الدخول لوحة الإدارة بعد ذلك.`);
    if (!confirmed) return;
    removeAdminEmail(adminAddress);
    setListError('');
    refresh();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-white/80">
        <ShieldCheck size={20} className="text-brand-400" />
        <h2 className="font-bold">إدارة المديرين</h2>
      </div>

      <form onSubmit={handleAdd} className="space-y-3 rounded-2xl bg-white p-4">
        <TextField
          label="بريد المدير الإلكتروني (Gmail)"
          dir="ltr"
          type="email"
          inputMode="email"
          placeholder="name@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {formError && <p className="rounded-lg bg-error-50 p-2.5 text-sm text-error-600">{formError}</p>}
        <Button type="submit" variant="primary" size="md" fullWidth disabled={email.trim() === ''}>
          <span className="flex items-center justify-center gap-1">
            <Plus size={18} /> إضافة مدير
          </span>
        </Button>
      </form>

      {listError && <p className="rounded-xl bg-error-500/20 p-3 text-sm text-error-400">{listError}</p>}

      {admins.length === 0 && (
        <div className="rounded-2xl bg-navy-800 p-6 text-center text-navy-400">
          <ShieldCheck className="mx-auto mb-2" size={32} />
          <p>لا يوجد مديرون بعد.</p>
        </div>
      )}

      {admins.map((admin) => (
        <div key={admin} className="flex items-center justify-between gap-3 rounded-2xl bg-navy-800 p-4">
          <div className="min-w-0">
            <p dir="ltr" className="truncate text-left text-sm font-semibold text-white">
              <Mail size={14} className="mr-1 inline text-navy-400" />
              {admin}
            </p>
            {admin === adminEmail && <p className="mt-1 text-xs text-navy-400">أنت</p>}
          </div>
          {admin === adminEmail ? (
            <span className="shrink-0 rounded-full bg-brand-500/20 px-2.5 py-1 text-xs font-semibold text-brand-300">
              حسابك
            </span>
          ) : (
            <Button variant="danger" size="sm" onClick={() => handleRemove(admin)}>
              <span className="flex items-center gap-1">
                <Trash2 size={14} /> حذف
              </span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
