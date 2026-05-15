// RefreshTokenService 스펙 — JWT 서명은 JwtService mock으로 대체, DB는 Repository mock으로 대체. assertActive/rotate/revoke 동작을 jti 기반으로 검증
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

function futureDate(daysFromNow = 1): Date {
  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
}

function pastDate(): Date {
  return new Date(Date.now() - 1000);
}

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  // Repository mock — DB 호출 인메모리 대체
  const mockRtRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  // ConfigService mock — TTL '1d' + 시크릿 더미값
  const mockCs = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_REFRESH_TTL') return '1d';
      return undefined;
    }),
    getOrThrow: jest.fn((key: string) => {
      if (key === 'JWT_REFRESH_SECRET')
        return 'test-refresh-secret-32bytes!!!!';
      throw new Error(`unexpected key ${key}`);
    }),
  };

  // JwtService mock — sign 호출 시 가짜 JWT 문자열 반환, 실제 서명 검증은 strategy 테스트가 별도로 다룸
  const mockJwt = {
    sign: jest.fn().mockReturnValue('signed.jwt.string'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: getRepositoryToken(RefreshToken), useValue: mockRtRepo },
        { provide: ConfigService, useValue: mockCs },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get(RefreshTokenService);
  });

  describe('issue', () => {
    it('jti 생성 + DB 저장 + JWT 서명을 거쳐 raw·jti·expiresAt을 반환', async () => {
      mockRtRepo.create.mockReturnValue({});
      mockRtRepo.save.mockResolvedValue({});

      const result = await service.issue('user-1');

      expect(result.raw).toBe('signed.jwt.string');
      expect(result.userId).toBe('user-1');
      expect(result.jti).toMatch(/^[0-9a-f-]{36}$/i); // UUID 형태
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mockRtRepo.save).toHaveBeenCalledTimes(1);
      // sign 인자에 sub와 jti가 모두 들어가야 함
      expect(mockJwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 'user-1', jti: result.jti }),
        expect.objectContaining({
          secret: 'test-refresh-secret-32bytes!!!!',
        })
      );
    });
  });

  describe('assertActive', () => {
    it('활성 jti — 통과', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce({
        revokedAt: null,
        expiresAt: futureDate(),
      });

      await expect(service.assertActive('jti-1')).resolves.toBeUndefined();
    });

    it('미존재 jti — 401', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.assertActive('jti-x')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('이미 폐기된 jti — 401', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce({
        revokedAt: new Date(),
        expiresAt: futureDate(),
      });

      await expect(service.assertActive('jti-revoked')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('만료된 jti — 401', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce({
        revokedAt: null,
        expiresAt: pastDate(),
      });

      await expect(service.assertActive('jti-expired')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('rotate', () => {
    it('유효한 jti — 기존 행 폐기 + 새 jti 발급', async () => {
      const row: Partial<RefreshToken> = {
        userId: 'user-1',
        jti: 'old-jti',
        expiresAt: futureDate(),
        revokedAt: null,
      };

      mockRtRepo.findOne.mockResolvedValueOnce(row);
      mockRtRepo.save.mockResolvedValue({});
      mockRtRepo.create.mockReturnValue({});

      const result = await service.rotate('old-jti', 'user-1');

      expect(result.jti).not.toBe('old-jti');
      expect(result.userId).toBe('user-1');
      // save 2번 — 기존 revoke + 새 행 INSERT
      expect(mockRtRepo.save).toHaveBeenCalledTimes(2);
      expect(row.revokedAt).toBeInstanceOf(Date);
    });

    it('이미 폐기된 jti — 401(race 방어)', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce({
        userId: 'user-1',
        revokedAt: new Date(),
      });

      await expect(service.rotate('jti-x', 'user-1')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('revoke', () => {
    it('활성 jti — revokedAt 세팅', async () => {
      const row: Partial<RefreshToken> = {
        jti: 'jti-1',
        revokedAt: null,
      };

      mockRtRepo.findOne.mockResolvedValueOnce(row);
      mockRtRepo.save.mockResolvedValue({});

      await service.revoke('jti-1');
      expect(row.revokedAt).toBeInstanceOf(Date);
      expect(mockRtRepo.save).toHaveBeenCalledTimes(1);
    });

    it('이미 폐기된 jti — save 호출 없음', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce({
        jti: 'jti-1',
        revokedAt: new Date(),
      });

      await expect(service.revoke('jti-1')).resolves.toBeUndefined();
      expect(mockRtRepo.save).not.toHaveBeenCalled();
    });

    it('미존재 jti — 예외 없이 통과', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.revoke('jti-x')).resolves.toBeUndefined();
    });
  });
});
