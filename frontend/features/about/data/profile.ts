import type { Profile } from '@/features/about/types';

export const profile: Profile = {
  name: '나무가 아닌 숲을 보는 개발자 임재준',
  role: '프론트엔드 개발자',
  taglines: [
    '프로젝트를 단순히 기능 구현에 그치지 않고 **전체적인 흐름과 기획 의도**까지 바라봅니다.',
    '사용자의 시각에서 UI와 경험을 고민하며, 더 나은 사용자 가치를 만들어가는 개발자가 되고자 합니다.',
    '근거 없는 코드를 **지양**하며, 기획 의도·성능·UI 등 프로젝트 전반을 고려해 합리적인 개발을 **지향**합니다.',
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
