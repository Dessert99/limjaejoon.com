// 공개 라우트 그룹 layout — 홈·블로그·검색 등 비인증 페이지에 공통 헤더 제공
// 진입 자체는 비로그인도 허용하지만, 로그인 상태라면 헤더에 보호 메뉴까지 노출해야 정확한 UX
// 따라서 getOptionalSession으로 "있으면 user, 없으면 null" 형태 조회 — 실패해도 redirect 없음
import { SiteHeader } from '@/features/navigation/components/SiteHeader';
import { getOptionalSession } from '@/lib/auth/getOptionalSession';
import { contentWrapper } from '@/app/layout.css';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버에서 user를 확정해 SiteHeader에 주입 — 클라이언트 fetch 깜빡임 없이 첫 렌더부터 정확한 메뉴
  const user = await getOptionalSession();

  return (
    <>
      <SiteHeader user={user} />
      <div className={contentWrapper}>{children}</div>
    </>
  );
}
