import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@ilogia/auth';
import { demoDashboard, fetchDashboard, prefs, type DashboardData } from './dashboard';

interface DashState { data: DashboardData | null; loading: boolean; error: unknown; reload(): void; goal: number; setGoal(m: number): void; read: string[]; markRead(ids: string[]): void }
const Ctx = createContext<DashState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { status, client } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [goal, setGoalS] = useState(prefs.goal());
  const [read, setReadS] = useState<string[]>(prefs.readNotices());

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (status === 'demo') setData(demoDashboard());
      else if (status === 'signed_in' && client) setData(await fetchDashboard(client));
    } catch (e) { setError(e); } finally { setLoading(false); }
  }, [status, client]);

  useEffect(() => { if (status === 'demo' || status === 'signed_in') load(); }, [status, load]);

  return (
    <Ctx.Provider value={{ data, loading, error, reload: load, goal, read,
      setGoal: (m) => { prefs.setGoal(m); setGoalS(prefs.goal()); },
      markRead: (ids) => { const next = [...new Set([...read, ...ids])]; prefs.setRead(next); setReadS(next); } }}>
      {children}
    </Ctx.Provider>
  );
}
export function useDashboard() { const v = useContext(Ctx); if (!v) throw new Error('useDashboard outside provider'); return v; }
