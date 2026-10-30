import { describe, expect, it } from 'vitest';
import { buildNotices, demoDashboard, heatmap, summarize } from '../data/dashboard';

describe('dashboard data', () => {
  const today = '2026-10-30';
  it('demo data is flagged as sample', () => { expect(demoDashboard(today).sample).toBe(true); });
  it('summarize computes stats from my_progress shape', () => {
    const d = { ...demoDashboard(today), progress: { secs: 7200, done: [1, 2], days: ['2026-10-29', '2026-10-30'], by: { '2026-10-30': 1800 } }, totalLessons: 8 };
    expect(summarize(d, today)).toMatchObject({ hours: 2, lessons: 2, activeDays: 2, streak: 2, minutesToday: 30, coursePct: 25 });
  });
  it('heatmap starts on a Saturday and ends today', () => {
    const c = heatmap({ '2026-10-30': 3600 }, today); // 2026-10-30 is a Friday → full last week
    expect(c).toHaveLength(84); expect(new Date(c[0].day + 'T00:00:00Z').getUTCDay()).toBe(6);
    expect(heatmap({}, '2026-11-01')).toHaveLength(79); // Sunday → 11 weeks + Sat, Sun expect(c.at(-1)).toMatchObject({ day: today, minutes: 60, level: 4 });
  });
  it('notices derive from real state only', () => {
    const base = { ...demoDashboard(today), progress: { secs: 0, done: [], days: [], by: {} } };
    expect(buildNotices({ ...base, subscription: null }, null, 30, today)).toEqual([]);
    const n = buildNotices({ ...base, subscription: { status: 'pending' } }, { id: 'x', email: null, full_name: null, onboarded_at: null }, 30, today);
    expect(n.map((x) => x.id)).toEqual(['sub-pending', 'setup']);
  });
});
