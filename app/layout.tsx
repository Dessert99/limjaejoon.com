import { SITE_URL } from '@/shared/config';
import '@/shared/styles/global.css';
import { seasonThemes } from '@/shared/styles/themes/index.css';
import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
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
  // FOUC 방지: 첫 페인트 전에 localStorage 의 계절을 읽어 <html> 클래스를 교정한다.
  // 기본 className 은 봄(spring) 해시이므로, 저장값이 봄이면 그대로·다르면 교체한다.
  const seasonMap = JSON.stringify(seasonThemes);
  const themeScript = `(function(){try{var m=${seasonMap};var s=localStorage.getItem('season');if(!m[s])s='spring';var el=document.documentElement;el.setAttribute('data-loading','');Object.keys(m).forEach(function(k){el.classList.remove(m[k]);});el.classList.add(m[s]);requestAnimationFrame(function(){el.removeAttribute('data-loading');});}catch(e){}})();`;

  return (
    <html
      lang='ko'
      className={`${seasonThemes.spring} ${roboto.variable} ${robotoMono.variable}`}
      suppressHydrationWarning>
      <head>
        {/* Pretendard(한글) — Google Fonts 미제공이라 CDN 으로 로드. Latin 은 next/font Roboto */}
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/variable/pretendardvariable.min.css'
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
