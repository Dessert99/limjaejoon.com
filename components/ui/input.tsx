import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'h-9 w-full min-w-0 rounded-lg border border-blog-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-blog-primary selection:text-blog-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-blog-foreground placeholder:text-blog-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-blog-ring focus-visible:ring-[3px] focus-visible:ring-blog-ring/50',
        'aria-invalid:border-blog-destructive aria-invalid:ring-blog-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
