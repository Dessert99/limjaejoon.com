
const FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
});

export const formatPublishedAt = (
  publishedAt: string | null
): string | null => {
  if (!publishedAt) {
    return null;
  }

  return FORMATTER.format(new Date(publishedAt));
};
