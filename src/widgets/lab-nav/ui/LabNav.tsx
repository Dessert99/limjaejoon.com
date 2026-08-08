/** lab 내비게이션 — 우주 위에 떠 있다. 판을 깔지 않고 안개만 깔아 배경이 그대로 이어져 보이게 한다 */
import { SITE_ROUTES } from '@/shared/config';
import { TransitionLink } from '@/shared/transition';

// 완전 투명은 아니다 — 별이 글자 사이를 지나가면 읽기가 나빠져 위에서 아래로 사라지는 베일을 깐다
// 베일을 pseudo 로 nav 보다 아래까지 늘인다 — 높이를 맞추면 사라지다 만 끝이 선처럼 드러난다
// isolate 다 — before 의 -z-10 이 nav 밖으로 새면 배경 이미지 뒤로 숨는다
const NAV_CLASS =
  'sticky top-0 isolate z-(--ds-z-sticky) flex items-center justify-center gap-6 px-lab-gutter py-5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-40 before:bg-gradient-to-b before:from-lab-background before:via-lab-background/55 before:to-transparent';

// tracking 을 안 붙인다 — text-lab-label 토큰이 자간을 이미 갖고 있다
const BRAND_CLASS =
  'absolute left-lab-gutter text-lab-label text-lab-muted uppercase';

const LINK_CLASS =
  'text-lab-body font-medium text-lab-foreground transition-colors duration-quick ease-standard hover:text-lab-accent';

/** lab 라우트가 세우는 내비게이션 */
export function LabNav() {
  return (
    <nav
      aria-label='주요 메뉴'
      className={NAV_CLASS}>
      <span className={BRAND_CLASS}>labs</span>

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
