'use client';

import type { CSSProperties } from 'react';

import { BoxModelComparePreview } from '@/features/handbook/components/preview/BoxModelComparePreview';
import type { HandbookSnippet } from '@/features/handbook/types';
import type { ResolvedPreviewStyles } from '@/features/handbook/preview/types';

interface PreviewPanelProps {
  snippet: HandbookSnippet;
  selectedTokens: Record<string, string>;
  previewStyles: ResolvedPreviewStyles;
}

const defaultLabels = ['A', 'B', 'C', 'D'];

// item 인덱스를 미리보기 타겟(itemA/itemB/itemC)으로 매핑합니다.
const targetOrder: Array<'itemA' | 'itemB' | 'itemC'> = ['itemA', 'itemB', 'itemC'];

export function PreviewPanel({ snippet, selectedTokens, previewStyles }: PreviewPanelProps) {
  const itemCount = snippet.previewPreset.itemCount ?? 3;
  const itemLabels = snippet.previewPreset.itemLabels ?? defaultLabels;
  const previewVariant = snippet.previewPreset.variant ?? 'default';

  // 사용자가 현재 선택한 속성을 상단 배지로 보여주기 위한 데이터입니다.
  const activeControls = snippet.controls.map((control) => {
    const activeToken = selectedTokens[control.id] ?? control.defaultStyleToken;
    const activeOption = control.options.find((option) => option.styleToken === activeToken);

    return {
      id: control.id,
      label: control.label,
      value: activeOption?.label ?? activeToken,
    };
  });

  return (
    <section className='space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>실시간 미리보기</h3>

      <div className='flex flex-wrap gap-2'>
        {activeControls.map((item) => (
          <span
            key={item.id}
            className='rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300'>
            {item.label}: {item.value}
          </span>
        ))}
      </div>

      {previewVariant === 'box-model-compare' ? (
        <BoxModelComparePreview
          previewStyles={previewStyles}
          itemLabels={itemLabels}
          containerStyle={previewStyles.container as CSSProperties}
        />
      ) : (
        <div
          className='preview-canvas'
          // 엔진에서 계산된 컨테이너 스타일을 인라인으로 적용합니다.
          style={previewStyles.container as CSSProperties}>
          {Array.from({ length: itemCount }).map((_, index) => {
            const target = targetOrder[index] ?? 'itemC';

            return (
              <div
                key={`${snippet.id}-${itemLabels[index] ?? defaultLabels[index] ?? String(index + 1)}`}
                className='preview-item'
                // 아이템별 스타일(itemA/itemB/itemC)을 인라인으로 적용합니다.
                style={previewStyles[target] as CSSProperties}>
                {itemLabels[index] ?? defaultLabels[index] ?? String(index + 1)}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
