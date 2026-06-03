import { spring } from './spring.css';
import { summer } from './summer.css';
import { autumn } from './autumn.css';
import { winter } from './winter.css';
import { night } from './night.css';

// 계절 레지스트리. 각 값은 createTheme 이 생성한 해시 클래스 문자열.
// 루트 요소에 하나를 부여하면 그 계절 팔레트가 활성화된다:
//   document.documentElement.className = seasonThemes['night'];
// 순서는 세그먼트/팝오버 스위처 UI 노출 순서(봄·여름·가을·겨울·밤)와 일치.
export const seasonThemes = { spring, summer, autumn, winter, night } as const;

export type Season = keyof typeof seasonThemes;

export const seasonMeta: Record<
  Season,
  { ko: string; en: string; scheme: 'light' | 'dark' }
> = {
  spring: { ko: '봄', en: 'Spring', scheme: 'light' },
  summer: { ko: '여름', en: 'Summer', scheme: 'light' },
  autumn: { ko: '가을', en: 'Autumn', scheme: 'light' },
  winter: { ko: '겨울', en: 'Winter', scheme: 'light' },
  night: { ko: '밤', en: 'Night', scheme: 'dark' },
};

// 노출 순서 보장용 배열 — UI 가 그대로 map 한다(Object key 순서 의존 회피).
// (.css.ts 는 직렬화 가능한 값만 export 가능 — 함수 export 금지.)
export const SEASON_ORDER: Season[] = [
  'spring',
  'summer',
  'autumn',
  'winter',
  'night',
];
