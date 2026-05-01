import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TourContentIdParamDto } from './dto/tour-content-id-param.dto';
import { TourSearchQueryDto } from './dto/tour-search-query.dto';
import { TourCommonDto, TourIntroDto } from './dto/tour-detail.dto';
import { TourSearchResponseDto } from './dto/tour-search-response.dto';
import { TourService } from './tour.service';

// 컨트롤러 단위 JwtAuthGuard — 모든 tour 엔드포인트는 인증 필수 (ADR 0001)
@ApiTags('tour')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // 키워드로 관광지 검색 — 페이지네이션 포함
  @Get('search')
  @ApiOperation({ summary: '키워드 관광지 검색 (KorService2 searchKeyword2)' })
  @ApiResponse({ status: 200, type: TourSearchResponseDto })
  @ApiResponse({ status: 400, description: '입력값 검증 실패' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 503, description: '외부 관광 API 호출 실패' })
  async search(
    @Query() query: TourSearchQueryDto
  ): Promise<TourSearchResponseDto> {
    // page 기본값 1 — TourSearchQueryDto에서 선언, ValidationPipe transform이 적용
    return this.tourService.searchByKeyword(query.keyword, query.page ?? 1);
  }

  // 관광지 공통 상세 정보 조회
  @Get(':contentId/common')
  @ApiOperation({
    summary: '관광지 공통 상세 정보 (KorService2 detailCommon2)',
  })
  @ApiResponse({ status: 200, type: TourCommonDto })
  @ApiResponse({ status: 400, description: '잘못된 contentId 형식' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 503, description: '외부 관광 API 호출 실패' })
  async getCommon(
    @Param() param: TourContentIdParamDto
  ): Promise<TourCommonDto> {
    return this.tourService.fetchCommon(param.contentId);
  }

  // 관광지 소개 정보 조회 — contentTypeId별 raw 반환
  @Get(':contentId/intro')
  @ApiOperation({
    summary:
      '관광지 소개 정보 (KorService2 detailIntro2, contentTypeId별 구조 상이)',
  })
  @ApiResponse({ status: 200, type: TourIntroDto })
  @ApiResponse({ status: 400, description: '잘못된 contentId 형식' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 503, description: '외부 관광 API 호출 실패' })
  async getIntro(@Param() param: TourContentIdParamDto): Promise<TourIntroDto> {
    return this.tourService.fetchIntro(param.contentId);
  }
}
