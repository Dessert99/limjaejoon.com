'use client';

import { HighlightedCode } from '@/features/handbook/css/common/components/code/HighlightedCode';

interface CodeBlockProps {
  title: 'HTML' | 'CSS';
  language: 'markup' | 'css';
  code: string;
}

export function CodeBlock({ title, language, code }: CodeBlockProps) {
  return (
    <div className='code-block'>
      {/* 1) 블록 상단 라벨(HTML/CSS)을 렌더합니다. */}
      <div className='code-block-head'>{title}</div>
      <pre className='code-block-pre'>
        {/* 2) 실제 하이라이트는 하위 HighlightedCode가 담당합니다. */}
        <HighlightedCode
          code={code}
          language={language}
        />
      </pre>
    </div>
  );
}
