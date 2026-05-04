// 위시리스트 라우트 컨트롤러 — 모든 라우트가 AccessTokenGuard로 보호 + @CurrentUser로만 userId 주입(IDOR 방어), DB 쓰기·검증 로직은 WishlistService에 위임
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistItemDto } from './dto/wishlist-item.dto';
import { WishlistService } from './wishlist.service';

// 클래스 레벨 가드 — 본인 항목 CRUD라 모든 라우트가 인증 필수. AccessTokenGuard는 AuthGuard('jwt')로 access 전략을 트리거
@ApiTags('wishlist')
@ApiBearerAuth('access_token')
@UseGuards(AccessTokenGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  // list(userId) — 인증된 사용자의 위시리스트 전체 반환. @CurrentUser는 req.body가 아닌 토큰에서만 userId를 꺼내 IDOR 차단
  @Get()
  @ApiOperation({ summary: '본인 위시리스트 목록 조회' })
  @ApiResponse({ status: 200, type: [WishlistItemDto] })
  @ApiResponse({ status: 401, description: '인증 필요' })
  list(@CurrentUser() userId: string): Promise<WishlistItemDto[]> {
    return this.service.list(userId);
  }

  // add(userId, dto) — 위시리스트에 항목 추가. 중복(userId+contentId) 시 service가 409로 변환
  @Post()
  @ApiOperation({ summary: '위시리스트에 관광지 추가' })
  @ApiResponse({ status: 201, type: WishlistItemDto })
  @ApiResponse({ status: 400, description: '입력값 검증 실패' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 409, description: '이미 위시리스트에 있음' })
  add(
    @CurrentUser() userId: string,
    @Body() dto: CreateWishlistDto
  ): Promise<WishlistItemDto> {
    return this.service.add(userId, dto);
  }

  // remove(userId, id) — 본인 소유 항목만 삭제. 타인 항목·미존재 모두 404로 통일해 ID 존재 여부 누설 차단
  @Delete(':id')
  // @HttpCode(204) — 본문 없는 성공 응답. DELETE의 멱등 시맨틱과 일치
  @HttpCode(204)
  @ApiOperation({ summary: '위시리스트 항목 삭제 (본인 항목만)' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @ApiResponse({ status: 400, description: '잘못된 UUID' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({
    status: 404,
    description: '항목을 찾을 수 없음 (또는 권한 없음)',
  })
  remove(
    @CurrentUser() userId: string,
    // ParseUUIDPipe — path id가 UUID 형식이 아니면 즉시 400. service까지 도달 전에 잘못된 입력 차단
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<void> {
    return this.service.remove(userId, id);
  }
}
