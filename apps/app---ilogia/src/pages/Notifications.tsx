import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@ilogia/auth';
import { Button, EmptyState, ErrorState, Skeleton, Tabs, useI18n } from '@ilogia/ui';
import { cn } from '@ilogia/utilities';
import { buildNotices } from '../data/dashboard';
import { useDashboard } from '../data/useDashboard';
import { PageHeader } from '../components/Shell';

export default function Notifications() {
  const { t, num } = useI18n(); const { profile } = useAuth(); const { data, loading, error, reload, goal, read, markRead } = useDashboard();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  if (loading && !data) return <Skeleton className="h-64" />;
  if (error || !data) return <ErrorState title={t('err.load')} body={t('err.loadBody')} onRetry={reload} retryLabel={t('err.retry')} />;
  const all = buildNotices(data, profile, goal); const unread = all.filter((n) => !read.includes(n.id));
  const list = tab === 'all' ? all : unread;
  return (
    <div>
      <PageHeader title={t('n.title')} actions={unread.length > 0 && <Button variant="secondary" size="sm" onClick={() => markRead(all.map((n) => n.id))} data-testid="mark-all">{t('n.markAll')}</Button>} />
      <Tabs label={t('n.title')} value={tab} onChange={setTab} tabs={[{ id: 'all', label: t('n.all'), count: num(all.length) }, { id: 'unread', label: t('n.unread'), count: num(unread.length) }]} />
      <div className="mt-4 rounded-xl border border-line bg-surface shadow-1">
        {list.length ? (
          <ul className="divide-y divide-line" data-testid="notice-list">{list.map((n) => {
            const isRead = read.includes(n.id);
            return (
              <li key={n.id} className={cn('flex items-start gap-3 p-4', !isRead && 'bg-gold-100/30')}>
                <span className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', isRead ? 'bg-line' : 'bg-gold-500')} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{t(n.titleKey, n.vars)}{!isRead && <span className="sr-only"> ({t('n.unread')})</span>}</p>
                  <p className="text-sm text-muted">{t(n.bodyKey, n.vars)}</p>
                  {n.href && <Link to={n.href} className="mt-1 inline-block text-sm font-medium text-brand-700 underline underline-offset-[3px]">{t('nav.profile')}</Link>}
                </div>
                {!isRead && <button aria-label={t('n.markOne')} title={t('n.markOne')} onClick={() => markRead([n.id])} className="shrink-0 rounded px-2 py-1 text-xs text-muted hover:bg-cream hover:text-ink">✓</button>}
              </li>
            );
          })}</ul>
        ) : <EmptyState title={t('n.empty')} body={t('n.emptyBody')} />}
      </div>
    </div>
  );
}
