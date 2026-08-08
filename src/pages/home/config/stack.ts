/** 스택 섹션 데이터 — 홈 전용이라 entities 로 올리지 않는다 */

/** 개발 시작일 — 카운터가 이 날을 1일째로 세어 오늘까지 굴린다 */
export const DEV_START = '2025-03-01';

/* 줄마다 반대로 흐르므로 배열이 곧 줄이다 — 이름이 두 줄에 겹치면 접근성 트리에 같은 칩이 두 번 뜬다 */
export const STACK_MARQUEE = [
  [
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'React',
    'React Native',
    'Expo',
    'Next.js',
    'GSAP',
    'Tailwind CSS',
    'TanStack Query',
  ],
  [
    'React Hook Form',
    'Vitest',
    'Testing Library',
    'MSW',
    'Storybook',
    'Supabase',
    'PostgreSQL',
    'Vercel',
    'Git',
    'ESLint',
    'Prettier',
  ],
] as const;
