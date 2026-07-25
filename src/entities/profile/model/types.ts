/** profile 엔티티 타입 — 포트폴리오 정적 데이터의 shape 정의 */

/** 연락처 종류 — 아이콘·라벨 매핑의 키 */
export type ContactKind = 'github' | 'linkedin';

/** 외부 연락처 링크 한 건 */
export interface ContactLink {
  kind: ContactKind;
  href: string;
  label: string;
}

/** 프로필 헤드라인 — 이름·역할·소개 문장·연락처 */
export interface Profile {
  name: string;
  role: string;
  taglines: string[];
  contacts: ContactLink[];
}

/** 프로젝트 외부 링크 한 건 */
export interface ProjectLink {
  label: string;
  href: string;
}

/** 프로젝트 카드 — 이름·설명·기간·스택·링크 */
export interface Project {
  name: string;
  description: string;
  period: string;
  stack: string[];
  links: ProjectLink[];
}
