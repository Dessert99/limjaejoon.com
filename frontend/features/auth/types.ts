// 인증 도메인의 API 입출력 타입 모음 — features/auth 전역에서 공유 (ADR 0006)

// 백엔드 PublicUser 응답 형태 — 토큰 없이 공개 필드만 포함
export type User = {
  id: string;
  email: string;
  createdAt: Date;
};

// 로그인 요청 페이로드
export type LoginRequest = {
  email: string;
  password: string;
};

// 로그인/회원가입 성공 응답 — 토큰은 Set-Cookie 전용, body에는 메타 정보만 포함
export type LoginResponse = {
  user: User;
  accessExpiresAt: number; // epoch ms — 사전 refresh 타이머용
};

// 회원가입 요청 페이로드
export type SignupRequest = {
  email: string;
  password: string;
};

// 회원가입 성공 응답 — 로그인 응답과 동일 구조이므로 별칭으로 재사용
export type SignupResponse = LoginResponse;

// /auth/me 성공 응답 — User 그대로 반환
export type MeResponse = User;

// 백엔드 에러 응답 형태 — NestJS HttpException 기본 포맷 (ADR 0002)
export type AuthErrorResponse = {
  statusCode: number;
  message: string;
};
