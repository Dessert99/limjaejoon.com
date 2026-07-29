import '@/shared/styles/global.css';
import { SITE_URL } from '@/shared/config';
import { pretendard } from '@/shared/styles';
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
  // 폰트 variable 은 <html> 에 걸어야 한다 — :root 에서 선언된 --font-body 가 그 자리에서 해석되기 때문
  return (
    <html
      lang='ko'
      data-scroll-behavior='smooth'
      className={pretendard.variable}>
      <body>{children}</body>
    </html>
  );
}
