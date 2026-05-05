import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import type { ContactKind, ContactLink } from '@/features/about/types';
import { IconTile } from './IconTile';
import * as s from './ContactLinks.css';

interface ContactLinksProps {
  contacts: ContactLink[];
}

const iconByKind: Record<ContactKind, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
};

export function ContactLinks({ contacts }: ContactLinksProps) {
  return (
    <ul
      className={s.list}
      aria-label='연락처'>
      {contacts.map((c) => {
        return (
          <li key={c.kind}>
            <IconTile
              icon={iconByKind[c.kind]}
              href={c.href}
              ariaLabel={c.label}
            />
          </li>
        );
      })}
    </ul>
  );
}
