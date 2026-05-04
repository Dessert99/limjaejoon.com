import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from './refresh-token.service';

// passwordHash 를 제외한 안전한 공개 사용자 형태 — 응답 body에 포함된다
export interface PublicUser {
  id: string;
  email: string;
  createdAt: Date;
}

// signup/login/refresh 가 공통으로 반환하는 형태
export interface AuthResult {
  user: PublicUser;
  accessToken: string; // 컨트롤러가 쿠키에 담을 값 — body에 절대 노출하지 않는다
  accessExpiresAt: number; // epoch ms — 프론트의 사전 refresh 계산용
  refreshToken: string; // 컨트롤러가 쿠키에 담을 값 — body 절대 금지
  refreshExpiresAt: Date;
}

// bcrypt 라운드를 결정하는 환경 변수 — Joi 검증으로 10–14 보장
const BCRYPT_ROUNDS_ENV = 'BCRYPT_ROUNDS';

// raw User → 공개 가능한 형태로 변환 — passwordHash 를 응답에서 제거
function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

// PostgreSQL unique 위반 코드 — 중복 이메일 삽입 시 발생
const PG_UNIQUE_VIOLATION = '23505';

// 회원가입·로그인·refresh·로그아웃·me 를 오케스트레이션하는 서비스
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cs: ConfigService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  // 회원가입 — bcrypt 해시 후 사용자 생성, 중복 이메일은 409
  async signup(email: string, password: string): Promise<AuthResult> {
    const rounds = this.cs.get<number>(BCRYPT_ROUNDS_ENV) ?? 12;
    const passwordHash = await bcrypt.hash(password, rounds);

    let user: User;
    try {
      user = await this.usersService.create({ email, passwordHash });
    } catch (err: unknown) {
      // PostgreSQL unique 위반 → 중복 이메일 — 에러 코드로만 분기, 메시지는 안전하게
      if (isQueryFailedError(err) && err.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Email already registered');
      }
      throw err;
    }

    return this.buildAuthResult(user);
  }

  // 로그인 — 사용자 미존재·비밀번호 불일치 모두 동일한 401 메시지로 enumeration 힌트 차단
  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResult(user);
  }

  // refresh — raw refresh 토큰을 회전하고 새 access+refresh 발급
  async refresh(rawRefresh: string): Promise<AuthResult> {
    const issued = await this.refreshTokenService.rotate(rawRefresh);
    const user = await this.usersService.findById(issued.userId);
    if (!user) {
      // refresh 토큰은 유효한데 사용자가 삭제된 예외 상황
      throw new NotFoundException('User not found');
    }
    const accessToken = this.signAccessToken(user.id);
    const accessExpiresAt = decodeExpiresAt(accessToken);

    return {
      user: toPublicUser(user),
      accessToken,
      accessExpiresAt,
      refreshToken: issued.raw,
      refreshExpiresAt: issued.expiresAt,
    };
  }

  // 로그아웃 — 현재 refresh 토큰만 폐기, 이미 폐기된 토큰도 에러 없이 처리(멱등)
  async logout(rawRefresh: string): Promise<void> {
    await this.refreshTokenService.revoke(rawRefresh);
  }

  // 현재 사용자 정보 반환 — JwtAuthGuard 통과 후 userId 로 DB 조회
  async me(userId: string): Promise<PublicUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return toPublicUser(user);
  }

  // access JWT 서명 — sub 클레임에 userId, 시크릿·TTL은 ConfigService에서 주입
  private signAccessToken(userId: string): string {
    // JwtSignOptions.expiresIn 은 ms 라이브러리의 StringValue 타입 — env 문자열을 단언으로 통과시킨다
    const expiresIn = (this.cs.get<string>('JWT_ACCESS_TTL') ??
      '15m') as JwtSignOptions['expiresIn'];
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.cs.get<string>('JWT_ACCESS_SECRET'),
        expiresIn,
      }
    );
  }

  // signup/login 공통 — access 발급 + refresh 발급 후 AuthResult 조립
  private async buildAuthResult(user: User): Promise<AuthResult> {
    const accessToken = this.signAccessToken(user.id);
    const accessExpiresAt = decodeExpiresAt(accessToken);
    const issued = await this.refreshTokenService.issue(user.id);

    return {
      user: toPublicUser(user),
      accessToken,
      accessExpiresAt,
      refreshToken: issued.raw,
      refreshExpiresAt: issued.expiresAt,
    };
  }
}

// JWT payload의 exp 클레임(초)을 epoch ms 로 변환 — 프론트 사전 refresh 계산용
function decodeExpiresAt(token: string): number {
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
  ) as { exp: number };
  return payload.exp * 1000; // 초 → 밀리초
}

// TypeORM QueryFailedError 타입 가드 — code 프로퍼티 존재 여부로 좁힘
function isQueryFailedError(
  err: unknown
): err is { code: string; message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string'
  );
}
