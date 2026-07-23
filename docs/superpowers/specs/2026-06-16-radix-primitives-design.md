# Radix 프리미티브 라이브러리 설계 (로드맵)

`shared/ui`에 Radix Primitives 기반 디자인 프리미티브 **22개**를 점진적으로 추가한다. 이 문서는 한 컴포넌트 스펙이 아니라, 22개가 공유하는 **공통 규약 + 빌드 순서(웨이브) + 프리미티브별 개요**를 고정하는 로드맵이다. 실제 구현은 [Button](2026-06-15-button-component-design.md)이 세운 파이프라인 템플릿을 그대로 복제한다.

학습 목표가 1급 요구사항이다: 사용자(백엔드 출신, 프론트 학습 단계)가 **"각 프리미티브에서 Radix가 무엇을 대신 해주는지"** 를 정확히 익히는 것. 그래서 분해 기준 자체를 *공유 Radix 메커니즘*으로 잡았다.

## 1. 목표와 비목표

**목표**

- 22개 프리미티브를 Button 파이프라인(Radix headless + vanilla-extract recipe/sprinkles + 토큰 + Storybook + TDD)으로 일관되게 구현한다.
- 복합 프리미티브의 래핑 API를 **네임스페이스 객체**로 통일한다.
- 각 프리미티브에서 Radix가 처리하는 항목을 코드 인라인 주석 + 누적 학습 문서 두 곳에 남긴다.
- variant는 사이트가 실제 쓰는 것만 만든다(YAGNI).

**비목표**

- 한 번에 22개 전부 구현 — 웨이브 단위로 스펙→플랜→구현 사이클을 끊어 간다.
- hover/active 색·그림자 같은 **연출 이펙트** — 사용자 손맛 몫([Button 스펙](2026-06-15-button-component-design.md) §7과 동일하게 deferred).
- 테마 전환 *UI* 자체 — DropdownMenu(Wave 2)의 소비자로 따로 다룬다. 이 로드맵은 프리미티브만 만든다.
- 목록에 없는 Radix 프리미티브(예: Tooltip, Aspect Ratio 등) 신설.

## 2. 거주지·파일 구조

프리미티브당 한 폴더, 파일 4종. **컴포넌트별 배럴(`Name/index.ts`)은 두지 않는다**(component-convention §4 — Button 스펙의 per-component index.ts는 폐기됨). 슬라이스 public API(`shared/ui/index.ts`)가 파일을 직접 재노출한다.

```
src/shared/ui/
├── Accordion/
│   ├── Accordion.tsx          # 네임스페이스 객체(멀티파트) 또는 단일 컴포넌트
│   ├── Accordion.css.ts       # recipe()/style()/keyframes 정의
│   ├── Accordion.test.tsx     # RTL 행동·접근성 테스트
│   └── Accordion.stories.tsx  # 상태 매트릭스 (public API 비노출)
├── Label/ …
└── index.ts                   # 프리미티브당 한 줄 재노출
```

## 3. API 스타일 — 네임스페이스 / 평이 혼용

- **멀티파트**(`Accordion`, `Dialog`, `Switch`, `Checkbox`, `RadioGroup`, `Select`, `Tabs` 등): 네임스페이스 객체로 export 한다. 스타일이 붙는 파트는 래핑하고, 구조만 담당하는 파트(`Root`/`Portal`/`Trigger`)는 Radix 것을 그대로 객체에 담는다.

  ```tsx
  // Switch.tsx (형태 스케치)
  export const Switch = {
    Root: StyledRoot,   // 색·트랙 연출
    Thumb: StyledThumb, // data-state로 위치 전환
  };
  ```

