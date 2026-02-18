'use client';

import { useMemo } from 'react';

import { CodePanel } from '@/features/handbook/components/CodePanel';
import { ControlsPanel } from '@/features/handbook/components/ControlsPanel';
import { PreviewPanel } from '@/features/handbook/components/PreviewPanel';
import { useSnippetPlayground } from '@/features/handbook/hooks/useSnippetPlayground';
import { computeDisplayCssCode } from '@/features/handbook/css/engine';
import { computePreviewStyles } from '@/features/handbook/preview/engine';
import type { HandbookSnippet } from '@/features/handbook/types';

interface SnippetSectionProps {
  snippet: HandbookSnippet;
}

// 스니펫 1개 단위의 학습 UI(코드/속성테스트/미리보기)를 조합합니다.
export function SnippetSection({ snippet }: SnippetSectionProps) {
  // 선택 토큰 상태는 custom hook에서 관리합니다.
  const { selectedTokens, onSelectToken } = useSnippetPlayground(snippet);

  // 선택 토큰 기준으로 실시간 미리보기 스타일을 계산합니다.
  const previewStyles = useMemo(() => {
    return computePreviewStyles(snippet, selectedTokens);
  }, [snippet, selectedTokens]);

  // 선택 토큰 기준으로 CSS 코드 문자열을 동기화해서 보여줍니다.
  const displayCssCode = useMemo(() => {
    return computeDisplayCssCode(
      snippet.cssCode,
      snippet.controls,
      selectedTokens
    );
  }, [snippet.cssCode, snippet.controls, selectedTokens]);

  return (
    <article className='rounded-3xl border border-zinc-800 bg-zinc-900/30 p-4 md:p-6'>
      <header className='mb-5'>
        <h2 className='text-xl font-semibold text-zinc-100'>{snippet.title}</h2>
        <p className='mt-2 text-sm leading-6 text-zinc-300'>
          {snippet.learningGoal}
        </p>

        {/* 초심자용 핵심 정보(개념/실수/실무 힌트)를 요약해서 보여줍니다. */}
        {(snippet.conceptSummary ||
          snippet.commonMistake ||
          snippet.useCaseHint) && (
          <div className='snippet-info-panel mt-4 space-y-2'>
            {snippet.conceptSummary && (
              <p className='snippet-info-row'>
                <span className='snippet-info-label'>핵심 개념</span>
                <span className='snippet-info-value'>
                  {snippet.conceptSummary}
                </span>
              </p>
            )}
            {snippet.commonMistake && (
              <p className='snippet-info-row'>
                <span className='snippet-info-label'>자주 하는 실수</span>
                <span className='snippet-info-value'>
                  {snippet.commonMistake}
                </span>
              </p>
            )}
            {snippet.useCaseHint && (
              <p className='snippet-info-row'>
                <span className='snippet-info-label'>실무 힌트</span>
                <span className='snippet-info-value'>
                  {snippet.useCaseHint}
                </span>
              </p>
            )}
          </div>
        )}
      </header>

      <div className='grid gap-4 md:grid-cols-[1fr_1.2fr]'>
        {/* 왼쪽: 코드 + 속성 테스트 */}
        <div className='space-y-4'>
          <CodePanel
            htmlCode={snippet.htmlCode}
            cssCode={displayCssCode}
          />
        </div>

        {/* 오른쪽: 실시간 미리보기 */}
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
            className='rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-blue-500 hover:text-blue-100'>
            MDN: {link.label}
          </a>
        ))}
      </footer>
    </article>
  );
}
