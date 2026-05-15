// 인증/세션 모듈 — 라우트(컨트롤러), 도메인 로직(AuthService/RefreshTokenService), Passport strategy/guard를 한곳에 묶고, 가드는 다른 모듈도 쓸 수 있게 export
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RefreshTokenService } from './refresh-token.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    // PassportModule.register({}) — Passport 인프라(strategy 등록 메커니즘) 활성화. 기본 strategy 지정 안 함(@UseGuards로 명시)
    PassportModule.register({}),
    // forFeature([RefreshToken]) — 이 모듈 스코프에서만 Repository<RefreshToken> 주입 가능
    TypeOrmModule.forFeature([RefreshToken]),
    // AuthService가 UsersService 주입받기 위해 import (UsersModule이 UsersService export)
    UsersModule,
    // JwtModule.register({}) — 옵션 없이 등록해 sign/verify 시 secret·TTL을 호출 시점에 직접 전달 (access·refresh가 다른 시크릿)
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  // strategy/guard는 DI 컨테이너에 등록해야 PassportModule이 발견 가능
  providers: [
    AuthService,
    RefreshTokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
  ],
  // exports — Tour/Wishlist에서 @UseGuards(AccessTokenGuard) 쓰려면 가드 + JwtModule + PassportModule이 호출 모듈에서 해석돼야 함
  exports: [
    AuthService,
    AccessTokenGuard,
    RefreshTokenGuard,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
