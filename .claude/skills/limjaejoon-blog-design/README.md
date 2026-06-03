# 임재준 Blog — Material Design 3 × 5계절 디자인 시스템

개인 기술 블로그 **limjaejoon.com**(개인 포트폴리오 + "지식 모음" 아카이브)을 위한
디자인 시스템입니다. **Google Material Design 3 (Material You)** 를 기반으로,
다크/라이트 모드 대신 **다섯 개의 계절 테마 — 봄·여름·가을·겨울·밤** 으로 색을 운용합니다.
(밤 = 사실상 다크 모드.) 구현은 실제 코드베이스 스택인 **Vanilla Extract** 패턴을
연습할 수 있도록 레이어드 토큰 구조로 정리했습니다.

> **소스 저장소: <https://github.com/Dessert99/limjaejoon.com>** (Next.js 16 · React 19 · vanilla-extract · NestJS 모노레포)
> 블로그의 콘텐츠 구조·라우트·카피는 이 저장소에서 가져왔습니다. 더 정확한 화면 재현이
> 필요하면 저장소를 직접 탐색하세요. (단, **비주얼 방향은 기존 코드의 teal 모노톤을 버리고
> Material Design 3로 새로 설계**했습니다 — 사용자 요청.)

## 무엇을 만드나

- **제품**: 개인 기술 블로그 1종(웹). 홈(자기소개·프로젝트·기술), 지식 모음(태그 필터 글 목록),
  포스트(본문), 검색, 소개.
- **주인**: 임재준 (Lim Jae-joon) · 프론트엔드 개발자.
- **언어**: 100% 한국어 UI. 코드 식별자는 영어.

---

## 디자인 결정 (요청 반영)

| 항목 | 결정 |
|---|---|
| 디자인 언어 | **Material Design 3 (Material You)** — 톤 팔레트, color roles, state layer, shape scale, elevation tone |
| 테마 | 다크/라이트 ❌ → **5계절**: 봄·여름·가을·겨울·**밤**(다크) |
| 색 | 각 계절을 시드 색으로 반영 (봄=벚꽃 핑크, 여름=청량 시안, 가을=호박 오렌지, 겨울=쿨 블루, 밤=인디고 다크) |
| 구현 패턴 | **Vanilla Extract** — `createGlobalTheme` + `createThemeContract` + `createTheme` ×5 + `sprinkles` + `recipes` (중급~대규모 대비) |
| 타이포 | **Roboto**(라틴) + **Pretendard**(한글) + Roboto Mono(코드) |
| 전환 UX | **세그먼트 스위처** (봄·여름·가을·겨울·밤 칩) |

---

## 이식 가이드 — Claude Code 스킬로 쓰기

> **이 스킬은 UI를 "자동 교체"하지 않습니다.** 에이전트가 읽고 따라 만드는 **참고 자료**입니다.
> 즉, 스킬을 부르면 Claude가 이 토큰·컴포넌트·규칙을 근거로 **새 화면을 만들거나 기존 코드를
> 이 스타일로 고쳐줍니다.** 살아있는 사이트가 한 번에 바뀌는 마법이 아니라, "이 브랜드를 아는
> 동료 디자이너"를 옆에 두는 것에 가깝습니다.

### 설치 (Agent Skill)

1. 이 폴더(`limjaejoon-blog-design/`)를 통째로 프로젝트의 `.claude/skills/` 아래에 둡니다.
   (또는 개인 스킬로 `~/.claude/skills/`.)
2. `SKILL.md`의 frontmatter(`name`, `description`)가 진입점입니다 — Claude가 필요할 때 자동 인식합니다.
3. 대화에서 "이 스킬로 …을 만들어줘"라고 하거나, 디자인 작업 시 Claude가 알아서 불러옵니다.

### 실제 코드베이스(Next.js + vanilla-extract)로 옮기는 단계

이 스킬은 당신의 실제 스택에 맞춰 **거의 드롭인**입니다:

1. `material/tokens.css.ts` · `theme-contract.css.ts` · `themes/*` 를 `frontend/styles/` 로 복사.
2. 기존 `theme.css.ts`(teal 단일 테마)를 **걷어내고**, 루트 레이아웃에서 활성 계절 클래스를 부여:
   `document.documentElement.className = seasonThemes['night']`.
3. 컴포넌트가 참조하던 옛 토큰(`vars.color.accentStrong` 등)을 **MD3 역할**(`color.primary`,
   `color.surfaceContainer` …)로 치환. ← 여기가 유일한 "수작업" 단계입니다(컴포넌트 수만큼).
