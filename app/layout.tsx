// 전역 스타일을 모든 페이지에서 공통으로 사용하기 위해 import 합니다.
import './globals.css';
// 전역 헤더를 모든 페이지에 공통 배치하기 위해 import 합니다.
import { SiteHeader } from '@/features/navigation/components/SiteHeader';

// 앱의 최상위 HTML/Body 레이아웃을 정의합니다.
export default function RootLayout({
  children,
}: Readonly<{
  // 각 페이지 컴포넌트가 이 children 슬롯으로 주입됩니다.
  children: React.ReactNode;
}>) {
  return (
    // 문서 기본 언어를 한국어로 설정합니다.
    <html lang='ko'>
      {/* 전역 배경/텍스트 톤은 body class에서 통일합니다. */}
      <body className='bg-(--bg-page) text-(--text-primary) antialiased'>
        {/* 페이지 공통 네비게이션/홈 검색 전환 헤더를 렌더합니다. */}
        <SiteHeader />
        {/* fixed 헤더와 본문이 겹치지 않도록 기본 헤더 높이만큼 상단 여백을 둡니다. */}
        <div className='pt-[72px]'>
          {/* 현재 라우트의 페이지 콘텐츠를 헤더 아래에 배치합니다. */}
          {children}
        </div>
      </body>
    </html>
  );
}
