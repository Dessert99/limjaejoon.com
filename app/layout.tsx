import { SiteHeader } from '@/features/navigation/components/SiteHeader';
import '@/styles/global.css';
import { darkTheme } from '@/styles/theme.css';
import { contentWrapper } from './layout.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      className={darkTheme} // 다크 테마 적용
    >
      <body>
        <SiteHeader />
        <div className={contentWrapper}>{children}</div>
      </body>
    </html>
  );
}
