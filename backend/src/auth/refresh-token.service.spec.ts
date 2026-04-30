import * as crypto from 'crypto';

import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

// sha-256 hex — 실제 서비스와 동일한 함수로 테스트 내 hash 계산
function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// 미래 날짜 헬퍼 — 유효한 토큰 expiresAt 생성용
function futureDate(daysFromNow = 7): Date {
  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
}

// 과거 날짜 헬퍼 — 만료 시나리오용
function pastDate(): Date {
  return new Date(Date.now() - 1000);
}

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  // Repository<RefreshToken> mock — DB 호출을 인메모리로 대체
  const mockRtRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  // QueryBuilder 체인 mock — update().set().where().returning().execute() 패턴
  const mockQb = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  // ConfigService mock — JWT_REFRESH_TTL 반환
  const mockCs = { get: jest.fn().mockReturnValue('7d') };

  beforeEach(async () => {
    jest.clearAllMocks();
    // QueryBuilder 체인 매번 동일 객체 반환
    mockRtRepo.createQueryBuilder.mockReturnValue(mockQb);
    mockQb.update.mockReturnThis();
    mockQb.set.mockReturnThis();
    mockQb.where.mockReturnThis();
    mockQb.returning.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: getRepositoryToken(RefreshToken), useValue: mockRtRepo },
        { provide: ConfigService, useValue: mockCs },
      ],
    }).compile();

    service = module.get(RefreshTokenService);
  });

  // ─── issue ───────────────────────────────────────────────────────────────

  describe('issue', () => {
    it('새 familyId 없이 호출 시 랜덤 UUID family를 생성하고 row를 저장한다', async () => {
      const fakeEntity = { id: 'id1' };
      mockRtRepo.create.mockReturnValue(fakeEntity);
      mockRtRepo.save.mockResolvedValue(fakeEntity);

      const result = await service.issue('user-1');

      // raw는 base64url 형태여야 한다
      expect(result.raw).toBeTruthy();
      expect(result.userId).toBe('user-1');
      expect(result.familyId).toBeTruthy();
      expect(mockRtRepo.save).toHaveBeenCalledTimes(1);
    });

    it('familyId 를 전달하면 그대로 사용한다', async () => {
      mockRtRepo.create.mockReturnValue({});
      mockRtRepo.save.mockResolvedValue({});

      const result = await service.issue('user-1', 'family-abc');
      expect(result.familyId).toBe('family-abc');
    });
  });

  // ─── rotate ──────────────────────────────────────────────────────────────

  describe('rotate', () => {
    it('유효한 토큰 — atomic UPDATE 1행 → 새 토큰 발급', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      const hash = hashToken(raw);
      const fakeRow: Partial<RefreshToken> = {
        userId: 'user-1',
        familyId: 'fam-1',
        tokenHash: hash,
        expiresAt: futureDate(),
        revokedAt: null,
      };

      // atomic UPDATE 성공 — 1행 반환
      mockQb.execute.mockResolvedValueOnce({ affected: 1, raw: [fakeRow] });
      // issue 내부 save 호출
      mockRtRepo.create.mockReturnValue({});
      mockRtRepo.save.mockResolvedValue({});

      const result = await service.rotate(raw);

      // 새 raw가 발급됐으며 userId가 보존됐다
      expect(result.raw).not.toBe(raw);
      expect(result.userId).toBe('user-1');
      expect(result.familyId).toBe('fam-1'); // 같은 family 유지
    });

    it('이미 revoked 된 hash — 재사용 감지: family 전체 폐기 + 401', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      const hash = hashToken(raw);
      const existingRow: Partial<RefreshToken> = {
        tokenHash: hash,
        familyId: 'fam-reuse',
        revokedAt: new Date(), // 이미 폐기됨
      };

      // 첫 번째 execute: atomic UPDATE 0행 (이미 revoked)
      mockQb.execute
        .mockResolvedValueOnce({ affected: 0, raw: [] }) // rotate UPDATE
        .mockResolvedValueOnce({ affected: 2, raw: [] }); // family 일괄 폐기

      // findOne: 이미 revoked 된 행 발견
      mockRtRepo.findOne.mockResolvedValue(existingRow);

      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
      // family 일괄 폐기 쿼리가 실행됐는지 확인 — execute 2회 호출
      expect(mockQb.execute).toHaveBeenCalledTimes(2);
    });

    it('존재하지 않는 hash — 401', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');

      mockQb.execute.mockResolvedValueOnce({ affected: 0, raw: [] });
      // findOne: 미존재
      mockRtRepo.findOne.mockResolvedValue(null);

      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });

    it('expiresAt 이 과거 — 만료 토큰 → 401', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      const hash = hashToken(raw);
      const expiredRow: Partial<RefreshToken> = {
        userId: 'user-1',
        familyId: 'fam-1',
        tokenHash: hash,
        expiresAt: pastDate(), // 이미 만료
        revokedAt: null,
      };

      // atomic UPDATE 1행 성공 — 그러나 expiresAt이 과거
      mockQb.execute.mockResolvedValueOnce({ affected: 1, raw: [expiredRow] });

      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });

    it('family 격리 — family A 폐기가 family B 토큰에 영향 없음', async () => {
      // family A 재사용 감지 시나리오: family A 토큰만 폐기
      const rawA = crypto.randomBytes(32).toString('base64url');
      const hashA = hashToken(rawA);
      const existingA: Partial<RefreshToken> = {
        tokenHash: hashA,
        familyId: 'fam-A',
        revokedAt: new Date(),
      };

      mockQb.execute
        .mockResolvedValueOnce({ affected: 0, raw: [] }) // family A atomic UPDATE
        .mockResolvedValueOnce({ affected: 1, raw: [] }); // family A 일괄 폐기

      mockRtRepo.findOne.mockResolvedValue(existingA);

      // family A 재사용 감지로 폐기 — where 절에 fam-A 가 포함돼야 한다
      await expect(service.rotate(rawA)).rejects.toThrow(UnauthorizedException);

      // where 호출 인자에서 familyId 가 fam-A 인지 확인 — fam-B 는 건드리지 않았다
      const whereCall = mockQb.where.mock.calls.find(
        (args: unknown[]) =>
          typeof args[1] === 'object' &&
          args[1] !== null &&
          (args[1] as Record<string, unknown>)['familyId'] === 'fam-A'
      );
      expect(whereCall).toBeDefined();
    });
  });

  // ─── revoke ──────────────────────────────────────────────────────────────

  describe('revoke', () => {
    it('유효한 토큰 — 해당 행만 revokedAt 세팅, 예외 없음', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      mockQb.execute.mockResolvedValueOnce({ affected: 1, raw: [] });

      await expect(service.revoke(raw)).resolves.toBeUndefined();
      // execute 1회만 — family 전체 폐기 X
      expect(mockQb.execute).toHaveBeenCalledTimes(1);
    });

    it('이미 폐기된 토큰 — 멱등 처리, 예외 없음', async () => {
      const raw = crypto.randomBytes(32).toString('base64url');
      // 0행(이미 폐기) 이어도 에러 없음
      mockQb.execute.mockResolvedValueOnce({ affected: 0, raw: [] });

      await expect(service.revoke(raw)).resolves.toBeUndefined();
    });
  });
});
