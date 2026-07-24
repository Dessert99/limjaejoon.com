# 홈/포트폴리오 리메이크 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **이 플랜은 다른 세션에서 실행한다.** 설계 근거는 `specs/2026-07-24-home-portfolio-remake-design.md`.

**Goal:** `main` 브랜치의 포트폴리오 홈(Hero·Skills·경력/활동/학력 Timeline·Projects)과 공용 헤더를 현재 아키텍처(FSD·다크 2모드 디자인 시스템)로 이식해 리메이크 MVP 홈을 완성한다.

**Architecture:** 바텀업으로 `entities/profile`(데이터) → `shared/ui`(Timeline·IconTile) → `widgets/site-header` → `app/(public)` 레이아웃 → `pages/home` 섹션 순으로 쌓는다. `main`의 컴포넌트 구조·콘텐츠는 그대로 가져오되 스타일은 sprinkles·토큰·기존 `shared/ui/Button`으로 재구현한다.

**Tech Stack:** Next.js(App Router), TypeScript, vanilla-extract(sprinkles), react-icons(신규), Vitest + RTL, Storybook.

## Global Constraints

- 스타일은 sprinkles 표준: 레이아웃·간격·색은 `sprinkles({...})`, 연출만 `style()`. 합성은 `style([sprinkles({...}), {...}])`. 치수·위치는 스케일에 안 넣음.
- 색은 다크 기본 2모드 토큰 `vars.color.*`만 사용. OS 연동 없음.
- AI티 배제: 솔리드 토큰, 절제된 연출, 보라 그라데이션·글래스 남발 금지 ("감성 카페" 무드).
- 주석: 파일 헤더·모든 export는 단일 라인 JSDoc(`/** ... */`), 본문 비자명 로직은 한 줄 `//` WHY. 멀티라인 블록·`@param`·코드 받아쓰기 금지.
- 컴포넌트별 배럴 없음 — 슬라이스 공개 API(`shared/ui/index.ts` 등)가 파일을 직접 re-export.
- 화살표 함수는 처음부터 블록 바디(`=> { return ... }`) — repo `arrow-body-style:always` 룰.
- 테스트 describe/it 설명문은 한국어, 고유 식별자만 영문.
- per-task 검증에 `npm run lint` 포함(포맷·arrow-body 사후수정 방지).
- 마무리 전체 검증: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`.
- **이식 원칙:** 각 이식 대상의 콘텐츠는 `git show "main:<경로>"`로 원본을 꺼내 가져오고, 스타일(.css.ts)만 새 토큰·sprinkles로 다시 작성한다. 아이콘은 react-icons 유지.

---

## Task 1: react-icons 의존성 추가

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 설치**

Run: `npm install react-icons`
Expected: `package.json` dependencies에 `react-icons` 추가, 설치 성공.

- [ ] **Step 2: 타입·트리셰이킹 확인**

Run: `npx tsc --noEmit`
Expected: PASS (에러 없음).

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-icons for skill/contact brand icons"
```

---

## Task 2: entities/profile 이식

**Files:**
- Create: `src/entities/profile/model/types.ts`
- Create: `src/entities/profile/model/{profile,experience,education,projects,skills,activities}.ts`
- Create: `src/entities/profile/index.ts`

**Interfaces:**
- Produces:
  - 타입 `Profile{name:string; role:string; taglines:string[]; contacts:ContactLink[]}`, `TimelineItem{title:string; subtitle?:string; period:string; description?:string; stack?:string[]}`, `Project{name:string; description:string; period:string; stack:string[]; links:ProjectLink[]}`, `ProjectLink{label:string; href:string}`, `ContactLink{kind:ContactKind; href:string; label:string}`, `ContactKind = 'github'|'linkedin'`.
  - 데이터 `profile:Profile`, `experience:TimelineItem[]`, `education:TimelineItem[]`, `activities:TimelineItem[]`, `projects:Project[]`, `skills:string[]`.

- [ ] **Step 1: 원본 콘텐츠 꺼내기**

Run: `git show "main:frontend/src/entities/profile/model/types.ts"` (그리고 profile·experience·education·projects·skills·activities 각각)
Expected: 각 파일 내용 확인. 이 내용을 새 경로 `src/entities/profile/model/`에 그대로 옮긴다 (콘텐츠는 개인 정보라 재사용).

