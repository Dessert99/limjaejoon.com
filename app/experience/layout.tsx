import type { ReactNode } from 'react';

/** 창밖 공간 전 페이지에 블로그 배색을 깔고, 회고 안에서 개념 글을 띄울 피크 슬롯을 함께 그린다. */
export default function ExperienceLayout({
  children,
  peek,
}: {
  children: ReactNode;
  peek: ReactNode;
}) {
  return (
    // scheme-light는 OS가 다크여도 밝게 고정한다. 빼면 폼 컨트롤이 다크로 갈린다
    <div className='flex min-h-svh flex-col bg-blog-background text-blog-foreground scheme-light'>
      {children}
      {peek}
    </div>
  );
}
