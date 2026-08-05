/** Hero 문구 — 홈 전용이라 entities 로 올리지 않는다 */

/* headline 은 마퀴에 실려 무한 반복된다 — 길수록 한 바퀴가 느려지므로 45자를 넘기지 않는다 */
export const HERO = {
  headline: 'Welcome to my BLOG',
  portrait: {
    src: '/images/meme.jpeg',
    alt: '유럽 구도심 골목에 선 임재준',
  },
} as const;