4. 신규 컴포넌트는 `sprinkles` / `recipes` 패턴으로 작성. `material-components.css`·`ui_kits/blog`가
   각 컴포넌트의 정답 모양입니다.
5. 계절 스위처 UI는 `ui_kits/blog`의 헤더 팝오버를 그대로 참고.

> 요약: **토큰·테마 교체는 거의 자동, 컴포넌트의 토큰 참조 치환은 반자동(에이전트가 대신 해줄 수 있음).**
> "UI 통째로 바꿔치기"를 원하면, 스킬을 켠 상태에서 "기존 컴포넌트를 이 디자인 시스템으로 마이그레이션해줘"
> 라고 시키면 됩니다 — 한 번에 다 바뀌는 게 아니라, 파일을 하나씩 정확히 고쳐 나갑니다.

---

## VISUAL FOUNDATIONS

### 큰 그림 — "계절이 바뀌는 Material 블로그"

순수 MD3 표면 위에서 **단 하나의 루트 클래스**(`.theme-봄/…/.theme-밤`)를 바꾸면 전체 UI가
그 계절의 팔레트로 리스킨됩니다. 구조(톤·shape·elevation·타입)는 5계절이 공유하고, **색만**
계절별로 회전합니다. 이것이 MD3 color roles의 핵심 — 간접 참조(indirection)입니다.

### 컬러 — MD3 color roles, oklch로 표현

- 모든 색은 `--md-sys-color-*` **역할(role)** 로만 참조합니다. 절대 raw hex를 컴포넌트에 직접 쓰지 않습니다.
- 역할: `primary` / `on-primary` / `primary-container` / `on-primary-container`, 동일 패턴의
  `secondary` · `tertiary` · `error`, 그리고 surface 계열(`surface`, `surface-container-lowest…highest`,
  `surface-variant`, `on-surface`, `on-surface-variant`), `outline` / `outline-variant`,
  `inverse-surface` / `inverse-primary` 등.
- 값은 **`oklch(L C H)`** 로 적습니다. 계절은 같은 톤(L·C 구조)을 공유하고 **H(색상)만 회전** →
  파생이 일관됩니다. 시드: 봄 `#E8A1C4`, 여름 `#3FB6C9`, 가을 `#E08A3C`, 겨울 `#7E9BD4`, 밤 `#3A3550`.
- 봄·여름·가을·겨울은 **light scheme**, 밤은 **dark scheme** 매핑.

### 타이포그래피 — MD3 type scale

- Roboto(라틴) + Pretendard Variable(한글) 페어링. 코드는 Roboto Mono.
- 스케일: display(L/M/S) · headline(L/M/S) · title(L/M/S) · body(L/M/S) · label(L/M/S).
  값은 `--md-sys-typescale-*` 로, `font:` 단축 + 클래스(`.headline-medium` 등)로 제공.

### Shape · Elevation · State · Motion

- **Shape scale**: none 0 · extra-small 4 · small 8 · medium 12 · large 16 · extra-large 28 · full.
  버튼/칩 = full, 카드 = medium, 다이얼로그 = extra-large.
- **Elevation**: MD3는 그림자 + **surface-container 톤**을 함께 사용해 높이를 표현(level 0–5).
- **State layer**: 인터랙티브 표면 위 `currentColor` 오버레이 — hover .08 / focus .12 / pressed .12.
  (`.state` 클래스 = `::before` 오버레이 패턴.)
- **Motion**: standard easing `cubic-bezier(.2,0,0,1)`; short 150 / medium 250 / long 400ms.

### 카드 / 버튼 / 인터랙션 규칙

- 버튼 5종: filled(primary) · tonal(secondary-container) · elevated(surface-low+shadow) · outlined · text.
- 카드 3종: elevated · filled(surface-container-highest) · outlined(outline-variant).
- 모든 클릭 가능 표면은 `.state` 오버레이로 hover/press 피드백. 별도 색 변경 대신 톤 오버레이가 시그니처.
- 표면 배경은 **solid**(그라디언트 장식 없음). 단 hero·primary-container 같은 강조 표면은 풀 컬러.

---

## CONTENT FUNDAMENTALS

블로그 카피 톤은 원본 코드베이스를 유지합니다(Material로 바뀐 건 비주얼뿐).

- **톤**: 정돈된 학습 노트. 농담·밈·이모지·느낌표 없음.
- **어미**: UI 카피는 `~합니다/~입니다`(하십시오체), 포스트 본문은 `~한다/~다`(평서형).
- **인칭**: 주어 생략이 기본. 과정 중심 서술("기여하고 있습니다", "고민하며").
- **고유 네이밍**: 메뉴는 "Blog/Posts" 대신 **"지식 모음"**. 섹션 헤딩은 2글자 선호(소개·프로젝트·기술).
- **마이크로카피 예**: `제목, 설명, 태그로 검색...` · `검색어를 입력해 주세요.` ·
  `검색 결과가 없습니다.` · `개념 정리와 레퍼런스를 모아두는 공간입니다.`
