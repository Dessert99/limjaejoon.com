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

## DropdownMenu — Radix가 해주는 것

Wave 2 **메뉴 패밀리의 첫 프리미티브**. 토대는 `@radix-ui/react-menu`(Menubar·ContextMenu도 같은 토대를 공유) — 플로팅(popper·Portal)에 **WAI-ARIA 메뉴 패턴**을 얹는다. 우리는 흔한 "액션 메뉴"만 노출(Root·Trigger·Content·Item·Label·Separator) — CheckboxItem·RadioItem·Sub(서브메뉴)·Group·Arrow는 소비자가 요구할 때(예: 테마 전환기→radio) 추가(YAGNI).

**네이티브:** 버튼으로 여는 앱 메뉴용 HTML 요소가 없다(`<select>`는 폼 컨트롤, 우클릭 컨텍스트 메뉴는 브라우저 것). role·roving·타입어헤드를 전부 손으로 붙여야 한다.

**Radix가 더하는 것 = 메뉴 ARIA + roving 포커스 + 타입어헤드 + 포커스 트랩.**

1. **roving 포커스(`RovingFocusGroup`):** Content=`role="menu"` `aria-orientation="vertical"`, Item=`role="menuitem"`. 메뉴 전체가 Tab 정지 하나, 안에서는 ↑↓로 이동하며 포커스된 항목에 `data-highlighted=""`(비활성은 `data-disabled=""`)를 단다 — **이게 우리 스타일 훅: `&[data-highlighted]`에 accent 배경**(키보드 위치 표시는 장식 아닌 기능적 접근성이라 deferred 안 함).

```jsx
role: "menuitem",
"data-highlighted": isFocused ? "" : void 0,
"data-disabled": disabled ? "" : void 0,
```

2. **타입어헤드:** 글자를 타이핑하면 그 접두사로 시작하는 항목으로 점프한다(`searchRef`에 누적 → `getNextMatch`, 잠시 후 초기화). `<select>`의 그 동작을 메뉴에 이식.
3. **FocusScope 트랩 + Portal:** 열리면 포커스를 메뉴 안에 가두고(Esc·바깥클릭으로 닫으면 트리거로 복귀), `Portal`+`Presence`로 닫히면 언마운트. Trigger=`aria-haspopup="menu"` `aria-expanded` `aria-controls`.
4. **선택=`onSelect`:** Item 클릭/Enter가 `onSelect`를 부르고 **기본으로 메뉴를 닫는다**(`event.preventDefault()`로 유지 가능). Separator=`role="separator"`.

출처: `@radix-ui/react-dropdown-menu`(토대 `@radix-ui/react-menu/dist/index.mjs` + `react-roving-focus`·`react-focus-scope`) · https://www.radix-ui.com/primitives/docs/components/dropdown-menu

## Menubar — Radix가 해주는 것

DropdownMenu와 **같은 `react-menu` 토대**를 쓰되, 데스크톱 앱의 메뉴 막대처럼 **여러 메뉴를 가로로 묶는** 한 겹을 더한다(각 메뉴의 패널·항목 동작은 DropdownMenu와 동일).

**네이티브:** 없다(앱 메뉴 막대용 HTML 요소 부재).

**Radix가 더하는 것 = menubar 한 겹(가로 roving + 열린 채 메뉴 전환).**

1. **Root=`role="menubar"` + `RovingFocusGroup`(가로):** 최상위 Trigger들이 메뉴바 안에서 ←→로 이동(전체가 Tab 정지 하나). Trigger는 `RovingFocusGroup.Item`이자 `role="menuitem"` `aria-haspopup="menu"` `aria-expanded`.

```jsx
// 트리거는 roving 항목이면서 메뉴를 여는 버튼
role: "menuitem", "aria-haspopup": "menu", "aria-expanded": open, "data-state": open ? "open" : "closed"
```

