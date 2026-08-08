/** lab 임시 내비게이션 — 라우트 그룹이 nav 를 갈아 끼우는지 눈으로 확인하려고 세운 자리다. 고유 디자인이 서면 통째로 갈린다 */
import { SITE_ROUTES } from '@/shared/config';
import { TransitionLink } from '@/shared/transition';

// sticky 다 — 홈 nav 와 달리 blend 를 쓰지 않으니 문서 흐름에 남겨 본문을 가리지 않게 한다
const NAV_CLASS =
  'sticky top-0 z-(--ds-z-sticky) flex items-center justify-center gap-6 border-b border-border bg-secondary px-gutter py-4';

const BRAND_CLASS =
  'absolute left-gutter text-label tracking-widest text-muted-foreground uppercase';

const LINK_CLASS =
  'text-body font-medium text-foreground transition-colors duration-quick ease-standard hover:text-primary';

/** lab 라우트가 세우는 임시 나열 */
export function LabNav() {
  return (
    <nav
      aria-label='주요 메뉴'
      className={NAV_CLASS}>
      <span className={BRAND_CLASS}>lab</span>

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
