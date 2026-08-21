/** 고른 이미지들을 한 줄에 세우는 래퍼로 감싸거나, 이미 감싸져 있으면 푼다. */
export const toggleImageRow = (selected: string): string => {
  const open = '<div class="img-row">';
  const close = '</div>';
  const trimmed = selected.trim();

  if (trimmed.startsWith(open) && trimmed.endsWith(close)) {
    return trimmed.slice(open.length, -close.length).trim();
  }

  return `${open}\n${trimmed}\n${close}`;
};
