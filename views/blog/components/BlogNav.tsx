import { TransitionLink } from '@/components/transition/TransitionLink';

const ROUTES = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Labs', href: '/labs' },
] as const;

const NAV_CLASS =
  'sticky top-0 z-(--z-sticky) flex items-center gap-6 border-b border-blog-border bg-blog-background px-blog-gutter py-4';

const BRAND_CLASS =
  'mr-auto text-xs tracking-widest text-blog-muted-foreground uppercase';

const LINK_CLASS =
  'text-base font-medium text-blog-foreground transition-colors duration-200 ease-in-out hover:text-blog-primary';

export function BlogNav() {
  return (
    <nav
      aria-label='주요 메뉴'
      className={NAV_CLASS}>
      <span className={BRAND_CLASS}>blog</span>

      {ROUTES.map((route) => {
        return (
          <TransitionLink
            key={route.href}
            href={route.href}
            className={LINK_CLASS}>
            {route.label}
          </TransitionLink>
        );
      })}
    </nav>
  );
}
