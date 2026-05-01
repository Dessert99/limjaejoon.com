# Questions Log

세션 중 사용자가 던진 개념성 질문과 답변을 누적한다.
플랜 종료 시 study-note의 "학습한 개념·패턴" 섹션 입력으로 사용된다.

---

## Q1. `@CurrentUser` 데코레이터의 역할
- 발생: 백엔드 라운드 1 종료 직후, tour 도메인 검토
- A: **"사용자가 누구인지를 컨트롤러에 자동으로 넘겨주는 장치"**.
  - 전체 흐름:
    1. 사용자 로그인 → 서버가 JWT 토큰 발급 → 브라우저 쿠키에 저장
    2. 다음 요청 시 쿠키가 자동으로 따라감
    3. `JwtAuthGuard`가 토큰을 까서 사용자 ID를 `req.user`에 박아둠
    4. 컨트롤러는 그 ID로 누구 위시리스트인지 알아내야 함
  - ❌ 안 좋은 방법: `@Req() req`로 받아서 매번 `(req as ...).user.sub` 캐스팅 → 더럽고, 누군가 실수로 `@Param('userId')`를 받으면 다른 사람 ID 위조 가능(IDOR).
  - ✅ `@CurrentUser() userId: string` 한 줄로 자동 주입 → userId를 받을 길이 이거뿐이라 IDOR 차단이 코드 구조로 강제됨.
```ts
@Get()
async list(@CurrentUser() userId: string) {
  return this.service.list(userId);
}
```

## Q2. `env.validation.ts` 역할과 `TOUR_API_KEY` 추가로 얻는 것
- 발생: 백엔드 라운드 1 종료 직후
- A: 부팅 시점에 `.env`를 Joi 스키마로 검증 → 누락/형식 오류면 **NestJS 기동 자체가 실패** (fail-fast). 운영 중 모호한 에러보다 부팅 단계에서 즉시 발견. `Joi.string().required()` 덕에 `cs.get<string>('TOUR_API_KEY')` 호출 시 string 보장, 서비스 코드에서 undefined 분기 불필요.

## Q3. `queryRunner`는 단순 쿼리 실행 함수인가
- 발생: 마이그레이션 코드 검토
- A: 단순 실행기가 아님. TypeORM이 마이그레이션을 **하나의 DB 커넥션 + 트랜잭션**으로 묶어 잡아주는 객체. `queryRunner.query(sql)`은 raw SQL 실행이지만, 마이그레이션 도중 한 단계가 실패하면 그 트랜잭션이 롤백돼 부분 적용이 남지 않음. "쿼리 + 커넥션 + 트랜잭션"의 핸들.

## Q5. `down`은 언제 쓰나
- 발생: migration 검토
- A: `npm run migration:revert` 호출 시 실행. 잘못 적용한 마이그레이션을 되돌릴 때(운영 사고 대비) / dev 스키마 변경하면서 up→down→up 반복할 때. 학습 단계라 자주 쓸 일 적지만 "되돌릴 길"이라는 안전망 자체가 가치.

## Q6. DTO가 controller param으로 쓰이는 방식
- 발생: TourContentIdParamDto 검토
- A: **타입 + 검증 규칙 + Swagger 문서화를 한 클래스에 묶음**. 흐름: path/body/query가 들어오면 → ValidationPipe(전역)가 DTO 클래스 인스턴스로 변환(`transform: true`) → 데코레이터(`@Matches`, `@MinLength` 등)로 검증 → 통과 시 핸들러에 인스턴스 주입 / 실패 시 자동 400 BadRequestException.
```ts
@Get(':contentId/common')
async getCommon(@Param() param: TourContentIdParamDto) { ... }
```

