'use client';

import { CodePanel } from '@/features/handbook/css/components/CodePanel';
import { ControlsPanel } from '@/features/handbook/css/components/ControlsPanel';
import { PreviewPanel } from '@/features/handbook/css/components/PreviewPanel';
import { computeDisplayCssCode } from '@/features/handbook/css/engine';
import { useSnippetPlayground } from '@/features/handbook/css/hooks/useSnippetPlayground';
import { computePreviewStyles } from '@/features/handbook/css/preview/engine';
import type { HandbookSnippet } from '@/features/handbook/css/types';
import { useMemo } from 'react';

interface SnippetSectionProps {
  // 현재 렌더링할 스니펫 데이터입니다.
  snippet: HandbookSnippet;
}

// 스니펫 1개 단위 학습 카드입니다.
export function SnippetSection({ snippet }: SnippetSectionProps) {
  // 속성 선택 상태를 훅에서 관리합니다.
  const { selectedTokens, onSelectToken } = useSnippetPlayground(snippet);

  // 선택 상태를 기준으로 미리보기 스타일을 계산합니다.
  const previewStyles = useMemo(() => {
    return computePreviewStyles(snippet, selectedTokens);
  }, [snippet, selectedTokens]);

  // 코드 패널에 보여줄 CSS 문자열을 계산합니다.
  const displayCssCode = useMemo(() => {
    return computeDisplayCssCode(snippet.cssCode, snippet.controls, selectedTokens);
  }, [snippet.cssCode, snippet.controls, selectedTokens]);

  return (
    <article className='surface-card p-4 md:p-6'>
      <header className='mb-5'>
        <h2 className='text-xl font-semibold text-text-primary'>{snippet.title}</h2>
      </header>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-4'>
          <CodePanel
            htmlCode={snippet.htmlCode}
            cssCode={displayCssCode}
          />
        </div>

        <div className='space-y-4'>
          <PreviewPanel
            snippet={snippet}
            selectedTokens={selectedTokens}
            previewStyles={previewStyles}
          />
          <ControlsPanel
            controls={snippet.controls}
            selectedTokens={selectedTokens}
            onSelectToken={onSelectToken}
          />
        </div>
      </div>

      <footer className='mt-4 flex flex-wrap gap-2'>
        {snippet.mdnLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target='_blank'
            rel='noreferrer'
            className='inline-flex rounded-xl border border-line-soft bg-bg-soft px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-line-strong hover:text-accent-strong'>
            MDN: {link.label}
          </a>
        ))}
      </footer>
    </article>
  );
}
