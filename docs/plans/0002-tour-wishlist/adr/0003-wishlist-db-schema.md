# 0003. 위시리스트 DB 스키마와 메타데이터 스냅샷 저장 방식

- 상태: 승인됨
- 일자: 2026-05-01

## Context

위시리스트는 사용자별 관광지 목록을 저장한다. 위시리스트 페이지에서 카드(이름·이미지·주소)를 보여줘야 하는데, 외부 API에 매번 의존하면 (1) 외부 장애·rate limit에 취약하고 (2) 외부 데이터가 변경/삭제되어도 사용자 위시리스트 컨텍스트는 유지되어야 한다. 따라서 메타데이터 스냅샷을 DB에 저장한다. 스냅샷을 어떻게 저장할지 결정해야 한다.

## Options

- A. **컬럼 평탄화** — `snapshot_title`, `snapshot_first_image`, `snapshot_addr` 등 고정 컬럼.
- B. **JSON 컬럼** — `snapshot jsonb` 한 컬럼에 묶어 저장.

## Decision

**A. 컬럼 평탄화**.

`wishlist` 엔티티 컬럼 구성:

- `id` — uuid PK (`gen_random_uuid()`)
- `user_id` — uuid FK → `users.id`, ON DELETE CASCADE
- `content_id` — varchar(20), 한국관광공사 contentId (숫자 문자열)
- `snapshot_title` — varchar(200) NOT NULL
- `snapshot_first_image` — varchar(500) nullable (이미지 없는 관광지 존재)
- `snapshot_addr` — varchar(300) nullable
- `created_at` — timestamptz NOT NULL DEFAULT now()

인덱스:

- `(user_id, content_id)` UNIQUE 복합 — 중복 저장 방지 + 본인 위시리스트 조회 성능
- `(user_id, created_at DESC)` — 위시리스트 페이지 정렬 조회용

TypeORM CLI로 migration 생성 후 검토하는 기존 패턴 유지.

## Consequences

- 스냅샷 필드가 `title / firstimage / addr1` 세 개로 작고 변동이 적음 → JSON 컬럼의 유연성이 불필요.
- 컬럼 평탄화는 타입 안전성·인덱스 가능성·SQL 가독성에서 우위.
- 향후 스냅샷 필드 추가가 필요하면 migration이 필요(JSON 컬럼이라면 코드만 수정). 다만 비범위(폴더/태그 등) 확장 가능성 낮음.
- `ON DELETE CASCADE`로 사용자 탈퇴 시 위시리스트도 자동 정리.
- UNIQUE 제약 위반은 service에서 catch해 `ConflictException(409)`으로 변환.

## 권한 검증 규약 (IDOR 차단)

- service 메서드 시그니처는 **`userId`를 항상 첫 번째 필수 인자**로 받는다. 예: `list(userId)`, `add(userId, dto)`, `remove(userId, id)`.
- 모든 repository 호출의 WHERE 조건에 `user_id = userId`를 항상 포함. DELETE는 `repo.delete({ id, user_id: userId })`로 본인 소유가 아니면 0 row 영향.
- controller는 `@CurrentUser()` 데코레이터로 받은 `req.user.sub`만 service에 전달. **`/wishlist/:userId` 같은 path param에서 userId를 받지 않는다** — 신뢰할 수 있는 출처는 인증 컨텍스트뿐.
- service가 단독 방어선이 되어야 한다 — controller param 의존 시 service 직접 호출(테스트·내부 사용)에서 우회 가능.

## 입력 검증

- `CreateWishlistDto`: ACL과 의존을 끊기 위해 wishlist 도메인 자체 DTO를 정의. 필드:
  - `contentId: string` — `@Matches(/^\d{1,10}$/)` (외부 API URL/path에 그대로 들어가므로 숫자 외 문자 차단으로 SSRF·인코딩 우회 표면 제거)
  - `title: string` — `@IsString() @MaxLength(200)`
  - `firstImage?: string` — `@IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true })` (`data:`, `javascript:` 등 비표준 스킴 차단 — 클라이언트 `<img src>`로 렌더되므로 XSS 표면 축소)
  - `addr?: string` — `@IsOptional() @IsString() @MaxLength(300)`
- `ValidationPipe`(전역)로 자동 적용. 자세한 입력 검증·에러 형상은 ADR 0006 참고.
