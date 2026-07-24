export {
  default,
  generateMetadata,
  generateStaticParams,
} from '@/pages/blog-post';

/** 빌드 이후 추가된 published 글도 첫 요청에서 렌더링한다 */
export const dynamicParams = true;
