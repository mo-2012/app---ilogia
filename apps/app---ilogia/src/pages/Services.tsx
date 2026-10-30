import { useMemo, useState } from 'react';
import { ECOSYSTEM } from '@ilogia/configuration';
import { EmptyState, SearchBar, Tabs, useI18n } from '@ilogia/ui';
import { EcosystemIndex } from '../components/Ecosystem';
import { PageHeader } from '../components/Shell';

export default function Services() {
  const { t, locale, num } = useI18n(); const [q, setQ] = useState(''); const [tab, setTab] = useState<'all' | 'live' | 'soon'>('all');
  const list = useMemo(() => ECOSYSTEM.filter((a) => (tab === 'all' || (tab === 'live' ? a.status === 'live' : a.status !== 'live')) &&
    [a.nameAr, a.nameEn, a.descAr, a.descEn, a.domain].join(' ').toLowerCase().includes(q.trim().toLowerCase())), [q, tab]);
  return (
    <div>
      <PageHeader title={t('svc.title')} sub={t('svc.sub')} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Tabs label={t('svc.title')} value={tab} onChange={setTab} tabs={[
          { id: 'all', label: locale === 'ar' ? 'الكل' : 'All', count: num(ECOSYSTEM.length) },
          { id: 'live', label: t('status.live'), count: num(ECOSYSTEM.filter((a) => a.status === 'live').length) },
          { id: 'soon', label: t('status.planned'), count: num(ECOSYSTEM.filter((a) => a.status !== 'live').length) }]} />
        <div className="sm:w-72"><SearchBar value={q} onChange={setQ} placeholder={t('svc.search')} label={t('svc.search')} /></div>
      </div>
      <div className="rounded-xl border border-line bg-surface shadow-1 px-5">{list.length ? <EcosystemIndex apps={list} /> : <EmptyState title={t('svc.none')} />}</div>
    </div>
  );
}
