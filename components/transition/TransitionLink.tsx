'use client';

/** 커튼을 먼저 재생하고 이동하는 링크 — 가로챌 수 없는 클릭은 next/link 기본 동작으로 흘린다 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithRef, MouseEvent } from 'react';
import { shouldCurtain } from './curtainPolicy';
import { useCurtainStart } from './RouteTransition';

/** href 를 문자열로 좁힌다 — 커튼은 목적지 이름을 경로에서 읽으므로 UrlObject 를 다루지 않는다 */
type TransitionLinkProps = Omit<ComponentPropsWithRef<typeof Link>, 'href'> & {
  href: string;
};

/** 브라우저에 맡겨야 하는 클릭인지 — 새 탭·수정키·외부 링크를 가로채면 사용자 의도를 꺾는다 */
function isPlainNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  href: string
): boolean {
  return (
    href.startsWith('/') &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.currentTarget.target
  );
}

/** 라우트 전환 커튼을 타는 링크 — RouteTransition 안에서만 커튼이 돈다 */
export function TransitionLink({
  href,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const start = useCurtainStart();
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    onClick?.(event);

    if (
      !start ||
      event.defaultPrevented ||
      !isPlainNavigation(event, href) ||
      !shouldCurtain(pathname, href)
    ) {
      return;
    }

    // 감쇠 환경은 커튼을 만들지 않는다 — 만들지 않으니 되돌릴 것도 없다(gsap.md 6절)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.preventDefault();
    start(href);
  };

  // rest 를 앞에 둔다 — 뒤에 두면 소비자가 넘긴 onClick 이 커튼 핸들러를 덮어 전환이 조용히 사라진다
  return (
    <Link
      {...rest}
      href={href}
      onClick={handleClick}
    />
  );
}
