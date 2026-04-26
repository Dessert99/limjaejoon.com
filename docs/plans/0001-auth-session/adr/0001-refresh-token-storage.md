# 0001. Refresh 토큰 저장·회전·재사용 감지 모델

- 상태: 승인됨
- 일자: 2026-04-26

## Context
PRD가 refresh 토큰 회전(rotation)과 **재사용 감지**(이미 무효화된 refresh가 다시 들어오면 해당 사용자의 모든 활성 refresh 폐기)를 요구한다. stateless JWT는 회전 시점·재사용 사실을 서버가 알 수 없으므로 서버 상태가 필요하다.

## Options
- **A. JWT refresh + `jti` 컬럼만 관리** — 가벼우나 family(같은 로그인 세션 시리즈) 추적 불가
- **B. Opaque(랜덤 바이트) + `token_hash`(sha-256) + `family_id`(uuid) + `revoked_at`** — 토큰 자체는 DB 없이 검증 불가 ⇒ 탈취 시 즉시 차단, family 단위 폐기 용이. 매 refresh마다 DB 조회
- **C. JWT refresh + 별도 family 테이블** — JWT 검증 + DB 조회 둘 다. 복잡도만 늘어남

## Decision
**B (Opaque + sha-256 hash + family_id)** 선택.

### 스키마(요지)
```
refresh_tokens
  id            uuid pk
  user_id       uuid fk → users.id
  family_id     uuid                       -- 로그인 1회당 1 family
  token_hash    char(64) unique            -- sha-256(raw token)
  revoked_at    timestamptz nullable
  expires_at    timestamptz
  created_at    timestamptz default now()

  index (token_hash) unique
  index (family_id, revoked_at)            -- 재사용 감지 시 family 일괄 update 최적화
  index (user_id, revoked_at)              -- 사용자별 활성 세션 조회용
```

`family_id`+`revoked_at` 복합 인덱스가 없으면 family 일괄 폐기 쿼리가 풀스캔이 되어 timing leak + 부하 폭발. 필수.

### 토큰 생성
- **`crypto.randomBytes(32)`** → base64url 인코딩 → 클라이언트 쿠키. `Math.random()` 절대 금지
- DB에는 `crypto.createHash('sha256').update(raw).digest('hex')`만 저장
- raw는 256비트 균등 random이라 sha-256만으로 충분(역상·충돌 비현실적). bcrypt/argon2는 저엔트로피 사용자 입력용이라 여기엔 불필요

### 회전 (atomic)
race 방지를 위해 회전은 **단일 atomic 쿼리**로 직렬화:
- `UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL RETURNING id, family_id, user_id, expires_at`
- 반환 행이 없으면 → 이미 무효화 또는 미존재 → 재사용 감지 분기로
- 반환 행이 있으면 → 만료(`expires_at < now`) 체크 → 같은 `family_id`로 새 행 insert → 새 raw 쿠키 발급
- 동시에 같은 raw가 2회 들어와도 `UPDATE ... WHERE revoked_at IS NULL`이 1번만 매칭되므로 1회만 회전

### 재사용 감지
- 들어온 hash가 매칭 행이 있지만 위 atomic UPDATE가 0행 반환(이미 `revoked_at != null`) → 같은 `family_id`의 모든 행을 `revoked_at = now()`로 일괄 폐기 + 401
- 또는 사전 SELECT로 매칭 행을 찾고 `revoked_at != null`을 명시 분기. 둘 다 가능하나 atomic 방식이 race에 강함

### 로그아웃
현재 raw의 hash 행만 `revoked_at = now()` (family 전체는 아님 — 다른 디바이스 영향 없음).

## Consequences
**얻는 것**: PRD 요건 정확히 충족. 토큰 탈취 시 즉시 차단. JWT보다 단순한 검증 흐름. raw 토큰을 클라이언트가 갖고 있어도 DB에는 해시만 있어 DB 유출 시 인증 도용 직접 불가.

**잃는 것**: 매 refresh마다 DB 라운드트립 1회. stateless 검증 불가. refresh 빈도는 access 만료 주기(15분)에 묶여 부하 미미. 인덱스 누락 시 폐기 쿼리가 풀스캔이라 인덱스 관리 필수.

함정 메모:
- `crypto.randomBytes`는 동기 호출 시 entropy pool 부족 환경에서 블록될 수 있으나, Node.js에서는 사실상 무관(/dev/urandom)
- `family_id` 인덱스 없이 운영 시 팜 폐기가 timing leak 채널이 됨
- atomic UPDATE의 `RETURNING`은 Postgres 전용 — TypeORM에서는 QueryBuilder의 `.returning()` 사용

## Learnings
<!-- /execute 후 채움 -->
