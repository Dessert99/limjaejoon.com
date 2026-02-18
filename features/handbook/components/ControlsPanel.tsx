'use client';

import type { SnippetControl } from '@/features/handbook/types';

interface ControlsPanelProps {
  controls: SnippetControl[];
  selectedTokens: Record<string, string>;
  onSelectToken: (controlId: string, styleToken: string) => void;
}

// 속성 토글 버튼을 렌더합니다.
export function ControlsPanel({ controls, selectedTokens, onSelectToken }: ControlsPanelProps) {
  return (
    <section className='space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>속성 테스트</h3>

      <div className='space-y-4'>
        {controls.map((control) => (
          <div key={control.id}>
            <p className='mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400'>
              {control.label}
            </p>
            <div className='flex flex-wrap gap-2'>
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
