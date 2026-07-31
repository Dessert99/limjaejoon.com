# 합성 컴포넌트 패턴 전면 도입 설계

작성일: 2026-07-31 스킬: `.claude/skills/composition-patterns/`

## 1. 배경 — 왜 지금인가

`src/shared/ui/` 의 10개 컴포넌트는 전부 단일 함수 + 평평한 props 구조다. compound(dot-notation 서브컴포넌트)를 쓰는 것은 하나도 없다.

문제가 이미 증상으로 드러났다. **`SectionHeading` 을 머리말이 필요한 섹션 4곳 중 2곳이 우회하고 손으로 다시 조립하고 있다.**

| 섹션 | 사용 여부 | 우회 이유 |
| --- | --- | --- |
| Work | 사용 | label·title·description 3슬롯이 그대로 맞음 |
| Gallery | 사용 | description 생략 |
| Contact | **우회** | 제목만 `MaskReveal` 로 감싸야 하는데 슬롯이 `ReactNode` 라 래퍼를 넣으면 `titleId` 가 heading 이 아니라 래퍼에 붙는다 |
| Introduction | **우회** | 라벨과 본문이 12칼럼 그리드로 갈라져야 한다. 한 `div` 안에 세로로 쌓는 구조로는 불가능하다 |

그 결과 `text-label text-subtle uppercase` 가 `SectionHeading` · `ContactSection` · `IntroductionSection` · `HeroSection` 4곳에 각각 타이핑돼 있다.

이것은 "compound 가 필요 없어서 안 쓴 상태" 가 아니라 **필요한데 없어서 중복이 생긴 상태**다. 슬롯 props 는 배치를 컴포넌트가 독점하므로, 소비자가 순서·래퍼·레이아웃을 바꿔야 하는 순간 통째로 버려진다.

## 2. 실측 — 앱 내 실사용 수

스토리·테스트를 제외한 `src/pages` · `src/widgets` 기준이다.

| 컴포넌트 | 사용 | 컴포넌트 | 사용 |
| --- | --- | --- | --- |
| Container | 8 | RevealText | 1 |
| MaskReveal | 5 | MediaReveal | 1 |
| Media | 3 | Button | **0** |
| ShowcaseButton | 2 | Marquee | **0** |
| SectionHeading | 2 | Parallax | **0** |

Button · Marquee · Parallax 는 앱 소비자가 0 이고 스토리에만 산다. 이 셋을 분해하면 아무도 다르게 배치한 적 없는 구조를 미리 여는 것이다. 제외 근거로 쓴다.

## 3. 판정 기준 — 세 관문

compound 분해 자격은 **셋 다** 통과해야 한다.

1. **다중 파트** — 의미 있는 자식 영역이 2개 이상이다. 단일 `children` 슬롯 래퍼는 탈락한다.
2. **배치가 사용처마다 다르다** — 서로 다른 소비자가 순서·래퍼·레이아웃을 달리 조립해야 한다. **소비자가 1곳뿐이면 자동 탈락이다.**
3. **중복이 측정된다** — 같은 마크업이나 클래스 문자열이 2곳 이상에서 반복 중이다.

2번을 엄격히 읽는 것이 이 설계의 핵심이다. **"한 가지 복잡한 배치" 는 배치 변형이 아니다.** 12칼럼 비대칭 격자든 방향이 반대인 두 줄이든, 소비자가 한 곳이고 늘 같은 순서로 조립한다면 compound 가 푸는 문제가 없다. 그런 코드가 필요로 하는 것은 **이름**이지 조립 자유도가 아니며, 답은 dot-notation 이 아니라 **단일 컴포넌트 추출**이다. 같은 가독성 이득에 API 표면이 훨씬 작고, 나중에 진짜 변형이 생겼을 때 쪼개는 비용은 지금 쪼개는 비용과 같다.

`Container` · `MaskReveal` · `RevealText` · `Parallax` · `Marquee` 는 1번에서 탈락한다. `Button` · `ShowcaseButton` 은 2·3번에서 탈락하며, 이미 `href` 판별 union 으로 `patterns-explicit-variants` 를 만족하고 있다.

### compound 가 실제로 푸는 문제

한 문장으로: **상태 로직이나 계약은 하나인데 그것을 그리는 배치가 사용처마다 다를 때**다.

- `SectionHeading` — 상태는 없지만 라벨·제목·부연이라는 계약이 하나이고, Work 는 세로로 쌓고 Introduction 은 12칼럼으로 가르며 Contact 은 제목만 마스크로 감싼다.
- `SiteNavigation` — dialog 열고·닫고·이동이라는 상태 로직이 하나이고, 데스크톱 목록과 모바일 dialog 라는 두 배치가 그것을 공유한다.

이 둘만 통과했다.

