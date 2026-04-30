// API 베이스 URL 단일 출처 — client(브라우저), verifySession(서버) 모두 여기서 임포트
// NEXT_PUBLIC_ 프리픽스 덕에 서버·클라이언트 양쪽에서 동일 값 참조
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