- **단일파트**(`Label`, `Separator`, `Toggle`, `Progress`*): Button처럼 평이한 단일 컴포넌트로 export 한다. (*Progress는 Root+Indicator지만 소비자 표면은 단일 컴포넌트로 감싸도 무방 — 구현 시 판단)
- 래퍼·ref 합성 컴포넌트엔 `displayName`을 둔다.
- 외부 `className`은 내부 클래스 뒤에 병합하고 덮어쓰지 않는다.
- **prop 타입은 Radix 원본에서 끌어온다.** 래핑하는 파트는 `React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>`(또는 Radix가 export 하는 props 타입)를 확장한다. 평이 DOM 속성만 확장하면 `checked`/`defaultChecked`/`onCheckedChange`/`value`/`form`/`forceMount`/`getValueLabel` 같은 Radix 고유 prop을 누락하거나 DOM 이벤트 타입과 충돌한다. (Button은 순수 DOM 버튼이라 `ButtonHTMLAttributes`를 썼지만, 여기 프리미티브는 전부 Radix 파트를 감싼다.)
- `shared/ui/index.ts`는 프리미티브당 한 줄: `export { Switch } from './Switch/Switch'`.

## 4. 스타일링·토큰

- 레이아웃/간격/색/라운드 = `sprinkles`, variant 매트릭스 = `@vanilla-extract/recipes`의 `recipe()`, 색은 `vars.color.*` 토큰만 참조 — 기존 컨벤션 그대로.
- 열고닫기/페이드/슬라이드 등 `data-state` 기반 전환은 `@vanilla-extract/css`의 `keyframes`로 연출한다. svg/자식 등 로컬 셀렉터 불가 케이스는 Button이 한 것처럼 `globalStyle`로 처리한다.
- **variant YAGNI**: 프리미티브는 기본형 하나로 시작한다. size/색 변형은 실제 소비자가 생길 때 추가한다. `orientation` 같은 동작 옵션은 recipe 변형이 아니라 Radix prop으로 받는다.
- **새 토큰(Wave 3)**: 모달 스크림용 `color.overlay`를 `theme.css.ts` 컨트랙트와 4테마 파일에 추가한다. 구조적 색이라 토큰에 둔다(연출 이펙트 아님). 값은 Wave 3 상세 설계에서 테마별로 정한다.

## 5. 문서화 규약 (학습 목표)

두 곳에 남긴다. comment-convention(멀티라인 블록·코드 받아쓰기 금지)을 지킨다.

1. **코드 인라인 WHY** — "이 파트가 대신 해주는 것"을 한 줄로 적는다. JSX 마크업 안에서는 `//`가 문법상 불가하므로 한 줄 `{/* */}`(한 줄 WHY 원칙의 JSX 유효 형태)를, 변수·컴포넌트 선언 등 JSX 밖에서는 `//`를 쓴다.

   ```tsx
   <Switch.Root>      {/* checked 상태·키보드·ARIA switch 역할을 Radix가 처리 */}
     <Switch.Thumb /> {/* data-state로 on/off 위치만 우리가 연출 */}
   </Switch.Root>
   ```

2. **누적 학습 문서** — `docs/learning/radix-primitives.md`에 프리미티브별 섹션을 이어붙인다. 각 섹션은 *상태 / 접근성(role·aria) / 키보드 / 포털·위치 / 폼 연동* 중 해당 항목만 불릿으로 정리한다. sprinkles 학습 페이지처럼 공부 로그로 누적한다.

   ```
   ## Switch — Radix가 해주는 것
   - 상태: controlled/uncontrolled 둘 다
   - 접근성: role="switch", aria-checked
   - 키보드: Space/Enter 토글
   - 폼: 숨은 input으로 name/value 제출
   ```

   (`docs/learning/`는 아직 없으니 첫 컴포넌트에서 만든다.)

## 6. 테스트 전략 (TDD)

[tdd-convention](../../conventions/tdd-convention.md) RED→GREEN→REFACTOR. **클래스명이 아니라 접근성 역할·동작을 검증**한다(브리틀 회피). 시각 차이는 Storybook 몫. describe/it 설명문은 한국어.

- 역할 앵커: `getByRole('switch'|'checkbox'|'radiogroup'|'progressbar' …)`.
- 동작: controlled/uncontrolled 전환, 키보드(Space·화살표), disabled 통과, onChange 콜백 호출.
- 합성: 필요한 컴포넌트만 ref/asChild 검증.

