// /tour/search 응답 envelope — 검색 결과 배열 + 무한 스크롤 종료 신호용 hasMore. 프론트 useInfiniteQuery의 getNextPageParam이 이 hasMore를 보고 다음 페이지 요청 여부 결정
import { ApiProperty } from '@nestjs/swagger';

import { TourItemDto } from './tour-item.dto';

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