2. **열린 채 이웃 메뉴로 전환:** 한 메뉴가 열려 있을 때 옆 Trigger로 포커스를 옮기면 그 메뉴가 바로 열린다(데스크톱 메뉴바 특유의 동작). 각 `Menu`의 패널 안쪽은 DropdownMenu와 똑같이 react-menu(roving·타입어헤드·FocusScope·Portal).
3. **우리 노출/스타일 동일:** Root·Menu·Trigger·Content·Item·Label·Separator. Trigger는 `data-state="open"`·`data-highlighted`에 accent 배경(바 위에서 활성 메뉴를 드러냄). 나머지는 DropdownMenu 규약 그대로.

출처: `@radix-ui/react-menubar/dist/index.mjs`(토대 `react-menu` + `react-roving-focus`) · https://www.radix-ui.com/primitives/docs/components/menubar

## NavigationMenu — Radix가 해주는 것

메뉴 패밀리(react-menu)와 **별개 계열**이다. 액션 실행이 아니라 **사이트 이동(링크)**용이라, Portal·포커스 트랩이 없고 hover 인텐트로 패널을 연다.

**네이티브:** `<nav>` + `<ul>`/`<a>`로 내비 골격은 되지만, "항목에 올리면 펼쳐지는 메가메뉴"의 hover 인텐트·열림 상태·active 표시는 직접 붙여야 한다.

**Radix가 더하는 것 = hover 인텐트 열기 + active 링크 의미 + nav ARIA.**

1. **Portal 없음 — Content는 인라인:** 메뉴 패밀리와 달리 Content를 body로 포털하지 않고 항목 자리에 렌더한다. **우리 규약: 그래서 Content 래퍼에 Portal을 안 넣고**, 항목(`position: relative`) 아래로 CSS(`absolute; top:100%`)로 띄운다. 단일 공유 패널·사이즈 애니메이션을 원하면 `Viewport`를 쓰지만 **모션 deferred라 생략**(생략 시 `--radix-navigation-menu-viewport-*` 변수도 불필요).

2. **트리거는 hover 인텐트 + 클릭 토글:** `delayDuration=200`로 스치는 hover를 거르고(`onPointerMove`에서 한 번만 열기), 클릭으로도 토글(`onItemSelect`). Trigger=`button` `aria-expanded` `aria-controls`, Content=`aria-labelledby={triggerId}`.

```jsx
onClick: () => { context.onItemSelect(itemContext.value); wasClickCloseRef.current = open; }
```

3. **Link의 active = 현재 페이지 의미:** `active` prop이 `aria-current="page"` + `data-active`를 단다(우리 스타일 훅: accent 색·굵게). 링크 선택은 커스텀 이벤트로 열린 패널을 닫는다. **포커스 트랩 없음** — 내비라 링크 사이를 Tab으로 지나간다.

- `Indicator`(활성 트리거 아래 화살표, `data-state="visible|hidden"`)는 장식이라 **deferred**.

