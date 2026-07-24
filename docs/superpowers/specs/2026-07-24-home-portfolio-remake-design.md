# 홈/포트폴리오 리메이크 설계 (Home Portfolio Remake)

> **구현은 다른 세션에서 진행한다.** 이 문서는 그 세션이 자족적으로 실행할 수 있도록 쓴 설계 스펙이다. 단계별 실행은 짝 문서 `plans/2026-07-24-home-portfolio-remake.md` 참고.

## 배경

`refactor/project` 브랜치는 인프라(FSD 재구조화·디자인 시스템·Supabase 블로그·어드민 인증)를 새로 올렸지만, **홈은 "Shell ready" 껍데기**다. 옛 사이트(`main` 브랜치)에는 실제 포트폴리오 홈(Hero·Skills·경력/활동/학력 타임라인·Projects)이 있다. 이 포트폴리오를 **새 디자인 시스템 위에 이식**해 리메이크 MVP의 첫 출시본을 완성한다.

`main`은 옛 4테마 시스템·`button` recipe·구식 폴더구조(`frontend/`) 기반이라 **복붙이 아니라 재구현**이다. 콘텐츠(프로필 데이터)와 컴포넌트 구조는 그대로 가져오되, 스타일은 현재의 다크 2모드 토큰·sprinkles·기존 `shared/ui` 프리미티브로 다시 짓는다.

## 목표

- `main` 홈의 포트폴리오 구조를 현재 아키텍처로 이식한다: Hero, Skills, 경력/활동/학력 Timeline, Projects.
- 공용 헤더(네비게이션)를 도입한다 — 현재 `widgets` 레이어가 비어 있어 사이트 전역 네비가 없다.
- 껍데기 홈을 실제 포트폴리오로 교체한다.

## 범위

**포함:**
- `entities/profile` — 프로필 정적 데이터·타입 이식
- `shared/ui/Timeline` — 타임라인 공용 컴포넌트
- `shared/ui/IconTile` — 아이콘 링크 타일 (연락처·헤더 공용)
- `widgets/site-header` — 공용 헤더 (신규 레이어)
- `pages/home` — Hero/Skills/Projects/ContactLinks 섹션 + 조립
- `app/(public)` — 라우트 그룹으로 헤더 공통 적용

**제외 (이유):**
- 블로그 목록·상세, 태그/검색 필터 — 이미 Supabase 기반으로 구현됨
- 웹 에디터(글 작성·수정) — 이미 구현·검증됨 (`features/post-editor`, `app/api/admin/posts`)
- **게시글 삭제** — 별도 스펙/플랜으로 분리 (사용자 결정). 후속 참고
- 스크롤 리빌 등 모션 이펙트 — "이펙트는 사용자가 직접" 원칙(디자인 시스템 컨벤션)에 따라 보류
- 푸터 — `main`에 없었음 (YAGNI)
- Lab 네비 노출 — `main` 네비에 없었음 (사용자 결정). `/lab` 경로는 유지
- admin 헤더 — public 헤더는 admin에 적용하지 않음

## 확정 결정

1. **바텀업 순서** — 의존 방향(entities → shared → widgets → pages)대로 토대부터 쌓는다. 각 단위를 TDD로 완성 후 다음.
2. **라우트 그룹 `(public)`** — `main`처럼 `app/(public)/`을 만들어 home·blog·lab을 넣고 헤더를 공통 적용한다. 괄호 그룹이라 **URL은 불변**(파일 이동만). `admin`은 그룹 밖에 남겨 헤더 미적용.
3. **ThemeToggle을 헤더로 이동** — 현재 루트 레이아웃의 우상단 fixed 플로팅 → `SiteHeader` 액션으로. 디자인 시스템 컨벤션에 예정돼 있던 이동이다.
4. **react-icons 의존성 추가** — Skills의 기술 브랜드 아이콘(`SiNextdotjs`·`SiReact`·`SiTypescript`·`SiJavascript`·`SiExpo`·`SiNestjs`), 연락처·헤더의 `FaGithub`·`FaLinkedin`. 브랜드 로고를 인라인 SVG로 대체하는 것은 비현실적이라 `main`과 동일하게 라이브러리를 쓴다.
5. **모션 보류** — `main`의 `SectionReveal`(스크롤 리빌)은 이식하지 않고 섹션을 정적 렌더한다. 이펙트는 사용자가 이후 직접.

## main → 리메이크 차이

