/** slug 규칙 — 이 블로그의 주소는 `2026-08-29-react` 처럼 발행일과 주제를 잇는다 */

/** 앞머리 날짜와 나머지를 가르는 자리 — 주제 쪽 하이픈은 건드리지 않는다 */
const DATED_SLUG = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

/** 고른 날짜와 친 주제를 하나의 slug 로 잇는다 */
export const composeSlug = (date: string, topic: string): string => {
  const normalized = topic
    .trim()
    .toLowerCase()
    // 공백·밑줄을 하이픈으로 눕히고, 주소에 못 쓰는 글자는 버린다
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

  return [date, normalized].filter(Boolean).join('-');
};

/** slug 를 편집 폼이 다루는 날짜와 주제로 편다 */
export const parseSlug = (slug: string): { date: string; topic: string } => {
  const match = DATED_SLUG.exec(slug);

  // 규칙 밖에서 만들어진 옛 slug 는 통째로 주제로 본다 — 갈라내려다 값을 잃는 쪽이 더 나쁘다
  if (!match) {
    return { date: '', topic: slug };
  }

  return { date: match[1], topic: match[2] };
};

/** 고른 날짜를 발행일 ISO 로 바꾼다 — 시각은 자정으로 고정한다 */
export const toPublishedAt = (date: string): string => {
  if (!date) {
    return '';
  }

  // UTC 자정이다 — 서울(UTC+9)에서 같은 날 09시라, 목록의 날짜 표기가 하루 밀리지 않는다
  return `${date}T00:00:00.000Z`;
};
