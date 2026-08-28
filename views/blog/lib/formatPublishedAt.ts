/** 발행일을 한국어 표기로 바꾼다. 발행일이 없으면 자리를 비우도록 null을 준다. */
export const formatPublishedAt = (
  publishedAt: string | null
): string | null => {
  if (!publishedAt) {
    return null;
  }

  // 서울로 고정해야 서버와 브라우저가 같은 날짜를 찍는다. 빼면 시차만큼 하루가 어긋난다
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  }).format(new Date(publishedAt));
};
