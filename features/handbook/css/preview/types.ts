// React 인라인 스타일 타입입니다.
import type { CSSProperties } from 'react';

// handbook 공통 타입(프리셋 키/타겟)을 가져옵니다.
import type { PreviewPresetKey, PreviewTarget } from '@/features/handbook/css/types';

// 특정 토큰이 container/item에 덮어쓸 스타일 조각입니다.
export type PreviewStylePatch = Partial<Record<PreviewTarget, CSSProperties>>;

// styleToken -> 스타일 조각 매핑입니다.
export type PreviewStyleTokenMap = Record<string, PreviewStylePatch>;

// presetKey -> 기본 스타일 조각 매핑입니다.
export type PreviewPresetStyleMap = Record<PreviewPresetKey, PreviewStylePatch>;

// 최종 렌더에 직접 적용할 스타일 객체입니다.
export type ResolvedPreviewStyles = Record<PreviewTarget, CSSProperties>;
