import { ThemeToggle, themeBootScript } from '@/features/theme-toggle';
import { SITE_URL } from '@/shared/config';
import '@/shared/styles/global.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'limjaejoon.com',
    template: '%s | 임재준',
  },
  description: 'limjaejoon.com shell',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: '임재준',
    title: 'limjaejoon.com',
    description: 'limjaejoon.com shell',
  },
  twitter: {
    card: 'summary',
    title: 'limjaejoon.com',
    description: 'limjaejoon.com shell',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: 부트 스크립트가 서버 HTML에 없는 data-theme을 심는다
    <html
      lang='ko'
      data-scroll-behavior='smooth'
      suppressHydrationWarning>
      <body>
        {/* 첫 페인트 전에 저장된 테마 적용 — 다크 모드 새로고침 시 흰 화면 번쩍임 방지 */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
