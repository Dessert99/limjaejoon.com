'use client';

import { CodeBlock } from '@/features/handbook/css/common/components/code/CodeBlock';

interface CodePanelProps {
  htmlCode: string;
  cssCode: string;
}

export function CodePanel({ htmlCode, cssCode }: CodePanelProps) {
  return (
    <section className='surface-dark space-y-3 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>코드</h3>

      {/* 1) HTML 문자열을 markup 하이라이트 블록으로 렌더합니다. */}
      <CodeBlock
        title='HTML'
        language='markup'
        code={htmlCode}
      />

      {/* 2) CSS 문자열을 css 하이라이트 블록으로 렌더합니다. */}
      <CodeBlock
        title='CSS'
        language='css'
        code={cssCode}
      />
    </section>
  );
}
