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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistItemDto } from './dto/wishlist-item.dto';
import { WishlistService } from './wishlist.service';

// 모든 엔드포인트에 인증 필수 — wishlist는 본인만 접근 (ADR 0001)
@ApiTags('wishlist')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  // GET /api/wishlist — 본인 위시리스트 목록
  @Get()
  @ApiOperation({ summary: '본인 위시리스트 목록 조회' })
  @ApiResponse({ status: 200, type: [WishlistItemDto] })
  @ApiResponse({ status: 401, description: '인증 필요' })
  list(@CurrentUser() userId: string): Promise<WishlistItemDto[]> {
    return this.service.list(userId);
  }

  // POST /api/wishlist — 본인 위시리스트에 항목 추가
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

  // DELETE /api/wishlist/:id — 본인 항목만 삭제 (id가 본인 소유 아니면 404)
  @Delete(':id')
  @HttpCode(204) // 본문 없는 성공 응답 — 멱등 삭제 시맨틱
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
    // ParseUUIDPipe — path id가 UUID 형식이 아니면 ValidationPipe 도달 전 400 (IDOR + 잘못된 입력 동시 차단)
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<void> {
    return this.service.remove(userId, id);
  }
}
