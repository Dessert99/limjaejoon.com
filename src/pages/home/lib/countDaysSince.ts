/** 개발 시작일부터 오늘까지의 경과일 — DevCounter 가 소비한다 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** 시작일을 1일째로 세는 경과일 — 양쪽을 날짜의 UTC 자정으로 눕혀 시각과 시간대가 값에 섞이지 않게 한다 */
export const countDaysSince = (start: string, now: Date): number => {
  const from = Date.parse(`${start}T00:00:00Z`);
  const to = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((to - from) / DAY_MS) + 1;
};
