# GSAP 사용 규칙

GSAP은 홈 화면의 스크롤 모션과 라우트 전환 커튼을 담당한다. 커튼은 `shared/transition` 이 소유하고 플러그인이 필요 없어 `gsap` 패키지를 직접 가져온다 — 등록 지점을 `shared` 로 올리는 건 소비자가 셋이 된 뒤다(3절). 설계 근거는 [2026-08-05-gsap-scroll-smoother-design.md](../superpowers/specs/2026-08-05-gsap-scroll-smoother-design.md).

## 1. DOM 소유자가 생명주기를 소유한다

애니메이션은 **대상 DOM을 렌더하는 컴포넌트가** `useGSAP` 으로 만들고 정리한다. 바깥에서 셀렉터로 남의 마크업을 잡지 않는다 — 마크업이 바뀌면 에러 없이 애니메이션만 조용히 사라진다.

## 2. 분리 기준은 길이가 아니다

트윈 하나는 컴포넌트 안에 둔다. `create{Name}Timeline.ts` 로 빼는 기준은 줄 수가 아니라 **DOM 구조와 독립적으로 이해·테스트되는 연출 단위인가**다. 파일은 컴포넌트 옆에 둔다.

## 3. 공통화는 세 곳 이후

같은 의미·동작이 세 곳에서 반복된 뒤에 올린다. 범용 옵션을 받는 훅을 먼저 만들면 GSAP API를 다시 감싼 자체 라이브러리가 된다.

## 4. CSS 로 되는 건 CSS 가 한다

hover·focus 의 단발 transition 은 GSAP 대상이 아니다. GSAP 은 여러 요소의 시간 관계, 스크롤 연동, 역재생이 필요할 때만 쓴다.

## 5. 배치

```
pages/home/lib/gsap.ts                          registerPlugin 한 곳 — 컴포넌트는 이 파일로만 gsap 을 가져온다
pages/home/lib/motionPreset.ts                  duration·ease·stagger 상수
pages/home/ui/{Name}/{Name}.tsx                 DOM·ref·생성·정리
pages/home/ui/{Name}/create{Name}Timeline.ts    복잡할 때만
```

`shared` 로 올리지 않는다 — 소비자가 전부 홈이다.

## 6. 셀렉터는 `data-*`, scope 는 루트 ref

`useGSAP({ scope: rootRef })` 로 조회 범위를 컴포넌트 안으로 가둔다. 스타일 클래스를 애니메이션 식별자로 쓰지 않는다 — 디자인 수정이 애니메이션을 조용히 끊는다.

## 7. 은닉은 CSS 가 아니라 JS 가 건다

`visibility: hidden` 을 CSS 로 미리 걸지 않는다. **스크립트가 실패한 브라우저에서 콘텐츠가 영구히 사라진다.** 초기 깜빡임보다 콘텐츠 손실이 나쁘다는 게 이 저장소의 결정이고, "서버 렌더 결과에 은닉이 없다" 는 계약을 테스트가 지킨다.

`gsap.from()` 은 시작 상태를 마운트 시점에 심으므로 기본 동작이 이 계약을 만족한다. FOUC 방지를 위해 CSS 선은닉을 권하는 자료가 많은데, **여기서는 의도적으로 따르지 않는다.**

## 8. 감쇠

`gsap.matchMedia()` 의 `(prefers-reduced-motion: no-preference)` 안에서만 애니메이션을 만든다. 감쇠 환경은 생성 자체를 안 하므로 되돌릴 것이 없다.

`[data-motion='reduced']` 는 GSAP 이 보지 않는다. Storybook 에 GSAP 모션이 없어 토글이 제어할 대상이 없다.

## 9. 모션 값은 GSAP 이 소유한다

duration·ease 를 CSS 변수에서 읽어 오지 않는다. 두 시스템이 한 값에 묶이면 버튼 hover 를 만지다 스크롤 모션이 따라 움직인다.

이징 어휘는 두 벌이다 — CSS 는 `--ds-ease-*`, GSAP 은 GSAP 이름 이징(`power4.out` 등). **이름을 겹치지 않게 둔다.** `ease-reveal` 은 버튼 fill 전용이고 GSAP 의 reveal 모션과 같은 곡선이 아니다.
