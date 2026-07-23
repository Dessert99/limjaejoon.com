import { describe, expect, it } from 'vitest';
import { readPublicEnv, readServerEnv } from './env';

const validEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  POST_IMAGE_BUCKET: 'post-images',
  ADMIN_POST_TOKEN: 'admin-token',
  ADMIN_EMAIL: 'me@x.com',
};

const profiledEnv = {
  NEXT_PUBLIC_SUPABASE_TARGET: 'remote',
  NEXT_PUBLIC_LOCAL_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY: 'local-anon-key',
  LOCAL_SUPABASE_SERVICE_ROLE_KEY: 'local-service-role-key',
  LOCAL_POST_IMAGE_BUCKET: 'post-images-local',
  NEXT_PUBLIC_REMOTE_SUPABASE_URL: 'https://remote.supabase.co',
  NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY: 'remote-anon-key',
  REMOTE_SUPABASE_SERVICE_ROLE_KEY: 'remote-service-role-key',
  REMOTE_POST_IMAGE_BUCKET: 'post-images',
  ADMIN_POST_TOKEN: 'admin-token',
  ADMIN_EMAIL: 'me@x.com',
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
      postImageBucket: 'post-images',
      adminPostToken: 'admin-token',
      adminEmail: 'me@x.com',
    });
  });

  it('명시된 Supabase target 에 맞는 public env 값을 읽는다', () => {
    expect(readPublicEnv(profiledEnv)).toEqual({
      supabaseUrl: 'https://remote.supabase.co',
      supabaseAnonKey: 'remote-anon-key',
    });
  });

  it('명시된 Supabase target 에 맞는 server env 값을 읽는다', () => {
    expect(readServerEnv(profiledEnv)).toEqual({
      supabaseUrl: 'https://remote.supabase.co',
      supabaseAnonKey: 'remote-anon-key',
      supabaseServiceRoleKey: 'remote-service-role-key',
      postImageBucket: 'post-images',
      adminPostToken: 'admin-token',
      adminEmail: 'me@x.com',
    });
  });

  it('지원하지 않는 Supabase target 이면 throw 한다', () => {
    expect(() => {
      readPublicEnv({
        ...profiledEnv,
        NEXT_PUBLIC_SUPABASE_TARGET: 'staging',
      });
    }).toThrow('Unsupported Supabase target: staging');
  });
});
