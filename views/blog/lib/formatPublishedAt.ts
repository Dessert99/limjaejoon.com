/** 발행일 표기 — 목록과 상세가 같은 형식을 쓴다 */

// timeZone 을 고정한다 — 빌드 머신의 시간대에 따라 정적 결과물의 날짜가 하루 밀릴 수 있다
const FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
});

/** ISO 발행일을 사람이 읽는 날짜로 바꾼다 (미발행이면 null) */
export const formatPublishedAt = (
  publishedAt: string | null
): string | null => {
  if (!publishedAt) {
    return null;
  }

  return FORMATTER.format(new Date(publishedAt));
};
