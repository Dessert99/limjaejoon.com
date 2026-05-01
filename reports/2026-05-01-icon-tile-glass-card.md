## 배경

1. about 페이지의 ContactLinks(GitHub·LinkedIn 아이콘 버튼)를 원형 칩에서 둥근 사각형 글라스모피즘 카드로 리디자인하기로 했다.
2. 핵심 요구는 호버 시 박스는 위로 떠오르되 안의 아이콘만 살짝 기울어지는 것이었다.
3. 박스와 아이콘이 함께 움직이지 않고 따로 노는 효과를 내려면 두 요소의 transform·transition을 분리해야 한다.
4. 작업을 마치고 나서 동일한 사각형·아이콘 스타일을 SkillsSection의 "보유 기술" 칩에도 그대로 적용하기로 해, 결국 IconTile이라는 공용 컴포넌트로 추출하게 됐다.

## 첫 시도와 빌드 에러

1. 처음에는 link 클래스 하나에 selectors로 자식 svg를 직접 타겟팅했다.

    ```ts
    export const link = style({
      selectors: {
        '& svg': { transition: 'transform 200ms ease' },
        '&:hover svg': { transform: 'rotate(-12deg) scale(1.08)' },
      },
    });
    ```

2. vanilla-extract는 빌드 단계에서 이 코드를 보고 `Invalid selector: & svg` 에러를 던지며 컴파일을 거부했다.
3. 에러 메시지를 풀어보면 "이 스타일 블록의 셀렉터는 자기 자신(`&`)과 그 상태 변형만 가리킬 수 있다"는 뜻이었다.
4. 여기서 `&`는 지금 정의하고 있는 클래스 자기 자신을 의미하는 기호로, SCSS 같은 CSS 전처리기에서도 동일한 약속으로 쓰인다.
5. 그래서 `&:hover`는 "자기 자신이 hover 상태일 때", `&:focus-visible`은 "자기 자신이 키보드 포커스를 받을 때"처럼 자기 자신의 상태 변화만 표현한다.

    ```ts
    // 허용 — 자기 자신과 그 상태 변형
    '&:hover': { ... },
    '&:focus-visible': { ... },
    ```

6. 반면 `& svg`는 "자기 자신 안쪽에 있는 svg 요소"를 가리키는 후손 셀렉터로, 더 이상 자기 자신이 아닌 다른 요소를 타겟으로 삼는다.

    ```ts
    // 거부 — 자기 안의 다른 요소를 건드림
    '& svg': { ... },
    '& > div': { ... },
    '& .child': { ... },
    ```

7. vanilla-extract는 이 경계선을 명시적으로 그어 두고, 자기 자신과 상태 변형까지만 허용한다.

## vanilla-extract의 단일 클래스 규칙

1. 이 규칙이 왜 있는지 이해하려면 먼저 일반 CSS가 어떻게 동작하는지 짚어야 한다.
2. 일반 CSS에서는 한 묶음의 코드 안에서 자기 자신뿐 아니라 다른 요소까지 마음대로 꾸밀 수 있다.

    ```css
    .parent {
      background: white;
    }
    .parent .child {
      color: red;
    }
    .parent svg {
      width: 24px;
    }
    ```

3. 위 예시는 `.parent` 안쪽에 들어 있는 모든 `.child`와 모든 `svg`의 스타일까지 한 파일에서 한꺼번에 결정한다.
4. 편하지만 단점이 있는데, 이 코드만 봐서는 어떤 요소가 영향을 받는지 알기 어렵고, 결국 parent가 실제로 어느 컴포넌트에 붙어 쓰이고 그 안에 어떤 자식이 있는지를 모두 추적해야 한다.
5. 프로젝트가 커지면 "왜 갑자기 이 svg가 빨갛지?"의 원인이 멀리 떨어진 부모 클래스에 숨어 있는 사고가 자주 생긴다.
6. 한 클래스의 스타일이 자기 영역을 넘어 다른 요소까지 건드리는 이런 동작을 "스타일이 새어 나간다"고 표현한다.

7. vanilla-extract는 이 누수를 원천 차단하기 위해, `style()` 한 번의 호출은 정확히 한 클래스의 스타일만 결정한다는 규칙을 세웠다.

    ```ts
    // 한 style() 호출 = 한 클래스 = 그 클래스가 붙은 요소만 책임짐
    export const card = style({
      background: 'white',
      // 자기 자신의 hover 상태 — 자기 영역 안이라 OK
      ':hover': { transform: 'translateY(-4px)' },
    });
    ```

