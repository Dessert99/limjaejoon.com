import type { CONTACT_ICON_PATHS } from '@/domains/home/config/contactIcons';

/** 연락처 타일이 그릴 수 있는 브랜드 아이콘 이름. */
export type ContactIconName = keyof typeof CONTACT_ICON_PATHS;
