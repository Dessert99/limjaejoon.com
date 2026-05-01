import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

// :contentId path param 전용 DTO — 숫자 1~10자리만 허용 (외부 API 규격 + 인젝션 방지)
export class TourContentIdParamDto {
  @ApiProperty({
    description: '관광지 고유 ID (숫자 1~10자리)',
    example: '125508',
  })
  @Matches(/^\d{1,10}$/, { message: 'contentId는 숫자 1~10자리여야 합니다' })
  contentId!: string;
}
