/** ContactLinks — 프로필 연락처를 IconTile 링크 목록으로 렌더 */
import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import type { ContactKind, ContactLink } from '@/entities/profile';
import { IconTile } from '@/shared/ui';
import * as s from './ContactLinks.css';

/** ContactLinks props — 렌더할 연락처 목록 */
type ContactLinksProps = {
  contacts: ContactLink[];
};

// 연락처 종류 → 브랜드 아이콘 매핑
const iconByKind: Record<ContactKind, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
};

/** 연락처를 aria-label='연락처' 목록으로 렌더한다 */
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
