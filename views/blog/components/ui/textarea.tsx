import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-lg border border-blog-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-blog-muted-foreground focus-visible:border-blog-ring focus-visible:ring-[3px] focus-visible:ring-blog-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-blog-destructive aria-invalid:ring-blog-destructive/20 md:text-sm',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
