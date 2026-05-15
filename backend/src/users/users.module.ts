// 사용자 도메인 모듈 — UsersService를 AuthService에 주입할 수 있도록 export 한다 (Auth는 가입·조회 시 이 서비스를 통해서만 users 테이블을 만진다)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  // forFeature([User]) — 이 모듈 스코프에 Repository<User>를 등록. 다른 모듈은 UsersService를 통해 우회 접근
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // exports — AuthModule이 UsersModule을 import하면 UsersService를 주입받을 수 있게 됨
  exports: [UsersService],
})
export class UsersModule {}
