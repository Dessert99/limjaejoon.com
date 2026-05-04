// 인증 라우트 컨트롤러 — HTTP를 받아 AuthService에 위임. 라우트 5개(signup/login/refresh/logout/me) 모두 토큰을 응답 body에 노출하지 않고 httpOnly 쿠키로만 발급
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService, PublicUser } from './auth.service';
import {
  COOKIE_OPTS_ACCESS,
  COOKIE_OPTS_CLEAR,
  COOKIE_OPTS_REFRESH,
} from './cookie.config';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

// JwtAuthGuard.canActivate가 검증 후 req.user에 부착하는 페이로드 — me에서 sub(=userId)만 사용
interface JwtPayload {
  sub: string;
}

// 응답 body 형태 — accessExpiresAt은 epoch ms, 프론트가 만료 임박 시점을 계산해 사전 refresh를 트리거하는 데 사용
interface AuthResponseBody {
  user: PublicUser;
  accessExpiresAt: number;
}

// @ApiTags — Swagger UI 좌측 그룹 라벨. @Controller('auth') — 모든 라우트가 /auth 프리픽스
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // DI — AuthService(비즈니스 로직)와 ConfigService(쿠키 옵션 헬퍼가 환경 변수 읽을 때 사용)
  constructor(
    private readonly authService: AuthService,
    private readonly cs: ConfigService
  ) {}

  // signup(dto, res) — 가입 처리 → access·refresh 쿠키 굽기 → user+accessExpiresAt JSON 반환
  @Post('signup')
  @ApiOperation({ summary: '이메일/비밀번호 회원가입' })
  @ApiResponse({ status: 201, description: '가입 성공 — 쿠키 발급됨' })
  @ApiResponse({ status: 400, description: '입력값 검증 실패' })
  @ApiResponse({ status: 409, description: '중복 이메일' })
  async signup(
    // @Body() — req.body를 SignupDto 인스턴스로 변환 + 글로벌 ValidationPipe가 class-validator 규칙 검증
    @Body() dto: SignupDto,
    // @Res({passthrough:true}) — 응답 객체에 손은 대지만(쿠키 set), JSON 직렬화·인터셉터는 Nest에 위임
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseBody> {
    const result = await this.authService.signup(dto.email, dto.password);
    // 쿠키 옵션은 cookie.config 헬퍼에서만 가져온다 — 인라인 옵션을 쓰면 발급/삭제 시 옵션 불일치로 브라우저가 삭제 못 함
    res.cookie('access_token', result.accessToken, COOKIE_OPTS_ACCESS(this.cs));
    res.cookie(
      'refresh_token',
      result.refreshToken,
      COOKIE_OPTS_REFRESH(this.cs)
    );
    return { user: result.user, accessExpiresAt: result.accessExpiresAt };
  }

  // login(dto, res) — 자격 검증 → access·refresh 쿠키 발급 → user+accessExpiresAt JSON 반환
  @Post('login')
  @ApiOperation({ summary: '이메일/비밀번호 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공 — 쿠키 발급됨' })
  @ApiResponse({ status: 400, description: '입력값 검증 실패' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseBody> {
    const result = await this.authService.login(dto.email, dto.password);
    res.cookie('access_token', result.accessToken, COOKIE_OPTS_ACCESS(this.cs));
    res.cookie(
      'refresh_token',
      result.refreshToken,
      COOKIE_OPTS_REFRESH(this.cs)
    );
    return { user: result.user, accessExpiresAt: result.accessExpiresAt };
  }

  // refresh(req, res) — 쿠키의 refresh 토큰 → 회전(기존 폐기 + 새 발급) → 새 쌍 쿠키 굽기, 실패 시 양쪽 쿠키 만료해 좀비 상태 청소
  @Post('refresh')
  @ApiOperation({ summary: 'Access 토큰 재발급 (refresh 쿠키 사용)' })
  @ApiResponse({ status: 200, description: '재발급 성공' })
  @ApiResponse({
    status: 401,
    description: '유효하지 않거나 만료된 refresh 토큰',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseBody> {
    // refresh 토큰은 쿠키에서만 읽는다 — body로 받으면 XSS로 탈취·재전송 가능
    const rawRefresh: string | undefined = req.cookies?.['refresh_token'];
    // 쿠키가 없으면 복구 불가 — 양쪽 쿠키를 즉시 만료시켜 프론트 verifySession이 좀비 access만 들고 무한 refresh 시도 못 하게 막음
    if (!rawRefresh) {
      res.cookie('access_token', '', COOKIE_OPTS_CLEAR(this.cs));
      res.cookie('refresh_token', '', COOKIE_OPTS_CLEAR(this.cs));
      throw new UnauthorizedException('No refresh token');
    }
    try {
      const result = await this.authService.refresh(rawRefresh);
      res.cookie(
        'access_token',
        result.accessToken,
        COOKIE_OPTS_ACCESS(this.cs)
      );
      res.cookie(
        'refresh_token',
        result.refreshToken,
        COOKIE_OPTS_REFRESH(this.cs)
      );
      return { user: result.user, accessExpiresAt: result.accessExpiresAt };
    } catch (err) {
      // 검증 실패(만료/이미 폐기/주인 부재) 모두 동일 청소 후 원본 예외 전파 — 클라가 어떤 실패 사유였는지 알 필요 없음
      res.cookie('access_token', '', COOKIE_OPTS_CLEAR(this.cs));
      res.cookie('refresh_token', '', COOKIE_OPTS_CLEAR(this.cs));
      throw err;
    }
  }

  // logout(req, res) — 쿠키의 refresh 토큰을 DB에서 폐기(있을 때만) + 양쪽 쿠키 만료 → {ok:true} 반환
  @Post('logout')
  @ApiOperation({ summary: '로그아웃 — 쿠키 삭제 및 refresh 폐기' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ ok: boolean }> {
    const rawRefresh: string | undefined = req.cookies?.['refresh_token'];
    // 쿠키가 있을 때만 DB revoke — 없어도 클라 입장에선 로그아웃 효과는 같으므로 throw 안 함(멱등)
    if (rawRefresh) {
      await this.authService.logout(rawRefresh);
    }
    // 옵션이 발급 시와 동일해야 브라우저가 같은 쿠키로 인식해 삭제 — COOKIE_OPTS_CLEAR가 같은 베이스 옵션을 사용하는 이유
    res.cookie('access_token', '', COOKIE_OPTS_CLEAR(this.cs));
    res.cookie('refresh_token', '', COOKIE_OPTS_CLEAR(this.cs));
    return { ok: true };
  }

  // me(req) — JwtAuthGuard 통과 후 req.user.sub로 DB 조회 → PublicUser 반환
  @Get('me')
  // @UseGuards(JwtAuthGuard) — 핸들러 진입 전에 가드 실행, 미인증이면 핸들러 호출조차 안 됨
  @UseGuards(JwtAuthGuard)
  // @ApiCookieAuth — Swagger UI에 자물쇠 아이콘 표시 (실제 인증은 가드가 담당)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: '현재 로그인 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 반환' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  async me(@Req() req: Request): Promise<PublicUser> {
    // 가드가 부착해둔 payload를 타입 단언으로 꺼낸다 — Nest가 Request 타입을 자동 확장해주지 않음
    const payload = (req as Request & { user: JwtPayload }).user;
    return this.authService.me(payload.sub);
  }
}
