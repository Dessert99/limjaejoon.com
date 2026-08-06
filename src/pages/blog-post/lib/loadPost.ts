/** 상세 조회 — generateMetadata 와 페이지 렌더가 같은 글을 두 번 조회하지 않게 감싼다 */
import { cache } from 'react';
import { getPostBySlug } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';

/** slug 로 발행된 글 하나를 읽는다 */
export const loadPost = cache(async (slug: string) => {
  return getPostBySlug(createSupabaseStaticClient(), slug);
});
