// 위시리스트 도메인 모듈 — 본인 항목 CRUD. AuthModule을 import해 컨트롤러의 JwtAuthGuard가 작동하게 한다
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [
    // forFeature([Wishlist]) — 이 모듈 스코프에 Repository<Wishlist> 등록
    TypeOrmModule.forFeature([Wishlist]),
    // AuthModule 가드 + JwtModule을 export하므로 import만 하면 @UseGuards(JwtAuthGuard)가 동작
    AuthModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
