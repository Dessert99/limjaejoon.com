import { DocsNav } from '@/widgets/docs-nav';
import type { ReactNode } from 'react';

/** docs 레이아웃 — /docs 아래 전부가 이 nav 를 쓴다 */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsNav />
      {children}
    </>
  );
}
