// GET /wishlist 응답 한 건 형태 — 엔티티의 snapshot* 컬럼을 프론트 친화적 camelCase 필드명으로 노출, createdAt은 ISO 8601 문자열로 직렬화
import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemDto {
  @ApiProperty({ description: '위시리스트 항목 UUID' })
  id!: string;

  @ApiProperty({ description: '관광지 contentId' })
  contentId!: string;

  // 엔티티 snapshotTitle → 응답 title — 'snapshot' 접두사 노출 회피, 클라가 외부 데이터인지 의식 안 해도 되게
  @ApiProperty({ description: '관광지명 (추가 시점 스냅샷)' })
  title!: string;

  // 엔티티 snapshotFirstImage → 응답 firstImage — 이미지 없는 관광지는 null로 통일
  @ApiProperty({ description: '대표 이미지 URL (없으면 null)', nullable: true })
  firstImage!: string | null;

  // 엔티티 snapshotAddr → 응답 addr
  @ApiProperty({ description: '주소 스냅샷 (없으면 null)', nullable: true })
  addr!: string | null;

  // Date → ISO 8601 문자열로 직렬화 — JSON에 담을 때 Date 객체는 문자열 변환되므로 명시적으로 toISOString() 통과시킴
  @ApiProperty({ description: '위시리스트 추가 시각 (ISO 8601)' })
  createdAt!: string;
}
