/** Introduction 콘텐츠 — 홈 전용. skills 만 실물이고 문장은 분량만 맞춘 더미다 */

/* body 는 문단 배열이다 — 한 덩어리 문자열로 두면 줄바꿈을 JSX 에서 다시 쪼개야 한다 */
export const INTRODUCTION = {
  label: 'About',
  statement: '근거 없는 코드를 지양하고, 합리적인 개발을 지향합니다.',
  body: [
    '화면을 만들 때 기능이 도는 것에서 멈추지 않고, 그 기능이 왜 필요한지와 사용자가 어떤 순서로 마주하는지를 먼저 확인합니다.',
    '브라우저가 이미 하는 일을 라이브러리로 다시 만들지 않으려 하고, 선택한 방식마다 왜 그것이어야 했는지를 남겨 둡니다.',
  ],
  skills: [
    'Next.js',
    'React.js',
    'TypeScript',
    'JavaScript',
    'React Native',
    'Expo',
    'NestJS',
  ],
  cta: { label: '프로젝트 전체 보기', href: '#work' },
} as const;