## Q7. DTO와 프론트 타입의 차이
- 발생: 데이터 구조 비교
- A: 핵심은 **"TypeScript 타입은 컴파일 후 사라진다"**.
  - **컴파일 타임**: 빌드 시점에만 타입 체크 → 빌드 끝나면 타입 정보 싹 사라짐. 실행될 때는 그냥 JavaScript.
  - **런타임**: 외부에서 `{ email: 123 }` 이상한 게 들어와도 TypeScript는 못 막음. 그대로 들어와서 에러 발생.
  - **프론트 type**: 자기 코드끼리 "이 함수는 이 모양 받는다" 라벨. 외부 데이터 검증 ❌
  - **백엔드 DTO**: 라벨 + **검증 데코레이터**(`@Matches`, `@MaxLength`)가 붙어 ValidationPipe가 런타임에 실제로 검사
```ts
export class CreateWishlistDto {
  @Matches(/^\d{1,10}$/) // ← 이게 런타임에 실행됨 (DTO만의 차이)
  contentId!: string;
}
```
  - 비유: 프론트 type = 박스 라벨(안 까봄) / 백엔드 DTO = 라벨 + X-ray 검색대(실제로 까봄)
  - 양쪽에 같은 형태 작성 이유: 프론트가 백엔드 응답을 받을 때 자동완성·타입체크가 필요 → 백엔드 DTO 모양을 프론트 type에 베껴 둠(수동 미러링).

## Q8. `getCommon`은 무엇인가 (메서드 자체)
- 발생: controller 검토 — 이름 분해
- A: **`TourController` 클래스의 메서드 이름**. "관광지 ID 하나를 받아 그 관광지의 공통 상세 정보를 외부 API에서 가져와 응답하는 핸들러 메서드".
```ts
@Get(':contentId/common')
async getCommon(@Param() param: TourContentIdParamDto): Promise<TourCommonDto> {
  return this.tourService.fetchCommon(param.contentId);
}
```
  - **`@Get(':contentId/common')`**: GET `/tour/:contentId/common` 경로로 들어오는 요청을 이 메서드로 라우팅. 예: `GET /api/tour/125508/common` → 이 메서드 실행
  - **`getCommon` 이름 분해**: `get` + `Common`. 단순 명명 규칙(다른 이름이어도 무방)
  - **"Common"이 가리키는 것**: 한국관광공사 `detailCommon2` endpoint 미러. 그 endpoint가 반환하는 **공통 상세 정보**(title, overview, homepage, addr, firstimage)를 가져오는 API
  - 짝으로 `getIntro`(`detailIntro2` 미러)가 있고, 두 메서드가 RSC `Promise.all`로 병렬 호출되도록 설계됨(ADR 0004)

## Q9. NestJS에서 req/res 구조 / 반환값 행선지
- 발생: controller `return` 검토
- A: Express의 req/res를 NestJS가 추상화.
  - req → `@Body() dto`, `@Param() param`, `@Query() query`로 필요한 부분만 꺼냄
  - res → 핸들러 `return` 값이 자동으로 JSON 응답 body가 됨(NestJS가 JSON.stringify + 200)
  - 직접 res 접근(쿠키 등) → `@Res({ passthrough: true })` (auth.controller.ts 패턴)
- "contentId만 반환?" → 아님. `return this.tourService.fetchCommon(param.contentId)`가 반환하는 **`TourCommonDto` 객체 전체**가 응답 body. `param.contentId`는 service 호출 인자일 뿐.

## Q10. `@Injectable` 데코레이터의 역할
- 발생: service 클래스 검토 — "왜 필요한가"
- A: **"NestJS DI 컨테이너에 클래스를 등록하는 출입증"**. 이거 안 붙이면 NestJS가 그 클래스를 못 알아봐서 다른 곳에 주입 못 함.
  - **본사-지점 비유**:
    - 지점장이 매번 직접 원두·기계·알바 다 챙기면 → 매번 같은 일 반복, 표준화 X
    - 본사가 "지점은 영업만 해. 자원은 우리가 관리"라고 하면 지점장은 영업에 집중
    - 이때 본사 시스템에 **등록된 지점만** 본사 자원 받을 수 있음. 등록 안 된 사설 가게는 못 씀
  - 매핑:
    - 본사 = NestJS DI 컨테이너
    - 지점 = `TourService` 같은 `@Injectable` 클래스
    - 본사 등록증 = `@Injectable()` 데코레이터
    - 본사 자원 = `HttpService`, `Repository`, `ConfigService` 같은 의존성
