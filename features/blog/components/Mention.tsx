import Link from 'next/link';
import * as s from './Mention.css';

interface MentionProps {
  children: React.ReactNode;
  href: string;
}

export function Mention({ children, href }: MentionProps) {
  const isExternal = href.startsWith('http');

  return (
    <Link
      href={href}
      className={s.link}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}>
      <svg
        className={s.icon}
        viewBox='0 0 16 16'
        fill='currentColor'
        aria-hidden='true'>
        <path d='M3.75 2a1.75 1.75 0 0 0-1.75 1.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 12.25v-3.5a.75.75 0 0 0-1.5 0v3.5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-8.5a.25.25 0 0 1 .25-.25h3.5a.75.75 0 0 0 0-1.5h-3.5z' />
        <path d='M10 1a.75.75 0 0 0 0 1.5h2.44L7.72 7.22a.75.75 0 1 0 1.06 1.06l4.72-4.72V6a.75.75 0 0 0 1.5 0V1h-5z' />
      </svg>
      {children}
    </Link>
  );
}
