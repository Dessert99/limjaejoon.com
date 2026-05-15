// /tour/search 쿼리 검증 — keyword 길이·page 범위를 컨트롤러 진입 전에 거른다. ValidationPipe(transform:true)가 query string을 number로 캐스팅
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class TourSearchQueryDto {
  @ApiProperty({ description: '검색 키워드 (1~50자)', example: '경복궁' })
  @IsString()
  @MinLength(1, { message: '키워드는 1자 이상이어야 합니다' })
  @MaxLength(50, {
    message: '키워드는 50자 이하이어야 합니다 (외부 API URL 길이 제한)',
  })
  keyword!: string;

  @ApiPropertyOptional({
    description: '페이지 번호 (1~100, 기본 1)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number) // 쿼리 문자열 → number 변환 (transform 옵션 의존)
  @IsInt({ message: '페이지 번호는 정수여야 합니다' })
  @Min(1, { message: '페이지 번호는 1 이상이어야 합니다' })
  @Max(100, {
    message: '페이지 번호는 100 이하여야 합니다 (검색 무한 진입 방지)',
  })
  page?: number = 1;
}
