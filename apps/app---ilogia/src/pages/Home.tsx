import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, CalendarCheck2, Clock3, ExternalLink, Flame, Pencil, Target } from 'lucide-react';
import { useAuth } from '@ilogia/auth';
import { MAIN_SITE } from '@ilogia/configuration';
import { Badge, Button, buttonStyles, Dialog, EmptyState, ErrorState, Input, Progress, Skeleton, useI18n, useToast } from '@ilogia/ui';
import { cairoDay, cairoHour, cn } from '@ilogia/utilities';
import { useDashboard } from '../data/useDashboard';
import { buildNotices, heatmap, summarize } from '../data/dashboard';
import { EcosystemIndex } from '../components/Ecosystem';
import { ECOSYSTEM } from '@ilogia/configuration';

export function SubscriptionBadge({ sub, dark }: { sub: { status?: string; days_left?: number | null } | null; dark?: boolean }) {
  const { t } = useI18n();
  const st = sub?.status; const key = st === 'active' ? 'sub.active' : st === 'pending' ? 'sub.pending' : st === 'rejected' ? 'sub.rejected' : st === 'expired' ? 'sub.expired' : 'sub.none';
  const tone = st === 'active' ? 'success' : st === 'pending' ? 'warning' : st === 'rejected' ? 'danger' : 'neutral';
  return <Badge tone={dark && tone === 'neutral' ? 'neutral' : tone} className={dark ? 'border-0 bg-white/[.16] text-white' : ''}>{t(key)}{st === 'active' && sub?.days_left != null ? ` · ${t('sub.daysLeft', { n: Number(sub.days_left) })}` : ''}</Badge>;
}

function HomeSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <Skeleton className="h-52 w-full" />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
    </div>
  );
}

