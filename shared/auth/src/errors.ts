import type { Locale } from '@ilogia/types';
const MAP: [string, string, string][] = [
  ['Invalid login credentials', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'Incorrect email or password.'],
  ['Email not confirmed', 'لم يتم تأكيد بريدك بعد. افتح رسالة التأكيد التي أرسلناها إليك.', 'Your email is not confirmed yet. Open the confirmation email we sent you.'],
  ['User already registered', 'يوجد حساب بهذا البريد بالفعل. سجّل الدخول بدلًا من إنشاء حساب جديد.', 'An account with this email already exists. Sign in instead.'],
  ['Password should be at least', 'كلمة المرور قصيرة جدًا.', 'Password is too short.'],
  ['rate limit', 'محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.', 'Too many attempts. Please wait and try again.'],
  ['TIMEOUT', 'انتهت مهلة الاتصال. تحقّق من الإنترنت ثم حاول مرة أخرى.', 'The connection timed out. Check your internet and try again.'],
  ['Failed to fetch', 'تعذّر الاتصال بالخادم. تحقّق من الإنترنت.', 'Could not reach the server. Check your connection.'],
  ['JWT expired', 'انتهت جلستك. سجّل الدخول من جديد.', 'Your session expired. Please sign in again.'],
  ['not_configured', 'خدمة الحسابات غير مهيّأة في هذه النسخة. استخدم العرض التجريبي.', 'Accounts are not configured in this build. Use the demo.'],
];
export function authErrorMessage(e: unknown, locale: Locale = 'ar') {
  const m = String((e as { message?: string })?.message ?? e ?? '');
  for (const [k, ar, en] of MAP) if (m.toLowerCase().includes(k.toLowerCase())) return locale === 'ar' ? ar : en;
  return locale === 'ar' ? 'حدث خطأ غير متوقع. حاول مرة أخرى.' : 'Something went wrong. Please try again.';
}
export const withTimeout = <T,>(p: PromiseLike<T>, ms = 15000) =>
  Promise.race([Promise.resolve(p), new Promise<never>((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), ms))]);
