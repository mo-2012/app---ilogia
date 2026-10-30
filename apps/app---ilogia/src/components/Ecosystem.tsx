import { ArrowUpLeft } from 'lucide-react';
import { ECOSYSTEM, type EcosystemApp } from '@ilogia/configuration';
import { Badge, useI18n } from '@ilogia/ui';
import { cn, toArabicDigits } from '@ilogia/utilities';

/** "Table of contents" index of the ecosystem — only live apps are clickable (no dead links). */
export function EcosystemIndex({ apps = ECOSYSTEM, compact }: { apps?: EcosystemApp[]; compact?: boolean }) {
  const { t, locale, digits } = useI18n();
  const num = (n: number) => { const s = String(n).padStart(2, '0'); return locale === 'ar' && digits === 'arab' ? toArabicDigits(s) : s; };
  return (
    <ol className="divide-y divide-line">
      {apps.map((a) => {
        const live = a.status === 'live'; const self = a.id === 'app';
        const body = (
          <>
            <span className="w-8 shrink-0 font-display text-lg font-bold text-gold-700 ilg-num" aria-hidden>{num(a.order)}</span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{locale === 'ar' ? a.nameAr : a.nameEn}</span>
                <Badge tone={live ? 'success' : 'neutral'}>{self ? (locale === 'ar' ? 'أنت هنا' : 'You are here') : t(`status.${a.status}`)}</Badge>
              </span>
              {!compact && <span className="mt-0.5 block text-sm text-muted">{locale === 'ar' ? a.descAr : a.descEn}</span>}
            </span>
            <span dir="ltr" className="hidden shrink-0 text-xs text-muted md:block">{a.domain}</span>
            {live && !self && <ArrowUpLeft className="h-4 w-4 shrink-0 text-brand-700 ltr:-scale-x-100" aria-hidden />}
          </>
        );
        const cls = cn('flex items-center gap-4 py-3.5', !live && 'opacity-80');
        return (
          <li key={a.id} data-testid={`eco-${a.id}`}>
            {live && !self ? <a href={`https://${a.domain}`} className={cn(cls, 'rounded transition-colors hover:bg-cream')}>{body}</a> : <div className={cls} aria-disabled={!live || undefined}>{body}</div>}
          </li>
        );
      })}
    </ol>
  );
}
