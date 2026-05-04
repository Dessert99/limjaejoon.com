import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

// /tour/:contentId/intro 의 ?contentTypeId= 쿼리 전용 DTO
// KorService2 detailIntro2 호출 시 contentTypeId가 필수 — 누락 시 외부 API가 비정상 응답
export class TourIntroQueryDto {
  @ApiProperty({
    description:
      '관광지 타입 ID (숫자 1~10자리). detailCommon2 응답의 contentTypeId 필드 그대로 전달',
    example: '12',
  })
  @Matches(/^\d{1,10}$/, {
    message: 'contentTypeId는 숫자 1~10자리여야 합니다',
  })
  contentTypeId!: string;
}
