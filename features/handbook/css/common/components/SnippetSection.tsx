'use client';

import { CodePanel } from '@/features/handbook/css/common/components/CodePanel';
import { ControlsPanel } from '@/features/handbook/css/common/components/ControlsPanel';
import { PreviewPanel } from '@/features/handbook/css/common/components/PreviewPanel';
import { computeDisplayCssCode } from '@/features/handbook/css/common/codeStyleEngine';
import { useSnippetPlayground } from '@/features/handbook/css/common/hooks/useSnippetPlayground';
import { computePreviewStyles } from '@/features/handbook/css/common/preview/previewStyleEngine';
import type {
  CssPreviewConfig,
  HandbookSnippet,
} from '@/features/handbook/css/common/types';

interface SnippetSectionProps {
  snippet: HandbookSnippet;
  previewConfig: CssPreviewConfig;
}

export function SnippetSection({
  snippet,
  previewConfig,
}: SnippetSectionProps) {
  // 1) 컨트롤 선택 상태(source of truth)와 상태 변경 함수를 훅에서 받습니다.
  const { selectedTokens, onSelectToken } = useSnippetPlayground(snippet);

  // 2) 현재 선택 토큰 + preview 규칙으로 미리보기 인라인 스타일을 계산합니다.
  const previewStyles = computePreviewStyles(
    snippet,
    selectedTokens,
    previewConfig
  );

  // 3) 현재 선택 토큰을 반영한 "표시용 CSS 문자열"을 계산합니다.
  const displayCssCode = computeDisplayCssCode(
    snippet.cssCode,
    snippet.controls,
    selectedTokens
  );

  return (
    <article className='surface-card p-4 md:p-6'>
      <header className='mb-5'>
        {/* 4) 스니펫 제목을 헤더에 렌더합니다. */}
        <h2 className='text-xl font-semibold text-text-primary'>
          {snippet.title}
        </h2>
      </header>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-4'>
          {/* 5) 코드 패널에는 고정 HTML + 계산된 CSS 문자열을 전달합니다. */}
          <CodePanel
            htmlCode={snippet.htmlCode}
            cssCode={displayCssCode}
          />
        </div>

        <div className='space-y-4'>
          {/* 6) 미리보기 패널에는 계산된 스타일을 전달합니다. */}
          <PreviewPanel
            snippet={snippet}
            previewStyles={previewStyles}
          />
          {/* 7) 컨트롤 패널은 선택 상태와 상태 변경 함수를 받아 입력 UI를 렌더합니다. */}
          <ControlsPanel
            controls={snippet.controls}
            selectedTokens={selectedTokens}
            onSelectToken={onSelectToken}
          />
        </div>
      </div>

      <footer className='mt-4 flex flex-wrap gap-2'>
        {/* 8) 학습 참고 링크(MDN)를 스니펫 단위로 노출합니다. */}
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
