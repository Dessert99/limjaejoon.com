import { SiteHeader } from '@/features/navigation/components/SiteHeader';
import '@/styles/global.css';
import { darkTheme, lightTheme } from '@/styles/theme.css';
import { contentWrapper } from './layout.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');var el=document.documentElement;el.setAttribute('data-loading','');if(t==='light'){el.classList.remove('${darkTheme}');el.classList.add('${lightTheme}');}requestAnimationFrame(function(){el.removeAttribute('data-loading');});}catch(e){}})();`;

  return (
    <html
      lang='ko'
      className={darkTheme}
      suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        <div className={contentWrapper}>{children}</div>
      </body>
    </html>
  );
}
