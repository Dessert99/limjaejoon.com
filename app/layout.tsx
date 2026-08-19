import '@/styles/global.css';
import { SITE, SITE_URL } from '@/config/site';
import { SITE_OPEN_GRAPH } from '@/lib/seo';
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
  description: SITE.description,
  openGraph: {
    ...SITE_OPEN_GRAPH,
    type: 'website',
    url: SITE_URL,
    title: pageTitle,
  },
  twitter: {
    card: 'summary_large_image',
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
