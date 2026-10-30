import type { ReactNode } from 'react';

/** 서재(방)에 블로그와 같은 밝은 배색을 깐다. */
export default function LibraryLayout({ children }: { children: ReactNode }) {
  return (
    // scheme-light는 OS가 다크여도 서재만 밝게 고정한다. 빼면 폼 컨트롤이 다크로 갈린다
    <div className='flex min-h-svh flex-col bg-blog-background text-blog-foreground scheme-light'>
      {children}
    </div>
  );
}
