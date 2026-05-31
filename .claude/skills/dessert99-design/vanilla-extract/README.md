# vanilla-extract 변환본 · dessert99-blog tokens

`colors_and_type.css`(런타임 CSS 변수)를 **vanilla-extract**로 옮긴 버전입니다.
당신의 `createThemeContract` 연습 목표에 맞춰, 색은 **하나의 contract + 10개 구현**으로,
정적 토큰(타입·간격·모양·그림자·모션)은 **타입 안전한 TS 상수**로 분리했습니다.

> 이 파일들은 빌드에 연결돼 있지 않은 **이식용 소스**입니다. 당신 프로젝트의
> `src/styles/`(또는 원하는 위치)로 복사해서 쓰세요. vanilla-extract가 설치돼 있어야 합니다:
> `npm i -D @vanilla-extract/css` (+ 번들러 플러그인: vite/next/webpack).

## 파일
| 파일 | 내용 |
|---|---|
| `contract.css.ts` | `createThemeContract` — **색 토큰의 이름(shape)만** 정의 (값은 null) |
| `themes.css.ts` | `createTheme` ×10 — 봄·여름·가을·겨울·밤 × light/dark 구현 + `themes` 맵 |
| `tokens.ts` | 정적 토큰 — `typescale`, `radius`, `space`, `elevation`, `easing`, `duration` (계절 무관) |
| `PostCard.css.ts` | 예시 — 각진 포스트 카드 스타일 (contract + 정적 토큰 조합법) |

## 핵심 아이디어 (왜 contract 인가)
```ts
// contract.css.ts — 이름만, 값 없음
export const color = createThemeContract({
  primary: null, onPrimary: null, surface: null, /* …34 roles */
});
```
컴포넌트는 `color.primary` 처럼 **이름에만** 의존합니다. 테마가 5개든 50개든 컴포넌트 코드는
그대로고, 새 테마는 `createTheme(color, { … })` 구현 하나만 추가하면 끝입니다. 토큰은 인터페이스,
테마는 구현 — 한번 분리하면 테마는 데이터일 뿐입니다.

## 사용법

### 1) 테마 클래스 적용
`createTheme` 은 **클래스 이름**을 반환합니다. 루트(또는 임의의 컨테이너)에 붙이면 그 하위에서
contract 변수가 해당 계절·모드 값으로 채워집니다.

```tsx
import { springDark, autumnLight, themes } from './styles/themes.css';

// 정적으로
<html className={springDark}> … </html>

// 동적으로 (런타임 전환 — 리렌더 없이 CSS 변수만 교체)
const [season, setSeason] = useState<'spring'|'summer'|'autumn'|'winter'|'night'>('spring');
const [mode, setMode] = useState<'light'|'dark'>('dark');
<html className={themes[season][mode]}> … </html>
```

### 2) 스타일에서 토큰 참조
```ts
import { style } from '@vanilla-extract/css';
import { color } from './styles/contract.css';
import { radius, space, typescale } from './styles/tokens';

export const button = style({
  background: color.primary,
  color: color.onPrimary,
  borderRadius: radius.full,
  padding: `${space[2]} ${space[5]}`,
  font: typescale.labelLarge,
});
```

### 3) 폰트 (별도 로드)
토큰은 폰트 패밀리 이름만 참조합니다. 실제 웹폰트는 앱에서 로드하세요:
- **Pretendard** — `@font-face` 또는 `pretendard` npm 패키지
- **D2Coding** — jsDelivr `fonts-archive/D2Coding` (또는 official woff2 vendoring)
- 엔지니어링 노트 룩이라면 **Space Mono / JetBrains Mono**(구글 폰트)도 추가

## 매핑 메모
- 토큰 이름은 `--md-sys-color-*` → `color.camelCase` 로 1:1 변환했습니다
  (`--md-sys-color-on-primary-container` → `color.onPrimaryContainer`).
- 값은 전부 **OKLCH** 원본을 그대로 유지 — 런타임 CSS와 픽셀 동일합니다.
- 정적 토큰은 테마 전환과 무관하므로 contract 에 넣지 않고 `tokens.ts` 상수로 뒀습니다.
  필요하면 `createGlobalTheme(':root', …)` 으로 CSS 변수화할 수도 있습니다.
