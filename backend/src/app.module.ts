// 앱 루트 모듈 — 환경 변수·DB 커넥션 같은 인프라를 먼저 구성하고 도메인 모듈(Users/Auth/Tour/Wishlist)을 등록한다
import * as path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './config/env.validation';
import { TourModule } from './tour/tour.module';
import { UsersModule } from './users/users.module';
import { WishlistModule } from './wishlist/wishlist.module';

// @Module — Nest IoC 컨테이너에 어떤 모듈/프로바이더/컨트롤러를 묶을지 선언하는 메타데이터
@Module({
  imports: [
    // ConfigModule.forRoot — process.env + .env 파일을 읽어 ConfigService에 적재. isGlobal:true 라 다른 모듈이 import 없이 주입 가능
    ConfigModule.forRoot({
      isGlobal: true,
      // 루트 .env 단일 소스 — 호스트(cwd=backend/) / 컨테이너(cwd=/workspace/backend) 양쪽에서 동일 경로로 해석되도록 절대화
      envFilePath: path.resolve(__dirname, '../../.env'),
      // Joi 스키마로 부팅 시점 검증 — 환경 변수 누락/형식 오류 시 NestFactory.create 자체가 실패해 prod에서 깨진 상태로 뜨는 사고를 막는다
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false, // 첫 오류에서 멈추지 말고 모든 오류를 한꺼번에 보고
        allowUnknown: true, // PATH·NODE_VERSION 등 OS 변수가 섞여도 통과
      },
    }),
    // TypeOrmModule.forRootAsync — ConfigService 주입을 기다려 DB 커넥션 옵션을 비동기로 조립 (forRoot는 동기·환경 변수 미반영)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // useFactory: ConfigService를 받아 DataSourceOptions 객체를 반환 — Nest가 TypeORM 커넥션을 한 번 만들어 모든 모듈에 공유
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('POSTGRES_HOST'),
        port: cs.get<number>('POSTGRES_PORT'),
        username: cs.get<string>('POSTGRES_USER'),
        password: cs.get<string>('POSTGRES_PASSWORD'),
        database: cs.get<string>('POSTGRES_DB'),
        // 각 도메인 모듈이 TypeOrmModule.forFeature([Entity])로 등록한 엔티티를 자동 수집 — 중앙에 entity 배열을 두지 않아도 됨
        autoLoadEntities: true,
        // synchronize:false — entity 변경이 곧바로 ALTER TABLE로 흘러가는 사고 방지, 스키마 변경은 항상 마이그레이션으로
        synchronize: false,
      }),
    }),
    // 도메인 모듈 — Auth는 Users 의존, Tour/Wishlist는 Auth(AccessTokenGuard) 의존
    UsersModule,
    AuthModule,
    TourModule,
    WishlistModule,
  ],
  // 루트 모듈은 직접 라우팅·서비스를 두지 않고 도메인 모듈에 위임
  controllers: [],
  providers: [],
})
export class AppModule {}
