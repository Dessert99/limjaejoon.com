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
});
