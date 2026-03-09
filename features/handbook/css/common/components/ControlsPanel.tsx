'use client';

import type { SnippetControl } from '@/features/handbook/css/common/types';

interface ControlsPanelProps {
  controls: SnippetControl[];
  selectedTokens: Record<string, string>;
  onSelectToken: (controlId: string, styleToken: string) => void;
}

/**
 * 파일 책임:
 * - 스니펫의 control 정의를 버튼 UI로 렌더하고, 선택 이벤트를 상위로 전달합니다.
 *
 * 입력:
 * - controls: control/option 구조 데이터
 * - selectedTokens: 현재 선택 상태
 * - onSelectToken: 선택 변경 콜백
 *
 * 처리:
 * - 각 control을 섹션으로 만들고, option별 활성 여부를 계산합니다.
 * - 버튼 클릭 시 controlId + styleToken을 상위 상태 관리 훅으로 전달합니다.
 *
 * 출력:
 * - 속성 테스트 버튼 그룹 UI
 *
 * Client 선택 이유:
 * - 버튼 클릭 이벤트를 처리해야 합니다.
 */
export function ControlsPanel({ controls, selectedTokens, onSelectToken }: ControlsPanelProps) {
  return (
    <section className='surface-subtle space-y-4 p-4'>
      <h3 className='text-sm font-semibold text-text-primary'>속성 테스트</h3>

      <div className='space-y-4'>
        {/* 1) control 단위(예: justify-content)로 버튼 그룹을 렌더합니다. */}
        {controls.map((control) => (
          <div key={control.id}>
            <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted'>
              {control.label}
            </p>
            <div className='flex flex-wrap gap-2'>
              {/* 2) option 단위로 버튼을 렌더합니다. */}
              {control.options.map((option) => {
                // 3) 현재 control에서 선택된 토큰과 option 토큰이 같으면 활성 상태입니다.
                const isActive = selectedTokens[control.id] === option.styleToken;

                return (
                  <button
                    key={option.id}
                    type='button'
                    aria-pressed={isActive}
                    // 4) 클릭하면 상위 컴포넌트의 상태(source of truth)를 갱신합니다.
                    onClick={() => onSelectToken(control.id, option.styleToken)}
                    className={[
                      'rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors',
                      isActive
                        ? 'border-line-strong bg-accent-soft text-accent-strong'
                        : 'border-line-soft bg-bg-elevated text-text-secondary hover:border-line-strong',
                    ].join(' ')}>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
