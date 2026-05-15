// 검색 결과 한 건의 응답 형태 — 외부 한글 필드(contentid, firstimage 등)를 영문 camelCase로 ACL 변환한 결과, 좌표는 string→number로 정규화
import { ApiProperty } from '@nestjs/swagger';

export class TourItemDto {
  @ApiProperty({ description: '관광지 고유 ID (외부 contentid)' })
  contentId!: string;

  @ApiProperty({ description: '관광지명 (외부 title)' })
  title!: string;

  @ApiProperty({
    description: '대표 이미지 URL (외부 firstimage, 없으면 null)',
    nullable: true,
  })
  firstImage!: string | null;

  @ApiProperty({
    description: '주소 (외부 addr1, 없으면 null)',
    nullable: true,
  })
  addr!: string | null;

  @ApiProperty({
    description: '경도 (외부 mapx, string→number 변환, 없으면 null)',
    nullable: true,
  })
  mapX!: number | null;

  @ApiProperty({
    description: '위도 (외부 mapy, string→number 변환, 없으면 null)',
    nullable: true,
  })
  mapY!: number | null;
}
