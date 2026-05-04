// /tour/:contentId/common, /intro 응답 형태 — 외부 KorService2의 한글 필드를 영문 camelCase로 ACL 변환한 결과
import { ApiProperty } from '@nestjs/swagger';

// detailCommon2 응답 정규화 — HTML 태그 포함 필드(overview, homepage)는 그대로 전달, 빈 값은 null로 통일
export class TourCommonDto {
  @ApiProperty({ description: '관광지 고유 ID (외부 contentid)' })
  contentId!: string;

  @ApiProperty({
    description:
      '관광지 타입 ID (외부 contenttypeid) — detailIntro2 후속 호출에 필요',
  })
  contentTypeId!: string;

  @ApiProperty({ description: '관광지명 (외부 title)' })
  title!: string;

  @ApiProperty({
    description: '개요 (외부 overview, HTML 태그 포함 가능, 없으면 null)',
    nullable: true,
  })
  overview!: string | null;

  @ApiProperty({
    description:
      '홈페이지 URL (외부 homepage, HTML 앵커 태그 포함 가능, 없으면 null)',
    nullable: true,
  })
  homepage!: string | null;

  @ApiProperty({
    description: '주소 (외부 addr1, 없으면 null)',
    nullable: true,
  })
  addr!: string | null;

  @ApiProperty({
    description: '대표 이미지 URL (외부 firstimage, 없으면 null)',
    nullable: true,
  })
  firstImage!: string | null;
}

// detailIntro2 응답 DTO — contentTypeId마다 필드 구조가 달라 raw object로 통과
export class TourIntroDto {
  @ApiProperty({ description: '관광지 고유 ID (외부 contentid)' })
  contentId!: string;

  // 외부 detailIntro2는 contentTypeId별로 반환 필드가 다르므로 타입 고정 불가 — raw 전달
  @ApiProperty({
    description: '타입별 소개 정보 원본 객체 (contentTypeId에 따라 구조 상이)',
    type: Object,
  })
  raw!: Record<string, unknown>;
}
