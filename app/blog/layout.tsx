import { BlogNav } from '@/views/blog/components/BlogNav';
import type { ReactNode } from 'react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background text-foreground'>
      <BlogNav />
      {children}
    </div>
  );
}