export default function Home() {
  const { t, num, date, locale } = useI18n(); const { profile } = useAuth(); const toast = useToast();
  const { data, loading, error, reload, goal, setGoal, read } = useDashboard();
  const [goalOpen, setGoalOpen] = useState(false); const [goalDraft, setGoalDraft] = useState(String(goal));
  if (loading && !data) return <HomeSkeleton />;
  if (error || !data) return <ErrorState title={t('err.load')} body={t('err.loadBody')} onRetry={reload} retryLabel={t('err.retry')} />;

  const today = cairoDay(); const s = summarize(data, today); const cells = heatmap(data.progress.by, today);
  const notices = buildNotices(data, profile, goal, today).filter((n) => !read.includes(n.id)).slice(0, 3);
  const first = (profile?.full_name || '').trim().split(/\s+/)[0] || t('greet.student');
  const greet = cairoHour() < 12 ? t('greet.morning') : t('greet.evening');
  const goalPct = Math.min(100, Math.round((s.minutesToday / goal) * 100));
  const goalVal = Number(goalDraft); const goalErr = !Number.isFinite(goalVal) || goalVal < 5 || goalVal > 600;

  return (
    <div className="space-y-8">
      {/* Hero: same green banner as the main site's profile page (.phero) */}
      <section className="ilg-enter grid gap-6 rounded-xl bg-brand-700 p-6 text-white shadow-2 sm:p-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <p className="text-sm text-white/75">{date(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="mt-1 font-display text-[clamp(1.5rem,3.5vw,2.1rem)] font-bold leading-snug text-white" data-testid="greeting">{greet}، {first}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SubscriptionBadge sub={data.subscription} dark />
            {data.sample && <Badge className="border-0 bg-gold-500 text-ink">{locale === 'ar' ? 'بيانات تجريبية' : 'Sample data'}</Badge>}
          </div>
        </div>
        <div className="rounded-lg bg-white/[.12] p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-white/85"><Target className="h-4 w-4 text-gold-500" aria-hidden />{t('home.goal')}</span>
            <button onClick={() => { setGoalDraft(String(goal)); setGoalOpen(true); }} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"><Pencil className="h-3 w-3" aria-hidden />{t('home.editGoal')}</button>
          </div>
          <p className="mt-2 text-2xl font-bold ilg-num" data-testid="goal-text">{t('home.goalOf', { a: s.minutesToday, b: goal })}</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label={t('home.goal')} aria-valuenow={goalPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-lime transition-[width] duration-700 ease-ilg" style={{ width: `${goalPct}%` }} />
          </div>
          {goalPct >= 100 && <p className="mt-2 text-xs font-semibold text-gold-500">{t('home.goalDone')}</p>}
        </div>
      </section>

      {/* Stats: the main site's .stats cards */}
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4" aria-label={t('home.ledger')}>
        {[
          { icon: Clock3, label: t('home.hours'), value: num(Math.round(s.hours * 10) / 10) },
          { icon: BookOpenCheck, label: t('home.lessons'), value: num(s.lessons), hint: data.totalLessons ? t('home.ofTotal', { n: data.totalLessons }) : undefined },
          { icon: CalendarCheck2, label: t('home.activeDays'), value: num(s.activeDays) },
          { icon: Flame, label: t('home.streak'), value: num(s.streak) },
        ].map((x, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface p-4 shadow-1 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-2">
            <dt className="flex items-center gap-1.5 text-sm text-muted"><x.icon className="h-4 w-4 text-brand-700" aria-hidden />{x.label}</dt>
            <dd className="mt-1 font-display text-[2rem] font-bold leading-tight text-brand-700 ilg-num" data-testid={`ledger-${i}`}>{x.value}{x.hint && <span className="ms-2 font-sans text-xs font-normal text-muted">{x.hint}</span>}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-8 min-w-0">
          {/* Heatmap */}
          <section aria-labelledby="heat-h">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 id="heat-h" className="font-display text-lg font-bold text-ink">{t('home.heat')}</h2>
              <span className="flex items-center gap-1.5 text-xs text-muted" aria-hidden>{t('home.heatLess')}{[0, 1, 2, 3, 4].map((l) => <span key={l} className={cn('h-2.5 w-2.5 rounded-[2px]', LV[l])} />)}{t('home.heatMore')}</span>
            </div>
            <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface shadow-1 p-5 sm:flex-row sm:items-center">
              <div className="overflow-x-auto">
                <div className="grid grid-flow-col gap-[3px] [grid-auto-columns:16px] [grid-template-rows:repeat(7,16px)]" role="img" aria-label={t('home.heat')} data-testid="heatmap">
                  {cells.map((c) => <span key={c.day} title={t('home.heatCell', { d: date(c.day + 'T12:00:00Z', { day: 'numeric', month: 'short' }), m: c.minutes })} className={cn('rounded-[3px]', LV[c.level], c.day === today && 'ring-2 ring-gold-500 ring-offset-1')} />)}
                </div>
              </div>
              <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:border-s sm:border-line sm:ps-6">
                <div><dt className="text-xs text-muted">{t('home.wk.total')}</dt><dd className="text-lg font-bold text-ink ilg-num">{num(Math.round(cells.reduce((a, c) => a + c.minutes, 0) / 6) / 10)} <span className="text-xs font-normal text-muted">{t('home.wk.hours')}</span></dd></div>
                <div><dt className="text-xs text-muted">{t('home.wk.days')}</dt><dd className="text-lg font-bold text-ink ilg-num">{num(cells.filter((c) => c.minutes > 0).length)} <span className="text-xs font-normal text-muted">/ {num(cells.length)}</span></dd></div>
                <div><dt className="text-xs text-muted">{t('home.wk.best')}</dt><dd className="text-lg font-bold text-ink ilg-num">{num(Math.max(0, ...cells.map((c) => c.minutes)))} <span className="text-xs font-normal text-muted">{t('s.minutes')}</span></dd></div>
                <div><dt className="text-xs text-muted">{t('home.wk.avg')}</dt><dd className="text-lg font-bold text-ink ilg-num">{num(Math.round(cells.reduce((a, c) => a + c.minutes, 0) / Math.max(1, cells.filter((c) => c.minutes > 0).length)))} <span className="text-xs font-normal text-muted">{t('s.minutes')}</span></dd></div>
              </dl>
            </div>
          </section>

          {/* Curriculum progress */}
          <section aria-labelledby="course-h" className="rounded-xl border border-line bg-surface shadow-1 p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="course-h" className="font-display text-lg font-bold text-ink">{t('home.course')}</h2>
              <span className="font-display text-xl font-bold text-brand-700 ilg-num">{num(s.coursePct)}٪</span>
            </div>
            <p className="mb-3 mt-1 text-sm text-muted">{t('home.coursePct', { p: s.coursePct })}</p>
            <Progress value={s.coursePct} label={t('home.course')} tone="brand" />
          </section>

          {/* Ecosystem */}
          <section aria-labelledby="eco-h">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <div><h2 id="eco-h" className="font-display text-lg font-bold text-ink">{t('home.ecosystem')}</h2><p className="text-sm text-muted">{t('home.ecosystemSub')}</p></div>
              <Link to="/services" className="shrink-0 text-sm font-semibold text-brand-700 underline underline-offset-[3px]">{t('home.allServices')}</Link>
            </div>
            <div className="rounded-xl border border-line bg-surface shadow-1 px-5"><EcosystemIndex apps={ECOSYSTEM.slice(0, 5)} compact /></div>
          </section>
        </div>

        <aside className="space-y-8 min-w-0">
          <section aria-labelledby="notes-h">
            <div className="mb-3 flex items-baseline justify-between"><h2 id="notes-h" className="font-display text-lg font-bold text-ink">{t('home.notices')}</h2><Link to="/notifications" className="text-sm font-semibold text-brand-700 underline underline-offset-[3px]">{t('home.allNotices')}</Link></div>
            <div className="rounded-xl border border-line bg-surface shadow-1">
              {notices.length ? (
                <ul className="divide-y divide-line">{notices.map((n) => (
                  <li key={n.id} className="flex gap-3 p-4"><span className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', DOT[n.tone])} aria-hidden /><div><p className="text-sm font-semibold text-ink">{t(n.titleKey, n.vars)}</p><p className="text-sm text-muted">{t(n.bodyKey, n.vars)}</p></div></li>
                ))}</ul>
              ) : <EmptyState title={t('n.empty')} body={t('n.emptyBody')} />}
            </div>
          </section>

          <section aria-labelledby="recent-h">
            <h2 id="recent-h" className="mb-3 font-display text-lg font-bold text-ink">{t('home.recent')}</h2>
            <div className="rounded-xl border border-line bg-surface shadow-1">
              {data.recentLessons.length ? (
                <ol className="divide-y divide-line">{data.recentLessons.map((v) => (
                  <li key={v.id} className="flex items-start gap-3 p-4"><BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden /><div className="min-w-0"><p className="truncate text-sm font-medium text-ink">{v.title}</p>{v.subject?.name && <p className="text-xs text-muted">{v.subject.name}</p>}</div></li>
                ))}</ol>
              ) : <EmptyState title={t('home.recentEmpty')} body={t('home.recentEmptyBody')} action={<a href={MAIN_SITE} target="_blank" rel="noopener noreferrer" className={buttonStyles('secondary', 'sm')}><ExternalLink className="h-4 w-4" aria-hidden />{t('home.openSite')}</a>} />}
            </div>
          </section>
        </aside>
      </div>

      <Dialog open={goalOpen} onClose={() => setGoalOpen(false)} title={t('s.goal')} closeLabel={t('p.cancel')}
        footer={<><Button variant="secondary" onClick={() => setGoalOpen(false)}>{t('p.cancel')}</Button><Button disabled={goalErr} onClick={() => { setGoal(goalVal); setGoalOpen(false); toast({ tone: 'success', text: t('s.saved') }); }} data-testid="goal-save">{t('p.save')}</Button></>}>
        <Input type="number" inputMode="numeric" min={5} max={600} label={`${t('s.goal')} (${t('s.minutes')})`} hint={t('s.goalBody')} value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)} error={goalErr ? '5 – 600' : undefined} data-autofocus data-testid="goal-input" />
      </Dialog>
    </div>
  );
}

const LV = ['bg-cream', 'bg-brand-700/25', 'bg-brand-700/50', 'bg-brand-700/80', 'bg-brand-900'];
const DOT = { gold: 'bg-gold-500', success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger', neutral: 'bg-muted' } as const;
