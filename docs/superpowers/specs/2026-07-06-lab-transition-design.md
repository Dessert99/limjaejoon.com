# /lab 섹션 + CSS transition 플레이그라운드 설계

인터랙션 애니메이션 학습용 공개 랩 섹션을 만들고, 첫 페이지로 CSS `transition`을
실시간 조작하며 배우는 플레이그라운드를 구현한다. cubic-bezier.com을 참고하되 UI는
독자적으로 설계한다.

## 목표

- `/lab` 목록 페이지와 `/lab/transition` 플레이그라운드 페이지 추가
- transition 4요소(property·duration·timing-function·delay)를 모두 실시간 조작
- 드래그 가능한 베지어 곡선 에디터 + 프리셋 선택
- 내 설정 vs `linear` 기준선 비교 경주 프리뷰
- 컨트롤 옆 개념 노트(원리 중심) + 실시간 CSS 코드 패널(복사 버튼)
- 홈 패널에 `/lab` 진입 링크 추가

## 비목표

- 전역 네비게이션 위젯 (페이지 조립 단계에서 별도 진행)
- transition 외 다른 개념 페이지 (이후 이터레이션)
- 랩 목록의 데이터 소스화 (로컬 상수 배열로 시작)

## 라우트 & FSD 구조

```
app/
  lab/
    page.tsx               # @/pages/lab re-export 껍데기
    transition/
      page.tsx             # @/pages/lab-transition re-export 껍데기

src/pages/
  lab/                     # 랩 목록 페이지
    ui/LabPage.tsx (+.css.ts, .test.tsx)
    index.ts
  lab-transition/          # transition 플레이그라운드
    ui/TransitionLabPage.tsx        # 레이아웃 조립, 상태 소유
    ui/BezierEditor.tsx             # SVG 드래그 곡선 에디터
    ui/TransitionControls.tsx       # property/duration/delay 컨트롤
    ui/PreviewStage.tsx             # 단일 프리뷰 + 비교 경주 트랙
    ui/CodePanel.tsx                # 실시간 CSS 문자열 + 복사
    model/useTransitionConfig.ts    # 조작 상태 훅
    model/presets.ts                # timing 프리셋, property별 from/to 정의
    model/toCssValue.ts             # config → "transition: ..." 순수 함수
    index.ts
```

- 랩 목록 항목(제목·설명·href)은 `LabPage` 안 로컬 상수 배열. entities 레이어를 만들지 않는다.
- 순수 로직(베지어 클램핑, CSS 문자열 생성, 프리셋 매핑)은 `model/`에 두어 TDD 출발점으로 삼는다.
- `shared/ui/Slider` Radix 래퍼 1개를 기존 Wave 컨벤션대로 추가한다. duration/delay 컨트롤이 실제로 사용하는 컴포넌트다(추측성 아님).

## 상태 모델

`TransitionLabPage`가 `useTransitionConfig()`로 단일 상태를 소유한다. 컨트롤은 쓰기, 프리뷰·코드 패널은 읽기 전용(단방향).

```ts
{
  property: 'translate-x' | 'scale' | 'rotate' | 'opacity' | 'background-color',
  durationMs: number,          // 슬라이더 0~3000ms
  delayMs: number,             // 슬라이더 0~2000ms
  timing:
    | { kind: 'preset', name: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' }
    | { kind: 'custom', points: [x1, y1, x2, y2] }
}
```

## 컴포넌트 동작

### PreviewStage

- 트리거는 "재생" 버튼으로 상태 A↔B 토글. hover가 아닌 이유: delay·긴 duration을 손 떼고 관찰할 수 있어야 한다.
- 트랙 두 줄: 위=내 설정, 아래=같은 duration의 `linear` 기준선(토글로 켜고 끔).
- property 선택에 따라 데모 박스의 움직임이 바뀐다(translateX/scale/rotate/opacity/background-color). from/to 값은 `presets.ts`에 정의.
- 값 적용은 인라인 style이 아니라 CSS 변수(`--duration`, `--timing` 등)로 내려 실제 CSS transition이 동작하게 한다. jsdom 테스트에서 변수 배선을 검증할 수 있다.

### BezierEditor

- SVG 위에 (0,0)→(1,1) 곡선과 제어점 P1·P2 핸들.
- Pointer Events(`pointerdown` + `setPointerCapture` + `pointermove`)로 드래그.
- x는 [0,1] 클램프(CSS 스펙 제약), y는 [-0.5, 1.5] 허용(오버슈트 곡선 가능).
- 핸들은 키보드 포커스 + 화살표 키 미세조정 지원(접근성·정밀 조작).
- 프리셋 선택 시 제어점이 해당 좌표로 이동, 핸들을 건드리면 `custom`으로 전환.

### CodePanel

- `toCssValue()` 결과(`transition: transform 300ms cubic-bezier(...) 0ms`)를 실시간 표시.
- 복사 버튼 + 성공 시 기존 shared/ui Toast 피드백.

### 개념 노트

각 컨트롤 그룹 옆 2~4문장, 원리 중심("무엇"이 아니라 "왜"):

- property — transition은 상태 변화의 보간, `display`는 애니메이션 불가, transform/opacity가 합성 단계라 싼 이유
- duration — 자연스럽게 느껴지는 200~500ms 구간, 길면 답답한 이유
- timing-function — cubic-bezier는 "시간(x) 대비 진행률(y)" 곡선
- delay — 음수 delay는 중간부터 시작

## 스타일링

- 레이아웃·간격·색은 sprinkles, 연출만 `style()`. 합성 패턴 `style([sprinkles({}), {}])`.
- 기존 4테마(오후/노을/밤/새벽) 토큰을 그대로 사용한다.

## 테스트 전략

TDD RED→GREEN→REFACTOR, describe/it 설명문은 한국어.

- `toCssValue` / 좌표 클램핑 / 프리셋 매핑 — 순수 함수 단위 테스트가 출발점
- `BezierEditor` — pointer 이벤트 발화로 드래그 → onChange 좌표 검증, 화살표 키 미세조정, 프리셋 선택 시 핸들 위치
- `CodePanel` — 문자열 렌더, clipboard mock으로 복사 검증
- `TransitionLabPage` — 컨트롤 조작이 CSS 변수·코드 패널에 반영되는 배선 테스트(jsdom에서는 애니메이션이 아니라 변수 값을 검증)
- `LabPage` — 카드 목록 렌더와 링크 검증
- 마무리 검증: `fsd + lint + type-check + test + format`

## 주석

comment-convention을 따른다: 파일 헤더·모든 export에 한 줄 JSDoc, 본문 비자명 로직에
한 줄 `//` WHY 주석. 베지어 수학·포인터 이벤트처럼 낯선 부분은 기초 개념까지
한 줄 규칙 안에서 풀어 쓴다.
