import '@/styles/global.css';
import { SITE, SITE_URL } from '@/config/site';
import { pretendard } from '@/styles/fonts';
import { RouteTransition } from '@/components/transition/RouteTransition';
import type { Metadata } from 'next';

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
