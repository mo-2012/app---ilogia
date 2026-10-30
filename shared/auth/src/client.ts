import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { RuntimeEnv } from '@ilogia/configuration';
import { cookieStorage, safeLocalStorage } from '@ilogia/utilities';

export const AUTH_STORAGE_KEY = 'ilogia-eco-auth';

/**
 * One Supabase client per app, using the PUBLIC publishable key only (RLS enforces access).
 * On *.ilogia-eg.com the session lives in a parent-domain cookie so all ecosystem subdomains share it.
 * It uses its own storage key, so the existing ilogia-eg.com session (localStorage) is never touched.
 */
export function createIlogiaClient(env: RuntimeEnv): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseKey) return null;
  const host = typeof location !== 'undefined' ? location.hostname : '';
  const domain = env.cookieDomain;
  const useCookie = !!domain && (host === domain.replace(/^\./, '') || host.endsWith(domain.startsWith('.') ? domain : '.' + domain));
  return createClient(env.supabaseUrl, env.supabaseKey, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: AUTH_STORAGE_KEY,
      storage: useCookie ? cookieStorage(domain!) : safeLocalStorage(),
    },
  });
}
