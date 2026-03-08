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
  | 'spacing-margin'
  | 'spacing-padding'
  | 'spacing-axis'
  | 'spacing-gap-vs-margin';

export interface SnippetControlOption {
  // 옵션 고유 식별자입니다.
  id: string;
  // 버튼에 표시할 라벨입니다.
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
  // control 그룹 고유 식별자입니다.
  id: string;
  // UI에 표시할 control 제목입니다.
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
  // 미리보기에 렌더할 아이템 수입니다.
  itemCount?: number;
  // 미리보기 아이템 텍스트 라벨 목록입니다.
  itemLabels?: string[];
}

// 학습 카드 1개(스니펫)의 데이터 구조입니다.
export interface HandbookSnippet {
  // 스니펫 고유 id 입니다.
  id: string;
  // 카드 제목입니다.
  title: string;
  // 학습 목표 설명입니다.
  learningGoal: string;
  // 코드 패널에 표시할 HTML 문자열입니다.
  htmlCode: string;
  // 코드 패널에 표시할 CSS 문자열입니다.
  cssCode: string;
  // 속성 버튼 그룹 목록입니다.
  controls: SnippetControl[];
  // 참고할 MDN 링크 목록입니다.
  mdnLinks: Array<{ label: string; href: string }>;
  // 미리보기 엔진 기본 설정입니다.
  previewPreset: PreviewPreset;
}

// 카테고리 1개에 대한 메타/콘텐츠 구조입니다.
export interface HandbookCategory {
  // 라우팅에 사용하는 slug 입니다.
  slug: CategorySlug;
  // 카테고리 제목입니다.
  title: string;
  // 카테고리 의도를 짧게 보여주는 문구입니다.
  intentHint: string;
  // 사용자 질문 형태의 안내 문구입니다.
  questionPrompt: string;
  // 카테고리 상세 설명입니다.
  description: string;
  // 난이도 레벨입니다.
  level: 'beginner';
  // 카테고리에 속한 스니펫 목록입니다.
  snippets: HandbookSnippet[];
}
