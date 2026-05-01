import * as Joi from 'joi';

// 부트 시점에 환경 변수 전체를 검증하는 Joi 스키마 — 미달 시 NestJS 기동 자체가 실패한다
export const envValidationSchema = Joi.object({
  // 실행 환경
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Postgres 접속 정보 — postgres 공식 이미지의 표준 변수 이름과 통일 (단일 소스)
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().integer().min(1).max(65535).default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  // JWT 시크릿 — 최소 32자, 두 값이 다름을 객체 레벨 custom 검증으로 강제
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  // JWT 만료 duration 문자열 — `숫자+단위(s|m|h|d)` 형식 강제 (예: 15m, 7d). 잘못된 단위 시 silent failure 방지
  JWT_ACCESS_TTL: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('15m'),
  JWT_REFRESH_TTL: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('7d'),

  // bcrypt 라운드 — 너무 낮으면 보안 취약, 너무 높으면 성능 저하
  BCRYPT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),

  // prod에서는 반드시 true — https 전용 쿠키 강제
  COOKIE_SECURE: Joi.boolean()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.valid(true).required(),
    })
    .default(false),

  // 쿠키 도메인 — 기본 미지정(Host-only). 서브도메인 공유가 필요할 때만 명시
  COOKIE_DOMAIN: Joi.string().allow('').optional(),

  // CORS 허용 출처 — prod에서는 https URI만 허용
  FRONTEND_ORIGIN: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string()
      .uri({ scheme: ['https'] })
      .required(),
    otherwise: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required(),
  }),

  // 한국관광공사 KorService2 API Decoding 키 — TourModule HttpModule 인터셉터에서 serviceKey로 자동 주입 (ADR 0002)
  TOUR_API_KEY: Joi.string().required(),
})
  // 두 JWT 시크릿이 동일하면 refresh 토큰을 access 시크릿으로 검증 가능 → 보안 구멍
  .custom((value: Record<string, unknown>, helpers) => {
    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      return helpers.message({
        custom: 'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must differ',
      });
    }
    return value;
  });
