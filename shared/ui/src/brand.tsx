import { cn } from '@ilogia/utilities';
/** The ilogia-eg.com mark: graduation cap on a green tile with a gold tassel dot (same as the main site favicon). */
export function LogoMark({ size = 40, className, inverted }: { size?: number; className?: string; inverted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="ilogia" className={cn('shrink-0', className)}>
      <rect width="64" height="64" rx="14" fill={inverted ? '#FFFFFF' : '#136F58'} />
      <g fill="none" stroke={inverted ? '#136F58' : '#fff'} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 26l22-11 22 11-22 11z" /><path d="M18 31v12c0 3.5 6.3 7 14 7s14-3.5 14-7V31" /><path d="M54 26v14" />
      </g>
      <circle cx="54" cy="43" r="2.6" fill="#D4AF37" />
    </svg>
  );
}
export function Wordmark({ className, sub, inverted, size = 40 }: { className?: string; sub?: string; inverted?: boolean; size?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark inverted={inverted} size={size} />
      <span className="leading-tight">
        <b dir="ltr" className={cn('block font-display text-[1.35rem] font-bold leading-none', inverted ? 'text-white' : 'text-brand-900')}>ilogia</b>
        {sub && <small className={cn('mt-1 block text-xs font-normal', inverted ? 'text-white/75' : 'text-muted')}>{sub}</small>}
      </span>
    </span>
  );
}
