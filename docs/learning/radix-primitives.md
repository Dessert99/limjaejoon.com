# Radix 프리미티브가 대신 해주는 것

`shared/ui`에서 감싼 Radix 프리미티브별로 Radix가 처리해 주는 항목을 누적 정리한다. "내가 왜 이걸 쓰는지"를 한눈에 보기 위한 학습 로그.

**서술 기준(중요):** "무엇"만 나열하지 않고 **"어떻게(실제 동작 원리)"**를 적는다. 각 섹션은 ① `node_modules`의 Radix 실제 소스나 공식 문서를 근거로, ② **브라우저 네이티브가 이미 하는 것**과 **Radix가 추가로 더하는 것**을 구분하고, ③ 핵심 메커니즘은 코드 스니펫 + 출처 링크로 남긴다. 면접에서 원리를 설명할 수 있는 수준이 목표.

## Label — Radix가 해주는 것

> **오해 정정:** `htmlFor`↔`id` 연결과 "라벨 클릭 → 컨트롤 포커스/토글"은 **브라우저 네이티브 `<label>` 기능**이다. Radix가 해주는 게 아니다. Radix Label은 속을 보면 그냥 `<label>`(`Primitive.label`)을 렌더한다.

**네이티브가 이미 하는 것:** 라벨과 컨트롤(`htmlFor`=대상 `id`) 연결, 라벨 클릭 시 연결된 labelable 요소(input·button·select·textarea 등)로 포커스·활성 위임.

**Radix가 더하는 것 — 딱 하나: 더블클릭 텍스트 선택 방지.** 실제 구현 전부(`@radix-ui/react-label/dist/index.mjs`):

```jsx
onMouseDown: (event) => {
  const target = event.target;
  // 라벨 안에 중첩된 폼 컨트롤을 직접 누른 거면 관여하지 않음
  if (target.closest('button, input, select, textarea')) return;
  props.onMouseDown?.(event);
  // 같은 자리 연속 클릭(detail>1=더블클릭 이상)이면 텍스트 드래그 선택을 막음
  if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
}
```

- `MouseEvent.detail` = 같은 위치 연속 클릭 횟수(1=싱글, 2=더블…). 체크박스를 라벨로 빠르게 두 번 토글하면 네이티브에선 라벨 글자가 선택돼버린다 → `detail>1`일 때 `preventDefault()`로 막는다.
- `target.closest(...)` early-return = 라벨 안 컨트롤을 직접 눌렀을 땐 그 동작을 방해하지 않으려는 가드.

**그래서 왜 래핑하나(정직하게):** 기능 이득은 더블클릭 가드 하나뿐. 채택 이유는 ① 22개 프리미티브를 Radix로 통일(일관 API), ② 토큰 스타일을 한곳에서 입히기 위함. 기능만 보면 native `<label htmlFor>`로도 충분하다(`<button>`도 labelable이라 우리 Switch/Checkbox와도 native 연결됨).

출처: 소스 `node_modules/@radix-ui/react-label/dist/index.mjs` · 공식 https://www.radix-ui.com/primitives/docs/components/label

## Separator — Radix가 해주는 것

**네이티브:** 가로 구분선은 `<hr>`(의미 있는 요소, 스크린리더가 인식)가 있다. 하지만 가로 전용이고 세로/인라인엔 부적합하다.

**Radix가 더하는 것:** 평범한 `<div>`(`Primitive.div`)에 올바른 ARIA를 정확히 붙여 어느 방향이든 쓸 수 있게 한다. 구현:

```jsx
const orientation = isValidOrientation(orientationProp) ? orientationProp : 'horizontal'; // 검증·폴백
const ariaOrientation = orientation === 'vertical' ? 'vertical' : undefined; // 가로는 ARIA 기본값이라 생략
const semanticProps = decorative
  ? { role: 'none' } // 순수 장식 → 의미 제거
  : { role: 'separator', 'aria-orientation': ariaOrientation };
<Primitive.div data-orientation={orientation} {...semanticProps} />;
```

- `aria-orientation`을 **세로일 때만** 넣는다 — 가로가 ARIA 기본값이라 중복 표기를 피하는 스펙 준수.
- `decorative` → `role="none"`: 시각적 칸막이일 뿐 의미가 없을 때 스크린리더가 "구분자"로 읽지 않게 끈다 — Radix는 이걸 `decorative` prop 하나로 쉽게 붙여준다(`<hr>`에도 `role="none"`을 직접 달 수는 있다).
- orientation 값 검증(이상하면 horizontal 폴백) + 항상 `data-orientation` 노출(CSS 방향 분기 훅).

