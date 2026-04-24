# 임재준 Blog — Design System

개인 기술 블로그를 위한 디자인 시스템입니다. Next.js 16 + vanilla-extract 기반의 실제 코드베이스에서 토큰·스타일을 그대로 추출하여, 다른 화면이나 보조 자료를 만들 때 브랜드 일관성을 유지할 수 있도록 구성했습니다.

## 이 블로그는 무엇인가요?

- **이름 / 주인**: 임재준 (Lim Jae-joon). 사이트 헤더는 "임재준 | 프론트엔드 개발자".
- **성격**: 개인 기술 블로그 겸 포트폴리오. 공부한 내용을 정리·공유하는 "지식 모음(knowledge archive)" 컨셉.
- **홈(`/`)**: 자기소개 + 경력 / 활동 / 프로젝트 / 기술 / 학력 타임라인.
- **블로그(`/blog`)**: 태그 필터가 달린 포스트 리스트. 현재 Git, Next.js, Playwright, DNS, zshrc 등 개발 기본기 노트 17편.
- **포스트(`/blog/[slug]`)**: MDX 본문 + 자동 생성 목차(TOC) + `<Tooltip>` / `<Mention>` 인라인 컴포넌트.
- **검색(`/search`)**: 제목·설명·태그 기반 클라이언트 사이드 필터.
- **제품 수**: 1개 (블로그 웹사이트). 모바일 앱은 없음.
- **언어**: 100% 한국어. 코드 안 식별자는 영어.

## 소스

- **Codebase**: `frontend/` (이 프로젝트에는 **복사되지 않음** — 사용자 로컬에 마운트된 상태로 읽기 전용 접근).
  - 주요 토큰: `frontend/styles/theme.css.ts`
  - 전역 스타일: `frontend/styles/global.css.ts`, `frontend/styles/utils.css.ts`
  - 브레이크포인트: `frontend/styles/breakpoints.ts` (md 768 / lg 1024 / xl 1280)
  - 헤더: `frontend/features/navigation/components/SiteHeader.*`
  - 홈 위젯: `frontend/features/about/components/*`
  - 블로그 위젯: `frontend/features/blog/components/*`
  - 프로필 데이터: `frontend/features/about/data/profile.ts`
- **Figma / 디자인 파일**: 없음. 모든 디자인 근거는 코드.
- **로고 / 이미지**: `frontend/public/images/logo.png` (복사본이 `assets/logo.png`).

---

## CONTENT FUNDAMENTALS

**톤 — 정돈된 학습 노트.** 가볍거나 농담조가 아님. 그렇다고 격식 높은 비즈니스 문서도 아닌, "나를 위해 정리하면서 같은 공부를 하는 사람에게 공유한다"는 톤. 단정적이고 설명적인 평서문이 많음.

### 인칭 / 어미

- **인칭 주어는 거의 생략.** "입니다", "~한다", "지향합니다" 같이 주어 없는 문장이 기본.
- **포스트 본문**: "~한다", "~다", "~이다" (해라체 / 평서형). 예: *"macOS와 리눅스에서 기본으로 많이 쓰이는 셸이 바로 `zsh`이다."*
- **홈페이지 / UI 카피**: "~합니다", "~입니다" (하십시오체). 예: *"프로젝트를 단순히 기능 구현에 그치지 않고..."*, *"검색어를 입력해 주세요."*
- **"I vs you"**: 둘 다 드묾. 블로그 포스트는 문제 중심 서술. 홈은 "나"를 주어로 쓰지만 대체로 생략.

### 스타일 규칙

- **문장은 짧고 논리적으로 끊어 번호 매김.** 포스트 대부분이 `1. ... 2. ... 3. ...` 구조. 한 문장 = 한 아이디어.
- **정의 → 맥락 → 예시** 순서. "X는 Y다. 그 이유는 Z다. 예를 들어..."로 흐름.
- **기술 용어는 영문 + backtick**. 예: `.zshrc`, `HEAD`, `useSyncExternalStore`. 한글 풀이는 뒤나 앞에 자연스럽게.
- **강조**는 `**볼드**`로 핵심 단어만. 예: *"근거 없는 코드를 **지양**하며 ... 합리적인 개발을 **지향**합니다."* 대조 쌍을 강조하는 버릇이 있음.
- **느낌표 / 이모지 / 밈 없음.** 전무.

