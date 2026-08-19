/** 절벽 위에 놓이는 주제 보드. 배열 순서가 곧 카메라가 만나는 순서다. */
export const TOPICS = [
  { title: '스크롤 실험', caption: 'GSAP ScrollTrigger', href: '/labs/scroll' },
  { title: '셰이더 놀이터', caption: 'GLSL', href: '/labs/shader' },
  { title: '타이포 실험', caption: 'variable font', href: '/labs/typography' },
] as const;

/** 보드 하나의 데이터 모양. */
export type Topic = (typeof TOPICS)[number];
