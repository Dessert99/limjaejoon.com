'use client';

// 스니펫 속성 제어 타입을 props 정의에 사용합니다.
import type { SnippetControl } from '@/features/handbook/types';

interface ControlsPanelProps {
  // 현재 스니펫에 노출할 제어 그룹 목록입니다.
  controls: SnippetControl[];
  // control id 기준으로 현재 선택된 styleToken 집합입니다.
  selectedTokens: Record<string, string>;
  // 버튼 클릭 시 선택 상태를 갱신하는 콜백입니다.
  onSelectToken: (controlId: string, styleToken: string) => void;
}

// 속성 토글 버튼을 렌더합니다.
export function ControlsPanel({ controls, selectedTokens, onSelectToken }: ControlsPanelProps) {
  return (
    <section className='surface-subtle space-y-4 p-4'>
      <h3 className='text-sm font-semibold text-text-primary'>속성 테스트</h3>

      <div className='space-y-4'>
        {/* 각 control 그룹(예: gap, align-items)을 순회합니다. */}
        {controls.map((control) => (
          <div key={control.id}>
            <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted'>
              {control.label}
            </p>
            <div className='flex flex-wrap gap-2'>
              {/* 현재 control에 속한 버튼 옵션들을 렌더합니다. */}
              {control.options.map((option) => {
                // 현재 선택된 styleToken인지 확인해서 active 상태를 표시합니다.
                const isActive = selectedTokens[control.id] === option.styleToken;

                return (
                  <button
                    key={option.id}
                    type='button'
                    aria-pressed={isActive}
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
