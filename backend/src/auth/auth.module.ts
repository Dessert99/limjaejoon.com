import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [
    // RefreshToken 리포지토리를 DI에 등록
    TypeOrmModule.forFeature([RefreshToken]),
    // UsersService 를 AuthService 에서 주입받기 위해 UsersModule import
    UsersModule,
    // JwtModule 은 access 서명용 기본 설정 없이 등록 — sign/verify 호출 시 옵션 직접 전달
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, JwtAuthGuard],
  // JwtAuthGuard + JwtModule 둘 다 export — 가드가 다른 모듈(Tour/Wishlist)에서 사용될 때 그 모듈 스코프에서 JwtService를 해석할 수 있어야 함
  exports: [JwtAuthGuard, AuthService, JwtModule],
})
export class AuthModule {}
