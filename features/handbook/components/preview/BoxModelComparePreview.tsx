'use client';

import type { CSSProperties } from 'react';

import { resolveBoxModelMetrics } from '@/features/handbook/boxModel/metrics';
import type { ResolvedPreviewStyles } from '@/features/handbook/preview/types';

interface BoxModelComparePreviewProps {
  previewStyles: ResolvedPreviewStyles;
  itemLabels: string[];
  containerStyle?: CSSProperties;
}

const targetOrder = ['itemA', 'itemB'] as const;
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
        {targetOrder.map((target, index) => {
          const style = previewStyles[target];
          const metrics = resolveBoxModelMetrics(style);
          const borderColor =
            typeof style.borderColor === 'string'
              ? style.borderColor
              : '#60a5fa';

          const borderLayerStyle: CSSProperties = {
            width: `${metrics.borderBoxWidth}px`,
            minHeight: `${metrics.borderBoxHeight}px`,
            borderWidth: `${metrics.borderWidth}px`,
            borderStyle: 'solid',
            borderColor,
            boxSizing: 'border-box',
          };

          const paddingLayerStyle: CSSProperties = {
            padding: `${metrics.padding}px`,
          };

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
