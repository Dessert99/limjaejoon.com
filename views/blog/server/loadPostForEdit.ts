/** 편집 폼용 단건 조회 — 공개 조회와 달리 draft 도 집는다(범위는 RLS 의 admin select 정책이 정한다) */
import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

/** 글 한 편과 연결된 태그 id 를 읽는다. 없으면 null */
export const loadPostForEdit = async (
  client: SupabaseClient<Database>,
  id: string
) => {
  // 편집 폼은 태그 이름이 아니라 id 를 든다 — 모달에서 이름이 바뀌어도 선택이 안 끊긴다
  const { data, error } = await client
    .from('posts')
    .select('*, post_tags(tag_id)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    post: data,
    tagIds: data.post_tags.map((link) => {
      return link.tag_id;
    }),
  };
};
