import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

// access 쿠키 TTL — 15분을 밀리초로 환산
const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;

// refresh 쿠키 TTL — 7일을 밀리초로 환산
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// 모든 인증 쿠키에 공통 적용되는 보안 베이스 옵션
function baseOptions(cs: ConfigService): CookieOptions {
  const domain = cs.get<string>('COOKIE_DOMAIN');
  return {
    httpOnly: true, // JS에서 쿠키 접근 차단 — XSS 방어
    sameSite: 'lax', // CSRF 기본 방어 (크로스-사이트 GET은 허용, POST는 same-site only)
    path: '/',
    secure: cs.get<boolean>('COOKIE_SECURE') === true, // prod에서는 HTTPS 전용 — Joi가 boolean으로 변환했음에 주의
    // COOKIE_DOMAIN 이 비어 있으면 Host-only 쿠키 — 서브도메인 누설 방지
    ...(domain ? { domain } : {}),
  };
}

// access_token 쿠키 옵션 — 15분 유효
export function COOKIE_OPTS_ACCESS(cs: ConfigService): CookieOptions {
  return { ...baseOptions(cs), maxAge: ACCESS_MAX_AGE_MS };
}

// refresh_token 쿠키 옵션 — 7일 유효
export function COOKIE_OPTS_REFRESH(cs: ConfigService): CookieOptions {
  return { ...baseOptions(cs), maxAge: REFRESH_MAX_AGE_MS };
}

// 쿠키 삭제용 옵션 — Max-Age=0 으로 브라우저에서 즉시 만료 처리
// path/domain/sameSite/httpOnly가 발급 시와 동일해야 브라우저가 같은 쿠키로 인식한다 (ADR 0002)
export function COOKIE_OPTS_CLEAR(cs: ConfigService): CookieOptions {
  return { ...baseOptions(cs), maxAge: 0 };
}
