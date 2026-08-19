import { DocsNav } from '@/views/docs/components/DocsNav';
import type { ReactNode } from 'react';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col bg-docs-background scheme-light'>
      <DocsNav />
      {children}
    </div>
  );
}
