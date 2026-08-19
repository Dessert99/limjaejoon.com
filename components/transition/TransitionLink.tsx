'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithRef, MouseEvent } from 'react';
import { shouldCurtain } from './curtainPolicy';
import { useCurtainStart } from './RouteTransition';

type TransitionLinkProps = Omit<ComponentPropsWithRef<typeof Link>, 'href'> & {
  href: string;
};

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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.preventDefault();
    start(href);
  };

  return (
    <Link
      {...rest}
      href={href}
      onClick={handleClick}
    />
  );
}