- [ ] **Step 2: 파일 생성**

`types.ts`부터: 위 Produces의 타입 정의를 그대로 작성. 이어 각 데이터 파일을 원본 값으로 작성. 각 export에 단일 라인 JSDoc.

- [ ] **Step 3: 공개 API 작성**

`src/entities/profile/index.ts`:

```ts
/** profile 엔티티 공개 API — 포트폴리오 정적 데이터와 타입 */
export type {
  Profile,
  TimelineItem,
  Project,
  ProjectLink,
  ContactLink,
  ContactKind,
} from './model/types';
export { profile } from './model/profile';
export { experience } from './model/experience';
export { education } from './model/education';
export { activities } from './model/activities';
export { projects } from './model/projects';
export { skills } from './model/skills';
```

- [ ] **Step 4: fsd·type-check 검증**

Run: `npm run fsd && npx tsc --noEmit`
Expected: PASS (entities는 하위 레이어에만 의존, 순수 데이터라 위반 없음).

- [ ] **Step 5: 커밋**

```bash
git add src/entities/profile
git commit -m "feat(profile): port profile entity data and types from main"
```

---

## Task 3: shared/ui/IconTile

**Files:**
- Create: `src/shared/ui/IconTile/{IconTile.tsx,IconTile.css.ts,IconTile.test.tsx,IconTile.stories.tsx,index.ts}`
- Modify: `src/shared/ui/index.ts` (re-export 추가)

**Interfaces:**
- Consumes: react-icons `IconType`.
- Produces: `IconTile` — props `{ icon: IconType; href: string; ariaLabel: string }`. 외부 링크(`target='_blank' rel='noopener noreferrer'`)로 렌더되는 접근성 아이콘 타일.

- [ ] **Step 1: 실패 테스트 작성**

`IconTile.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { FaGithub } from 'react-icons/fa';
import { IconTile } from './IconTile';

describe('IconTile', () => {
  it('aria-label과 href를 가진 외부 링크로 렌더한다', () => {
    render(
      <IconTile
        icon={FaGithub}
        href='https://github.com/example'
        ariaLabel='GitHub'
      />
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/example');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- IconTile`
Expected: FAIL ("Cannot find module './IconTile'").

- [ ] **Step 3: 구현**

`IconTile.tsx`:

```tsx
/** 외부 링크 아이콘 타일 — 연락처·헤더가 공유하는 접근성 아이콘 링크 */
import type { IconType } from 'react-icons';
import * as s from './IconTile.css';

type IconTileProps = {
  icon: IconType;
  href: string;
  ariaLabel: string;
};

/** 새 탭 외부 링크로 아이콘 하나를 렌더한다 */
export function IconTile({ icon: Icon, href, ariaLabel }: IconTileProps) {
  return (
    <a
      className={s.tile}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={ariaLabel}>
      <Icon aria-hidden='true' />
    </a>
  );
}
```

`IconTile.css.ts`: sprinkles로 크기·정렬·색, hover는 절제된 토큰 전환. (예: `style([sprinkles({ display:'inline-flex', alignItems:'center', justifyContent:'center' }), { color: vars.color.text, ... }])`.)

- [ ] **Step 4: 공개 API 추가**

`src/shared/ui/index.ts`에 `export { IconTile } from './IconTile/IconTile';` 추가.

- [ ] **Step 5: 스토리 작성**

`IconTile.stories.tsx`: `FaGithub`·`FaLinkedin` 예시.

- [ ] **Step 6: 검증**

Run: `npm test -- IconTile && npm run lint && npm run fsd`
Expected: PASS.

- [ ] **Step 7: 커밋**

```bash
git add src/shared/ui/IconTile src/shared/ui/index.ts
git commit -m "feat(ui): add IconTile external-link icon component"
```

---

## Task 4: shared/ui/Timeline

**Files:**
- Create: `src/shared/ui/Timeline/{Timeline.tsx,Timeline.css.ts,Timeline.test.tsx,Timeline.stories.tsx,index.ts}`
- Modify: `src/shared/ui/index.ts`

