// /tour/:contentId/* 라우트의 path 변수 검증 — 숫자 1~10자리만 허용해 외부 API 규격 준수 + URL 인젝션 차단
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class TourContentIdParamDto {
  @ApiProperty({
    description: '관광지 고유 ID (숫자 1~10자리)',
    example: '125508',
  })
  @Matches(/^\d{1,10}$/, { message: 'contentId는 숫자 1~10자리여야 합니다' })
  contentId!: string;
}
