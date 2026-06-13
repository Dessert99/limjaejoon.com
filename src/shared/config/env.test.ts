import { describe, expect, it } from 'vitest';
import { readPublicEnv, readServerEnv } from './env';

const validEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
};

describe('env config', () => {
  it('reads public Supabase env values', () => {
    expect(readPublicEnv(validEnv)).toEqual({
      supabaseUrl: 'http://127.0.0.1:54321',
      supabaseAnonKey: 'anon-key',
    });
  });

  it('throws when a public env value is missing', () => {
    expect(() => {
      readPublicEnv({});
    }).toThrow(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL'
    );
  });

  it('reads server-only Supabase env values', () => {
    expect(readServerEnv(validEnv)).toEqual({
      supabaseUrl: 'http://127.0.0.1:54321',
      supabaseAnonKey: 'anon-key',
      supabaseServiceRoleKey: 'service-role-key',
    });
  });
});
