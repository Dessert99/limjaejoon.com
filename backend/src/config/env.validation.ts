// 환경 변수 검증 스키마 — ConfigModule.forRoot가 부팅 시 이 스키마로 process.env를 검증, 미달이면 NestFactory.create 자체가 실패해 잘못된 상태로 부팅되는 사고를 차단
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // 실행 환경 — 다른 변수의 분기 조건(prod에서만 strict)에도 사용
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Postgres 접속 정보 — postgres 공식 이미지가 인식하는 표준 변수명과 일치(docker-compose가 같은 이름으로 컨테이너에 주입)
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().integer().min(1).max(65535).default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  // JWT 시크릿 — 32자 이상 강제, 둘이 같으면 아래 .custom 검증에서 차단
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  // duration 문자열 — '15m'·'1d' 형태만 허용. 잘못된 단위(예: '15min')는 silent NaN으로 흘러가지 않게 패턴으로 막음
  JWT_ACCESS_TTL: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('15m'),
  JWT_REFRESH_TTL: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('1d'),

  // bcrypt 라운드 — 10 미만이면 무차별 대입에 약하고, 14 초과면 가입/로그인이 너무 느려짐
  BCRYPT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),

  // 쿠키 secure 플래그 — prod에서는 반드시 true(HTTPS 전용). dev는 false 허용
  COOKIE_SECURE: Joi.boolean()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.valid(true).required(),
    })
    .default(false),

  // 쿠키 도메인 — 빈 문자열이면 Host-only(서브도메인 누설 차단). 명시 시 sub.example.com 등으로 공유
  COOKIE_DOMAIN: Joi.string().allow('').optional(),

  // CORS origin — prod는 https URI만 허용해 mixed content·중간자 공격면 축소
  FRONTEND_ORIGIN: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string()
      .uri({ scheme: ['https'] })
      .required(),
    otherwise: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required(),
  }),

  // 한국관광공사 KorService2 디코딩 키 — TourModule HttpModule이 모든 요청에 serviceKey로 자동 첨부 (axios 자동 URL 인코딩)
  TOUR_API_KEY: Joi.string().required(),
})
  // .custom — 위의 개별 필드 검증이 모두 통과한 뒤 객체 전체를 한 번 더 검증. 두 시크릿이 같으면 refresh를 access 시크릿으로 verify할 수 있어 보안 구멍
  .custom((value: Record<string, unknown>, helpers) => {
    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      return helpers.message({
        custom: 'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must differ',
      });
    }
    return value;
  });
