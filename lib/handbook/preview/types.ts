import type { CSSProperties } from 'react';

import type { PreviewPresetKey, PreviewTarget } from '@/lib/handbook/types';

// 특정 토큰이 container/item에 덮어쓸 스타일 조각입니다.
export type PreviewStylePatch = Partial<Record<PreviewTarget, CSSProperties>>;

// styleToken -> 스타일 조각 매핑입니다.
export type PreviewStyleTokenMap = Record<string, PreviewStylePatch>;

// presetKey -> 기본 스타일 조각 매핑입니다.
export type PreviewPresetStyleMap = Record<PreviewPresetKey, PreviewStylePatch>;

// 최종 렌더에 직접 적용할 스타일 객체입니다.
export type ResolvedPreviewStyles = Record<PreviewTarget, CSSProperties>;