## 4. 핵심 결정 — context 는 이미 클라이언트인 곳에서만 쓴다

`createContext` 는 `'use client'` 를 강제한다. 현재 `HomePage` 와 5개 섹션은 전부 서버 컴포넌트이고, 5단계에서 "배럴이 Server Component 그래프를 오염시켰다" 는 사고가 이미 한 번 있었다.

그래서 compound 를 두 등급으로 나눈다.

| 등급 | 조건 | 형태 | RSC |
| --- | --- | --- | --- |
| A. 네임스페이스 분해 | 파트 간 공유 상태가 없다 | dot-notation 만, 각 파트가 자기 props 를 받는다 | 서버 유지 |
| B. context compound | 파트 간 공유 상태·ref·핸들러가 있다 | Provider + `use(Context)` | `'use client'` |

**B 는 이미 `'use client'` 인 컴포넌트에만 적용한다.** 정적 마크업을 클라이언트로 끌어내리면서까지 얻을 이득이 없다.

이 분기가 이 프로젝트에서 "무분별하지 않은" 의 실질적 경계다. 참조한 `architecture-compound-components` 규칙은 React Native 기준이라 RSC 경계를 다루지 않는다. 그대로 따르면 서버 컴포넌트가 전부 클라이언트로 내려간다.

## 5. 대상 판정표

| 대상 | 파트 | 소비자 | 배치가 사용처마다 다른가 | 결론 |
| --- | --- | --- | --- | --- |
| SectionHeading | Label·Title·Description | 4곳 | ✅ 세로 쌓기 / 12칼럼 분리 / 제목만 마스크 | **compound (A)** |
| SiteNavigation | Brand·Menu·MenuTrigger·MenuDialog | 1곳(내부 2형태) | ✅ 데스크톱 목록 / 모바일 dialog | **compound (B)** |
| ProjectRow (Work) | 5영역 | **1곳** | ❌ 한 가지 배치뿐 | **단일 컴포넌트 추출** |
| Rail (Gallery) | 2영역 | **1곳** | ❌ 같은 배치에 방향만 다름 | **단일 컴포넌트 추출** |
| Media · MediaReveal | — | — | — | 손대지 않음 |
| Button · ShowcaseButton | — | — | — | 손대지 않음 |
| Container · MaskReveal · RevealText · Parallax · Marquee | 단일 슬롯 | — | — | 손대지 않음 |

### ProjectRow · Rail 을 compound 에서 뺀 경위

초안은 이 둘을 등급 A 로 넣었다. "12칼럼 비대칭", "forward/reverse 2줄" 을 배치 변형으로 셌기 때문이다. 구현 도중 다시 보니 **둘 다 소비자가 1곳이고 늘 같은 순서로 조립**한다 — 관문 2번을 통과하지 못한다. 초안이 관문을 느슨하게 적용했다.

이 둘이 실제로 주는 이득은 `WorkSection` 의 인라인 JSX 60줄에 이름을 붙이는 것, 즉 가독성이다. 그건 dot-notation 8개를 여는 근거가 되지 못한다. 단일 컴포넌트로 추출하면 같은 이득을 API 표면 1/8 로 얻는다.

### Media 를 제외하는 근거

`src: null` 분기는 `patterns-explicit-variants` 후보로 보인다. 하지만 `src` 는 config 에서 오는 `string | null` 이라 **소비자가 컴파일 타임에 어느 변형인지 고를 수 없다.** `Media.Image` / `Media.Placeholder` 로 쪼개면 소비자마다 삼항 분기가 3곳으로 늘어날 뿐이다. 더미 에셋이 실물로 교체되어 `src` 가 non-null 로 좁혀지면 그때 재검토한다.

## 6. API 설계

### 6.1 SectionHeading — 등급 A

`asChild` 도 Slot 도 만들지 않는다. 소비자가 직접 감싸면 되므로 `cloneElement` 기반 우회가 필요 없다.

```tsx
// Work — 시각 결과는 현행과 동일
<SectionHeading.Root className='mb-section-sm'>
  <SectionHeading.Label>{WORK.label}</SectionHeading.Label>
  <SectionHeading.Title id={TITLE_ID}>{WORK.title}</SectionHeading.Title>
  <SectionHeading.Description>{WORK.description}</SectionHeading.Description>
</SectionHeading.Root>

// Contact — 제목만 MaskReveal 로 감싼다. 현행 API 로는 불가능해 손으로 짜던 부분
<SectionHeading.Label>{CONTACT.label}</SectionHeading.Label>
<MaskReveal className='mt-6 text-section break-keep text-foreground'>
  <SectionHeading.Title id={TITLE_ID}>{CONTACT.headline}</SectionHeading.Title>
</MaskReveal>

// Introduction — 12칼럼으로 갈라져도 부품은 공유한다
<SectionHeading.Root className='grid gap-grid-gap md:grid-cols-12'>
  <SectionHeading.Label className='md:col-span-4'>{INTRODUCTION.label}</SectionHeading.Label>
  <div className='flex flex-col gap-10 md:col-span-8'>…</div>
</SectionHeading.Root>
```

