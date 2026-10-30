import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { authErrorMessage, useAuth } from '@ilogia/auth';
import { Button, Input, useI18n } from '@ilogia/ui';
import { AuthLayout, emailOk } from './AuthLayout';

export default function Register() {
  const { t, locale } = useI18n(); const { signUp, configured } = useAuth();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errs, setErrs] = useState<Partial<Record<keyof typeof f | 'form', string>>>({}); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = { name: f.name.trim().length >= 3 ? undefined : t('v.name'), email: emailOk(f.email) ? undefined : t('v.email'), password: f.password.length >= 8 ? undefined : t('v.password'), confirm: f.confirm === f.password ? undefined : t('v.match') };
    setErrs(v); if (Object.values(v).some(Boolean)) return;
    setBusy(true);
    try { await signUp(f.name, f.email, f.password); setSent(true); }
    catch (x) { setErrs({ form: authErrorMessage(x, locale) }); } finally { setBusy(false); }
  };

  if (sent) return (
    <AuthLayout title={t('auth.checkEmail')} sub={t('auth.checkEmailBody', { email: f.email })}>
      <MailCheck className="mb-6 h-10 w-10 text-gold-700" aria-hidden />
      <Link to="/login" className="font-semibold text-brand-700 underline underline-offset-[3px]">{t('auth.back')}</Link>
    </AuthLayout>
  );

  return (
    <AuthLayout tabs title={t('auth.registerTitle')} sub={t('auth.registerSub')}>
      {!configured && <p role="note" className="mb-5 rounded border border-gold-500/40 bg-gold-100 px-3.5 py-3 text-sm leading-7 text-gold-700">{t('auth.notConfigured')}</p>}
      <form onSubmit={submit} noValidate className="space-y-4">
        <Input label={t('auth.fullName')} autoComplete="name" value={f.name} onChange={set('name')} error={errs.name} disabled={!configured} data-testid="reg-name" />
        <Input label={t('auth.email')} type="email" dir="ltr" autoComplete="email" value={f.email} onChange={set('email')} error={errs.email} disabled={!configured} data-testid="reg-email" />
        <Input label={t('auth.password')} type="password" dir="ltr" autoComplete="new-password" value={f.password} onChange={set('password')} error={errs.password} disabled={!configured} data-testid="reg-password" />
        <Input label={t('auth.confirm')} type="password" dir="ltr" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={errs.confirm} disabled={!configured} data-testid="reg-confirm" />
        {errs.form && <p role="alert" className="rounded bg-danger-bg p-3 text-sm text-danger">{errs.form}</p>}
        <Button type="submit" size="lg" className="w-full" loading={busy} disabled={!configured} data-testid="reg-submit">{t('auth.create')}</Button>
      </form>
      <p className="mt-8 text-center text-sm text-muted">{t('auth.haveAccount')} <Link to="/login" className="font-semibold text-brand-700 underline underline-offset-[3px]">{t('auth.login')}</Link></p>
    </AuthLayout>
  );
}
