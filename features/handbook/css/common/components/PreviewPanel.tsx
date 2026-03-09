'use client';

import type {
  HandbookSnippet,
  ResolvedPreviewStyles,
} from '@/features/handbook/css/common/types';

interface PreviewPanelProps {
  snippet: HandbookSnippet;
  previewStyles: ResolvedPreviewStyles;
}

// previewPreset에서 라벨을 생략했을 때 사용하는 기본 라벨입니다.
const defaultLabels = ['A', 'B', 'C', 'D'];
// 렌더 순서를 preview style target(itemA/B/C)에 매핑합니다.
const targetOrder: Array<'itemA' | 'itemB' | 'itemC'> = [
  'itemA',
  'itemB',
  'itemC',
];

/**
 * 파일 책임:
 * - 계산된 preview 스타일을 실제 UI 캔버스에 적용해 실시간 결과를 보여줍니다.
 *
 * 입력:
 * - snippet: 미리보기 개수/라벨/컨트롤 정의
 * - previewStyles: 엔진에서 계산된 최종 스타일 객체
 *
 * 처리:
 * - item 개수만큼 반복 렌더하며 target 순서에 맞는 스타일을 적용합니다.
 *
 * 출력:
 * - preview 캔버스 + preview 아이템 목록
 *
 * Client 선택 이유:
 * - 상태 변화에 따라 UI를 즉시 재렌더해야 합니다.
 */
export function PreviewPanel({ snippet, previewStyles }: PreviewPanelProps) {
  // 1) preset에 값이 없으면 기본 3개 아이템을 렌더합니다.
  const itemCount = snippet.previewPreset.itemCount ?? 3;
  // 2) preset 라벨이 없으면 기본 라벨 배열을 사용합니다.
  const itemLabels = snippet.previewPreset.itemLabels ?? defaultLabels;

  return (
    <section className='surface-dark space-y-4 p-4'>
      <h3 className='text-sm font-semibold text-zinc-100'>실시간 미리보기</h3>

      <div
        className='preview-canvas'
        // 3) 컨테이너 스타일(display, justify-content 등)을 캔버스에 적용합니다.
        style={previewStyles.container}>
        {/* 4) itemCount만큼 아이템을 만들고, target 순서별 스타일을 적용합니다. */}
        {Array.from({ length: itemCount }).map((_, index) => {
          // 4-1) 네 번째 이후 아이템은 itemC 스타일을 재사용합니다.
          const target = targetOrder[index] ?? 'itemC';

          return (
            <div
              // 4-2) snippet.id + 라벨 조합으로 key를 안정적으로 구성합니다.
              key={`${snippet.id}-${itemLabels[index] ?? defaultLabels[index] ?? String(index + 1)}`}
              className='preview-item'
              // 4-3) target에 대응하는 최종 스타일 패치를 아이템에 적용합니다.
              style={previewStyles[target]}>
              {/* 4-4) 라벨도 preset -> default -> index 순서로 fallback합니다. */}
              {itemLabels[index] ?? defaultLabels[index] ?? String(index + 1)}
            </div>
          );
        })}
      </div>
    </section>
  );
}
