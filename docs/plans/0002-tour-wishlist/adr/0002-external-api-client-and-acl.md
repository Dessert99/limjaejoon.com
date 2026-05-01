# 0002. 외부 API 호출 라이브러리 및 응답 변환 (ACL)

- 상태: 승인됨
- 일자: 2026-05-01

## Context

NestJS 백엔드가 한국관광공사 KorService2 API를 프록시 호출한다. (1) 호출 라이브러리 선택과 (2) 응답 변환 위치를 정해야 한다. 외부 API는 한글 필드명·중첩 구조가 비표준적이고, `serviceKey`·`MobileOS`·`MobileApp`·`_type=json` 등 매 호출 공통 파라미터가 필요하다.

## Options

### 호출 라이브러리

- A. `@nestjs/axios` (HttpModule) — DI 등록 가능, 모듈 단위 인터셉터·기본 params·timeout, 테스트는 `HttpService` mock으로 교체.
- B. `axios` 직접 — 서비스 내부 인스턴스, DI 미지원.
- C. native `fetch` — 의존성 최소화, 인터셉터 개념 없음, 타임아웃 장황.

### 응답 변환

- D. **그대로 노출** — 외부 한글 필드명이 프론트 타입까지 침투.
- E. **service 레이어에서 DTO 변환 (ACL)** — `TourItemDto`, `TourDetailDto`로 정규화. controller·프론트는 외부 스펙을 모름.

## Decision

- 호출 라이브러리: **A. `@nestjs/axios`**
- 응답 변환: **E. service 레이어 ACL**
- 공통 params(`serviceKey=TOUR_API_KEY`, `MobileOS=ETC`, `MobileApp=limjaejoon.com`, `_type=json`)는 `HttpModule.registerAsync` 등록 시점에 인터셉터로 자동 주입.
- timeout 5초, 외부 장애 시 axios 에러를 catch해 `ServiceUnavailableException(503)`으로 변환.
- **에러 누설 방지**: catch 시점에 axios 에러 객체를 그대로 throw 금지. service 내부에서 메시지를 `'외부 관광 API 호출 실패'`로 재작성한 새 예외만 throw. 원본 에러는 logger에 기록하되 `error.config`(URL·params·`serviceKey` 포함) 필드는 시리얼라이저에서 마스킹/제거.

## Consequences

- `HttpService` jest mock으로 교체하는 방식은 nock(실 HTTP 레이어)·MSW(fetch 기반)보다 NestJS DI 패턴과 일관됨.
- 인터셉터에서 `serviceKey`를 자동 주입하므로 service 코드에서 키가 노출되지 않고, 잊고 빠뜨릴 위험도 없음.
- ACL 변환 함수는 service 내부 private mapper로 둠. 외부 API v1/v2 분기·필드 변경이 발생해도 mapper 한 곳만 수정.
- `RxJS Observable → Promise` 변환(`firstValueFrom`)이 한 단계 들어감. 학습 가치 있음.
- **비범위 메모**: `@nestjs/throttler`로 검색 엔드포인트 rate limit. 프로덕션이면 필수(인증 사용자도 무한 쿼리로 `TOUR_API_KEY` 쿼터 소진 가능). 학습·로컬 dev 단계는 비범위로 두되, 프로덕션 전환 시 반드시 추가.
