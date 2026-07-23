import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@supabase/ssr', () => {
  return {
    createServerClient: vi.fn((_url, _key, options) => {
      return { __cookies: options.cookies };
    }),
  };
});

vi.mock('@/shared/config', () => {
  return { readPublicEnv: () => ({ supabaseUrl: 'http://x', supabaseAnonKey: 'k' }) };
});

import { createSupabaseProxyClient } from './proxy';

describe('createSupabaseProxyClient', () => {
  it('setAll 이 request 와 response 쿠키에 모두 기록한다', () => {
    const request = new NextRequest('https://limjaejoon.com/admin/posts');
    const response = NextResponse.next();
    const client = createSupabaseProxyClient(request, response) as unknown as {
      __cookies: { setAll: (c: { name: string; value: string; options: object }[]) => void };
    };

    client.__cookies.setAll([{ name: 'sb', value: '1', options: {} }]);

    expect(request.cookies.get('sb')?.value).toBe('1');
    expect(response.cookies.get('sb')?.value).toBe('1');
  });
});
