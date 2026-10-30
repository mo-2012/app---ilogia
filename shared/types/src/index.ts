/** Domain types. Shapes mirror the EXISTING Supabase objects used by ilogia-eg.com (read-only inspection, 2026-10-30). */
export type AppId = 'app' | 'ai' | 'exams' | 'cards' | 'planner' | 'library' | 'arena' | 'verify' | 'api';
export type Locale = 'ar' | 'en';
export type Role = 'student' | 'teacher' | 'admin';

/** public.profiles — only columns confirmed in existing client code. */
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  grade_id?: number | null;
  onboarded_at?: string | null;
  is_platform_admin?: boolean;
  is_teacher?: boolean;
  created_at?: string;
}

/** public.my_subscription (view). */
export interface Subscription {
  status?: 'pending' | 'active' | 'rejected' | 'expired' | string;
  plan_name?: string | null;
  expires_at?: string | null;
  days_left?: number | null;
  is_paid?: boolean;
}

/** rpc my_progress() → { secs, done, days, by } */
export interface Progress {
  secs: number;
  done: number[];
  days: string[];
  by: Record<string, string | number>;
}

export interface Grade { id: number; name: string; stage: string | null; sort_order: number }
export interface Subject { id: number; name: string; icon: string | null; sort_order: number }
export interface VideoSummary { id: number; title: string; unit?: string | null; subject?: { name: string } | null }

/** rpc verify_certificate(p_serial) row. */
export interface CertificateRecord {
  serial: string; student_name: string; subject_name: string | null; grade_name: string | null;
  term: string | null; issued_at: string; revoked: boolean; lessons_completed?: number;
  lessons_total?: number; study_seconds?: number; site_name?: string; site_url?: string;
}

/** Standard JSON envelope for api.ilogia-eg.com */
export type ApiResponse<T> =
  | { ok: true; data: T; meta?: Record<string, unknown> }
  | { ok: false; error: { code: string; message: string; details?: unknown } };