출처: `@radix-ui/react-separator/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/separator

## Toggle — Radix가 해주는 것

**네이티브:** `<button>`엔 "눌림(on/off)" 개념도 상태 기억도 없다. boolean 상태 + `aria-pressed` + controlled/uncontrolled 이중 모드를 직접 관리해야 한다.

**Radix가 더하는 것:** 그 상태 관리와 ARIA를 대신한다.

```jsx
const [pressed, setPressed] = useControllableState({
  prop: pressedProp,
  defaultProp: defaultPressed ?? false,
  onChange: onPressedChange,
});
<Primitive.button
  type="button"
  aria-pressed={pressed}
  data-state={pressed ? 'on' : 'off'}
  onClick={composeEventHandlers(props.onClick, () => {
    if (!disabled) setPressed(!pressed);
  })}
/>;
```

- `useControllableState` = **핵심 훅.** `pressed`(외부 제어)가 오면 그걸 따르고, 없으면 내부 상태(`defaultPressed`)로 굴리며 `onPressedChange`로 변경을 알린다. controlled/uncontrolled를 한 컴포넌트가 동시에 지원하게 해주는 게 진짜 가치(직접 짜면 동기화가 까다로움). 이 훅은 Switch·Checkbox·RadioGroup·ToggleGroup이 전부 공유한다.
- `composeEventHandlers(props.onClick, …)` = 소비자 onClick을 먼저 실행하고 내부 토글을 그다음 실행(둘 다 살림).
- `aria-pressed` + `data-state="on|off"` = 네이티브 버튼엔 없는 눌림 의미(SR)와 스타일 훅.

출처: `@radix-ui/react-toggle/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/toggle

## Switch — Radix가 해주는 것

**네이티브:** 스위치 전용 HTML 요소는 없다. checkbox로 흉내내면 박스 스타일이 제한적이고, 버튼으로 만들면 폼 전송이 안 된다.

**Radix가 더하는 것 = ARIA switch + 완전 스타일 + 네이티브 폼 전송 패리티.** 3겹 구조다.

1. 보이는 컨트롤 = `<button role="switch" aria-checked data-state>`. 상태는 `useControllableState`.
2. **숨은 폼 입력(BubbleInput):** **폼 안에서 쓰일 때**(`form` prop이 있거나 `control.closest("form")`이 잡힐 때) 버튼 뒤에 시각적으로 숨긴 `<input type="checkbox" aria-hidden tabIndex={-1}>`를 함께 렌더한다. `name`/`value`/`required`/`form`을 이 input이 들고 있어 **네이티브 `<form>` 제출 시 값이 함께 전송된다.** (Switch는 Checkbox와 달리 form `reset` 리스너는 두지 않는다.) 위치는 `absolute`+`opacity:0`, 버튼 크기에 맞춰 `useSize`로 사이즈 동기화.
3. **그 숨은 input의 `checked`를 "진짜 이벤트"와 함께 동기화하는 트릭:**

```jsx
const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked');
const setChecked = descriptor.set; // 네이티브 checked 세터
if (prevChecked !== checked) {
  const event = new Event('click', { bubbles });
  setChecked.call(input, checked); // React 추적을 우회해 DOM에 직접 set
  input.dispatchEvent(event); // 진짜 click 이벤트 발생 → 폼/리스너가 인식
}
```

왜 prototype 세터를 쓰나? React가 input의 `checked`를 자체 추적(synthetic)하기 때문에 prop으로만 바꾸면 "진짜 변경 이벤트"가 안 난다. **네이티브 세터를 직접 호출하면 React 레이어를 우회해 실제 DOM 값 + 실제 이벤트**가 발생 → react-hook-form 같은 폼 라이브러리나 네이티브 폼이 값을 제대로 집는다.

- 키보드: 버튼이라 Space/Enter 토글은 네이티브.
- 내 몫: 글자 없는 컨트롤이라 접근성 이름은 소비자가 `Label`(htmlFor)나 `aria-label`로 직접 준다.

