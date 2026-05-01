import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [
    // Wishlist Repository를 DI에 등록
    TypeOrmModule.forFeature([Wishlist]),
    // JwtAuthGuard 사용을 위해 AuthModule import — AuthModule이 가드를 export함
    AuthModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
