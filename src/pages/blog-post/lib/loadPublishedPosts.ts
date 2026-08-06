/** 앞뒤 글 계산용 목록 조회 — 본문과 같은 렌더 안에서 한 번만 부른다 */
import { cache } from 'react';
import { getPosts } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';

/** 발행된 글 목록을 최신순으로 읽는다 */
export const loadPublishedPosts = cache(async () => {
  return getPosts(createSupabaseStaticClient());
});