파트별 계약:

- `Root` — `flex flex-col gap-4` 만 소유한다. 소비자가 `className` 으로 그리드로 덮을 수 있다.
- `Label` — `text-label text-subtle uppercase` 를 소유하는 유일한 자리다. 지금 4곳에 흩어진 클래스가 여기로 모인다.
- `Title` — `level?: 2 | 3` 으로 태그를 고르고 `id` 를 직접 받는다. `text-section break-keep`.
- `Description` — `text-body-lg break-keep text-muted`.

`titleId` 를 context 로 자동 생성하지 않는다. `useId` 는 훅이라 서버 컴포넌트에서 쓸 수 없고, 지금도 소비자가 `TITLE_ID` 상수 하나를 `aria-labelledby` 와 함께 쓰고 있어 비용이 같다.

`Title` 의 `level` 기본값은 2 다. `h1` 은 열지 않는다 — 페이지에 하나뿐이라 섹션이 가져가면 안 된다는 현행 제약을 유지한다. Hero 의 `h1` 은 지금처럼 소비자가 직접 쓴다.

### 6.2 SiteNavigation — 등급 B

`state-context-interface` 규칙대로 `state` / `actions` / `meta` 3분할한다.

```tsx
type NavigationContextValue = {
  state: { items: readonly NavItem[] };
  actions: {
    open: () => void;
    close: () => void;
    navigate: (href: string) => void;
  };
  // RefObject 가 아니라 콜백 ref 다 — 아래 "ref 를 context 로 나르지 않는다" 참고
  meta: { attachDialog: (element: HTMLDialogElement | null) => void };
};
```

**ref 를 context 로 나르지 않는다.** 참조한 `state-context-interface` 규칙은 `meta: { inputRef }` 로 `RefObject` 를 싣지만, 이 프로젝트는 React Compiler 가 켜져 있어 `react-hooks/refs` 가 `ref={meta.menuRef}` 를 "Cannot access refs during render" 로 막는다. Codex 사전 리뷰가 플랜을 스크래치 워크트리에 실제로 구현해 확인한 사항이다. 규칙 문서가 React Native 기준이라 이 제약을 다루지 않는다.

대신 Provider 가 `useRef` 를 소유하고 **콜백 ref 함수**를 `meta` 로 내린다. 함수는 ref 값이 아니므로 규칙을 지난다.

파트:

- `Provider` — dialog 참조와 세 핸들러를 소유한다. `items` 를 props 로 받아 주입한다.
- `Root` — `fixed` 헤더 골격.
- `Brand` — 홈 앵커.
- `Menu` — `state.items` 를 순회하는 `ul`. **데스크톱과 모바일이 같은 부품을 쓴다.** 현재 두 번 쓰인 `NAV_ITEMS.map` 이 한 번으로 줄어든다.
- `MenuTrigger` — `actions.open`.
- `MenuDialog` — `meta.attachDialog` + `actions.close`.

`useContext` 대신 `use()` 를 쓴다(`react19-no-forwardref`).

`Menu` 항목의 클릭 동작은 데스크톱과 모바일이 다르다 — 데스크톱은 앵커 기본 동작이고 모바일은 `navigate` 로 닫고 포커스를 옮긴다. 이 차이는 `Menu` 의 boolean prop 이 아니라 **`renderItem` 이 무엇을 그리는지**로 가른다. `Link` 와 `MenuLink` 두 변형을 두고 조립체가 골라 넘긴다(`patterns-explicit-variants`).

`Menu` 가 `renderItem` 렌더 prop 을 받는 것은 `patterns-children-over-render-props` 의 예외 조항에 해당한다 — 부모가 자식에게 데이터(`item`)를 내려주는 경우다. 이 덕분에 `ul`·`li`·`key` 배선이 한 곳에 남고 순회가 한 번으로 준다.

### 6.3 ProjectRow — 단일 컴포넌트 추출

`WorkSection` 의 인라인 JSX 60줄을 `src/pages/home/ui/WorkSection/ProjectRow.tsx` 로 옮긴다. `entities/project` 가 아니라 `pages/home` 에 두는 이유는 이 배치가 Work Index 표현 결정(플랜 5단계 "행 내부 thumbnail")에 종속돼 있어 다른 라우트가 재사용할 대상이 아니기 때문이다.

```tsx
{projects.map((project, index) => {
  return (
    <ProjectRow
      key={project.slug}
      project={project}
      staggerIndex={index}
    />
  );
})}
```

