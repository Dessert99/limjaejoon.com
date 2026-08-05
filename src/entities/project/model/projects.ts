/** projects 데이터 — forA 만 실물이고 나머지 셋은 레이아웃 확정용 더미다(실물 교체 전까지) */
import type { Project } from './project.types';

/* 제목 길이를 2·4·8·17자로 일부러 흩었다 — 거대 타이포에서 긴 제목이 Work Index 레이아웃을 깨는지가 판단 기준이다 */
export const projects: Project[] = [
  {
    slug: 'fora',
    title: 'forA',
    summary: 'ADHD 당사자를 위한 커뮤니티와 복약 관리 앱',
    contribution:
      '앱 전반의 화면을 구현하고, 복약 알림 흐름과 커뮤니티 피드의 상태 관리를 맡았다.',
    period: '2025.09 — 2026.03',
    stack: ['React Native', 'Expo', 'TypeScript'],
    links: [
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.fora.appfora&hl=en_US',
      },
      {
        label: 'App Store',
        href: 'https://apps.apple.com/kr/app/fora-adhd-%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0-%EC%95%BD%EC%A0%95%EB%B3%B4-%EB%A7%A4%EA%B1%B0%EC%A7%84/id6736352280',
      },
    ],
    thumbnail: {
      src: null,
      alt: 'forA 앱의 커뮤니티 피드 화면',
      ratio: 'thumbnail',
    },
  },
  {
    slug: 'luca',
    title: '루카',
    summary: '읽은 책의 문장을 모아 다시 꺼내 보는 기록 서비스',
    contribution:
      '문장 수집 화면과 검색을 설계했고, 목록이 길어져도 스크롤이 끊기지 않도록 렌더링을 나눴다.',
    period: '2025.04 — 2025.08',
    stack: ['Next.js', 'TypeScript', 'Supabase'],
    links: [{ label: 'GitHub', href: 'https://github.com/Dessert99' }],
    thumbnail: {
      src: null,
      alt: '루카의 문장 수집 화면',
      ratio: 'thumbnail',
    },
  },
  {
    slug: 'ops-console',
    title: '사내 운영 콘솔',
    summary: '흩어져 있던 운영 업무를 한 화면으로 모은 내부 도구',
    contribution:
      '권한별로 갈리던 화면을 하나로 합치고, 표 필터와 일괄 처리 흐름을 다시 짰다.',
    period: '2024.11 — 2025.03',
    stack: ['React', 'TypeScript', 'NestJS'],
    links: [],
    thumbnail: {
      src: null,
      alt: '운영 콘솔의 목록 화면',
      ratio: 'thumbnail',
    },
  },
  {
    slug: 'team-schedule',
    title: '한 화면에서 끝내는 팀 일정 조율',
    summary: '가능한 시간을 겹쳐 보여 회의 시간을 정하는 도구',
    contribution:
      '여러 사람의 가능 시간을 한 격자에 겹쳐 그리고, 겹치는 구간을 즉시 계산해 보여주는 부분을 맡았다.',
    period: '2024.06 — 2024.10',
    stack: ['Next.js', 'TypeScript'],
    links: [{ label: 'GitHub', href: 'https://github.com/Dessert99' }],
    thumbnail: {
      src: null,
      alt: '팀 일정 조율 화면의 시간 격자',
      ratio: 'thumbnail',
    },
  },
];
