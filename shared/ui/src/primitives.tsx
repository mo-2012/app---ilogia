import { forwardRef, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@ilogia/utilities';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
const V: Record<Variant, string> = {
  primary: 'bg-brand-900 text-white border border-brand-700 hover:bg-brand-800 hover:border-brand-800',
  secondary: 'bg-surface text-ink border border-line hover:bg-cream hover:border-brand-700 hover:text-brand-800',
  ghost: 'text-brand-900 hover:bg-cream',
  gold: 'bg-gold-500 text-ink border border-gold-500 hover:bg-[#c29f2e]',
  danger: 'bg-surface text-danger border border-danger hover:bg-danger-bg',
};
export const buttonStyles = (variant: Variant = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => cn('inline-flex items-center justify-center gap-2 rounded font-semibold transition-[background,border,color,filter,transform] duration-150 ease-ilg active:scale-[.97] disabled:opacity-55 disabled:pointer-events-none select-none whitespace-nowrap',
  size === 'sm' ? 'h-9 px-3.5 text-sm' : size === 'lg' ? 'h-12 px-6 text-sm' : 'h-11 px-5 text-sm', V[variant]);
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: 'sm' | 'md' | 'lg'; loading?: boolean; icon?: ReactNode }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', size = 'md', loading, icon, className, children, disabled, ...p }, ref) {
  return (
    <button ref={ref} disabled={disabled || loading} aria-busy={loading || undefined}
      className={cn(buttonStyles(variant, size), className)} {...p}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
});

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { label: string }>(function IconButton({ label, className, children, ...p }, ref) {
  return <button ref={ref} aria-label={label} title={label} className={cn('inline-flex h-9 w-9 items-center justify-center rounded text-ink hover:bg-cream transition-colors', className)} {...p}>{children}</button>;
});

const fieldCls = 'w-full rounded border border-line bg-surface px-3.5 text-base text-ink placeholder:text-[#8A9690] transition-[border,box-shadow] focus:border-brand-700 focus:outline-none focus:ring-[3px] focus:ring-brand-700/20 aria-[invalid=true]:border-danger disabled:bg-cream disabled:text-muted';

export function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; id: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      {children}
      {error ? <p id={`${id}-err`} role="alert" className="text-xs text-danger">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hint?: string }>(function Input({ label, error, hint, className, id, ...p }, ref) {
  const auto = useId(); const fid = id ?? auto;
  const el = <input ref={ref} id={fid} aria-invalid={!!error || undefined} aria-describedby={error ? `${fid}-err` : undefined} className={cn(fieldCls, 'h-12', className)} {...p} />;
  return label ? <Field id={fid} label={label} error={error} hint={hint}>{el}</Field> : el;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(function Textarea({ label, error, className, id, ...p }, ref) {
  const auto = useId(); const fid = id ?? auto;
  const el = <textarea ref={ref} id={fid} aria-invalid={!!error || undefined} className={cn(fieldCls, 'py-2 min-h-24', className)} {...p} />;
  return label ? <Field id={fid} label={label} error={error}>{el}</Field> : el;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; options: { value: string; label: string }[] }>(function Select({ label, error, options, className, id, ...p }, ref) {
  const auto = useId(); const fid = id ?? auto;
  const el = <select ref={ref} id={fid} aria-invalid={!!error || undefined} className={cn(fieldCls, 'h-12 pe-8', className)} {...p}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
  return label ? <Field id={fid} label={label} error={error}>{el}</Field> : el;
});

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange(v: boolean): void; label: string; id?: string }) {
  return (
    <button type="button" role="switch" id={id} aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cn('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors', checked ? 'bg-brand-700' : 'bg-line')}>
      <span className={cn('absolute h-5 w-5 rounded-full bg-white shadow-1 transition-[inset-inline-start] duration-200 ease-ilg', checked ? 'start-[22px]' : 'start-0.5')} />
    </button>
  );
}

export function Badge({ tone = 'neutral', children, className }: { tone?: 'neutral' | 'gold' | 'success' | 'danger' | 'warning' | 'brand'; children: ReactNode; className?: string }) {
  const T = { neutral: 'bg-brand-100 text-brand-800', gold: 'bg-gold-100 text-gold-700 border border-gold-500/40', success: 'bg-success-bg text-success', danger: 'bg-danger-bg text-danger', warning: 'bg-warning-bg text-warning', brand: 'bg-brand-900 text-white' };
  return <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-2.5 py-0.5 text-xs font-semibold', T[tone], className)}>{children}</span>;
}