## 7. 웨이브 로드맵 (= 학습 순서)

각 웨이브는 새 Radix 메커니즘을 **하나씩** 추가한다. 앞 웨이브 산출물이 뒤에서 재사용된다.

### Wave 0 · 폼 토대 — 상태 + ARIA (오버레이 없음)

| 프리미티브 | 파트 | Radix가 해주는 핵심 | 사이트 쓸모 |
|---|---|---|---|
| `Label` | Root | htmlFor 연결, 더블클릭 텍스트선택 방지, 클릭 시 컨트롤 포커스 | 폼 라벨 전반 |
| `Separator` | Root | `role=separator`/decorative, aria-orientation | 섹션·메뉴 구분선 |
| `Toggle` | Root | aria-pressed, data-state, controlled/uncontrolled | 단일 on/off 버튼 |
| `Switch` | Root·Thumb | role=switch, aria-checked, 키보드, 폼 input | 설정 토글 |
| `Checkbox` | Root·Indicator | checked/indeterminate, aria-checked=mixed, 폼 input | 동의·다중선택 |
| `Radio Group` | Root·Item·Indicator | radiogroup, roving tabindex, 화살표 내비, 단일선택 | 단일선택 묶음 |
| `Toggle Group` | Root·Item | single/multiple, roving focus, 그룹 aria | 뷰 전환·필터 |
| `Progress` | Root·Indicator | role=progressbar, aria-valuenow/min/max, data-state | 진행·로딩 표시 |

### Wave 1 · 디스클로저 — 열고/접기

| 프리미티브 | 파트 | Radix가 해주는 핵심 | 사이트 쓸모 |
|---|---|---|---|
| `Accordion` | Root·Item·Header·Trigger·Content | single/multiple·collapsible, region aria, 키보드, data-state | FAQ·접이 섹션 |
| `Tabs` | Root·List·Trigger·Content | roving focus, auto/manual 활성화, panel aria | 콘텐츠·코드 묶음 |

### Wave 2 · 플로팅 — Portal + Popper 위치잡기 + dismiss

| 프리미티브 | 파트(요지) | Radix가 해주는 핵심 | 사이트 쓸모 |
|---|---|---|---|
| `Popover` | Root·Trigger·Portal·Content | 포털, 앵커 위치·충돌회피, 바깥클릭·Escape | 보조 패널 |
| `Hover Card` | Root·Trigger·Content | hover 인텐트 타이밍, 포털, 위치잡기 | 링크 미리보기 |
| `Dropdown Menu` | Root·Trigger·Content·Item… | 메뉴 roving focus·타입어헤드, 포털·위치 | 내비·**테마 전환기** |
| `Menubar` | Menu·Trigger·Content… | 메뉴바 간 이동, 메뉴 의미론 | 상단 메뉴바 |
| `Navigation Menu` | Root·List·Trigger·Content·Viewport | nav 의미론, viewport 전환 | 사이트 내비 |
| `Select` | Root·Trigger·Content·Item… | listbox, 타입어헤드, 위치잡기, 폼 연동 | 셀렉트 입력 |

### Wave 3 · 모달 오버레이 — focus trap + scroll lock + scrim

| 프리미티브 | 파트 | Radix가 해주는 핵심 | 사이트 쓸모 |
|---|---|---|---|
| `Dialog` | Root·Trigger·Portal·Overlay·Content·Title·Description·Close | 포커스 트랩·복원, 스크롤 잠금, Escape, dialog aria | 모달·라이트박스 |
| `Alert Dialog` | (Dialog와 동형) | 강제 응답, 기본 포커스를 취소에, alertdialog aria | 파괴적 작업 확인 |

→ **선행:** `color.overlay` 토큰 추가(§4).

### Wave 4 · 특수·유틸 — 각자 고유 메커니즘

