import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '@ilogia/types';
import { useAuth } from './AuthProvider';

export function RequireAuth({ children, role, fallback }: { children: ReactNode; role?: Role; fallback?: ReactNode }) {
  const { status, roles } = useAuth();
  const loc = useLocation();
  if (status === 'loading') return <>{fallback ?? null}</>;
  if (status === 'signed_out') return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  if (role && !roles.includes(role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Only allow in-app relative redirects (blocks open redirects such as ?next=https://evil.example). */
export function safeNext(raw: string | null, fallback = '/') {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || /^\/(login|register|forgot)/.test(raw)) return fallback;
  return raw;
}