`project` 객체를 통째로 받는다. 필드를 낱개로 펴면 props 가 8개가 되고, 그 목록은 `Project` 타입을 그대로 받아쓴 것에 지나지 않는다.

`links.length > 0` 분기는 컴포넌트 안에 그대로 둔다.

### 6.4 Rail — 단일 컴포넌트 추출

`GallerySection` 의 rail 한 줄을 `src/pages/home/ui/GallerySection/Rail.tsx` 로 옮긴다.

```tsx
<Rail
  direction={direction}
  label={`작업 기록 ${rowIndex + 1}번째 줄`}
  items={row}
/>
```

방향은 boolean 이 아니라 `direction: 'forward' | 'reverse'` 축이다. `Marquee` 의 기존 `direction` prop 과 이름을 맞춘다.

`RailItem` 타입을 `Rail.tsx` 가 export 한다. `config/gallery.ts` 의 `GalleryItem` 은 구조적으로 같아 그대로 들어간다 — 타입 하나를 위해 config 를 고칠 이유가 없다.

`Root` 가 소유하는 `overflow-x-auto` · `tabIndex={0}` · `role='group'` · `aria-label` 넷은 5단계 결정("감쇠에서 정보가 안 빠지도록 키보드 스크롤 가능")의 결과라 함께 움직여야 한다. 하나라도 빠지면 접근성 계약이 깨지므로 소비자에게 흩어 두지 않는다.

## 7. 부수 영향

**Steiger** — `shared/ui/index.ts` 가 `export { SectionHeading }` 하나만 내보내면 되므로 public API 규칙에 영향이 없다. per-component `index.ts` 는 계속 만들지 않는다.

**Storybook** — 3단계에 기록된 "판별 union props 는 Storybook args 로 못 쓴다" 와 같은 문제가 compound 에도 생긴다. 부품 조립은 args 로 표현되지 않으므로 `render` 로 직접 그린다. `SectionHeading.stories.tsx` 는 재작성한다.

**테스트** — `SectionHeading.test.tsx` 는 슬롯 props 기준이라 RED 부터 다시 쓴다. 검증 대상은 마크업 스냅샷이 아니라 접근성 계약이다: heading 레벨이 맞는지, `id` 가 heading 에 붙는지, `aria-labelledby` 가 실제로 연결되는지.

**시각 결과물은 바뀌지 않는다.** 순수 API 재구성이므로 렌더된 마크업과 클래스가 현행과 같아야 한다. 이것이 각 단계의 성공 기준이다.

## 8. 성공 기준

1. `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 가 전부 통과한다. `build` 를 빼지 않는다 — RSC 경계 위반은 build 만 잡는다.
2. `HomePage` 와 5개 섹션이 **서버 컴포넌트로 남는다.** `'use client'` 가 새로 붙는 파일은 없다.
3. **섹션 라벨 역할**의 `text-label text-subtle uppercase` 를 `SectionHeading.Label` 이 단독으로 소유한다 — `ContactSection` · `IntroductionSection` 의 중복 2건이 사라진다.

   이 클래스 문자열 자체는 5곳에 있지만 나머지 2곳은 라벨이 아니다. `HeroSection` 의 위치·가용성 표기와 `WorkSection` 의 `dl` 메타는 머리말에 속하지 않으므로 대상이 아니다. 후자는 `ProjectRow` 로 옮겨간다.
4. 항목 순회가 한 번만 나온다.
5. `SectionHeading` 을 우회하는 섹션이 0 이다.
6. 렌더 마크업이 변경 전과 동일하다(heading 레벨, 랜드마크, `aria-labelledby` 연결, 클래스).

## 9. 단계 분할

| 단계 | 범위 | Codex 리뷰 |
| --- | --- | --- |
| 0 | 스펙·플랜 문서 | 착수 전 |
| 1 | SectionHeading compound + 소비자 4곳 재조립 | 완료 후 |
| 2 | SiteNavigation compound | |
| 3 | ProjectRow · Rail 단일 컴포넌트 추출 | 완료 후 |

각 단계는 `docs/conventions/tdd-convention.md` 의 RED → GREEN → REFACTOR 를 따른다. 마크업이 바뀌지 않아야 하므로 기존 테스트가 GREEN 을 유지하는 것이 리팩터링 안전망이다.

## 10. 하지 않는 것

- `Media` · `MediaReveal` 결합
- `Button` · `ShowcaseButton` 내부 레이어 개방 — `ShowcaseButton` 의 fill 레이어를 열면 `overflow-hidden` 계약이 깨진다
- 단일 슬롯 래퍼 5종의 분해
- `asChild` / Slot 구현 — compound 가 있으면 필요 없다
- Radix 도입 — 네이티브 `<dialog>` 로 충분하다는 5단계 결정을 유지한다
- 시각·모션 수치 변경 — 플랜 6단계 몫이다
