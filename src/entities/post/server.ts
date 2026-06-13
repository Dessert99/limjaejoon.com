// 서버 전용 공개 API. fs 데이터 접근과 MDX 렌더 옵션은 RSC/서버에서만 import 한다.
// 클라이언트 컴포넌트가 ./index 를 import 해도 fs 가 번들로 끌려오지 않게 분리.
export { getPostList, getPostBySlug } from './api/posts';
export { mdxOptions } from './lib/mdx-options';
