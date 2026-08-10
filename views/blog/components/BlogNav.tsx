/** blog 내비게이션 — 글을 읽다 언제든 다른 곳으로 뜰 수 있게 위에 붙어 따라온다 */
import { SITE_ROUTES } from '@/config/site';
import { TransitionLink } from '@/components/transition/TransitionLink';

// bg-card 가 아니라 bg-background 다 — 글 바탕과 같은 색이라야 한 장의 종이로 읽히고, 경계는 아래 선만 그린다
const NAV_CLASS =
  'sticky top-0 z-(--ds-z-sticky) flex items-center gap-6 border-b border-border bg-background px-gutter py-4';

const BRAND_CLASS =
  'mr-auto text-label tracking-widest text-muted-foreground uppercase';

const LINK_CLASS =
  'text-body font-medium text-foreground transition-colors duration-quick ease-standard hover:text-primary';

/** blog 라우트가 세우는 내비게이션 */
export function BlogNav() {
  return (
    <nav
      aria-label='주요 메뉴'
      className={NAV_CLASS}>
      <span className={BRAND_CLASS}>blog</span>

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