출처: `@radix-ui/react-switch/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/switch

## Checkbox — Radix가 해주는 것

**네이티브:** `<input type="checkbox">`는 indeterminate를 **JS 프로퍼티로만** 지원한다(HTML 속성 없음). 체크 표시·박스 스타일도 막혀 있다.

**Radix가 더하는 것:** button+ARIA로 완전 스타일 + 3-상태(mixed) + 폼 패리티 + indeterminate 명령형 동기화 + Enter 가드.

1. `<button role="checkbox" data-state>`, `aria-checked`는 indeterminate면 `"mixed"`:

```jsx
'aria-checked': isIndeterminate(checked) ? 'mixed' : checked,
```

2. **Enter 가드:** `onKeyDown`에서 `if (event.key === 'Enter') event.preventDefault()`. 체크박스는 Space로만 토글하고 Enter로 활성/제출하면 안 되는 게 네이티브 동작인데, 버튼은 폼에서 Enter로 submit될 수 있어 Radix가 막는다.
3. onClick 토글 규칙: `isIndeterminate(prev) ? true : !prev`(indeterminate에서 누르면 checked로).
4. **숨은 input(폼 안에서 쓰일 때) + indeterminate 명령형 동기화:** Switch와 같은 prototype-setter 트릭에 더해, HTML엔 indeterminate "속성"이 없으므로 숨은 input에 프로퍼티를 직접 대입한다(Checkbox는 Switch와 달리 form `reset` 리스너로 초기값도 복원):

```jsx
input.indeterminate = isIndeterminate(checked); // 속성이 아니라 JS 프로퍼티라 직접 set
setChecked.call(input, isIndeterminate(checked) ? false : checked);
input.dispatchEvent(new Event('click', { bubbles }));
```

5. Indicator는 `Presence`로 감싸 checked·indeterminate일 때만 마운트(퇴장 애니메이션 대비). 폼의 `reset` 이벤트를 구독해 초기값 복원.

- 내 몫: 접근성 이름은 소비자가 `Label`(htmlFor)나 `aria-label`로 직접 준다.

출처: `@radix-ui/react-checkbox/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/checkbox

## RadioGroup — Radix가 해주는 것

**네이티브:** `<input type="radio" name>` 그룹은 같은 `name`으로 단일 선택·화살표 이동을 브라우저가 해준다. 다만 동그라미/점 스타일이 제한적.

**Radix가 더하는 것:** 동일한 키보드/단일선택 의미를 완전 스타일 가능한 버튼으로 재현 + 폼 패리티.

1. 그룹 = `RovingFocusGroup.Root`로 감싼 `<div role="radiogroup" aria-required aria-orientation>`. **roving tabindex** = 그룹 전체가 Tab 정지 하나만 갖고, 안에서는 화살표로 이동(네이티브 라디오 그룹과 같은 패턴). 상태는 `useControllableState`(value/onValueChange).
2. 각 항목 = `<button role="radio" aria-checked>` + **폼 안에서 쓰일 때** 숨은 `<input type="radio">`(폼 전송용, Switch와 같은 bubble 패턴).
3. **"화살표 이동 = 즉시 선택"의 실제 구현(WAI-ARIA radio 패턴):**

```jsx
// document 레벨에서 화살표 키가 눌린 상태인지 추적
isArrowKeyPressedRef.current = ARROW_KEYS.includes(event.key);
// 그 라디오로 포커스가 옮겨오면…
onFocus: () => {
  if (isArrowKeyPressedRef.current) ref.current?.click(); // 스스로 click → 선택까지 일으킴
};
```

화살표로 포커스가 라디오에 닿는 순간 `onFocus`에서 자기 자신을 프로그램적으로 click 해 선택을 일으킨다. (Tab/마우스로 들어온 경우엔 화살표 플래그가 false라 선택 안 됨.) + Enter 가드(`preventDefault`).

