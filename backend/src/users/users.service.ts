import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

// 사용자 레코드 생성에 필요한 최소 데이터 — raw 비밀번호 대신 해시만 받는다
interface CreateUserParams {
  email: string;
  passwordHash: string;
}

// users 테이블의 읽기/쓰기 단일 창구 — auth.service 가 이 서비스만 의존한다
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  // 이메일로 사용자 조회 — 미존재 시 null 반환(예외 대신 null로 존재 여부를 서비스 레이어에서 처리)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // id로 사용자 조회 — me 엔드포인트용
  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  // 새 사용자 삽입 — 중복 이메일 시 PostgreSQL unique 위반 에러가 호출자로 전파된다
  async create(params: CreateUserParams): Promise<User> {
    const user = this.userRepo.create({
      email: params.email,
      passwordHash: params.passwordHash,
    });
    return this.userRepo.save(user);
  }
}
