// 인증 비즈니스 로직 — 컨트롤러가 HTTP·쿠키만 다루고, 이 서비스는 bcrypt·JWT·refresh 회전 같은 도메인 로직을 오케스트레이션한다
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

// 응답 body에 노출 가능한 사용자 형태 — passwordHash는 의도적으로 빠짐
export interface PublicUser {
  id: string;
  email: string;
  createdAt: Date;
}

// signup/login/refresh가 모두 만들어내는 공통 형태 — 컨트롤러가 이 객체를 받아 토큰은 쿠키로, user/accessExpiresAt은 body로 보낸다
export interface AuthResult {
  user: PublicUser;
  accessToken: string;
  accessExpiresAt: number;
  refreshToken: string;
  refreshExpiresAt: Date;
}

// bcrypt 라운드 환경 변수명 — Joi가 10–14 범위로 검증
const BCRYPT_ROUNDS_ENV = 'BCRYPT_ROUNDS';

// User → PublicUser — passwordHash 제거가 핵심
function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

// PostgreSQL unique 제약 위반 SQLSTATE — TypeORM이 QueryFailedError에 그대로 노출
const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cs: ConfigService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  // signup(email, password) — bcrypt 해시 → users INSERT → AuthResult 조립. 중복 이메일은 409
  async signup(email: string, password: string): Promise<AuthResult> {
    const rounds = this.cs.get<number>(BCRYPT_ROUNDS_ENV) ?? 12;
    const passwordHash = await bcrypt.hash(password, rounds);

    let user: User;
    try {
      user = await this.usersService.create({ email, passwordHash });
    } catch (err: unknown) {
      // 에러 코드(SQLSTATE)로만 분기 — 메시지는 PostgreSQL 버전마다 달라 신뢰 불가
      if (isQueryFailedError(err) && err.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Email already registered');
      }
      throw err;
    }

    return this.buildAuthResult(user); // 토큰 한 쌍 발급
  }

  // login(email, password) — 사용자 조회 → bcrypt.compare → AuthResult 조립. 미존재·불일치 모두 동일 401로 enumeration 차단
  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 같은 메시지로 두 번 던지는 이유: 사용자가 존재하는지 안 하는지를 응답으로 구분하지 못하게 해서 이메일 enumeration 공격을 막기 위해
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResult(user); // 토큰 한 쌍 발급
  }

  // refresh(userId, jti) — RefreshTokenGuard 통과 후 호출. 기존 jti 폐기 + 새 access·refresh 발급
  async refresh(userId: string, jti: string): Promise<AuthResult> {
    const issued = await this.refreshTokenService.rotate(jti, userId);
    const user = await this.usersService.findById(userId);
    if (!user) {
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

  // logout(jti) — DB의 refresh row revokedAt 세팅. 미존재·이미 폐기 모두 throw 없음(멱등)
  async logout(jti: string): Promise<void> {
    await this.refreshTokenService.revoke(jti);
  }

  // me(userId) — 가드가 검증한 userId로 DB 조회 → PublicUser 반환
  async me(userId: string): Promise<PublicUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return toPublicUser(user);
  }

  // signAccessToken(userId) — sub 클레임에 userId, ACCESS_SECRET·TTL로 서명 → JWT 문자열 반환
  private signAccessToken(userId: string): string {
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

  // buildAuthResult(user) — signup·login 공통. access JWT + refresh JWT(jti DB 저장) 발급 후 묶음
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

// JWT의 두 번째 세그먼트(payload) base64url 디코드 → exp 클레임(초) → epoch ms 변환. 프론트가 만료 임박 시점 계산에 사용
function decodeExpiresAt(token: string): number {
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
  ) as { exp: number };
  return payload.exp * 1000;
}

// TypeORM QueryFailedError 타입 가드 — TypeORM이 정식 타입을 export하지 않아 code 프로퍼티 존재로만 좁힘
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