### 마이크로카피 (UI) 예시

| 위치 | 원문 |
|---|---|
| 검색 placeholder | `제목, 설명, 태그로 검색...` |
| 검색 empty (초기) | `검색어를 입력해 주세요.` |
| 검색 empty (결과 없음) | `검색 결과가 없습니다.` |
| 블로그 empty | `해당 태그의 포스트가 없습니다.` |
| 블로그 페이지 설명 | `개념 정리와 레퍼런스를 모아두는 공간입니다.` |
| 태그 사이드바 라벨 | `태그` / `전체` |
| 테마 토글 aria | `라이트 모드로 전환` / `다크 모드로 전환` |
| 네비 | `지식 모음` (← "Blog"/"Posts" 대신 쓰는 고유 네이밍) |
| 섹션 헤딩 | `경력`, `활동`, `프로젝트`, `보유 기술`, `학력`, `목차` |

### 이름 짓기의 버릇

- 메뉴는 영어 일반 명사("Blog", "Posts") 대신 **한국어 고유 표현**("지식 모음")을 씀 → 개인 아카이브 느낌을 강화.
- 섹션 헤딩은 **2글자 단어** 선호(경력 / 활동 / 학력 / 목차).
- 설명문에서 "**기여하고 있습니다**", "**학습했습니다**", "**고민하며**" 같은 진행/과정형 동사를 자주 사용 → 결과보다 **과정 중심**의 자기서술.

---

## VISUAL FOUNDATIONS

### 큰 그림 — "디지털 노트"

전체 분위기는 **깔끔한 모노톤 위에 단 하나의 teal 액센트**. 종이 느낌도, 그라디언트 과시도 없음. "잘 정리된 마크다운 파일"을 브라우저로 번역한 미감. 가독성이 최우선이고 장식은 최소.

### 컬러

- **중립 그레이스케일 + teal 액센트 1개.**
- 다크(기본): `#121212` 페이지, `#1a1a1a` 엘레베이티드, `#2a2a2a` soft. 텍스트 `#f5f5f5` / `#d4d4d8` / `#a1a1aa` 3단. 라인 `#303030` / `#4a4a4a`.
- 라이트: `#ffffff` 페이지, `#f8f9fa` 엘레베이티드, `#f1f3f5` soft. 텍스트 `#1a1a1a` / `#495057` / `#868e96`. 라인 `#e9ecef` / `#ced4da`.
- **액센트**: Mantine teal — 다크에서 `#12b886`, 라이트에서 `#0ca678`. `accent-soft`는 15% / 10% 알파. 링크, 활성 상태, 태그, 타임라인 마커, 포커스 링 전부 이것만 사용.
- **그 외 색 없음.** 경고/에러/성공 semantic color도 정의되지 않음 (블로그이기 때문).

### 타이포그래피

- **Body**: Pretendard Variable (한국어 + 라틴), 현재 코드는 시스템 기본 스택이지만 Pretendard로 대체 → **유저 확인 필요** (flag).
- **Mono / 코드**: JetBrains Mono (시스템 `ui-monospace` 폴백). 코드 하이라이팅은 Shiki `github-dark` / `github-light`.
- **스케일** (rem, 1rem = 16): xs 12, sm 14, base 16, lg 18, xl 20, 2xl 24, 3xl 30, 4xl 36, 5xl 48.
- **라인 하이트**: 본문 1.6, 프로즈(블로그 본문) 1.8, 타이틀 1.3.
- **Letter-spacing**: 제목은 `-0.02em` ~ `-0.025em`. 캡션 라벨은 `0.08em` + uppercase.
- **Weight**: 400 / 500 / 600 / 700. 본문은 400, 강조·타이틀은 600–700.
- **프로즈 본문 크기**는 18px(`fs-lg`) — 블로그 가독성에 커밋한 선택.

### 공간 · 리듬

- 페이지 좌우 패딩: 모바일 `1rem`, ≥md `6rem`.
- 콘텐츠 최대 폭: 홈 `60rem`, 블로그 리스트 `72rem`, 포스트 `85rem` (사이드 TOC 포함).
- 섹션 상·하 패딩: 모바일 `2.5rem`, ≥md `3.5rem`.
- 카드 내부 패딩: `1rem 1.125rem` ~ `1.125rem 1.25rem`.

