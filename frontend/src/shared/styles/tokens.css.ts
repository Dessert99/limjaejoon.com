import { createGlobalTheme } from '@vanilla-extract/css';

// 계절과 무관한 정적 디자인 토큰 — type scale / shape / state layer / elevation / motion.
// :root 에 한 번만 바인딩한다. 계절별 COLOR 역할은 theme-contract + themes/* 가 담당.
// (MD3 sys 토큰의 vanilla-extract 미러. 색만 동적, 나머지는 전부 정적.)

// next/font 변수로 배선한 폰트 스택 — Latin=Roboto, 한글은 Pretendard 로 폴백, 코드=Roboto Mono
const sans =
  "var(--font-roboto), 'Pretendard Variable', Pretendard, system-ui, sans-serif";
const mono =
  'var(--font-roboto-mono), ui-monospace, Menlo, Consolas, monospace';

export const tokens = createGlobalTheme(':root', {
  typeface: {
    brand: sans, // 브랜드용 글꼴 — 큰 제목 등 강조 텍스트
    plain: sans, // 본문용 기본 글꼴
    mono, // 고정폭 글꼴 — 코드·숫자 정렬
  },
  // typescale 값은 CSS font 단축 표기 = "굵기 글자크기/줄높이 글꼴" 순서.
  typescale: {
    displayLarge: `400 3.5625rem/4rem ${sans}`, // 가장 큰 표현용 — 히어로 문구
    displayMedium: `400 2.8125rem/3.25rem ${sans}`, // 큰 표현용 텍스트
    displaySmall: `400 2.25rem/2.75rem ${sans}`, // 작은 표현용 텍스트
    headlineLarge: `400 2rem/2.5rem ${sans}`, // 페이지 대제목
    headlineMedium: `400 1.75rem/2.25rem ${sans}`, // 섹션 제목
    headlineSmall: `400 1.5rem/2rem ${sans}`, // 작은 섹션 제목
    titleLarge: `400 1.375rem/1.75rem ${sans}`, // 카드·다이얼로그 제목
    titleMedium: `500 1rem/1.5rem ${sans}`, // 중간 제목(약간 굵게)
    titleSmall: `500 0.875rem/1.25rem ${sans}`, // 작은 제목
    bodyLarge: `400 1rem/1.5rem ${sans}`, // 기본 본문 텍스트
    bodyMedium: `400 0.875rem/1.25rem ${sans}`, // 보조 본문 텍스트
    bodySmall: `400 0.75rem/1rem ${sans}`, // 가장 작은 본문·캡션
    labelLarge: `500 0.875rem/1.25rem ${sans}`, // 버튼 등 UI 라벨
    labelMedium: `500 0.75rem/1rem ${sans}`, // 칩·탭 등 작은 라벨
    labelSmall: `500 0.6875rem/1rem ${sans}`, // 가장 작은 라벨
  },
  // shape = 모서리 둥글기(border-radius). 클수록 더 둥글다.
  shape: {
    none: '0', // 각진 모서리(둥글기 없음)
    extraSmall: '4px', // 아주 약간 둥글게 — 작은 요소
    small: '8px', // 살짝 둥글게
    medium: '12px', // 보통 둥글기
    large: '16px', // 카드 등 크게 둥글게
    extraLarge: '28px', // 큰 시트·FAB 등 아주 둥글게
    full: '9999px', // 완전 둥글게 — 알약·원형 버튼
  },
  // state = state layer(상호작용 시 덮는 반투명 층)의 불투명도. 클수록 진하게 반응.
  state: { hover: '0.08', focus: '0.12', pressed: '0.12', dragged: '0.16' },
  // elevation = 그림자 깊이. 숫자가 클수록 더 떠 있어 보인다(계층감).
  elevation: {
    level0: 'none', // 그림자 없음 — 바닥에 붙은 면
    level1: '0 1px 2px rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.15)', // 카드 등 살짝 떠 있음
    level2: '0 1px 2px rgba(0,0,0,.30), 0 2px 6px 2px rgba(0,0,0,.15)', // 약간 더 떠 있음
    level3: '0 1px 3px rgba(0,0,0,.30), 0 4px 8px 3px rgba(0,0,0,.15)', // 메뉴·팝오버 등
    level4: '0 2px 3px rgba(0,0,0,.30), 0 6px 10px 4px rgba(0,0,0,.15)', // 더 높이 떠 있음
    level5: '0 4px 4px rgba(0,0,0,.30), 0 8px 12px 6px rgba(0,0,0,.15)', // 가장 높이 떠 있는 면
  },
  // motion = 애니메이션 가속 곡선(easing)과 지속 시간(duration).
  motion: {
    easingStandard: 'cubic-bezier(0.2, 0, 0, 1)', // 표준 가속 곡선
    easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)', // 강조 동작용 곡선
    durationShort: '150ms', // 짧은 전환 — 작은 변화
    durationMedium: '250ms', // 보통 전환
    durationLong: '400ms', // 긴 전환 — 큰 화면 변화
  },
});
