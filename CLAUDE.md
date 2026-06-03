# limjaejoon.com

개인 포트폴리오 & 기술 블로그 + API 서버. npm workspaces 모노레포.

## CLAUDE.md 컨벤션
- frontend/
    - @docs/conventions/api-convention.md
    - @docs/conventions/folder-structure.md
    - @docs/conventions/nextjs-conventions.md
    - @docs/conventions/rhf-convention.md
    - @docs/conventions/zod-convention.md
- backend/
    - @docs/conventions/nestjs-conventions.md


## 개발 명령어

```sh
npm run dev:fe     # 프론트엔드 개발 서버
npm run dev:be     # 백엔드 개발 서버
npm run build:fe   # 프론트엔드 빌드
npm run build:be   # 백엔드 빌드
npm run lint       # 전체 린트
npm run format     # 전체 포맷
```


## 절대 하지 말아야 할 것들

- 애매한 부분이 생기면 추측하지 말고 무조건 물어봐라.
- 작업 중간에 임의로 다른 방향으로 바꾸지 마라.
- CRITICAL: 문제가 발생하면 즉시 수정하려 하지 말고 "왜?"를 최소 3회 반복해 근본 원인을 특정한 뒤, 그 원인을 명시하고 고쳐라. try-except로 에러 숨기기, 임시 하드코딩, 예외 케이스용 if 분기 추가, 실패하는 테스트 스킵·주석 처리 등 증상만 가리는 우회는 금지한다. 꼭 사용자에게 원인은 보고한다.
