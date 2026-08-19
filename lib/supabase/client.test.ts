import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@supabase/ssr', () => {
  return {
    createBrowserClient: vi.fn((url: string, key: string) => {
      return { url, key };
    }),
  };
});

import { createBrowserClient } from '@supabase/ssr';
import { createSupabaseBrowserClient } from './client';

const ENV_KEYS = [
  'NEXT_PUBLIC_SUPABASE_TARGET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_LOCAL_SUPABASE_URL',
  'NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_REMOTE_SUPABASE_URL',
  'NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY',
] as const;

describe('createSupabaseBrowserClient', () => {
  beforeEach(() => {
    ENV_KEYS.forEach((key) => {
      return delete process.env[key];
    });
  });

  afterEach(() => {
    ENV_KEYS.forEach((key) => {
      return delete process.env[key];
    });
  });

  it('target 미설정이면 active(NEXT_PUBLIC_SUPABASE_*) 값을 쓴다', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://active';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'active-key';

    createSupabaseBrowserClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      'http://active',
      'active-key'
    );
  });

  it('target=local 이면 LOCAL_* 값을 쓴다', () => {
    process.env.NEXT_PUBLIC_SUPABASE_TARGET = 'local';
    process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL = 'http://local';
    process.env.NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY = 'local-key';

    createSupabaseBrowserClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      'http://local',
      'local-key'
    );
  });

  it('target=remote 이면 REMOTE_* 값을 쓴다', () => {
    process.env.NEXT_PUBLIC_SUPABASE_TARGET = 'remote';
    process.env.NEXT_PUBLIC_REMOTE_SUPABASE_URL = 'http://remote';
    process.env.NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY = 'remote-key';

    createSupabaseBrowserClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      'http://remote',
      'remote-key'
    );
  });

  it('필수 값이 없으면 throw 한다', () => {
    expect(() => {
      return createSupabaseBrowserClient();
    }).toThrow(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL'
    );
  });

  it('지원하지 않는 target 이면 throw 한다', () => {
    process.env.NEXT_PUBLIC_SUPABASE_TARGET = 'staging';

    expect(() => {
      return createSupabaseBrowserClient();
    }).toThrow('Unsupported Supabase target: staging');
  });
});
