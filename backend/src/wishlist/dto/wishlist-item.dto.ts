import { ApiProperty } from '@nestjs/swagger';

// 위시리스트 응답 DTO — 엔티티 컬럼명(snapshot*)을 프론트 친화적 camelCase로 매핑
export class WishlistItemDto {
  @ApiProperty({ description: '위시리스트 항목 UUID' })
  id!: string;

  @ApiProperty({ description: '관광지 contentId' })
  contentId!: string;

  // snapshotTitle → title 매핑 — 응답에서 "snapshot" 접두사 제거
  @ApiProperty({ description: '관광지명 (추가 시점 스냅샷)' })
  title!: string;

  // snapshotFirstImage → firstImage 매핑 — 이미지 없는 관광지는 null
  @ApiProperty({ description: '대표 이미지 URL (없으면 null)', nullable: true })
  firstImage!: string | null;

  // snapshotAddr → addr 매핑 — 주소 없는 관광지는 null
  @ApiProperty({ description: '주소 스냅샷 (없으면 null)', nullable: true })
  addr!: string | null;

  // ISO 8601 문자열 — 클라이언트에서 Date 객체 없이 파싱 가능
  @ApiProperty({ description: '위시리스트 추가 시각 (ISO 8601)' })
  createdAt!: string;
}
