import '@/shared/styles/global.css';
import { SITE, SITE_URL } from '@/shared/config';
import { pretendard } from '@/shared/styles';
import { RouteTransition } from '@/shared/transition';
import { SiteNav } from '@/widgets/site-nav';
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
        {/* nav 는 children 뒤다 — z-index 없이 DOM 순서로만 페이지 위에 올라야 blend 가 아래 화면을 배경으로 잡는다 */}
        {/* 커튼은 z 계층이 있어 이 순서와 무관하게 nav 를 덮는다 */}
        <RouteTransition>
          {children}
          <SiteNav />
        </RouteTransition>
      </body>
    </html>
  );
}