출처: `@radix-ui/react-navigation-menu/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/navigation-menu

## Select — Radix가 해주는 것

Wave 2의 마지막이자 **파트가 가장 깊은** 프리미티브. 네이티브 `<select>`의 의미는 유지하되 **OS가 그리는 옵션 목록을 완전히 스타일 가능한 listbox로** 대체한다.

**네이티브:** `<select>/<option>`은 키보드·타입어헤드·폼 전송을 공짜로 주지만 **열린 옵션 목록은 OS가 그려서 스타일 불가**(폰트·색·여백·체크표시 못 건드림). 디자인 시스템에선 이게 한계.

**Radix가 더하는 것 = 스타일 가능한 listbox + 그 의미(combobox/option/selected) 보존.**

1. **깊은 필수 구조 → 우리는 plumbing을 Content에 흡수:** 원래 `Trigger>Value` + `Portal>Content>Viewport>Item>(ItemText+ItemIndicator)`로 깊다. **우리 규약: Portal과 (필수인) Viewport를 Content 래퍼에 함께 내장** — 소비자는 `<Select.Content>` 안에 `Item`만 둔다. Item·ItemText·ItemIndicator는 얇은 파트로 유지(`ItemText`는 Value가 선택값 표시에 **재사용**하므로 children만으로 대체 불가 → 별도 파트로 노출).

2. **ARIA:** Trigger=`role="combobox"` `aria-expanded`(+값 없으면 `data-placeholder`), Content=`role="listbox"`, Item=`role="option"` `aria-selected` + 포커스 시 `data-highlighted`(우리 스타일 훅=accent 배경). 위치는 기본 item-aligned(선택 항목이 트리거 위에 겹침) / `position="popper"`로 Popover식 전환 가능 — 둘 다 통과.

3. **테스트 함정(jsdom):** Radix Select가 `target.hasPointerCapture`·`scrollIntoView`를 호출하는데 jsdom엔 없어 `TypeError`가 난다. `vitest.setup.ts`에 두 메서드 셔임을 넣어 해결(폼/플로팅 인터랙티브 공통 인프라).

```ts
Element.prototype.hasPointerCapture = () => false;
Element.prototype.scrollIntoView = () => {};
```

- defer: Group·Label·Separator(옵션 그룹), ScrollUpButton/ScrollDownButton(긴 목록 스크롤 affordance) — 짧은 목록엔 불필요(YAGNI).

출처: `@radix-ui/react-select/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/select

## Dialog — Radix가 해주는 것

Wave 3(모달)의 첫 프리미티브. Popover의 **modal 분기를 본격화**한 것 — 페이지를 막고(스크롤 잠금·포커스 트랩) 사용자의 응답을 기다린다. 스크림용으로 이번에 `color.overlay` 토큰을 4테마에 추가했다.

**네이티브:** `<dialog>` + `showModal()`이 top-layer·`::backdrop`·Esc·포커스 이동을 준다. 하지만 ① 열림이 **명령형**(`showModal()`/`close()`)이라 React 상태와 안 맞고, ② `::backdrop`은 스타일이 제한적, ③ 포커스 트랩·스크롤 잠금 디테일이 브라우저마다 들쭉날쭉이다.

**Radix가 더하는 것 = 선언형 open + 자유로운 스크림 + 견고한 트랩/스크롤락 + 제목·설명 aria 배선.**

1. **포커스 트랩 + 스크롤 잠금:** Content를 `FocusScope`(`trapped`)로 감싸 Tab이 모달 밖으로 못 나가고, `RemoveScroll`로 배경 스크롤을 막는다(Popover는 `modal` prop일 때만, Dialog는 항상). 닫히면 트리거로 포커스 복귀.

```jsx
FocusScope({ trapped: trapFocus, ... role: "dialog",
  "aria-labelledby": context.titleId, "aria-describedby": context.descriptionId })
RemoveScroll({ ... shards: [context.contentRef] }) // 배경만 잠그고 패널 스크롤은 허용
```

2. **Title/Description = 이름·설명 의미:** `Title`(h2)이 `aria-labelledby`로 다이얼로그 이름이 되고, `Description`이 `aria-describedby`로 연결된다. Title이 없으면 Radix가 콘솔 경고(접근성 강제).
3. **우리 규약:** Trigger는 `aria-haspopup="dialog"`. **Portal과 스크림(Overlay)을 Content 래퍼에 내장** — 소비자는 `<Dialog.Content>` 안에 Title·Description·본문만 둔다. Overlay 배경 = `vars.color.overlay`(신규 토큰, 4테마 반투명 어둠). Trigger·Close는 `asChild`로 Button 합성.

출처: `@radix-ui/react-dialog/dist/index.mjs`(+ `react-focus-scope`·`react-remove-scroll`) · https://www.radix-ui.com/primitives/docs/components/dialog

## AlertDialog — Radix가 해주는 것

