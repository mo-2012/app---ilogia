import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authErrorMessage, safeNext, useAuth } from '@ilogia/auth';
import { Button, Input, useI18n } from '@ilogia/ui';
import { AuthLayout, emailOk } from './AuthLayout';

export default function Login() {
  const { t, locale } = useI18n(); const { signIn, enterDemo, configured } = useAuth();
  const nav = useNavigate(); const [sp] = useSearchParams();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [errs, setErrs] = useState<{ email?: string; password?: string; form?: string }>({}); const [busy, setBusy] = useState(false);
  const next = safeNext(sp.get('next'));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = { email: emailOk(email) ? undefined : t('v.email'), password: password ? undefined : t('v.required') };
    setErrs(v); if (v.email || v.password) return;
    setBusy(true);
    try { await signIn(email, password); nav(next, { replace: true }); }
    catch (x) { setErrs({ form: authErrorMessage(x, locale) }); } finally { setBusy(false); }
  };

  return (
    <AuthLayout tabs title={t('auth.loginTitle')} sub={t('auth.loginSub')}>
      {!configured && <p role="note" className="mb-5 rounded border border-gold-500/40 bg-gold-100 px-3.5 py-3 text-sm leading-7 text-gold-700" data-testid="not-configured">{t('auth.notConfigured')}</p>}
      <form onSubmit={submit} noValidate className="space-y-4">
        <Input label={t('auth.email')} type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errs.email} disabled={!configured} data-testid="email" />
        <Input label={t('auth.password')} type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errs.password} disabled={!configured} data-testid="password" />
        <div className="flex justify-end"><Link to="/forgot" className="text-sm text-brand-700 underline underline-offset-[3px]">{t('auth.forgot')}</Link></div>
        {errs.form && <p role="alert" className="rounded bg-danger-bg p-3 text-sm text-danger" data-testid="form-error">{errs.form}</p>}
        <Button type="submit" size="lg" className="w-full" loading={busy} disabled={!configured} data-testid="login-submit">{t('auth.login')}</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />{t('auth.or')}<span className="h-px flex-1 bg-line" /></div>
      <Button variant="secondary" size="lg" className="w-full" onClick={() => { enterDemo(); nav('/', { replace: true }); }} data-testid="demo">{t('auth.demo')}</Button>
      <p className="mt-8 text-center text-sm text-muted">{t('auth.noAccount')} <Link to="/register" className="font-semibold text-brand-700 underline underline-offset-[3px]">{t('auth.register')}</Link></p>
    </AuthLayout>
  );
}
