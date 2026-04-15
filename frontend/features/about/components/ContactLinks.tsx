import { HiOutlineEnvelope, HiOutlinePhone } from 'react-icons/hi2';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import type { ContactKind, ContactLink } from '@/features/about/types';
import * as s from './ContactLinks.css';

interface ContactLinksProps {
  contacts: ContactLink[];
}

const iconByKind: Record<ContactKind, React.ComponentType> = {
  github: SiGithub,
  linkedin: SiLinkedin,
  email: HiOutlineEnvelope,
  phone: HiOutlinePhone,
};

export function ContactLinks({ contacts }: ContactLinksProps) {
  return (
    <ul
      className={s.list}
      aria-label='연락처'>
      {contacts.map((c) => {
        const Icon = iconByKind[c.kind];
        const isExternal = c.href.startsWith('http');
        return (
          <li key={c.kind}>
            <a
              className={s.link}
              href={c.href}
              aria-label={c.label}
              {...(isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}>
              <Icon aria-hidden='true' />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
