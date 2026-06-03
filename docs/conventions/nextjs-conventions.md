# next.js 규칙

### 1. reactCompiler

- 프로젝트에 reactCompiler가 존재한다면, 불필요한 useCallback, useMemo 사용을 하지 않는다.

### 2. import 경로

- 같은 slice 내부의 가까운 파일은 상대 경로를 허용한다.
- FSD 레이어나 slice 경계를 넘는 import 는 `@/` alias 를 사용한다.
- 다른 slice 의 내부 파일을 깊게 import 해야 하는 상황이 반복되면 public API 정리를 검토한다.
