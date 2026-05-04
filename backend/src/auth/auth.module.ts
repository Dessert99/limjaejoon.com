// 인증/세션 모듈 — 로그인·회원가입·refresh·로그아웃·me 라우팅과 JwtAuthGuard를 한곳에 묶는다
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
    // TypeOrmModule.forFeature — 이 모듈 스코프에서만 RefreshToken 리포지토리를 생성·주입 가능하게 한다 (다른 모듈은 못 씀)
    TypeOrmModule.forFeature([RefreshToken]),
    // AuthService가 UsersService를 주입받으려면 UsersModule이 그 클래스를 export 해두고 여기서 import 해야 한다
    UsersModule,
    // JwtModule.register({}) — 옵션 없이 등록해 sign/verify 호출 때마다 secret·TTL을 직접 전달 (access·refresh가 다른 시크릿을 쓰기 때문)
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  // providers — 이 모듈이 만들어내는 주입 가능한 서비스/가드 목록
  providers: [AuthService, RefreshTokenService, JwtAuthGuard],
  // exports — Tour/Wishlist에서 @UseGuards(JwtAuthGuard) 쓸 때 가드 인스턴스 + JwtService(가드 내부 의존)를 해석할 수 있어야 함
  exports: [JwtAuthGuard, AuthService, JwtModule],
})
export class AuthModule {}
