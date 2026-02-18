'use client';

import { HighlightedCode } from '@/features/handbook/components/code/HighlightedCode';

interface CodeBlockProps {
  title: 'HTML' | 'CSS';
  language: 'markup' | 'css';
  code: string;
}

// 코드 블록 1개(헤더 + 본문)를 렌더합니다.
export function CodeBlock({ title, language, code }: CodeBlockProps) {
  return (
    <div className='code-block'>
      <div className='code-block-head'>{title}</div>
      <pre className='code-block-pre'>
        <HighlightedCode
          code={code}
          language={language}
        />
      </pre>
    </div>
  );
}
