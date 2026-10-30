import { Suspense, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ExternalLink, Home, LayoutGrid, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@ilogia/auth';
import { MAIN_SITE } from '@ilogia/configuration';
import { Avatar, Button, Dropdown, IconButton, Spinner, useI18n, Wordmark } from '@ilogia/ui';
import { cn } from '@ilogia/utilities';
import { useDashboard } from '../data/useDashboard';
import { buildNotices } from '../data/dashboard';

/** Same navigation model as ilogia-eg.com: pill nav in the sticky header on desktop, bottom tab bar on mobile. */
const NAV = [
  { to: '/', key: 'nav.home', tab: 'nav.home', icon: Home, end: true },
  { to: '/services', key: 'nav.services', tab: 'tab.services', icon: LayoutGrid },
  { to: '/notifications', key: 'nav.notifications', tab: 'tab.notifications', icon: Bell },
  { to: '/profile', key: 'nav.profile', tab: 'tab.profile', icon: User },
  { to: '/settings', key: 'nav.settings', tab: 'nav.settings', icon: Settings },
];

export function useUnread() {
  const { data, goal, read } = useDashboard(); const { profile } = useAuth();
  return data ? buildNotices(data, profile, goal).filter((n) => !read.includes(n.id)).length : 0;
}

export function Shell() {
  const { t, num } = useI18n(); const { profile, status, signOut } = useAuth();
  const nav = useNavigate(); const loc = useLocation();
  const unread = useUnread();
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  const logout = async () => { await signOut(); nav('/login', { replace: true }); };

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-50 focus:rounded focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-white">{t('skip')}</a>
      {status === 'demo' && (
        <div role="note" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-gold-500/40 bg-gold-100 px-4 py-2 text-center text-[13px] text-gold-700" data-testid="demo-banner">
          <span>{t('demo.banner')}</span>
          <button onClick={logout} className="font-semibold underline underline-offset-2">{t('demo.exit')}</button>
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/[.92] pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-4 px-[clamp(16px,4vw,48px)] lg:h-[68px]">
          <Link to="/" className="me-auto rounded" aria-label="ilogia"><Wordmark sub={t('app.name')} size={40} className="[&_small]:hidden sm:[&_small]:block" /></Link>
          <nav aria-label={t('nav.main')} className="hidden gap-0.5 rounded-xl bg-cream p-1 lg:flex">
            {NAV.map(({ to, key, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => cn('flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors', isActive ? 'bg-brand-700 text-white' : 'text-muted hover:text-ink')}>
                {t(key)}
                {key === 'nav.notifications' && unread > 0 && <span className="rounded-sm bg-gold-500 px-1.5 text-xs font-bold leading-5 text-ink">{num(unread)}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <IconButton label={t('nav.notifications')} onClick={() => nav('/notifications')} className="relative h-11 w-11 lg:hidden">
              <Bell className="h-5 w-5" />
              {unread > 0 && <span className="absolute end-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-bg" aria-hidden />}
            </IconButton>
            <Dropdown label={t('nav.account')} trigger={<span className="flex items-center gap-2 rounded-lg border border-line bg-surface px-1.5 py-1 hover:border-brand-700"><Avatar name={profile?.full_name} size={32} /><span className="hidden max-w-36 truncate text-sm font-semibold text-ink xl:block">{profile?.full_name || profile?.email}</span></span>}
              items={[
                { label: t('nav.profile'), icon: <User className="h-4 w-4" />, onSelect: () => nav('/profile') },
                { label: t('nav.settings'), icon: <Settings className="h-4 w-4" />, onSelect: () => nav('/settings') },
                'sep',
                { label: t('nav.logout'), icon: <LogOut className="h-4 w-4" />, onSelect: logout, danger: true },
              ]} />
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1180px] flex-1 px-[clamp(16px,4vw,40px)] py-6 outline-none lg:py-8">
        <Suspense fallback={<div className="grid place-items-center py-24"><Spinner label={t('loading')} /></div>}><Outlet /></Suspense>
      </main>

      <footer className="mt-10 hidden border-t border-line bg-cream py-6 text-sm text-muted lg:block">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-[clamp(16px,4vw,48px)]">
          <Wordmark sub={t('foot.tag')} size={34} />
          <span>{t('foot.rights')}</span>
          <a href={MAIN_SITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"><ExternalLink className="h-4 w-4" aria-hidden />{t('nav.mainSite')} <span dir="ltr">ilogia-eg.com</span></a>
        </div>
      </footer>

      <nav aria-label={t('nav.main')} className="fixed inset-x-0 bottom-0 z-30 grid h-[calc(64px+env(safe-area-inset-bottom))] grid-cols-5 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-12px_rgba(25,36,40,.18)] backdrop-blur-md lg:hidden" data-testid="tabbar">
        {NAV.map(({ to, tab, icon: Icon, end, key }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => cn('relative flex min-w-0 flex-col items-center justify-center gap-[3px] text-[11px] font-semibold transition-colors active:bg-brand-100', isActive ? 'text-brand-700 before:absolute before:top-0 before:h-[3px] before:w-[30px] before:rounded-b before:bg-brand-700' : 'text-muted')}>
            <span className="relative"><Icon className="h-6 w-6" strokeWidth={1.9} aria-hidden />
              {key === 'nav.notifications' && unread > 0 && <span className="absolute -end-1 -top-0.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-surface" aria-hidden />}</span>
            <span className="max-w-full truncate">{t(tab)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-snug text-ink">{title}</h1>{sub && <p className="mt-1 max-w-2xl text-muted">{sub}</p>}</div>
      {actions}
    </div>
  );
}
export { Button };