8. 그래서 스타일 블록 안의 셀렉터는 자기 자신을 가리키는 `&`나 그 상태·미디어 변형까지만 허용된다.
9. `& > svg`나 `& .child`처럼 자기 안쪽의 다른 요소를 가리키는 셀렉터를 쓰려고 하면 빌드 단계에서 막힌다.

10. 그러면 자식 요소의 스타일은 어디에 정의해야 할까?
11. 답은 "자식은 자기 자신의 style() 안에서 자기 스타일을 정의한다"이다.

    ```ts
    // 부모 — 자기 영역만 책임
    export const card = style({
      background: 'white',
    });

    // 자식 — 자기 영역만 책임. 별도의 style() 호출로 분리
    export const icon = style({
      fontSize: '1.25rem',
    });
    ```

12. 컴포넌트 쪽에서는 부모 요소에 `card` 클래스, 자식 요소에 `icon` 클래스를 각각 붙여 두 스타일을 합성한다.

    ```tsx
    <div className={s.card}>
      <Icon className={s.icon} />
    </div>
    ```

13. 이렇게 두면 "이 요소가 왜 이렇게 보이지?"라는 질문이 들 때 그 요소에 붙은 클래스의 style() 정의 한 곳만 보면 답이 나온다.
14. 만약 자식의 스타일이 부모의 상태(예: 부모가 hover 됐을 때)에 따라 바뀌어야 하면, 자식의 style() 안에서 부모 클래스 ID를 참조하는 selectors 패턴을 쓰는데 이는 다음 섹션에서 다룬다.
15. 정리하면 vanilla-extract의 단일 클래스 규칙은 "한 style()의 영향 범위를 그 클래스가 붙은 요소 안으로만 가둔다"는 약속이고, 이 약속 덕분에 스타일 누수 없이 컴포넌트 단위로 안전하게 분리해 작성할 수 있다.

## selectors 패턴 — 자식 쪽에서 부모 호버를 참조

1. 해결책은 아이콘에 별도 클래스(`icon`)를 만들고, 그 클래스의 selectors 안에서 부모(`card`)의 hover 상태를 참조하는 것이다.

    ```ts
    export const card = style({
      ':hover': { transform: 'translateY(-4px)' },
    });

    export const icon = style({
      transition: 'transform 200ms ease',
      selectors: {
        [`${card}:hover &`]: {
          transform: 'rotate(-12deg) scale(1.08)',
        },
      },
    });
    ```

2. `${card}`는 vanilla-extract가 빌드 시점에 만들어둔 card 클래스의 고유한 클래스 이름 문자열이다.
3. `&`는 지금 정의 중인 클래스 자기 자신, 즉 icon을 가리킨다.
4. 따라서 위 셀렉터는 컴파일 후 `.card_xxx:hover .icon_yyy { transform: ... }` 형태의 일반 CSS로 변환된다.
5. 이 규칙은 "이 스타일 정의(icon)는 자기 자신에만 영향을 준다"는 단일 클래스 규칙을 어기지 않으면서, 부모 상태에 반응하는 효과를 표현할 수 있게 해준다.

## CSS hover 전파의 원리

1. CSS에서 `:hover`는 마우스 포인터가 그 요소(또는 자식 영역) 위에 있을 때 매칭되는 상태 의사 클래스다.
2. 자식 영역에 마우스가 올라가면 자식과 그 자식을 포함하는 모든 부모가 동시에 hover 상태가 된다.
3. 그래서 카드 안의 아이콘 위에 마우스를 올려도 카드의 `:hover`가 활성화되고, `${card}:hover .icon` 셀렉터도 함께 매칭된다.
4. 결과적으로 박스의 transform과 아이콘의 transform이 같은 hover 이벤트로 동시에 시작되며, 두 transition은 각각 자기 속도로 진행된다.
5. 이런 부모-자식 hover 연동은 별도의 자바스크립트 없이 CSS 셀렉터 하나로 깔끔하게 표현된다.

## transition을 박스와 아이콘으로 분리한 이유

1. transition은 그 속성이 정의된 요소의 스타일 변화에만 적용된다.
2. 박스(`card`)의 transition에는 color, border, transform, box-shadow를 모두 등록해 박스 자체의 변화가 부드럽게 보간되도록 했다.
3. 아이콘(`icon`)에는 transform 하나만 transition으로 등록해 회전·확대만 부드럽게 따라가게 했다.
4. 만약 박스와 아이콘을 한 요소에서 묶어 처리하면, 박스의 translateY와 아이콘의 rotate가 같은 transform 속성을 두고 다투게 된다.
5. 즉 한 요소의 transform은 단 하나의 값만 가질 수 있어, 둘을 합치면 박스가 회전해버리거나 아이콘이 같이 떠오르는 의도하지 않은 결과가 나온다.
6. 박스와 아이콘을 별도 요소로 두고 각자 transform을 갖게 한 것이 분리 효과의 핵심이다.

