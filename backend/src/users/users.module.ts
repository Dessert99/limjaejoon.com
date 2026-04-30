import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersService } from './users.service';

// UsersService를 AuthModule에서 주입받을 수 있도록 export
@Module({
  imports: [TypeOrmModule.forFeature([User])], // User 리포지토리를 DI 컨테이너에 등록
  providers: [UsersService],
  exports: [UsersService], // AuthModule이 UsersService를 import해서 쓸 수 있게 공개
})
export class UsersModule {}
