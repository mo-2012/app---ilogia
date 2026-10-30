import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@ilogia/utilities';

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: NoInfer<T>; label: string; count?: number | string }[]; value: T; onChange(v: NoInfer<T>): void; label: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const rtl = document.documentElement.dir === 'rtl';
    const next = e.key === (rtl ? 'ArrowLeft' : 'ArrowRight') ? 1 : e.key === (rtl ? 'ArrowRight' : 'ArrowLeft') ? -1 : 0;
    if (!next) return; e.preventDefault();
    const j = (i + next + tabs.length) % tabs.length; refs.current[j]?.focus(); onChange(tabs[j].id);
  };
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-line">
      {tabs.map((t, i) => (
        <button key={t.id} ref={(el) => (refs.current[i] = el)} role="tab" aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1}
          onKeyDown={(e) => onKey(e, i)} onClick={() => onChange(t.id)}
          className={cn('relative -mb-px px-3 py-2 text-sm transition-colors', value === t.id ? 'font-semibold text-brand-700 after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:rounded-t after:bg-brand-700' : 'text-muted hover:text-ink')}>
          {t.label}{t.count != null && <span className="ms-1.5 text-xs text-muted">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string; onClick?: () => void }[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" aria-hidden />}
            {i < items.length - 1 && (it.href || it.onClick) ? <a href={it.href} onClick={it.onClick} className="hover:text-brand-700">{it.label}</a> : <span aria-current={i === items.length - 1 ? 'page' : undefined} className={i === items.length - 1 ? 'text-ink' : ''}>{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SearchBar({ value, onChange, placeholder, label }: { value: string; onChange(v: string): void; placeholder: string; label: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      <input type="search" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-10 w-full rounded border border-line bg-surface ps-9 pe-3 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-gold-500/40" />
    </div>
  );
}

export function Pagination({ page, pages, onPage, labels = { prev: 'السابق', next: 'التالي', of: 'من' } }: { page: number; pages: number; onPage(p: number): void; labels?: { prev: string; next: string; of: string } }) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="pagination" className="flex items-center justify-between gap-3 text-sm">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-cream disabled:opacity-40"><ChevronRight className="h-4 w-4 ltr:rotate-180" aria-hidden />{labels.prev}</button>
      <span className="text-muted ilg-num">{page} {labels.of} {pages}</span>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-cream disabled:opacity-40">{labels.next}<ChevronLeft className="h-4 w-4 ltr:rotate-180" aria-hidden /></button>
    </nav>
  );
}

export function Dropdown({ trigger, items, label, align = 'end' }: { trigger: ReactNode; label: string; align?: 'start' | 'end'; items: ({ label: string; onSelect(): void; icon?: ReactNode; danger?: boolean } | 'sep')[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close); document.addEventListener('keydown', key);
    root.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus();
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); };
  }, [open]);
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; e.preventDefault();
    const els = [...(root.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])];
    const i = els.indexOf(document.activeElement as HTMLElement);
    els[(i + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length]?.focus();
  };
  return (
    <div ref={root} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)} className="rounded">{trigger}</button>
      {open && (
        <div role="menu" onKeyDown={onMenuKey} className={cn('ilg-enter absolute top-full z-40 mt-2 min-w-48 rounded border border-line bg-surface p-1 shadow-2', align === 'end' ? 'end-0' : 'start-0')}>
          {items.map((it, i) => it === 'sep' ? <div key={i} className="my-1 h-px bg-line" /> : (
            <button key={i} role="menuitem" onClick={() => { setOpen(false); it.onSelect(); }}
              className={cn('flex w-full items-center gap-2 rounded-sm px-3 py-2 text-start text-sm hover:bg-cream focus:bg-cream focus:outline-none', it.danger ? 'text-danger' : 'text-ink')}>{it.icon}{it.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}
