import type { SupabaseClient } from '@supabase/supabase-js';
import type { Grade, Profile, Progress, Subscription, VideoSummary } from '@ilogia/types';
import { addDays, cairoDay, safeLocalStorage, studyStreak } from '@ilogia/utilities';
import { withTimeout } from '@ilogia/auth';

export interface DashboardData {
  progress: Progress;
  subscription: Subscription | null;
  totalLessons: number;
  recentLessons: VideoSummary[];
  grades: Grade[];
  sample: boolean;
}

const emptyProgress: Progress = { secs: 0, done: [], days: [], by: {} };

function normalizeProgress(d: unknown): Progress {
  const x = (d && typeof d === 'object' ? d : {}) as Partial<Progress>;
  return { secs: Number(x.secs) || 0, done: Array.isArray(x.done) ? x.done.map(Number) : [], days: Array.isArray(x.days) ? x.days.map(String) : [], by: x.by && typeof x.by === 'object' ? x.by : {} };
}

/** Reads ONLY existing objects (RLS-protected) used by ilogia-eg.com: my_progress, my_subscription, videos, grades. */
export async function fetchDashboard(sb: SupabaseClient): Promise<DashboardData> {
  const [pr, sub, vids, grades] = await withTimeout(Promise.all([
    sb.rpc('my_progress'),
    sb.from('my_subscription').select('*').maybeSingle(),
    sb.from('videos').select('id,title,unit,subject:subjects(name)').order('id'),
    sb.from('grades').select('*').order('sort_order'),
  ]), 20000);
  if (pr.error && vids.error) throw pr.error;
  const progress = pr.error ? emptyProgress : normalizeProgress(pr.data);
  const videos = (vids.data ?? []) as unknown as VideoSummary[];
  const byId = new Map(videos.map((v) => [Number(v.id), v]));
  const recentLessons = [...progress.done].reverse().map((id) => byId.get(id)).filter(Boolean).slice(0, 5) as VideoSummary[];
  return { progress, subscription: (sub.data as Subscription) ?? null, totalLessons: videos.length, recentLessons, grades: (grades.data ?? []) as Grade[], sample: false };
}

/** Clearly-labelled SAMPLE data for demo mode. Deterministic, relative to today; never shown as real. */
export function demoDashboard(today = cairoDay()): DashboardData {
  const by: Record<string, number> = {}; const days: string[] = [];
  for (let i = 83; i >= 0; i--) {
    const d = addDays(today, -i); const seed = (i * 37 + 11) % 10; const ramp = 1 - i / 120;
    if (i < 6 || seed > 4) { const s = Math.round((seed * 7 + 6) * ramp) * 60; by[d] = s; days.push(d); }
  }
  by[today] = 22 * 60;
  const secs = Object.values(by).reduce((a, b) => a + b, 0);
  const lessons: VideoSummary[] = [
    { id: 105, title: 'درس تجريبي: المعادلات من الدرجة الأولى', subject: { name: 'الرياضيات' } },
    { id: 104, title: 'درس تجريبي: أجزاء الخلية', subject: { name: 'العلوم' } },
    { id: 103, title: 'درس تجريبي: الجملة الاسمية', subject: { name: 'اللغة العربية' } },
    { id: 102, title: 'درس تجريبي: المتغيرات في البرمجة', subject: { name: 'البرمجة' } },
  ];
  return { progress: { secs, done: [101, 102, 103, 104, 105], days, by }, subscription: { status: 'active', plan_name: 'باقة تجريبية', days_left: 5, is_paid: true }, totalLessons: 40, recentLessons: lessons, grades: [{ id: 9, name: 'الصف الثالث الإعدادي', stage: 'إعدادي', sort_order: 9 }], sample: true };
}

export function summarize(d: DashboardData, today = cairoDay()) {
  const minutesToday = Math.round(Number(d.progress.by[today] || 0) / 60);
  return {
    hours: d.progress.secs / 3600,
    lessons: d.progress.done.length,
    activeDays: new Set(d.progress.days).size,
    streak: studyStreak(d.progress.days, today),
    minutesToday,
    coursePct: d.totalLessons ? Math.round((d.progress.done.length / d.totalLessons) * 100) : 0,
  };
}

/** Weeks start on Saturday (Egyptian school week); rows = weekdays. Ends today; level 0–4 by minutes. */
export function heatmap(by: Progress['by'], today = cairoDay(), weeks = 12) {
  const cells: { day: string; minutes: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
  const [y, m, d] = today.split('-').map(Number);
  const sinceSat = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 1) % 7; // Sat=0 … Fri=6
  const total = (weeks - 1) * 7 + sinceSat + 1;
  for (let i = total - 1; i >= 0; i--) {
    const day = addDays(today, -i); const minutes = Math.round(Number(by[day] || 0) / 60);
    const level = (minutes === 0 ? 0 : minutes < 15 ? 1 : minutes < 30 ? 2 : minutes < 60 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
    cells.push({ day, minutes, level });
  }
  return cells;
}

export interface Notice { id: string; tone: 'gold' | 'success' | 'warning' | 'danger' | 'neutral'; titleKey: string; bodyKey: string; vars?: Record<string, string | number>; href?: string }

/** Notifications are DERIVED from real account state — there is no notifications table in the existing schema. */
export function buildNotices(d: DashboardData, profile: Profile | null, goalMinutes: number, today = cairoDay()): Notice[] {
  const out: Notice[] = []; const s = summarize(d, today); const sub = d.subscription;
  const plan = sub?.plan_name || '—'; const left = Number(sub?.days_left ?? 0);
  if (sub?.status === 'pending') out.push({ id: 'sub-pending', tone: 'warning', titleKey: 'n.subPending.t', bodyKey: 'n.subPending.b' });
  if (sub?.status === 'rejected') out.push({ id: 'sub-rejected', tone: 'danger', titleKey: 'n.subRejected.t', bodyKey: 'n.subRejected.b' });
  if (sub?.status === 'active' && left > 0 && left <= 7) out.push({ id: `sub-exp-${sub.expires_at ?? left}`, tone: 'warning', titleKey: 'n.subExpiring.t', bodyKey: 'n.subExpiring.b', vars: { n: left, plan } });
  else if (sub?.status === 'active') out.push({ id: `sub-active-${sub.expires_at ?? ''}`, tone: 'success', titleKey: 'n.subActive.t', bodyKey: 'n.subActive.b', vars: { n: left, plan } });
  if (profile && profile.onboarded_at === null) out.push({ id: 'setup', tone: 'gold', titleKey: 'n.setup.t', bodyKey: 'n.setup.b', href: '/profile' });
  if (s.minutesToday >= goalMinutes) out.push({ id: `goal-${today}`, tone: 'success', titleKey: 'n.goal.t', bodyKey: 'n.goal.b', vars: { m: s.minutesToday } });
  if (s.streak >= 3) out.push({ id: `streak-${today}`, tone: 'gold', titleKey: 'n.streak.t', bodyKey: 'n.streak.b', vars: { n: s.streak } });
  return out;
}

const store = safeLocalStorage();
export const prefs = {
  goal: () => Math.min(600, Math.max(5, Number(store.getItem('ilg.goal')) || 30)),
  setGoal: (m: number) => store.setItem('ilg.goal', String(Math.round(Math.min(600, Math.max(5, m))))),
  readNotices: (): string[] => { try { return JSON.parse(store.getItem('ilg.read') || '[]'); } catch { return []; } },
  setRead: (ids: string[]) => store.setItem('ilg.read', JSON.stringify(ids.slice(-200))),
};
