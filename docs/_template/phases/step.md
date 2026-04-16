# Step N: {step-name}

## 읽어야 할 파일

- `/docs/plan_<name>/PRD.md`
- `/docs/plan_<name>/ARCHITECTURE.md` (있다면)
- `/docs/plan_<name>/ADR.md`
- (이 step이 의존하는 이전 산출물 경로)

## 작업

### 1. {첫 번째 작업}

시그니처 수준 지시를 여기 둔다. 내부 구현은 실행 세션 재량.

### 2. {두 번째 작업}

## Acceptance Criteria

```bash
# 실행 가능한 커맨드만 기입. 하네스가 이 커맨드를 재실행해 Trust but Verify 검증.
npm run build -w <workspace>
npm run test -w <workspace>
npm run lint -w <workspace>
```

## 검증 절차

1. AC 실행.
2. (추가로 눈으로 확인할 것)
3. `phases/index.json`의 이 step `status`를 `completed`로 바꾸고 `summary` 1줄 기록.

## 금지사항

- **{구체적 금지}**. 이유: {왜}.
- **기존 테스트를 깨뜨리지 마라**.
