// NestJS 앱 부트스트랩 — Express 어댑터 위에 글로벌 미들웨어·파이프·CORS·Swagger를 얹어 4000번 포트에서 listen 시작
// eslint-disable-next-line @typescript-eslint/no-require-imports
import cookieParser = require('cookie-parser');

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

// 진입점 — AppModule을 IoC 컨테이너로 띄우고 글로벌 설정을 적용한 뒤 HTTP listen 시작
async function bootstrap() {
  // NestFactory.create: AppModule의 imports를 풀어 DI 그래프를 만들고 Express 어댑터 부착
  const app = await NestFactory.create(AppModule);
  // 환경 변수 접근용 — ConfigModule이 등록한 ConfigService를 컨테이너에서 직접 꺼낸다
  const cs = app.get(ConfigService);

  // cookie-parser 미들웨어 — Set-Cookie 헤더로 들어온 raw 문자열을 req.cookies 객체로 파싱, 가드/컨트롤러가 쿠키 기반 인증을 쓰려면 필수
  app.use(cookieParser());

  // 글로벌 ValidationPipe — 모든 컨트롤러의 @Body/@Query DTO에 class-validator 규칙을 자동 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 선언되지 않은 필드는 무시 — mass assignment 차단
      forbidNonWhitelisted: true, // DTO에 없는 필드가 오면 400 — 클라이언트 오용 조기 발견
      transform: true, // 요청 바디(JSON 객체)를 DTO 클래스 인스턴스로 변환 — @Type() 데코레이터로 number/Date 캐스팅도 처리
      // prod에서 에러 메시지에 필드명이 노출되면 enumeration 단서가 됨 — 메시지 억제
      disableErrorMessages: cs.get<string>('NODE_ENV') === 'production',
    })
  );

  // CORS — 프론트(다른 origin)에서 withCredentials:true로 쿠키를 보낼 수 있게 credentials:true 필수
  app.enableCors({
    origin: cs.get<string>('FRONTEND_ORIGIN'),
    credentials: true,
  });

  // Swagger UI — dev에서만 /api/docs 마운트, prod는 API 스펙 노출 자체가 공격면이라 차단
  if (cs.get<string>('NODE_ENV') !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('limjaejoon API')
      .setVersion('0.1')
      // access_token 쿠키 인증 스킴 — 컨트롤러의 @ApiCookieAuth('access_token')와 이름이 일치해야 Swagger UI에 자물쇠 아이콘이 뜬다
      .addCookieAuth('access_token')
      .build();
    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(app, doc)
    );
  }

  // 호스트 OS의 PORT가 있으면 우선, 없으면 docker-compose expose와 동일한 4000번
  const port = process.env['PORT'] ?? 4000;
  await app.listen(port);
}

bootstrap();