출처: `@radix-ui/react-radio-group/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/radio-group

## ToggleGroup — Radix가 해주는 것

**네이티브:** 없음. 토글 버튼 묶음 + roving focus + single/multiple 선택을 직접 관리해야 한다.

**Radix가 더하는 것:**

1. `type`으로 갈리는 **판별 유니온(discriminated union):** `type="single"`이면 값이 string(내부적으로 `[value]`로 저장), `type="multiple"`이면 string[]. `type` 누락 시 throw로 강제.

```jsx
if (type === 'single') return <ToggleGroupImplSingle />;
if (type === 'multiple') return <ToggleGroupImplMultiple />;
throw new Error('Missing prop `type` expected on `ToggleGroup`');
```

2. 그룹 = `RovingFocusGroup.Root`로 감싼 `<div role="group">`. 화살표 이동·loop는 roving focus가 처리.
3. 각 항목은 **base `Toggle` 컴포넌트를 재사용**하고, `onPressedChange`로 그룹 값에 activate/deactivate(single=교체, multiple=배열 추가/제거).
4. **single 모드에선 항목(item)을 `role="radio" aria-checked`로 노출한다(aria-pressed 제거):** root는 여전히 `role="group"`이고 공식 문서도 RadioGroup이 아니라 ToggleGroup으로 다룬다 — 단일 선택일 때 **항목만** 라디오처럼 보이게 하는 것이지 그룹 자체가 라디오 그룹이 되는 건 아니다.

```jsx
const singleProps = { role: 'radio', 'aria-checked': pressed, 'aria-pressed': undefined };
```

multiple 모드는 그대로 토글 버튼(`aria-pressed`).

출처: `@radix-ui/react-toggle-group/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/toggle-group

## Progress — Radix가 해주는 것

**네이티브:** `<progress value max>` 요소가 **실제로 존재**한다(ARIA·접근성 공짜). 하지만 브라우저마다 의사요소가 달라 크로스브라우저 스타일이 악명 높게 어렵다.

**Radix가 하는 것:** 그 의미를 **스타일 가능한 `<div>`로 재구현** + data-state 훅 + 값 검증.

```jsx
<Primitive.div
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={isNumber(value) ? value : undefined} // indeterminate면 생략
  aria-valuetext={valueLabel} // getValueLabel(value, max), 기본 "x%"
  data-state={getProgressState(value, max)} // indeterminate | loading | complete
  data-value={value}
  data-max={max}
/>;
// getProgressState: value==null → 'indeterminate', value===max → 'complete', else 'loading'
```

- 값 검증: `max`는 0보다 큰 수, `value`는 0~max(아니면 `console.error` + 폴백). `value=null`/미지정 → indeterminate(`aria-valuenow` 생략 + `data-state="indeterminate"`).
- Indicator는 컨텍스트로 value/max를 받아 자기 `data-state`/`data-value`/`data-max`를 노출 → 우리가 그걸로 채움 폭(`transform`)을 그린다.
- **트레이드오프:** 네이티브 `<progress>`는 ARIA를 공짜로 주지만 스타일이 막힌다. Radix는 그 ARIA를 div로 손수 깔아주는 대신 **완전한 스타일 자유 + data-state**를 얻는다.

