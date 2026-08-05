import '@/shared/styles/global.css';
import { SITE, SITE_URL } from '@/shared/config';
import { pretendard } from '@/shared/styles';
import { RouteTransition } from '@/shared/ui';
import type { Metadata } from 'next';

// title·og·twitter 세 곳이 같은 문장을 쓴다 — 갈리면 검색 결과와 공유 카드가 서로 다른 말을 한다
const pageTitle = `${SITE.name} — ${SITE.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: pageTitle,
    template: `%s | ${SITE.name}`,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE.name,
    title: pageTitle,
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
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
      <body>
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
