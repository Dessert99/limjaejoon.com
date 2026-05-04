// access JWT 가드 — @UseGuards(AccessTokenGuard) 한 줄로 라우트를 보호. 실제 검증은 AccessTokenStrategy('jwt')가 담당, 가드는 AuthGuard('jwt')를 상속해 트리거 역할만
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// AuthGuard('jwt') — Passport에 'jwt' 이름으로 등록된 strategy를 자동으로 찾아 실행. 통과 시 req.user 부착, 실패 시 401
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}
