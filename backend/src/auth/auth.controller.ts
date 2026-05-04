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

// JWT payload 형태 — guard 가 req.user 에 붙인다
interface JwtPayload {
  sub: string;
}

// 클라이언트에 반환하는 응답 body — 토큰 자체는 절대 포함하지 않는다 (ADR Critical)
interface AuthResponseBody {
  user: PublicUser;
  accessExpiresAt: number; // epoch ms — 프론트 사전 refresh 타이머용
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cs: ConfigService
  ) {}

  // 회원가입 — 성공 시 access·refresh 쿠키 발급, body에는 토큰 미포함
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
    // 쿠키 옵션은 cookie.config.ts 헬퍼에서만 가져온다 — 컨트롤러에 인라인 옵션 금지
    res.cookie('access_token', result.accessToken, COOKIE_OPTS_ACCESS(this.cs));
    res.cookie(
      'refresh_token',
      result.refreshToken,
      COOKIE_OPTS_REFRESH(this.cs)
    );
    return { user: result.user, accessExpiresAt: result.accessExpiresAt };
  }

  // 로그인 — 자격 검증 후 access·refresh 쿠키 발급
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

  // refresh — refresh 쿠키로 새 access·refresh 쌍 발급 (회전)
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
    // refresh 쿠키는 body가 아닌 쿠키에서 읽는다 — body 노출 금지
    const rawRefresh: string | undefined = req.cookies?.['refresh_token'];
    // 토큰 부재/검증 실패는 모두 "복구 불가능한 인증 실패"로 간주 → 양쪽 쿠키 만료 후 401
    // 호출자(브라우저·verifySession)가 좀비 쿠키를 들고 무한 루프에 빠지지 않도록 백엔드가 lifecycle 청소를 강제 (ADR 0005 보강)
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
      // refresh 검증 실패(만료/회수/주인 부재) 모두 동일 처리 — 좀비 쿠키 청소 후 원본 예외 전파
      res.cookie('access_token', '', COOKIE_OPTS_CLEAR(this.cs));
      res.cookie('refresh_token', '', COOKIE_OPTS_CLEAR(this.cs));
      throw err;
    }
  }

  // 로그아웃 — refresh 폐기 + 양쪽 쿠키 삭제
  @Post('logout')
  @ApiOperation({ summary: '로그아웃 — 쿠키 삭제 및 refresh 폐기' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ ok: boolean }> {
    const rawRefresh: string | undefined = req.cookies?.['refresh_token'];
    if (rawRefresh) {
      // revoke 는 이미 폐기된 토큰도 에러 없이 처리 — 멱등
      await this.authService.logout(rawRefresh);
    }
    // access·refresh 양쪽 쿠키 만료 — 옵션이 발급 시와 동일해야 브라우저가 삭제 (ADR 0002)
    res.cookie('access_token', '', COOKIE_OPTS_CLEAR(this.cs));
    res.cookie('refresh_token', '', COOKIE_OPTS_CLEAR(this.cs));
    return { ok: true };
  }

  // 현재 사용자 정보 — JwtAuthGuard 통과 시에만 진입
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: '현재 로그인 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 반환' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  async me(@Req() req: Request): Promise<PublicUser> {
    // guard 가 req.user 에 payload 를 붙였으므로 타입 단언으로 꺼낸다
    const payload = (req as Request & { user: JwtPayload }).user;
    return this.authService.me(payload.sub);
  }
}
