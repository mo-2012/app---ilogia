import type { Locale } from '@ilogia/types';
export const TZ = 'Africa/Cairo';

export const toArabicDigits = (s: string | number) => String(s).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

export function formatNumber(n: number, locale: Locale = 'ar', digits: 'arab' | 'latn' = 'arab') {
  return new Intl.NumberFormat(locale === 'ar' ? `ar-EG-u-nu-${digits}` : 'en-US', { maximumFractionDigits: 1 }).format(n);
}

export function formatDate(d: Date | string, locale: Locale = 'ar', opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }, digits: 'arab' | 'latn' = 'arab') {
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locale === 'ar' ? `ar-EG-u-nu-${digits}` : 'en-GB', { timeZone: TZ, ...opts }).format(date);
}

/** YYYY-MM-DD for a date as seen in Cairo. */
export function cairoDay(d: Date = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  return `${g('year')}-${g('month')}-${g('day')}`;
}

export function cairoHour(d: Date = new Date()) {
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(d));
}

export function relativeTime(d: Date | string, locale: Locale = 'ar', now: Date = new Date()) {
  const date = typeof d === 'string' ? new Date(d) : d;
  const diff = (date.getTime() - now.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-EG' : 'en', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [u, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
  return rtf.format(0, 'minute');
}

/** Shift a YYYY-MM-DD string by n days (calendar math in UTC to avoid DST drift). */
export function addDays(day: string, n: number) {
  const [y, m, d] = day.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

/** Current streak of consecutive study days ending today or yesterday (Cairo time). */
export function studyStreak(days: string[], today: string = cairoDay()) {
  const set = new Set(days.map((x) => x.slice(0, 10)));
  let cur = set.has(today) ? today : addDays(today, -1);
  let n = 0; while (set.has(cur)) { n++; cur = addDays(cur, -1); }
  return n;
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