- 기술 용어는 영문 + `backtick`. 강조는 핵심 단어만.

---

## ICONOGRAPHY

- **Material Symbols** 스타일 아이콘(24px, `currentColor` fill)을 인라인 SVG로 사용 →
  테마·state에 맞춰 자동 변색. (원본 코드베이스는 `react-icons`를 썼지만, MD3로 옮기며
  Material Symbols 셰입으로 통일. **대체 플래그**: 정적 HTML이라 라이브러리 대신 동등한 인라인
  SVG path를 직접 넣었습니다.)
- 자주 쓰는 글리프: menu · search · add · edit · favorite(+border) · check · more_vert ·
  home · article · person · share · arrow_back · 그리고 브랜드 GitHub.
- **에모지 / 유니코드 장식 문자 안 씀.**
- **로고 / 프로필**: `assets/logo.png` — 수채화 일러스트 아바타. 앱바에서 40px 원형.

---

## INDEX — 폴더 안내

| 경로 | 내용 |
|---|---|
| `README.md` | (이 파일) |
| `SKILL.md` | Claude / Agent Skill 진입 지침 |
| `colors_and_type.css` | **토큰 CSS** — MD3 sys 토큰 + 5계절 색 클래스. `:root`=봄 기본, `.theme-*`로 전환 |
| `material-components.css` | MD3 컴포넌트의 플레인-CSS 구현 (`recipes.css.ts`의 미러). preview·kit이 공유 |
| `material/` | **Vanilla Extract 레퍼런스** (연습용) — 아래 표 |
| `assets/logo.png` | 아바타 로고 |
| `preview/` | Design System 탭 카드 (아래 목록) |
| `ui_kits/blog/` | MD3 × 5계절 블로그 클릭형 프로토타입 |

**`material/` (Vanilla Extract 패턴)**

| 파일 | 역할 |
|---|---|
| `tokens.css.ts` | `createGlobalTheme(:root)` — 계절 무관 정적 토큰(타입·shape·state·elevation·motion) |
| `theme-contract.css.ts` | `createThemeContract` — 계절별 색 역할의 "모양만" |
| `themes/{spring,summer,autumn,winter,night}.css.ts` | `createTheme` — 계절별 실제 값 |
| `themes/index.css.ts` | `seasonThemes` 레지스트리 + 월→계절 헬퍼 |
| `sprinkles.css.ts` | 반응형 atomic props + 색 역할 바인딩 |
| `recipes.css.ts` | 컴포넌트 변형(button·card·chip) + state layer |
| `README.md` | 레이어 구조 설명 + CSS 프리뷰와의 매핑 |

**`preview/` 카드**

| 그룹 | 파일 |
|---|---|
| Type | `type-scale` |
| Colors | `color-roles`, `seasons-overview`, `surfaces` |
| Spacing | `shape-scale`, `elevation`, `state-layers` |
| Components | `season-switcher`, `buttons`, `fab`, `cards`, `chips`, `text-fields`, `selection-controls`, `app-bar`, `navigation`, `lists`, `menu-dialog-snackbar` |
| Brand | `logo` |

---

## CAVEATS

- **폰트**: Roboto + Pretendard + Roboto Mono를 CDN으로 로드. 원본 코드베이스는 시스템 스택을
  쓰므로, 실제 도입 시 폰트 파일 번들 여부 확인 필요.
- **계절 팔레트는 oklch 수식 파생값**입니다 — Google이 쓰는 HCT 알고리즘의 정밀 톤 팔레트가
  아니라, 같은 시드 방향을 oklch로 근사한 것. 특정 계절 색을 더 채도 높게/낮게 원하면
  `colors_and_type.css`의 계절 `hp/cp` 값(또는 `material/themes/*`)만 조정하면 전 컴포넌트에 반영됩니다.
- **아이콘**: Material Symbols 라이브러리 대신 동등 인라인 SVG path 사용(정적 HTML 제약).
- **Vanilla Extract `.css.ts`** 파일은 **타입/패턴 레퍼런스**이며 이 프로젝트에서 직접 컴파일되지
  않습니다. 브라우저 프리뷰(`colors_and_type.css`)와 값이 동일하도록 같은 oklch에서 생성했습니다.
- **밤(Night)** 이 요청대로 다크 스킴 역할을 합니다. 별도 "라이트/다크 토글"은 없습니다.
