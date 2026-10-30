import { describe, expect, it } from 'vitest';
import { ECOSYSTEM, readEnv } from './index';

describe('readEnv', () => {
  it('refuses secret keys in the browser', () => {
    expect(() => readEnv({ VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_abc' })).toThrow();
    expect(() => readEnv({ VITE_SUPABASE_PUBLISHABLE_KEY: 'eyJ...service_role...' })).toThrow();
  });
  it('accepts publishable keys', () => { expect(readEnv({ VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x' }).supabaseKey).toBe('sb_publishable_x'); });
});
describe('registry', () => {
  it('has 8 frontends with unique domains and repos', () => {
    expect(ECOSYSTEM).toHaveLength(8);
    expect(new Set(ECOSYSTEM.map((a) => a.domain)).size).toBe(8);
    expect(ECOSYSTEM.every((a) => a.repo.startsWith('mo-2012/') && a.domain.endsWith('.ilogia-eg.com'))).toBe(true);
  });
});
