// 서비스에서 허용하는 카테고리 slug입니다.
export type CategorySlug = 'flex' | 'grid' | 'border-box' | 'spacing';

// 미리보기에서 스타일을 적용할 수 있는 대상입니다.
export type PreviewTarget = 'container' | 'itemA' | 'itemB' | 'itemC';

// 스니펫별 기본 미리보기 프리셋 키입니다.
export type PreviewPresetKey =
  | 'flex-basic'
  | 'flex-justify'
  | 'flex-align'
  | 'flex-wrap'
  | 'flex-grow'
  | 'flex-shrink'
  | 'flex-basis'
  | 'flex-order-self'
  | 'grid-columns'
  | 'grid-gap'
  | 'grid-span'
  | 'grid-autofit'
  | 'box-border-style'
  | 'box-radius'
  | 'box-shadow'
  | 'box-sizing'
  | 'spacing-margin'
  | 'spacing-padding'
  | 'spacing-axis'
  | 'spacing-gap-vs-margin';

export interface SnippetControlOption {
  id: string;
  label: string;
  // preview 엔진에서 해석하는 의미 기반 토큰입니다.
  styleToken: string;
  // 선택 시 코드 패널(CSS)에 반영할 속성 목록입니다.
  cssDeclarations?: Array<{
    property: string;
    value: string;
  }>;
}

export interface SnippetControl {
  id: string;
  label: string;
  // 이 control이 주로 다루는 대상(설명용 메타)입니다.
  target: PreviewTarget;
  options: SnippetControlOption[];
  // 초기 렌더 시 선택될 styleToken입니다.
  defaultStyleToken: string;
}

export interface PreviewPreset {
  // preview 엔진의 기본 스타일 세트를 식별합니다.
  presetKey: PreviewPresetKey;
  // 미리보기 렌더 변형(기본/비교형)입니다.
  variant?: 'default' | 'box-model-compare';
  itemCount?: number;
  itemLabels?: string[];
}

// 학습 카드 1개(스니펫)의 데이터 구조입니다.
export interface HandbookSnippet {
  id: string;
  title: string;
  learningGoal: string;
  // 핵심 개념을 한 줄로 요약합니다.
  conceptSummary?: string;
  // 초심자가 자주 하는 실수 포인트입니다.
  commonMistake?: string;
  // 실무에서 어디에 쓰는지 짧은 힌트입니다.
  useCaseHint?: string;
  htmlCode: string;
  cssCode: string;
  controls: SnippetControl[];
  mdnLinks: Array<{ label: string; href: string }>;
  previewPreset: PreviewPreset;
}

// 카테고리 1개에 대한 메타/콘텐츠 구조입니다.
export interface HandbookCategory {
  slug: CategorySlug;
  title: string;
  intentHint: string;
  questionPrompt: string;
  description: string;
  level: 'beginner';
  snippets: HandbookSnippet[];
}
