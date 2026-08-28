import { BlogNav } from '@/views/blog/components/BlogNav';
import type { ReactNode } from 'react';

/** 블로그 전 페이지에 상단 내비와 밝은 배색을 깐다. */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    // scheme-light는 OS가 다크여도 블로그만 밝게 고정한다. 빼면 폼 컨트롤이 다크로 갈린다
    <div className='flex min-h-svh flex-col bg-blog-background text-blog-foreground scheme-light'>
      <BlogNav />
      {children}
    </div>
  );
}