| 축 | main | 리메이크 | 이 작업? |
| --- | --- | --- | --- |
| 홈/포트폴리오 | 있음(옛 4테마) | 재구현(다크 2모드) | ✅ |
| 공용 헤더 | `widgets/site-header` | 신규 이식 | ✅ |
| 스타일 시스템 | 4테마·button recipe | 다크 2모드 토큰·sprinkles·Button | ✅ |
| 아이콘 | react-icons | react-icons(동일) | ✅ 의존성 추가 |
| 블로그 데이터 | MDX 파일 | Supabase 원격 | 이미 됨 |
| 웹 에디터 | 없음 | 있음 | 이미 됨 |

## FSD 구조 (단위별 책임·인터페이스·의존)

### `entities/profile` (신규)

- **책임:** 프로필 정적 데이터와 타입만 보유. 로직 없음.
- **구성:** `model/{types,profile,experience,education,projects,skills,activities}.ts` + `index.ts`(공개 API).
- **타입:** `Profile`(name·role·taglines·contacts), `TimelineItem`(title·subtitle?·period·description?·stack?), `Project`(name·description·period·stack·links), `ProjectLink`, `ContactLink`, `ContactKind`(`'github' | 'linkedin'`). `skills`는 `string[]`.
- **의존:** 없음 (순수 데이터).
- **이식:** `main:frontend/src/entities/profile/` 콘텐츠를 그대로 가져온다 — 실제 개인 정보라 내용 재사용.

### `shared/ui/Timeline` (신규)

- **책임:** 제목 + `TimelineItem[]`을 받아 목록 렌더. 경력·활동·학력이 공유.
- **인터페이스:** `<Timeline title items={TimelineEntry[]} />`.
- **구성:** 폴더형 `{Timeline.tsx,.css.ts,.test.tsx,.stories.tsx,index.ts}` — Button 파이프라인 규약 준수. 슬라이스 공개 API(`shared/ui/index.ts`)가 직접 re-export(컴포넌트별 배럴 없음).
- **의존:** 없음. `items` 프롭 타입(`TimelineEntry`)을 컴포넌트가 **자체 정의**한다 — `entities/profile`을 import하지 않는다. `shared`가 `entities`를 import하면 FSD 방향(entities→shared)이 역행하므로. `entities/profile`의 `TimelineItem`과 **구조적으로 호환**되어 `<Timeline items={experience} />`가 그대로 타입 통과한다(레이어 결합 없이 구조적 타이핑으로 연결 — 이 레포의 의도적 2벌 shape 선례와 동일). 디자인 토큰·sprinkles.

### `shared/ui/IconTile` (신규)

- **책임:** 외부 링크 아이콘 하나를 접근성 있는 타일로 렌더. ContactLinks와 SiteHeader가 공유.
- **인터페이스:** `<IconTile icon href ariaLabel />` (`icon`은 react-icons `IconType`).
- **의존:** react-icons 타입, 토큰·sprinkles.

### `widgets/site-header` (신규 레이어)

- **책임:** 사이트 전역 헤더 — 로고(홈 링크) + 네비 + 액션.
- **구성:** `ui/SiteHeader/`, `config/navItems.ts`(`[{label:'홈',href:'/'}, {label:'지식 모음',href:'/blog'}]`), `model/types.ts`(`NavItem`), `index.ts`.
- **액션:** GitHub 링크(`IconTile` + `FaGithub`) + `ThemeToggle`(`features/theme-toggle`에서 가져옴).
- **동작:** 현재 경로에 해당하는 네비 링크에 active 표시 → **클라이언트 컴포넌트**. `usePathname`은 **`@/shared/lib`의 non-null 래퍼**를 쓴다 — `next/navigation`을 직접 쓰면 루트 `pages/` 센티널 때문에 `string | null`로 추정돼 `pathname.startsWith(...)`가 tsc 실패.
- **의존:** `features/theme-toggle`, `shared/ui/IconTile`, `shared/lib`(usePathname), 토큰.

### `pages/home` (교체)

- **책임:** 포트폴리오 홈 조립. 현재 껍데기 `HomePage`·`GsapSmoke`를 교체.
- **구성:** `ui/HomePage.tsx` + `ui/{HeroSection,SkillsSection,ProjectsSection,ContactLinks}/`.
- **HomePage 조립 순서:** Hero → Skills → Timeline(경력) → Timeline(활동) → Projects → Timeline(학력). `main` 순서 유지.
- **섹션 렌더 요약:**
  - **HeroSection:** `profile.name` 인사 + `taglines`(각 줄 `**볼드**` 파싱) + CTA 버튼(`shared/ui/Button`, `/blog`로) + `ContactLinks`.
  - **SkillsSection:** "보유 기술" 제목 + `skills` 각각을 브랜드 아이콘(react-icons/si)과 함께 리스트.
  - **ProjectsSection:** "프로젝트" 제목 + `projects` 카드 그리드(이름·기간·설명·스택 칩·링크).
  - **ContactLinks:** `contacts`를 `IconTile` 리스트로 (`aria-label='연락처'`).
