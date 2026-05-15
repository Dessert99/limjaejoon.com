import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Wishlist } from './entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

// Repository mock — TypeORM 실제 DB 연결 없이 서비스 로직만 격리 검증
const mockRepo = {
  find: jest.fn(),
  create: jest.fn((x) => x), // create는 넘긴 객체를 그대로 반환 (엔티티 인스턴스화 모방)
  save: jest.fn(),
  delete: jest.fn(),
};

// 테스트용 엔티티 픽스처 — 실제 DB 없이 반환 값 시뮬레이션
const makeEntity = (overrides: Partial<Wishlist> = {}): Wishlist =>
  ({
    id: 'uuid-1',
    userId: 'user-1',
    contentId: '125508',
    snapshotTitle: '경복궁',
    snapshotFirstImage: 'https://img.example.com/photo.jpg',
    snapshotAddr: '서울특별시 종로구 사직로 161',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  }) as Wishlist;

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(async () => {
    jest.clearAllMocks(); // 각 테스트 전 mock 상태 초기화 — 순서 의존 방지

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        // TypeORM Repository를 mock으로 교체 — getRepositoryToken은 DI 토큰 반환
        { provide: getRepositoryToken(Wishlist), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(WishlistService);
  });

  // ─── list ─────────────────────────────────────────────────────────────────

  describe('list', () => {
    it('repo.find를 userId + createdAt DESC 조건으로 호출하고 DTO 배열을 반환한다', async () => {
      // repo.find가 엔티티 배열을 반환하도록 설정
      mockRepo.find.mockResolvedValue([makeEntity()]);

      const result = await service.list('user-1');

      // IDOR 핵심: find의 where에 반드시 userId가 포함되어야 한다
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' },
      });

      // 엔티티 필드가 응답 DTO로 올바르게 매핑되었는지 검증
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'uuid-1',
        contentId: '125508',
        title: '경복궁',
        firstImage: 'https://img.example.com/photo.jpg',
        addr: '서울특별시 종로구 사직로 161',
        createdAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('위시리스트가 비어있으면 빈 배열을 반환한다', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.list('user-1');

      expect(result).toEqual([]);
    });
  });

  // ─── add ──────────────────────────────────────────────────────────────────

  describe('add', () => {
    const dto: CreateWishlistDto = {
      contentId: '125508',
      title: '경복궁',
      firstImage: 'https://img.example.com/photo.jpg',
      addr: '서울특별시 종로구 사직로 161',
    };

    it('정상 추가 — repo.save를 userId 포함 객체로 호출하고 DTO를 반환한다', async () => {
      const savedEntity = makeEntity();
      mockRepo.save.mockResolvedValue(savedEntity);

      const result = await service.add('user-1', dto);

      // create에 넘긴 객체에 userId가 반드시 포함되어야 한다 (IDOR 방어)
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', contentId: '125508' })
      );
      // 반환 DTO 필드 검증
      expect(result.id).toBe('uuid-1');
      expect(result.title).toBe('경복궁');
    });

    it('repo.save가 PG 23505(unique violation) 에러를 던지면 ConflictException(409)으로 변환한다', async () => {
      // PostgreSQL unique_violation 에러 시뮬레이션 — (userId, contentId) 중복 시 발생
      const pgUniqueError = Object.assign(new Error('duplicate key'), {
        code: '23505',
      });
      mockRepo.save.mockRejectedValue(pgUniqueError);

      await expect(service.add('user-1', dto)).rejects.toThrow(
        ConflictException
      );
    });

    it('repo.save가 다른 에러를 던지면 그대로 전파한다', async () => {
      // DB 연결 실패 등 예기치 않은 에러 — 변환 없이 상위로 버블링
      const unknownError = new Error('connection reset');
      mockRepo.save.mockRejectedValue(unknownError);

      await expect(service.add('user-1', dto)).rejects.toThrow(
        'connection reset'
      );
    });
  });

  // ─── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('repo.delete를 { id, userId } 조건으로 호출한다 — IDOR 차단 회귀 방지', async () => {
      // affected=1 → 정상 삭제
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      await service.remove('user-1', 'uuid-1');

      // 핵심 검증: id만으로 삭제하면 타인 항목 삭제 가능 (IDOR) — userId 반드시 포함
      expect(mockRepo.delete).toHaveBeenCalledWith({
        id: 'uuid-1',
        userId: 'user-1',
      });
    });

    it('affected=0이면 NotFoundException(404)을 던진다', async () => {
      // 본인 소유가 아니거나 존재하지 않는 경우 — ID 존재 여부 노출 방지 목적으로 동일 404 반환
      mockRepo.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('user-1', 'uuid-999')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
