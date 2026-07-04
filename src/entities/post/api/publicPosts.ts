/** 공개 블로그 페이지가 Route Handler 를 통해 posts 를 읽는 fetcher */
import { HttpError, serverFetchJson } from '@/shared/api';
import type { Post, PostListItem } from '../model/post.types';

/** 공개 글 목록 API 응답을 읽는다 */
export const fetchPublishedPostsFromApi = async (): Promise<PostListItem[]> => {
  const { posts } = await serverFetchJson<{ posts: PostListItem[] }>(
    '/api/posts',
    { next: { tags: ['posts'] } }
  );

  return posts;
};

/** 공개 글 상세 API 응답을 읽는다 */
export const fetchPublishedPostFromApi = async (
  slug: string
): Promise<Post | null> => {
  const response = await serverFetchJson<{ post?: Post; message?: string }>(
    `/api/posts/${encodeURIComponent(slug)}`,
    { next: { tags: ['posts'] } }
  ).catch((error: unknown) => {
    if (error instanceof HttpError && error.status === 404) {
      return { post: null };
    }

    throw error;
  });

  return response.post ?? null;
};
