// 관광지 라우트 컨트롤러 — 모든 엔드포인트가 JwtAuthGuard로 보호되며, 외부 KorService2 호출은 TourService에 위임하고 여기선 HTTP/검증만 담당
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TourContentIdParamDto } from './dto/tour-content-id-param.dto';
import { TourIntroQueryDto } from './dto/tour-intro-query.dto';
import { TourSearchQueryDto } from './dto/tour-search-query.dto';
import { TourCommonDto, TourIntroDto } from './dto/tour-detail.dto';
import { TourSearchResponseDto } from './dto/tour-search-response.dto';
import { TourService } from './tour.service';

// @UseGuards를 클래스 레벨에 — 메서드마다 붙이지 않아도 모든 라우트에 적용. 미인증 요청은 컨트롤러 진입 전 401
@ApiTags('tour')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // search(query) — keyword/page를 받아 외부 검색 후 페이지네이션 응답으로 반환
  @Get('search')
  @ApiOperation({ summary: '키워드 관광지 검색 (KorService2 searchKeyword2)' })
  @ApiResponse({ status: 200, type: TourSearchResponseDto })
  @ApiResponse({ status: 400, description: '입력값 검증 실패' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 503, description: '외부 관광 API 호출 실패' })
  async search(
    // @Query() — req.query를 DTO로 변환·검증. ValidationPipe transform이 page를 string→number로 캐스팅
    @Query() query: TourSearchQueryDto
  ): Promise<TourSearchResponseDto> {
    // page 누락 시 기본 1 — DTO에서 default 못 주는 경우 핸들러에서 보정 (Query string은 항상 string이라 transform 분기가 까다로움)
    return this.tourService.searchByKeyword(query.keyword, query.page ?? 1);
  }

  // getCommon(param) — contentId로 공통 상세 조회. 응답에 contentTypeId가 포함돼 클라가 후속 intro 호출 가능
  @Get(':contentId/common')
  @ApiOperation({
    summary: '관광지 공통 상세 정보 (KorService2 detailCommon2)',
  })
  @ApiResponse({ status: 200, type: TourCommonDto })
  @ApiResponse({ status: 400, description: '잘못된 contentId 형식' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 503, description: '외부 관광 API 호출 실패' })
  async getCommon(
    // @Param() — URL path 변수를 DTO로 변환. contentId 형식 검증(숫자 1~10자리)이 여기서 일어남
    @Param() param: TourContentIdParamDto
  ): Promise<TourCommonDto> {
    return this.tourService.fetchCommon(param.contentId);
  }

  // getIntro(param, query) — contentId + contentTypeId로 소개 정보 조회. detailIntro2가 두 값 모두 요구
  @Get(':contentId/intro')
  @ApiOperation({
    summary:
      '관광지 소개 정보 (KorService2 detailIntro2, contentTypeId별 구조 상이)',
  })
  @ApiResponse({ status: 200, type: TourIntroDto })
  @ApiResponse({
    status: 400,
    description: '잘못된 contentId/contentTypeId 형식',
  })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 503, description: '외부 관광 API 호출 실패' })
  async getIntro(
    @Param() param: TourContentIdParamDto,
    @Query() query: TourIntroQueryDto
  ): Promise<TourIntroDto> {
    return this.tourService.fetchIntro(param.contentId, query.contentTypeId);
  }
}
