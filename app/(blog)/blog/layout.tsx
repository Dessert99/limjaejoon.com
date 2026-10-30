import type { ReactNode } from 'react';

/** 블로그 전 페이지에 밝은 배색을 깔고, 글 위에 다른 글을 띄울 피크 슬롯을 함께 그린다. */
export default function BlogLayout({
  children,
  peek,
}: {
  children: ReactNode;
  peek: ReactNode;
}) {
  return (
    // scheme-light는 OS가 다크여도 블로그만 밝게 고정한다. 빼면 폼 컨트롤이 다크로 갈린다
    <div className='flex min-h-svh flex-col bg-blog-background text-blog-foreground scheme-light'>
      {children}
      {peek}
    </div>
  );
}
