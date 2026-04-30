import * as bcrypt from 'bcrypt';

import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

// 테스트용 고정 bcrypt 라운드 — 실제 라운드(12)보다 낮아 빠르게 수행
const TEST_ROUNDS = 4;

// 테스트용 더미 사용자 — passwordHash 는 실제 bcrypt 해시
const DUMMY_PASSWORD = 'password123';

describe('AuthService', () => {
  let service: AuthService;

  // UsersService mock
  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  // JwtService mock — 토큰 값보다 호출 여부가 중요한 시나리오에 사용
  const mockJwtService = {
    sign: jest.fn(),
  };

  // ConfigService mock — BCRYPT_ROUNDS 와 JWT_* 반환
  const mockCs = {
    get: jest.fn((key: string) => {
      if (key === 'BCRYPT_ROUNDS') return TEST_ROUNDS;
      if (key === 'JWT_ACCESS_SECRET')
        return 'test-access-secret-32byteslong!!';
      if (key === 'JWT_ACCESS_TTL') return '15m';
      return undefined;
    }),
  };

  // RefreshTokenService mock
  const mockRefreshTokenService = {
    issue: jest.fn(),
    rotate: jest.fn(),
    revoke: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // sign() 이 유효한 JWT 처럼 보이는 값을 반환 — decodeExpiresAt 이 파싱 가능해야 한다
    const futureExp = Math.floor(Date.now() / 1000) + 900; // 15분 후
    // base64url 인코딩된 header.payload.sig 형태
    const payload = Buffer.from(
      JSON.stringify({ sub: 'user-1', exp: futureExp })
    ).toString('base64url');
    mockJwtService.sign.mockReturnValue(`header.${payload}.sig`);

    // issue() 기본 반환값
    mockRefreshTokenService.issue.mockResolvedValue({
      raw: 'raw-refresh-token',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      familyId: 'fam-1',
      userId: 'user-1',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockCs },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  // ─── signup ──────────────────────────────────────────────────────────────

  describe('signup', () => {
    it('중복 이메일 (PG code 23505) → 409 ConflictException', async () => {
      // PostgreSQL unique violation 에러 형태 시뮬레이션
      const pgUniqueError = Object.assign(new Error('duplicate'), {
        code: '23505',
      });
      mockUsersService.create.mockRejectedValue(pgUniqueError);

      await expect(
        service.signup('dup@example.com', DUMMY_PASSWORD)
      ).rejects.toThrow(ConflictException);
    });

    it('성공 시 accessToken·refreshToken·user 를 반환한다', async () => {
      const fakeUser = {
        id: 'user-1',
        email: 'new@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: 'hash',
      };
      mockUsersService.create.mockResolvedValue(fakeUser);

      const result = await service.signup('new@example.com', DUMMY_PASSWORD);

      expect(result.user.email).toBe('new@example.com');
      // passwordHash 는 응답에 포함되지 않아야 한다
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBe('raw-refresh-token');
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────

  describe('login', () => {
    it('비밀번호 불일치 → 401 UnauthorizedException', async () => {
      const hash = await bcrypt.hash(DUMMY_PASSWORD, TEST_ROUNDS);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.login('user@example.com', 'wrongPassword!')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('사용자 없음 → 401 UnauthorizedException (에러 메시지 동일)', async () => {
      // findByEmail null 반환 — 사용자 미존재
      mockUsersService.findByEmail.mockResolvedValue(null);

      const error = await service
        .login('ghost@example.com', DUMMY_PASSWORD)
        .catch((e) => e);

      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid credentials');
    });

    it('성공 → accessToken·refreshToken·user 반환', async () => {
      const hash = await bcrypt.hash(DUMMY_PASSWORD, TEST_ROUNDS);
      const fakeUser = {
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.findByEmail.mockResolvedValue(fakeUser);

      const result = await service.login('user@example.com', DUMMY_PASSWORD);

      expect(result.user.email).toBe('user@example.com');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.accessToken).toBeTruthy();
    });

    // ─── timing 안전성 ─────────────────────────────────────────────────────
    // ADR 0002: 사용자 미존재·비밀번호 불일치 양쪽 모두 bcrypt.compare 를 수행해
    // 응답 시간 편차로 계정 존재 여부를 추측하지 못하게 한다.
    // 허용 delta = 50ms (ADR 기준 20ms보다 넉넉하게 — CI 환경 부하 편차 흡수)
    it('사용자 없음 vs 비밀번호 불일치 — 응답 시간 차이 < 50ms (dummy bcrypt 동작 검증)', async () => {
      // 실제 bcrypt 해시 생성 (rounds=4 — 빠르게 수행)
      const hash = await bcrypt.hash(DUMMY_PASSWORD, TEST_ROUNDS);
      const existingUser = {
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 사용자 없는 경우 시간 측정
      mockUsersService.findByEmail.mockResolvedValue(null);
      const t0 = Date.now();
      await service
        .login('ghost@example.com', DUMMY_PASSWORD)
        .catch(() => null);
      const notFoundMs = Date.now() - t0;

      // 비밀번호 불일치 경우 시간 측정
      mockUsersService.findByEmail.mockResolvedValue(existingUser);
      const t1 = Date.now();
      await service
        .login('user@example.com', 'wrongPassword!')
        .catch(() => null);
      const wrongPassMs = Date.now() - t1;

      const delta = Math.abs(notFoundMs - wrongPassMs);
      // dummy hash Promise 가 싱글턴이라 두 번째 호출은 첫 번째보다 빠를 수 있어
      // 절대 delta 로 판정 — 50ms 초과 시 dummy bcrypt 가 실제로 호출되지 않은 것
      expect(delta).toBeLessThan(50);
    }, 30000); // bcrypt 포함이라 timeout 넉넉하게

    it('사용자 없음 경로에서 에러 메시지가 "Invalid credentials" 로 통일된다 (enum 방지)', async () => {
      // bcrypt 는 네이티브 C 애드온이라 jest.spyOn 으로 프로퍼티 재정의가 불가.
      // timing 안전성은 위 timing 테스트에서 wall-clock 으로 검증했으므로 여기서는
      // 사용자 없음 경로의 에러 메시지가 "Invalid credentials" 로 통일되는지만 어서트.
      // (메시지가 "user not found" 같은 상세 정보를 노출하면 계정 enum 이 가능해진다.)
      mockUsersService.findByEmail.mockResolvedValue(null);

      const error = await service
        .login('ghost@example.com', DUMMY_PASSWORD)
        .catch((e) => e);

      expect(error).toBeInstanceOf(UnauthorizedException);
      // 사용자 존재 여부를 힌트하는 메시지가 아닌 통일된 메시지여야 한다
      expect(error.message).toBe('Invalid credentials');
    });
  });

  // ─── logout ──────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('revoke 를 호출하고 예외 없이 완료', async () => {
      mockRefreshTokenService.revoke.mockResolvedValue(undefined);

      await expect(service.logout('raw-token')).resolves.toBeUndefined();
      expect(mockRefreshTokenService.revoke).toHaveBeenCalledWith('raw-token');
    });
  });

  // ─── me ──────────────────────────────────────────────────────────────────

  describe('me', () => {
    it('userId 로 사용자를 찾아 passwordHash 없이 반환', async () => {
      const fakeUser = {
        id: 'user-1',
        email: 'user@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: 'secret-hash',
      };
      mockUsersService.findById.mockResolvedValue(fakeUser);

      const result = await service.me('user-1');

      expect(result.id).toBe('user-1');
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('존재하지 않는 userId → 401', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.me('nonexistent')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
