import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '@ilogia/types';
import { formatDate, formatNumber, safeLocalStorage } from '@ilogia/utilities';

export type Dict = Record<string, string>;
interface I18n { locale: Locale; dir: 'rtl' | 'ltr'; digits: 'arab' | 'latn'; t(key: string, vars?: Record<string, string | number>): string;
  setLocale(l: Locale): void; setDigits(d: 'arab' | 'latn'): void; num(n: number): string; date(d: Date | string, o?: Intl.DateTimeFormatOptions): string }
const Ctx = createContext<I18n | null>(null);
const store = safeLocalStorage();

export function LocaleProvider({ dicts, children }: { dicts: Record<Locale, Dict>; children: ReactNode }) {
  const [locale, setLocaleS] = useState<Locale>(() => (store.getItem('ilg.locale') as Locale) || 'ar');
  const [digits, setDigitsS] = useState<'arab' | 'latn'>(() => (store.getItem('ilg.digits') as 'arab' | 'latn') || 'arab');
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = dir; }, [locale, dir]);
  const value = useMemo<I18n>(() => ({
    locale, dir, digits,
    t(key, vars) {
      let s = dicts[locale][key] ?? dicts.ar[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, typeof v === 'number' ? formatNumber(v, locale, digits) : v);
      return s;
    },
    setLocale(l) { store.setItem('ilg.locale', l); setLocaleS(l); },
    setDigits(d) { store.setItem('ilg.digits', d); setDigitsS(d); },
    num: (n) => formatNumber(n, locale, digits),
    date: (d, o) => formatDate(d, locale, o, digits),
  }), [locale, dir, digits, dicts]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useI18n() { const v = useContext(Ctx); if (!v) throw new Error('useI18n outside LocaleProvider'); return v; }
