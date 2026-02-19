'use client';

// HTML/CSS 코드 블록 공통 렌더 컴포넌트를 가져옵니다.
import { CodeBlock } from '@/features/handbook/components/code/CodeBlock';

interface CodePanelProps {
  // 현재 스니펫의 HTML 코드 문자열입니다.
  htmlCode: string;
  // 현재 선택 상태가 반영된 CSS 코드 문자열입니다.
  cssCode: string;
}

// 스니펫의 HTML/CSS 코드를 표시합니다.
export function CodePanel({ htmlCode, cssCode }: CodePanelProps) {
  return (
    <section className='space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>코드</h3>

      {/* HTML 코드를 첫 번째 블록으로 렌더합니다. */}
      <CodeBlock
        title='HTML'
        language='markup'
        code={htmlCode}
      />

      {/* CSS 코드를 두 번째 블록으로 렌더합니다. */}
      <CodeBlock
        title='CSS'
        language='css'
        code={cssCode}
      />
    </section>
  );
}
