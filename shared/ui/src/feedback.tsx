import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X, Inbox, RotateCw } from 'lucide-react';
import { cn } from '@ilogia/utilities';
import { Button, IconButton } from './primitives';

export function Spinner({ label = 'جارٍ التحميل', className }: { label?: string; className?: string }) {
  return <span role="status" aria-label={label} className={cn('inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-100 border-t-brand-700', className)} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('rounded bg-[linear-gradient(90deg,rgb(var(--ilg-line))_25%,rgb(var(--ilg-brand-100))_50%,rgb(var(--ilg-line))_75%)] bg-[length:200%_100%] animate-[ilg-shimmer_1.4s_linear_infinite]', className)} />;
}

export function EmptyState({ title, body, action, icon }: { title: string; body?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="text-muted">{icon ?? <Inbox className="h-8 w-8" aria-hidden />}</div>
      <p className="font-semibold text-ink">{title}</p>
      {body && <p className="max-w-sm text-sm text-muted">{body}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title, body, onRetry, retryLabel = 'إعادة المحاولة' }: { title: string; body?: string; onRetry?: () => void; retryLabel?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <AlertTriangle className="h-8 w-8 text-danger" aria-hidden />
      <p className="font-semibold text-ink">{title}</p>
      {body && <p className="max-w-sm text-sm text-muted">{body}</p>}
      {onRetry && <Button variant="secondary" size="sm" icon={<RotateCw className="h-4 w-4" />} onClick={onRetry}>{retryLabel}</Button>}
    </div>
  );
}

/* ---------- Toast ---------- */
type Toast = { id: number; tone: 'success' | 'error' | 'info'; text: string };
const ToastCtx = createContext<(t: Omit<Toast, 'id'>) => void>(() => {});
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x.slice(-2), { ...t, id }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 4200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
        {items.map((t) => {
          const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? AlertTriangle : Info;
          return (
            <div key={t.id} role="status" className="ilg-enter pointer-events-auto flex max-w-md items-center gap-3 rounded-lg border-s-4 border-gold-500 bg-ink px-5 py-3 text-sm text-white shadow-2">
              <Icon className={cn('h-4 w-4 shrink-0', t.tone === 'success' ? 'text-gold-500' : t.tone === 'error' ? 'text-[#ff9d92]' : 'text-white/70')} aria-hidden />
              <span>{t.text}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

/* ---------- Dialog / Modal ---------- */
export function Dialog({ open, onClose, title, children, footer, closeLabel = 'إغلاق' }: { open: boolean; onClose(): void; title: string; children: ReactNode; footer?: ReactNode; closeLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current; el?.querySelector<HTMLElement>('[data-autofocus],button,input,select,textarea,a[href]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && el) {
        const f = [...el.querySelectorAll<HTMLElement>('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter((x) => !x.hasAttribute('disabled'));
        if (!f.length) return; const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="ilg-enter relative w-full max-w-lg rounded-t-[20px] border border-line bg-surface shadow-2 sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <IconButton label={closeLabel} onClick={onClose}><X className="h-4 w-4" /></IconButton>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
      </div>
    </div>, document.body);
}
export const Modal = Dialog;

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span role="tooltip" className="pointer-events-none absolute bottom-full start-1/2 z-40 mb-2 -translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">{label}</span>
    </span>
  );
}
