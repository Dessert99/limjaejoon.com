// eslint-disable-next-line @typescript-eslint/no-require-imports
import cookieParser = require('cookie-parser');

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cs = app.get(ConfigService);

  // cookie-parser 미들웨어 — req.cookies 를 파싱해 쿠키 기반 인증이 동작하도록 한다
  app.use(cookieParser());

  // 글로벌 ValidationPipe — DTO 검증 실패 시 400, prod에서는 필드명 노출 억제
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드 자동 제거
      forbidNonWhitelisted: true, // 알 수 없는 필드 포함 시 400 반환
      transform: true, // 요청 바디를 DTO 클래스 인스턴스로 자동 변환
      // prod에서 ValidationPipe 에러 메시지에 필드명이 노출되면 enumeration 공격에 도움 — 억제
      disableErrorMessages: cs.get<string>('NODE_ENV') === 'production',
    })
  );

  // CORS — withCredentials:true 쿠키 전송을 허용하기 위해 credentials:true 필수
  app.enableCors({
    origin: cs.get<string>('FRONTEND_ORIGIN'),
    credentials: true,
  });

  // Swagger UI — prod 에서는 마운트하지 않는다 (ADR 0002)
  if (cs.get<string>('NODE_ENV') !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('limjaejoon API')
      .setVersion('0.1')
      // access_token 쿠키 기반 인증 스킴 등록 — @ApiCookieAuth('access_token') 과 짝
      .addCookieAuth('access_token')
      .build();
    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(app, doc)
    );
  }

  // PORT 환경 변수 우선, 없으면 4000 — docker-compose expose 포트와 일치
  const port = process.env['PORT'] ?? 4000;
  await app.listen(port);
}

bootstrap();