### 배경 / 이미지

- **텍스처·패턴·그라디언트 없음.** 배경은 solid color만. 헤더만 `backdrop-filter: blur(8px)` + 80% alpha로 살짝 반투명.
- **풀블리드 이미지 없음.** 유일한 이미지 자산은 로고 1장 (수채화 일러스트 아바타).
- **일러스트 / 포토그래피 없음.** 블로그 카드나 포스트에 썸네일 없음.
- **아이콘 외 SVG 장식 없음** (`<Mention>` 컴포넌트의 "외부링크 화살표" 인라인 SVG 1개가 예외).

### 모션

- 이징은 **전역 `ease`** 하나 (커스텀 베지어 없음).
- **지속시간**: `150ms` (hover 전환), `200ms` (global 테마 전환), `600-800ms` (reveal, fadeUp).
- **효과**: `fadeUp`(IntersectionObserver로 뷰포트 진입 시 `translateY(20px) → 0`, `opacity 0 → 1`). Hero tagline은 `index * 0.15s` 스태거.
- **반드시 `prefers-reduced-motion: reduce` 를 존중** — 모든 애니메이션 블록에 reduce 가드 있음.
- 바운스 / 오버슈트 / 스프링 없음.

### Hover / Press / Focus

- **Hover**: 링크·네비·칩 → `color: accent-strong`, `border-color: accent-strong`, `background: accent-soft`. 3가지가 세트로 같이 켜지는 게 시그니처.
- **프로젝트 카드 hover**: `translateY(-2px)` + border → accent + `shadow-card-md`. 카드에만 들어가는 미세한 리프트.
- **Press 상태 전용 스타일 없음.** (`:active` 별도 정의 없음 → 브라우저 기본)
- **Focus-visible**: `outline: 2px solid var(--accent-strong); outline-offset: 2px` 전역 규칙. 포커스도 액센트 색으로 통일.

### Border / Shadow

- **Border 1px 실선**이 기본 구분선. `line-soft`(경계), `line-strong`(더 강한 윤곽), `accent-strong`(활성/hover).
- **Shadow**는 두 단계뿐: `card-sm` (`0 1px 3px rgba(0,0,0,.24)` / 라이트 `.08`)과 `card-md` (`0 10px 28px rgba(0,0,0,.36)` / 라이트 `.12`).
- **Inner shadow / glow / neon 없음** — 예외로 Tooltip 팝오버에 `0 0 8px accent-soft` (은은한 teal glow).

### 모서리 Radius

- `md 6px` — 인라인 코드, 작은 요소
- `lg 8px` — 카드, pre
- `xl 12px` — 네비 링크, 검색 입력, 태그 그리드 카드, 테마 버튼
- `2xl 16px` — 거의 사용 안 함 (정의만 존재)
- `full 9999px` — 태그 칩, 프로필 로고 원형, 마커, 아이콘 버튼, 타임라인 레일

### 투명도 / 블러

- **`backdrop-filter: blur(8px)` + 80% alpha**는 **사이트 헤더에만** 쓰임. 나머지는 불투명.
- `accent-soft` 15% / 10% alpha는 호버·활성 배경으로 쓰이는 유일한 반투명 컬러.
- Glassmorphism 아님 — 한 곳에서만 쓰이는 기능적 사용.

### 카드

- `1px solid line-soft` + `radius-lg` + `bg-surface` + `shadow-card-sm` — 4점 세트. 프로젝트 카드만 hover 시 `-2px` lift + accent border로 전이.
- 그림자는 매우 subtle (눈에 띄지 않음). "카드가 떠있는" 느낌보다 "담아둔 섹션"에 가까움.

### 레이아웃 규칙

- 헤더 `position: fixed`, `top: 0`, `z-index: 50`. `content-wrapper`가 `padding-top: 7rem`으로 비껴줌.
- 타임라인: 왼쪽에 `2px` 세로 레일 + 항목마다 `0.75rem` teal dot marker (`box-shadow: 0 0 0 3px bg-page`로 레일을 뚫은 듯이).
- TOC: 본문 옆에 `grid-template-columns: 1fr 15rem` (≥lg), sticky `top: 10rem`, 왼쪽 `1px solid line-soft` 구분선.
- 태그 사이드바: 모바일은 가로 플로우(`flex-wrap`), ≥md부터 sticky 세로 컬럼.

