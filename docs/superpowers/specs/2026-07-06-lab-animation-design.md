# /lab/animation 플레이그라운드 — 설계

2026-07-06. transition 페이지에 이어 두 번째 랩 주제. 사용자 결정: 속성 중심 + 키프레임 프리셋, animation 고유 속성(iteration-count·direction·fill-mode·play-state) 집중, 나머지는 Claude 추천으로 확정.

## 목표

`@keyframes`는 미리 만든 프리셋에서 고르고, `animation-*` 고유 속성 4종을 실시간 조작하며 차이를 관찰하는 플레이그라운드. transition 페이지와 골격을 맞춘다: 헤더+코드 패널 / 컨트롤 그리드 / 프리뷰 스테이지 / 하단 정리 섹션.

## 범위 결정

- **키프레임 프리셋 4종**: slide(이동), bounce(낙하 반동), pulse(맥박 크기), spin(회전). 실제 정의는 `PreviewStage.css.ts`의 vanilla-extract `keyframes()`, 코드 패널 표시용 원문은 model에 문자열로 별도 보관.
- **컨트롤**: preset(ToggleGroup) / duration(슬라이더, 기본 1200ms) / iteration-count(1·2·3·infinite, ToggleGroup) / direction(4종 ToggleGroup) / fill-mode(4종 ToggleGroup) / delay(0·500·1000ms ToggleGroup — backwards 관찰용) / timing-function(키워드 5종 ToggleGroup, transition에서 깊게 다뤘으므로 축소).
- **play-state**: 컨트롤 패널이 아니라 프리뷰 스테이지의 일시정지 스위치. 재생 제어와 붙어 있어야 의미가 체감된다.
- **기본값**: slide · 1200ms · delay 0 · ease · infinite · alternate · none · running. 첫 진입부터 왕복 운동이 보이도록.

## fill-mode 관찰 장치

fill-mode는 "애니메이션 밖 시간"의 모습이라 rest 상태와 키프레임 상태가 달라야 보인다. 데모 박스의 rest 스타일을 반투명(opacity 0.35)으로 두고, 모든 프리셋 키프레임의 0%·100%에 `opacity: 1`을 정의한다:

- `none`: 종료 후 반투명으로 복귀
- `forwards`: 종료 후 100% 상태(불투명+최종 위치) 유지
- `backwards`: delay 대기 중에 이미 0% 상태(불투명) 적용
- `both`: 둘 다

## 재생 모델

- 초기 렌더부터 자동 재생. `재생` 버튼은 key 증가로 박스를 리마운트해 애니메이션을 처음부터 다시 실행한다 (CSS animation은 재트리거 수단이 없다는 것 자체가 학습 포인트 — 프리뷰에 노트로 남김).
- play-state 스위치는 `animation-play-state`를 CSS 변수로 주입 — 리마운트와 달리 멈춘 지점에서 이어 재생됨을 관찰.
- CSS 변수 주입 패턴은 transition 페이지와 동일: 인라인엔 `--lab-*` 값만, 연출은 `.css.ts`가 결정.

## 구조 (FSD)

```
src/pages/lab-animation/
  index.ts                     # AnimationLabPage default export
  model/
    presets.ts                 # 타입·프리셋 데이터·DEFAULT_CONFIG
    toCssValue.ts              # config → animation 축약형 값, 프리셋 → @keyframes 원문
    useAnimationConfig.ts      # 단일 config 상태 + 필드별 setter
  ui/
    AnimationLabPage.tsx       # 상태 소유·조립
    AnimationControls.tsx      # 컨트롤 패널 (+로컬 MsSlider)
    PreviewStage.tsx           # 트랙·재생·일시정지, keyframes 정의
    CodePanel.tsx              # @keyframes + animation 선언 표시·복사
    AnimationReference.tsx     # 정리 섹션 (8종 속성 표, 축약형 문법, transition 대비)
app/lab/animation/page.tsx    # metadata + re-export
```

`LabPage`의 `LAB_ENTRIES`에 animation 항목 추가.

## 재사용 판단

MsSlider·컨트롤 그룹 스타일·정리 표 스타일은 transition과 겹치지만 이번엔 **로컬 복제**한다. 두 페이지 시점의 추출은 셋째 페이지에서 공유 형태가 안정된 뒤로 미룬다 — 스타일 전용 모듈 80줄 미만 복제가 조기 shared 추상화보다 싸다. 기존 lab-transition 코드는 건드리지 않는다.

## 테스트

tdd-convention을 따른다. model 3종은 단위 테스트(RED→GREEN), ui는 관찰 가능한 계약(컨트롤 값 변경 콜백, CSS 변수 주입, 리마운트 재생, 복사 선언 문자열, 표 렌더)을 컴포넌트 테스트로. `.css.ts` 수치는 테스트 제외. LabPage 목록 테스트에 신규 엔트리 반영.