```ts
@Injectable() // ← 본사 등록증
class TourService {
  constructor(private readonly http: HttpService) {} // 본사가 알아서 주입
}
```
  - NestJS 부팅 시 등록증 보고 → "TourService는 HttpService 필요하구나" 인식 → HttpService 인스턴스 1개 만들어서 자동으로 끼워넣음. 개발자는 "필요해요" 표시만 하면 됨.
  - **이거 안 쓰면?**: 모든 클래스를 매 사용처마다 `new`로 직접 만들고 옵션·의존성을 손으로 넣어야 함 → 코드 양 폭증 + 옵션 산재 + 테스트 어려움. 그게 싫어서 NestJS가 자동화 시스템을 만들었고, 그걸 쓰려면 `@Injectable()` 한 줄이 입장권.
  - 추가 이득: (1) 싱글톤 공유 (2) 옵션 한 곳 정의(HttpModule.registerAsync) (3) 테스트 시 가짜 주입 가능(`{ provide: HttpService, useValue: mockHttp }`)

## Q11. `Logger`의 역할
- 발생: TourService logger 검토
- A: NestJS 내장 로거. `console.log`와 차이:
  - 컨텍스트(서비스 이름) 자동 prefix `[TourService]`
  - 레벨 구분(error/warn/log/debug/verbose)
  - 운영에서 Pino 등 구조화 로거로 교체 가능
  - 입력 객체를 그대로 직렬화하므로, axios 에러 객체 통째로 넘기면 `config.params.serviceKey` 노출. 그래서 `serializeAxiosError`로 안전 객체만 추려 넘김(ADR 0002 마스킹 강제).

## Q12. service의 역할과 return의 행선지
- 발생: controller-service 분리 흐름 이해
- A: controller는 검증된 입력을 받아 service에 위임 + 응답 형식화. **service는 비즈니스 로직 + DB/외부 API 호출**. service `return` → controller로 돌아가 → controller `return`이 NestJS 응답 변환기로 → JSON으로 클라이언트. 분리 이유: (a) 같은 로직을 여러 controller에서 재사용 (b) 테스트 쉬움(controller=HTTP 어댑터, service=순수 로직).

## Q13. MobileOS·MobileApp 값의 근거
- 발생: HttpModule registerAsync params 검토
- A: 한국관광공사 API 명세 요구사항(필수 쿼리 파라미터):
  - `MobileOS`: `AND/IOS/WEB/ETC` 중 택1 — 서버 사이드 호출이라 `'ETC'`
  - `MobileApp`: 호출 앱 식별자(임의 문자열, 통계 집계용) — 도메인 그대로 `'limjaejoon.com'`
- 비밀 값 아닌 단순 메타데이터.

## Q14. tour.service.spec.ts 테스트 픽스처 근거
- 발생: spec 파일 검토
- A:
  - **firstImage 빈 문자열 → null**: 외부 API가 이미지 없는 관광지에 빈 문자열을 돌려준다는 PRD 명시 → service 매퍼가 `'' || null`로 정규화 → 회귀 방지
  - **`resultCode === '0000'`**: KorService2 정상 응답 코드(API 문서 기준). 그 외 값은 외부 에러로 간주 → 503 변환
  - **`items.{item: [...]}` 구조**: 한국 공공 API의 표준 응답 envelope `{response: {header, body: {totalCount, items: {item: [...]}}}}`. 검색 결과 0건이면 `items`에 빈 문자열을 넣기도 함 → service에서 `typeof body.items === 'object'` 체크 추가.
