import { SITE_ROUTES } from '@/config/site';
import { TransitionLink } from '@/components/transition/TransitionLink';

const NAV_CLASS =
  'sticky top-0 z-(--ds-z-sticky) flex items-center gap-6 border-b border-border bg-card px-gutter py-4';

const BRAND_CLASS =
  'mr-auto text-label tracking-widest text-muted-foreground uppercase';

const LINK_CLASS =
  'text-body font-medium text-foreground transition-colors duration-quick ease-standard hover:text-primary';

export function DocsNav() {
  return (
    <nav
      aria-label='주요 메뉴'
      className={NAV_CLASS}>
      <span className={BRAND_CLASS}>docs</span>

      {SITE_ROUTES.map((route) => {
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
