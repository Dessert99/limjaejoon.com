'use client';

import { CodeBlock } from '@/components/handbook/code/CodeBlock';

interface CodePanelProps {
  htmlCode: string;
  cssCode: string;
}

// 스니펫의 HTML/CSS 코드를 표시합니다.
export function CodePanel({ htmlCode, cssCode }: CodePanelProps) {
  return (
    <section className='space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>코드</h3>

      <CodeBlock
        title='HTML'
        language='markup'
        code={htmlCode}
      />

      <CodeBlock
        title='CSS'
        language='css'
        code={cssCode}
      />
    </section>
  );
}
