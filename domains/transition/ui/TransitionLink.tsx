'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithRef, MouseEvent } from 'react';
import { shouldCurtain } from '@/domains/transition/lib/curtainPolicy';
import { useCurtainStart } from '@/domains/transition/hooks/useCurtainStart';
import { isPlainNavigation } from '@/domains/transition/lib/isPlainNavigation';

type TransitionLinkProps = Omit<ComponentPropsWithRef<typeof Link>, 'href'> & {
  href: string;
};

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
