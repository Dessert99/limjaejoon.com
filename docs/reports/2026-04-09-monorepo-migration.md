## 왜 모노레포로 전환했는가

1. 기존 프로젝트는 Next.js 하나로 구성된 단일 레포였다.
2. 여기에 NestJS 백엔드를 추가해야 하는 상황이 생겼다.
3. 백엔드를 같은 레포 안에 두려면, 프론트엔드와 백엔드의 의존성을 분리하면서도 하나의 저장소에서 관리할 수 있는 구조가 필요했다.
4. 이 문제를 해결하는 방법이 모노레포이고, Node.js 생태계에서는 workspaces라는 기능으로 이를 지원한다.


## npm workspaces란 무엇인가

1. 원래 하나의 프로젝트에는 하나의 package.json이 있고, 모든 의존성이 그 안에 들어간다.
2. 프로젝트가 커져서 프론트엔드와 백엔드를 함께 관리하게 되면, 서로 필요한 의존성이 완전히 다르다는 문제가 생긴다.
3. Next.js는 react, vanilla-extract 같은 패키지가 필요하고, NestJS는 reflect-metadata, rxjs 같은 패키지가 필요하다.
4. 이걸 하나의 package.json에 다 넣으면, 어떤 패키지가 어디서 쓰이는지 구분이 안 된다.
5. npm workspaces는 이 문제를 해결하기 위해 npm 7부터 내장된 기능이다.
6. 핵심 원리는 루트 package.json에서 하위 디렉토리들을 workspace로 등록하는 것이다.

```json
{
  "workspaces": ["frontend", "backend"]
}
```

7. 이렇게 설정하면 frontend/package.json과 backend/package.json이 각각 독립적인 의존성을 갖는다.
8. 루트에서 npm install을 실행하면, 모든 workspace의 의존성을 한 번에 설치한다.
9. 이때 공통 패키지는 루트의 node_modules에 한 번만 설치되어 중복이 줄어든다.
10. 특정 workspace의 스크립트를 실행하려면 -w 플래그를 사용한다.

```bash
npm run dev -w frontend    # frontend의 dev 스크립트 실행
npm run build -w backend   # backend의 build 스크립트 실행
```

11. 루트 package.json에 이런 단축 스크립트를 등록해두면, 매번 -w를 쓰지 않아도 된다.

```json
{
  "scripts": {
    "dev:fe": "npm run dev -w frontend",
    "dev:be": "npm run dev -w backend"
  }
}
```

12. Turborepo나 pnpm workspaces 같은 대안도 있지만, 2개 앱 규모에서는 npm workspaces가 가장 단순하다.
13. 추가 도구 없이 이미 쓰고 있는 npm만으로 모노레포를 구성할 수 있기 때문이다.

→ npm workspaces는 하나의 저장소 안에서 여러 앱의 의존성을 분리 관리하는 npm 내장 기능이다.


## 프론트엔드를 frontend/ 디렉토리로 분리한 이유

