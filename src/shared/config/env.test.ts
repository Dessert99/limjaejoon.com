import { describe, expect, it } from 'vitest';
import { readPublicEnv, readServerEnv } from './env';

const validEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
};

describe('env 설정', () => {
  it('public Supabase env 값을 읽는다', () => {
    expect(readPublicEnv(validEnv)).toEqual({
      supabaseUrl: 'http://127.0.0.1:54321',
      supabaseAnonKey: 'anon-key',
    });
  });

  it('public env 값이 없으면 throw 한다', () => {
    expect(() => {
      readPublicEnv({});
    }).toThrow(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL'
    );
  });

  it('server 전용 Supabase env 값을 읽는다', () => {
    expect(readServerEnv(validEnv)).toEqual({
      supabaseUrl: 'http://127.0.0.1:54321',
      supabaseAnonKey: 'anon-key',
      supabaseServiceRoleKey: 'service-role-key',
    });
  });
});