Dialog의 **변형** — 토대·트랩·스크롤락은 그대로 쓰되, "되돌릴 수 없는 작업"의 확인용이라 **반드시 응답을 받도록** 동작을 조인다(Dialog 내부 위에 얹은 한 겹).

**네이티브:** `window.confirm()`이 있지만 스타일 불가·블로킹·텍스트 전용이다. 디자인된 확인 대화는 직접 만들어야 한다.

**Radix가 더하는 것 = "닫기 어렵게" 만드는 3가지 + alertdialog 의미.**

1. **role=`alertdialog`:** 보조기술이 더 강하게(긴급·응답 필요) 알린다. Dialog의 `dialog`와 다른 점.
2. **바깥클릭으로 안 닫힘:** `onPointerDownOutside`·`onInteractOutside`를 preventDefault해 스크림을 눌러도 닫히지 않는다(Dialog는 닫힘). 사용자가 **Cancel/Action 중 하나를 명시적으로 골라야** 한다(Esc는 여전히 닫힘 = 취소 경로).

```jsx
onPointerDownOutside: (event) => event.preventDefault(),
onInteractOutside: (event) => event.preventDefault(),
onOpenAutoFocus: (event) => { event.preventDefault(); cancelRef.current?.focus(); }
```

3. **Cancel에 기본 포커스:** 열리면 안전한 `Cancel`로 포커스가 간다(실수로 Enter를 쳐도 확인이 아니라 취소). `Close` 대신 **`Action`(실행) + `Cancel`(취소)** 두 파트로 의도를 가른다.

- 우리 규약은 Dialog와 동일(Portal·Overlay를 Content 내장, Title/Description aria, Action/Cancel은 asChild Button). 스크림도 `vars.color.overlay`.

출처: `@radix-ui/react-alert-dialog/dist/index.mjs`(Dialog 토대 재사용) · https://www.radix-ui.com/primitives/docs/components/alert-dialog

## ScrollArea — Radix가 해주는 것

Wave 4(특수)의 첫 프리미티브. **네이티브 스크롤은 살리되 스크롤바만 커스텀**한다.

**네이티브:** 브라우저 스크롤바는 OS·브라우저마다 모양이 다르고, `::-webkit-scrollbar`는 webkit 전용 비표준, 표준 `scrollbar-width`/`scrollbar-color`는 조절 폭이 좁다(두께 정도). 디자인 일관성을 못 맞춘다.

**Radix가 더하는 것 = 네이티브 스크롤 위에 얹은 크로스브라우저 커스텀 스크롤바.**

1. **네이티브 스크롤 유지 + 가짜 스크롤바 오버레이:** Viewport는 실제로 네이티브 스크롤(휠·키보드·터치 그대로)하고, 그 위에 `Scrollbar`+`Thumb`를 그려 위치/크기를 동기화한다. `ResizeObserver`로 콘텐츠/뷰포트를 측정해 썸 길이를 맞춘다(jsdom에선 안 터졌지만 RO 의존).
2. **표시 정책 `type`(auto·always·scroll·hover):** 언제 스크롤바를 보일지. 기본은 hover-friendly. **우리 규약:** 필수 plumbing(Viewport·Scrollbar·Thumb·Corner)은 standalone 의미가 없어 **단일 컴포넌트로 번들** — 소비자는 `<ScrollArea style={{height}}>children</ScrollArea>`만. 세로 스크롤바만 노출(가로는 필요 시 추가=YAGNI), 높이는 소비자가 className/style로.

