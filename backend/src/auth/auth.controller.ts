// 인증 라우트 컨트롤러 — HTTP를 받아 AuthService에 위임. /me는 AccessTokenGuard, /refresh는 RefreshTokenGuard로 보호. 토큰은 응답 body에 노출하지 않고 httpOnly 쿠키로만 발급
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

// Passport strategy의 validate 반환값이 req.user에 부착되는 형태 — access는 {sub}, refresh는 {sub, jti}
interface AccessUser {
  sub: string;
}
interface RefreshUser {
  sub: string;
  jti: string;
}

// 응답 body — accessExpiresAt은 epoch ms, 프론트가 만료 임박 시점 계산해 사전 refresh 트리거
interface AuthResponseBody {
  user: PublicUser;
  accessExpiresAt: number;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cs: ConfigService
  ) {}

  // signup(dto, res) — 가입 처리 → access·refresh 쿠키 발급 → user+accessExpiresAt JSON
  @Post('signup')
  @ApiOperation({ summary: '이메일/비밀번호 회원가입' })
  @ApiResponse({ status: 201, description: '가입 성공 — 쿠키 발급됨' })
  @ApiResponse({ status: 400, description: '입력값 검증 실패' })
  @ApiResponse({ status: 409, description: '중복 이메일' })
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseBody> {
    const result = await this.authService.signup(dto.email, dto.password);
    res.cookie('access_token', result.accessToken, COOKIE_OPTS_ACCESS(this.cs));
    res.cookie(
      'refresh_token',
      result.refreshToken,
      COOKIE_OPTS_REFRESH(this.cs)
    );
    return { user: result.user, accessExpiresAt: result.accessExpiresAt };
  }

  // login(dto, res) — 자격 검증 → access·refresh 쿠키 발급 → user+accessExpiresAt JSON
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

  // refresh(req, res) — RefreshTokenGuard가 쿠키→JWT→DB 활성 검증까지 처리 후 req.user={sub,jti}. 회전 실패는 가드 단계에서 401, 쿠키 청소는 가드가 못 하므로 catch에서
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiCookieAuth('refresh_token')
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
    // Passport strategy의 validate 반환값이 req.user에 부착됨
    const { sub, jti } = (req as Request & { user: RefreshUser }).user;
    try {
      const result = await this.authService.refresh(sub, jti);
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
      // rotate 중 race(이미 폐기) 등 — 좀비 쿠키 청소 후 원본 예외 전파
      res.cookie('access_token', '', COOKIE_OPTS_CLEAR(this.cs));
      res.cookie('refresh_token', '', COOKIE_OPTS_CLEAR(this.cs));
      throw err;
    }
  }

  // logout(req, res) — refresh JWT를 직접 디코드해 jti 추출 후 폐기, 검증 실패해도 쿠키는 무조건 만료시킨다(멱등)
  @Post('logout')
  @ApiOperation({ summary: '로그아웃 — 쿠키 삭제 및 refresh 폐기' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ ok: boolean }> {
    const rawRefresh: string | undefined = req.cookies?.['refresh_token'];
    // 쿠키가 있을 때만 JWT 디코드 시도 — 가드 없이 처리하는 이유는 만료/위조된 토큰이어도 로그아웃은 성공해야 하기 때문
    if (rawRefresh) {
      const jti = decodeJti(rawRefresh);
      if (jti) {
        await this.authService.logout(jti);
      }
    }
    // 쿠키 청소는 무조건 실행 — 옵션이 발급 시와 동일해야 브라우저가 같은 쿠키로 인식해 삭제
    res.cookie('access_token', '', COOKIE_OPTS_CLEAR(this.cs));
    res.cookie('refresh_token', '', COOKIE_OPTS_CLEAR(this.cs));
    return { ok: true };
  }

  // me(req) — AccessTokenGuard가 access JWT 검증 후 req.user.sub 부착, 그 userId로 DB 조회
  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: '현재 로그인 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 반환' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  async me(@Req() req: Request): Promise<PublicUser> {
    const { sub } = (req as Request & { user: AccessUser }).user;
    return this.authService.me(sub);
  }
}

// JWT 디코드 헬퍼 — 서명 검증 없이 payload만 꺼냄. 로그아웃은 위조된 토큰이어도 jti가 있으면 폐기 시도, 없으면 그냥 통과
function decodeJti(token: string): string | null {
  try {
    const segments = token.split('.');
    if (segments.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(segments[1], 'base64url').toString('utf8')
    ) as { jti?: string };
    return payload.jti ?? null;
  } catch {
    return null;
  }
}
