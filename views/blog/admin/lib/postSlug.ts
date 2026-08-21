/** 날짜와 주제를 합쳐 주소를 만든다. 주제가 비면 날짜만 남는다. */
export const composeSlug = (date: string, topic: string): string => {
  const normalized = topic
    .trim()
    .toLowerCase()
    // 공백·밑줄은 하이픈으로, 그 밖의 기호는 버린다. 한글은 주소에 그대로 둔다
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

  return [date, normalized].filter(Boolean).join('-');
};

/** 주소를 날짜와 주제로 되돌린다. 날짜가 안 붙은 옛 주소는 통째로 주제로 본다. */
export const parseSlug = (slug: string): { date: string; topic: string } => {
  const match = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(slug);

  if (!match) {
    return { date: '', topic: slug };
  }

  return { date: match[1], topic: match[2] };
};

/** 주소에 쓴 날짜를 발행 시각으로 바꾼다. */
export const toPublishedAt = (date: string): string => {
  if (!date) {
    return '';
  }

  // 자정 UTC로 고정해야 고른 날짜와 목록에 찍히는 날짜가 어긋나지 않는다
  return `${date}T00:00:00.000Z`;
};
