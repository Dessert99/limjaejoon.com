// refresh JWT 가드 — /auth/refresh 엔드포인트에 적용. RefreshTokenStrategy('jwt-refresh')를 트리거해 쿠키 → JWT 검증 → DB 활성 검증 후 req.user에 {sub, jti} 부착
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
