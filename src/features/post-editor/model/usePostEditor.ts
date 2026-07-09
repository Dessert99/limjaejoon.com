/** post editor model helper — form 문자열 상태를 admin API payload 로 좁힌다 */
import type { UpsertPostInput } from '@/entities/post';

/** editor 저장 payload — admin API 와 같은 계약을 사용한다 */
export type PostEditorValue = UpsertPostInput;

/** editor form draft — input 제약 때문에 tags/series 는 문자열 상태로 다룬다 */
export type PostEditorDraft = Omit<PostEditorValue, 'tags' | 'series'> & {
  tags: string;
  series: string;
};

/** 쉼표 구분 tag 입력을 빈 값 없이 정규화한다 */
export const normalizeTags = (raw: string): string[] => {
  return raw
    .split(',')
    .map((tag) => {
      return tag.trim();
    })
    .filter(Boolean);
};

/** editor draft 를 admin API payload 로 변환한다 */
export const buildPostPayload = (value: PostEditorDraft): PostEditorValue => {
  const series = value.series.trim();

  return {
    ...value,
    tags: normalizeTags(value.tags),
    series: series || null,
  };
};
