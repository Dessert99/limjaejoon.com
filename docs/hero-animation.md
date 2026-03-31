# Hero 텍스트 순차 등장 애니메이션

> 구현 파일: `app/page.css.ts`

## 어떤 효과인가

홈 Hero 섹션의 세 줄(이름, 역할, 설명)이 페이지 로드 시 아래에서 위로 순서대로 나타난다.

```
0.1s → 안녕하세요, 임재준입니다.   (fade-in + slide up)
0.3s → 프론트엔드 개발자             (fade-in + slide up)
0.5s → 성장을 코드로 기록합니다.    (fade-in + slide up)
```

---

## 구현 코드

```ts
// app/page.css.ts

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to:   { opacity: 1, transform: 'translateY(0)' },
});

export const heroName = style({
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  animationDelay: '0.1s',
  // ...
});

export const heroRole = style({
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  animationDelay: '0.3s',
  // ...
});

export const heroDesc = style({
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  animationDelay: '0.5s',
  // ...
});
```

---

## 동작 원리

### 1. `keyframes` — 애니메이션 구간 정의

```ts
const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to:   { opacity: 1, transform: 'translateY(0)' },
});
```

`keyframes`는 Vanilla Extract에서 CSS `@keyframes`를 타입 안전하게 작성하는 함수다.
빌드 시 고유한 클래스명(예: `fadeUp_abc123`)으로 변환된다.

- `from`: 시작 상태 — 투명(`opacity: 0`) + 16px 아래로 밀린 상태(`translateY(16px)`)
- `to`: 끝 상태 — 불투명(`opacity: 1`) + 원래 위치(`translateY(0)`)

### 2. `opacity: 0` — 초기 숨김

```ts
opacity: 0,
```

엘리먼트가 처음 렌더링될 때 보이지 않도록 한다.
애니메이션이 시작되기 전 잠깐이라도 텍스트가 보이는 것을 막기 위해 필요하다.

### 3. `animation` shorthand — 애니메이션 연결

```ts
animation: `${fadeUp} 0.6s ease forwards`,
```

| 값 | 의미 |
|----|------|
| `${fadeUp}` | 위에서 정의한 keyframe 이름 |
| `0.6s` | 지속 시간 (duration) |
| `ease` | 가속 곡선 — 빠르게 시작해서 천천히 끝남 |
| `forwards` | fill-mode — 애니메이션이 끝난 후 `to` 상태(`opacity: 1`)를 유지 |

`forwards`가 없으면 애니메이션이 끝난 뒤 `opacity: 0`으로 돌아가 텍스트가 사라진다.

### 4. `animationDelay` — 순차 등장 (stagger)

```ts
// heroName
animationDelay: '0.1s',

// heroRole
animationDelay: '0.3s',

// heroDesc
animationDelay: '0.5s',
```

세 요소가 같은 애니메이션을 갖되, 시작 시점을 0.2s씩 늦춘다.
이 덕분에 동시에 나타나지 않고 위에서 아래로 순서대로 등장하는 것처럼 보인다.

```
타임라인:
0.0s ─────────────────────────────────────────────────────
0.1s │← heroName 시작 (0.6s 동안)
0.3s │     │← heroRole 시작 (0.6s 동안)
0.5s │     │     │← heroDesc 시작 (0.6s 동안)
1.1s │     │     │                    │ heroName 끝
1.1s │     │     │              │ heroRole 끝
1.1s │     │     │        │ heroDesc 끝
```

---

## 왜 JS 없이 CSS만으로 가능한가

Intersection Observer나 `useState` 같은 JS 없이 순수 CSS만으로 구현할 수 있는 이유는, 페이지 로드 자체가 트리거이기 때문이다.

- 브라우저가 DOM을 렌더링하는 순간 `animation`이 자동으로 시작된다.
- `animationDelay`로 시작 시점만 조절하면 stagger 효과를 만들 수 있다.
- 스크롤에 반응하는 등장 효과(scroll-triggered)라면 JS가 필요하지만, 페이지 진입 시 한 번만 재생하는 효과는 CSS만으로 충분하다.
