import { DocsNav } from '@/views/docs/components/DocsNav';
import type { ReactNode } from 'react';

/** docs 레이아웃 — /docs 아래 전부가 이 nav 를 쓴다 */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsNav />
      {/* 임시 페이지는 밝게 뒤집는다 — svh 를 채워야 뒤로 body 의 다크 배경이 비치지 않는다 */}
      <div
        data-surface='light'
        className='flex min-h-svh flex-col bg-background'>
        {children}
      </div>
    </>
  );
}
