import { describe, expect, it } from 'vitest';
import { addDays, cairoDay, cookieStorage, memoryStorage, studyStreak, toArabicDigits, formatNumber } from './index';

describe('dates (Africa/Cairo)', () => {
  it('addDays crosses months/years', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
  it('cairoDay uses Cairo, not UTC', () => {
    // 2026-10-30 22:30 UTC is 2026-10-31 in Cairo (UTC+2 or +3)
    expect(cairoDay(new Date('2026-10-30T22:30:00Z'))).toBe('2026-10-31');
  });
  it('studyStreak counts consecutive days ending today or yesterday', () => {
    expect(studyStreak(['2026-10-28', '2026-10-29', '2026-10-30'], '2026-10-30')).toBe(3);
    expect(studyStreak(['2026-10-28', '2026-10-29'], '2026-10-30')).toBe(2);
    expect(studyStreak(['2026-10-27'], '2026-10-30')).toBe(0);
    expect(studyStreak([], '2026-10-30')).toBe(0);
  });
});

describe('formatting', () => {
  it('arabic digits', () => { expect(toArabicDigits('2026')).toBe('٢٠٢٦'); expect(formatNumber(12, 'ar', 'latn')).toBe('12'); });
});

describe('storage', () => {
  it('memory storage round-trips', () => { const s = memoryStorage(); s.setItem('a', '1'); expect(s.getItem('a')).toBe('1'); s.removeItem('a'); expect(s.getItem('a')).toBeNull(); });
  it('cookie storage chunks large values and cleans up', () => {
    const jar = new Map<string, string>();
    const doc = { get cookie() { return [...jar].map(([k, v]) => `${k}=${v}`).join('; '); },
      set cookie(c: string) { const [kv, ...attrs] = c.split('; '); const i = kv.indexOf('='); const k = kv.slice(0, i); if (attrs.includes('Max-Age=0')) jar.delete(k); else jar.set(k, kv.slice(i + 1)); } } as unknown as Document;
    const s = cookieStorage('.ilogia-eg.com', doc);
    const big = 'x'.repeat(7500);
    s.setItem('k', big); expect(jar.get('k.n')).toBe('3'); expect(s.getItem('k')).toBe(big);
    s.setItem('k', 'small'); expect(jar.get('k.n')).toBe('1'); expect(jar.has('k.1')).toBe(false); expect(s.getItem('k')).toBe('small');
    s.removeItem('k'); expect(s.getItem('k')).toBeNull();
  });
});
