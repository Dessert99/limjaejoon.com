import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const isViewToken = (value: string): boolean => {
  return /^(?:blog|docs|home|labs)(?:-|$)/.test(value);
};

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      font: ['display'],
      text: [isViewToken, 'hero', 'curtain'],
      spacing: [isViewToken],
      container: [isViewToken],
    },
  },
});

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