## transform 합성이 가능한 경계

1. 같은 요소의 transform은 한 번에 하나의 값만 가진다는 점은 중요한 제약이다.
2. 그러나 한 transform 값 안에서는 여러 함수를 공백으로 이어 붙일 수 있다.

```css
transform: rotate(-12deg) scale(1.08);
```

3. 이 경우 브라우저는 왼쪽부터 오른쪽 순서대로 변환을 합성해 적용한다.
4. 그래서 아이콘에서는 rotate와 scale을 한 줄에 넣어도 충돌 없이 같이 동작한다.
5. 반면 박스의 translateY와 아이콘의 rotate는 서로 다른 요소에 있으므로 같은 속성을 두고 경쟁할 일이 없다.
6. 정리하면 "한 요소 안의 여러 함수 합성은 가능, 다른 요소의 transform은 분리해서 둔다"는 두 원칙이 함께 작동한 결과다.

## prefers-reduced-motion 처리

1. 일부 사용자는 OS 설정으로 화면 모션을 줄이도록 요청하며, 이는 멀미나 인지 부하를 피하기 위한 접근성 옵션이다.
2. 이 설정은 CSS에서 `@media (prefers-reduced-motion: reduce)` 미디어 쿼리로 감지할 수 있다.
3. 박스와 아이콘 모두 transform을 가지므로, 두 클래스 각각의 미디어 쿼리에서 transition을 none으로 무력화해야 한다.

    ```ts
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
    ```

4. 한쪽만 막으면 박스는 즉시 이동하고 아이콘만 부드럽게 회전하는 어색한 상태가 남는다.
5. 둘 다 차단해야 호버 시 변화가 즉시 일어나고 부드러운 보간만 사라져, 의도된 시각 결과는 유지하면서 모션 자극만 제거된다.

## IconTile로 공용화

1. ContactLinks의 카드/아이콘 효과를 SkillsSection의 보유 기술 칩에 그대로 옮기게 되면서, 동일한 스타일이 두 곳에서 쓰이는 상황이 됐다.
2. 두 사용처는 의미가 다른데, ContactLinks는 외부 링크라 anchor 태그가 필요하고 SkillsSection은 단순 정보 표시라 링크가 아니다.
3. 또 보유 기술은 카드 아래에 "Next.js" 같은 라벨이 들어가야 했고, ContactLinks는 라벨 없이 카드만 표시했다.
4. 그래서 IconTile이라는 공용 컴포넌트를 만들고, props로 차이점만 받게 설계했다.

```tsx
interface IconTileProps {
  icon: IconType;
  label?: string;
  href?: string;
  ariaLabel?: string;
}
```

5. 내부에서 `href`가 있으면 anchor를, 없으면 div를 카드로 렌더링해 의미 분기를 처리한다.
6. `label`이 있으면 카드 아래에 caption을 두고 column flex로 묶어 카드+라벨 묶음을 만든다.
7. 카드와 아이콘 스타일·호버 효과는 전부 IconTile.css.ts에 모여 있어, 두 사용처는 시각적으로 항상 동일하게 유지된다.
8. 부르는 쪽에서는 도메인 데이터를 props에 채워 넣기만 하면 되고, ContactLinks·SkillsSection의 css는 list 레이아웃과 섹션 헤딩만 책임지게 단순해졌다.

## 정리

1. 부모 hover에 따라 자식만 변화시키려면, 자식의 style 정의 안에서 `${parent}:hover &` 패턴으로 부모 클래스 ID를 참조한다.
2. transition은 효과를 받을 요소 각각에 따로 둬야 하며, transform은 한 요소에서 하나의 값만 가질 수 있으니 분리된 효과는 분리된 요소가 필요하다.
3. 같은 transform 값 안의 함수들은 공백으로 이어 합성할 수 있고, 좌→우 순으로 적용된다.
4. transform 기반 모션을 쓰는 모든 요소는 prefers-reduced-motion 미디어 쿼리에서 transition을 none으로 무력화해야 접근성 옵션이 일관되게 동작한다.
5. 동일한 시각 패턴이 의미가 다른 두 곳에서 쓰이면, 차이를 props로 흡수하는 단일 컴포넌트로 추출해 시각 일관성과 도메인 분리를 동시에 잡을 수 있다.

→ 박스와 아이콘을 분리한 요소·transform·transition으로 만든 뒤, 자식 selectors에서 부모 hover 상태를 참조하면 vanilla-extract의 단일 클래스 규칙을 지키면서도 풍부한 호버 인터랙션을 표현할 수 있다.
