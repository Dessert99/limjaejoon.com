// 쿠키 옵션 헬퍼 — access/refresh/clear 세 종류를 한 곳에서 조립해 컨트롤러에 인라인 옵션이 흩어지지 않게 한다
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

// access JWT 쿠키 수명 — JWT_ACCESS_TTL과 정렬, 브라우저가 만료된 쿠키를 들고 다니지 않게 한다
const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;

// refresh 쿠키 수명 — JWT_REFRESH_TTL(1d)과 정렬, DB의 expiresAt과 어긋나면 좀비 쿠키 발생
const REFRESH_MAX_AGE_MS = 24 * 60 * 60 * 1000;

// 모든 인증 쿠키에 공통 적용할 보안 베이스 — XSS·CSRF 방어 표준 옵션 묶음
function baseOptions(cs: ConfigService): CookieOptions {
  // 도메인 미지정(빈 문자열) 시 Host-only 쿠키 — 서브도메인으로 누설 안 됨, 명시한 경우만 sub.example.com 등으로 공유
  const domain = cs.get<string>('COOKIE_DOMAIN');
  return {
    httpOnly: true, // JavaScript에서 document.cookie로 못 읽음 — 토큰 탈취 경로(XSS) 차단
    sameSite: 'lax', // 크로스-사이트 GET은 허용, POST는 same-site만 — CSRF 기본 방어
    path: '/',
    secure: cs.get<boolean>('COOKIE_SECURE') === true, // prod에서는 HTTPS 전용 — Joi가 'true' 문자열을 boolean으로 변환해 들어옴
    ...(domain ? { domain } : {}),
  };
}

// access_token 쿠키 옵션 — 베이스 + 15분 maxAge
export function COOKIE_OPTS_ACCESS(cs: ConfigService): CookieOptions {
  return { ...baseOptions(cs), maxAge: ACCESS_MAX_AGE_MS };
}

// refresh_token 쿠키 옵션 — 베이스 + 1일 maxAge
export function COOKIE_OPTS_REFRESH(cs: ConfigService): CookieOptions {
  return { ...baseOptions(cs), maxAge: REFRESH_MAX_AGE_MS };
}

// 쿠키 삭제 옵션 — Max-Age=0으로 즉시 만료. path/domain/sameSite/httpOnly가 발급 시와 같아야 브라우저가 같은 쿠키로 인식해 지운다
export function COOKIE_OPTS_CLEAR(cs: ConfigService): CookieOptions {
  return { ...baseOptions(cs), maxAge: 0 };
}
