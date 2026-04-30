// 인증 도메인 검증 상수 — LoginForm·SignupForm·향후 비밀번호 변경 등에서 공유

// 이메일 형식 검증 정규식 — RFC 5322 간소화 버전 (백엔드 class-validator IsEmail과 정합)
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 비밀번호 최소 길이 — 백엔드 SignupDto MinLength(8)과 정합
export const PASSWORD_MIN_LENGTH = 8;
