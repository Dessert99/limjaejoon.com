'use client';

import { useRef } from 'react';
import { useMagnet } from '@/lib/motion/useMagnet';
import { ContactIcon, type ContactIconName } from './ContactIcon';

type ContactItemProps = {
  href: string;
  label: string;
  icon: ContactIconName;
};

/** 호버하면 브랜드 색이 아래에서 차오르는 연락처 타일. */
export function ContactItem({ href, label, icon }: ContactItemProps) {
  // 자석이 끌어당기는 건 아이콘이지만, 마우스를 감지하는 범위는 타일 전체다
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
        className='group relative flex size-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-home-foreground/25'>
        {/* origin이 bottom에서 top으로 뒤집혀 들어올 때는 차오르고 나갈 때는 위로 걷힌다 */}
        <span
          aria-hidden='true'
          className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-in-out group-hover:origin-top group-hover:scale-y-100 ${
            {
              github: 'bg-home-github',
              linkedin: 'bg-home-linkedin',
              instagram:
                'bg-linear-to-b from-home-instagram-start via-home-instagram-middle to-home-instagram-end',
            }[icon]
          }`}
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
