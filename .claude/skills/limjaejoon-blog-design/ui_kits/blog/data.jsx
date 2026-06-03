const SEASONS = [
  { key: 'spring', ko: '봄', cls: 'theme-spring', icon: 'spring' },
  { key: 'summer', ko: '여름', cls: 'theme-summer', icon: 'summer' },
  { key: 'autumn', ko: '가을', cls: 'theme-autumn', icon: 'autumn' },
  { key: 'winter', ko: '겨울', cls: 'theme-winter', icon: 'winter' },
  { key: 'night', ko: '밤', cls: 'theme-night', icon: 'night' },
];

const profile = {
  name: '나무가 아닌 숲을 보는 개발자 임재준',
  role: '프론트엔드 개발자',
  taglines: [
    '프로젝트를 단순히 기능 구현에 그치지 않고 전체적인 흐름과 기획 의도까지 바라봅니다.',
    '사용자의 시각에서 UI와 경험을 고민하며, 더 나은 사용자 가치를 만들어가는 개발자가 되고자 합니다.',
  ],
  contacts: [
    { kind: 'github', href: 'https://github.com/Dessert99', label: 'GitHub' },
    { kind: 'linkedin', href: 'https://www.linkedin.com/in/jae-joon-lim/', label: 'LinkedIn' },
  ],
};

const projects = [
  { name: 'forA', description: 'ADHD 커뮤니티 플랫폼', period: '2025.09 — 2026.03', stack: ['React Native', 'Expo'] },
];

const skills = ['Next.js', 'React.js', 'TypeScript', 'JavaScript', 'React Native', 'Expo', 'NestJS'];

const posts = [
  { slug: 'git-head', title: 'Git HEAD', date: '2026-04-04', tags: ['Git'], description: '현재 작업 위치를 가리키는 포인터인 HEAD의 이중 참조 구조와 Detached HEAD 상태를 정리한다.',
    body: [
      { h: '개요', items: ['Git은 수많은 커밋이 체인처럼 이어진 히스토리를 관리한다.', '“지금 내가 보고 있는 커밋이 어디인가”를 가리키는 포인터가 HEAD다.', '실제로는 .git/HEAD 라는 파일 하나로 존재한다.'] },
      { h: '커밋할 때 HEAD가 움직이는 방식', items: ['새 커밋을 만들면 현재 브랜치 포인터가 새 커밋으로 이동한다.', 'HEAD는 브랜치를 따라가기 때문에 자동으로 최신 커밋을 가리킨다.'] },
    ] },
  { slug: 'next-fetch', title: 'Next.js fetch 캐싱', date: '2026-04-06', tags: ['Next.js'], description: 'App Router에서 fetch의 기본 캐싱 동작과 재검증 전략.', body: [{ h: '개요', items: ['App Router의 fetch는 기본적으로 결과를 캐시한다.', 'revalidate 옵션으로 재검증 주기를 정한다.'] }] },
  { slug: 'next-server-component', title: 'Next.js 서버 컴포넌트', date: '2026-04-07', tags: ['Next.js', 'React'], description: '서버 컴포넌트의 렌더링 모델과 제약.', body: [{ h: '개요', items: ['서버에서만 실행되어 번들 크기를 줄인다.', '상태·이벤트 핸들러는 쓸 수 없다.'] }] },
  { slug: 'playwright-locator', title: 'Playwright Locator', date: '2026-04-08', tags: ['Playwright'], description: '안정적인 E2E 테스트를 위한 locator 전략.', body: [{ h: '개요', items: ['역할(role) 기반 locator를 우선한다.', 'CSS 선택자 의존을 줄여 깨지지 않게 한다.'] }] },
  { slug: 'dns', title: 'DNS 는 어떻게 동작하는가', date: '2026-04-09', tags: ['네트워크'], description: '재귀 리졸버, 권한 네임서버, 캐싱 계층을 따라가는 질의 경로.', body: [{ h: '개요', items: ['재귀 리졸버가 루트부터 차례로 질의한다.', '각 계층의 캐시가 응답을 가속한다.'] }] },
  { slug: 'github-actions', title: 'GitHub Actions 기초', date: '2026-04-03', tags: ['CI/CD'], description: '워크플로우 파일 구성과 트리거, job/step의 관계.', body: [{ h: '개요', items: ['워크플로우는 이벤트로 트리거된다.', 'job은 step의 묶음이다.'] }] },
];

window.KitData = { SEASONS, profile, projects, skills, posts };
