// 공개 라우트 그룹 layout — 홈·블로그 등 모든 페이지에 공통 헤더 제공
import { SiteHeader } from '@/widgets/site-header';
import { contentWrapper } from '../layout.css';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <div className={contentWrapper}>{children}</div>
    </>
  );
}
