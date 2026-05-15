// users 테이블의 읽기·쓰기 단일 창구 — AuthService가 직접 Repository를 만지지 않고 이 서비스만 통해 SQL 의존을 캡슐화
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

// 사용자 생성 시 필요한 최소 정보 — bcrypt 해시는 외부에서 만들어 넣는다(이 서비스는 해시 모듈을 모름)
interface CreateUserParams {
  email: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  // @InjectRepository(User) — UsersModule.forFeature([User])가 만든 Repository<User>를 컨테이너에서 주입
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  // findByEmail(email) — 로그인 시 호출. 미존재면 null 반환 — 호출자가 401 변환 책임
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // findById(id) — me·refresh가 사용. AccessTokenGuard/RefreshTokenGuard 통과 후 sub 클레임으로 조회
  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  // create(params) — 새 사용자 INSERT. 중복 이메일이면 PostgreSQL unique 위반(SQLSTATE 23505)이 호출자에 전파됨
  async create(params: CreateUserParams): Promise<User> {
    // create는 메모리 객체 생성, save가 실제 INSERT — TypeORM 표준 패턴
    const user = this.userRepo.create({
      email: params.email,
      passwordHash: params.passwordHash,
    });
    return this.userRepo.save(user);
  }
}
