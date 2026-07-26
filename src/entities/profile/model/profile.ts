/** profile 데이터 — 이름·역할·소개 문장·연락처(GitHub·LinkedIn) */
import type { Profile } from './types';

/** 홈 소개 섹션·연락처가 소비하는 프로필 헤드라인 */
export const profile: Profile = {
  name: '임재준',
  headline: '나무가 아닌 숲을 보는 개발자',
  role: '프론트엔드 개발자',
  // 새 레이아웃은 강조를 활자 크기로 처리하므로 **볼드** 마크업을 걷어냈다
  taglines: [
    '프로젝트를 기능 구현에 그치지 않고 전체 흐름과 기획 의도까지 바라봅니다.',
    '사용자의 시각에서 UI와 경험을 고민합니다.',
    '근거 없는 코드를 지양하고 합리적인 개발을 지향합니다.',
  ],
  contacts: [
    {
      kind: 'github',
      href: 'https://github.com/Dessert99',
      label: 'GitHub',
    },
    {
      kind: 'linkedin',
      href: 'https://www.linkedin.com/in/jae-joon-lim/',
      label: 'LinkedIn',
    },
  ],
};
