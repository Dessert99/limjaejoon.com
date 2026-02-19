'use client';
import { CodePanel } from '@/features/handbook/components/CodePanel';
import { ControlsPanel } from '@/features/handbook/components/ControlsPanel';
import { PreviewPanel } from '@/features/handbook/components/PreviewPanel';
import { computeDisplayCssCode } from '@/features/handbook/css/engine';
import { useSnippetPlayground } from '@/features/handbook/hooks/useSnippetPlayground';
import { computePreviewStyles } from '@/features/handbook/preview/engine';
import type { ResolvedPreviewStyles } from '@/features/handbook/preview/types';
import type { HandbookSnippet } from '@/features/handbook/types';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

interface SnippetSectionProps {
  snippet: HandbookSnippet;
  children: ReactNode;
}

interface SnippetSectionContextValue {
  snippet: HandbookSnippet;
  selectedTokens: Record<string, string>;
  onSelectToken: (controlId: string, styleToken: string) => void;
  previewStyles: ResolvedPreviewStyles;
  displayCssCode: string;
}

const SnippetSectionContext = createContext<SnippetSectionContextValue | null>(
  null
);

// Header/Panels/Footer 블록이 공통 상태를 안전하게 읽도록 컨텍스트 접근을 강제합니다.
const useSnippetSectionContext = () => {
  const context = useContext(SnippetSectionContext);

  if (!context) {
    throw new Error(
      'SnippetSection blocks must be used within SnippetSection.'
    );
  }

  return context;
};

// 스니펫 1개 단위의 학습 UI 루트 컴포넌트입니다.
function SnippetSection({ snippet, children }: SnippetSectionProps) {
  // 선택 토큰 상태는 custom hook에서 관리합니다.
  const { selectedTokens, onSelectToken } = useSnippetPlayground(snippet);

  // 같은 selectedTokens를 기준으로 preview/coding view를 동시에 계산해
  // 화면과 코드 패널이 항상 같은 상태를 보도록 묶습니다.
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
    <SnippetSectionContext.Provider
      value={{
        snippet,
        selectedTokens,
        onSelectToken,
        previewStyles,
        displayCssCode,
      }}>
      {/* children은 레이아웃 슬롯이고, 실제 데이터 전달은 Context가 담당합니다. */}
      <article className='rounded-3xl border border-zinc-800 bg-zinc-900/30 p-4 md:p-6'>
        {children}
      </article>
    </SnippetSectionContext.Provider>
  );
}

function SnippetSectionHeader() {
  const { snippet } = useSnippetSectionContext();

  return (
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
              <span className='snippet-info-value'>{snippet.useCaseHint}</span>
            </p>
          )}
        </div>
      )}
    </header>
  );
}

function SnippetSectionCode() {
  const { snippet, displayCssCode } = useSnippetSectionContext();

  return (
    <CodePanel
      htmlCode={snippet.htmlCode}
      cssCode={displayCssCode}
    />
  );
}

function SnippetSectionPreview() {
  const { snippet, selectedTokens, previewStyles } = useSnippetSectionContext();

  return (
    <PreviewPanel
      snippet={snippet}
      selectedTokens={selectedTokens}
      previewStyles={previewStyles}
    />
  );
}

function SnippetSectionControls() {
  const { snippet, selectedTokens, onSelectToken } = useSnippetSectionContext();

  return (
    <ControlsPanel
      controls={snippet.controls}
      selectedTokens={selectedTokens}
      onSelectToken={onSelectToken}
    />
  );
}

// Panels는 Code/Preview/Controls를 한 덩어리 레이아웃으로 고정해
// 카테고리 페이지에서는 "<Panels />" 하나만 배치하면 되도록 만듭니다.
function SnippetSectionPanels() {
  return (
    <div className='grid gap-4 md:grid-cols-[1fr_1.2fr]'>
      {/* 왼쪽: 코드 + 속성 테스트 */}
      <div className='space-y-4'>
        <SnippetSectionCode />
      </div>

      {/* 오른쪽: 실시간 미리보기 */}
      <div className='space-y-4'>
        <SnippetSectionPreview />
        <SnippetSectionControls />
      </div>
    </div>
  );
}

function SnippetSectionFooter() {
  const { snippet } = useSnippetSectionContext();

  return (
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
  );
}

// 합성 컴포넌트의 공개 API는 파일 마지막에서 한 번에 export합니다.
export {
  SnippetSection,
  SnippetSectionFooter,
  SnippetSectionHeader,
  SnippetSectionPanels,
};