**Interfaces:**
- Consumes: 없음. **`entities/profile`을 import하지 않는다** (shared→entities는 FSD 방향 역행 → `npm run fsd` 실패).
- Produces: `Timeline` — props `{ title: string; items: TimelineEntry[] }`. `TimelineEntry`는 이 컴포넌트가 **자체 정의**하는 프롭 타입 `{ title:string; subtitle?:string; period:string; description?:string; stack?:string[] }` — `entities`의 `TimelineItem`과 구조적으로 동일해 `<Timeline items={experience} />`가 그대로 타입 통과한다(구조적 타이핑, cross-import 없음).

- [ ] **Step 1: 실패 테스트 작성**

`Timeline.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { Timeline } from './Timeline';

describe('Timeline', () => {
  const items = [
    {
      title: '회사 A',
      subtitle: '프론트엔드',
      period: '2024 - 현재',
      description: '설명',
      stack: ['React', 'TypeScript'],
    },
  ];

  it('제목과 항목의 필드를 렌더한다', () => {
    render(
      <Timeline
        title='경력'
        items={items}
      />
    );

    expect(screen.getByRole('heading', { name: '경력' })).toBeInTheDocument();
    expect(screen.getByText('회사 A')).toBeInTheDocument();
    expect(screen.getByText('프론트엔드')).toBeInTheDocument();
    expect(screen.getByText('2024 - 현재')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('옵션 필드가 없으면 해당 요소를 렌더하지 않는다', () => {
    render(
      <Timeline
        title='학력'
        items={[{ title: '학교', period: '2020 - 2024' }]}
      />
    );

    expect(screen.getByText('학교')).toBeInTheDocument();
    expect(screen.queryByText('프론트엔드')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- Timeline`
Expected: FAIL ("Cannot find module './Timeline'").

- [ ] **Step 3: 구현**

`Timeline.tsx` — 파일 상단에 프롭 타입 `TimelineEntry`를 **자체 정의**(entities import 금지). `title` heading + `items.map`으로 각 항목 렌더. subtitle·description·stack은 존재할 때만(`item.subtitle ? ... : null`). stack은 칩 리스트. 원본 마크업 참고: `git show "main:frontend/src/shared/ui/Timeline/Timeline.tsx"` (있으면). 스타일은 새로 작성.

```ts
/** Timeline 항목 렌더 계약 — entities 를 import하지 않기 위해 여기서 정의(구조는 profile 의 TimelineItem 과 동일) */
export type TimelineEntry = {
  title: string;
  subtitle?: string;
  period: string;
  description?: string;
  stack?: string[];
};
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- Timeline`
Expected: PASS.

- [ ] **Step 5: 공개 API·스토리**

`src/shared/ui/index.ts`에 `export { Timeline } from './Timeline/Timeline';`. `Timeline.stories.tsx`에 경력/학력 예시.

- [ ] **Step 6: 검증**

Run: `npm test -- Timeline && npm run lint && npm run fsd`
Expected: PASS.

- [ ] **Step 7: 커밋**

```bash
git add src/shared/ui/Timeline src/shared/ui/index.ts
git commit -m "feat(ui): add Timeline component for career/activity/education"
```

---

## Task 5: widgets/site-header

**Files:**
- Create: `src/widgets/site-header/config/navItems.ts`
- Create: `src/widgets/site-header/model/types.ts`
- Create: `src/widgets/site-header/ui/SiteHeader/{SiteHeader.tsx,SiteHeader.css.ts,SiteHeader.test.tsx}`
- Create: `src/widgets/site-header/index.ts`

**Interfaces:**
- Consumes: `ThemeToggle` from `@/features/theme-toggle`, `IconTile` from `@/shared/ui`, `usePathname` from `@/shared/lib`(non-null `string` 래퍼), `FaGithub` from react-icons.
- Produces: `SiteHeader` — props 없음. 클라이언트 컴포넌트(`'use client'`).

- [ ] **Step 1: navItems·types 작성**

`model/types.ts`:

```ts
/** 헤더 네비 항목 */
export type NavItem = {
  label: string;
  href: string;
};
```

`config/navItems.ts`:

```ts
/** 사이트 공용 네비 — main 기준(홈·지식 모음), Lab 미노출 */
import type { NavItem } from '../model/types';

export const navItems: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '지식 모음', href: '/blog' },
];
```

- [ ] **Step 2: 실패 테스트 작성**

