
const DATED_SLUG = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

export const composeSlug = (date: string, topic: string): string => {
  const normalized = topic
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

  return [date, normalized].filter(Boolean).join('-');
};

export const parseSlug = (slug: string): { date: string; topic: string } => {
  const match = DATED_SLUG.exec(slug);

  if (!match) {
    return { date: '', topic: slug };
  }

  return { date: match[1], topic: match[2] };
};

export const toPublishedAt = (date: string): string => {
  if (!date) {
    return '';
  }

  return `${date}T00:00:00.000Z`;
};
