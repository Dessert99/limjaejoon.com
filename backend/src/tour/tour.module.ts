// 관광지 모듈 — 외부 KorService2 API 프록시. AuthModule을 import해 JwtAuthGuard로 모든 라우트 보호, HttpModule을 비동기 등록해 baseURL+공통 params 자동 주입
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  imports: [
    // AuthModule이 JwtAuthGuard + JwtModule을 export — 컨트롤러의 @UseGuards(JwtAuthGuard)가 여기서 가드 + JwtService를 해석
    AuthModule,

    // HttpModule.registerAsync — ConfigService 주입을 기다려 axios 인스턴스 옵션을 비동기로 조립 (env 읽으려면 register는 동기라 부족)
    HttpModule.registerAsync({
      inject: [ConfigService],
      // useFactory: (cs) => HttpModuleOptions — 이 axios 인스턴스가 모든 요청에 동일한 baseURL/timeout/params를 자동 적용
      useFactory: (cs: ConfigService) => ({
        baseURL: 'https://apis.data.go.kr/B551011/KorService2',
        timeout: 5000, // 5초 후 ECONNABORTED — 외부 API 응답 지연이 백엔드를 묶지 않게 끊는다
        params: {
          // serviceKey는 KorService2 인증 키 — axios가 자동 URL 인코딩하므로 .env엔 디코딩(원본) 키를 둔다
          serviceKey: cs.get('TOUR_API_KEY'),
          MobileOS: 'ETC',
          MobileApp: 'limjaejoon.com',
          _type: 'json', // KorService2는 기본 XML 응답 — JSON으로 받으려면 명시 필요
        },
      }),
    }),
  ],
  controllers: [TourController],
  providers: [TourService],
  // exports — Wishlist 등이 추후 TourService를 주입받을 수 있게 미리 공개
  exports: [TourService],
})
export class TourModule {}
