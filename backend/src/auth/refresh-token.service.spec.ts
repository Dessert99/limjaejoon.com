import * as crypto from 'crypto';

import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

// 실제 서비스와 동일한 sha-256 해시 — 테스트에서 토큰 hash 생성
function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function futureDate(daysFromNow = 1): Date {
  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
}

function pastDate(): Date {
  return new Date(Date.now() - 1000);
}

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  const mockRtRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCs = { get: jest.fn().mockReturnValue('1d') };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: getRepositoryToken(RefreshToken), useValue: mockRtRepo },
        { provide: ConfigService, useValue: mockCs },
      ],
    }).compile();

    service = module.get(RefreshTokenService);
  });

  describe('issue', () => {
    it('새 토큰을 생성하고 DB에 저장한다', async () => {
      mockRtRepo.create.mockReturnValue({});
      mockRtRepo.save.mockResolvedValue({});

      const result = await service.issue('user-1');

      expect(result.raw).toBeTruthy();
      expect(result.userId).toBe('user-1');
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mockRtRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('rotate', () => {
    it('유효한 토큰 — 기존 행 폐기 후 새 토큰 발급', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      const row: Partial<RefreshToken> = {
        userId: 'user-1',
        tokenHash: hashToken(raw),
        expiresAt: futureDate(),
        revokedAt: null,
      };

      mockRtRepo.findOne.mockResolvedValueOnce(row);
      mockRtRepo.save.mockResolvedValue({}); // 기존 행 revoke + 새 행 발급
      mockRtRepo.create.mockReturnValue({});

      const result = await service.rotate(raw);

      expect(result.raw).not.toBe(raw);
      expect(result.userId).toBe('user-1');
      // save 가 2번 호출 — 1번은 revoke, 1번은 새 토큰 발급
      expect(mockRtRepo.save).toHaveBeenCalledTimes(2);
      expect(row.revokedAt).toBeInstanceOf(Date);
    });

    it('이미 폐기된 토큰 — 401', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      mockRtRepo.findOne.mockResolvedValueOnce({
        tokenHash: hashToken(raw),
        revokedAt: new Date(),
        expiresAt: futureDate(),
      });

      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });

    it('존재하지 않는 토큰 — 401', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce(null);

      await expect(
        service.rotate(crypto.randomBytes(32).toString('base64url'))
      ).rejects.toThrow(UnauthorizedException);
    });

    it('만료된 토큰 — 401', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      mockRtRepo.findOne.mockResolvedValueOnce({
        tokenHash: hashToken(raw),
        revokedAt: null,
        expiresAt: pastDate(),
      });

      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('revoke', () => {
    it('유효한 토큰 — revokedAt 세팅', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      const row: Partial<RefreshToken> = {
        tokenHash: hashToken(raw),
        revokedAt: null,
      };

      mockRtRepo.findOne.mockResolvedValueOnce(row);
      mockRtRepo.save.mockResolvedValue({});

      await service.revoke(raw);
      expect(row.revokedAt).toBeInstanceOf(Date);
      expect(mockRtRepo.save).toHaveBeenCalledTimes(1);
    });

    it('이미 폐기된 토큰 — save 호출 없음(멱등)', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      mockRtRepo.findOne.mockResolvedValueOnce({
        tokenHash: hashToken(raw),
        revokedAt: new Date(),
      });

      await expect(service.revoke(raw)).resolves.toBeUndefined();
      expect(mockRtRepo.save).not.toHaveBeenCalled();
    });

    it('존재하지 않는 토큰 — 예외 없이 통과', async () => {
      mockRtRepo.findOne.mockResolvedValueOnce(null);

      await expect(
        service.revoke(crypto.randomBytes(32).toString('base64url'))
      ).resolves.toBeUndefined();
    });
  });
});
