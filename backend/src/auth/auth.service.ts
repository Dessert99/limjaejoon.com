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

// bcrypt 라운드 환경 변수명 — Joi가 10–14 범위로 검증 (10 미만은 약하고 14 초과는 가입/로그인이 너무 느려짐)
const BCRYPT_ROUNDS_ENV = 'BCRYPT_ROUNDS';

// User(ORM 엔티티) → PublicUser(API 응답 형태) — passwordHash 필드 제거가 핵심
function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

// PostgreSQL이 unique 제약 위반 시 던지는 SQLSTATE — TypeORM이 QueryFailedError에 그대로 노출
const PG_UNIQUE_VIOLATION = '23505';

// @Injectable — 다른 클래스가 생성자 매개변수로 이 서비스를 받아 사용할 수 있게 IoC 컨테이너에 등록되는 표시
@Injectable()
export class AuthService {
  // DI — Users 도메인·JWT 라이브러리·환경 변수·refresh 토큰 도메인 네 가지를 조립한다
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cs: ConfigService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  // signup(email, password) — bcrypt 해시 → users INSERT → AuthResult 조립. 중복 이메일은 409로 변환
  async signup(email: string, password: string): Promise<AuthResult> {
    const rounds = this.cs.get<number>(BCRYPT_ROUNDS_ENV) ?? 12;
    // bcrypt.hash(평문, rounds) → salt 포함 해시 문자열. 같은 평문도 매번 다른 해시가 나온다
    const passwordHash = await bcrypt.hash(password, rounds);

    let user: User;
    try {
      user = await this.usersService.create({ email, passwordHash });
    } catch (err: unknown) {
      // 에러 코드(SQLSTATE)로만 분기 — 에러 메시지는 PostgreSQL 버전마다 달라 신뢰 불가
      if (isQueryFailedError(err) && err.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Email already registered');
      }
      throw err;
    }

    return this.buildAuthResult(user);
  }

  // login(email, password) — 사용자 조회 → bcrypt.compare 검증 → AuthResult 조립. 미존재·불일치 모두 동일 401로 응답해 enumeration 차단
  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // bcrypt.compare(평문, DB 해시) — 평문을 DB 해시의 salt·rounds로 다시 해시해 비교. 디코드가 아니라 재해시 후 매칭
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResult(user);
  }

  // refresh(rawRefresh) — refresh 회전(기존 폐기 + 새 raw 발급) → 사용자 재조회 → 새 access JWT 서명 → AuthResult 조립
  async refresh(rawRefresh: string): Promise<AuthResult> {
    const issued = await this.refreshTokenService.rotate(rawRefresh);
    const user = await this.usersService.findById(issued.userId);
    // refresh는 유효한데 사용자가 사라진 경우(관리자가 계정 삭제 등) — refresh도 같이 무효화돼야 하지만 회전이 이미 끝나서 이 시점엔 404로 보고
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

  // logout(rawRefresh) — DB의 refresh row revokedAt 세팅. 이미 폐기/미존재여도 throw 없음(멱등)
  async logout(rawRefresh: string): Promise<void> {
    await this.refreshTokenService.revoke(rawRefresh);
  }

  // me(userId) — 가드가 검증한 userId로 DB 조회 → PublicUser 반환. 사용자가 사라졌으면 401(가드 시점엔 살아있었지만 그 사이 삭제 가능)
  async me(userId: string): Promise<PublicUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return toPublicUser(user);
  }

  // signAccessToken(userId) — sub 클레임에 userId를 넣고 access 시크릿·TTL로 서명. 반환은 base64url로 인코딩된 JWT 문자열
  private signAccessToken(userId: string): string {
    // ms 라이브러리의 StringValue 타입(JwtSignOptions['expiresIn'])이 require — '15m' 같은 string literal과 number 둘 다 허용해 단언으로 통과
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

  // buildAuthResult(user) — signup·login 공통 후처리. access JWT + refresh 행 발급 후 AuthResult로 묶는다
  private async buildAuthResult(user: User): Promise<AuthResult> {
    const accessToken = this.signAccessToken(user.id);
    const accessExpiresAt = decodeExpiresAt(accessToken);
    // refresh 발급은 DB 쓰기 — 이 줄 이후엔 refresh_tokens 테이블에 새 row가 INSERT됨
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

// JWT의 두 번째 세그먼트(payload) base64url 디코드 → exp 클레임(초) → epoch ms로 변환. 프론트가 만료 임박 시점 계산에 사용
function decodeExpiresAt(token: string): number {
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
  ) as { exp: number };
  // JWT 표준은 exp가 초 단위 — JS Date/Date.now()와 맞추려고 1000 곱함
  return payload.exp * 1000;
}

// TypeORM QueryFailedError 타입 가드 — TypeORM이 정식 타입을 export하지 않아 code 프로퍼티 존재 여부로만 좁힘
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