### 다크/라이트 테마 전환

- 둘 다 퍼스트클래스. 테마 토큰이 완전히 대응.
- 토글은 아이콘 버튼 (`HiOutlineSun` / `HiOutlineMoon`). `localStorage.theme = 'dark'|'light'`.
- html `data-loading` 플래그로 hydration 시 플래시 방지.
- **전환은 200ms bg/color 크로스페이드**.

### 한국어 조판 세부

- `<html lang="ko">`.
- `break-word`, `word-break: break-word` 사용 (TagGrid 카드 등). 한글+영문 혼합 시 박스 터짐 방지.
- 자간(letter-spacing) 제목 `-0.02em` — 한글에서도 살짝 타이트하게.

---

## ICONOGRAPHY

- **라이브러리**: [`react-icons`](https://react-icons.github.io/react-icons/) 5.5.
- **사용되는 세트**:
  - `Hi2` (Heroicons v2 outline) — `HiOutlineSun`, `HiOutlineMoon`, `HiOutlineMagnifyingGlass`, `HiOutlineEnvelope`, `HiOutlinePhone`
  - `Si` (Simple Icons — 브랜드 로고) — `SiGithub`, `SiLinkedin`, `SiNextdotjs`, `SiReact`, `SiTypescript`, `SiJavascript`, `SiExpo`, `SiNestjs`
- **스타일**: **Heroicons outline + Simple Icons 브랜드**. stroke-based 아이콘과 fill-based 브랜드 로고 혼용. 사이즈는 글자 크기 상속(`font-size: var(--fs-xl)` 정도가 기본).
- **SVG는 `currentColor`**로 렌더 → 테마·hover에 맞춰 자동 변색.
- **에모지 / 유니코드 장식 문자 쓰지 않음.** 마커로 "•" 같은 문자 대신 실제 원형 `<span>` + 배경색.
- **로고 / 프로필**: `assets/logo.png` — 수채화 스타일 일러스트. 사이트 헤더에서 48×48 원형 크롭으로 표시.
- **인라인 SVG**: `<Mention>`의 외부링크 화살표 1개만 하드코드(16x16 viewBox, `fill: currentColor`).

**이 디자인 시스템에서의 아이콘 대체**: `react-icons`는 브라우저 직접 로드할 수 없으므로, 프리뷰·샘플에서는 Heroicons / Simple Icons 를 **CDN SVG** 로 불러오거나 인라인 SVG로 대체합니다. 스타일(outline weight, corners)이 맞으면 모양 동등.

---

## INDEX — 이 폴더의 파일들

| 경로 | 내용 |
|---|---|
| `README.md` | (이 파일) |
| `SKILL.md` | Claude / Agent Skill용 진입 지침 |
| `colors_and_type.css` | 토큰 CSS — `:root`에 컬러·타이포 변수. 다크 기본, `.light`로 플립 |
| `assets/logo.png` | 임재준 아바타 로고 (원본 1024x1536, 헤더에선 48x48 원형) |
| `preview/` | Design System 탭에 보여줄 카드 HTML 모음 |
| `ui_kits/blog/` | 블로그 UI 키트 — `index.html` + JSX 컴포넌트들 |

**UI 키트 목록**: 제품이 블로그 웹사이트 1개뿐이므로 `ui_kits/blog` 하나만 존재. 슬라이드 템플릿은 원본 프로젝트에 없어 생성하지 않음.

---

## CAVEATS

- **폰트 파일**: 코드베이스는 시스템 기본 스택을 사용 중. 이 디자인 시스템은 **Pretendard Variable + JetBrains Mono**를 CDN으로 가정했습니다. 사용자가 실제로 어떤 폰트를 원하는지 확인 필요.
- **아이콘**: 원본은 `react-icons`(JS 번들) 사용. 정적 HTML에서는 동일한 아이콘 세트를 CDN SVG / 인라인으로 대체했습니다. 모양은 동일.
- **Figma 없음**: 모든 근거가 코드. 변형이 필요하면 코드가 정답.
