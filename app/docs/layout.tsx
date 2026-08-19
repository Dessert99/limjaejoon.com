import { DocsNav } from '@/views/docs/components/DocsNav';
import type { ReactNode } from 'react';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsNav />
      <div
        data-surface='light'
        className='flex min-h-svh flex-col bg-background'>
        {children}
      </div>
    </>
  );
}
