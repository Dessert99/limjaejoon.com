// 전역 스타일을 모든 페이지에서 공통으로 사용하기 위해 import 합니다.
import './globals.css';

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
      <body className='bg-black text-zinc-100 antialiased'>{children}</body>
    </html>
  );
}
