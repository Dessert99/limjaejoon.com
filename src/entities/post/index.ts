export {
  createAdminPost,
  deleteAdminPost,
  updateAdminPost,
  type UpsertPostInput,
} from './api/adminPosts';
export { getPostBySlug, getPosts, getPostSlugs } from './api/posts';
// PostContent 와 markdownPlugins 는 이 배럴에 넣지 않는다 — shiki 를 모듈 최상위에서 만들어
// 클라이언트 컴포넌트가 배럴을 스치기만 해도 380KB 가 번들에 딸려 든다(트리셰이킹으로 안 걷힌다).
// 소비자는 '@/entities/post/ui/PostContent' 처럼 직접 경로로 가져간다.
export { extractHeadings, type PostHeading } from './lib/extractHeadings';
export { filterPosts } from './lib/filterPosts';
export { formatPublishedAt } from './lib/formatPublishedAt';
export { pickAdjacentPosts, type AdjacentPosts } from './lib/pickAdjacentPosts';
export type { Post, PostListItem, PostSearchParams } from './model/post.types';
