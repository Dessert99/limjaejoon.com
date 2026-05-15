// 인증 라우트 그룹 layout — 로그인·회원가입 전용
// SiteHeader 없음 — 로그인/회원가입 화면은 헤더 없이 집중된 UI 제공
import { contentWrapper } from '@/app/layout.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // contentWrapper로 본문 영역 정렬만 맞춤 (상단 여백 포함)
  return <div className={contentWrapper}>{children}</div>;
}
