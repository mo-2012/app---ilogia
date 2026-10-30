import type { ReactNode } from 'react';
import { cn } from '@ilogia/utilities';

export function Progress({ value, max = 100, label, tone = 'gold', className }: { value: number; max?: number; label: string; tone?: 'gold' | 'brand'; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} className={cn('h-2 w-full overflow-hidden rounded-full bg-cream', className)}>
      <div className={cn('h-full rounded-full transition-[width] duration-700 ease-ilg', tone === 'gold' ? 'bg-gold-500' : 'bg-brand-700')} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs text-muted">{icon}{label}</div>
      <div className="mt-1 font-display text-[1.75rem] font-bold leading-tight text-brand-700 ilg-num">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}

export function Avatar({ name, src, size = 36 }: { name: string | null | undefined; src?: string | null; size?: number }) {
  const initials = (name || '؟').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
  return src ? <img src={src} alt="" width={size} height={size} className="rounded-full object-cover" /> : (
    <span aria-hidden style={{ width: size, height: size, fontSize: size * 0.38 }} className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold-100 font-semibold text-gold-700">{initials}</span>
  );
}

export interface Column<T> { key: string; header: string; cell(row: T): ReactNode; className?: string }
export function DataTable<T>({ columns, rows, rowKey, caption, empty }: { columns: Column<T>[]; rows: T[]; rowKey(r: T): string | number; caption: string; empty?: ReactNode }) {
  if (!rows.length && empty) return <>{empty}</>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead><tr className="border-b border-line text-start text-xs text-muted">{columns.map((c) => <th key={c.key} scope="col" className={cn('px-3 py-2 text-start font-medium', c.className)}>{c.header}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={rowKey(r)} className="border-b border-line/70 last:border-0 hover:bg-cream">{columns.map((c) => <td key={c.key} className={cn('px-3 py-2.5', c.className)}>{c.cell(r)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
