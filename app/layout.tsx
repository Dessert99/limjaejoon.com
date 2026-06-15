import { SITE_URL } from '@/shared/config';
import '@/shared/styles/global.css';
import { afternoonThemeClass } from '@/shared/styles/theme.css';
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
    <html
      lang='ko'
      className={afternoonThemeClass}>
      <body>{children}</body>
    </html>
  );
}
