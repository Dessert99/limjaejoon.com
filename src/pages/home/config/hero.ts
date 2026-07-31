/** Hero 문구 — 홈 전용이라 entities 로 올리지 않는다. 실물 교체 전까지 분량만 맞춘 더미다 */

/* headline 은 text-hero(최대 12rem)에 실린다 — 길어지면 모바일에서 세 줄이 되므로 20자를 넘기지 않는다 */
export const HERO = {
  headline: '나무가 아닌 숲을 봅니다',
  supporting: '기능 하나를 만들 때도 전체 흐름과 기획 의도까지 함께 봅니다.',
  location: 'Seoul, Korea',
  availability: '새로운 기회를 찾는 중',
} as const;
