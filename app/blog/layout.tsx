import { BlogNav } from '@/widgets/blog-nav';
import type { ReactNode } from 'react';

/** blog 레이아웃 — 목록과 글이 같은 nav 를 쓴다. 글에만 다른 nav 를 세우려면 [slug] 를 라우트 그룹으로 떼어낸다 */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BlogNav />
      {children}
    </>
  );
}
