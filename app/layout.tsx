import './globals.css';

// 앱의 최상위 HTML/Body 레이아웃을 정의합니다.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      {/* 전역 배경/텍스트 톤은 body class에서 통일합니다. */}
      <body className='bg-black text-zinc-100 antialiased'>{children}</body>
    </html>
  );
}