출처: `@radix-ui/react-scroll-area/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/scroll-area

## Toast — Radix가 해주는 것

지금까지의 floating과 **마운트 패턴이 다르다** — 트리거 옆이 아니라 **앱 루트에 Provider+Viewport를 한 번** 두고, 토스트는 거기로 쌓인다.

**네이티브:** 없다. ARIA 라이브 영역(`role="status"`/`aria-live`)이 토대지만, 큐·자동 닫힘 타이밍·스와이프·포커스 복귀·"SR이 놓치지 않게 알리기"를 직접 짜야 한다.

**Radix가 더하는 것 = 큐 관리 + 타이머 + 스와이프 dismiss + 이중 렌더(보이는 토스트 / 들리는 announce).**

1. **Provider(큐·설정) + Viewport(쌓이는 자리):** Provider가 `duration=5000`·`swipeDirection`·hotkey를 쥐고, Viewport(`role="region"`, `<ol tabIndex=-1>`)가 화면 한 모서리에 토스트를 모은다. 우리는 Viewport를 고정 우하단에 배치.

2. **이중 렌더가 핵심 (시각 ↔ 청각 분리):** 한 토스트가 **두 군데**에 난다 — ① 보이는 토스트는 `<li>`로 **Viewport에 포털**되고, ② 스크린리더용 `ToastAnnounce`(`role="status"` `aria-live`)가 별도로 텍스트만 읽어준다. **그래서 테스트에서 `getByRole('status')`는 빈 announce 영역을 잡고, 실제 토스트는 `getByRole('listitem')`** (포털된 li).

```jsx
announceTextContent && <ToastAnnounce role="status" aria-live={...}>{announceTextContent}</ToastAnnounce>
ReactDOM.createPortal(<Primitive.li tabIndex={0} data-state={...}>, viewport) // 보이는 토스트
```

3. **자동 닫힘 + 스와이프:** `duration` 후 닫히고(hover하면 타이머 일시정지), `swipeThreshold`만큼 밀면 dismiss. Action은 `altText`(SR 대체 문구) 필수 — 시각 버튼과 청각 설명을 가른다. **우리 노출:** Provider·Viewport·Root·Title·Description·Action·Close.

출처: `@radix-ui/react-toast/dist/index.mjs` · https://www.radix-ui.com/primitives/docs/components/toast

## OneTimePasswordField — Radix가 해주는 것 (⚠️ unstable)

`radix-ui`에서 `unstable_OneTimePasswordField`로 들어온다 — **실험적 API라 이름·구조가 바뀔 수 있다**(진입 시 재검토 대상이었음). 인증코드(OTP) 입력의 "칸 여러 개" UX를 묶어준다.

**네이티브:** `<input autocomplete="one-time-code">` 한 칸이면 OS의 SMS 자동완성은 받지만, **칸을 쪼갠(6박스) UX**(자동 이동·붙여넣기 분배·백스페이스 역이동)는 직접 다 짜야 한다.

**Radix가 더하는 것 = 분절 입력 묶음 + 자동완성 유지.**

1. **Root(`role="group"`)가 N개 Input을 조율:** 한 칸을 채우면 다음 칸으로 포커스가 넘어가고, 붙여넣기하면 코드가 칸마다 분배되며(`PASTE` 액션), 백스페이스로 역이동한다. `type`(numeric·alpha·alphanumeric)이 `inputMode`를 정한다.

```jsx
autoComplete: "one-time-code",  // 칸을 쪼개도 SMS 자동완성 유지
role: "group",
// 입력 시 dispatch({ type: 'CHAR', index, char }) → 값 배열 갱신 + 다음 칸 focus
```

2. **HiddenInput = 폼 전송용 합본:** 보이는 칸들의 값을 하나로 합쳐 숨은 input에 담아 폼이 단일 값으로 전송하게 한다.
3. **우리 규약:** 칸·HiddenInput은 standalone 의미가 없는 필수 plumbing이라 **`length` prop 단일 컴포넌트로 번들** — `<OneTimePasswordField length={6} name='code' />`. (ScrollArea·Select와 같은 흡수 전략.)

출처: `@radix-ui/react-one-time-password-field/dist/index.mjs`(`radix-ui`의 `unstable_*`) · https://www.radix-ui.com/primitives/docs/components/one-time-password-field