출처: `@radix-ui/react-progress/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/progress

## Accordion — Radix가 해주는 것

**네이티브:** `<details>/<summary>`가 디스클로저(열고/접기)를 JS 없이 해준다. 하지만 ① **항목 하나**짜리라 "한 번에 하나만 열림(single)" 같은 그룹 조정이 없고, ② 항목 간 화살표 이동이 없고, ③ 마커·애니메이션 스타일이 제한적이다.

**Radix가 더하는 것 = 그룹 상태 조정 + 항목 간 키보드 내비 + region aria + 애니메이션 훅.** 토대는 `Collapsible` 프리미티브(`Item`=`Collapsible.Root`, `Trigger`=`Collapsible.Trigger`, `Content`=`Collapsible.Content`) — 한 항목의 열고닫기·`aria-expanded`/`aria-controls`는 Collapsible 몫이고, Accordion은 그 위에 **여러 항목의 조정**을 얹는다.

1. **single/multiple 판별 유니온 + collapsible:** `type="single"`은 value가 string(`useControllableState`, 기본 `""`), `multiple`은 string[]. single에서 `collapsible=false`면 열린 항목을 다시 눌러 닫을 수 없다 — 그 가드를 트리거의 `aria-disabled`로 노출한다.

```jsx
// AccordionImplSingle: collapsible일 때만 닫기를 허용
onItemClose: useCallback(() => collapsible && setValue(''), [collapsible, setValue]),
// AccordionTrigger: 열려있고 collapsible 아니면 비활성(닫기 불가)
'aria-disabled': (itemContext.open && !collapsibleContext.collapsible) || undefined,
```

2. **화살표 내비는 roving이 아니라 "포커스 이동 enhancement"다(중요한 구분):** RadioGroup/ToggleGroup은 roving tabindex로 그룹이 Tab 정지 하나만 갖지만, Accordion은 **모든 트리거가 평범히 tabbable**하고 그 위에 ↑↓·Home/End를 더 얹어 트리거 사이를 순환 이동시킨다. 구현은 트리거 `Collection`을 모아 키다운에서 다음 트리거로 `focus()`:

```jsx
const triggerCollection = getItems().filter((item) => !item.ref.current?.disabled);
// ArrowDown(vertical) → moveNext, 끝이면 처음으로 래핑
triggerCollection[nextIndex % triggerCount].ref.current?.focus();
```

3. **Content = `role="region"` + `aria-labelledby={triggerId}`** — 패널이 어느 트리거의 영역인지 스크린리더에 연결. 닫히면 `Collapsible`의 `Presence`로 언마운트(그래서 테스트에서 닫힌 패널은 DOM에 없다).
4. **애니메이션 훅:** Content가 측정된 높이를 `--radix-accordion-content-height` CSS 변수로 노출한다(`auto` 높이도 keyframes로 슬라이드 가능하게). **우리는 이 연출을 deferred** — 정적으로 마운트/언마운트만 한다.

- `data-state="open|closed"`(+ Header/Item에도) = 스타일 훅. 트리거 텍스트는 소비자가 채운다.

출처: `@radix-ui/react-accordion/dist/index.mjs`(+ `@radix-ui/react-collapsible`) · https://www.radix-ui.com/primitives/docs/components/accordion

## Tabs — Radix가 해주는 것

**네이티브:** 탭 UI를 위한 HTML 요소가 없다. 버튼+패널을 직접 짜고 `role="tab/tablist/tabpanel"`·`aria-selected`·`aria-controls`/`aria-labelledby`·roving tabindex·화살표 이동을 전부 손으로 붙여야 한다.

**Radix가 더하는 것 = WAI-ARIA 탭 패턴 통째.**

1. **Roving focus(단일 Tab 정지):** `TabsList`가 `RovingFocusGroup.Root`를 `asChild`로 감싼다 → tablist 전체가 Tab 정지 하나만 갖고 안에서는 화살표로 이동(`loop=true` 순환). **Accordion과 대비되는 핵심 — Accordion은 모든 트리거가 tabbable(화살표는 보조), Tabs는 roving(화살표가 주 이동 수단).**
2. **자동 vs 수동 활성화(`activationMode`, 기본 `automatic`):** Trigger `onFocus`에서 automatic이면 포커스가 닿는 순간 선택까지 일으킨다 — 화살표로 포커스 이동 = 즉시 패널 전환. `manual`이면 포커스만 옮기고 Space/Enter로 확정.

```jsx
onFocus: () => {
  const isAutomaticActivation = context.activationMode !== 'manual';
  if (!isSelected && !disabled && isAutomaticActivation) context.onValueChange(value);
};
```

3. **ARIA id 자동 배선:** `baseId`로 `trigger-${value}`/`content-${value}` id를 만들어 Trigger `aria-controls` ↔ Content `aria-labelledby`를 짝짓는다. Trigger=`role="tab" aria-selected`, List=`role="tablist"`, Content=`role="tabpanel" tabIndex={0}`(패널 자체로도 키보드 포커스 가능).
4. **Content는 `Presence`로 선택된 것만 마운트** — 비선택 패널은 DOM에서 빠진다(테스트에서 비활성 패널을 `queryByText`로 못 찾는 이유). 상태 보존이 필요하면 `forceMount`.

- 클릭은 `onMouseDown`에서 처리(좌클릭·non-ctrl일 때만 선택). `data-state="active|inactive"`가 밑줄·색 스타일 훅.

출처: `@radix-ui/react-tabs/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/tabs

## Popover — Radix가 해주는 것

> Wave 2(플로팅)의 첫 프리미티브. 여기서 세우는 토대 — Portal·popper 위치계산·DismissableLayer·FocusScope·modal 분기 — 를 HoverCard·DropdownMenu·Select가 공유한다.

**네이티브:** HTML Popover API(`popover` 속성 + `popovertarget` 버튼)가 top-layer 렌더·바깥클릭/Esc 라이트 디스미스를 JS 없이 해준다. 하지만 **트리거 기준 위치**는 CSS Anchor Positioning(`anchor-name`/`position-anchor`)이 필요한데 2026 초 기준 Chromium 중심 지원이라(Firefox·Safari 제한적) 크로스브라우저 위치계산은 여전히 JS 몫이다.

