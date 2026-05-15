// 위시리스트 비즈니스 로직 — 모든 메서드가 userId를 첫 인자로 받아 WHERE 조건에 강제 포함, IDOR(타인 데이터 접근/삭제)을 서비스 레벨에서 차단
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

@Injectable()
export class WishlistService {
  // @InjectRepository(Wishlist) — WishlistModule.forFeature가 만든 Repository<Wishlist>를 컨테이너에서 주입
  constructor(
    @InjectRepository(Wishlist)
    private readonly repo: Repository<Wishlist>
  ) {}

  // list(userId) — 본인 행만 조회 → DTO 배열로 변환. createdAt DESC로 최근 추가 항목이 먼저
  async list(userId: string): Promise<WishlistItemDto[]> {
    // WHERE 조건에 userId 강제 포함 — 빠뜨리면 모든 사용자 데이터 노출
    const rows = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    // Wishlist[](스냅샷 컬럼) → WishlistItemDto[](프론트 친화 형태) 매핑
    return rows.map((r) => this.toDto(r));
  }

  // add(userId, dto) — 외부 관광 정보를 스냅샷으로 INSERT. (userId, contentId) UNIQUE 위반 시 409로 변환
  async add(userId: string, dto: CreateWishlistDto): Promise<WishlistItemDto> {
    try {
      // userId는 인증 컨텍스트에서만 주입 — dto에 userId 받지 않음으로써 임의 사용자 명의 추가 차단
      const saved = await this.repo.save(
        this.repo.create({
          userId,
          contentId: dto.contentId,
          // 외부 데이터가 변해도(이미지 교체, 이름 변경 등) 추가 시점 정보를 그대로 보여주려고 컬럼에 평탄화 저장
          snapshotTitle: dto.title,
          snapshotFirstImage: dto.firstImage ?? null,
          snapshotAddr: dto.addr ?? null,
        })
      );
      return this.toDto(saved);
    } catch (err) {
      // SQLSTATE 23505 = unique 제약 위반. (userId, contentId) UNIQUE는 정상적인 사용자 흐름(중복 추가 시도)
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('이미 위시리스트에 있습니다');
      }
      // 그 외 DB 에러는 변환 없이 상위로 전파 — 예상치 못한 실패는 가시성 유지
      throw err;
    }
  }

  // remove(userId, id) — 본인 소유 행만 DELETE. affected=0이면 미존재든 권한 없음이든 동일하게 404로 통일
  async remove(userId: string, id: string): Promise<void> {
    // delete 조건에도 userId 강제 — id만으로 WHERE 걸면 타인 행 삭제 가능
    const result = await this.repo.delete({ id, userId });
    // affected가 0이라는 것은 (id, userId) 조건에 맞는 행 부재 — "권한 없음"과 "미존재"를 구분해서 응답하면 ID 존재 여부 누설
    if (result.affected === 0) {
      throw new NotFoundException('위시리스트 항목을 찾을 수 없습니다');
    }
  }

  // toDto(row) — Wishlist(snapshot* 컬럼) → WishlistItemDto(camelCase). 한 곳에서 매핑해 컬럼명 변경 영향을 최소화
  private toDto(row: Wishlist): WishlistItemDto {
    return {
      id: row.id,
      contentId: row.contentId,
      title: row.snapshotTitle,
      firstImage: row.snapshotFirstImage ?? null,
      addr: row.snapshotAddr ?? null,
      // Date → ISO 8601 문자열. 클라이언트가 자신의 타임존으로 파싱하기 쉽게 표준화
      createdAt: row.createdAt.toISOString(),
    };
  }
}
