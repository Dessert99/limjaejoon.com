// CSS 핸드북에서 사용하는 공통 타입 모음입니다.
import type { CSSProperties } from 'react';

// CSS 속성 대분류 slug 입니다.
export type CssGroupSlug =
  | 'box-model'
  | 'layout'
  | 'visual'
  | 'typography'
  | 'units'
  | 'motion';

// 목록 화면에서 대분류를 렌더할 때 사용하는 메타 구조입니다.
export interface CssGroupMeta {
  slug: CssGroupSlug;
  label: string;
  description?: string;
}

// 미리보기 엔진이 스타일을 적용할 수 있는 대상입니다.
export type PreviewTarget = 'container' | 'itemA' | 'itemB' | 'itemC';

// 스니펫별 프리셋 식별자입니다. 문자열 기반으로 확장 가능하게 둡니다.
export type PreviewPresetKey = string;

export interface SnippetControlOption {
  id: string;
  label: string;
  styleToken: string;
  cssDeclarations?: Array<{
    selector?: string;
    property: string;
    value: string;
  }>;
}

export interface SnippetControl {
  id: string;
  label: string;
  target: PreviewTarget;
  options: SnippetControlOption[];
  defaultStyleToken: string;
}

export interface PreviewPreset {
  presetKey: PreviewPresetKey;
  itemCount?: number;
  itemLabels?: string[];
}

// 스니펫 1개 단위 데이터 구조입니다.
export interface HandbookSnippet {
  id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  controls: SnippetControl[];
  mdnLinks: Array<{ label: string; href: string }>;
  previewPreset: PreviewPreset;
}

// 미리보기 스타일 조각 타입입니다.
export type PreviewStylePatch = Partial<Record<PreviewTarget, CSSProperties>>;

// styleToken -> 스타일 조각 매핑입니다.
export type PreviewStyleTokenMap = Record<string, PreviewStylePatch>;

// presetKey -> 기본 스타일 조각 매핑입니다.
export type PreviewPresetStyleMap = Record<PreviewPresetKey, PreviewStylePatch>;

// 최종 렌더에 인라인으로 적용할 resolved 스타일 구조입니다.
export type ResolvedPreviewStyles = Record<PreviewTarget, CSSProperties>;

// 속성 모듈별 미리보기 계산 설정입니다.
export interface CssPreviewConfig {
  presetStyleMap: PreviewPresetStyleMap;
  tokenStyleMap: PreviewStyleTokenMap;
}

// 속성 1페이지를 구성하는 모듈 단위 구조입니다.
export interface CssPropertyModule {
  slug: string;
  group: CssGroupSlug;
  title: string;
  intent: string;
  snippets: HandbookSnippet[];
  previewConfig: CssPreviewConfig;
}

// 목록 카드 렌더 전용 최소 필드입니다.
export interface CssPropertyCard {
  slug: string;
  group: CssGroupSlug;
  title: string;
  intent: string;
}
