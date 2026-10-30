import { describe, expect, it } from 'vitest';
import { authErrorMessage } from './errors';
import { safeNext } from './RequireAuth';
import { createIlogiaClient } from './client';

describe('safeNext (open-redirect protection)', () => {
  it('allows in-app paths', () => { expect(safeNext('/profile')).toBe('/profile'); });
  it('blocks external and protocol-relative URLs', () => {
    expect(safeNext('https://evil.example')).toBe('/');
    expect(safeNext('//evil.example')).toBe('/');
    expect(safeNext('/login')).toBe('/');
    expect(safeNext(null)).toBe('/');
  });
});

describe('authErrorMessage', () => {
  it('maps Supabase errors to Arabic', () => { expect(authErrorMessage(new Error('Invalid login credentials'))).toContain('غير صحيحة'); });
  it('English fallback', () => { expect(authErrorMessage(new Error('???'), 'en')).toMatch(/went wrong/); });
});

describe('client', () => {
  it('returns null when not configured', () => { expect(createIlogiaClient({ supabaseUrl: null, supabaseKey: null, apiBase: '', cookieDomain: null })).toBeNull(); });
});
