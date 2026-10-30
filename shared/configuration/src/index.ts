import type { AppId } from '@ilogia/types';

export type AppStatus = 'live' | 'building' | 'planned';
export interface EcosystemApp {
  id: AppId; order: number; nameAr: string; nameEn: string; descAr: string; descEn: string;
  domain: string; repo: string; icon: string; status: AppStatus;
}

/** Registry of the ecosystem. `status` is the honest build state — only `live` apps get clickable links. */
export const ECOSYSTEM: EcosystemApp[] = [
  { id: 'app', order: 1, nameAr: 'لوحة الطالب', nameEn: 'Student Dashboard', descAr: 'نقطة الدخول إلى منظومة iLogia: تقدّمك وإشعاراتك وحسابك.', descEn: 'Your entry point: progress, notifications and account.', domain: 'app.ilogia-eg.com', repo: 'mo-2012/app---ilogia', icon: 'LayoutDashboard', status: 'live' },
  { id: 'exams', order: 2, nameAr: 'الاختبارات', nameEn: 'Exams', descAr: 'اختبارات موقوتة تُصحَّح على الخادم مع مراجعة الإجابات.', descEn: 'Timed, server-graded exams with answer review.', domain: 'exams.ilogia-eg.com', repo: 'mo-2012/exams---ilogia', icon: 'ClipboardCheck', status: 'planned' },
  { id: 'cards', order: 3, nameAr: 'البطاقات التعليمية', nameEn: 'Flashcards', descAr: 'مراجعة متباعدة ببطاقات سؤال وجواب.', descEn: 'Spaced review with question/answer cards.', domain: 'cards.ilogia-eg.com', repo: 'mo-2012/cards---ilogia', icon: 'Layers', status: 'planned' },
  { id: 'planner', order: 4, nameAr: 'مخطط المذاكرة', nameEn: 'Study Planner', descAr: 'جدول يومي وأسبوعي، مهام، أهداف ومواعيد.', descEn: 'Daily/weekly schedule, tasks, goals and deadlines.', domain: 'planner.ilogia-eg.com', repo: 'mo-2012/planner---ilogia', icon: 'CalendarDays', status: 'planned' },
  { id: 'library', order: 5, nameAr: 'المكتبة التعليمية', nameEn: 'Library', descAr: 'مذكرات وملفات ودروس مرتبة حسب المادة والصف.', descEn: 'Notes, files and lessons by subject and grade.', domain: 'library.ilogia-eg.com', repo: 'mo-2012/library---ilogia', icon: 'LibraryBig', status: 'planned' },
  { id: 'arena', order: 6, nameAr: 'ساحة التحدي', nameEn: 'Learning Arena', descAr: 'تحديات ونقاط ومستويات وإنجازات.', descEn: 'Challenges, points, levels and achievements.', domain: 'arena.ilogia-eg.com', repo: 'mo-2012/arena---ilogia', icon: 'Trophy', status: 'planned' },
  { id: 'ai', order: 7, nameAr: 'المساعد الذكي', nameEn: 'AI Assistant', descAr: 'شرح وتلخيص وأسئلة تدريبية بالعربية.', descEn: 'Explanations, summaries and practice questions.', domain: 'ai.ilogia-eg.com', repo: 'mo-2012/ai---ilogia', icon: 'Sparkles', status: 'planned' },
  { id: 'verify', order: 8, nameAr: 'التحقق من الشهادات', nameEn: 'Certificate Verification', descAr: 'تحقّق علني من صحة شهادات iLogia برقمها.', descEn: 'Public verification of iLogia certificates.', domain: 'verify.ilogia-eg.com', repo: 'mo-2012/verify---ilogia', icon: 'BadgeCheck', status: 'planned' },
];

export const appUrl = (id: AppId, path = '') => {
  const a = ECOSYSTEM.find((x) => x.id === id);
  return a ? `https://${a.domain}/${path.replace(/^\//, '')}` : '#';
};

export const MAIN_SITE = 'https://ilogia-eg.com';
export const API_BASE_DEFAULT = 'https://api.ilogia-eg.com/v1';
export const TIMEZONE = 'Africa/Cairo';

export interface RuntimeEnv { supabaseUrl: string | null; supabaseKey: string | null; apiBase: string; cookieDomain: string | null }

/** Reads VITE_* env. Only PUBLIC values are allowed here — never a service-role key. */
export function readEnv(env: Record<string, string | undefined>): RuntimeEnv {
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || null;
  if (key && /service_role|sb_secret_/i.test(key)) throw new Error('Refusing to start: a secret Supabase key was provided to the browser.');
  return {
    supabaseUrl: env.VITE_SUPABASE_URL || null,
    supabaseKey: key,
    apiBase: env.VITE_API_BASE || API_BASE_DEFAULT,
    cookieDomain: env.VITE_COOKIE_DOMAIN || null,
  };
}
