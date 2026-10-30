import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Profile, Role } from '@ilogia/types';
import { withTimeout } from './errors';

export type AuthStatus = 'loading' | 'signed_out' | 'signed_in' | 'demo';

export interface AuthState {
  status: AuthStatus;
  client: SupabaseClient | null;
  configured: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: Role[];
  signIn(email: string, password: string): Promise<void>;
  signUp(fullName: string, email: string, password: string): Promise<{ needsConfirmation: boolean }>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  enterDemo(): void;
  refreshProfile(): Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export const DEMO_PROFILE: Profile = { id: 'demo', email: 'demo@ilogia.local', full_name: 'طالب تجريبي', onboarded_at: '2026-01-01' };

export function AuthProvider({ client, children, redirectTo }: { client: SupabaseClient | null; children: ReactNode; redirectTo?: string }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const loadProfile = useCallback(async (s: Session | null) => {
    if (!client || !s) { setProfile(null); setRoles([]); return; }
    const u = s.user;
    const { data } = await withTimeout(client.from('profiles').select('*').eq('id', u.id).maybeSingle());
    const meta = (u.user_metadata || {}) as Record<string, string>;
    const p: Profile = (data as Profile) || { id: u.id, email: u.email ?? null, full_name: meta.full_name || meta.name || null };
    setProfile(p);
    const r: Role[] = ['student'];
    // Role checks are server-side RPCs (existing): the client never decides its own role.
    try { const a = await client.rpc('is_admin'); if (a.data) r.push('admin'); } catch { /* ignore */ }
    if (p.is_teacher) r.push('teacher');
    setRoles(r);
  }, [client]);

  useEffect(() => {
    if (!client) { setStatus('signed_out'); return; }
    let alive = true;
    client.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      setSession(data.session);
      try { await loadProfile(data.session); } catch { /* profile is optional */ }
      setStatus(data.session ? 'signed_in' : 'signed_out');
    });
    // Never await supabase calls inside this callback (supabase-js holds an internal lock) — defer instead.
    const { data: sub } = client.auth.onAuthStateChange((_e, s) => {
      setTimeout(async () => {
        if (!alive) return;
        setSession(s);
        try { await loadProfile(s); } catch { /* ignore */ }
        setStatus((prev) => (prev === 'demo' ? prev : s ? 'signed_in' : 'signed_out'));
      }, 0);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [client, loadProfile]);

  const need = () => { if (!client) throw new Error('not_configured'); return client; };

  const value = useMemo<AuthState>(() => ({
    status, client, configured: !!client, session, user: session?.user ?? null,
    profile: status === 'demo' ? DEMO_PROFILE : profile,
    roles: status === 'demo' ? ['student'] : roles,
    async signIn(email, password) {
      const { error } = await withTimeout(need().auth.signInWithPassword({ email: email.trim(), password }));
      if (error) throw error;
    },
    async signUp(fullName, email, password) {
      const { data, error } = await withTimeout(need().auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() }, emailRedirectTo: redirectTo } }));
      if (error) throw error;
      // Supabase returns a user with no identities when the email already exists (anti-enumeration).
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) throw new Error('User already registered');
      return { needsConfirmation: !data.session };
    },
    async resetPassword(email) {
      const { error } = await withTimeout(need().auth.resetPasswordForEmail(email.trim(), { redirectTo }));
      if (error) throw error;
    },
    async signOut() {
      if (status === 'demo') { setStatus('signed_out'); return; }
      if (client) await client.auth.signOut();
      setSession(null); setProfile(null); setRoles([]); setStatus('signed_out');
    },
    enterDemo() { setStatus('demo'); },
    async refreshProfile() { await loadProfile(session); },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [status, client, session, profile, roles, loadProfile, redirectTo]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
