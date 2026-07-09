/** 블로그 필터 URL query parser — Next searchParams 를 post query 조건으로 좁힌다 */
import type { PostSearchParams } from '@/entities/post';

type RawSearchParams = Record<string, string | string[] | undefined>;

/** 필터 select 옵션 — 화면 label 과 실제 query 값을 분리한다 */
export type PostFilterOption = {
  label: string;
  value: string;
};

const first = (value: string | string[] | undefined): string | undefined => {
  return Array.isArray(value) ? value[0] : value;
};

const clean = (value: string | string[] | undefined): string | undefined => {
  const text = first(value)?.trim();

  return text || undefined;
};

/** URL searchParams 를 Supabase post 검색 조건으로 변환한다 */
export const parsePostSearchParams = (
  input: RawSearchParams
): PostSearchParams => {
  return {
    ...(clean(input.q) ? { q: clean(input.q) } : {}),
    ...(clean(input.category) ? { category: clean(input.category) } : {}),
    ...(clean(input.series) ? { series: clean(input.series) } : {}),
    ...(clean(input.tag) ? { tag: clean(input.tag) } : {}),
  };
};