`SiteHeader.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

// usePathname 은 @/shared/lib 의 non-null 래퍼를 쓰므로 그 모듈을 목한다
vi.mock('@/shared/lib', () => {
  return { usePathname: () => '/blog' };
});

describe('SiteHeader', () => {
  it('네비 링크를 렌더하고 현재 경로를 active 표시한다', () => {
    render(<SiteHeader />);

    const blogLink = screen.getByRole('link', { name: '지식 모음' });
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(blogLink).toHaveAttribute('data-active', 'true');

    const homeLink = screen.getByRole('link', { name: '홈' });
    expect(homeLink).toHaveAttribute('data-active', 'false');
  });
});
```

- [ ] **Step 3: 테스트 실패 확인**

Run: `npm test -- SiteHeader`
Expected: FAIL ("Cannot find module './SiteHeader'").

- [ ] **Step 4: 구현**

`SiteHeader.tsx`:

```tsx
'use client';

/** 사이트 공용 헤더 — 로고·네비·액션(GitHub·테마 토글) */
import Link from 'next/link';
import { usePathname } from '@/shared/lib';
import { FaGithub } from 'react-icons/fa';
import { IconTile } from '@/shared/ui';
import { ThemeToggle } from '@/features/theme-toggle';
import { navItems } from '../../config/navItems';
import * as s from './SiteHeader.css';

const GITHUB_URL = 'https://github.com/Dessert99';

/** 현재 경로에 해당하는 네비 링크를 active 표시하는 헤더 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className={s.header}>
      <Link
        href='/'
        aria-label='홈으로 이동'
        className={s.logo}>
        limjaejoon.com
      </Link>
      <nav className={s.nav}>
        {navItems.map((item) => {
          // 홈('/')은 정확히 일치할 때만, 하위 경로는 prefix 매칭으로 active
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={s.navLink}
              data-active={active}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={s.actions}>
        <IconTile
          icon={FaGithub}
          href={GITHUB_URL}
          ariaLabel='GitHub'
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
```

