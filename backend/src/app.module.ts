import * as path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './config/env.validation';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // 환경 변수를 전역으로 노출하고 부트 시 Joi 스키마로 검증 — 미달 시 즉시 종료
    ConfigModule.forRoot({
      isGlobal: true,
      // 루트 .env 단일 소스 — 호스트(cwd=backend/) / 컨테이너(cwd=/workspace/backend) 양쪽에서 동일 경로
      envFilePath: path.resolve(__dirname, '../../.env'),
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false, // 모든 검증 오류를 한꺼번에 출력
        allowUnknown: true, // PATH 등 OS 환경 변수가 섞여도 통과
      },
    }),
    // ConfigService를 주입받아 TypeORM 커넥션을 구성 — autoLoadEntities로 각 모듈이 등록한 엔티티를 자동 수집
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('POSTGRES_HOST'),
        port: cs.get<number>('POSTGRES_PORT'),
        username: cs.get<string>('POSTGRES_USER'),
        password: cs.get<string>('POSTGRES_PASSWORD'),
        database: cs.get<string>('POSTGRES_DB'),
        // 각 모듈이 TypeOrmModule.forFeature()로 등록한 엔티티를 자동 수집
        autoLoadEntities: true,
        // 스키마 자동 동기화 금지 — 변경은 항상 마이그레이션으로
        synchronize: false,
      }),
    }),
    // Phase 2 — 도메인 모듈 등록
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
