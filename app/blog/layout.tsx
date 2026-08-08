import type { ReactNode } from 'react';

/** blog 레이아웃 — 목록·글·앞으로 늘어날 라우트가 같은 밝은 바탕을 쓴다(페이지마다 반전을 다시 걸지 않는다) */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    // svh 를 채워야 글이 짧을 때 아래로 body 의 다크 배경이 비치지 않는다
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background text-foreground'>
      {children}
    </div>
  );
}
