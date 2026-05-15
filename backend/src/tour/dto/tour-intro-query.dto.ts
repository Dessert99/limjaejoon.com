// /tour/:contentId/intro의 ?contentTypeId= 쿼리 검증 — detailIntro2가 contentTypeId 없으면 비정상 응답을 반환해 사전에 형식만 막아둔다
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

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
