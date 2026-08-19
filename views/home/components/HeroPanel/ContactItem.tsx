'use client';

import { useRef } from 'react';
import { useMagnet } from '@/lib/motion/useMagnet';
import { ContactIcon, type ContactIconName } from './ContactIcon';

const FILL_CLASS: Record<ContactIconName, string> = {
  github: 'bg-home-github',
  linkedin: 'bg-home-linkedin',
  instagram:
    'bg-linear-to-b from-home-instagram-start via-home-instagram-middle to-home-instagram-end',
};

type ContactItemProps = {
  href: string;
  label: string;
  icon: ContactIconName;
};

export function ContactItem({ href, label, icon }: ContactItemProps) {
  const tileRef = useRef<HTMLAnchorElement>(null);
  const magnetRef = useMagnet<HTMLSpanElement>(tileRef);

  return (
    <li>
      <a
        ref={tileRef}
        href={href}
        target='_blank'
        rel='noreferrer'
        aria-label={label}
        className='group relative flex size-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-home-glass-border'>
        <span
          aria-hidden='true'
          className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-in-out group-hover:origin-top group-hover:scale-y-100 ${FILL_CLASS[icon]}`}
        />
        <span
          ref={magnetRef}
          className='relative flex transition-[scale] duration-300 ease-in-out group-hover:scale-110'>
          <ContactIcon name={icon} />
        </span>
      </a>
    </li>
  );
}
