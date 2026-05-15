// 보호 라우트 그룹 layout — 모든 자식 라우트는 진입 전 verifySession 통과 필수
// proxy.ts가 x-pathname 헤더를 세팅 → headers()로 읽어 verifySession에 동적 경로 전달
import { headers } from 'next/headers';

import { SiteHeader } from '@/features/navigation/components/SiteHeader';
import { verifySession } from '@/lib/auth/verifySession';
import { contentWrapper } from '@/app/layout.css';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts가 세팅한 x-pathname 헤더로 현재 경로 읽음 — 미들웨어 미경유 시 /me로 폴백
  const headersList = await headers();
  const currentPath = headersList.get('x-pathname') ?? '/me';

  // 검증 실패 시 verifySession 내부에서 redirect — 이후 코드는 인증 통과 보장
  const user = await verifySession(currentPath);

  return (
    <>
      {/* verifySession이 반환한 user를 prop으로 전달 — 로그인 확정 상태이므로 인증 메뉴 즉시 표시 */}
      <SiteHeader user={user} />
      <div className={contentWrapper}>{children}</div>
    </>
  );
}
