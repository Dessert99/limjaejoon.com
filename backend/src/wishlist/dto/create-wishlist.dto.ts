import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// 위시리스트 추가 요청 DTO — ValidationPipe(whitelist+transform)가 전역 적용되므로 class-validator 데코레이터로만 검증
export class CreateWishlistDto {
  @ApiProperty({
    description: '관광지 contentId — 외부 KorService2 식별자',
    example: '125508',
  })
  // 숫자 1~10자리만 허용 — SQL injection 및 임의 문자열 저장 방지
  @Matches(/^\d{1,10}$/, { message: 'contentId는 숫자 1~10자리여야 합니다' })
  contentId!: string;

  @ApiProperty({ description: '관광지명 스냅샷 (1~200자)' })
  @IsString()
  @MaxLength(200, { message: 'title은 200자 이하여야 합니다' })
  title!: string;

  @ApiPropertyOptional({
    description: '대표 이미지 URL — http/https 스킴만 허용 (XSS 방어)',
  })
  @IsOptional()
  // http/https 프로토콜만 허용 — javascript: 등 XSS 벡터 차단
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'firstImage는 http/https URL이어야 합니다' }
  )
  firstImage?: string;

  @ApiPropertyOptional({ description: '주소 스냅샷 (선택, 300자 이하)' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'addr은 300자 이하여야 합니다' })
  addr?: string;
}