| 프리미티브 | Radix가 해주는 핵심 | 사이트 쓸모 |
|---|---|---|
| `Scroll Area` | 크로스브라우저 커스텀 스크롤바, 네이티브 스크롤 보존 | 코드블록·목록 |
| `Toast` | 큐·스와이프 해제·핫키·타이밍, region aria | 알림 |
| `One-Time Password Field`* | OTP 칸 자동이동·붙여넣기 분배 | (인증 도입 시) |
| `Password Toggle Field`* | 비밀번호 표시/숨김 토글 | (인증 도입 시) |

> \*OTP·Password Toggle은 radix-ui@1.5.0에서 `unstable_OneTimePasswordField`·`unstable_PasswordToggleField`로 노출되는 **실험적 API**다. 로드맵엔 두되, Wave 4 진입 시 안정화 여부를 재검토한다(미안정 시 대체·보류).

## 8. Wave 0 상세 (이번 구현 대상)

빌드 순서: `Label` → `Separator` → `Toggle` → `Switch` → `Checkbox` → `Radio Group` → `Toggle Group` → `Progress`. (`Label`이 폼 컨트롤들의 선행 조건, 단순→복합 순.) 각 컴포넌트는 독립 TDD 사이클이며, 첫 컴포넌트에서 `docs/learning/radix-primitives.md`를 생성한다.

정확한 import 표면(파트 이름·네임스페이스 형태)은 설치된 `radix-ui` 버전 기준으로 각 구현 단계에서 확인한다.

- **Label** — `<Label htmlFor>` 평이 컴포넌트. 테스트: 클릭 시 연결 input 포커스, children 렌더.
- **Separator** — `orientation`(기본 horizontal)·`decorative` prop 통과. 테스트: `role=separator`(decorative=false) / 역할 없음(true), aria-orientation.
- **Toggle** — `pressed`/`defaultPressed`/`onPressedChange`. 테스트: controlled/uncontrolled 토글, aria-pressed, disabled.
- **Switch** — `Switch.Root`+`Switch.Thumb`. 테스트: `role=switch`, 클릭·Space 토글, onCheckedChange, disabled, 폼 name/value.
- **Checkbox** — `Checkbox.Root`+`Checkbox.Indicator`. 테스트: checked/`indeterminate`(aria-checked=mixed) 표현, 토글, 폼 연동.
- **Radio Group** — `RadioGroup.Root`+`Item`+`Indicator`. 테스트: `role=radiogroup`, 화살표 이동, 단일선택, onValueChange.
- **Toggle Group** — `ToggleGroup.Root`+`Item`. 테스트: `type='single'` 단일선택 / `'multiple'` 다중선택, roving focus.
- **Progress** — `Progress.Root`+`Indicator`. 테스트: `role=progressbar`, aria-valuenow/max, indeterminate(value 미지정) data-state.

## 9. 스펙/플랜 구조

- 이 문서 = 로드맵 스펙(공통 규약 + 5웨이브 + Wave 0 상세).
- 구현은 **웨이브별 플랜**으로 끊는다. 다음 단계는 writing-plans로 **Wave 0 플랜**(8개 컴포넌트의 RED→GREEN→REFACTOR 단계)을 뽑는 것.
- Wave 1~4는 각 웨이브 진입 시 짧은 상세 설계 → 플랜 → 구현. Wave 3은 토큰 추가가 선행.

## 10. 검증 / 완료 기준 (컴포넌트 단위)

- `npm run ci`(fsd + lint + type-check + test + build) 통과.
- 해당 컴포넌트 RTL 테스트(역할·동작) 통과.
- Storybook 상태 매트릭스 스토리가 렌더되고 a11y(axe) 통과 — `npm run ci`엔 없는 게이트이므로 `npm run build-storybook` + 수동 a11y 확인으로 검증한다(자동 게이트로 오인 금지).
- `shared/ui` public API로 노출되어 슬라이스 밖에서 `@/shared/ui`로 import 가능.
- 코드 인라인 WHY + `docs/learning/radix-primitives.md` 섹션이 채워짐.
