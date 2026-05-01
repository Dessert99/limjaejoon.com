import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistItemDto } from './dto/wishlist-item.dto';
import { Wishlist } from './entities/wishlist.entity';

// 위시리스트 도메인 service — userId를 첫 인자로 강제해 IDOR 차단 (ADR 0003)
@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repo: Repository<Wishlist>
  ) {}

  // 본인 위시리스트 전체 조회 — createdAt 내림차순 (최근 추가 먼저)
  async list(userId: string): Promise<WishlistItemDto[]> {
    // WHERE 조건에 반드시 userId 포함 — 타인 데이터 노출 차단
    const rows = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return rows.map((r) => this.toDto(r));
  }

  // 위시리스트 추가 — UNIQUE(userId, contentId) 위반 시 409로 변환
  async add(userId: string, dto: CreateWishlistDto): Promise<WishlistItemDto> {
    try {
      // create로 엔티티 인스턴스 만들고 save로 INSERT — userId는 인증 컨텍스트에서만 주입
      const saved = await this.repo.save(
        this.repo.create({
          userId,
          contentId: dto.contentId,
          snapshotTitle: dto.title,
          snapshotFirstImage: dto.firstImage ?? null,
          snapshotAddr: dto.addr ?? null,
        })
      );
      return this.toDto(saved);
    } catch (err) {
      // PG unique_violation 코드 — (userId, contentId) UNIQUE 위반은 정상적인 사용자 흐름으로 처리
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('이미 위시리스트에 있습니다');
      }
      // 그 외 에러는 변환 없이 상위로 전파 — 예상치 못한 DB 에러 가시성 유지
      throw err;
    }
  }

  // 위시리스트 항목 삭제 — 본인 소유가 아니면 affected=0, 그 경우 ID 존재 정보 누설 방지 위해 404로 통일
  async remove(userId: string, id: string): Promise<void> {
    // delete 조건에 반드시 userId 포함 — id만으로는 타인 항목 삭제 가능 (IDOR)
    const result = await this.repo.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('위시리스트 항목을 찾을 수 없습니다');
    }
  }

  // 엔티티(snapshot* 컬럼) → 응답 DTO(camelCase) 매핑 — service 내부 private mapper로 한 곳에 집중
  private toDto(row: Wishlist): WishlistItemDto {
    return {
      id: row.id,
      contentId: row.contentId,
      title: row.snapshotTitle,
      firstImage: row.snapshotFirstImage ?? null,
      addr: row.snapshotAddr ?? null,
      // ISO 8601 문자열 — 클라이언트가 Date 직렬화 형식에 의존하지 않게 명시적으로 변환
      createdAt: row.createdAt.toISOString(),
    };
  }
}
