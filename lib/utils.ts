import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'label',
        'body-sm',
        'body',
        'body-lg',
        'statement',
        'section',
        'project',
        'hero',
      ],
      spacing: ['gutter', 'section', 'section-sm', 'grid-gap', 'header'],
      container: ['content', 'wide'],
      ease: ['standard', 'enter', 'exit', 'reveal', 'cinematic'],
    },
    classGroups: {
      duration: [
        { duration: ['instant', 'quick', 'standard', 'slow', 'cinematic'] },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
