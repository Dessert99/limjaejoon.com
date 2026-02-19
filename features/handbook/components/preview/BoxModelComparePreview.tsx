'use client';

// style prop 타입을 명시하기 위해 CSSProperties를 사용합니다.
import type { CSSProperties } from 'react';

// box model 계산 유틸을 가져와 수치 비교용 레이어를 그립니다.
import { resolveBoxModelMetrics } from '@/features/handbook/boxModel/metrics';
// preview 엔진 결과 타입입니다.
import type { ResolvedPreviewStyles } from '@/features/handbook/preview/types';

interface BoxModelComparePreviewProps {
  // container/item 스타일이 계산된 전체 결과입니다.
  previewStyles: ResolvedPreviewStyles;
  // 카드 타이틀로 표시할 라벨 배열입니다.
  itemLabels: string[];
  // 외부에서 전달되는 컨테이너 인라인 스타일입니다.
  containerStyle?: CSSProperties;
}

// 비교 대상은 itemA(content-box), itemB(border-box) 순서로 고정합니다.
const targetOrder = ['itemA', 'itemB'] as const;
// 라벨이 없을 때 사용할 기본 타이틀입니다.
const fallbackLabels = ['content-box', 'border-box'];

// box model 비교형 미리보기를 렌더합니다.
export function BoxModelComparePreview({
  previewStyles,
  itemLabels,
  containerStyle,
}: BoxModelComparePreviewProps) {
  return (
    <div
      className='preview-canvas box-model-preview-canvas'
      style={containerStyle}>
      <div className='box-model-grid'>
        {/* 비교 대상 2개를 순회하며 카드 형태로 렌더합니다. */}
        {targetOrder.map((target, index) => {
          // 현재 타겟(itemA/itemB)의 스타일을 읽습니다.
          const style = previewStyles[target];
          // 스타일 값을 실제 box model 수치로 변환합니다.
          const metrics = resolveBoxModelMetrics(style);
          // 테두리 색상이 문자열일 때만 사용하고, 아니면 기본값을 사용합니다.
          const borderColor =
            typeof style.borderColor === 'string'
              ? style.borderColor
              : '#60a5fa';

          // 바깥 border 레이어의 크기/두께 스타일을 계산합니다.
          const borderLayerStyle: CSSProperties = {
            width: `${metrics.borderBoxWidth}px`,
            minHeight: `${metrics.borderBoxHeight}px`,
            borderWidth: `${metrics.borderWidth}px`,
            borderStyle: 'solid',
            borderColor,
            boxSizing: 'border-box',
          };

          // padding 레이어는 숫자 padding 값만 반영합니다.
          const paddingLayerStyle: CSSProperties = {
            padding: `${metrics.padding}px`,
          };

          // content 레이어는 최소 가독성 크기를 보장합니다.
          const contentLayerStyle: CSSProperties = {
            minWidth: `${Math.max(metrics.contentBoxWidth, 28)}px`,
            minHeight: `${Math.max(metrics.contentBoxHeight, 28)}px`,
          };

          return (
            <article
              key={target}
              className='box-model-card'>
              <h4 className='box-model-card-title'>
                {itemLabels[index] ?? fallbackLabels[index]}
              </h4>

              <div className='box-model-stage'>
                <div
                  className='box-model-border-layer'
                  style={borderLayerStyle}>
                  <div
                    className='box-model-padding-layer'
                    style={paddingLayerStyle}>
                    <div
                      className='box-model-content-layer'
                      style={contentLayerStyle}>
                      content
                    </div>
                  </div>
                </div>
              </div>

              <br />
              <br />
            </article>
          );
        })}
      </div>
    </div>
  );
}
