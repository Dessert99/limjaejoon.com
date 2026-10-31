import { CONTACT_ICON_PATHS } from '@/domains/home/config/contactIcons';
import type { ContactIconName } from '@/domains/home/types/contact.types';
type ContactIconProps = {
  name: ContactIconName;
};

/** 연락처 타일 안에 들어가는 단색 브랜드 아이콘. */
export function ContactIcon({ name }: ContactIconProps) {
  return (
    <svg
      viewBox='0 0 16 16'
      fill='currentColor'
      aria-hidden='true'
      className='size-6'>
      <path d={CONTACT_ICON_PATHS[name]} />
    </svg>
  );
}
