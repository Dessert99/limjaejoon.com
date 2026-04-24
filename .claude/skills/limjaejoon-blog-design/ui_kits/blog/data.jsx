const profile = {
  name: "나무가 아닌 숲을 보는 개발자 임재준",
  shortName: "임재준",
  role: "프론트엔드 개발자",
  taglines: [
    "프로젝트를 단순히 기능 구현에 그치지 않고 **전체적인 흐름과 기획 의도**까지 바라봅니다.",
    "사용자의 시각에서 UI와 경험을 고민하며, 더 나은 사용자 가치를 만들어가는 개발자가 되고자 합니다.",
    "근거 없는 코드를 **지양**하며, 기획 의도·성능·UI 등 프로젝트 전반을 고려해 합리적인 개발을 **지향**합니다.",
  ],
  contacts: [
    { kind: "github", href: "https://github.com/Dessert99", label: "GitHub" },
    { kind: "linkedin", href: "https://www.linkedin.com/in/jae-joon-lim/", label: "LinkedIn" },
  ],
};

const experience = [
  { title: "PageLabs", subtitle: "프리랜서 · 프론트엔드 개발자", period: "2025.04 ~ 현재", description: "ERP 서비스 개발", stack: ["Next.js", "React.js"] },
];
const activities = [
  { title: "멋쟁이사자처럼 대학 14기", subtitle: "운영진 · 프론트엔드 팀장", period: "2026.01 ~ 2026.12", description: "HTML, CSS, JavaScript, React까지 아우르는 프론트엔드 커리큘럼을 설계하고 기술 세션을 주도하며, 동료 개발자들이 실무 역량을 갖출 수 있도록 성장에 기여하고 있습니다." },
  { title: "GDG on Campus HUFS 7기", subtitle: "Core Member", period: "2025.08 ~ 2026.08", description: "TypeScript, React, React Native, Next.js 등 다양한 프론트엔드 기술을 중심으로 기초 스터디를 운영하며 지식 공유에 기여하고 있습니다." },
];
const education = [{ title: "한국외국어대학교", subtitle: "태국학과 · AI & SW 융합전공", period: "2023 ~ 2027" }];
const projects = [
  { name: "forA", description: "ADHD 커뮤니티 플랫폼", period: "2025.09 ~ 2026.03", stack: ["React Native", "Expo"],
    links: [{ label: "Google Play", href: "#" }, { label: "App Store", href: "#" }] },
];
const skills = ["Next.js", "React.js", "TypeScript", "JavaScript", "React Native", "Expo", "NestJS"];

const posts = [
  { slug: "git-head", title: "Git HEAD", date: "2026-04-04", description: "현재 작업 위치를 가리키는 포인터인 HEAD의 이중 참조 구조, 커밋 시 HEAD가 브랜치를 따라 이동하는 방식, Detached HEAD 상태와 복구 방법을 정리한다.", tags: ["Git"] },
  { slug: "zshrc", title: "zshrc 는 무엇인가?", date: "2026-04-02", description: "zsh 셸이 시작될 때마다 자동으로 읽는 설정 파일 .zshrc의 역할과 위치, PATH·alias·환경변수 같은 대표 설정 예시를 정리한다.", tags: ["zshrc", "환경 변수"] },
  { slug: "git-worktree", title: "Git Worktree", date: "2026-04-03", description: "하나의 저장소로 여러 작업 트리를 동시에 다루는 git worktree의 개념과 사용법.", tags: ["Git"] },
  { slug: "github-actions", title: "GitHub Actions 기초", date: "2026-04-03", description: "워크플로우 파일 구성과 트리거, job/step의 관계를 정리한다.", tags: ["CI/CD", "GitHub"] },
  { slug: "next-fetch", title: "Next.js fetch 캐싱", date: "2026-04-06", description: "Next.js App Router에서 fetch의 기본 캐싱 동작과 재검증 전략.", tags: ["Next.js"] },
  { slug: "next-server-component", title: "Next.js 서버 컴포넌트", date: "2026-04-07", description: "서버 컴포넌트의 렌더링 모델과 제약.", tags: ["Next.js", "React"] },
  { slug: "next-client-component", title: "Next.js 클라이언트 컴포넌트", date: "2026-04-07", description: "언제 클라이언트 컴포넌트로 내려야 하는가.", tags: ["Next.js", "React"] },
  { slug: "playwright-locator", title: "Playwright Locator", date: "2026-04-08", description: "안정적인 E2E 테스트를 위한 locator 전략.", tags: ["Playwright"] },
  { slug: "dns", title: "DNS 는 어떻게 동작하는가", date: "2026-04-09", description: "재귀 리졸버, 권한 있는 네임서버, 캐싱 계층을 따라가는 질의 경로.", tags: ["네트워크"] },
];

window.BlogData = { profile, experience, activities, education, projects, skills, posts };
