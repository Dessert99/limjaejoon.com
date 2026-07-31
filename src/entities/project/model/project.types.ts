/** project 도메인 타입 — 4단계에 실제로 들어온 필드만 둔다(미래를 추측한 필드를 만들지 않는다) */
// 비율 이름은 shared 가 소유한다 — entities 가 shared 를 참조하는 방향만 FSD 가 허용한다
import type { MediaRatio } from '@/shared/ui';

/** 대표 이미지 — src 가 null 이면 비율만 맞춘 자리표시로 그린다(에셋 확보 전 상태) */
export interface ProjectMedia {
  src: string | null;
  alt: string;
  ratio: MediaRatio;
}

/** 프로젝트 외부 링크 한 건 */
export interface ProjectLink {
  label: string;
  href: string;
}

/** 프로젝트 한 건 — Work Index 가 소비한다 */
export interface Project {
  slug: string;
  title: string;
  summary: string;
  contribution: string;
  period: string;
  stack: string[];
  links: ProjectLink[];
  thumbnail: ProjectMedia;
}
