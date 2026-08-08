/** posts 엔티티의 공개 읽기 fetcher — React 비의존 Supabase transport */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';
import type { Post, PostListItem } from '../model/post.types';

/** 다대다 축약(`tags(name)`) 대신 junction 을 명시한다 — 추론에 기대지 않아 스키마가 바뀌어도 조용히 어긋나지 않는다 */
const TAGS_JOIN = 'post_tags(tags(name))';

const POST_LIST_SELECT = `id, slug, title, description, published_at, ${TAGS_JOIN}`;

/** 조인 결과 한 겹 — 연결마다 tags 한 행이 딸려 온다 */
type TagsJoin = { post_tags: { tags: { name: string } | null }[] };

/** 조인을 벗기고 태그를 문자열 배열로 되접는다 — post_tags 를 남기면 조인 구조가 클라이언트 페이로드까지 실려 간다 */
const foldTags = <T>(row: T & TagsJoin): T & { tags: string[] } => {
  const { post_tags: links, ...rest } = row;

  return {
    ...rest,
    // 조인 순서는 보장되지 않는다 — 정렬해야 정적 HTML 이 빌드마다 흔들리지 않는다
    tags: links
      .map((link) => {
        return link.tags?.name;
      })
      .filter((name): name is string => {
        return Boolean(name);
      })
      .sort(),
  } as T & { tags: string[] };
};

/** 글 목록을 최신 발행일 순서로 조회한다 */
export const getPosts = async (
  client: SupabaseClient<Database>
): Promise<PostListItem[]> => {
  const { data, error } = await client
    .from('posts')
    .select(POST_LIST_SELECT)
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as unknown as (Omit<PostListItem, 'tags'> & TagsJoin)[]
  ).map(foldTags);
};

/** SSG 경로 생성을 위해 slug 만 조회한다 */
export const getPostSlugs = async (
  client: SupabaseClient<Database>
): Promise<string[]> => {
  const { data, error } = await client
    .from('posts')
    .select('slug')
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    data?.map((post) => {
      return post.slug;
    }) ?? []
  );
};

/** slug 로 단일 글을 조회한다 */
export const getPostBySlug = async (
  client: SupabaseClient<Database>,
  slug: string
): Promise<Post | null> => {
  const { data, error } = await client
    .from('posts')
    .select(`*, ${TAGS_JOIN}`)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return foldTags(data as unknown as Omit<Post, 'tags'> & TagsJoin);
};
