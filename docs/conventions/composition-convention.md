# 합성 컴포넌트 규칙

컴포넌트 공개 API 를 만들거나 바꿀 때의 기준. 판정 순서는 **1절(기본값) → 2절(자격) → 3~6절(이 프로젝트의 제약)** 이다.

## 1. 기본값은 단일 컴포넌트다

늘리지 말아야 할 것과 대신 할 것.

- **boolean prop 을 모드로 쓰지 않는다.** `<Composer isThread isEditing showFooter />` 는 무엇을 그리는지 호출부에서 안 보이고 불가능한 조합까지 타입이 허용한다. 역할이 다르면 **부품이 아니라 컴포넌트를 둘 만든다**(`ThreadComposer`·`EditComposer`). 판별 union 도 같은 해법이다 — 6절.
- **`renderX` prop 보다 `children`.** 정적 구조를 조립할 땐 children 이 읽기 쉽고 콜백 시그니처를 몰라도 된다.
  - **예외: 부모가 자식에게 데이터를 내려줄 때.** `renderItem({ item, index })` 처럼 부모만 아는 값이 있으면 렌더 prop 이 맞다.
- **상태는 Provider 가 소유한다.** 파트가 상태 관리 방식을 알면 다른 상태원으로 못 바꾼다. context 값은 `state`·`actions` 로 나눠 인터페이스만 노출하고 구현은 Provider 안에 가둔다.
- `forwardRef` 는 쓰지 않는다(React 19 는 `ref` 가 일반 prop). context 는 `useContext` 대신 `use()` 로 읽는다.

## 2. compound 자격 — 세 관문

**셋 다** 통과해야 dot-notation 으로 쪼갠다.

1. **다중 파트** — 의미 있는 자식 영역이 2개 이상이다. 단일 `children` 슬롯 래퍼는 탈락.
2. **배치가 사용처마다 다르다** — 서로 다른 소비자가 순서·래퍼·레이아웃을 달리 조립한다. **소비자가 1곳이면 자동 탈락.**
3. **중복이 측정된다** — 같은 마크업이나 클래스가 2곳 이상에서 반복 중이다.

**후보를 판정할 때 소비자 수를 먼저 세고 표에 적는다.**

```sh
grep -rEho '<(Foo|Bar)\b' src/pages src/widgets --include='*.tsx' \
  --exclude='*.stories.tsx' --exclude='*.test.tsx' | sort | uniq -c
```

## 3. "한 가지 복잡한 배치" 는 배치 변형이 아니다

12칼럼 비대칭 격자든 방향이 반대인 두 줄이든, 소비자가 한 곳이고 늘 같은 순서로 조립한다면 compound 가 푸는 문제가 없다. 그런 코드가 필요로 하는 것은 **이름**이지 조립 자유도가 아니다. 답은 **단일 컴포넌트 추출**이다.

`ProjectRow`·`Rail` 이 이 경우다. 초안은 둘을 compound 로 잡았다가 소비자가 각 1곳인 것을 확인하고 되돌렸다 — API 표면이 10개에서 2개로 줄었고 가독성 이득은 같다.

나중에 진짜 변형이 생겼을 때 쪼개는 비용은 지금 쪼개는 비용과 같다. 미리 열지 않는다.

## 4. context 는 이미 `'use client'` 인 곳에서만

`createContext` 는 `'use client'` 를 강제한다. `HomePage` 와 5개 섹션은 서버 컴포넌트이고 그대로 둔다.

| 등급 | 조건 | 형태 | RSC |
| --- | --- | --- | --- |
| A | 파트 간 공유 상태가 없다 | dot-notation 만, 각 파트가 자기 props 를 받는다 | 서버 유지 |
| B | 파트 간 공유 상태·핸들러가 있다 | Provider + `use(Context)` | `'use client'` |

**B 는 이미 클라이언트인 컴포넌트에만 쓴다.** 정적 마크업을 클라이언트로 끌어내리면서까지 얻을 이득이 없다. 1절의 Provider 원칙이 RSC 앞에서 꺾이는 지점이다.

`useId` 도 훅이라 서버 컴포넌트에서 못 쓴다. `SectionHeading.Title` 이 `id` 를 자동 생성하지 않고 props 로 받는 이유다.

## 5. ref 를 context 로 나르지 않는다

