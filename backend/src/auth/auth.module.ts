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
  // JwtAuthGuard 를 다른 모듈(예: 미래 보호 라우트)에서 쓸 수 있도록 export
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