**Radix가 더하는 것 = 크로스브라우저 위치계산 + 잘림 회피 Portal + 디스미스 계층 + 포커스 관리(modal 분기).**

1. **위치계산은 `react-popper`(=`@floating-ui` 래퍼):** `side="bottom"`·`align="center"` 기본, `sideOffset`·충돌 회피(`flip`·`shift`). 결과를 `data-radix-popper-side/align`과 CSS 변수로 노출한다 — 우리는 연출 deferred라 변수를 안 쓰지만 side/align은 소비자가 지정한다.

```jsx
contentStyle.setProperty('--radix-popper-available-width', `${availableWidth}px`);
// data-radix-popper-side / --radix-popper-transform-origin 등도 노출
```

2. **Portal + `Presence`:** Content가 `Portal`로 body에 붙어 `overflow:hidden`/`transform` 조상에 잘리지 않는다. `present = forceMount || open`이라 닫히면 언마운트(테스트에서 닫힌 패널을 못 찾는 이유). **우리 규약: Portal을 Content 래퍼에 내장** — 소비자는 `<Popover.Content>` 하나만 둔다(shadcn 스타일).

3. **modal 분기(기본 `modal={false}`=비모달)가 핵심:**

```jsx
// 비모달: 페이지가 살아있다 — 포커스 가둠 없음, 바깥 포인터 통과
trapFocus: false, disableOutsidePointerEvents: false
// 모달: RemoveScroll로 스크롤 잠금 + 포커스 트랩 + 바깥 포인터 차단
```

4. **디스미스·aria:** `DismissableLayer`가 바깥 포인터다운·Esc(`onEscapeKeyDown`)로 닫고 트리거로 포커스 복귀. Trigger=`aria-haspopup="dialog"` `aria-expanded` `aria-controls`(열렸을 때만), Content=`role="dialog"`.

- `data-state="open|closed"`가 스타일 훅. 트리거 스타일은 `asChild`로 소비자 몫(우리는 Trigger를 통과만 한다).

출처: `@radix-ui/react-popover/dist/index.mjs`(+ `@radix-ui/react-popper`·`react-dismissable-layer`·`react-focus-scope`) · https://www.radix-ui.com/primitives/docs/components/popover

## HoverCard — Radix가 해주는 것

Popover와 **토대(popper·Portal·DismissableLayer)는 공유**하되, 트리거 방식과 의미가 다르다 — hover/focus로 열리는 **비대화형 보조 정보**다.

**네이티브:** `title` 속성이 hover 툴팁을 주지만 텍스트 전용·타이밍 조절 불가·리치 콘텐츠 불가다. "유저명에 올리면 뜨는 프로필 카드" 같은 건 네이티브에 없다.

**Radix가 더하는 것 = 지연 hover/focus 디스클로저 + 포인터가 카드로 넘어가도 유지 + 터치 제외.**

1. **트리거는 `<a>`(`Primitive.a`), 클릭 의미 없음:** `PopperPrimitive.Anchor`로 감싼 링크라 `aria-haspopup`/`aria-expanded`가 **없다**(Popover와의 결정적 차이 — Popover는 클릭으로 여는 대화형이라 그 aria를 가진다). `data-state="open|closed"`만 노출.

```jsx
onPointerEnter: excludeTouch(context.onOpen), // 터치는 hover 개념이 없어 제외
onPointerLeave: excludeTouch(context.onClose),
onFocus: context.onOpen, onBlur: context.onClose, // 키보드 접근성: 포커스로도 열림
```

2. **지연 타이머(`openDelay=700`·`closeDelay=300`):** `setTimeout`으로 열고닫음을 늦춰 스치는 hover에 깜빡이지 않게 한다. Content에도 `onPointerEnter/Leave`가 있어 **트리거→카드로 포인터를 옮기는 사이 닫히지 않는다**(close 타이머를 카드 진입이 취소).

3. **Content는 `DismissableLayer`만, `FocusScope` 없음:** 보조 정보라 포커스를 가두지 않는다(Popover의 modal 분기·focus trap과 대비). Portal+`Presence`로 닫히면 언마운트하는 건 동일. **우리 규약 동일 — Portal을 Content에 내장.**

출처: `@radix-ui/react-hover-card/dist/index.mjs`(+ `@radix-ui/react-popper`·`react-dismissable-layer`) · https://www.radix-ui.com/primitives/docs/components/hover-card
