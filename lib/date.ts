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

/** YYYY-MM-DD를 로컬 자정의 Date로 바꾼다. 비었거나 깨진 값이면 아무 날도 안 고른 상태다. */
export const parseDateValue = (value: string): Date | undefined => {
  const [year, month, day] = value.split('-').map(Number);

  // UTC로 파싱하는 new Date('2026-08-20')과 달리 이건 로컬 자정이라 달력 칸이 하루 밀리지 않는다
  return year && month && day ? new Date(year, month - 1, day) : undefined;
};

/** 날짜를 주소에 쓸 YYYY-MM-DD로 바꾼다. toISOString은 UTC라 밤에 쓰면 어제가 되어 로컬 날짜로 조립한다. */
export const toDateValue = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};
