import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@ilogia/auth';
import { Button, Input, useI18n, useToast } from '@ilogia/ui';
import { cn } from '@ilogia/utilities';
import { useDashboard } from '../data/useDashboard';
import { PageHeader } from '../components/Shell';

function Row({ title, body, children }: { title: string; body?: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-ink">{title}</p>{body && <p className="text-sm text-muted">{body}</p>}</div><div className="shrink-0">{children}</div></div>;
}
function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange(v: T): void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-1 rounded-lg bg-cream p-1">
      {options.map((o) => <button key={o.id} role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)} className={cn('rounded px-3.5 py-1.5 text-sm font-semibold transition-colors', value === o.id ? 'bg-surface font-semibold text-brand-900 shadow-1' : 'text-muted hover:text-ink')}>{o.label}</button>)}
    </div>
  );
}

export default function Settings() {
  const { t, locale, setLocale, digits, setDigits } = useI18n(); const { signOut } = useAuth(); const nav = useNavigate();
  const { goal, setGoal } = useDashboard(); const toast = useToast(); const [g, setG] = useState(String(goal));
  const gv = Number(g); const bad = !Number.isFinite(gv) || gv < 5 || gv > 600;
  return (
    <div className="max-w-3xl">
      <PageHeader title={t('s.title')} />
      <div className="divide-y divide-line rounded-xl border border-line bg-surface shadow-1">
        <Row title={t('s.lang')} body={t('s.langBody')}><Segmented label={t('s.lang')} value={locale} onChange={setLocale} options={[{ id: 'ar', label: 'العربية' }, { id: 'en', label: 'English' }]} /></Row>
        {locale === 'ar' && <Row title={t('s.digits')}><Segmented label={t('s.digits')} value={digits} onChange={setDigits} options={[{ id: 'arab', label: t('s.digitsArab') }, { id: 'latn', label: t('s.digitsLatn') }]} /></Row>}
        <Row title={t('s.goal')} body={t('s.goalBody')}>
          <form className="flex items-start gap-2" onSubmit={(e) => { e.preventDefault(); if (bad) return; setGoal(gv); toast({ tone: 'success', text: t('s.saved') }); }}>
            <div className="w-24"><Input type="number" min={5} max={600} aria-label={t('s.goal')} value={g} onChange={(e) => setG(e.target.value)} error={bad ? '5 – 600' : undefined} /></div>
            <Button type="submit" variant="secondary" disabled={bad}>{t('p.save')}</Button>
          </form>
        </Row>
        <Row title={t('s.session')} body={t('s.sessionBody')}><Button variant="danger" icon={<LogOut className="h-4 w-4" />} onClick={async () => { await signOut(); nav('/login', { replace: true }); }} data-testid="settings-logout">{t('nav.logout')}</Button></Row>
      </div>
    </div>
  );
}
