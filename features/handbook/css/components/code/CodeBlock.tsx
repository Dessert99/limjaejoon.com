'use client';

// Prism 하이라이트 렌더를 담당하는 하위 컴포넌트입니다.
import { HighlightedCode } from '@/features/handbook/css/components/code/HighlightedCode';

interface CodeBlockProps {
  // 블록 상단 라벨 텍스트입니다.
  title: 'HTML' | 'CSS';
  // Prism에서 사용할 언어 키입니다.
  language: 'markup' | 'css';
  // 실제 코드 문자열입니다.
  code: string;
}

// 코드 블록 1개(헤더 + 본문)를 렌더합니다.
export function CodeBlock({ title, language, code }: CodeBlockProps) {
  return (
    <div className='code-block'>
      {/* 코드 블록 헤더 영역입니다. */}
      <div className='code-block-head'>{title}</div>
      <pre className='code-block-pre'>
        {/* 본문 코드에 Prism 하이라이트를 적용합니다. */}
        <HighlightedCode
          code={code}
          language={language}
        />
      </pre>
    </div>
  );
}
