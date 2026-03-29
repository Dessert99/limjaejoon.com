import './globals.css';
import { contentWrapper } from './layout.css';
import { SiteHeader } from '@/features/navigation/components/SiteHeader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <SiteHeader />
        <div className={contentWrapper}>{children}</div>
      </body>
    </html>
  );
}
