import { SITE_URL } from '@/features/shared/constants';
import '@/styles/global.css';
import { darkTheme, lightTheme } from '@/styles/theme.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
// QueryClient + 401 핸들러를 포함한 클라이언트 프로바이더 — 모든 route group이 TanStack Query 컨텍스트를 쓰므로 root에 유지
import QueryProvider from '@/providers/QueryProvider';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '임재준 | 프론트엔드 개발자',
    template: '%s | 임재준',
  },
  description: '프론트엔드 개발자 임재준의 기술 블로그입니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: '임재준',
    title: '임재준 | 프론트엔드 개발자',
    description: '프론트엔드 개발자 임재준의 기술 블로그입니다.',
    images: [
      {
        url: '/images/logo.png',
        width: 144,
        height: 144,
        alt: '임재준 로고',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: '임재준 | 프론트엔드 개발자',
    description: '프론트엔드 개발자 임재준의 기술 블로그입니다.',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');var el=document.documentElement;el.setAttribute('data-loading','');if(t==='light'){el.classList.remove('${darkTheme}');el.classList.add('${lightTheme}');}requestAnimationFrame(function(){el.removeAttribute('data-loading');});}catch(e){}})();`;

  return (
    <html
      lang='ko'
      className={`${darkTheme} ${jetbrainsMono.variable}`}
      suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/* QueryProvider가 전체 트리를 감쌈 — SiteHeader/contentWrapper는 각 route group layout에서 처리 */}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