1. 모노레포에서는 각 앱이 자기만의 디렉토리를 가져야 workspace로 인식된다.
2. 기존 루트에 흩어져 있던 app/, features/, styles/ 등을 frontend/ 하위로 옮겨야 했다.
3. 이때 git mv를 사용한 이유는, 일반 mv와 달리 git이 파일 이동을 추적하기 때문이다.
4. git mv로 옮기면 git log --follow로 이동 전 히스토리까지 볼 수 있다.
5. package.json도 분리가 필요했다.
6. 기존 루트 package.json에는 Next.js 의존성과 prettier가 함께 들어 있었다.
7. 프론트엔드 전용 의존성(next, react, vanilla-extract 등)은 frontend/package.json으로 옮기고, 루트에는 workspaces 설정과 prettier만 남겼다.
8. prettier를 루트에 둔 이유는 포맷팅은 전체 레포에 동일하게 적용되는 공통 관심사이기 때문이다.
9. 반면 ESLint는 frontend/에 그대로 뒀는데, Next.js와 NestJS의 린트 규칙이 완전히 다르기 때문이다.
10. tsconfig도 분리했다.
11. 공통 옵션(strict, esModuleInterop 등)은 루트의 tsconfig.base.json에 두고, frontend/tsconfig.json에서 extends로 상속받는 구조다.

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "paths": { "@/*": ["./*"] }
  }
}
```

12. 여기서 중요한 점은 @/* 경로 alias가 깨지지 않는다는 것이다.
13. tsconfig.json이 frontend/ 안에 있으므로, @/*는 자동으로 frontend/*를 가리킨다.
14. 즉 기존 코드의 import 경로를 하나도 수정하지 않아도 된다.

→ 프론트엔드 분리의 핵심은 의존성과 설정을 격리하되, 기존 코드의 import 경로는 건드리지 않는 것이다.


## NestJS 백엔드를 수동으로 생성한 이유

1. NestJS CLI의 nest new 명령어를 쓰면 프로젝트를 자동 생성할 수 있다.
2. 하지만 이 명령어는 테스트 설정, .prettierrc, README 등 많은 파일을 함께 만든다.
3. 이 프로젝트의 개발 철학은 내가 이해하지 못하는 코드는 존재해선 안 된다는 것이다.
4. 그래서 최소한의 파일 4개만 직접 작성했다.
5. main.ts는 NestJS 앱을 부트스트랩하고 포트 4000에서 시작하는 진입점이다.

```typescript
const app = await NestFactory.create(AppModule);
await app.listen(4000);
```

6. app.module.ts는 NestJS의 루트 모듈로, 컨트롤러와 서비스를 등록하는 곳이다.
7. app.controller.ts는 HTTP 요청을 받는 곳이고, app.service.ts는 비즈니스 로직을 담는 곳이다.
8. NestJS의 tsconfig는 프론트엔드와 다른 점이 있다.
9. emitDecoratorMetadata와 experimentalDecorators가 필요한데, NestJS가 데코레이터 기반 프레임워크이기 때문이다.
10. 또한 NestJS는 빌드 결과를 dist/에 출력하므로 outDir 설정이 필요하고, Next.js처럼 noEmit을 쓰지 않는다.
11. 이런 차이 때문에 tsconfig.base.json에 공통 옵션만 두고, 각 앱이 자기만의 설정을 추가하는 구조가 맞는 것이다.

→ 수동 생성은 프로젝트에 이해할 수 없는 코드가 들어오는 걸 막고, 프론트엔드와 백엔드의 설정 차이를 명확히 인식하게 해준다.


## Claude 설정을 모노레포에 맞게 관리하는 법

1. .claude/ 디렉토리는 레포 루트에 그대로 유지한다.
2. Claude Code는 현재 디렉토리에서 위로 올라가며 CLAUDE.md를 찾기 때문에, 루트에 있으면 어느 앱에서든 적용된다.
3. CLAUDE.md는 디렉토리 구조와 개발 명령어를 모노레포에 맞게 업데이트했다.
4. rules/ 파일은 fe/, be/ 하위 폴더로 분리했다.

```
.claude/rules/
├── testing.md          # 공통
└── fe/
    ├── a11y.md
    ├── component.md
    ├── vanilla-extract.md
    └── blog-study-note-format.md
```

5. Claude Code는 rules/ 하위 폴더를 자동으로 탐색하므로, 이렇게 나눠도 정상 인식된다.
6. 각 규칙 파일의 paths frontmatter에 frontend/ prefix를 추가해서, 해당 앱 작업 시에만 규칙이 로드되도록 했다.
7. testing.md는 lint, build 검증처럼 전체에 적용되는 규칙이라 루트에 유지했다.
8. skills/와 commands/는 변경 없이 그대로 쓸 수 있다.

→ .claude/는 루트에 유지하되, rules만 fe/be 폴더로 분리하면 앱별 규칙 관리가 깔끔해진다.


## 주의할 점과 이후 영향

1. Vercel에 배포할 때는 프로젝트 설정에서 Root Directory를 frontend으로 지정해야 한다.
2. CI의 playwright.yml은 report 경로를 frontend/playwright-report/로 수정했고, Playwright 브라우저 설치는 frontend 디렉토리에서 실행되도록 working-directory를 지정했다.
3. 현재 packages/shared 같은 공유 패키지는 만들지 않았다.
4. 프론트엔드와 백엔드 사이에 실제로 공유할 타입이나 유틸이 생길 때 만드는 것이 맞다.
5. Turborepo도 지금은 불필요한데, 빌드 캐싱이나 병렬 실행이 필요해지는 시점은 앱이 3개 이상일 때다.
6. package-lock.json은 현재 gitignore에 포함되어 있는데, 모노레포에서는 루트에 하나의 lockfile이 생기므로 커밋하는 것을 고려할 수 있다.

→ 지금은 가장 단순한 구조로 시작하고, 실제 필요가 생길 때 공유 패키지나 빌드 도구를 추가한다.
