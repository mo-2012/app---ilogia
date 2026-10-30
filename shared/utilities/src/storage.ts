/** Storage that never throws: falls back to memory when localStorage is blocked (sandboxed iframes, privacy modes). */
export interface KV { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }

export function memoryStorage(): KV {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

export function safeLocalStorage(): KV {
  try {
    const ls = globalThis.localStorage; const t = '__ilg_probe__';
    ls.setItem(t, '1'); ls.removeItem(t);
    return ls;
  } catch { return memoryStorage(); }
}

/**
 * Cookie storage scoped to a parent domain (e.g. `.ilogia-eg.com`) so every ecosystem subdomain shares one
 * Supabase session. Values are chunked (cookies are capped at ~4KB). Secure + SameSite=Lax.
 */
export function cookieStorage(domain: string, doc: Document = document, maxAgeDays = 30): KV {
  const CHUNK = 3000;
  const read = (name: string) => {
    const m = doc.cookie.split('; ').find((c) => c.startsWith(name + '='));
    return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
  };
  const write = (name: string, value: string, maxAge: number) => {
    const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
    doc.cookie = `${name}=${encodeURIComponent(value)}; Domain=${domain}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  };
  const count = (k: string) => Number(read(`${k}.n`) || 0);
  return {
    getItem(k) {
      const n = count(k); if (!n) return null;
      let out = ''; for (let i = 0; i < n; i++) { const p = read(`${k}.${i}`); if (p === null) return null; out += p; }
      return out;
    },
    setItem(k, v) {
      const old = count(k); const parts = Math.max(1, Math.ceil(v.length / CHUNK)); const age = maxAgeDays * 86400;
      for (let i = 0; i < parts; i++) write(`${k}.${i}`, v.slice(i * CHUNK, (i + 1) * CHUNK), age);
      for (let i = parts; i < old; i++) write(`${k}.${i}`, '', 0);
      write(`${k}.n`, String(parts), age);
    },
    removeItem(k) { const n = count(k); for (let i = 0; i < n; i++) write(`${k}.${i}`, '', 0); write(`${k}.n`, '', 0); },
  };
}
