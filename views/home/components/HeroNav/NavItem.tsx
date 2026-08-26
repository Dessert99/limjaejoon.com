'use client';

import { TransitionLink } from '@/components/transition/TransitionLink';
import { useMagnet } from '@/lib/motion/useMagnet';

type NavItemProps = {
  href: string;
  label: string;
};

/** 마우스를 따라 끌려오고, 호버하면 색이 반전되는 메뉴 링크. */
export function NavItem({ href, label }: NavItemProps) {
  const magnetRef = useMagnet<HTMLAnchorElement>();

  return (
    <li>
      <TransitionLink
        ref={magnetRef}
        href={href}
        className='group flex items-center gap-2'>
        <span
          aria-hidden='true'
          className='size-1.5 rounded-full bg-home-foreground opacity-0 transition duration-200 ease-in-out group-hover:bg-home-background group-hover:opacity-100'
        />
        <span className='text-xl font-medium transition duration-200 ease-in-out group-hover:text-home-background'>
          {label}
        </span>
      </TransitionLink>
    </li>
  );
}
