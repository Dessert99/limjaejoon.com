import { ApiProperty } from '@nestjs/swagger';

import { TourItemDto } from './tour-item.dto';

// searchKeyword2 목록 응답의 페이지네이션 envelope
export class TourSearchResponseDto {
  @ApiProperty({ type: [TourItemDto], description: '검색 결과 목록' })
  items!: TourItemDto[];

  @ApiProperty({ description: '현재 페이지 번호' })
  page!: number;

  @ApiProperty({
    description: '다음 페이지 존재 여부 (pageNo * numOfRows < totalCount)',
  })
  hasMore!: boolean;
}