- **의존:** `entities/profile`, `shared/ui/{Timeline,IconTile,Button}`, react-icons.
- **렌더링:** 정적 콘텐츠라 **Server Component**.

### `app/(public)` (신규 라우트 그룹)

- **구성:** `app/(public)/layout.tsx`(`SiteHeader` + 콘텐츠 래퍼) + 기존 `page.tsx`·`blog/`·`lab/`를 이 그룹으로 이동.
- **주의:** 괄호 그룹은 URL에 영향 없음. 파일 이동뿐이고 `@/` alias import라 경로 깨짐 없음.
- **ThemeToggle 이전:** 루트 `app/layout.tsx`에서 렌더하던 `ThemeToggle`을 제거하고 `SiteHeader`로 옮긴다. `themeBootScript`(FOUC 방지 인라인 스크립트)는 루트 레이아웃에 유지 — 전역이므로.

## 데이터 흐름

- `profile` 데이터는 **정적 모듈 상수**. 섹션·Timeline이 직접 import. **fetch 없음.** (블로그 글만 Supabase에서 오며 이 작업 범위 밖.)
- 홈은 Server Component. 유일한 클라이언트 경계는 `SiteHeader`(usePathname) 및 내부 `ThemeToggle`.

## 스타일·디자인 제약

- **토큰:** 다크 기본 2모드 `vars.color.*`. **sprinkles**로 레이아웃·간격·색, **style()**은 연출만. 합성은 `style([sprinkles({...}),{...}])`.
- **재사용:** `main`의 `button` recipe 대신 **기존 `shared/ui/Button`**. 스크림·플로팅 등 필요 시 기존 프리미티브.
- **AI티 배제:** 솔리드 토큰, 절제된 연출, "감성 카페" 무드. 보라 그라데이션·글래스 남발·템플릿틱 디테일 금지.
- **주석:** 파일 헤더·모든 export 단일 라인 JSDoc, 본문 비자명 로직은 한 줄 `//` WHY.

## 고아 정리

이 변경으로 안 쓰이게 되는 것만 제거한다:
- 껍데기 `pages/home/ui/HomePage.tsx`(교체됨)와 `GsapSmoke.{tsx,css.ts,test.tsx}`(홈에서만 쓰임).
- GSAP 의존성 자체는 유지(lab에서 사용).

## 검증 전략 (TDD, RED → GREEN)

- 단위별 실패 테스트 먼저:
  - `Timeline` — 제목·항목·옵션 필드(subtitle/description/stack) 렌더, 빈 목록.
  - 각 홈 섹션 — `profile` 데이터가 화면에 렌더되는지.
  - `SiteHeader` — 네비 링크 렌더, 현재 경로 active 표시.
  - `IconTile` — href·aria-label·아이콘.
- 설명문은 한국어(고유 식별자만 영문).
- 마무리 검증: `npm run fsd && lint && type-check && test && build`.

## 구현 순서 (바텀업)

```
1. react-icons 의존성 추가
2. entities/profile        데이터·타입 이식 → import·타입 검증
3. shared/ui/IconTile      + 테스트·스토리
4. shared/ui/Timeline      + 테스트·스토리
5. widgets/site-header     네비·GitHub·ThemeToggle → 테스트
6. app/(public) 그룹        layout(SiteHeader) + home·blog·lab 이동, 루트에서 ThemeToggle 제거
7. pages/home 섹션 4개      Hero·Skills·Projects·ContactLinks + 테스트
8. HomePage 조립 + 배선     껍데기·GsapSmoke 제거(고아 정리)
9. 검증                    fsd + lint + type-check + test + build
```

## 보류와 후속

- **게시글 삭제 기능** — 별도 스펙/플랜. 필요 작업: posts DELETE grant + RLS 정책(admin) 마이그레이션(로컬 + 원격 `db push`), `entities/post`의 `deleteAdminPost`, `DELETE /api/admin/posts/[id]`, 삭제 UI(기존 `shared/ui` AlertDialog로 확인), (선택) Storage 이미지 정리.
- 스크롤 리빌 등 모션 이펙트 — 사용자가 직접.
- 홈 SEO 메타데이터 정교화 — 필요 시.
