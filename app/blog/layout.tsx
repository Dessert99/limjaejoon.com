import { BlogNav } from '@/views/blog/components/BlogNav';
import type { ReactNode } from 'react';

/** blog 레이아웃 — 목록·글·앞으로 늘어날 라우트가 같은 밝은 바탕을 쓴다(페이지마다 반전을 다시 걸지 않는다) */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    // svh 를 채워야 글이 짧을 때 아래로 body 의 다크 배경이 비치지 않는다
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background text-foreground'>
      {/* nav 는 반전 안쪽이다 — 밖에 두면 다크 토큰으로 그려져 밝은 본문 위에 검은 띠가 남는다 */}
      <BlogNav />
      {children}
    </div>
  );
}
