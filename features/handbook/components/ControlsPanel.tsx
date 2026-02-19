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
    <section className='space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>속성 테스트</h3>

      <div className='space-y-4'>
        {/* 각 control 그룹(예: gap, align-items)을 순회합니다. */}
        {controls.map((control) => (
          <div key={control.id}>
            <p className='mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400'>
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
                    className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                      isActive
                        ? 'border-blue-500 bg-blue-500/15 text-blue-100'
                        : 'border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
                    }`}>
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
