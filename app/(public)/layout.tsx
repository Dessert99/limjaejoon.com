/** 공개 라우트 그룹 레이아웃 — 홈·블로그·랩에 공용 헤더 제공 (admin 제외) */
import { SiteHeader } from '@/widgets/site-header';
import type { ReactNode } from 'react';

/** public 그룹 공통 셸 — 상단에 SiteHeader 를 얹는다 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