`meta: { inputRef }` 로 `RefObject` 를 context 에 싣는 흔한 형태는 여기서 못 쓴다. React Compiler 가 켜져 있어 **`react-hooks/refs` 가 `ref=` 자리의 멤버 접근 표현식 자체를 막는다.**

```tsx
ref={meta.menuRef}        // ❌ RefObject
ref={meta.attachDialog}   // ❌ 콜백 ref 여도 마찬가지
ref={(element) => {       // ✅ 인라인 화살표
  meta.attachDialog(element);
}}
```

Provider 가 `useRef` 를 소유하고 콜백 ref 함수를 `meta` 로 내리되, **소비 쪽은 인라인 화살표로 감싼다.** `eslint-disable` 로 덮지 않는다 — 규칙이 막는 것은 실제 위험이다.

## 6. 부품이 아니라 변형으로 가르는 것

1절의 "boolean prop 대신 컴포넌트를 둘" 이 실제로 적용된 자리다.

`Navigation.Link` 와 `Navigation.MenuLink` 가 그렇다. 데스크톱은 앵커 기본 동작, 모바일은 dialog 를 닫고 포커스를 옮긴다. `Menu` 에 `isMobile` 을 다는 대신 조립체가 `renderItem` 으로 어느 쪽을 그릴지 고른다.

`Menu` 가 렌더 prop 을 받는 것은 1절 예외 조항이다 — **부모가 자식에게 데이터를 내려주는 경우.** 덕분에 `ul`·`li`·`key` 배선이 한 곳에 남는다.

## 7. 리팩터링 안전망은 기존 테스트다

순수 API 재구성이면 렌더 결과가 같아야 한다. **기존 테스트를 한 줄도 고치지 않고 통과하는 것이 증거다.** 고쳐야 한다면 마크업이 바뀐 것이므로 의도한 변경인지 먼저 확인한다.

부품이 기본 클래스를 소유하므로 클래스가 붙는 엘리먼트 위치는 옮겨질 수 있다. 시각 등가일 때만 허용하고, 옮기면 커밋 메시지에 적는다.

## 8. `{...rest}` 와 소유 prop 의 순서

`{...rest}` 는 앞에 쓴 것을 조용히 덮는다. 에러가 안 나서 발견이 늦다. 지금까지 세 번 밟았다.

- **`ref`** — `MaskReveal`·`RevealText`·`MediaReveal` 의 루트 ref 는 IntersectionObserver 몫이다. 소비자 ref 가 덮으면 등장이 영원히 `idle` 로 죽는다. 세 컴포넌트만 `ComponentPropsWithoutRef` 로 ref 를 아예 안 연다.
- **`type`** — `<button>` 의 `type` 은 `{...rest}` **뒤에** 두고 `?? 'button'` 으로 받는다. `type={undefined}` 가 흘러들면 속성이 지워져 form 안에서 브라우저 기본값 `submit` 이 되살아난다.
- **`style`** — 같은 엘리먼트가 `style` 로 CSS 변수를 넘긴다면 `{...rest}` 뒤에서 병합한다(`{ ...style, ...소유값 }`). `MediaReveal` 은 마스크 층만 `--stagger` 를 잃어 안쪽 scale 층과 어긋났었다.

기준: **한 엘리먼트에 컴포넌트 소유 prop 과 `{...rest}` 가 같이 있으면 순서를 의심한다.**

## 9. 현재 적용 현황

| 대상 | 형태 |
| --- | --- |
| `shared/ui/SectionHeading` | compound A — `Root`·`Label`·`Title`·`Description` |
| `widgets/site-navigation/Navigation` | compound B — `Provider`·`Root`·`Bar`·`Brand`·`Menu`·`Link`·`MenuTrigger`·`MenuDialog`·`MenuLink` |
| `pages/home` 의 `ProjectRow`·`Rail` | 단일 컴포넌트 (관문 2 미달) |
| `shared/ui` 나머지 8종 | 손대지 않음 — 단일 슬롯이거나 판별 union 으로 이미 충분 |

`Button`·`ShowcaseButton` 의 `href` 판별 union 이 1절의 명시적 변형을 만족한다. `href?: never` 를 버튼 쪽에 둬야 섞어 쓴 조합이 타입에서 걸린다.