`SiteHeader.css.ts`: sprinkles로 flex 배치·간격, active 링크는 `&[data-active="true"]`에 accent. 불투명 배경(`vars.color.surface`).
공개 API `src/widgets/site-header/index.ts`: `export { SiteHeader } from './ui/SiteHeader/SiteHeader';`

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm test -- SiteHeader`
Expected: PASS.

주의: `ThemeToggle` 현재 시그니처 확인 — `git show`가 아니라 현재 코드 `src/features/theme-toggle/`에서 export명·props 확인 후 맞춘다. 플로팅 스타일이 박혀 있으면 헤더 배치용으로 props/변형이 필요할 수 있음(있으면 별도 최소 조정).

- [ ] **Step 6: 검증·커밋**

Run: `npm run lint && npm run fsd && npm test -- SiteHeader`
```bash
git add src/widgets/site-header
git commit -m "feat(site-header): add site-wide header with nav, github, theme toggle"
```

---

## Task 6: app/(public) 라우트 그룹 + 레이아웃

**Files:**
- Create: `app/(public)/layout.tsx`
- Move: `app/page.tsx` → `app/(public)/page.tsx`
- Move: `app/blog/` → `app/(public)/blog/`
- Move: `app/lab/` → `app/(public)/lab/`
- Modify: `app/layout.tsx` (루트에서 `ThemeToggle` 제거, `themeBootScript` 유지)

**Interfaces:**
- Consumes: `SiteHeader` from `@/widgets/site-header`.

- [ ] **Step 1: public 레이아웃 작성**

`app/(public)/layout.tsx`:

```tsx
/** 공개 라우트 그룹 레이아웃 — 홈·블로그·랩에 공용 헤더 제공 (admin 제외) */
import { SiteHeader } from '@/widgets/site-header';
import type { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
```

- [ ] **Step 2: 라우트 이동**

Run:
```bash
git mv app/page.tsx "app/(public)/page.tsx"
git mv app/blog "app/(public)/blog"
git mv app/lab "app/(public)/lab"
```
Expected: 파일 이동. 괄호 그룹이라 URL 불변.

- [ ] **Step 3: 루트 레이아웃에서 ThemeToggle 제거**

`app/layout.tsx`에서 `ThemeToggle` import·렌더를 제거한다. `themeBootScript`(FOUC 방지 인라인)와 `suppressHydrationWarning`은 유지. (테마 토글은 이제 `SiteHeader`가 렌더.)

- [ ] **Step 4: 라우팅·타입 검증**

Run: `npm run type-check && npm run build`
Expected: PASS. `/`, `/blog`, `/lab`이 그대로 동작하고 헤더가 뜬다. admin에는 헤더 없음.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat(app): add (public) route group with shared header, move theme toggle to header"
```

---

## Task 7: pages/home 섹션 (Hero·Skills·Projects·ContactLinks)

**Files:**
- Create: `src/pages/home/ui/ContactLinks/{ContactLinks.tsx,ContactLinks.css.ts,ContactLinks.test.tsx}`
- Create: `src/pages/home/ui/HeroSection/{HeroSection.tsx,HeroSection.css.ts,HeroSection.test.tsx}`
- Create: `src/pages/home/ui/SkillsSection/{SkillsSection.tsx,SkillsSection.css.ts,SkillsSection.test.tsx}`
- Create: `src/pages/home/ui/ProjectsSection/{ProjectsSection.tsx,ProjectsSection.css.ts,ProjectsSection.test.tsx}`

**Interfaces:**
- Consumes: `profile`, `projects`, `skills` from `@/entities/profile`; `IconTile`, `Button` from `@/shared/ui`; react-icons(`FaGithub`,`FaLinkedin`,`Si*`).
- Produces: `HeroSection`, `SkillsSection`, `ProjectsSection`, `ContactLinks({ contacts })`.

- [ ] **Step 1: ContactLinks 실패 테스트**

```tsx
import { render, screen } from '@testing-library/react';
import { ContactLinks } from './ContactLinks';

describe('ContactLinks', () => {
  it('연락처를 aria-label 있는 링크 목록으로 렌더한다', () => {
    render(
      <ContactLinks
        contacts={[
          { kind: 'github', href: 'https://github.com/x', label: 'GitHub' },
        ]}
      />
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/x'
    );
  });
});
```

- [ ] **Step 2: ContactLinks 구현**

`kind → 아이콘` 매핑(`{ github: FaGithub, linkedin: FaLinkedin }`) + `IconTile` 리스트, `<ul aria-label='연락처'>`. 원본 참고: `git show "main:frontend/src/pages/home/ui/ContactLinks/ContactLinks.tsx"`.

- [ ] **Step 3: HeroSection 실패 테스트**

```tsx
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('이름 인사와 블로그 CTA를 렌더한다', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('안녕하세요');
    expect(screen.getByRole('link', { name: /지식 모음 보기/ })).toHaveAttribute('href', '/blog');
  });
});
```

- [ ] **Step 4: HeroSection 구현**

`profile.name` 인사 + `taglines`(각 줄 `**볼드**` 파싱 헬퍼) + CTA는 `Button`을 `asChild`로 `<Link href='/blog'>` 감싸기(기존 Button asChild 규약) + `ContactLinks`. 원본 참고: `git show "main:frontend/src/pages/home/ui/HeroSection/HeroSection.tsx"`. **모션(animationDelay)은 이식하지 않음** — 정적 렌더.

- [ ] **Step 5: SkillsSection 실패 테스트**

```tsx
import { render, screen } from '@testing-library/react';
import { SkillsSection } from './SkillsSection';

describe('SkillsSection', () => {
  it('보유 기술 목록을 렌더한다', () => {
    render(<SkillsSection />);
    expect(screen.getByRole('heading', { name: '보유 기술' })).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: SkillsSection 구현**

"보유 기술" 제목 + `skills.map`으로 브랜드 아이콘(`iconBySkill: Record<string, IconType>` — `SiNextdotjs`·`SiReact`·`SiTypescript`·`SiJavascript`·`SiExpo`·`SiNestjs`) + 라벨. 원본 참고: `git show "main:frontend/src/pages/home/ui/SkillsSection/SkillsSection.tsx"`. `SectionReveal` 래퍼는 제거하고 정적으로.

- [ ] **Step 7: ProjectsSection 실패 테스트**

```tsx
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from './ProjectsSection';

describe('ProjectsSection', () => {
  it('프로젝트 카드를 렌더한다', () => {
    render(<ProjectsSection />);
    expect(screen.getByRole('heading', { name: '프로젝트' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: ProjectsSection 구현**

"프로젝트" 제목 + `projects` 카드 그리드(이름·기간·설명·스택 칩·링크 목록). 원본 참고: `git show "main:frontend/src/pages/home/ui/ProjectsSection/ProjectsSection.tsx"`. `SectionReveal` 제거, 정적.

- [ ] **Step 9: 각 테스트 통과·검증**

Run: `npm test -- ContactLinks HeroSection SkillsSection ProjectsSection && npm run lint`
Expected: PASS.

- [ ] **Step 10: 커밋**

```bash
git add src/pages/home/ui/{ContactLinks,HeroSection,SkillsSection,ProjectsSection}
git commit -m "feat(home): port hero, skills, projects, contact sections"
```

---

## Task 8: HomePage 조립 + 배선 + 고아 정리

**Files:**
- Modify: `src/pages/home/ui/HomePage.tsx` (교체)
- Modify: `src/pages/home/ui/HomePage.css.ts`
- Modify: `src/pages/home/ui/HomePage.test.tsx`
- Delete: `src/pages/home/ui/GsapSmoke.{tsx,css.ts,test.tsx}`
- Verify: `app/(public)/page.tsx`가 `HomePage`를 default export (Task 6 이동으로 유지됨)

**Interfaces:**
- Consumes: `experience`, `activities`, `education` from `@/entities/profile`; `Timeline` from `@/shared/ui`; 섹션들 from `../`.

- [ ] **Step 1: HomePage 실패 테스트 수정**

`HomePage.test.tsx`를 실제 섹션 렌더 검증으로 교체:

```tsx
import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('포트폴리오 섹션들을 렌더한다', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('안녕하세요');
    expect(screen.getByRole('heading', { name: '보유 기술' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '경력' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '프로젝트' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- HomePage`
Expected: FAIL (아직 껍데기).

- [ ] **Step 3: HomePage 구현**

```tsx
/** 포트폴리오 홈 — Hero·Skills·경력/활동/학력 Timeline·Projects 조립 */
import { activities, education, experience } from '@/entities/profile';
import { Timeline } from '@/shared/ui';
import { HeroSection } from './HeroSection/HeroSection';
import { SkillsSection } from './SkillsSection/SkillsSection';
import { ProjectsSection } from './ProjectsSection/ProjectsSection';
import * as s from './HomePage.css';

/** 홈 페이지 구성 (main 순서 유지) */
export function HomePage() {
  return (
    <main className={s.main}>
      <HeroSection />
      <SkillsSection />
      <Timeline
        title='경력'
        items={experience}
      />
      <Timeline
        title='활동'
        items={activities}
      />
      <ProjectsSection />
      <Timeline
        title='학력'
        items={education}
      />
    </main>
  );
}
```

`HomePage.css.ts`를 섹션 세로 스택 레이아웃으로 갱신(sprinkles).

- [ ] **Step 4: GsapSmoke 고아 제거**

Run:
```bash
git rm src/pages/home/ui/GsapSmoke.tsx src/pages/home/ui/GsapSmoke.css.ts src/pages/home/ui/GsapSmoke.test.tsx
```
Expected: 삭제. (이 변경으로 안 쓰이게 된 고아만 제거. GSAP 의존성은 유지.)

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm test -- HomePage`
Expected: PASS.

- [ ] **Step 6: 전체 검증**

Run: `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build`
Expected: 전부 PASS.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "feat(home): assemble portfolio HomePage, remove shell/GsapSmoke"
```

---

## Self-Review 결과 (스펙 대비)

- 스펙의 모든 단위(profile·Timeline·IconTile·site-header·(public)·home 섹션·조립)가 Task 1~8에 매핑됨.
- 확정 결정 반영: 바텀업(Task 순서), (public) 그룹(Task 6), ThemeToggle 이동(Task 6 Step 3), react-icons(Task 1), 모션 보류(Task 7 Hero/Skills/Projects "정적" 명시).
- 고아 정리(GsapSmoke·껍데기 HomePage)는 Task 8.
- 타입 일관성: `TimelineItem`·`ContactLink`·`Project` 정의(Task 2)를 이후 Task가 그대로 소비.
- 보류(삭제 기능·모션·SEO)는 범위 밖으로 명시.

## 후속 (별도 플랜)

- **게시글 삭제 기능** — posts DELETE grant + RLS 정책 마이그레이션(로컬 + 원격 `db push`), `deleteAdminPost`, `DELETE /api/admin/posts/[id]`, AlertDialog 확인 UI, (선택) Storage 이미지 정리.
