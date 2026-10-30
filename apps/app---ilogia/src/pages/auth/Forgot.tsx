import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authErrorMessage, useAuth } from '@ilogia/auth';
import { Button, Input, useI18n } from '@ilogia/ui';
import { AuthLayout, emailOk } from './AuthLayout';

export default function Forgot() {
  const { t, locale } = useI18n(); const { resetPassword, configured } = useAuth();
  const [email, setEmail] = useState(''); const [err, setErr] = useState<string>(); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!emailOk(email)) { setErr(t('v.email')); return; }
    setErr(undefined); setBusy(true);
    try { await resetPassword(email); setDone(true); } catch (x) { setErr(authErrorMessage(x, locale)); } finally { setBusy(false); }
  };
  return (
    <AuthLayout title={t('auth.forgotTitle')} sub={t('auth.forgotSub')}>
      {done ? <p role="status" className="rounded bg-success-bg p-3 text-sm text-success">{t('auth.sent')}</p> : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <Input label={t('auth.email')} type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err} disabled={!configured} />
          <Button type="submit" size="lg" className="w-full" loading={busy} disabled={!configured}>{t('auth.send')}</Button>
        </form>
      )}
      <p className="mt-8 text-center text-sm"><Link to="/login" className="font-semibold text-brand-700 underline underline-offset-[3px]">{t('auth.back')}</Link></p>
    </AuthLayout>
  );
}
