import type { ReactElement, ReactNode } from 'react';

/** css-lab의 한 단계. 그 단계에서 새로 얹는 CSS만 담는다. */
export type CssLabStep = {
  label: string;
  css: string;
};

/** 마크다운이 넘긴 css-lab 자식 하나. label과 CSS 원문을 children으로 들고 온다. */
export type LabChild = ReactElement<{ label?: string; children?: ReactNode }>;
