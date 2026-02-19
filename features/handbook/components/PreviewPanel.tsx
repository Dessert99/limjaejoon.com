'use client';

// style prop에 안전하게 넣기 위한 CSSProperties 타입입니다.
import type { CSSProperties } from 'react';

// box-sizing 비교 전용 렌더 컴포넌트입니다.
import { BoxModelComparePreview } from '@/features/handbook/components/preview/BoxModelComparePreview';
// 스니펫 데이터 타입입니다.
import type { HandbookSnippet } from '@/features/handbook/types';
// preview 엔진 계산 결과 타입입니다.
import type { ResolvedPreviewStyles } from '@/features/handbook/preview/types';

interface PreviewPanelProps {
  // 현재 렌더 중인 스니펫 데이터입니다.
  snippet: HandbookSnippet;
  // 사용자가 선택한 token 상태입니다.
  selectedTokens: Record<string, string>;
  // 엔진에서 계산된 최종 인라인 스타일입니다.
  previewStyles: ResolvedPreviewStyles;
}

// 라벨이 없을 때 사용할 기본 아이템 라벨입니다.
const defaultLabels = ['A', 'B', 'C', 'D'];

// item 인덱스를 미리보기 타겟(itemA/itemB/itemC)으로 매핑합니다.
const targetOrder: Array<'itemA' | 'itemB' | 'itemC'> = ['itemA', 'itemB', 'itemC'];

export function PreviewPanel({ snippet, selectedTokens, previewStyles }: PreviewPanelProps) {
  // 스니펫에서 지정한 아이템 개수를 읽고 기본값 3을 사용합니다.
  const itemCount = snippet.previewPreset.itemCount ?? 3;
  // 스니펫에서 지정한 라벨 배열을 읽고 기본 라벨을 fallback으로 사용합니다.
  const itemLabels = snippet.previewPreset.itemLabels ?? defaultLabels;
  // 일반 미리보기인지 box-model 비교형인지 variant를 결정합니다.
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
    <section className='surface-dark space-y-4 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>실시간 미리보기</h3>

      <div className='flex flex-wrap gap-2'>
        {/* 현재 활성 속성을 상단 배지 형태로 보여줍니다. */}
        {activeControls.map((item) => (
          <span
            key={item.id}
            className='rounded-full border border-zinc-600 bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300'>
            {item.label}: {item.value}
          </span>
        ))}
      </div>

      {previewVariant === 'box-model-compare' ? (
        // box model 비교형은 전용 컴포넌트로 위임합니다.
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
          {/* itemCount 수만큼 미리보기 아이템을 반복 렌더합니다. */}
          {Array.from({ length: itemCount }).map((_, index) => {
            // index를 itemA/itemB/itemC 타겟 키로 변환합니다.
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
