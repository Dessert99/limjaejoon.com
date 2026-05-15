# next.js 규칙

### 1. reactCompiler

- 프로젝트에 reactCompiler가 존재한다면, 불필요한 useCallback, useMemo 사용을 하지 않는다.

### 2. import 경로

- 상위 폴더 참조(`../`, `../../` …)는 절대 경로 alias `@/`로 작성한다. 같은 디렉토리(`./X`)는 허용.
