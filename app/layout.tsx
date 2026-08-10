import '@/styles/global.css';
import { SITE, SITE_URL } from '@/config/site';
import { pretendard } from '@/styles/fonts';
import { RouteTransition } from '@/components/transition/RouteTransition';
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
        {/* nav 는 라우트 그룹별 레이아웃이 세운다 — 커튼만 여기 남는다. 루트가 언마운트되지 않아야 그룹을 넘는 이동에서도 커튼이 이어진다 */}
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
