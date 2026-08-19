import { BlogNav } from '@/views/blog/components/BlogNav';
import type { ReactNode } from 'react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col bg-blog-background text-blog-foreground scheme-light'>
      <BlogNav />
      {children}
    </div>
  );
}
