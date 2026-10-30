import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';
import { Badge, useI18n, Wordmark } from '@ilogia/ui';
import { cn } from '@ilogia/utilities';

/** Mirrors ilogia-eg.com/login.html: card + notebook "sheet" art with the red-pen circle and grade chip. */
export function AuthLayout({ title, sub, children, tabs }: { title: string; sub: string; children: ReactNode; tabs?: boolean }) {
  const { t, locale, setLocale } = useI18n();
  return (
    <div className="grid min-h-dvh place-items-center p-[clamp(16px,3vw,40px)]">
      <div className="w-full max-w-[560px] lg:grid lg:max-w-[1120px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
        <main className="relative overflow-hidden rounded-xl border border-line bg-surface p-[clamp(24px,5vw,40px)] shadow-[0_20px_40px_-12px_rgba(25,36,40,.12)] lg:min-h-[560px]">
          <div aria-hidden className="pointer-events-none absolute -end-12 -top-12 h-[190px] w-[190px] rounded-full bg-brand-700/[.08] blur-[30px]" />
          <div className="relative">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Wordmark sub={t('foot.tag')} size={42} />
              <div className="flex items-center gap-2">
                <Badge tone="neutral" className="hidden sm:inline-flex"><ShieldCheck className="h-3.5 w-3.5" aria-hidden />{t('auth.gateway')}</Badge>
                <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="rounded px-2 py-1 text-sm font-semibold text-brand-700 hover:bg-cream" data-testid="lang-toggle">{locale === 'ar' ? 'English' : 'العربية'}</button>
              </div>
            </div>
            {tabs && (
              <div className="mb-6 flex gap-1 rounded-lg bg-cream p-1" role="tablist" aria-label={t('auth.mode')}>
                {[{ to: '/login', k: 'auth.login' }, { to: '/register', k: 'auth.register' }].map((x) => (
                  <NavLink key={x.to} to={x.to} replace role="tab" className={({ isActive }) => cn('flex-1 rounded px-4 py-2.5 text-center text-sm font-semibold transition-colors', isActive ? 'bg-surface text-brand-900 shadow-1' : 'text-muted hover:text-ink')}>{t(x.k)}</NavLink>
                ))}
              </div>
            )}
            <h1 className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold leading-[1.4] text-ink">{title}</h1>
            <p className="mb-6 mt-1 text-muted">{sub}</p>
            {children}
          </div>
        </main>
        <aside aria-hidden className="ilg-notebook relative hidden flex-col justify-center gap-6 overflow-hidden rounded-xl border border-line py-12 pe-8 ps-24 shadow-1 lg:flex">
          <Badge tone="neutral" className="self-start">{t('auth.side.badge')}</Badge>
          <h2 className="font-display text-[clamp(1.7rem,2.6vw,2.3rem)] font-bold leading-[64px] text-ink">
            {t('auth.side.l1')}<br />
            <span className="relative inline-block">{t('auth.side.l2')}
              <svg className="pointer-events-none absolute -inset-x-6 -inset-y-1.5 h-[calc(100%+8px)] w-[calc(100%+44px)] overflow-visible" viewBox="0 0 360 84" preserveAspectRatio="none">
                <path className="ilg-pen" pathLength={1} d="M18 46C14 18 120 8 220 10c92 2 134 14 126 36-8 24-110 32-206 28C60 71 12 66 18 46z" fill="none" stroke="rgb(var(--ilg-pen))" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="m-0 max-w-[32ch] leading-8 text-muted">{t('auth.side.b')}</p>
          <span className="flex items-center gap-4 self-start rounded-lg border border-line bg-surface px-6 py-4 font-display text-[1.6rem] font-bold leading-none text-brand-700 shadow-1">
            <Check className="h-7 w-7" strokeWidth={3.2} aria-hidden />{t('auth.side.grade')}
          </span>
        </aside>
      </div>
    </div>
  );
}

export const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
