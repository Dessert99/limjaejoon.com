import type { Project } from '@/features/about/types';

export const projects: Project[] = [
  {
    name: 'forA',
    description: 'ADHD 커뮤니티 플랫폼',
    period: '2025.09 ~ 2026.03',
    stack: ['React Native', 'Expo'],
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
  },
];
