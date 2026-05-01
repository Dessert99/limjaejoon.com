import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  imports: [
    // JwtAuthGuard를 컨트롤러에서 사용하기 위해 AuthModule import
    // AuthModule이 JwtAuthGuard를 export하므로 별도 providers 등록 불필요
    AuthModule,

    // 모든 외부 API 호출에 공통 파라미터(serviceKey, MobileOS 등)를 자동 주입
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        baseURL: 'https://apis.data.go.kr/B551011/KorService2',
        timeout: 5000, // 외부 API 응답 대기 최대 5초 — 이후 ECONNABORTED
        params: {
          // Decoding 키 — 로그에 절대 출력하지 않는다 (ADR 0002)
          serviceKey: cs.get('TOUR_API_KEY'),
          MobileOS: 'ETC',
          MobileApp: 'limjaejoon.com',
          _type: 'json', // XML 대신 JSON 응답 요청
        },
      }),
    }),
  ],
  controllers: [TourController],
  providers: [TourService],
  // wishlist 등 다른 모듈에서 TourService를 주입할 수 있도록 미리 export
  exports: [TourService],
})
export class TourModule {}
