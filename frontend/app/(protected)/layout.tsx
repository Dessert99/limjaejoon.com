// 보호 라우트 그룹 layout — 모든 자식 라우트는 진입 전 verifySession 통과 필수
// verifySession은 access_token 쿠키 검증 + /auth/me 호출 → 실패 시 /login?returnTo=...로 redirect (ADR 0005)
// `(protected)`는 라우트 그룹(괄호 폴더) — URL 경로엔 포함되지 않고 layout만 공유
import { verifySession } from '@/lib/auth/verifySession';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 검증 실패 시 verifySession 내부에서 redirect — 여기 코드는 도달 안 함
  // currentPath는 returnTo 쿼리스트링용. 현재 보호 라우트는 /me 단일이라 하드코딩 (확장 시 headers() 활용 검토)
  await verifySession('/me');

  return <>{children}</>;
}
